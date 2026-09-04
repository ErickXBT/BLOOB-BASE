import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Zap,
  Terminal,
  Code2,
  Copy,
  Check,
  ArrowRight,
  Shield,
  Radio,
  BookOpen,
  Store,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden my-4 border border-white/10 bg-[#0d0d14] shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <span className="text-[11px] font-mono text-muted-foreground ml-2">{lang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
}

export default function QuickStartPage() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Install SDK",
      desc: "Add Bloob SDK and standard Web3 client libraries to your project",
    },
    {
      id: 2,
      title: "Initialize Client",
      desc: "Configure provider with Base L2 RPC and SMS Relay Fallback",
    },
    {
      id: 3,
      title: "Send Transaction",
      desc: "Dispatch instant payments online or automatically via SMS relay",
    },
    {
      id: 4,
      title: "Listen to Events",
      desc: "Subscribe to on-chain confirmation and offline receipt webhooks",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="relative py-16 sm:py-24 border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black tracking-wider uppercase mb-6">
              <Zap className="w-3.5 h-3.5" />
              Developer Onboarding
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
              Bloob <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-cyan-300">Quick Start</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Integrate non-custodial crypto payments that never fail. Build applications with seamless Base L2 settlement and automatic offline SMS relay failover in under 5 minutes.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link href="/docs" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-lg shadow-primary/25">
                <BookOpen className="w-4 h-4" /> Full Documentation
              </Link>
              <Link href="/merchant-api" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-all">
                <Store className="w-4 h-4 text-emerald-400" /> Merchant API
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Step Navigator */}
        <section className="py-12 border-b border-white/5 bg-[#08080d]">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {steps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    activeStep === s.id
                      ? "bg-primary/15 border-primary/40 shadow-lg shadow-primary/10"
                      : "bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-full ${
                      activeStep === s.id ? "bg-primary text-white" : "bg-white/10 text-muted-foreground"
                    }`}>
                      Step {s.id}
                    </span>
                    {activeStep === s.id && <Sparkles className="w-4 h-4 text-primary" />}
                  </div>
                  <h4 className="font-bold text-sm text-white">{s.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Step Detail Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl space-y-12">
            {/* Step 1 */}
            <div className="bg-[#0e0e17] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-sm">
                  1
                </span>
                <h2 className="text-2xl font-black text-white">Install the Dependencies</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Install the official Bloob client package using your preferred package manager. We recommend pairing it with Viem or Ethers.js for Base L2 interaction.
              </p>

              <CodeBlock
                lang="bash"
                code={`# Using npm
npm install @bloob/sdk viem

# Or using pnpm
pnpm add @bloob/sdk viem

# Or using yarn
yarn add @bloob/sdk viem`}
              />
            </div>

            {/* Step 2 */}
            <div className="bg-[#0e0e17] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-sm">
                  2
                </span>
                <h2 className="text-2xl font-black text-white">Initialize the Bloob Client</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Connect your client to the Base network and define the SMS relay network endpoint. The relay fallback will trigger automatically if the user has no internet connection.
              </p>

              <CodeBlock
                lang="typescript"
                code={`import { BloobClient, BaseChain } from "@bloob/sdk";

// Initialize client with Base Mainnet & SMS Relay Daemon
const bloob = new BloobClient({
  network: BaseChain.MAINNET,
  apiKey: process.env.BLOOB_API_KEY,
  relayOptions: {
    enableSmsFallback: true,
    telemetry: false, // 100% private, zero tracking
    defaultCurrency: "USDC",
  },
});

console.log("Bloob client ready:", bloob.version);`}
              />
            </div>

            {/* Step 3 */}
            <div className="bg-[#0e0e17] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-sm">
                  3
                </span>
                <h2 className="text-2xl font-black text-white">Execute a Payment (Online or Offline)</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Call <code className="text-primary font-mono font-bold">bloob.send()</code>. If device is offline or user selects SMS mode, an encrypted payload format suitable for standard cellular SMS will be generated.
              </p>

              <CodeBlock
                lang="typescript"
                code={`// Send 25 USDC on Base
const tx = await bloob.send({
  to: "0x3bB2384aFa94C661578e90637bC9Fa9Ac1A33458",
  amount: "25.00",
  token: "USDC",
  memo: "Coffee & Croissant Order #1042",
});

if (tx.channel === "sms") {
  console.log("Offline SMS Payload generated:", tx.smsPayload);
  // Example SMS: "BLOOB SEND 25 USDC 0x3bB2384... HASH:9a8f2"
} else {
  console.log("Broadcasted on-chain:", tx.hash);
}`}
              />
            </div>

            {/* Step 4 */}
            <div className="bg-[#0e0e17] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-sm">
                  4
                </span>
                <h2 className="text-2xl font-black text-white">Verify Transactions & Webhooks</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Subscribe to real-time status updates via WebSocket or server webhook notifications when the SMS relay validator settles the block on Base.
              </p>

              <CodeBlock
                lang="typescript"
                code={`// Listen for real-time settlement
bloob.on("transaction:confirmed", (receipt) => {
  console.log("Transaction Settled!", {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    channel: receipt.channel, // "online" or "sms-relay"
    gasFee: receipt.effectiveGasPrice,
  });
});`}
              />
            </div>
          </div>
        </section>

        {/* Quick Links Footer CTA */}
        <section className="py-16 border-t border-white/5 bg-[#090910]">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Ready to explore deeper?
            </h3>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-8">
              Check out the comprehensive documentation or set up point-of-sale merchant payments.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/docs" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all">
                Browse Full Documentation →
              </Link>
              <Link href="/network" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-all">
                View Relay Network Status →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
