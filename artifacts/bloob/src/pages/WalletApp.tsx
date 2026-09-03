import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Copy, Check, RefreshCw, Flame, ArrowUpRight,
  ArrowDownLeft, ArrowLeftRight, X, Key, Trash2, LogOut,
  ExternalLink, Search, ChevronDown, TrendingUp, TrendingDown,
} from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import SwapTab from "@/components/wallet/SwapTab";
import TrendingTab from "@/components/wallet/TrendingTab";
import SendTab from "@/components/wallet/SendTab";
import ReceiveTab from "@/components/wallet/ReceiveTab";
import StocksView from "@/components/stocks/StocksView";
import TokenAnalyzerView from "@/components/analyzer/TokenAnalyzerView";
import GalleryView from "@/components/gallery/GalleryView";
import bloobLogo from "@assets/bloob_logo.png";

// ─── Constants ────────────────────────────────────────────────────────────────
const ETH_LOGO  = "https://assets.coingecko.com/coins/images/279/small/ethereum.png";
const USDC_LOGO = "https://assets.coingecko.com/coins/images/6319/small/usdc.png";

type MainTab    = "wallet" | "swap" | "trending" | "stocks" | "analyzer" | "gallery" | "activity";
type ModalPanel = "send" | "receive" | "settings" | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function truncate(s: string, n = 6) { return s ? `${s.slice(0, n)}…${s.slice(-4)}` : ""; }
function fmtTime(ts: string) {
  const d = new Date(parseInt(ts) * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Token Avatar ─────────────────────────────────────────────────────────────
function TokenAvatar({ logo, symbol, size = 36 }: { logo?: string; symbol: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const COLORS = ["bg-blue-500","bg-purple-500","bg-emerald-500","bg-orange-500","bg-pink-500","bg-cyan-500"];
  const color = COLORS[symbol.charCodeAt(0) % COLORS.length];
  if (logo && !failed) {
    return <img src={logo} alt={symbol} style={{ width: size, height: size }} className="rounded-full object-cover flex-shrink-0" onError={() => setFailed(true)} />;
  }
  return (
    <div className={`${color} rounded-full flex items-center justify-center text-white font-black flex-shrink-0`} style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {symbol[0]}
    </div>
  );
}

// ─── Settings Modal ───────────────────────────────────────────────────────────
function SettingsModal({ onClose }: { onClose: () => void }) {
  const { exportPrivateKey, exportMnemonic, deleteWallet, lock } = useWallet();
  const [, navigate] = useLocation();
  const [showKey, setShowKey]       = useState(false);
  const [showPhrase, setShowPhrase] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const pk     = exportPrivateKey();
  const phrase = exportMnemonic();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#13131a] border border-white/10 rounded-3xl p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black">Wallet Settings</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        {/* Private key */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Key className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-semibold">Private Key</span></div>
            <button onClick={() => setShowKey(p => !p)} className="text-xs text-primary font-bold">{showKey ? "Hide" : "Show"}</button>
          </div>
          {showKey && pk
            ? <p className="text-xs font-mono text-yellow-400 break-all bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">{pk}</p>
            : <p className="text-xs text-muted-foreground">Import into MetaMask, Phantom, or any EVM wallet.</p>}
        </div>
        {/* Seed phrase */}
        {phrase && (
          <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Key className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-semibold">Seed Phrase</span></div>
              <button onClick={() => setShowPhrase(p => !p)} className="text-xs text-primary font-bold">{showPhrase ? "Hide" : "Show"}</button>
            </div>
            {showPhrase
              ? <p className="text-xs font-mono text-yellow-400 break-all bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">{phrase}</p>
              : <p className="text-xs text-muted-foreground">12-word BIP39 recovery phrase.</p>}
          </div>
        )}
        <button onClick={() => { lock(); navigate("/wallet"); }} className="w-full flex items-center justify-center gap-2 bg-white/6 border border-white/10 text-white font-bold rounded-2xl py-3 hover:bg-white/10 transition-all">
          <LogOut className="w-4 h-4" /> Lock Wallet
        </button>
        {!confirmDel
          ? <button onClick={() => setConfirmDel(true)} className="w-full flex items-center justify-center gap-2 bg-red-500/8 border border-red-500/20 text-red-400 font-bold rounded-2xl py-3 hover:bg-red-500/14 transition-all text-sm">
              <Trash2 className="w-4 h-4" /> Remove Wallet from Device
            </button>
          : <div className="bg-red-500/8 border border-red-500/20 rounded-2xl p-4 space-y-3">
              <p className="text-sm text-red-400 text-center font-semibold">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDel(false)} className="flex-1 py-2 rounded-xl bg-white/8 text-white text-sm font-bold">Cancel</button>
                <button onClick={() => { deleteWallet(); navigate("/wallet"); }} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-bold">Delete</button>
              </div>
            </div>
        }
      </motion.div>
    </div>
  );
}

// ─── Slide-up Panel (Send / Receive) ─────────────────────────────────────────
function SlidePanel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-lg bg-[#13131a] border-t border-x border-white/10 rounded-t-3xl p-6 max-h-[85dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-base">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-white p-1"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

// ─── Coin Card ─────────────────────────────────────────────────────────────────
function CoinCard({
  logo, symbol, name, balance, usdValue,
}: { logo: string; symbol: string; name: string; balance: string; usdValue?: string }) {
  return (
    <div className="bg-[#1a1a24] border border-white/8 rounded-2xl p-4 flex items-center gap-3 hover:border-white/16 transition-colors">
      <TokenAvatar logo={logo} symbol={symbol} size={38} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="font-bold text-sm text-white">{symbol}</span>
          <div className="w-3.5 h-3.5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-2 h-2 text-primary" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">{name}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-white">{balance}</p>
        <p className="text-xs text-muted-foreground">{usdValue ?? "$0.00"}</p>
      </div>
    </div>
  );
}

// ─── Main WalletApp ────────────────────────────────────────────────────────────
export default function WalletApp() {
  const { address, isLocked, hasWallet, balances, txHistory, isLoadingBalances, refreshBalances, lock } = useWallet();
  const [, navigate] = useLocation();

  const [mainTab,  setMainTab]  = useState<MainTab>("wallet");
  const [modal,    setModal]    = useState<ModalPanel>(null);
  const [copied,   setCopied]   = useState(false);
  const [search,   setSearch]   = useState("");
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!hasWallet || isLocked) navigate("/wallet");
  }, [hasWallet, isLocked]);

  // Fetch ETH price from CoinGecko
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
      .then(r => r.json())
      .then(d => setEthPrice(d?.ethereum?.usd ?? null))
      .catch(() => {});
  }, []);

  const copyAddress = () => {
    if (address) { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const ethBalance  = balances.find(b => b.symbol === "ETH")?.balance  ?? "0";
  const usdcBalance = balances.find(b => b.symbol === "USDC")?.balance ?? "0";
  const totalUsd = ethPrice
    ? (parseFloat(ethBalance) * ethPrice + parseFloat(usdcBalance)).toFixed(2)
    : null;
  const ethUsd   = ethPrice ? (parseFloat(ethBalance) * ethPrice).toFixed(2) : null;

  const NAV_TABS: { id: MainTab; label: string }[] = [
    { id: "wallet",   label: "WALLET" },
    { id: "swap",     label: "SWAP" },
    { id: "trending", label: "TRENDING" },
    { id: "stocks",   label: "STOCKS" },
    { id: "analyzer", label: "ANALYZER" },
    { id: "gallery",  label: "GALLERY" },
    { id: "activity", label: "ACTIVITY" },
  ];

  const ACTION_BTNS = [
    { icon: <ArrowDownLeft className="w-4 h-4" />, label: "RECEIVE", onClick: () => setModal("receive") },
    { icon: <ArrowUpRight  className="w-4 h-4" />, label: "SEND",    onClick: () => setModal("send"),    primary: true },
    { icon: <ArrowLeftRight className="w-4 h-4" />, label: "SWAP",   onClick: () => { setModal(null); setMainTab("swap"); } },
    { icon: <Flame          className="w-4 h-4" />, label: "TRENDING", onClick: () => { setModal(null); setMainTab("trending"); } },
  ];

  const COINS_ALL = [
    { logo: ETH_LOGO,  symbol: "ETH",  name: "Ethereum on Base", balance: ethBalance,  usdValue: ethUsd  ? `$${ethUsd}`  : "$0.00" },
    { logo: USDC_LOGO, symbol: "USDC", name: "USD Coin (Base)",  balance: usdcBalance, usdValue: `$${parseFloat(usdcBalance).toFixed(2)}` },
  ];

  const filteredCoins = COINS_ALL.filter(c =>
    !search || c.symbol.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[100dvh] bg-[#0d0d12] flex flex-col">
      {/* ── Modals ── */}
      {modal === "settings" && <SettingsModal onClose={() => setModal(null)} />}
      <AnimatePresence>
        {modal === "send" && (
          <SlidePanel title="Send" onClose={() => setModal(null)}>
            <SendTab />
          </SlidePanel>
        )}
        {modal === "receive" && (
          <SlidePanel title="Receive" onClose={() => setModal(null)}>
            <ReceiveTab />
          </SlidePanel>
        )}
      </AnimatePresence>

      {/* ── Top Nav ── */}
      <header className="border-b border-white/6 bg-[#0d0d12] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <img src={bloobLogo} alt="BLOOB" className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="font-black text-sm hidden sm:block group-hover:text-primary transition-colors">BLOOB</span>
          </Link>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1 flex-1">
            {NAV_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all ${
                  mainTab === tab.id
                    ? "text-white bg-white/8"
                    : "text-muted-foreground hover:text-white/70"
                }`}
              >
                {tab.label}
                {mainTab === tab.id && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/8 rounded-full text-xs font-mono text-white">
              {parseFloat(ethBalance).toFixed(4)} ETH
            </div>
            <button onClick={() => setModal("settings")} className="p-2 text-muted-foreground hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => { lock(); navigate("/wallet"); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-white border border-white/10 rounded-full transition-all hover:bg-white/5"
            >
              <LogOut className="w-3 h-3" /> DISCONNECT
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">

          {/* ── WALLET TAB ── */}
          {mainTab === "wallet" && (
            <motion.div key="wallet" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Title row */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-black tracking-tight">WALLET</h1>
                  <button onClick={copyAddress} className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground hover:text-white transition-colors font-mono group">
                    {truncate(address ?? "", 8)}
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setModal("settings")} className="p-2 text-muted-foreground hover:text-white transition-colors sm:hidden">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Account pill */}
              <div className="mb-5">
                <button className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-full px-3 py-2 hover:bg-white/10 transition-all">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black flex-shrink-0">A</div>
                  <span className="text-xs font-bold text-white">Account 1</span>
                  <span className="text-xs text-muted-foreground font-mono">{truncate(address ?? "")}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>

              {/* Balance label */}
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Balance</p>

              {/* ── Balance Card ── */}
              <div className="relative rounded-3xl overflow-hidden mb-6" style={{ background: "linear-gradient(135deg, #13131f 0%, #181828 60%, #0f1a2e 100%)" }}>
                {/* Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-8 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative p-5 sm:p-7">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Available Balance</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-400">MAINNET</span>
                      </div>
                      <button onClick={refreshBalances} className={`text-muted-foreground hover:text-white transition-colors ${isLoadingBalances ? "animate-spin" : ""}`}>
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total USD */}
                  <div className="mb-1">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {totalUsd ? `$${parseFloat(totalUsd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}
                    </span>
                  </div>

                  {/* Token breakdowns */}
                  <div className="flex flex-wrap gap-3 mb-2">
                    <span className="text-sm text-muted-foreground font-mono">
                      {parseFloat(ethBalance).toFixed(6)} ETH
                      {ethUsd ? <span className="text-white/50"> ≈ ${parseFloat(ethUsd).toLocaleString()}</span> : ""}
                    </span>
                    {parseFloat(usdcBalance) > 0 && (
                      <span className="text-sm text-muted-foreground font-mono">
                        {parseFloat(usdcBalance).toLocaleString()} USDC
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  <button onClick={copyAddress} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors font-mono mb-6 group">
                    {truncate(address ?? "", 10)}
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>

                  {/* ── Action Buttons ── */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {ACTION_BTNS.map(btn => (
                      <button
                        key={btn.label}
                        onClick={btn.onClick}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-black tracking-wider transition-all ${
                          btn.primary
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "bg-white/8 border border-white/10 text-white hover:bg-white/14"
                        }`}
                      >
                        {btn.icon}
                        <span className="hidden sm:block">{btn.label}</span>
                        <span className="sm:hidden text-[10px]">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Coins Section ── */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Coins</span>
              </div>

              {/* Search */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 flex items-center gap-2 bg-[#1a1a24] border border-white/8 rounded-xl px-3 py-2.5">
                  <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by CA or name"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground outline-none"
                  />
                </div>
              </div>

              {/* ALL COINS label */}
              <p className="text-xs text-muted-foreground mb-3 font-semibold">ALL COINS</p>

              {/* Coins grid — 2 on mobile, 3 on desktop */}
              {isLoadingBalances && balances.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[0,1,2].map(i => <div key={i} className="h-20 bg-white/4 rounded-2xl animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredCoins.map((coin, i) => (
                    <motion.div key={coin.symbol} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <CoinCard {...coin} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── SWAP TAB ── */}
          {mainTab === "swap" && (
            <motion.div key="swap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black tracking-tight">SWAP</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400">MAINNET · Uniswap V3</span>
                </div>
              </div>
              <div className="max-w-md">
                <SwapTab />
              </div>
            </motion.div>
          )}

          {/* ── TRENDING TAB ── */}
          {mainTab === "trending" && (
            <motion.div key="trending" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-2xl font-black tracking-tight">TRENDING COINS</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time market feeds across Solana, Base, Robinhood & BSC
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/15 via-purple-500/15 to-blue-500/15 border border-white/10 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span className="text-xs font-black bg-gradient-to-r from-orange-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
                    DexScreener Stream
                  </span>
                </div>
              </div>
              <div className="max-w-4xl">
                <TrendingTab />
              </div>
            </motion.div>
          )}

          {/* ── STOCKS TAB ── */}
          {mainTab === "stocks" && (
            <motion.div key="stocks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <StocksView />
            </motion.div>
          )}

          {/* ── ANALYZER TAB ── */}
          {mainTab === "analyzer" && (
            <motion.div key="analyzer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TokenAnalyzerView />
            </motion.div>
          )}

          {/* ── GALLERY TAB ── */}
          {mainTab === "gallery" && (
            <motion.div key="gallery" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <GalleryView />
            </motion.div>
          )}

          {/* ── ACTIVITY TAB ── */}
          {mainTab === "activity" && (
            <motion.div key="activity" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black tracking-tight">ACTIVITY</h1>
                <button onClick={refreshBalances} className={`text-muted-foreground hover:text-white transition-colors ${isLoadingBalances ? "animate-spin" : ""}`}>
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              {txHistory.length === 0 && !isLoadingBalances ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">No transactions yet.</p>
                  <p className="text-xs text-muted-foreground">Fund your wallet on Base to get started.</p>
                </div>
              ) : (
                <div className="space-y-2 max-w-2xl">
                  {txHistory.map(tx => {
                    const isSend = tx.from.toLowerCase() === address?.toLowerCase();
                    return (
                      <a
                        key={tx.hash}
                        href={`https://basescan.org/tx/${tx.hash}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-[#1a1a24] border border-white/8 rounded-2xl px-4 py-3.5 hover:border-white/16 transition-colors group"
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSend ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {isSend ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white">{isSend ? "Sent" : "Received"}</p>
                          <p className="text-xs text-muted-foreground">{fmtTime(tx.timeStamp)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold ${isSend ? "text-red-400" : "text-emerald-400"}`}>
                            {isSend ? "−" : "+"}{(Number(tx.value ?? 0) / 1e18).toFixed(6)} ETH
                          </p>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
