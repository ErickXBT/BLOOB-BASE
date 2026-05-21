import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Loader2, Check, ExternalLink, RefreshCw } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

type Token = "ETH" | "USDC";

export default function SwapTab() {
  const { getSwapQuote, executeSwap, balances } = useWallet();
  const [fromToken, setFromToken] = useState<Token>("ETH");
  const [toToken, setToToken] = useState<Token>("USDC");
  const [amountIn, setAmountIn] = useState("");
  const [quote, setQuote] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fromBalance = balances.find(b => b.symbol === fromToken)?.balance ?? "0";

  const flipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmountIn("");
    setQuote(null);
    setError("");
  };

  const fetchQuote = useCallback(async (amt: string) => {
    if (!amt || parseFloat(amt) <= 0) { setQuote(null); return; }
    setQuoteLoading(true);
    setError("");
    try {
      const q = await getSwapQuote(fromToken, toToken, amt);
      setQuote(parseFloat(q).toFixed(fromToken === "ETH" ? 2 : 6));
    } catch (e: any) {
      setError("No liquidity for this pair/amount");
      setQuote(null);
    } finally {
      setQuoteLoading(false);
    }
  }, [fromToken, toToken, getSwapQuote]);

  const handleSwap = async () => {
    if (!amountIn || !quote) return;
    setSwapLoading(true);
    setError("");
    setTxHash(null);
    try {
      // 1% slippage tolerance
      const minOut = (parseFloat(quote) * 0.99).toFixed(fromToken === "ETH" ? 2 : 8);
      const tx = await executeSwap(fromToken, toToken, amountIn, minOut);
      setTxHash(tx.hash);
      setAmountIn(""); setQuote(null);
    } catch (e: any) {
      setError(e?.reason ?? e?.message ?? "Swap failed");
    } finally {
      setSwapLoading(false);
    }
  };

  const tokenColors: Record<Token, string> = {
    ETH: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    USDC: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  };

  return (
    <div className="space-y-4">
      {txHash && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-semibold">Swap submitted!</span>
          </div>
          <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
            className="text-xs text-emerald-400 flex items-center gap-1 hover:underline">
            View <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      )}

      {/* From */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-4">
        <div className="flex justify-between mb-3">
          <span className="text-xs text-muted-foreground font-semibold">From</span>
          <span className="text-xs text-muted-foreground">Balance: <span className="text-white font-semibold">{fromBalance}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-2 rounded-xl border text-sm font-black flex-shrink-0 ${tokenColors[fromToken]}`}>
            {fromToken}
          </div>
          <input
            type="number"
            value={amountIn}
            onChange={e => { setAmountIn(e.target.value); setQuote(null); setError(""); }}
            onBlur={() => fetchQuote(amountIn)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-xl font-black text-white placeholder:text-white/20 outline-none"
          />
          <button onClick={() => { setAmountIn(fromBalance); fetchQuote(fromBalance); }}
            className="text-xs text-primary font-bold hover:underline flex-shrink-0">MAX</button>
        </div>
      </div>

      {/* Flip button */}
      <div className="flex justify-center">
        <button
          onClick={flipTokens}
          className="w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/14 transition-all hover:rotate-180 duration-300"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* To */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-4">
        <div className="flex justify-between mb-3">
          <span className="text-xs text-muted-foreground font-semibold">To (estimated)</span>
          <button onClick={() => fetchQuote(amountIn)} className="text-xs text-muted-foreground hover:text-white flex items-center gap-1">
            <RefreshCw className={`w-3 h-3 ${quoteLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-2 rounded-xl border text-sm font-black flex-shrink-0 ${tokenColors[toToken]}`}>
            {toToken}
          </div>
          <div className="flex-1 text-xl font-black text-white">
            {quoteLoading
              ? <span className="text-muted-foreground text-base">Fetching quote…</span>
              : quote
                ? quote
                : <span className="text-white/20">0.00</span>
            }
          </div>
        </div>
      </div>

      {/* Route info */}
      {quote && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/4 border border-white/6 rounded-xl px-4 py-3 space-y-1.5 text-xs"
        >
          <div className="flex justify-between">
            <span className="text-muted-foreground">Route</span>
            <span className="text-white font-medium">Uniswap V3 (Base)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fee tier</span>
            <span className="text-white font-medium">0.05%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Slippage tolerance</span>
            <span className="text-white font-medium">1%</span>
          </div>
        </motion.div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleSwap}
        disabled={swapLoading || !amountIn || !quote}
        className="w-full bg-primary text-white font-bold rounded-2xl py-4 hover:bg-primary/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {swapLoading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Swapping…</>
          : `Swap ${fromToken} → ${toToken}`
        }
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Powered by Uniswap V3 on Base mainnet
      </p>
    </div>
  );
}
