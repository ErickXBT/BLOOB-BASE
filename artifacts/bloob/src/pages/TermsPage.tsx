import { Link } from "wouter";
import { ShieldAlert, FileText, Scale, Key, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function TermsPage() {
  const sections = [
    {
      id: "1",
      title: "1. Nature of the Protocol & Non-Custodial Architecture",
      content:
        "BLOOB provides an open-source client application and hybrid offline SMS relay gateway interfacing with the Base decentralized public blockchain. BLOOB is non-custodial: you maintain absolute, unilateral control over your private cryptographic keys, mnemonic recovery phrases, and digital assets at all times. BLOOB Labs does not hold, store, custody, or have the technical capability to access or recover your funds.",
    },
    {
      id: "2",
      title: "2. User Custody & Private Key Responsibility",
      content:
        "You are solely responsible for safeguarding your 12-word mnemonic recovery phrase and private keys. If you lose your recovery phrase, neither BLOOB Labs, nor any validator, node operator, or community contributor can recover or reset your account. Never disclose your seed phrase to anyone, including individuals claiming to represent BLOOB support.",
    },
    {
      id: "3",
      title: "3. Cellular Carrier & SMS Relay Protocol Disclaimer",
      content:
        "Offline transfers utilize standard telecommunication SMS signals parsed and broadcast to Base L2 by independent decentralized relay nodes. Standard SMS transmission fees levied by your telecommunications provider apply. While cryptographic signatures ensure funds cannot be redirected, network latency, cellular blackouts, and carrier message delivery delays are beyond the control of the BLOOB protocol.",
    },
    {
      id: "4",
      title: "4. Digital Asset & Smart Contract Risks",
      content:
        "Engaging with cryptocurrencies, decentralized exchanges (DEXs), synthetic stocks, and smart contracts carries inherent economic risk. Digital asset prices are volatile. Smart contracts may contain unforeseen vulnerabilities. BLOOB software is provided on an 'AS IS' and 'AS AVAILABLE' basis without warranty of any kind.",
    },
    {
      id: "5",
      title: "5. No Financial, Investment, or Legal Advice",
      content:
        "No content, analytical metrics, token scoring indicators, or chart visualizations provided within the BLOOB application constitute investment, financial, legal, or tax advice. All trading decisions and token assessments are conducted at your sole discretion and risk.",
    },
    {
      id: "6",
      title: "6. Prohibited Activities & Compliance",
      content:
        "You agree not to use the BLOOB wallet or relay network to engage in illegal activities, including but not limited to sanctions evasion, terrorism financing, automated denial-of-service (DDoS) attacks against relay nodes, or intentional broadcast of malicious payloads.",
    },
    {
      id: "7",
      title: "7. Modifications to Terms",
      content:
        "We may revise these Terms of Service periodically to reflect protocol upgrades or regulatory clarity. Continued use of the BLOOB application constitutes acceptance of updated terms.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-muted-foreground uppercase mb-4">
              <Scale className="w-3.5 h-3.5 text-primary" />
              Legal & Protocol Governance
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Effective Date: January 1, 2026 · Protocol Version 2.4.0
            </p>
          </div>

          {/* Key Principles Callout */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-12 flex gap-4">
            <ShieldAlert className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed text-primary-foreground/90 space-y-1">
              <p className="font-bold text-white">Summary of Core Principles:</p>
              <p>• You own your keys. You own your crypto. 100% self-custody.</p>
              <p>• Bloob never holds custody of your assets and cannot reverse blockchain transactions.</p>
              <p>• Offline SMS relay is an experimental decentralized bridge facilitating censorship-resistant transfers.</p>
            </div>
          </div>

          {/* Section Items */}
          <div className="space-y-10">
            {sections.map((sec) => (
              <div key={sec.id} className="bg-[#0e0e17] border border-white/5 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-black text-white mb-3">{sec.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1">
              ← Read Privacy Policy
            </Link>
            <Link href="/licenses" className="hover:text-white transition-colors flex items-center gap-1">
              Open Source Licenses →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
