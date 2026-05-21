import { motion } from "framer-motion";
import { Check, Clock, Rocket, ChevronRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

type Status = "completed" | "in-progress" | "upcoming";

interface Phase {
  number: string;
  period: string;
  status: Status;
  title: string;
  description?: string;
  items: string[];
  progress?: number;
}

const PHASES: Phase[] = [
  {
    number: "01",
    period: "Q1–Q2 2025",
    status: "completed",
    title: "Phase 1: Base Launch",
    items: [
      "Core Base wallet — create, send, receive",
      "Offline SMS relay transactions on Base",
      "Phone number wallet binding + OTP",
      "Non-custodial key management on-device",
      "BLOOB AI assistant (natural language commands)",
      "Multi-token support: BASE, USDC, ETH",
      "Online / SMS mode auto-switching",
      "BLOOB Docs & REST API",
    ],
  },
  {
    number: "02",
    period: "Q3 2025",
    status: "in-progress",
    title: "Phase 2: Ecosystem Growth",
    description: "Expanding BLOOB's reach on Base with DeFi integrations, token incentives, and community governance.",
    items: [
      "$BLOOB token launch on Base mainnet",
      "Token-gated AI assistant tiers",
      "On-chain governance framework",
      "Staking rewards for SMS relay operators",
    ],
    progress: 45,
  },
  {
    number: "03",
    period: "Q4 2025",
    status: "upcoming",
    title: "Phase 3: Multi-Chain Bridge",
    items: [
      "Ethereum & BNB Chain offline SMS support",
      "iOS & Android native app launch",
      "Browser extension wallet",
      "Advanced portfolio analytics dashboard",
    ],
  },
  {
    number: "04",
    period: "Q2 2026",
    status: "upcoming",
    title: "Phase 4: Merchant Platform",
    items: [
      "Merchant SDK + public REST API",
      "DeFi aggregator — swap, stake, earn yield",
      "BLOOB Pay for e-commerce checkouts",
      "Third-party relay operator program",
    ],
  },
  {
    number: "05",
    period: "Q4 2026",
    status: "upcoming",
    title: "Phase 5: Global Expansion",
    items: [
      "Global mesh relay network (offline-to-offline)",
      "Satellite SMS for zero-coverage zones",
      "Open financial protocol governance",
      "NGO & humanitarian integration program",
    ],
  },
];

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    icon: Check,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    dot: "bg-primary",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    bg: "bg-white/5",
    border: "border-white/10",
    text: "text-muted-foreground",
    dot: "bg-white/20",
  },
};

const completedCount = PHASES.filter((p) => p.status === "completed").length;

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      {status === "completed" ? (
        <Check className="w-3 h-3" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === "in-progress" ? "animate-pulse" : ""}`} />
      )}
      {cfg.label}
    </div>
  );
}

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const isCompleted = phase.status === "completed";
  const isInProgress = phase.status === "in-progress";
  const isUpcoming = phase.status === "upcoming";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`relative bg-[#0d0d0d] border rounded-3xl p-8 overflow-hidden transition-colors group ${
        isCompleted
          ? "border-emerald-500/20 hover:border-emerald-500/40"
          : isInProgress
          ? "border-primary/20 hover:border-primary/40"
          : "border-white/6 hover:border-white/12"
      }`}
    >
      {/* Glow */}
      {isInProgress && (
        <div className="absolute inset-0 bg-primary/3 pointer-events-none" />
      )}

      {/* Phase number */}
      <div className="absolute top-6 right-8 text-6xl font-black text-white/4 leading-none select-none">
        {phase.number}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <StatusBadge status={phase.status} />
          <span className="text-xs text-muted-foreground font-medium">{phase.period}</span>
        </div>

        <h3 className={`text-xl font-black mb-4 ${isCompleted ? "text-white" : isInProgress ? "text-white" : "text-white/70"}`}>
          {phase.title}
        </h3>

        {phase.description && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{phase.description}</p>
        )}

        <ul className="space-y-2.5 mb-6">
          {phase.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                isCompleted ? "bg-emerald-400" : isInProgress ? "bg-primary" : "bg-white/20"
              }`} />
              {item}
            </li>
          ))}
        </ul>

        {isInProgress && phase.progress !== undefined && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <span className="text-primary font-bold">~{phase.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${phase.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function RoadmapPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">

          {/* Header */}
          <div className="mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary text-xs font-bold tracking-widest uppercase mb-6"
            >
              Roadmap
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6"
            >
              Shipping the future
              <br />
              <span className="text-primary">on Base.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl mb-10"
            >
              From a single Base wallet to a full open financial layer —
              built transparently, phase by phase, for the next billion users.
            </motion.p>

            {/* Overall progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-4"
            >
              <div className="flex-1 max-w-xs h-1 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / PHASES.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {completedCount} / {PHASES.length} phases complete
              </span>
            </motion.div>
          </div>

          {/* Phase grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {PHASES.slice(0, 3).map((phase, i) => (
              <PhaseCard key={i} phase={phase} index={i} />
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {PHASES.slice(3).map((phase, i) => (
              <PhaseCard key={i + 3} phase={phase} index={i + 3} />
            ))}

            {/* Long-term vision card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-primary/8 border border-primary/20 rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-6 right-8 text-5xl">
                <Rocket className="w-12 h-12 text-primary/20" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-4 text-white">Long-term Vision</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  BLOOB aims to become the financial backbone of the Base ecosystem —
                  serving billions of people currently excluded from traditional banking and stable internet access.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {["Open-source", "Community-governed", "Permissionless", "Base-native"].map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/8 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 text-sm text-muted-foreground border border-white/6 rounded-2xl px-6 py-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
            All roadmap dates are estimates. Follow{" "}
            <a href="https://x.com/bloob" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
              @bloob <ChevronRight className="w-3 h-3" />
            </a>{" "}
            for live build updates and early access drops.
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
