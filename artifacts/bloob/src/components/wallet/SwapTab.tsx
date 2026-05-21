import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Search, X, Check, ExternalLink, Loader2, ChevronDown, RefreshCw } from "lucide-react";
import { useWallet, QuoteResult } from "@/contexts/WalletContext";
import { BASE_TOKENS, TokenInfo } from "@/lib/tokens";

// ─── Token Avatar ─────────────────────────────────────────────────────────────
function TokenAvatar({ logo, symbol, size = 28 }: { logo?: string; symbol: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const COLORS = ["bg-blue-500","bg-purple-500","bg-emerald-500","bg-orange-500","bg-pink-500","bg-cyan-500"];
  const color = COLORS[symbol.charCodeAt(0) % COLORS.length];
  if (logo && !failed) {
    return (
      <img
        src={logo} alt={symbol}
        width={size} height={size}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className={`${color} rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {symbol[0]}
    </div>
  );
}

// ─── Token Picker Modal ───────────────────────────────────────────────────────
function TokenPicker({
  selected,
  onSelect,
  onClose,
  exclude,
  extraTokens = [],
}: {
  selected: TokenInfo;
  onSelect: (t: TokenInfo) => void;
  onClose: () => void;
  exclude?: string;
  extraTokens?: TokenInfo[];
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const allTokens = [
    ...BASE_TOKENS,
    ...extraTokens.filter(et => !BASE_TOKENS.find(bt => bt.address.toLowerCase() === et.address.toLowerCase())),
  ];

  const filtered = allTokens.filter(t => {
    if (exclude && t.address.toLowerCase() === exclude.toLowerCase()) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-sm bg-[#111] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <span className="font-black text-base">Select Token</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-2xl px-3 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name or paste address…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
            />
          </div>
        </div>

        {/* Network badge */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/15 border border-primary/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-bold text-primary">Base Mainnet</span>
            </div>
          </div>
        </div>

        {/* Token list */}
        <div className="overflow-y-auto max-h-72 px-2 pb-4">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No tokens found</p>
          )}
          {filtered.map(token => (
            <button
              key={token.address}
              onClick={() => { onSelect(token); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/6 transition-colors ${
                selected.address === token.address ? "bg-primary/10 border border-primary/20" : ""
              }`}
            >
              <TokenAvatar logo={token.logo} symbol={token.symbol} size={36} />
              <div className="flex-1 text-left min-w-0">
                <div className="font-bold text-sm text-white">{token.symbol}</div>
                <div className="text-xs text-muted-foreground truncate">{token.name}</div>
              </div>
              {selected.address === token.address && (
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main SwapTab ─────────────────────────────────────────────────────────────
export default function SwapTab({
  prefilledSell,
  prefilledBuy,
}: {
  prefilledSell?: TokenInfo;
  prefilledBuy?: TokenInfo;
}) {
  const { quoteAnySwap, executeAnySwap, balances } = useWallet();

  const [sellToken, setSellToken] = useState<TokenInfo>(prefilledSell ?? BASE_TOKENS[0]); // ETH
  const [buyToken,  setBuyToken]  = useState<TokenInfo>(prefilledBuy  ?? BASE_TOKENS[1]); // USDC
  const [amountIn, setAmountIn]   = useState("");
  const [quote, setQuote]         = useState<QuoteResult | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [swapLoading, setSwapLoading]   = useState(false);
  const [txHash, setTxHash]       = useState<string | null>(null);
  const [error, setError]         = useState("");
  const [showSellPicker, setShowSellPicker] = useState(false);
  const [showBuyPicker,  setShowBuyPicker]  = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const sellBalance = balances.find(b => b.symbol === sellToken.symbol)?.balance;

  const resetQuote = () => { setQuote(null); setError(""); };

  const fetchQuote = useCallback(async (amt: string, si: TokenInfo, bi: TokenInfo) => {
    if (!amt || parseFloat(amt) <= 0) { resetQuote(); return; }
    setQuoteLoading(true);
    setError("");
    try {
      const q = await quoteAnySwap(si.address, bi.address, si.decimals, bi.decimals, amt);
      setQuote(q);
    } catch (e: any) {
      setError(e?.message ?? "No liquidity for this pair");
      setQuote(null);
    } finally {
      setQuoteLoading(false);
    }
  }, [quoteAnySwap]);

  const handleAmountChange = (val: string) => {
    setAmountIn(val);
    resetQuote();
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchQuote(val, sellToken, buyToken), 600);
  };

  const flipTokens = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setAmountIn("");
    resetQuote();
  };

  const handleSellSelect = (t: TokenInfo) => {
    setSellToken(t);
    setAmountIn("");
    resetQuote();
  };

  const handleBuySelect = (t: TokenInfo) => {
    setBuyToken(t);
    setAmountIn("");
    resetQuote();
  };

  const handleSwap = async () => {
    if (!amountIn || !quote) return;
    setSwapLoading(true);
    setError("");
    setTxHash(null);
    try {
      const slippage = 0.98; // 2% slippage for unknown tokens
      const minOut = BigInt(Math.floor(Number(quote.amountOutRaw) * slippage));
      const tx = await executeAnySwap(
        sellToken.address, buyToken.address,
        sellToken.decimals, amountIn,
        minOut, quote.fee, quote.hops
      );
      setTxHash(tx.hash);
      setAmountIn("");
      setQuote(null as any);
    } catch (e: any) {
      setError(e?.reason ?? e?.shortMessage ?? e?.message ?? "Swap failed");
    } finally {
      setSwapLoading(false);
    }
  };

  const quoteFormatted = quote
    ? parseFloat(quote.amountOut).toFixed(buyToken.decimals > 8 ? 6 : buyToken.decimals)
    : null;

  return (
    <div className="space-y-4">
      {/* Success */}
      <AnimatePresence>
        {txHash && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
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
      </AnimatePresence>

      {/* Sell card */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Sell</span>
          {sellBalance && (
            <span className="text-xs text-muted-foreground">
              Balance: <span className="text-white font-bold">{sellBalance} {sellToken.symbol}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSellPicker(true)}
            className="flex items-center gap-2 bg-white/8 hover:bg-white/14 border border-white/12 rounded-xl px-3 py-2 transition-all flex-shrink-0"
          >
            <TokenAvatar logo={sellToken.logo} symbol={sellToken.symbol} size={22} />
            <span className="font-black text-sm">{sellToken.symbol}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <input
            type="number"
            value={amountIn}
            onChange={e => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-black text-white placeholder:text-white/20 outline-none text-right"
          />
          {sellBalance && (
            <button
              onClick={() => handleAmountChange(sellBalance)}
              className="text-xs text-primary font-bold hover:underline flex-shrink-0"
            >MAX</button>
          )}
        </div>
      </div>

      {/* Flip */}
      <div className="flex justify-center -my-1">
        <button
          onClick={flipTokens}
          className="w-9 h-9 rounded-full bg-[#111] border border-white/12 flex items-center justify-center text-muted-foreground hover:text-white hover:border-white/24 transition-all hover:rotate-180 duration-300 z-10"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* Buy card */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Buy</span>
          <button
            onClick={() => fetchQuote(amountIn, sellToken, buyToken)}
            className="text-xs text-muted-foreground hover:text-white flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${quoteLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBuyPicker(true)}
            className="flex items-center gap-2 bg-white/8 hover:bg-white/14 border border-white/12 rounded-xl px-3 py-2 transition-all flex-shrink-0"
          >
            <TokenAvatar logo={buyToken.logo} symbol={buyToken.symbol} size={22} />
            <span className="font-black text-sm">{buyToken.symbol}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <div className="flex-1 text-right text-2xl font-black">
            {quoteLoading
              ? <span className="text-muted-foreground text-base animate-pulse">Fetching…</span>
              : quoteFormatted
                ? <span>{quoteFormatted}</span>
                : <span className="text-white/20">0.00</span>
            }
          </div>
        </div>
      </div>

      {/* Route info */}
      <AnimatePresence>
        {quote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/4 border border-white/6 rounded-xl px-4 py-3 space-y-1.5 text-xs overflow-hidden"
          >
            <div className="flex justify-between">
              <span className="text-muted-foreground">Route</span>
              <span className="text-white font-medium">{quote.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="text-primary font-medium">Base Mainnet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <span className="text-white font-medium">2%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
      )}

      <button
        onClick={handleSwap}
        disabled={swapLoading || !amountIn || !quote}
        className="w-full bg-primary text-white font-bold rounded-2xl py-4 hover:bg-primary/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
      >
        {swapLoading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Swapping…</>
          : !amountIn
            ? "Enter amount"
            : !quote
              ? "Get quote"
              : `Swap ${sellToken.symbol} → ${buyToken.symbol}`
        }
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Powered by <span className="text-white/60">Uniswap V3</span> on Base mainnet
      </p>

      {/* Token pickers */}
      <AnimatePresence>
        {showSellPicker && (
          <TokenPicker
            selected={sellToken}
            onSelect={handleSellSelect}
            onClose={() => setShowSellPicker(false)}
            exclude={buyToken.address}
          />
        )}
        {showBuyPicker && (
          <TokenPicker
            selected={buyToken}
            onSelect={handleBuySelect}
            onClose={() => setShowBuyPicker(false)}
            exclude={sellToken.address}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
