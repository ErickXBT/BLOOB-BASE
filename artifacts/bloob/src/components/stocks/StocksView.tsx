import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Search,
  ArrowUpDown,
  Zap,
  DollarSign,
  Layers,
  BarChart3,
  RefreshCw,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";

export interface StockData {
  symbol: string;
  name: string;
  category: "tech" | "crypto-proxy" | "etf" | "semis" | "growth";
  tvSymbol: string; // TradingView symbol
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCap: string;
  peRatio: number | string;
  volume: string;
  week52Range: string;
  consensus: "Strong Buy" | "Buy" | "Hold" | "Sell";
  targetPrice: number;
  cryptoPairs: Array<{
    cryptoSymbol: string;
    cryptoName: string;
    ratio: number; // 1 stock = X crypto
  }>;
  description: string;
}

export const STOCKS_LIST: StockData[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    category: "semis",
    tvSymbol: "NASDAQ:NVDA",
    price: 138.25,
    change24h: 3.42,
    high24h: 140.10,
    low24h: 134.50,
    marketCap: "$3.39T",
    peRatio: 48.2,
    volume: "58.4M",
    week52Range: "$45.20 - $144.42",
    consensus: "Strong Buy",
    targetPrice: 165.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 138.25 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.048 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 138250 },
    ],
    description: "World leader in GPU computing, Artificial Intelligence hardware, and accelerated computing platforms.",
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    category: "tech",
    tvSymbol: "NASDAQ:TSLA",
    price: 245.80,
    change24h: 4.85,
    high24h: 249.20,
    low24h: 236.40,
    marketCap: "$784.5B",
    peRatio: 62.5,
    volume: "72.1M",
    week52Range: "$138.80 - $271.00",
    consensus: "Buy",
    targetPrice: 280.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 245.80 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.086 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 245800 },
    ],
    description: "Pioneer in electric vehicles, energy storage, autonomous driving technology, and robotics.",
  },
  {
    symbol: "COIN",
    name: "Coinbase Global, Inc.",
    category: "crypto-proxy",
    tvSymbol: "NASDAQ:COIN",
    price: 218.40,
    change24h: 6.28,
    high24h: 224.50,
    low24h: 207.10,
    marketCap: "$54.2B",
    peRatio: 38.4,
    volume: "11.2M",
    week52Range: "$72.50 - $283.48",
    consensus: "Strong Buy",
    targetPrice: 260.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 218.40 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.076 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 218400 },
    ],
    description: "Leading cryptocurrency exchange and Web3 infrastructure company, creator of the Base L2 blockchain.",
  },
  {
    symbol: "MSTR",
    name: "MicroStrategy Incorporated",
    category: "crypto-proxy",
    tvSymbol: "NASDAQ:MSTR",
    price: 340.50,
    change24h: 7.92,
    high24h: 348.00,
    low24h: 318.20,
    marketCap: "$68.1B",
    peRatio: "N/A",
    volume: "18.5M",
    week52Range: "$44.80 - $543.00",
    consensus: "Strong Buy",
    targetPrice: 420.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 340.50 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.119 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 340500 },
    ],
    description: "Bitcoin treasury company and enterprise intelligence analytics software provider.",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    category: "tech",
    tvSymbol: "NASDAQ:AAPL",
    price: 232.15,
    change24h: 1.15,
    high24h: 234.00,
    low24h: 230.80,
    marketCap: "$3.52T",
    peRatio: 34.8,
    volume: "45.1M",
    week52Range: "$164.08 - $237.23",
    consensus: "Buy",
    targetPrice: 250.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 232.15 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.081 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 232150 },
    ],
    description: "Consumer technology leader, maker of the iPhone, Mac, iPad, Apple Watch, and Apple Intelligence.",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    category: "tech",
    tvSymbol: "NASDAQ:MSFT",
    price: 435.60,
    change24h: 1.78,
    high24h: 439.10,
    low24h: 430.50,
    marketCap: "$3.24T",
    peRatio: 36.2,
    volume: "21.3M",
    week52Range: "$366.50 - $468.35",
    consensus: "Strong Buy",
    targetPrice: 490.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 435.60 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.152 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 435600 },
    ],
    description: "Global enterprise software, cloud infrastructure (Azure), and major stakeholder in OpenAI.",
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    category: "etf",
    tvSymbol: "AMEX:SPY",
    price: 588.40,
    change24h: 0.85,
    high24h: 590.20,
    low24h: 585.10,
    marketCap: "$595B",
    peRatio: 26.5,
    volume: "48.2M",
    week52Range: "$490.00 - $602.50",
    consensus: "Buy",
    targetPrice: 620.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 588.40 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.205 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 588400 },
    ],
    description: "The world's most traded exchange-traded fund tracking the benchmark 500 largest US public companies.",
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust (Nasdaq-100)",
    category: "etf",
    tvSymbol: "NASDAQ:QQQ",
    price: 512.30,
    change24h: 1.62,
    high24h: 515.00,
    low24h: 506.80,
    marketCap: "$290B",
    peRatio: 29.8,
    volume: "35.6M",
    week52Range: "$415.00 - $525.00",
    consensus: "Strong Buy",
    targetPrice: 550.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 512.30 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.179 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 512300 },
    ],
    description: "Benchmark ETF tracking 100 of the largest non-financial innovative technology companies on Nasdaq.",
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices, Inc.",
    category: "semis",
    tvSymbol: "NASDAQ:AMD",
    price: 156.40,
    change24h: 2.95,
    high24h: 159.00,
    low24h: 152.10,
    marketCap: "$253.1B",
    peRatio: 45.1,
    volume: "38.2M",
    week52Range: "$116.00 - $227.30",
    consensus: "Buy",
    targetPrice: 185.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 156.40 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.054 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 156400 },
    ],
    description: "Semiconductor manufacturer producing high-performance CPUs, GPUs, and Instinct AI accelerators.",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    category: "tech",
    tvSymbol: "NASDAQ:AMZN",
    price: 198.75,
    change24h: 2.10,
    high24h: 201.20,
    low24h: 195.40,
    marketCap: "$2.08T",
    peRatio: 42.1,
    volume: "40.3M",
    week52Range: "$138.00 - $205.80",
    consensus: "Strong Buy",
    targetPrice: 230.0,
    cryptoPairs: [
      { cryptoSymbol: "USDC", cryptoName: "USD Coin", ratio: 198.75 },
      { cryptoSymbol: "ETH", cryptoName: "Ethereum", ratio: 0.069 },
      { cryptoSymbol: "BLOOB", cryptoName: "Bloob Token", ratio: 198750 },
    ],
    description: "E-commerce giant, cloud computing pioneer (AWS), and leading artificial intelligence infrastructure builder.",
  },
];

export default function StocksView({ showBackButton = false }: { showBackButton?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockData>(STOCKS_LIST[0]);
  const [selectedCryptoPair, setSelectedCryptoPair] = useState<string>("USDC");
  const [cryptoAmountInput, setCryptoAmountInput] = useState<string>("500");
  const [tradeSuccess, setTradeSuccess] = useState(false);

  // Filtered stocks
  const filteredStocks = useMemo(() => {
    return STOCKS_LIST.filter((s) => {
      if (selectedCategory !== "all" && s.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  // Selected crypto pair data
  const currentPair = useMemo(() => {
    return (
      selectedStock.cryptoPairs.find((p) => p.cryptoSymbol === selectedCryptoPair) ||
      selectedStock.cryptoPairs[0]
    );
  }, [selectedStock, selectedCryptoPair]);

  // Calculate synthetic stock shares received
  const sharesEstimated = useMemo(() => {
    const val = parseFloat(cryptoAmountInput);
    if (isNaN(val) || val <= 0 || !currentPair) return "0.00";
    if (currentPair.cryptoSymbol === "USDC") {
      return (val / selectedStock.price).toFixed(4);
    } else if (currentPair.cryptoSymbol === "ETH") {
      // 1 ETH ≈ $2,870
      const ethVal = val * 2870;
      return (ethVal / selectedStock.price).toFixed(4);
    } else if (currentPair.cryptoSymbol === "BLOOB") {
      // 1000 BLOOB ≈ $1.00
      const bloobVal = val * 0.001;
      return (bloobVal / selectedStock.price).toFixed(4);
    }
    return "0.00";
  }, [cryptoAmountInput, currentPair, selectedStock]);

  const handleSimulateTrade = () => {
    setTradeSuccess(true);
    setTimeout(() => setTradeSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 text-white">
      {/* ── Header & RWA Intro ── */}
      <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-emerald-900/30 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black tracking-wider uppercase">
                Real World Assets (RWA)
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Wall St. & 24/7 Crypto Bridge
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tokenized Stocks Market
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Trade fractional US Equities & ETFs directly paired with Crypto (BLOOB, USDC, ETH). 
              Zero traditional broker delays, instant on-chain synthetic settlement.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto bg-black/40 border border-white/8 rounded-2xl p-3">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <div className="text-[11px] text-muted-foreground font-semibold">Total Stock TVL</div>
              <div className="text-base font-black font-mono">$1.48 Billion</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Filters & Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Equities" },
            { id: "crypto-proxy", label: "Crypto Proxies (COIN, MSTR)" },
            { id: "semis", label: "Semiconductors & AI" },
            { id: "tech", label: "Big Tech" },
            { id: "etf", label: "Indices & ETFs" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#12121a] border border-white/8 rounded-xl px-3 py-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stock (e.g. NVDA, TSLA)..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* ── Main Two-Column Layout: Stock Selector Grid + Realtime Chart & Pairing ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Stocks List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredStocks.map((stock) => {
            const isSelected = selectedStock.symbol === stock.symbol;
            return (
              <motion.button
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/10 ring-1 ring-primary/30"
                    : "bg-[#12121a]/90 hover:bg-[#181824] border-white/6 hover:border-white/12"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-black text-xs font-mono text-white flex-shrink-0">
                    {stock.symbol}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white">{stock.symbol}</span>
                      <span className="text-[10px] text-muted-foreground px-1.5 py-0.2 rounded bg-white/5 border border-white/10 font-bold uppercase">
                        {stock.category}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-black text-sm font-mono text-white">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-black font-mono flex items-center justify-end gap-1 ${
                      stock.change24h >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {stock.change24h >= 0 ? "+" : ""}
                    {stock.change24h.toFixed(2)}%
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right Column: Interactive TradingView Chart & Crypto-Stock Pairing Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Stock Header Card */}
          <div className="bg-[#12121a] border border-white/8 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{selectedStock.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-black">
                  {selectedStock.symbol}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                  {selectedStock.consensus}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {selectedStock.description}
              </p>
            </div>

            <div className="text-left sm:text-right flex-shrink-0">
              <div className="text-2xl font-black font-mono text-white">
                ${selectedStock.price.toFixed(2)}
              </div>
              <div
                className={`text-xs font-bold font-mono ${
                  selectedStock.change24h >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {selectedStock.change24h >= 0 ? "+" : ""}
                {selectedStock.change24h.toFixed(2)}% Today
              </div>
            </div>
          </div>

          {/* ── Interactive TradingView Live Stock Chart ── */}
          <div className="bg-[#12121a] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {selectedStock.symbol} Live Candlestick Chart (TradingView)
                </span>
              </div>
              <a
                href={`https://www.tradingview.com/symbols/${selectedStock.tvSymbol.replace(":", "-")}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-bold"
              >
                <span>Full Chart</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative w-full h-[360px] bg-black/60">
              <iframe
                key={selectedStock.tvSymbol}
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_stocks&symbol=${encodeURIComponent(
                  selectedStock.tvSymbol
                )}&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en`}
                width="100%"
                height="100%"
                frameBorder="0"
                title={`${selectedStock.symbol} Stock Chart`}
                className="w-full h-full"
                allowTransparency
              />
            </div>
          </div>

          {/* Key Fundamentals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#12121a] border border-white/8 rounded-xl p-2.5">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Day Range</div>
              <div className="text-xs font-black font-mono mt-0.5">
                ${selectedStock.low24h} - ${selectedStock.high24h}
              </div>
            </div>
            <div className="bg-[#12121a] border border-white/8 rounded-xl p-2.5">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Market Cap</div>
              <div className="text-xs font-black font-mono mt-0.5">{selectedStock.marketCap}</div>
            </div>
            <div className="bg-[#12121a] border border-white/8 rounded-xl p-2.5">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">P/E Ratio</div>
              <div className="text-xs font-black font-mono mt-0.5">{selectedStock.peRatio}</div>
            </div>
            <div className="bg-[#12121a] border border-white/8 rounded-xl p-2.5">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Target Price</div>
              <div className="text-xs font-black font-mono text-emerald-400 mt-0.5">
                ${selectedStock.targetPrice.toFixed(2)}
              </div>
            </div>
          </div>

          {/* ── Crypto-Stock Pairing & Swap Simulator ── */}
          <div className="bg-gradient-to-br from-[#131320] to-[#0c0c14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">
                    Stock / Crypto Pairing Bridge
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Convert crypto directly into tokenized {selectedStock.symbol}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-primary">
                1 {selectedStock.symbol} = {currentPair.ratio.toLocaleString()} {currentPair.cryptoSymbol}
              </span>
            </div>

            {/* Pair Selector Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Pay with:</span>
              {selectedStock.cryptoPairs.map((pair) => (
                <button
                  key={pair.cryptoSymbol}
                  onClick={() => setSelectedCryptoPair(pair.cryptoSymbol)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                    selectedCryptoPair === pair.cryptoSymbol
                      ? "bg-primary text-white shadow-md"
                      : "bg-white/5 text-muted-foreground hover:text-white"
                  }`}
                >
                  {pair.cryptoSymbol}
                </button>
              ))}
            </div>

            {/* Input & Output Bridge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-black/40 border border-white/8 rounded-xl p-3">
                <div className="text-[10px] text-muted-foreground font-semibold mb-1">
                  You Pay ({selectedCryptoPair})
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={cryptoAmountInput}
                    onChange={(e) => setCryptoAmountInput(e.target.value)}
                    className="w-full bg-transparent text-lg font-black font-mono text-white outline-none"
                    placeholder="0.00"
                  />
                  <span className="text-xs font-bold text-muted-foreground">
                    {selectedCryptoPair}
                  </span>
                </div>
              </div>

              <div className="bg-black/40 border border-white/8 rounded-xl p-3">
                <div className="text-[10px] text-muted-foreground font-semibold mb-1">
                  You Receive (Synthetic {selectedStock.symbol})
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black font-mono text-emerald-400">
                    ≈ {sharesEstimated}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    Shares ({selectedStock.symbol})
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSimulateTrade}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-black text-sm shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>
                Execute Instant Swap: {cryptoAmountInput} {selectedCryptoPair} → {sharesEstimated} {selectedStock.symbol}
              </span>
            </button>

            {tradeSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>
                  Synthetic pair executed! {sharesEstimated} units of {selectedStock.symbol} minted to on-chain portfolio.
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
