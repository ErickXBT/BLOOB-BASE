import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Zap, Shield, DollarSign, Globe } from "lucide-react";
import bloobLogo from "@assets/bloob_logo.png";

type Step = "form" | "submitting" | "success";

interface FormData {
  name: string;
  email: string;
  business: string;
  volume: string;
  usecase: string;
}

const PERKS = [
  { icon: <DollarSign className="w-5 h-5" />, title: "0.1% flat fee", desc: "No subscription, no hidden costs. Pay only per transaction." },
  { icon: <Zap        className="w-5 h-5" />, title: "Instant settlement", desc: "Funds settle in USDC on Base — no waiting, no banks." },
  { icon: <Shield     className="w-5 h-5" />, title: "Non-custodial", desc: "You hold your keys. BLOOB never touches your funds." },
  { icon: <Globe      className="w-5 h-5" />, title: "Works offline", desc: "Accept payments via SMS when internet is unavailable." },
];

const VOLUMES = [
  "< $1,000 / month",
  "$1,000 – $10,000 / month",
  "$10,000 – $100,000 / month",
  "> $100,000 / month",
];

const USECASES = [
  "E-commerce / Online store",
  "Physical retail / POS",
  "Freelance / Services",
  "SaaS / Subscriptions",
  "Cross-border payments",
  "Other",
];

export default function BetaPage() {
  const [step, setStep]     = useState<Step>("form");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [form, setForm]     = useState<FormData>({
    name: "", email: "", business: "", volume: "", usecase: "",
  });

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.name.trim())     errs.name     = "Name is required";
    if (!form.email.trim())    errs.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.business.trim()) errs.business = "Business name is required";
    if (!form.volume)          errs.volume   = "Select a volume range";
    if (!form.usecase)         errs.usecase  = "Select a use case";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep("submitting");

    // Save to localStorage (persists the signup)
    const existing: FormData[] = JSON.parse(localStorage.getItem("bloob_beta_signups") ?? "[]");
    existing.push({ ...form, ...(({ } as any)) });
    localStorage.setItem("bloob_beta_signups", JSON.stringify(existing));

    // Simulate network delay for UX
    await new Promise(r => setTimeout(r, 1400));
    setStep("success");
  };

  return (
    <div className="min-h-[100dvh] bg-[#070710] text-white">
      {/* Nav */}
      <header className="border-b border-white/6 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <img src={bloobLogo} alt="BLOOB" className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="font-black text-sm group-hover:text-primary transition-colors">BLOOB</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <AnimatePresence mode="wait">

          {/* ── Success ── */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-16 gap-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-3">You're on the list!</h1>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Welcome to the BLOOB Merchant Beta, <span className="text-white font-semibold">{form.name.split(" ")[0]}</span>.
                  We'll reach out to <span className="text-primary font-semibold">{form.email}</span> with your early access details.
                </p>
              </div>
              <div className="bg-white/4 border border-white/8 rounded-2xl px-6 py-4 text-sm text-muted-foreground max-w-sm w-full">
                <p className="font-semibold text-white mb-1">What happens next?</p>
                <ol className="space-y-1 text-left list-decimal list-inside">
                  <li>We'll review your application within 48 hours</li>
                  <li>You'll receive your merchant API key via email</li>
                  <li>Integrate in minutes — full docs provided</li>
                </ol>
              </div>
              <Link href="/" className="mt-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all text-sm">
                Back to BLOOB
              </Link>
            </motion.div>
          )}

          {/* ── Form ── */}
          {(step === "form" || step === "submitting") && (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                {/* Left — copy */}
                <div className="lg:sticky lg:top-24">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Merchant Beta · Open Now
                  </div>

                  <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
                    Accept crypto payments.<br />
                    <span className="text-primary">Anywhere.</span>
                  </h1>
                  <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                    Join the BLOOB Merchant Beta and start accepting USDC payments on Base — online or offline via SMS. No subscription, 0.1% flat fee.
                  </p>

                  {/* Perks */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {PERKS.map(p => (
                      <div key={p.title} className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                          {p.icon}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{p.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — form */}
                <div className="bg-[#111118] border border-white/8 rounded-3xl p-6 sm:p-8">
                  <h2 className="text-xl font-black mb-6">Apply for Beta Access</h2>
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">

                    {/* Name */}
                    <Field label="Full Name" error={errors.name}>
                      <input
                        type="text" value={form.name} onChange={set("name")}
                        placeholder="Satoshi Nakamoto"
                        className={input(!!errors.name)}
                      />
                    </Field>

                    {/* Email */}
                    <Field label="Email Address" error={errors.email}>
                      <input
                        type="email" value={form.email} onChange={set("email")}
                        placeholder="you@example.com"
                        className={input(!!errors.email)}
                      />
                    </Field>

                    {/* Business */}
                    <Field label="Business Name" error={errors.business}>
                      <input
                        type="text" value={form.business} onChange={set("business")}
                        placeholder="Acme Corp"
                        className={input(!!errors.business)}
                      />
                    </Field>

                    {/* Volume */}
                    <Field label="Monthly Payment Volume" error={errors.volume}>
                      <select value={form.volume} onChange={set("volume")} className={input(!!errors.volume)}>
                        <option value="">Select a range…</option>
                        {VOLUMES.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>

                    {/* Use case */}
                    <Field label="Primary Use Case" error={errors.usecase}>
                      <select value={form.usecase} onChange={set("usecase")} className={input(!!errors.usecase)}>
                        <option value="">Select a use case…</option>
                        {USECASES.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </Field>

                    <button
                      type="submit"
                      disabled={step === "submitting"}
                      className="w-full mt-2 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm tracking-wide"
                    >
                      {step === "submitting"
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                        : "Join Beta Program →"
                      }
                    </button>

                    <p className="text-xs text-center text-muted-foreground pt-1">
                      No spam. We only email you about your beta access.
                    </p>
                  </form>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function input(hasError: boolean) {
  return `w-full bg-white/5 border ${hasError ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm appearance-none`;
}
