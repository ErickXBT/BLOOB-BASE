import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowRight, ExternalLink, Radio, Zap } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Region {
  name: string;
  nodes: number;
  uptime: number;
  avgMs: number;
  txToday: number;
}

interface Transaction {
  id: string;
  amount: number;
  token: "USDC" | "ETH" | "BASE";
  from: string;
  to: string;
  ts: number;
  type: "sms" | "online";
}

interface Incident {
  date: string;
  title: string;
  duration: number;
  status: "RESOLVED" | "MONITORING";
}

// ─── Static data ─────────────────────────────────────────────────────────────

const BASE_REGIONS: Region[] = [
  { name: "Africa",       nodes: 204, uptime: 99.91, avgMs: 2100, txToday: 4_102 },
  { name: "Asia Pacific", nodes: 318, uptime: 99.98, avgMs: 1400, txToday: 6_204 },
  { name: "Europe",       nodes: 246, uptime: 99.96, avgMs: 1300, txToday: 3_891 },
  { name: "Americas",     nodes: 187, uptime: 99.95, avgMs: 1900, txToday: 2_773 },
  { name: "Middle East",  nodes:  68, uptime: 99.72, avgMs: 2900, txToday:   438 },
  { name: "Oceania",      nodes:  41, uptime: 99.88, avgMs: 2200, txToday:   219 },
];

const INCIDENTS: Incident[] = [
  { date: "May 14, 2025", title: "West Africa relay cluster — elevated latency", duration: 18, status: "RESOLVED" },
  { date: "Apr 29, 2025", title: "Jakarta node latency spike (4.1s avg)",        duration:  5, status: "RESOLVED" },
  { date: "Apr 12, 2025", title: "São Paulo relay software rollback",              duration:  9, status: "RESOLVED" },
];

const CITIES = [
  ["Lagos, NG", "Accra, GH"],   ["Nairobi, KE", "Dar es Salaam, TZ"],
  ["Mumbai, IN", "Dhaka, BD"],  ["Jakarta, ID", "Manila, PH"],
  ["London, UK", "Berlin, DE"], ["NYC, US", "Toronto, CA"],
  ["Lima, PE", "Bogotá, CO"],   ["Dubai, AE", "Riyadh, SA"],
  ["Sydney, AU", "Auckland, NZ"],
];

const TOKENS: Transaction["token"][] = ["USDC", "ETH", "BASE"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

function makeTx(): Transaction {
  const pair = CITIES[Math.floor(Math.random() * CITIES.length)];
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const amount =
    token === "USDC" ? Math.round(randBetween(0.5, 200) * 100) / 100
    : token === "ETH" ? Math.round(randBetween(0.001, 0.5) * 1000) / 1000
    : Math.round(randBetween(1, 500) * 100) / 100;
  return {
    id: Math.random().toString(36).slice(2, 10),
    amount,
    token,
    from: pair[0],
    to: pair[1],
    ts: Date.now(),
    type: Math.random() > 0.3 ? "sms" : "online",
  };
}

function fmtAgo(ms: number) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

function fmtMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function fmtNum(n: number) {
  return n.toLocaleString();
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl px-6 py-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-white tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function TxBadge({ type }: { type: Transaction["type"] }) {
  return type === "sms" ? (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground bg-white/4">SMS</span>
  ) : (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/8">ONLINE</span>
  );
}

function TokenChip({ token }: { token: Transaction["token"] }) {
  const colors: Record<Transaction["token"], string> = {
    USDC: "text-cyan-400 bg-cyan-400/8 border-cyan-400/20",
    ETH:  "text-violet-400 bg-violet-400/8 border-violet-400/20",
    BASE: "text-primary bg-primary/8 border-primary/20",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors[token]}`}>{token}</span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function NetworkPage() {
  // Live stats
  const [totalNodes, setTotalNodes] = useState(1064);
  const [txToday, setTxToday] = useState(17_627);
  const [uptime] = useState(99.94);
  const [countries] = useState(194);

  // Region jitter
  const [regions, setRegions] = useState<Region[]>(BASE_REGIONS);

  // Transactions feed
  const [txFeed, setTxFeed] = useState<Transaction[]>(() =>
    Array.from({ length: 6 }, makeTx)
  );
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ticker for new TXs every 2–4 s
  useEffect(() => {
    function schedule() {
      tickRef.current = setTimeout(() => {
        setTxFeed((prev) => [makeTx(), ...prev.slice(0, 7)]);
        setTxToday((n) => n + Math.floor(Math.random() * 3) + 1);
        setLastUpdated(Date.now());
        // Occasionally jitter node counts
        if (Math.random() > 0.6) {
          setTotalNodes((n) => n + (Math.random() > 0.5 ? 1 : -1));
          setRegions((prev) =>
            prev.map((r) => ({
              ...r,
              txToday: r.txToday + Math.floor(Math.random() * 2),
              avgMs: Math.round(r.avgMs + randBetween(-60, 60)),
            }))
          );
        }
        schedule();
      }, Math.floor(randBetween(1800, 3600)));
    }
    schedule();
    return () => { if (tickRef.current) clearTimeout(tickRef.current); };
  }, []);

  // Relative time re-render
  const [, forceRender] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => forceRender((n) => n + 1), 5000);
    return () => clearInterval(iv);
  }, []);

  // Last updated label
  const [updatedLabel, setUpdatedLabel] = useState("just now");
  useEffect(() => {
    const iv = setInterval(() => {
      const s = Math.floor((Date.now() - lastUpdated) / 1000);
      setUpdatedLabel(s < 5 ? "just now" : `${s}s ago`);
    }, 1000);
    return () => clearInterval(iv);
  }, [lastUpdated]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8">

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-8"
          >
            <span className="relative flex w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">All Systems Operational</span>
          </motion.div>

          {/* Hero heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-4"
          >
            Network<br />
            <span className="text-primary">Status.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="text-muted-foreground mb-10 max-w-lg"
          >
            Real-time status of BLOOB's global SMS relay infrastructure on Base.{" "}
            <strong className="text-white">{fmtNum(totalNodes)}</strong> active nodes across{" "}
            <strong className="text-white">{countries}</strong> countries.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            <StatCard label="Active Relay Nodes" value={fmtNum(totalNodes)} icon={<Radio className="w-4 h-4" />} />
            <StatCard label="Countries" value={String(countries)} icon={<span className="text-sm font-black">🌐</span>} />
            <StatCard label="TX Today" value={fmtNum(txToday)} icon={<Zap className="w-4 h-4" />} />
            <StatCard label="30-day Uptime" value={`${uptime}%`} icon={<span className="text-sm font-black">✓</span>} />
          </motion.div>

          {/* Region status table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="bg-[#0d0d0d] border border-white/6 rounded-3xl overflow-hidden mb-8"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
              <h2 className="text-sm font-black text-white">Region Status</h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                Updated {updatedLabel}
              </span>
            </div>

            {/* Header row */}
            <div className="hidden md:grid grid-cols-[1fr_80px_90px_80px_110px_80px] gap-4 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-white/4">
              <span>Region</span>
              <span>Nodes</span>
              <span>Uptime</span>
              <span>Avg</span>
              <span>TX Today</span>
              <span className="text-right">Status</span>
            </div>

            {regions.map((r, i) => (
              <div
                key={r.name}
                className="grid md:grid-cols-[1fr_80px_90px_80px_110px_80px] gap-4 items-center px-6 py-4 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${r.uptime >= 99.9 ? "bg-emerald-400" : "bg-yellow-400"}`} />
                  <span className="text-sm font-bold text-white">{r.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{fmtNum(r.nodes)} <span className="text-xs">nodes</span></span>
                <span className={`text-sm font-bold ${r.uptime >= 99.9 ? "text-emerald-400" : "text-yellow-400"}`}>{r.uptime.toFixed(2)}%</span>
                <span className="text-sm text-muted-foreground">{fmtMs(r.avgMs)}</span>
                <span className="text-sm text-muted-foreground">{fmtNum(r.txToday)} <span className="text-xs">tx</span></span>
                <div className="flex md:justify-end">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-400/8 tracking-widest">
                    ONLINE
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom two-column */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">

            {/* Live transactions feed */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="bg-[#0d0d0d] border border-white/6 rounded-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                <div className="flex items-center gap-2">
                  <span className="relative flex w-2 h-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Live Transactions</h2>
                </div>
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin" style={{ animationDuration: "3s" }} />
              </div>

              <div className="divide-y divide-white/4">
                <AnimatePresence initial={false}>
                  {txFeed.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: -12, backgroundColor: "rgba(59,130,246,0.08)" }}
                      animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <TxBadge type={tx.type} />
                        <span className="text-sm font-bold text-white whitespace-nowrap">
                          {tx.amount} <TokenChip token={tx.token} />
                        </span>
                        <span className="text-xs text-muted-foreground truncate hidden sm:flex items-center gap-1">
                          {tx.from}
                          <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" />
                          {tx.to}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{fmtAgo(tx.ts)}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right column */}
            <div className="flex flex-col gap-6">

              {/* Run a relay node */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.21 }}
                className="bg-primary/8 border border-primary/20 rounded-3xl p-6 flex-1"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Radio className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-black text-white">Run a Relay Node</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  Relay operators earn <strong className="text-white">$BLOOB</strong> tokens for routing transactions on Base.
                  Requires a server, a SIM-capable modem, and staking 500 $BLOOB.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Earn relay fees in ETH / USDC",
                    "Open-source relay software (MIT)",
                    "Minimum 99.5% uptime SLA required",
                    "Community-governed slashing rules",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  Read relay docs <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>

              {/* Recent incidents */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="bg-[#0d0d0d] border border-white/6 rounded-3xl overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-white/6">
                  <h2 className="text-sm font-black text-white">Recent Incidents</h2>
                </div>
                <div className="divide-y divide-white/4">
                  {INCIDENTS.map((inc, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 px-6 py-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{inc.date}</p>
                        <p className="text-sm text-white font-medium">{inc.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{inc.duration} min</p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full border tracking-widest ${
                        inc.status === "RESOLVED"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-400/8"
                          : "border-yellow-500/30 text-yellow-400 bg-yellow-400/8"
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 border-t border-white/4">
                  <a href="#" className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
                    View full history <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
