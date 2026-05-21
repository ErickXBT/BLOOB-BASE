import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { ethers } from "ethers";

// ─── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "bloob_encrypted_wallet";
const BASE_RPC = "https://mainnet.base.org";

export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
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
];

const SWAP_ROUTER_ABI = [
  "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)",
];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TokenBalance {
  symbol: string;
  balance: string;      // human-readable
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

interface WalletContextValue {
  address: string | null;
  isLocked: boolean;
  hasWallet: boolean;
  balances: TokenBalance[];
  txHistory: TxRecord[];
  isLoadingBalances: boolean;
  provider: ethers.JsonRpcProvider;
  // onboarding
  createWallet: (password: string) => Promise<string>; // returns mnemonic
  importFromMnemonic: (mnemonic: string, password: string) => Promise<void>;
  importFromPrivateKey: (key: string, password: string) => Promise<void>;
  unlock: (password: string) => Promise<void>;
  lock: () => void;
  deleteWallet: () => void;
  // wallet ops
  refreshBalances: () => Promise<void>;
  sendETH: (to: string, amountEth: string) => Promise<ethers.TransactionResponse>;
  sendUSDC: (to: string, amountUsdc: string) => Promise<ethers.TransactionResponse>;
  getSwapQuote: (fromToken: "ETH" | "USDC", toToken: "ETH" | "USDC", amount: string) => Promise<string>;
  executeSwap: (fromToken: "ETH" | "USDC", toToken: "ETH" | "USDC", amountIn: string, minOut: string) => Promise<ethers.TransactionResponse>;
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

export function WalletProvider({ children }: { children: ReactNode }) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC, { chainId: 8453, name: "base" });

  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState(() => !!localStorage.getItem(STORAGE_KEY));
  const [isLocked, setIsLocked] = useState(true);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [txHistory, setTxHistory] = useState<TxRecord[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  // ── helpers ────────────────────────────────────────────────────────────────

  const storeWallet = async (w: ethers.Wallet, password: string) => {
    const encrypted = await w.encrypt(password);
    localStorage.setItem(STORAGE_KEY, encrypted);
    setHasWallet(true);
  };

  const activateWallet = (w: ethers.Wallet) => {
    const connected = w.connect(provider);
    setWallet(connected as ethers.Wallet);
    setAddress(connected.address);
    setIsLocked(false);
  };

  // ── onboarding ─────────────────────────────────────────────────────────────

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

  // ── balances ───────────────────────────────────────────────────────────────

  const refreshBalances = useCallback(async () => {
    if (!address) return;
    setIsLoadingBalances(true);
    try {
      const [ethRaw, usdcContract] = [
        await provider.getBalance(address),
        new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider),
      ];
      const usdcRaw: bigint = await usdcContract.balanceOf(address);

      setBalances([
        { symbol: "ETH", balance: (+ethers.formatEther(ethRaw)).toFixed(6), raw: ethRaw },
        { symbol: "USDC", balance: (+ethers.formatUnits(usdcRaw, 6)).toFixed(2), raw: usdcRaw },
      ]);

      // TX history via Basescan (no key, limited to 25 txs)
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

  // ── send ───────────────────────────────────────────────────────────────────

  const sendETH = useCallback(async (to: string, amountEth: string): Promise<ethers.TransactionResponse> => {
    if (!wallet) throw new Error("Wallet locked");
    const tx = await wallet.sendTransaction({ to, value: ethers.parseEther(amountEth) });
    return tx;
  }, [wallet]);

  const sendUSDC = useCallback(async (to: string, amountUsdc: string): Promise<ethers.TransactionResponse> => {
    if (!wallet) throw new Error("Wallet locked");
    const contract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
    const tx = await contract.transfer(to, ethers.parseUnits(amountUsdc, 6));
    return tx;
  }, [wallet]);

  // ── swap ───────────────────────────────────────────────────────────────────

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
      tokenIn,
      tokenOut,
      amountIn,
      fee: 500,
      sqrtPriceLimitX96: 0n,
    });

    return isEthIn
      ? ethers.formatUnits(amountOut, 6)
      : ethers.formatEther(amountOut);
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

    const params = {
      tokenIn,
      tokenOut,
      fee: 500,
      recipient: wallet.address,
      amountIn: amtIn,
      amountOutMinimum: amtOutMin,
      sqrtPriceLimitX96: 0n,
    };

    return router.exactInputSingle(params, { value: isEthIn ? amtIn : 0n });
  }, [wallet]);

  // ── export ─────────────────────────────────────────────────────────────────

  const exportPrivateKey = useCallback(() => wallet?.privateKey ?? null, [wallet]);
  const exportMnemonic = useCallback(() => wallet?.mnemonic?.phrase ?? null, [wallet]);

  return (
    <WalletContext.Provider value={{
      address, isLocked, hasWallet, balances, txHistory, isLoadingBalances, provider,
      createWallet, importFromMnemonic, importFromPrivateKey,
      unlock, lock, deleteWallet,
      refreshBalances,
      sendETH, sendUSDC,
      getSwapQuote, executeSwap,
      exportPrivateKey, exportMnemonic,
    }}>
      {children}
    </WalletContext.Provider>
  );
}
