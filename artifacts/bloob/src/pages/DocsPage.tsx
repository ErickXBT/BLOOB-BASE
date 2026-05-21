import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, BookOpen, Wallet, Send, ArrowLeftRight, MessageSquare,
  Store, Network, Shield, ChevronRight, Copy, Check, Zap, Globe,
  Key, Lock, RefreshCw, AlertTriangle, ExternalLink,
} from "lucide-react";
import bloobLogo from "@assets/bloob_logo.png";

// ─── Sidebar sections ─────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "overview",      label: "Overview",            icon: <BookOpen className="w-4 h-4" /> },
  { id: "quickstart",   label: "Quick Start",          icon: <Zap className="w-4 h-4" /> },
  { id: "wallet",       label: "Wallet",               icon: <Wallet className="w-4 h-4" /> },
  { id: "send-receive", label: "Send & Receive",       icon: <Send className="w-4 h-4" /> },
  { id: "swap",         label: "Swap",                 icon: <ArrowLeftRight className="w-4 h-4" /> },
  { id: "sms",          label: "Offline / SMS",        icon: <MessageSquare className="w-4 h-4" /> },
  { id: "merchant",     label: "Merchant API",         icon: <Store className="w-4 h-4" /> },
  { id: "network",      label: "Network & Security",   icon: <Network className="w-4 h-4" /> },
  { id: "faq",          label: "FAQ",                  icon: <Shield className="w-4 h-4" /> },
];

// ─── Code block ───────────────────────────────────────────────────────────────
function Code({ children, lang = "" }: { children: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group rounded-xl overflow-hidden my-4">
      {lang && <div className="absolute top-0 left-0 px-3 py-1 text-[10px] font-bold text-muted-foreground bg-white/5 border-b border-r border-white/8 rounded-br-lg">{lang}</div>}
      <pre className="bg-[#0d0d14] border border-white/8 rounded-xl px-5 pt-8 pb-5 text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">{children}</pre>
      <button onClick={copy} className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all opacity-0 group-hover:opacity-100">
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

// ─── Callout box ──────────────────────────────────────────────────────────────
function Callout({ type = "info", children }: { type?: "info" | "warning" | "tip"; children: React.ReactNode }) {
  const styles = {
    info:    { bg: "bg-primary/8 border-primary/20",        icon: <BookOpen className="w-4 h-4 text-primary" />,        text: "text-primary/80" },
    warning: { bg: "bg-yellow-500/8 border-yellow-500/20",  icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />, text: "text-yellow-400/80" },
    tip:     { bg: "bg-emerald-500/8 border-emerald-500/20",icon: <Zap className="w-4 h-4 text-emerald-400" />,          text: "text-emerald-400/80" },
  }[type];
  return (
    <div className={`flex gap-3 border rounded-xl px-4 py-3 my-4 ${styles.bg}`}>
      <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
      <p className={`text-sm leading-relaxed ${styles.text}`}>{children}</p>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-black text-white mt-12 mb-4 scroll-mt-24 flex items-center gap-2 group">
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity text-muted-foreground">
        <ChevronRight className="w-5 h-5" />
      </a>
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-white mt-6 mb-2">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed mb-3 text-sm">{children}</p>;
}
function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Highlight active section on scroll
  useEffect(() => {
    const handler = () => {
      const ids = SECTIONS.map(s => s.id);
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-[100dvh] bg-[#070710] text-white">
      {/* ── Top nav ── */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/6 bg-[#070710]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <img src={bloobLogo} alt="BLOOB" className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="font-black text-sm group-hover:text-primary transition-colors">BLOOB</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm font-semibold text-muted-foreground">Docs</span>
          <div className="flex-1" />
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          {/* Mobile sidebar toggle */}
          <button onClick={() => setSidebarOpen(p => !p)} className="lg:hidden p-2 text-muted-foreground hover:text-white">
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 flex gap-0 lg:gap-8">
        {/* ── Sidebar ── */}
        <aside className={`fixed lg:sticky top-14 left-0 lg:left-auto z-30 h-[calc(100dvh-3.5rem)] lg:h-[calc(100dvh-3.5rem)] w-64 lg:w-56 bg-[#070710] lg:bg-transparent border-r border-white/6 lg:border-0 flex-shrink-0 overflow-y-auto py-6 px-4 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-2">Contents</p>
          <nav className="space-y-0.5">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all text-left ${
                  active === s.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-white hover:bg-white/4"
                }`}
              >
                <span className={active === s.id ? "text-primary" : "text-muted-foreground"}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 mx-2 p-3 bg-primary/8 border border-primary/20 rounded-xl">
            <p className="text-xs font-bold text-primary mb-1">Beta Access</p>
            <p className="text-xs text-muted-foreground mb-2">Join the merchant beta to get API access.</p>
            <Link href="/beta" className="text-xs font-bold text-primary hover:underline">Apply now →</Link>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* ── Content ── */}
        <main ref={contentRef} className="flex-1 min-w-0 py-10 lg:py-12 max-w-3xl">

          {/* ── OVERVIEW ── */}
          <section id="overview">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> v1.0 · Base Mainnet
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">BLOOB Documentation</h1>
            <P>BLOOB is a non-custodial hybrid crypto wallet built on <span className="text-white font-semibold">Base</span> (Ethereum L2). It works fully online and gracefully degrades to an offline SMS relay when internet is unavailable — making it the first wallet designed for regions with unreliable connectivity.</P>
            <P>This documentation covers everything from creating your first wallet to integrating BLOOB payments into your business.</P>

            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              {[
                { icon: <Wallet className="w-5 h-5" />, title: "Non-custodial", desc: "Your keys, your crypto. BLOOB never stores or sees your private key." },
                { icon: <Globe  className="w-5 h-5" />, title: "Works offline",  desc: "Send via SMS when you have no internet. Full on-chain when you reconnect." },
                { icon: <Zap   className="w-5 h-5" />, title: "Base L2",         desc: "Near-zero gas fees on Coinbase's Base network. Settle in USDC." },
              ].map(c => (
                <div key={c.title} className="bg-[#111118] border border-white/8 rounded-2xl p-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">{c.icon}</div>
                  <p className="font-bold text-sm text-white mb-1">{c.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── QUICK START ── */}
          <H2 id="quickstart">Quick Start</H2>
          <P>Get your BLOOB wallet running in under 2 minutes.</P>

          <H3>1. Open the wallet</H3>
          <P>Navigate to <Link href="/wallet" className="text-primary hover:underline font-mono text-xs">/wallet</Link> and choose <span className="text-white font-semibold">Create New Wallet</span> or <span className="text-white font-semibold">Import Existing Wallet</span>.</P>

          <H3>2. Save your credentials</H3>
          <P>After creation, immediately export and store your private key or seed phrase in a secure location. BLOOB encrypts your wallet locally using your password — if you forget your password, only your seed phrase can recover your funds.</P>

          <Callout type="warning">Never share your private key or seed phrase with anyone. BLOOB team will never ask for them.</Callout>

          <H3>3. Fund your wallet</H3>
          <P>Copy your Base wallet address and send ETH or USDC from any exchange or wallet that supports Base (e.g. Coinbase, Binance, MetaMask). Your balance will appear within seconds.</P>

          <Callout type="tip">First time? Bridge ETH from Ethereum mainnet to Base at <a href="https://bridge.base.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">bridge.base.org</a> — or buy directly on Coinbase and withdraw to Base.</Callout>

          {/* ── WALLET ── */}
          <H2 id="wallet">Wallet</H2>
          <P>BLOOB uses BIP-39 HD wallets compatible with any EVM chain. Your wallet is encrypted with AES-256 and stored only in your browser's <code className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">localStorage</code>.</P>

          <H3>Create a new wallet</H3>
          <UL items={[
            "Go to /wallet and click Create New Wallet",
            "Set a strong password (used to encrypt the wallet locally)",
            "Your 12-word seed phrase and private key are generated client-side",
            "Save the seed phrase offline — it's shown only once",
          ]} />

          <H3>Import an existing wallet</H3>
          <UL items={[
            "Click Import Existing Wallet on the onboarding screen",
            "Paste your private key (0x…) or 12/24-word seed phrase",
            "Set a new local password",
            "Your existing address and funds become accessible immediately",
          ]} />

          <H3>Export credentials</H3>
          <P>In the wallet app, click the ⚙ settings icon → show Private Key or Seed Phrase. Always re-encrypt or store these offline.</P>

          <H3>Lock & unlock</H3>
          <P>Click <span className="text-white font-semibold">Disconnect</span> in the top nav to lock the wallet. Your encrypted wallet remains in localStorage. Click <span className="text-white font-semibold">Unlock Wallet</span> on the next visit and enter your password to restore access.</P>

          <Callout type="info">Clearing browser storage will remove your encrypted wallet. Always keep an offline backup of your private key or seed phrase.</Callout>

          {/* ── SEND & RECEIVE ── */}
          <H2 id="send-receive">Send & Receive</H2>

          <H3>Receiving funds</H3>
          <P>Click <span className="text-white font-semibold">RECEIVE</span> on the balance card. A QR code and your full Base address appear. Share either with the sender — works with any EVM-compatible wallet or exchange that supports Base.</P>

          <H3>Sending ETH</H3>
          <UL items={[
            "Click SEND on the balance card",
            "Select ETH as the token",
            "Enter the recipient's 0x address and the amount",
            "Gas fee is estimated automatically (typically < $0.01 on Base)",
            "Confirm and the transaction broadcasts to Base mainnet",
          ]} />

          <H3>Sending USDC</H3>
          <P>Same flow as ETH — select USDC as the token. USDC on Base is the native Circle-issued <code className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</code>.</P>

          <Callout type="tip">Use the MAX button to auto-fill your full balance. For ETH sends, BLOOB automatically reserves enough for gas.</Callout>

          <H3>Tracking transactions</H3>
          <P>Every sent transaction appears in the <span className="text-white font-semibold">ACTIVITY</span> tab with a link to Basescan for on-chain verification.</P>

          {/* ── SWAP ── */}
          <H2 id="swap">Swap</H2>
          <P>BLOOB integrates with <span className="text-white font-semibold">Uniswap V3</span> on Base to provide token swaps directly in the wallet — no third-party site needed.</P>

          <H3>Supported tokens</H3>
          <UL items={["ETH (native)", "USDC", "USDT", "WETH", "DAI", "cbBTC", "cbETH", "AERO"]} />

          <H3>How to swap</H3>
          <UL items={[
            "Open the SWAP tab in the wallet nav",
            "Select your sell token and buy token using the token picker",
            "Enter the amount — a live quote updates automatically",
            "BLOOB checks all Uniswap V3 fee tiers (0.05%, 0.3%, 1%) and picks the best",
            "If no direct pool exists, it routes via WETH automatically (multi-hop)",
            "Click Swap to execute the on-chain transaction",
          ]} />

          <Callout type="info">Quotes are fetched from the Uniswap V3 Quoter contract on Base (read-only, no gas). Swap execution requires signing one on-chain transaction.</Callout>

          <H3>Slippage</H3>
          <P>Default slippage tolerance is 0.5%. For volatile tokens, a higher slippage may be needed. The swap will revert on-chain if price moves beyond the tolerance.</P>

          {/* ── SMS ── */}
          <H2 id="sms">Offline / SMS Mode</H2>
          <P>BLOOB's SMS relay lets you send transactions when you have no internet access — just a basic mobile signal.</P>

          <H3>How it works</H3>
          <UL items={[
            "BLOOB detects that you're offline (or you manually select SMS mode)",
            "Your signed transaction is encoded and split into an SMS payload",
            "You send that SMS to the BLOOB relay number for your region",
            "The relay node broadcasts your signed transaction to Base on your behalf",
            "Because the transaction is pre-signed client-side, the relay node cannot modify it or steal funds",
          ]} />

          <Callout type="tip">SMS relay is currently in beta. Relay nodes are run by community validators who stake BLOOB tokens as collateral.</Callout>

          <H3>SMS transaction format</H3>
          <Code lang="sms">{`BLOOB:SEND:0x<to_address>:<amount_in_wei>:<signed_tx_hex>`}</Code>
          <P>This format is human-readable for auditing. The relay node validates the signature and rejects any tampered payload.</P>

          <H3>Security guarantees</H3>
          <UL items={[
            "All transactions are signed locally with your private key before leaving the device",
            "The relay node only sees the signed hex — it cannot change destination or amount",
            "Relay nodes are slashed (lose stake) for censoring or tampering with transactions",
          ]} />

          {/* ── MERCHANT ── */}
          <H2 id="merchant">Merchant API</H2>
          <P>Accept USDC payments on Base in your store, app, or service with the BLOOB Merchant API. No subscription — 0.1% per transaction, settled instantly.</P>

          <Callout type="info">The Merchant API is currently in closed beta. <Link href="/beta" className="text-primary hover:underline font-semibold">Apply for access →</Link></Callout>

          <H3>Create a payment request</H3>
          <Code lang="bash">{`curl -X POST https://api.bloob.xyz/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": "10.00",
    "currency": "USDC",
    "description": "Order #1234",
    "redirect_url": "https://yoursite.com/success"
  }'`}</Code>

          <H3>Response</H3>
          <Code lang="json">{`{
  "id": "pay_abc123",
  "status": "pending",
  "amount": "10.00",
  "currency": "USDC",
  "payment_url": "https://pay.bloob.xyz/pay_abc123",
  "qr_code": "data:image/png;base64,...",
  "expires_at": "2026-05-21T23:59:59Z"
}`}</Code>

          <H3>Webhook events</H3>
          <P>BLOOB sends a POST request to your <code className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">webhook_url</code> when payment status changes:</P>
          <Code lang="json">{`{
  "event": "payment.completed",
  "payment_id": "pay_abc123",
  "amount": "10.00",
  "currency": "USDC",
  "tx_hash": "0xabc...def",
  "timestamp": 1716321600
}`}</Code>
          <UL items={["payment.pending — awaiting on-chain confirmation", "payment.completed — funds received, settled to your wallet", "payment.expired — no payment received before expiry", "payment.refunded — merchant-initiated refund"]} />

          <H3>SDK (coming soon)</H3>
          <Code lang="bash">{`npm install @bloob/merchant-sdk`}</Code>

          {/* ── NETWORK ── */}
          <H2 id="network">Network & Security</H2>

          <H3>Base mainnet</H3>
          <UL items={[
            <span>Chain ID: <code className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">8453</code></span>,
            <span>RPC: <code className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">https://mainnet.base.org</code></span>,
            <span>Block explorer: <a href="https://basescan.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">basescan.org <ExternalLink className="inline w-3 h-3" /></a></span>,
            "Average block time: ~2 seconds",
            "Gas fees: typically < $0.01 per transaction",
          ]} />

          <H3>Key contracts</H3>
          <Code lang="solidity">{`// USDC on Base
0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

// WETH on Base
0x4200000000000000000000000000000000000006

// Uniswap V3 Quoter (Base)
0x3d4e44Eb1374240CE5F1B136CFcA4F0 (QuoterV2)

// Uniswap V3 Router (Base)
0x2626664c2603336E57B271c5C0b26F421741e481`}</Code>

          <H3>Local encryption</H3>
          <UL items={[
            "Private keys are encrypted using ethers.js Keystore (AES-128-CTR + scrypt KDF)",
            "The encrypted JSON is stored in localStorage under bloob_encrypted_wallet",
            "The plain private key is only held in memory while the wallet is unlocked",
            "Locking the wallet clears all memory references to the key",
          ]} />

          <H3>Open source</H3>
          <P>BLOOB's wallet logic is fully open source. You can audit the key management, signing, and relay code on GitHub (link available at launch).</P>

          {/* ── FAQ ── */}
          <H2 id="faq">FAQ</H2>

          {[
            {
              q: "Is BLOOB custodial?",
              a: "No. BLOOB is 100% non-custodial. Your private key is generated in your browser, encrypted with your password, and stored only in your device's localStorage. BLOOB servers never see your key.",
            },
            {
              q: "What happens if I lose my password?",
              a: "Your password encrypts the local wallet file. If lost, you need your seed phrase or private key to recover your wallet. BLOOB cannot help you reset a lost password — there is no server-side recovery.",
            },
            {
              q: "Which chains does BLOOB support?",
              a: "Currently Base mainnet (chain ID 8453). ETH and USDC are the primary assets. Support for additional EVM chains is on the roadmap.",
            },
            {
              q: "How much does it cost to use BLOOB wallet?",
              a: "The wallet is free. You only pay gas fees when sending transactions (typically < $0.01 on Base). Swaps charge Uniswap's pool fee (0.05%–1%). The Merchant API charges 0.1% per transaction.",
            },
            {
              q: "Can I import my BLOOB wallet into MetaMask?",
              a: "Yes. Export your private key from Settings, then import it into MetaMask or any EVM-compatible wallet. Your funds and address remain the same.",
            },
            {
              q: "Is the SMS relay available globally?",
              a: "SMS relay is in beta with limited regional availability. Relay nodes are operated by community validators. Check /network for current coverage.",
            },
            {
              q: "How do I report a bug or security vulnerability?",
              a: "For bugs, open an issue on the GitHub repository. For security vulnerabilities, please contact the team privately before public disclosure.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-white/6 py-4">
              <p className="font-bold text-sm text-white mb-1.5">{q}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}

          {/* Bottom CTA */}
          <div className="mt-12 bg-primary/8 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-black text-white mb-1">Ready to get started?</p>
              <p className="text-sm text-muted-foreground">Create your non-custodial Base wallet in under a minute.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/beta" className="px-5 py-2.5 border border-white/12 text-white font-bold rounded-full text-sm hover:bg-white/6 transition-all">Merchant Beta</Link>
              <Link href="/wallet" className="px-5 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:bg-primary/90 transition-all">Open Wallet</Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
