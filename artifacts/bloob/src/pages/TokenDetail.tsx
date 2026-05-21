import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ExternalLink, TrendingUp, TrendingDown,
  Loader2, RefreshCw, X, ChevronDown, ChevronUp,
} from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { BASE_TOKENS, TokenInfo } from "@/lib/tokens";
import SwapTab from "@/components/wallet/SwapTab";
import bloobLogo from "@assets/bloob_logo.png";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface PairData {
  chainId: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd?: string;
  priceChange?: { m5: number; h1: number; h6: number; h24: number };
  volume?: { h24: number; h6: number; h1: number };
  liquidity?: { usd: number; base: number; quote: number };
  marketCap?: number;
  fdv?: number;
  txns?: { h24: { buys: number; sells: number } };
  info?: { imageUrl?: string };
  url?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number | undefined, prefix = "$"): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `${prefix}${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `${prefix}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `${prefix}${(n / 1_000).toFixed(2)}K`;
  return `${prefix}${n.toFixed(2)}`;
}

function fmtPrice(p: string | undefined): string {
  if (!p) return "—";
  const n = parseFloat(p);
  if (n < 0.000001) return `$${n.toExponential(3)}`;
  if (n < 0.001)    return `$${n.toFixed(8)}`;
  if (n < 1)        return `$${n.toFixed(6)}`;
  if (n < 1000)     return `$${n.toFixed(4)}`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function TokenAvatar({ logo, symbol, size = 40 }: { logo?: string; symbol: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const COLORS = ["bg-blue-500","bg-purple-500","bg-emerald-500","bg-orange-500","bg-pink-500","bg-cyan-500","bg-yellow-500","bg-red-500"];
  const color = COLORS[symbol.charCodeAt(0) % COLORS.length];
  if (logo && !failed) {
    return (
      <img src={logo} alt={symbol} style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0" onError={() => setFailed(true)} />
    );
  }
  return (
    <div className={`${color} rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {symbol[0]}
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-primary" : "text-white"}`}>{value}</span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function TokenDetail() {
  const params = useParams<{ address: string }>();
  const tokenAddress = params.address;
  const [, navigate] = useLocation();
  const { hasWallet, isLocked } = useWallet();

  const [pair, setPair] = useState<PairData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [swapMode, setSwapMode] = useState<"buy" | "sell" | null>(null);
  const [showFullInfo, setShowFullInfo] = useState(false);

  const walletReady = hasWallet && !isLocked;

  const fetchToken = async () => {
    if (!tokenAddress) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
      if (!res.ok) throw new Error("Failed to fetch token data");
      const data = await res.json();
      const pairs: PairData[] = data.pairs ?? [];
      // Filter to Base, sort by liquidity
      const basePairs = pairs
        .filter(p => p.chainId === "base")
        .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
      if (basePairs.length === 0) throw new Error("Token not found on Base network");
      setPair(basePairs[0]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchToken(); }, [tokenAddress]);

  // Build TokenInfo for SwapTab
  const tokenInfo: TokenInfo | null = pair
    ? {
        symbol: pair.baseToken.symbol,
        name: pair.baseToken.name,
        address: pair.baseToken.address,
        decimals: 18, // default, fine for quote purposes
        logo: pair.info?.imageUrl ?? "",
      }
    : null;

  const ethToken = BASE_TOKENS[0]; // native ETH

  const change24h = pair?.priceChange?.h24;

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex flex-col">
        <header className="flex items-center gap-3 px-4 py-4 border-b border-white/6">
          <button onClick={() => navigate("/wallet/app")} className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <img src={bloobLogo} alt="BLOOB" className="w-6 h-6" />
            <span className="font-black text-sm group-hover:text-primary transition-colors">BLOOB Wallet</span>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error || !pair) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex flex-col">
        <header className="flex items-center gap-3 px-4 py-4 border-b border-white/6">
          <button onClick={() => navigate("/wallet/app")} className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={fetchToken} className="flex items-center gap-2 text-sm text-primary font-bold">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#050505] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-white/6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/wallet/app")} className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <TokenAvatar logo={pair.info?.imageUrl} symbol={pair.baseToken.symbol} size={28} />
          <div>
            <span className="font-black text-sm">{pair.baseToken.symbol}</span>
            <span className="text-xs text-muted-foreground ml-1.5">{pair.baseToken.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary">Base</span>
          </div>
          {pair.url && (
            <a href={pair.url} target="_blank" rel="noopener noreferrer"
              className="p-1.5 text-muted-foreground hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button onClick={fetchToken} className="p-1.5 text-muted-foreground hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-36">
        {/* Price hero */}
        <div className="px-4 pt-5 pb-4">
          <div className="text-3xl font-black text-white">{fmtPrice(pair.priceUsd)}</div>
          {change24h !== undefined && (
            <div className={`flex items-center gap-1.5 mt-1 ${change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-bold text-sm">
                {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}% (24h)
              </span>
            </div>
          )}
        </div>

        {/* Chart via GeckoTerminal */}
        <div className="mx-4 mb-4 rounded-2xl overflow-hidden border border-white/8" style={{ height: 340 }}>
          <iframe
            src={`https://www.geckoterminal.com/base/pools/${pair.pairAddress}?embed=1&info=0&swaps=0&theme=dark`}
            width="100%"
            height="340"
            frameBorder="0"
            allow="clipboard-write"
            title={`${pair.baseToken.symbol} chart`}
            className="w-full h-full"
          />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 px-4 mb-4">
          {[
            { label: "Market Cap",  value: fmt(pair.marketCap) },
            { label: "24h Volume",  value: fmt(pair.volume?.h24) },
            { label: "Liquidity",   value: fmt(pair.liquidity?.usd) },
            { label: "Txns (24h)",  value: pair.txns?.h24 ? `${pair.txns.h24.buys + pair.txns.h24.sells}` : "—" },
          ].map(stat => (
            <div key={stat.label} className="bg-white/4 border border-white/8 rounded-2xl px-4 py-3">
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="font-black text-sm">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Performance */}
        {pair.priceChange && (
          <div className="mx-4 mb-4 bg-white/4 border border-white/8 rounded-2xl px-4 py-4">
            <div className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-3">Price Change</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "5m",  value: pair.priceChange.m5 },
                { label: "1h",  value: pair.priceChange.h1 },
                { label: "6h",  value: pair.priceChange.h6 },
                { label: "24h", value: pair.priceChange.h24 },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className={`text-xs font-bold ${item.value >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {item.value >= 0 ? "+" : ""}{item.value.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Token Info */}
        <div className="mx-4 mb-4 bg-white/4 border border-white/8 rounded-2xl px-4 py-2">
          <button
            onClick={() => setShowFullInfo(p => !p)}
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">Token Info</span>
            {showFullInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showFullInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <InfoRow label="Name"    value={pair.baseToken.name} />
                <InfoRow label="Symbol"  value={pair.baseToken.symbol} />
                <InfoRow label="Network" value="Base Mainnet" highlight />
                <InfoRow label="Market Cap" value={fmt(pair.marketCap)} />
                <InfoRow label="FDV"     value={fmt(pair.fdv)} />
                <InfoRow label="Buys (24h)"  value={pair.txns?.h24.buys?.toString() ?? "—"} />
                <InfoRow label="Sells (24h)" value={pair.txns?.h24.sells?.toString() ?? "—"} />
                <div className="py-2.5">
                  <span className="text-xs text-muted-foreground block mb-1">Contract Address</span>
                  <a
                    href={`https://basescan.org/address/${pair.baseToken.address}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs font-mono text-primary hover:underline break-all"
                  >
                    {pair.baseToken.address}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Swap panel inline */}
        <AnimatePresence>
          {swapMode && tokenInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mx-4 mb-4 bg-[#111] border border-white/10 rounded-3xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-base capitalize">{swapMode} {pair.baseToken.symbol}</span>
                <button onClick={() => setSwapMode(null)} className="text-muted-foreground hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {walletReady ? (
                <SwapTab
                  prefilledSell={swapMode === "buy" ? ethToken : tokenInfo}
                  prefilledBuy={swapMode === "buy" ? tokenInfo : ethToken}
                />
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-muted-foreground text-sm">
                    {!hasWallet ? "Create or import a wallet to trade." : "Unlock your wallet to trade."}
                  </p>
                  <Link href="/wallet">
                    <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-2xl text-sm hover:bg-primary/90 transition-all">
                      {!hasWallet ? "Create Wallet" : "Unlock Wallet"}
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky buy/sell bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-screen-sm mx-auto px-4 pb-5 pt-3 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent">
        {swapMode === null ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSwapMode("buy")}
              className="py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all text-sm"
            >
              Buy {pair.baseToken.symbol}
            </button>
            <button
              onClick={() => setSwapMode("sell")}
              className="py-4 bg-white/8 hover:bg-white/14 border border-white/12 text-white font-black rounded-2xl transition-all text-sm"
            >
              Sell {pair.baseToken.symbol}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSwapMode(null)}
            className="w-full py-3.5 bg-white/8 hover:bg-white/14 border border-white/12 text-white font-bold rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Close Swap
          </button>
        )}
      </div>
    </div>
  );
}
