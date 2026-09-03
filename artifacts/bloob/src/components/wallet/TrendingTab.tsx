import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Loader2,
  RefreshCw,
  Flame,
  Search,
  Layers,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

export type ChainType = "all" | "solana" | "base" | "robinhood" | "bsc";

export interface DexToken {
  tokenAddress: string;
  chainId: string;
  dexId?: string;
  icon?: string;
  name: string;
  symbol: string;
  price?: number;
  priceChange24h?: number;
  priceChange1h?: number;
  priceChange5m?: number;
  volume24h?: number;
  marketCap?: number;
  pairAddress?: string;
  liquidity?: number;
  buys24h?: number;
  sells24h?: number;
  boostScore?: number;
}

export const CHAIN_CONFIG: Record<
  ChainType,
  { name: string; symbol: string; badgeClass: string; iconBg: string }
> = {
  all: {
    name: "All Chains",
    symbol: "ALL",
    badgeClass: "bg-white/10 text-white border-white/20",
    iconBg: "bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500",
  },
  solana: {
    name: "Solana",
    symbol: "SOL",
    badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    iconBg: "bg-gradient-to-tr from-purple-600 to-emerald-400",
  },
  base: {
    name: "Base",
    symbol: "BASE",
    badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    iconBg: "bg-blue-600",
  },
  robinhood: {
    name: "Robinhood",
    symbol: "HOOD",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    iconBg: "bg-emerald-600",
  },
  bsc: {
    name: "BSC",
    symbol: "BNB",
    badgeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    iconBg: "bg-yellow-500 text-black",
  },
};

export function getQuickSignal(token: DexToken): {
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  score: number;
  label: string;
  colorClass: string;
  bgClass: string;
} {
  let score = 50;
  const p24 = token.priceChange24h ?? 0;
  const p1 = token.priceChange1h ?? 0;
  const buys = token.buys24h ?? 0;
  const sells = token.sells24h ?? 0;
  const total = buys + sells;
  const buyRatio = total > 0 ? (buys / total) * 100 : 50;

  if (p24 > 15) score += 20;
  else if (p24 > 3) score += 10;
  else if (p24 < -15) score -= 20;
  else if (p24 < -3) score -= 10;

  if (p1 > 2) score += 10;
  else if (p1 < -2) score -= 10;

  if (buyRatio >= 60) score += 15;
  else if (buyRatio <= 40) score -= 15;

  score = Math.max(10, Math.min(95, score));

  if (score >= 60) {
    return {
      sentiment: "BULLISH",
      score,
      label: `Bullish ${score}%`,
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-500/10 border-emerald-500/25",
    };
  } else if (score <= 40) {
    return {
      sentiment: "BEARISH",
      score,
      label: `Bearish ${100 - score}%`,
      colorClass: "text-rose-400",
      bgClass: "bg-rose-500/10 border-rose-500/25",
    };
  }
  return {
    sentiment: "NEUTRAL",
    score,
    label: "Neutral 50%",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/25",
  };
}

function TokenAvatar({
  logo,
  symbol,
  size = 36,
}: {
  logo?: string;
  symbol: string;
  size?: number;
}) {
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
  const charCode = (symbol || "?").charCodeAt(0);
  const color = COLORS[charCode % COLORS.length];

  if (logo && !failed) {
    return (
      <img
        src={logo}
        alt={symbol}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0 ring-1 ring-white/10"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className={`${color} rounded-full flex items-center justify-center text-white font-black flex-shrink-0 ring-1 ring-white/10`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {(symbol || "?")[0]}
    </div>
  );
}

function fmt(n: number | undefined, prefix = "$"): string {
  if (n === undefined || n === null || isNaN(n)) return "—";
  if (n >= 1_000_000_000) return `${prefix}${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}K`;
  return `${prefix}${n.toFixed(2)}`;
}

function fmtPrice(p: number | undefined): string {
  if (p === undefined || p === null || isNaN(p)) return "—";
  if (p === 0) return "$0.00";
  if (p < 0.000001) return `$${p.toExponential(3)}`;
  if (p < 0.001) return `$${p.toFixed(7)}`;
  if (p < 1) return `$${p.toFixed(4)}`;
  if (p < 1000) return `$${p.toFixed(2)}`;
  return `$${p.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function TrendingTab() {
  const [, navigate] = useLocation();
  const [selectedChain, setSelectedChain] = useState<ChainType>("all");
  const [tokens, setTokens] = useState<DexToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"trending" | "gainers" | "volume" | "liquidity">("trending");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch real-time DexScreener trending data across multi-chains
  const fetchTrending = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else if (tokens.length === 0) setLoading(true);
    setError("");

    try {
      // 1. Fetch Top Boosted Tokens
      const [topBoostRes, latestBoostRes] = await Promise.allSettled([
        fetch("https://api.dexscreener.com/token-boosts/top/v1"),
        fetch("https://api.dexscreener.com/token-boosts/latest/v1"),
      ]);

      const boostedList: Array<{
        chainId: string;
        tokenAddress: string;
        icon?: string;
        amount?: number;
      }> = [];

      if (topBoostRes.status === "fulfilled" && topBoostRes.value.ok) {
        const topData = await topBoostRes.value.json();
        if (Array.isArray(topData)) boostedList.push(...topData);
      }
      if (latestBoostRes.status === "fulfilled" && latestBoostRes.value.ok) {
        const latestData = await latestBoostRes.value.json();
        if (Array.isArray(latestData)) boostedList.push(...latestData);
      }

      // Collect addresses from boosted tokens
      const targetChains = ["solana", "base", "robinhood", "bsc"];
      const boostedMap = new Map<string, { icon?: string; boostScore?: number }>();
      const boostedAddresses: string[] = [];

      for (const item of boostedList) {
        if (!item.tokenAddress) continue;
        const normalizedChain = item.chainId?.toLowerCase();
        if (targetChains.includes(normalizedChain)) {
          const key = item.tokenAddress.toLowerCase();
          if (!boostedMap.has(key)) {
            boostedMap.set(key, { icon: item.icon, boostScore: item.amount || 1 });
            boostedAddresses.push(item.tokenAddress);
          }
        }
      }

      // Fetch batch pairs for boosted tokens (up to 30 addresses)
      let boostedPairs: any[] = [];
      if (boostedAddresses.length > 0) {
        const sliceAddrs = boostedAddresses.slice(0, 30).join(",");
        try {
          const batchRes = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${sliceAddrs}`
          );
          if (batchRes.ok) {
            const batchData = await batchRes.json();
            if (Array.isArray(batchData.pairs)) {
              boostedPairs = batchData.pairs;
            }
          }
        } catch (e) {
          console.warn("Batch tokens fetch error", e);
        }
      }

      // 2. Fetch chain-specific high-liquidity searches to guarantee rich token lists for each chain
      const searchQueries = ["base", "solana", "bsc", "robinhood"];
      const searchResults = await Promise.allSettled(
        searchQueries.map((q) =>
          fetch(`https://api.dexscreener.com/latest/dex/search?q=${q}`)
            .then((r) => r.json())
            .catch(() => ({ pairs: [] }))
        )
      );

      const allPairs: any[] = [...boostedPairs];
      for (const res of searchResults) {
        if (res.status === "fulfilled" && Array.isArray(res.value?.pairs)) {
          allPairs.push(...res.value.pairs);
        }
      }

      // 3. Normalize and deduplicate by tokenAddress + chainId
      const tokenMap = new Map<string, DexToken>();

      for (const p of allPairs) {
        if (!p?.baseToken?.address || !p?.chainId) continue;
        const cId = p.chainId.toLowerCase();
        if (!targetChains.includes(cId)) continue;

        const addr = p.baseToken.address.toLowerCase();
        const key = `${cId}:${addr}`;
        const existing = tokenMap.get(key);

        const currentLiquidity = p.liquidity?.usd ?? 0;
        const existingLiquidity = existing?.liquidity ?? 0;

        // Keep the pair with the highest liquidity
        if (!existing || currentLiquidity > existingLiquidity) {
          const boostInfo = boostedMap.get(addr);
          tokenMap.set(key, {
            tokenAddress: p.baseToken.address,
            chainId: cId,
            dexId: p.dexId,
            icon: p.info?.imageUrl || boostInfo?.icon,
            name: p.baseToken.name || "Unknown",
            symbol: p.baseToken.symbol || "???",
            price: p.priceUsd ? parseFloat(p.priceUsd) : undefined,
            priceChange24h: p.priceChange?.h24,
            priceChange1h: p.priceChange?.h1,
            priceChange5m: p.priceChange?.m5,
            volume24h: p.volume?.h24,
            marketCap: p.marketCap || p.fdv,
            pairAddress: p.pairAddress,
            liquidity: currentLiquidity,
            buys24h: p.txns?.h24?.buys,
            sells24h: p.txns?.h24?.sells,
            boostScore: boostInfo?.boostScore ?? 0,
          });
        }
      }

      const list = Array.from(tokenMap.values());
      setTokens(list);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.message || "Failed to load real-time DexScreener data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrending();
    // Auto-refresh every 25 seconds for real-time rates
    const timer = setInterval(() => fetchTrending(), 25_000);
    return () => clearInterval(timer);
  }, []);

  // Filter by selected chain and search query
  const filteredTokens = useMemo(() => {
    return tokens
      .filter((t) => {
        if (selectedChain !== "all" && t.chainId !== selectedChain) {
          return false;
        }
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          t.symbol.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.tokenAddress.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "gainers") {
          return (b.priceChange24h ?? -999) - (a.priceChange24h ?? -999);
        }
        if (sortBy === "volume") {
          return (b.volume24h ?? 0) - (a.volume24h ?? 0);
        }
        if (sortBy === "liquidity") {
          return (b.liquidity ?? 0) - (a.liquidity ?? 0);
        }
        // Default "trending": weighted score based on boosts, volume, and activity
        const scoreA = (a.boostScore ?? 0) * 1000 + (a.volume24h ?? 0);
        const scoreB = (b.boostScore ?? 0) * 1000 + (b.volume24h ?? 0);
        return scoreB - scoreA;
      });
  }, [tokens, selectedChain, searchQuery, sortBy]);

  const handleTokenClick = (t: DexToken) => {
    navigate(`/wallet/token/${t.tokenAddress}?chain=${t.chainId}&pair=${t.pairAddress || ""}`);
  };

  return (
    <div className="space-y-4">
      {/* ── Top Bar: Chains Filter & Refresh ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Chain selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(["all", "solana", "base", "robinhood", "bsc"] as ChainType[]).map((chain) => {
            const conf = CHAIN_CONFIG[chain];
            const isSelected = selectedChain === chain;
            return (
              <button
                key={chain}
                onClick={() => setSelectedChain(chain)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black tracking-wide transition-all flex-shrink-0 ${
                  isSelected
                    ? `${conf.badgeClass} ring-1 ring-white/30 shadow-md`
                    : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${conf.iconBg}`} />
                <span>{conf.name}</span>
                {isSelected && (
                  <span className="text-[10px] opacity-75 font-mono">
                    (
                    {tokens.filter((t) => chain === "all" || t.chainId === chain).length}
                    )
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live status & Manual Refresh button */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>DexScreener Live</span>
          </div>
          {lastUpdated && (
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
          <button
            onClick={() => fetchTrending(true)}
            disabled={refreshing}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
            title="Refresh realtime data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Search & Sort Filters Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-2 bg-[#12121a] border border-white/8 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedChain === "all" ? "any token" : CHAIN_CONFIG[selectedChain].name + " token"} by symbol, name, CA...`}
            className="flex-1 bg-transparent text-xs text-white placeholder:text-muted-foreground outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-muted-foreground hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-1 bg-[#12121a] border border-white/8 rounded-xl p-1 flex-shrink-0 text-xs">
          <button
            onClick={() => setSortBy("trending")}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
              sortBy === "trending" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
            }`}
          >
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Hot</span>
          </button>
          <button
            onClick={() => setSortBy("gainers")}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
              sortBy === "gainers" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
            }`}
          >
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Gainers</span>
          </button>
          <button
            onClick={() => setSortBy("volume")}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
              sortBy === "volume" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
            }`}
          >
            <ArrowUpDown className="w-3 h-3 text-blue-400" />
            <span>Volume</span>
          </button>
          <button
            onClick={() => setSortBy("liquidity")}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
              sortBy === "liquidity" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
            }`}
          >
            <Layers className="w-3 h-3 text-purple-400" />
            <span>Pool</span>
          </button>
        </div>
      </div>

      {/* ── Table Header ── */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-3 py-1.5 text-[11px] text-muted-foreground font-bold uppercase tracking-wider border-b border-white/6">
        <span>Token / Chain</span>
        <span className="text-right hidden sm:block">Signal</span>
        <span className="text-right">Price / Vol</span>
        <span className="text-right w-16">24h</span>
      </div>

      {/* ── Loading Skeleton ── */}
      {loading && tokens.length === 0 && (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-semibold text-muted-foreground">
            Streaming real-time pairs from DexScreener...
          </span>
        </div>
      )}

      {/* ── Error State ── */}
      {error && tokens.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 bg-white/2 rounded-2xl border border-rose-500/20">
          <p className="text-sm text-rose-400 text-center">{error}</p>
          <button
            onClick={() => fetchTrending(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-primary text-sm font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reconnect DexScreener
          </button>
        </div>
      )}

      {/* ── Token Rows List ── */}
      {!loading && (
        <div className="space-y-1.5">
          {filteredTokens.map((token, index) => {
            const signal = getQuickSignal(token);
            const chainConf =
              CHAIN_CONFIG[token.chainId as ChainType] || {
                name: token.chainId,
                symbol: token.chainId.toUpperCase(),
                badgeClass: "bg-white/10 text-white border-white/20",
                iconBg: "bg-blue-500",
              };

            return (
              <motion.button
                key={`${token.chainId}:${token.tokenAddress}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                onClick={() => handleTokenClick(token)}
                className="w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.07] border border-white/[0.04] hover:border-white/15 transition-all text-left group cursor-pointer"
              >
                {/* Left: Rank, Avatar, Name & Chain Badge */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs text-muted-foreground/80 w-5 flex-shrink-0 font-mono font-bold">
                    #{index + 1}
                  </span>

                  <TokenAvatar logo={token.icon} symbol={token.symbol} size={38} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-white group-hover:text-primary transition-colors truncate">
                        {token.symbol}
                      </span>
                      {/* Chain Badge */}
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${chainConf.badgeClass} flex-shrink-0`}
                      >
                        {chainConf.symbol}
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>

                    <div className="text-xs text-muted-foreground truncate flex items-center gap-2">
                      <span className="truncate">{token.name}</span>
                      {token.dexId && (
                        <span className="text-[10px] text-muted-foreground/60 hidden md:inline">
                          · {token.dexId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Bullish / Bearish Quick Signal (Desktop & Tablet) */}
                <div className="hidden sm:flex flex-col items-end flex-shrink-0">
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black ${signal.bgClass} ${signal.colorClass}`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{signal.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {token.buys24h ? `${token.buys24h}B / ${token.sells24h ?? 0}S` : "High Activity"}
                  </span>
                </div>

                {/* Right 1: Price & 24h Volume */}
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-sm text-white font-mono">
                    {fmtPrice(token.price)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {fmt(token.volume24h)} vol
                  </div>
                </div>

                {/* Right 2: 24h Change Badge */}
                <div
                  className={`text-right w-16 flex-shrink-0 font-black text-xs font-mono px-2 py-1 rounded-lg ${
                    token.priceChange24h === undefined
                      ? "text-muted-foreground bg-white/5"
                      : token.priceChange24h >= 0
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                  }`}
                >
                  {token.priceChange24h !== undefined
                    ? `${token.priceChange24h >= 0 ? "+" : ""}${token.priceChange24h.toFixed(1)}%`
                    : "0.0%"}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Empty Search Result */}
      {!loading && filteredTokens.length === 0 && (
        <div className="text-center py-12 bg-white/2 rounded-2xl border border-white/5 space-y-2">
          <p className="text-sm font-semibold text-white">No tokens found</p>
          <p className="text-xs text-muted-foreground">
            No matching token on {CHAIN_CONFIG[selectedChain].name} for "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedChain("all");
            }}
            className="mt-2 text-xs font-bold text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── Footer Link to DexScreener ── */}
      <div className="flex items-center justify-between pt-2 border-t border-white/6 text-xs text-muted-foreground">
        <span>Click any coin to view live chart & technical signals</span>
        <a
          href={
            selectedChain === "all"
              ? "https://dexscreener.com"
              : `https://dexscreener.com/${selectedChain}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span>DexScreener {CHAIN_CONFIG[selectedChain].name}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
