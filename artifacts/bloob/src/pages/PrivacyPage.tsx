import { Link } from "wouter";
import { ShieldCheck, Lock, EyeOff, ServerOff, Database, ChevronRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function PrivacyPage() {
  const commitments = [
    {
      icon: <EyeOff className="w-5 h-5 text-emerald-400" />,
      title: "Zero IP Logging & Zero Telemetry",
      desc: "BLOOB does not log your IP address, browser fingerprint, device identifiers, or geolocation. We do not use Google Analytics, Meta Pixels, or any third-party behavioral trackers.",
    },
    {
      icon: <Lock className="w-5 h-5 text-primary" />,
      title: "Client-Side Cryptography (AES-GCM)",
      desc: "Your 12-word recovery phrase and private keys are encrypted locally inside your browser sandbox using AES-256-GCM. Private keys are never transmitted across the network or stored on any remote server.",
    },
    {
      icon: <ServerOff className="w-5 h-5 text-cyan-400" />,
      title: "Encrypted Offline SMS Payloads",
      desc: "When broadcasting transactions via SMS, payment details are serialized into a compact cryptographic payload containing only the recipient public address, amount, nonce, and ECDSA signature. Relay nodes act strictly as blind forwarders and cannot tamper with or inspect your private data.",
    },
    {
      icon: <Database className="w-5 h-5 text-purple-400" />,
      title: "Decentralized Public Ledger",
      desc: "Please be aware that Base and Ethereum are public blockchains. Confirmed transaction hashes, public wallet addresses, and token amounts are publicly recorded on-chain by design.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400 uppercase mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy-First Architecture
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last Updated: January 1, 2026 · Committed to Sovereign Privacy
            </p>
          </div>

          {/* Privacy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {commitments.map((c, i) => (
              <div key={i} className="bg-[#0e0e17] border border-white/5 rounded-2xl p-6 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  {c.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{c.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Detailed Policy Text */}
          <div className="space-y-8 bg-[#0c0c14] border border-white/5 rounded-3xl p-6 sm:p-10 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">1. Information We Do Not Collect</h3>
              <p>
                Unlike traditional financial apps, BLOOB requires no account creation, email address, password, phone number registration (for online web wallet use), passport, or identity documents. We do not maintain user accounts or personal profiles.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2">2. Local Storage & Session Data</h3>
              <p>
                BLOOB utilizes standard browser local storage (<code className="text-primary font-mono">localStorage</code>) solely to preserve your client-side preferences (such as dark theme, active currency display, and cached token balances) to deliver a seamless interface experience.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2">3. Third-Party RPC Providers</h3>
              <p>
                When reading on-chain token balances or broadcasting online transactions, the application queries Base decentralized RPC nodes. You may configure custom RPC endpoints in your wallet settings to prevent standard RPC telemetry.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2">4. Your Sovereign Data Rights</h3>
              <p>
                You can permanently delete all locally stored cryptographic material, cached sessions, and history at any time simply by clicking "Disconnect / Clear Wallet" in the wallet application or clearing your browser cache.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-white transition-colors">
              ← Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
