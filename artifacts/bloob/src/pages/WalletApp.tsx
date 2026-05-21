import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { LogOut, Settings, Copy, Check, LayoutDashboard, ArrowUpRight, ArrowDownLeft, RefreshCw, Flame, ChevronDown, Key, Trash2, X } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import PortfolioTab from "@/components/wallet/PortfolioTab";
import SendTab from "@/components/wallet/SendTab";
import ReceiveTab from "@/components/wallet/ReceiveTab";
import SwapTab from "@/components/wallet/SwapTab";
import TrendingTab from "@/components/wallet/TrendingTab";
import bloobLogo from "@assets/bloob_logo.png";

type Tab = "portfolio" | "send" | "receive" | "swap" | "trending";

function truncate(s: string) {
  return s ? `${s.slice(0, 6)}…${s.slice(-4)}` : "";
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const { exportPrivateKey, exportMnemonic, deleteWallet, lock } = useWallet();
  const [, navigate] = useLocation();
  const [showKey, setShowKey] = useState(false);
  const [showPhrase, setShowPhrase] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const pk = exportPrivateKey();
  const phrase = exportMnemonic();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black">Wallet Settings</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Private Key</span>
            </div>
            <button onClick={() => setShowKey(p => !p)} className="text-xs text-primary font-bold">
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          {showKey && pk && (
            <p className="text-xs font-mono text-yellow-400 break-all bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">{pk}</p>
          )}
          {!showKey && <p className="text-xs text-muted-foreground">Reveal your private key to import into MetaMask, Phantom, or any EVM wallet.</p>}
        </div>

        {phrase && (
          <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Seed Phrase</span>
              </div>
              <button onClick={() => setShowPhrase(p => !p)} className="text-xs text-primary font-bold">
                {showPhrase ? "Hide" : "Show"}
              </button>
            </div>
            {showPhrase && (
              <p className="text-xs font-mono text-yellow-400 break-all bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">{phrase}</p>
            )}
            {!showPhrase && <p className="text-xs text-muted-foreground">12-word recovery phrase compatible with all BIP39 wallets.</p>}
          </div>
        )}

        <button
          onClick={() => { lock(); navigate("/wallet"); }}
          className="w-full flex items-center justify-center gap-2 bg-white/6 border border-white/10 text-white font-bold rounded-2xl py-3 hover:bg-white/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Lock Wallet
        </button>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-500/8 border border-red-500/20 text-red-400 font-bold rounded-2xl py-3 hover:bg-red-500/14 transition-all text-sm"
          >
            <Trash2 className="w-4 h-4" /> Remove Wallet from Device
          </button>
        ) : (
          <div className="bg-red-500/8 border border-red-500/20 rounded-2xl p-4 space-y-3">
            <p className="text-sm text-red-400 text-center font-semibold">Are you sure? This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 rounded-xl bg-white/8 text-white text-sm font-bold">Cancel</button>
              <button onClick={() => { deleteWallet(); navigate("/wallet"); }} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-bold">Delete</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function WalletApp() {
  const { address, isLocked, hasWallet, refreshBalances } = useWallet();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!hasWallet || isLocked) navigate("/wallet");
  }, [hasWallet, isLocked]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "portfolio", label: "Portfolio", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: "send",      label: "Send",      icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
    { id: "receive",   label: "Receive",   icon: <ArrowDownLeft className="w-3.5 h-3.5" /> },
    { id: "swap",      label: "Swap",      icon: <RefreshCw className="w-3.5 h-3.5" /> },
    { id: "trending",  label: "Trending",  icon: <Flame className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#050505] flex flex-col">
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-white/6">
        <Link href="/" className="flex items-center gap-2 group">
          <img src={bloobLogo} alt="BLOOB" className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="font-black text-sm group-hover:text-primary transition-colors">BLOOB Wallet</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary">Base</span>
          </div>

          <button
            onClick={copyAddress}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/6 border border-white/10 rounded-full text-xs font-mono text-white hover:bg-white/10 transition-all"
          >
            {truncate(address ?? "")}
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
          </button>

          <button onClick={refreshBalances} className="p-1.5 text-muted-foreground hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowSettings(true)} className="p-1.5 text-muted-foreground hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Tab bar — scrollable for 5 tabs */}
      <div className="flex border-b border-white/6 overflow-x-auto scrollbar-none">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 flex-shrink-0 px-4 py-3 text-xs font-bold transition-colors ${
              activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white/70"
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "portfolio" && <PortfolioTab />}
            {activeTab === "send"      && <SendTab />}
            {activeTab === "receive"   && <ReceiveTab />}
            {activeTab === "swap"      && <SwapTab />}
            {activeTab === "trending"  && <TrendingTab />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
