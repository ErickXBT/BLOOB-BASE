import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Store,
  CreditCard,
  QrCode,
  ShieldCheck,
  Check,
  Copy,
  ArrowRight,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

function ApiSnippet({ code, lang = "curl" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden my-4 border border-white/10 bg-[#0c0c14] shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/5">
        <span className="text-[11px] font-mono text-muted-foreground uppercase">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
}

export default function MerchantApiPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "typescript" | "python">("typescript");

  const codeExamples = {
    curl: `curl -X POST https://api.bloob.network/v1/checkout/sessions \\
  -H "Authorization: Bearer sk_live_bloob_883a0f129" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": "49.99",
    "currency": "USDC",
    "network": "base",
    "order_id": "ORD-94821",
    "enable_sms_fallback": true,
    "sms_shortcode": "12345",
    "callback_url": "https://merchant.example.com/webhooks/bloob"
  }'`,
    typescript: `import { BloobMerchant } from "@bloob/merchant-sdk";

const merchant = new BloobMerchant({
  secretKey: process.env.BLOOB_SECRET_KEY,
});

// Create Point-of-Sale / Online Checkout Session
const session = await merchant.checkout.create({
  amount: "49.99",
  currency: "USDC",
  orderId: "ORD-94821",
  enableSmsFallback: true, // Generate offline SMS pay-code for buyer
  metadata: {
    customerName: "Alex Rivera",
    storeLocation: "Jakarta Terminal 3",
  },
});

console.log("Pay URL:", session.paymentUrl);
console.log("SMS Shortcode Code:", session.smsPayload);`,
    python: `from bloob import BloobMerchant

client = BloobMerchant(secret_key="sk_live_bloob_...")

# Create offline & online payment session
session = client.checkout.create(
    amount="49.99",
    currency="USDC",
    order_id="ORD-94821",
    enable_sms_fallback=True,
    callback_url="https://merchant.example.com/webhooks"
)

print(f"Payment QR: {session.qr_svg}")
print(f"SMS Command: {session.sms_command}")`,
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-black tracking-wider uppercase mb-6">
              <Store className="w-3.5 h-3.5" />
              Merchant & POS Integration
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
              Bloob <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Merchant API</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Accept Base L2 crypto payments online and in physical stores. Never lose a customer during internet outages — transactions settle over standard SMS relay with instant merchant confirmation.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link href="/beta" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm transition-all shadow-lg shadow-emerald-500/20">
                <Store className="w-4 h-4" /> Apply for Merchant Beta
              </Link>
              <Link href="/docs" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-all">
                <Zap className="w-4 h-4 text-primary" /> Full API Docs
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 border-b border-white/5 bg-[#08080d]">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0f0f18] border border-white/5 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-white mb-2">Offline SMS Failover</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If the customer or store Wi-Fi drops, the customer simply sends a numeric shortcode via standard SMS to complete payment.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0f0f18] border border-white/5 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-white mb-2">Instant Base L2 Finality</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Near zero gas fees and sub-second settlement directly to your self-custody or business treasury wallet.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0f0f18] border border-white/5 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-white mb-2">Zero Chargeback Fraud</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Cryptographic ECDSA signatures ensure that all payments are mathematically final, completely eliminating card chargeback scams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference & Interactive Code */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl space-y-12">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">Create a Checkout Session</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Generate dynamic QR codes and SMS payment payload strings for e-commerce checkouts or hardware POS terminals.
              </p>

              {/* Language Selector */}
              <div className="flex items-center gap-2 mb-3">
                {(["typescript", "curl", "python"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                      activeTab === tab
                        ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                        : "bg-white/5 text-muted-foreground hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <ApiSnippet lang={activeTab} code={codeExamples[activeTab]} />
            </div>

            {/* Webhook Signature Verification */}
            <div className="bg-[#0e0e17] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black text-white">Webhook Signature Verification</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                All webhook payloads dispatched by the Bloob Relay Network include a cryptographic signature header <code className="text-emerald-400 font-mono">X-Bloob-Signature</code> (HMAC-SHA256) so your server can verify authenticity.
              </p>

              <ApiSnippet
                lang="typescript"
                code={`import crypto from "crypto";

export function verifyBloobWebhook(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hmac));
}`}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-white/5 bg-[#090910]">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Equip your retail or digital store with BLOOB
            </h3>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-8">
              Join dozens of merchants already piloting offline crypto payments in emerging markets and retail locations.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/beta" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm transition-all shadow-lg shadow-emerald-500/20">
                Apply for Merchant Beta →
              </Link>
              <Link href="/quickstart" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-all">
                Developer Quick Start →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
