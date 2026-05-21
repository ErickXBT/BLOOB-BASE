import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import { encodePath, WETH_ADDRESS } from "@/lib/tokens";

// ─── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "bloob_encrypted_wallet";
const BASE_RPC = "https://mainnet.base.org";

export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const QUOTER_V2_ADDRESS = "0x3d4e44Eb1374240CE5F1B136Cf395A8c7e7A4A6a";
const SWAP_ROUTER_ADDRESS = "0x2626664c2603336E57B271c5C0b26F421741e481";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const QUOTER_V2_ABI = [
  "function quoteExactInputSingle(tuple(address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)",
  "function quoteExactInput(bytes path, uint256 amountIn) returns (uint256 amountOut, uint160[] sqrtPriceX96AfterList, uint32[] initializedTicksCrossedList, uint256 gasEstimate)",
];

const SWAP_ROUTER_ABI = [
  "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)",
  "function exactInput(tuple(bytes path, address recipient, uint256 amountIn, uint256 amountOutMinimum) params) payable returns (uint256 amountOut)",
  "function unwrapWETH9(uint256 amountMinimum, address recipient) payable",
  "function multicall(bytes[] data) payable returns (bytes[] results)",
];

const FEE_TIERS = [500, 3000, 10000];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TokenBalance {
  symbol: string;
  balance: string;
  raw: bigint;
  usdValue?: string;
}

export interface TxRecord {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: string;
}

export interface QuoteResult {
  amountOut: string;
  amountOutRaw: bigint;
  fee: number;
  hops: number;
  route: string;
}

interface WalletContextValue {
  address: string | null;
  isLocked: boolean;
  hasWallet: boolean;
  balances: TokenBalance[];
  txHistory: TxRecord[];
  isLoadingBalances: boolean;
  provider: ethers.JsonRpcProvider;
  createWallet: (password: string) => Promise<string>;
  importFromMnemonic: (mnemonic: string, password: string) => Promise<void>;
  importFromPrivateKey: (key: string, password: string) => Promise<void>;
  unlock: (password: string) => Promise<void>;
  lock: () => void;
  deleteWallet: () => void;
  refreshBalances: () => Promise<void>;
  sendETH: (to: string, amountEth: string) => Promise<ethers.TransactionResponse>;
  sendUSDC: (to: string, amountUsdc: string) => Promise<ethers.TransactionResponse>;
  // Legacy ETH↔USDC only
  getSwapQuote: (fromToken: "ETH" | "USDC", toToken: "ETH" | "USDC", amount: string) => Promise<string>;
  executeSwap: (fromToken: "ETH" | "USDC", toToken: "ETH" | "USDC", amountIn: string, minOut: string) => Promise<ethers.TransactionResponse>;
  // Generic any-token swap
  quoteAnySwap: (tokenIn: string, tokenOut: string, decimalsIn: number, decimalsOut: number, amountIn: string) => Promise<QuoteResult>;
  executeAnySwap: (tokenIn: string, tokenOut: string, decimalsIn: number, amountIn: string, amountOutMin: bigint, fee: number, hops: number) => Promise<ethers.TransactionResponse>;
  exportPrivateKey: () => string | null;
  exportMnemonic: () => string | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const WalletContext = createContext<WalletContextValue | null>(null);

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}

// Module-level provider to avoid re-creation on render
const provider = new ethers.JsonRpcProvider(BASE_RPC, { chainId: 8453, name: "base" });

type AnyWallet = ethers.Wallet | ethers.HDNodeWallet;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<AnyWallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState(() => !!localStorage.getItem(STORAGE_KEY));
  const [isLocked, setIsLocked] = useState(true);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [txHistory, setTxHistory] = useState<TxRecord[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  const storeWallet = async (w: AnyWallet, password: string) => {
    const encrypted = await w.encrypt(password);
    localStorage.setItem(STORAGE_KEY, encrypted);
    setHasWallet(true);
  };

  const activateWallet = (w: AnyWallet) => {
    const connected = w.connect(provider) as AnyWallet;
    setWallet(connected);
    setAddress(connected.address);
    setIsLocked(false);
  };

  const createWallet = useCallback(async (password: string): Promise<string> => {
    const w = ethers.Wallet.createRandom();
    await storeWallet(w, password);
    activateWallet(w);
    return w.mnemonic?.phrase ?? "";
  }, []);

  const importFromMnemonic = useCallback(async (mnemonic: string, password: string) => {
    const w = ethers.Wallet.fromPhrase(mnemonic.trim());
    await storeWallet(w, password);
    activateWallet(w);
  }, []);

  const importFromPrivateKey = useCallback(async (key: string, password: string) => {
    const w = new ethers.Wallet(key.trim());
    await storeWallet(w, password);
    activateWallet(w);
  }, []);

  const unlock = useCallback(async (password: string) => {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) throw new Error("No wallet found");
    const w = await ethers.Wallet.fromEncryptedJson(encrypted, password);
    activateWallet(w as ethers.Wallet);
  }, []);

  const lock = useCallback(() => {
    setWallet(null);
    setAddress(null);
    setIsLocked(true);
    setBalances([]);
    setTxHistory([]);
  }, []);

  const deleteWallet = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    lock();
    setHasWallet(false);
  }, [lock]);

  const refreshBalances = useCallback(async () => {
    if (!address) return;
    setIsLoadingBalances(true);
    try {
      const ethRaw = await provider.getBalance(address);
      const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
      const usdcRaw: bigint = await usdcContract.balanceOf(address);

      setBalances([
        { symbol: "ETH", balance: (+ethers.formatEther(ethRaw)).toFixed(6), raw: ethRaw },
        { symbol: "USDC", balance: (+ethers.formatUnits(usdcRaw, 6)).toFixed(2), raw: usdcRaw },
      ]);

      const res = await fetch(
        `https://api.basescan.org/api?module=account&action=txlist&address=${address}&sort=desc&page=1&offset=20`
      ).catch(() => null);
      if (res?.ok) {
        const data = await res.json();
        if (data.result && Array.isArray(data.result)) {
          setTxHistory(data.result.slice(0, 15));
        }
      }
    } finally {
      setIsLoadingBalances(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) refreshBalances();
  }, [address]);

  const sendETH = useCallback(async (to: string, amountEth: string): Promise<ethers.TransactionResponse> => {
    if (!wallet) throw new Error("Wallet locked");
    return wallet.sendTransaction({ to, value: ethers.parseEther(amountEth) });
  }, [wallet]);

  const sendUSDC = useCallback(async (to: string, amountUsdc: string): Promise<ethers.TransactionResponse> => {
    if (!wallet) throw new Error("Wallet locked");
    const contract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
    return contract.transfer(to, ethers.parseUnits(amountUsdc, 6));
  }, [wallet]);

  // ── Legacy ETH↔USDC swap ───────────────────────────────────────────────────
  const getSwapQuote = useCallback(async (
    fromToken: "ETH" | "USDC",
    toToken: "ETH" | "USDC",
    amount: string
  ): Promise<string> => {
    const quoter = new ethers.Contract(QUOTER_V2_ADDRESS, QUOTER_V2_ABI, provider);
    const isEthIn = fromToken === "ETH";
    const amountIn = isEthIn ? ethers.parseEther(amount) : ethers.parseUnits(amount, 6);
    const tokenIn = isEthIn ? WETH_ADDRESS : USDC_ADDRESS;
    const tokenOut = isEthIn ? USDC_ADDRESS : WETH_ADDRESS;
    const [amountOut] = await quoter.quoteExactInputSingle.staticCall({
      tokenIn, tokenOut, amountIn, fee: 500, sqrtPriceLimitX96: 0n,
    });
    return isEthIn ? ethers.formatUnits(amountOut, 6) : ethers.formatEther(amountOut);
  }, []);

  const executeSwap = useCallback(async (
    fromToken: "ETH" | "USDC",
    toToken: "ETH" | "USDC",
    amountIn: string,
    minOut: string
  ): Promise<ethers.TransactionResponse> => {
    if (!wallet) throw new Error("Wallet locked");
    const router = new ethers.Contract(SWAP_ROUTER_ADDRESS, SWAP_ROUTER_ABI, wallet);
    const isEthIn = fromToken === "ETH";
    const amtIn = isEthIn ? ethers.parseEther(amountIn) : ethers.parseUnits(amountIn, 6);
    const amtOutMin = isEthIn ? ethers.parseUnits(minOut, 6) : ethers.parseEther(minOut);
    const tokenIn = isEthIn ? WETH_ADDRESS : USDC_ADDRESS;
    const tokenOut = isEthIn ? USDC_ADDRESS : WETH_ADDRESS;

    if (!isEthIn) {
      const erc20 = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
      const allowance: bigint = await erc20.allowance(wallet.address, SWAP_ROUTER_ADDRESS);
      if (allowance < amtIn) {
        const approveTx = await erc20.approve(SWAP_ROUTER_ADDRESS, amtIn);
        await approveTx.wait();
      }
    }
    return router.exactInputSingle({
      tokenIn, tokenOut, fee: 500, recipient: wallet.address,
      amountIn: amtIn, amountOutMinimum: amtOutMin, sqrtPriceLimitX96: 0n,
    }, { value: isEthIn ? amtIn : 0n });
  }, [wallet]);

  // ── Generic any-token swap ─────────────────────────────────────────────────
  const quoteAnySwap = useCallback(async (
    tokenIn: string,  // "native" or ERC20 address
    tokenOut: string, // "native" or ERC20 address
    decimalsIn: number,
    decimalsOut: number,
    amountIn: string
  ): Promise<QuoteResult> => {
    const quoter = new ethers.Contract(QUOTER_V2_ADDRESS, QUOTER_V2_ABI, provider);
    const effIn  = tokenIn  === "native" ? WETH_ADDRESS : tokenIn;
    const effOut = tokenOut === "native" ? WETH_ADDRESS : tokenOut;
    const amtIn  = ethers.parseUnits(amountIn, decimalsIn);

    // 1. Try single-hop
    let bestOut = 0n;
    let bestFee = 3000;
    for (const fee of FEE_TIERS) {
      try {
        const [out] = await quoter.quoteExactInputSingle.staticCall({
          tokenIn: effIn, tokenOut: effOut, amountIn: amtIn, fee, sqrtPriceLimitX96: 0n,
        });
        if ((out as bigint) > bestOut) { bestOut = out as bigint; bestFee = fee; }
      } catch { /* pool doesn't exist */ }
    }

    if (bestOut > 0n) {
      return {
        amountOut: ethers.formatUnits(bestOut, decimalsOut),
        amountOutRaw: bestOut,
        fee: bestFee,
        hops: 1,
        route: `Uniswap V3 (${bestFee / 10000}% fee)`,
      };
    }

    // 2. Try two-hop through WETH
    if (effIn !== WETH_ADDRESS && effOut !== WETH_ADDRESS) {
      for (const feeA of FEE_TIERS) {
        for (const feeB of FEE_TIERS) {
          try {
            const path = encodePath([effIn, WETH_ADDRESS, effOut], [feeA, feeB]);
            const [out] = await quoter.quoteExactInput.staticCall(path, amtIn);
            if ((out as bigint) > 0n) {
              return {
                amountOut: ethers.formatUnits(out as bigint, decimalsOut),
                amountOutRaw: out as bigint,
                fee: feeA,
                hops: 2,
                route: `Uniswap V3 (2-hop via WETH)`,
              };
            }
          } catch { /* no path */ }
        }
      }
    }

    throw new Error("No liquidity route found for this pair");
  }, []);

  const executeAnySwap = useCallback(async (
    tokenIn: string,
    tokenOut: string,
    decimalsIn: number,
    amountIn: string,
    amountOutMin: bigint,
    fee: number,
    hops: number
  ): Promise<ethers.TransactionResponse> => {
    if (!wallet) throw new Error("Wallet locked");
    const router = new ethers.Contract(SWAP_ROUTER_ADDRESS, SWAP_ROUTER_ABI, wallet);
    const effIn  = tokenIn  === "native" ? WETH_ADDRESS : tokenIn;
    const effOut = tokenOut === "native" ? WETH_ADDRESS : tokenOut;
    const amtIn  = ethers.parseUnits(amountIn, decimalsIn);

    // Approve ERC20 if needed
    if (tokenIn !== "native") {
      const erc20 = new ethers.Contract(tokenIn, ERC20_ABI, wallet);
      const allowance: bigint = await erc20.allowance(wallet.address, SWAP_ROUTER_ADDRESS);
      if (allowance < amtIn) {
        const approveTx = await erc20.approve(SWAP_ROUTER_ADDRESS, amtIn * 2n);
        await approveTx.wait();
      }
    }

    const isEthIn  = tokenIn  === "native";
    const isEthOut = tokenOut === "native";

    // Recipient: if output is ETH, tokens go to router first for unwrapping
    const recipient = isEthOut ? SWAP_ROUTER_ADDRESS : wallet.address;

    if (hops === 1) {
      if (isEthOut) {
        // Single-hop, output ETH: swap→WETH then unwrap
        const swapCalldata = router.interface.encodeFunctionData("exactInputSingle", [{
          tokenIn: effIn, tokenOut: effOut, fee,
          recipient, amountIn: amtIn, amountOutMinimum: amountOutMin, sqrtPriceLimitX96: 0n,
        }]);
        const unwrapCalldata = router.interface.encodeFunctionData("unwrapWETH9", [
          amountOutMin, wallet.address,
        ]);
        return router.multicall([swapCalldata, unwrapCalldata], { value: isEthIn ? amtIn : 0n });
      }
      return router.exactInputSingle({
        tokenIn: effIn, tokenOut: effOut, fee,
        recipient, amountIn: amtIn, amountOutMinimum: amountOutMin, sqrtPriceLimitX96: 0n,
      }, { value: isEthIn ? amtIn : 0n });
    }

    // Two-hop
    const path = encodePath([effIn, WETH_ADDRESS, effOut], [fee, fee]);
    if (isEthOut) {
      const swapCalldata = router.interface.encodeFunctionData("exactInput", [{
        path, recipient, amountIn: amtIn, amountOutMinimum: amountOutMin,
      }]);
      const unwrapCalldata = router.interface.encodeFunctionData("unwrapWETH9", [
        amountOutMin, wallet.address,
      ]);
      return router.multicall([swapCalldata, unwrapCalldata], { value: isEthIn ? amtIn : 0n });
    }
    return router.exactInput({
      path, recipient: wallet.address, amountIn: amtIn, amountOutMinimum: amountOutMin,
    }, { value: isEthIn ? amtIn : 0n });
  }, [wallet]);

  const exportPrivateKey = useCallback(() => wallet?.privateKey ?? null, [wallet]);
  const exportMnemonic   = useCallback((): string | null => {
    if (!wallet) return null;
    if (wallet instanceof ethers.HDNodeWallet) return wallet.mnemonic?.phrase ?? null;
    return (wallet as any).mnemonic?.phrase ?? null;
  }, [wallet]);

  return (
    <WalletContext.Provider value={{
      address, isLocked, hasWallet, balances, txHistory, isLoadingBalances, provider,
      createWallet, importFromMnemonic, importFromPrivateKey,
      unlock, lock, deleteWallet,
      refreshBalances,
      sendETH, sendUSDC,
      getSwapQuote, executeSwap,
      quoteAnySwap, executeAnySwap,
      exportPrivateKey, exportMnemonic,
    }}>
      {children}
    </WalletContext.Provider>
  );
}
