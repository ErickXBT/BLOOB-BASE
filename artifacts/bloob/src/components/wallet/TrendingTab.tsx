import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp, ExternalLink, Loader2, RefreshCw, Flame } from "lucide-react";

interface DexToken {
  tokenAddress: string;
  chainId: string;
  icon?: string;
  name?: string;
  symbol?: string;
  price?: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
  pairAddress?: string;
  liquidity?: number;
}

function TokenAvatar({ logo, symbol, size = 32 }: { logo?: string; symbol: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const COLORS = ["bg-blue-500","bg-purple-500","bg-emerald-500","bg-orange-500","bg-pink-500","bg-cyan-500","bg-yellow-500","bg-red-500"];
  const color = COLORS[symbol.charCodeAt(0) % COLORS.length];
  if (logo && !failed) {
    return (
      <img
        src={logo} alt={symbol}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className={`${color} rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {symbol?.[0] ?? "?"}
    </div>
  );
}

function fmt(n: number | undefined, prefix = "$"): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `${prefix}${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `${prefix}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `${prefix}${(n / 1_000).toFixed(2)}K`;
  return `${prefix}${n.toFixed(4)}`;
}

function fmtPrice(p: number | undefined): string {
  if (!p) return "—";
  if (p < 0.000001) return `$${p.toExponential(2)}`;
  if (p < 0.01)     return `$${p.toFixed(8)}`;
  if (p < 1)        return `$${p.toFixed(6)}`;
  return `$${p.toFixed(2)}`;
}

export default function TrendingTab() {
  const [, navigate] = useLocation();
  const [tokens, setTokens] = useState<DexToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTrending = async () => {
    setLoading(true);
    setError("");
    try {
      // Step 1: Get top boosted tokens on Base
      const boostRes = await fetch("https://api.dexscreener.com/token-boosts/top/v1");
      if (!boostRes.ok) throw new Error("Failed to fetch trending data");
      const boostData: Array<{ chainId: string; tokenAddress: string; icon?: string; description?: string }> =
        await boostRes.json();

      const baseTokens = boostData
        .filter(t => t.chainId === "base")
        .slice(0, 30);

      if (baseTokens.length === 0) {
        setTokens([]);
        return;
      }

      // Step 2: Fetch pair data for these tokens
      const addresses = baseTokens.map(t => t.tokenAddress).join(",");
      const pairsRes = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${addresses}`
      );
      if (!pairsRes.ok) throw new Error("Failed to fetch token data");
      const pairsData = await pairsRes.json();

      const pairs: Array<{
        baseToken: { address: string; name: string; symbol: string };
        priceUsd?: string;
        priceChange?: { h24: number };
        volume?: { h24: number };
        marketCap?: number;
        pairAddress: string;
        liquidity?: { usd: number };
        info?: { imageUrl?: string };
      }> = pairsData.pairs ?? [];

      // Merge boosted + pair data, dedupe by tokenAddress, pick highest liquidity pair
      const seen = new Set<string>();
      const merged: DexToken[] = [];

      for (const boosted of baseTokens) {
        if (seen.has(boosted.tokenAddress.toLowerCase())) continue;
        seen.add(boosted.tokenAddress.toLowerCase());

        const tokenPairs = pairs
          .filter(p => p.baseToken.address.toLowerCase() === boosted.tokenAddress.toLowerCase())
          .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));

        const best = tokenPairs[0];
        merged.push({
          tokenAddress: boosted.tokenAddress,
          chainId: "base",
          icon: best?.info?.imageUrl ?? boosted.icon,
          name: best?.baseToken.name ?? "Unknown",
          symbol: best?.baseToken.symbol ?? "???",
          price: best?.priceUsd ? parseFloat(best.priceUsd) : undefined,
          priceChange24h: best?.priceChange?.h24,
          volume24h: best?.volume?.h24,
          marketCap: best?.marketCap,
          pairAddress: best?.pairAddress,
          liquidity: best?.liquidity?.usd,
        });
      }

      setTokens(merged);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e?.message ?? "Failed to load trending data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrending(); }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchTrending, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading trending tokens…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-sm text-red-400 text-center">{error}</p>
        <button
          onClick={fetchTrending}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="font-black text-sm">Trending on Base</span>
          <span className="text-xs text-muted-foreground">via DexScreener</span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={fetchTrending}
            className="p-1.5 text-muted-foreground hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-1 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
        <span>Token</span>
        <span className="text-right">Price</span>
        <span className="text-right w-16">24h</span>
      </div>

      {/* Token rows */}
      <div className="space-y-1">
        {tokens.map((token, i) => (
          <motion.button
            key={token.tokenAddress}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => navigate(`/wallet/token/${token.tokenAddress}`)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/6 transition-colors group"
          >
            {/* Rank */}
            <span className="text-xs text-muted-foreground w-4 flex-shrink-0 font-mono">{i + 1}</span>

            {/* Logo + name */}
            <TokenAvatar logo={token.icon} symbol={token.symbol ?? "?"} size={36} />
            <div className="flex-1 text-left min-w-0">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                {token.symbol}
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xs text-muted-foreground truncate">{token.name}</div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-sm text-white">{fmtPrice(token.price)}</div>
              <div className="text-xs text-muted-foreground">{fmt(token.volume24h)} vol</div>
            </div>

            {/* 24h change */}
            <div className={`text-right w-14 flex-shrink-0 font-bold text-sm ${
              token.priceChange24h === undefined ? "text-muted-foreground"
              : token.priceChange24h >= 0 ? "text-emerald-400" : "text-red-400"
            }`}>
              {token.priceChange24h !== undefined
                ? `${token.priceChange24h >= 0 ? "+" : ""}${token.priceChange24h.toFixed(2)}%`
                : "—"
              }
            </div>
          </motion.button>
        ))}
      </div>

      {tokens.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-8">No trending tokens found</p>
      )}

      <div className="flex justify-center pt-2">
        <a
          href="https://dexscreener.com/base"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          View full trending on DexScreener
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
