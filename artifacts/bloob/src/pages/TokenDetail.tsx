import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Share2,
  BarChart2,
  Zap,
} from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { BASE_TOKENS, TokenInfo } from "@/lib/tokens";
import SwapTab from "@/components/wallet/SwapTab";
import bloobLogo from "@assets/bloob_logo.png";
import { CHAIN_CONFIG, ChainType } from "@/components/wallet/TrendingTab";

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface PairData {
  chainId: string;
  dexId?: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd?: string;
  priceNative?: string;
  priceChange?: { m5?: number; h1?: number; h6?: number; h24?: number };
  volume?: { h24?: number; h6?: number; h1?: number; m5?: number };
  liquidity?: { usd?: number; base?: number; quote?: number };
  marketCap?: number;
  fdv?: number;
  txns?: {
    m5?: { buys: number; sells: number };
    h1?: { buys: number; sells: number };
    h6?: { buys: number; sells: number };
    h24?: { buys: number; sells: number };
  };
  info?: {
    imageUrl?: string;
    header?: string;
    openGraph?: string;
    websites?: Array<{ label?: string; url: string }>;
    socials?: Array<{ type?: string; url: string }>;
  };
  url?: string;
}

export interface TechnicalSignal {
  sentiment: "STRONG BULLISH" | "BULLISH" | "NEUTRAL" | "BEARISH" | "STRONG BEARISH";
  score: number; // 0 to 100
  buyRatio24h: number;
  buyRatio1h: number;
  totalBuys24h: number;
  totalSells24h: number;
  totalTxns24h: number;
  indicators: Array<{ name: string; status: "positive" | "negative" | "neutral"; detail: string }>;
  interpretation: string;
  recommendation: string;
}

// ─── Bullish / Bearish Quantitative Engine ───────────────────────────────────
export function calculateSignal(pair: PairData): TechnicalSignal {
  let score = 50;
  const indicators: Array<{ name: string; status: "positive" | "negative" | "neutral"; detail: string }> = [];

  const buys24 = pair.txns?.h24?.buys ?? 0;
  const sells24 = pair.txns?.h24?.sells ?? 0;
  const total24 = buys24 + sells24;
  const buyRatio24h = total24 > 0 ? Math.round((buys24 / total24) * 100) : 50;

  const buys1 = pair.txns?.h1?.buys ?? 0;
  const sells1 = pair.txns?.h1?.sells ?? 0;
  const total1 = buys1 + sells1;
  const buyRatio1h = total1 > 0 ? Math.round((buys1 / total1) * 100) : 50;

  const p24 = pair.priceChange?.h24 ?? 0;
  const p1 = pair.priceChange?.h1 ?? 0;
  const p5m = pair.priceChange?.m5 ?? 0;

  // 1. Order Flow (24h Buys vs Sells)
  if (buyRatio24h >= 62) {
    score += 15;
    indicators.push({
      name: "24h Order Flow",
      status: "positive",
      detail: `Heavy buy volume dominance (${buyRatio24h}% Buys vs ${100 - buyRatio24h}% Sells)`,
    });
  } else if (buyRatio24h <= 38) {
    score -= 15;
    indicators.push({
      name: "24h Order Flow",
      status: "negative",
      detail: `High sell-side pressure (${100 - buyRatio24h}% Sells vs ${buyRatio24h}% Buys)`,
    });
  } else {
    indicators.push({
      name: "24h Order Flow",
      status: "neutral",
      detail: `Balanced trade flow (${buyRatio24h}% Buys / ${100 - buyRatio24h}% Sells)`,
    });
  }

  // 2. Short-Term 1h Velocity
  if (buyRatio1h >= 60) {
    score += 10;
    indicators.push({
      name: "1h Short-Term Flow",
      status: "positive",
      detail: `Buyers actively accumulating in the last hour (${buyRatio1h}% Buys)`,
    });
  } else if (buyRatio1h <= 40) {
    score -= 10;
    indicators.push({
      name: "1h Short-Term Flow",
      status: "negative",
      detail: `Sellers dominating the last hour (${100 - buyRatio1h}% Sells)`,
    });
  } else {
    indicators.push({
      name: "1h Short-Term Flow",
      status: "neutral",
      detail: `Normal transaction velocity over 1h`,
    });
  }

  // 3. Price Trend (24h & 1h)
  if (p24 > 15) {
    score += 12;
    indicators.push({
      name: "Price Momentum",
      status: "positive",
      detail: `Strong 24h bullish trend (+${p24.toFixed(1)}%)`,
    });
  } else if (p24 < -15) {
    score -= 12;
    indicators.push({
      name: "Price Momentum",
      status: "negative",
      detail: `Sharp 24h decline (-${Math.abs(p24).toFixed(1)}%)`,
    });
  } else if (p24 >= 0) {
    score += 4;
    indicators.push({
      name: "Price Momentum",
      status: "positive",
      detail: `Moderate positive action (+${p24.toFixed(1)}%)`,
    });
  } else {
    score -= 4;
    indicators.push({
      name: "Price Momentum",
      status: "negative",
      detail: `Mild negative bias (${p24.toFixed(1)}%)`,
    });
  }

  // 4. Immediate Micro-Trend (5m)
  if (p5m > 1.5) {
    score += 6;
    indicators.push({
      name: "5m Micro-Trend",
      status: "positive",
      detail: `Immediate upward breakout (+${p5m.toFixed(1)}% 5m)`,
    });
  } else if (p5m < -1.5) {
    score -= 6;
    indicators.push({
      name: "5m Micro-Trend",
      status: "negative",
      detail: `Immediate sell-off dip (${p5m.toFixed(1)}% 5m)`,
    });
  }

  // Clamp score
  score = Math.max(5, Math.min(95, score));

  let sentiment: TechnicalSignal["sentiment"] = "NEUTRAL";
  let interpretation = "Market is in consolidation or balanced order flow. Wait for breakout signals.";
  let recommendation = "Neutral zone. Monitor order book liquidity before opening position.";

  if (score >= 75) {
    sentiment = "STRONG BULLISH";
    interpretation = "Aggressive buy demand outstripping sell orders. Strong trend continuation probability.";
    recommendation = "High buyer interest. Upward momentum confirmed across multi-timeframes.";
  } else if (score >= 60) {
    sentiment = "BULLISH";
    interpretation = "Positive buyer accumulation with constructive price action.";
    recommendation = "Favorable long setup with active buy-side support.";
  } else if (score <= 25) {
    sentiment = "STRONG BEARISH";
    interpretation = "Heavy capitulation or high dumping volume detected. Sell walls dominant.";
    recommendation = "High risk of continued downtrend. Caution or defensive hedging recommended.";
  } else if (score <= 40) {
    sentiment = "BEARISH";
    interpretation = "Sell pressure exceeding buy orders. Weak price recovery momentum.";
    recommendation = "Cautious outlook. Wait for sellers to exhaust before considering entry.";
  }

  return {
    sentiment,
    score,
    buyRatio24h,
    buyRatio1h,
    totalBuys24h: buys24,
    totalSells24h: sells24,
    totalTxns24h: total24,
    indicators,
    interpretation,
    recommendation,
  };
}

// ─── Format Helpers ──────────────────────────────────────────────────────────
function fmt(n: number | undefined, prefix = "$"): string {
  if (n === undefined || n === null || isNaN(n)) return "—";
  if (n >= 1_000_000_000) return `${prefix}${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}K`;
  return `${prefix}${n.toFixed(2)}`;
}

function fmtPrice(p: string | number | undefined): string {
  if (p === undefined || p === null) return "—";
  const n = typeof p === "string" ? parseFloat(p) : p;
  if (isNaN(n)) return "—";
  if (n === 0) return "$0.00";
  if (n < 0.000001) return `$${n.toExponential(3)}`;
  if (n < 0.001) return `$${n.toFixed(8)}`;
  if (n < 1) return `$${n.toFixed(5)}`;
  if (n < 1000) return `$${n.toFixed(3)}`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function TokenAvatar({ logo, symbol, size = 44 }: { logo?: string; symbol: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const COLORS = [
    "bg-blue-600",
    "bg-purple-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-cyan-600",
    "bg-indigo-600",
  ];
  const color = COLORS[(symbol || "?").charCodeAt(0) % COLORS.length];

  if (logo && !failed) {
    return (
      <img
        src={logo}
        alt={symbol}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0 ring-2 ring-white/10"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className={`${color} rounded-full flex items-center justify-center text-white font-black flex-shrink-0 ring-2 ring-white/10`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {(symbol || "?")[0]}
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-xs font-bold ${highlight ? "text-primary" : "text-white"} ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Main TokenDetail Page ───────────────────────────────────────────────────
export default function TokenDetail() {
  const params = useParams<{ address: string }>();
  const tokenAddress = params.address;
  const [, navigate] = useLocation();
  const { hasWallet, isLocked } = useWallet();

  const [pair, setPair] = useState<PairData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCA, setCopiedCA] = useState(false);
  const [copiedPair, setCopiedPair] = useState(false);
  const [swapMode, setSwapMode] = useState<"buy" | "sell" | null>(null);
  const [showFullInfo, setShowFullInfo] = useState(false);

  // Read query params for requested chain or pair
  const queryParams = useMemo(() => {
    return new URLSearchParams(window.location.search);
  }, []);
  const preferredChain = queryParams.get("chain")?.toLowerCase();
  const preferredPair = queryParams.get("pair")?.toLowerCase();

  const walletReady = hasWallet && !isLocked;

  const fetchToken = async () => {
    if (!tokenAddress) return;
    setLoading(true);
    setError("");

    try {
      // 1. Query DexScreener token endpoint
      let res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
      let data = res.ok ? await res.json() : null;
      let pairs: PairData[] = data?.pairs ?? [];

      // Fallback: If not returned by tokens endpoint, try searching tokenAddress
      if (pairs.length === 0) {
        const searchRes = await fetch(
          `https://api.dexscreener.com/latest/dex/search?q=${tokenAddress}`
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          pairs = searchData?.pairs ?? [];
        }
      }

      if (pairs.length === 0) {
        throw new Error("Token pair data not found on DexScreener");
      }

      // Filter to preferred pair or chain if specified
      let matchedPair = pairs[0];
      if (preferredPair) {
        const byPair = pairs.find((p) => p.pairAddress?.toLowerCase() === preferredPair);
        if (byPair) matchedPair = byPair;
      } else if (preferredChain) {
        const byChain = pairs
          .filter((p) => p.chainId?.toLowerCase() === preferredChain)
          .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
        if (byChain.length > 0) matchedPair = byChain[0];
      } else {
        // Sort by liquidity
        pairs.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
        matchedPair = pairs[0];
      }

      setPair(matchedPair);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load token details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
    const interval = setInterval(fetchToken, 20_000);
    return () => clearInterval(interval);
  }, [tokenAddress, preferredChain]);

  // Compute technical signal
  const signal = useMemo(() => {
    if (!pair) return null;
    return calculateSignal(pair);
  }, [pair]);

  const copyToClipboard = (text: string, isCA: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCA) {
      setCopiedCA(true);
      setTimeout(() => setCopiedCA(false), 2000);
    } else {
      setCopiedPair(true);
      setTimeout(() => setCopiedPair(false), 2000);
    }
  };

  const chainConf = pair
    ? CHAIN_CONFIG[pair.chainId as ChainType] || {
        name: pair.chainId,
        symbol: pair.chainId.toUpperCase(),
        badgeClass: "bg-white/10 text-white border-white/20",
        iconBg: "bg-blue-600",
      }
    : null;

  const isBaseChain = pair?.chainId?.toLowerCase() === "base";

  // Build TokenInfo for SwapTab (available for Base)
  const tokenInfo: TokenInfo | null = pair
    ? {
        symbol: pair.baseToken.symbol,
        name: pair.baseToken.name,
        address: pair.baseToken.address,
        decimals: 18,
        logo: pair.info?.imageUrl ?? "",
      }
    : null;

  const ethToken = BASE_TOKENS[0];
  const change24h = pair?.priceChange?.h24;

  // ─── Loading State ───
  if (loading && !pair) {
    return (
      <div className="min-h-[100dvh] bg-[#09090e] flex flex-col">
        <header className="flex items-center gap-3 px-4 py-4 border-b border-white/6">
          <button
            onClick={() => navigate("/wallet/app")}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src={bloobLogo} alt="BLOOB" className="w-6 h-6" />
            <span className="font-black text-sm text-white">BLOOB Terminal</span>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-semibold text-muted-foreground">
            Fetching token chart & technical indicators...
          </span>
        </div>
      </div>
    );
  }

  // ─── Error State ───
  if (error && !pair) {
    return (
      <div className="min-h-[100dvh] bg-[#09090e] flex flex-col">
        <header className="flex items-center gap-3 px-4 py-4 border-b border-white/6">
          <button
            onClick={() => navigate("/wallet/app")}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-white">Token Error</span>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-400" />
          <p className="text-rose-400 text-sm max-w-md">{error}</p>
          <button
            onClick={fetchToken}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-xl text-white font-bold text-sm shadow-lg shadow-primary/20"
          >
            <RefreshCw className="w-4 h-4" /> Retry DexScreener
          </button>
        </div>
      </div>
    );
  }

  if (!pair || !signal) return null;

  return (
    <div className="min-h-[100dvh] bg-[#09090e] flex flex-col text-white">
      {/* ── Top Navigation Bar ── */}
      <header className="flex items-center justify-between px-4 py-3.5 border-b border-white/8 bg-[#09090e]/90 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/wallet/app")}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <TokenAvatar logo={pair.info?.imageUrl} symbol={pair.baseToken.symbol} size={32} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm truncate">{pair.baseToken.symbol}</span>
              {chainConf && (
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${chainConf.badgeClass}`}
                >
                  {chainConf.name}
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">{pair.baseToken.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* External DexScreener Link */}
          {pair.url && (
            <a
              href={pair.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-muted-foreground hover:text-white transition-colors"
              title="Open pair on DexScreener"
            >
              <span className="hidden sm:inline">DexScreener</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={fetchToken}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Main Scrollable Container ── */}
      <div className="flex-1 overflow-y-auto pb-36 max-w-4xl mx-auto w-full px-4 pt-4 space-y-4">
        {/* ── Price Hero Card ── */}
        <div className="bg-[#12121a] border border-white/8 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground font-semibold mb-1">
              Current Price ({pair.baseToken.symbol} / {pair.quoteToken.symbol})
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
              {fmtPrice(pair.priceUsd)}
            </div>
            {change24h !== undefined && (
              <div
                className={`flex items-center gap-1.5 mt-1.5 text-sm font-bold ${
                  change24h >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {change24h >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {change24h >= 0 ? "+" : ""}
                  {change24h.toFixed(2)}% (24h)
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  · Vol: {fmt(pair.volume?.h24)}
                </span>
              </div>
            )}
          </div>

          {/* Quick Signal Highlight Badge */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-white/6 pt-3 sm:pt-0">
            <span className="text-[11px] text-muted-foreground uppercase font-black tracking-wider">
              Market Sentiment
            </span>
            <div
              className={`mt-1 flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-xs border ${
                signal.score >= 60
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : signal.score <= 40
                  ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                  : "bg-amber-500/15 border-amber-500/30 text-amber-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{signal.sentiment}</span>
            </div>
          </div>
        </div>

        {/* ── Real-Time Candlestick Chart (DexScreener Embed) ── */}
        <div className="bg-[#12121a] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Live DexScreener Chart
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                REALTIME
              </span>
            </div>
            {pair.url && (
              <a
                href={pair.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-bold"
              >
                <span>Interactive View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="relative w-full h-[380px] sm:h-[440px] bg-black/50">
            <iframe
              src={`https://dexscreener.com/${pair.chainId}/${pair.pairAddress}?embed=1&theme=dark&trades=0&info=0`}
              width="100%"
              height="100%"
              frameBorder="0"
              title={`${pair.baseToken.symbol} DexScreener Chart`}
              className="w-full h-full"
              allow="clipboard-write"
            />
          </div>
        </div>

        {/* ── 🚀 BULLISH / BEARISH AI QUANTITATIVE SIGNAL CARD ── */}
        <div className="bg-gradient-to-br from-[#12121e] to-[#0c0c14] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/20 text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-2">
                  Technical & Order Flow Signal
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground">
                    Algorithm Powered
                  </span>
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Computed from real-time DexScreener buy/sell txns, volume velocity & momentum
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-white">
                {signal.score}
                <span className="text-sm font-normal text-muted-foreground">/100</span>
              </span>
            </div>
          </div>

          {/* Sentiment Meter Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-rose-400">🔻 Bearish ({100 - signal.score}%)</span>
              <span
                className={`font-black ${
                  signal.score >= 60
                    ? "text-emerald-400"
                    : signal.score <= 40
                    ? "text-rose-400"
                    : "text-amber-400"
                }`}
              >
                {signal.sentiment}
              </span>
              <span className="text-emerald-400">Bullish ({signal.score}%) 🚀</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 flex gap-1 ring-1 ring-white/10">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${signal.score}%` }}
              />
            </div>
          </div>

          {/* Buy vs Sell Transaction Flow Breakdown */}
          <div className="bg-black/30 border border-white/6 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-muted-foreground">24h Order Book Activity</span>
              <span className="font-mono text-muted-foreground">
                {signal.totalTxns24h.toLocaleString()} total txns
              </span>
            </div>

            {/* Buys vs Sells Bar */}
            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${signal.buyRatio24h}%` }}
                title={`${signal.buyRatio24h}% Buys`}
              />
              <div
                className="bg-rose-500 transition-all duration-500"
                style={{ width: `${100 - signal.buyRatio24h}%` }}
                title={`${100 - signal.buyRatio24h}% Sells`}
              />
            </div>

            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-emerald-400">
                🟢 {signal.totalBuys24h.toLocaleString()} Buys ({signal.buyRatio24h}%)
              </span>
              <span className="text-rose-400">
                🔴 {signal.totalSells24h.toLocaleString()} Sells ({100 - signal.buyRatio24h}%)
              </span>
            </div>
          </div>

          {/* Indicators Checklist */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
              Key Signal Factors
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {signal.indicators.map((ind) => (
                <div
                  key={ind.name}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    ind.status === "positive"
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-200"
                      : ind.status === "negative"
                      ? "bg-rose-500/5 border-rose-500/20 text-rose-200"
                      : "bg-white/5 border-white/10 text-muted-foreground"
                  }`}
                >
                  <div className="mt-0.5">
                    {ind.status === "positive" ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : ind.status === "negative" ? (
                      <TrendingDown className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white">{ind.name}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{ind.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Market Outlook Box */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 space-y-1">
            <span className="text-[11px] font-black uppercase text-primary tracking-wider">
              Market Interpretation & Summary
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">{signal.interpretation}</p>
            <p className="text-xs font-bold text-white mt-1 pt-1 border-t border-white/5">
              💡 {signal.recommendation}
            </p>
          </div>
        </div>

        {/* ── Key Statistics Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Market Cap", value: fmt(pair.marketCap || pair.fdv) },
            { label: "24h Volume", value: fmt(pair.volume?.h24) },
            { label: "Liquidity Pool", value: fmt(pair.liquidity?.usd) },
            {
              label: "DEX Protocol",
              value: pair.dexId ? pair.dexId.toUpperCase() : "DEX",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#12121a] border border-white/8 rounded-2xl px-4 py-3"
            >
              <div className="text-[11px] text-muted-foreground mb-1 font-semibold">{stat.label}</div>
              <div className="font-black text-sm text-white font-mono">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ── Multi-Timeframe Price Changes ── */}
        {pair.priceChange && (
          <div className="bg-[#12121a] border border-white/8 rounded-2xl p-4">
            <div className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-3">
              Price Change Across Timeframes
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "5 Minutes", value: pair.priceChange.m5 },
                { label: "1 Hour", value: pair.priceChange.h1 },
                { label: "6 Hours", value: pair.priceChange.h6 },
                { label: "24 Hours", value: pair.priceChange.h24 },
              ].map((item) => (
                <div key={item.label} className="bg-white/4 rounded-xl p-2.5 text-center">
                  <div className="text-[11px] text-muted-foreground mb-1">{item.label}</div>
                  <div
                    className={`text-xs font-black font-mono ${
                      item.value === undefined
                        ? "text-muted-foreground"
                        : item.value >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {item.value !== undefined
                      ? `${item.value >= 0 ? "+" : ""}${item.value.toFixed(2)}%`
                      : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Token & Contract Metadata ── */}
        <div className="bg-[#12121a] border border-white/8 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">
              Token Metadata & Security
            </span>
            <button
              onClick={() => setShowFullInfo((p) => !p)}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>{showFullInfo ? "Collapse" : "Full Details"}</span>
              {showFullInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Contract Address with Copy */}
          <div className="p-3 rounded-xl bg-white/4 border border-white/6 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                Contract Address ({chainConf?.name || "Token"})
              </span>
              <span className="text-xs font-mono text-white truncate block">
                {pair.baseToken.address}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(pair.baseToken.address, true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors flex-shrink-0"
              title="Copy Contract Address"
            >
              {copiedCA ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Pair Address with Copy */}
          <div className="p-3 rounded-xl bg-white/4 border border-white/6 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                Liquidity Pool Pair
              </span>
              <span className="text-xs font-mono text-white truncate block">
                {pair.pairAddress}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(pair.pairAddress, false)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors flex-shrink-0"
              title="Copy Pair Address"
            >
              {copiedPair ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Collapsible Info Rows */}
          <AnimatePresence>
            {showFullInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-1 pt-2 border-t border-white/6"
              >
                <InfoRow label="Token Name" value={pair.baseToken.name} />
                <InfoRow label="Token Symbol" value={pair.baseToken.symbol} />
                <InfoRow label="Network / Blockchain" value={chainConf?.name || pair.chainId} highlight />
                <InfoRow label="Trading Pair" value={`${pair.baseToken.symbol} / ${pair.quoteToken.symbol}`} />
                <InfoRow label="Quote Asset" value={pair.quoteToken.symbol} />
                <InfoRow label="Pool Base Reserve" value={fmt(pair.liquidity?.base, "")} />
                <InfoRow label="Pool Quote Reserve" value={fmt(pair.liquidity?.quote, "")} />
                <InfoRow label="Fully Diluted Valuation (FDV)" value={fmt(pair.fdv)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Socials & Website Links */}
          {pair.info && (pair.info.websites?.length || pair.info.socials?.length) ? (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/6">
              {pair.info.websites?.map((w, idx) => (
                <a
                  key={idx}
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-muted-foreground hover:text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>{w.label || "Website"}</span>
                </a>
              ))}
              {pair.info.socials?.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-muted-foreground hover:text-white transition-colors capitalize"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{s.type || "Community"}</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {/* ── Swap Panel (for Base Tokens) ── */}
        <AnimatePresence>
          {swapMode && tokenInfo && isBaseChain && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#12121a] border border-white/15 rounded-3xl p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-base capitalize">
                  {swapMode} {pair.baseToken.symbol} on Base
                </span>
                <button
                  onClick={() => setSwapMode(null)}
                  className="text-muted-foreground hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
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
                    {!hasWallet
                      ? "Create or import a wallet to trade on Base."
                      : "Unlock your wallet to trade."}
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

      {/* ── Fixed Bottom Trading Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 pb-5 pt-3 bg-gradient-to-t from-[#09090e] via-[#09090e]/95 to-transparent z-30">
        {isBaseChain ? (
          swapMode === null ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSwapMode("buy")}
                className="py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all text-sm shadow-lg shadow-emerald-500/20"
              >
                Buy {pair.baseToken.symbol}
              </button>
              <button
                onClick={() => setSwapMode("sell")}
                className="py-3.5 bg-white/8 hover:bg-white/14 border border-white/12 text-white font-black rounded-2xl transition-all text-sm"
              >
                Sell {pair.baseToken.symbol}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSwapMode(null)}
              className="w-full py-3.5 bg-white/8 hover:bg-white/14 border border-white/12 text-white font-bold rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Close Swap Panel
            </button>
          )
        ) : (
          /* For Solana, BSC, Robinhood tokens */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={pair.url || `https://dexscreener.com/${pair.chainId}/${pair.pairAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-center"
            >
              <span>Trade on {pair.dexId ? pair.dexId.toUpperCase() : "DEX"}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={pair.url || `https://dexscreener.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 bg-white/8 hover:bg-white/14 border border-white/12 text-white font-black rounded-2xl transition-all text-sm flex items-center justify-center gap-2 text-center"
            >
              <span>View Full DexScreener</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
