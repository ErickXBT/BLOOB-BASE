import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ArrowRight, MessageSquare, Shield, Wallet, Send, RefreshCw } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const COUNTRIES = [
  { code: "+1", name: "United States", flag: "🇺🇸", iso: "US" },
  { code: "+1", name: "Canada", flag: "🇨🇦", iso: "CA" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", iso: "GB" },
  { code: "+61", name: "Australia", flag: "🇦🇺", iso: "AU" },
  { code: "+49", name: "Germany", flag: "🇩🇪", iso: "DE" },
  { code: "+33", name: "France", flag: "🇫🇷", iso: "FR" },
  { code: "+39", name: "Italy", flag: "🇮🇹", iso: "IT" },
  { code: "+34", name: "Spain", flag: "🇪🇸", iso: "ES" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱", iso: "NL" },
  { code: "+46", name: "Sweden", flag: "🇸🇪", iso: "SE" },
  { code: "+47", name: "Norway", flag: "🇳🇴", iso: "NO" },
  { code: "+45", name: "Denmark", flag: "🇩🇰", iso: "DK" },
  { code: "+358", name: "Finland", flag: "🇫🇮", iso: "FI" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭", iso: "CH" },
  { code: "+43", name: "Austria", flag: "🇦🇹", iso: "AT" },
  { code: "+32", name: "Belgium", flag: "🇧🇪", iso: "BE" },
  { code: "+351", name: "Portugal", flag: "🇵🇹", iso: "PT" },
  { code: "+30", name: "Greece", flag: "🇬🇷", iso: "GR" },
  { code: "+48", name: "Poland", flag: "🇵🇱", iso: "PL" },
  { code: "+420", name: "Czech Republic", flag: "🇨🇿", iso: "CZ" },
  { code: "+36", name: "Hungary", flag: "🇭🇺", iso: "HU" },
  { code: "+40", name: "Romania", flag: "🇷🇴", iso: "RO" },
  { code: "+7", name: "Russia", flag: "🇷🇺", iso: "RU" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦", iso: "UA" },
  { code: "+90", name: "Turkey", flag: "🇹🇷", iso: "TR" },
  { code: "+972", name: "Israel", flag: "🇮🇱", iso: "IL" },
  { code: "+971", name: "UAE", flag: "🇦🇪", iso: "AE" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", iso: "SA" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼", iso: "KW" },
  { code: "+974", name: "Qatar", flag: "🇶🇦", iso: "QA" },
  { code: "+20", name: "Egypt", flag: "🇪🇬", iso: "EG" },
  { code: "+27", name: "South Africa", flag: "🇿🇦", iso: "ZA" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬", iso: "NG" },
  { code: "+254", name: "Kenya", flag: "🇰🇪", iso: "KE" },
  { code: "+233", name: "Ghana", flag: "🇬🇭", iso: "GH" },
  { code: "+255", name: "Tanzania", flag: "🇹🇿", iso: "TZ" },
  { code: "+256", name: "Uganda", flag: "🇺🇬", iso: "UG" },
  { code: "+251", name: "Ethiopia", flag: "🇪🇹", iso: "ET" },
  { code: "+237", name: "Cameroon", flag: "🇨🇲", iso: "CM" },
  { code: "+91", name: "India", flag: "🇮🇳", iso: "IN" },
  { code: "+86", name: "China", flag: "🇨🇳", iso: "CN" },
  { code: "+81", name: "Japan", flag: "🇯🇵", iso: "JP" },
  { code: "+82", name: "South Korea", flag: "🇰🇷", iso: "KR" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩", iso: "ID" },
  { code: "+63", name: "Philippines", flag: "🇵🇭", iso: "PH" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳", iso: "VN" },
  { code: "+66", name: "Thailand", flag: "🇹🇭", iso: "TH" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", iso: "MY" },
  { code: "+65", name: "Singapore", flag: "🇸🇬", iso: "SG" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩", iso: "BD" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰", iso: "PK" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰", iso: "LK" },
  { code: "+977", name: "Nepal", flag: "🇳🇵", iso: "NP" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", iso: "BR" },
  { code: "+52", name: "Mexico", flag: "🇲🇽", iso: "MX" },
  { code: "+54", name: "Argentina", flag: "🇦🇷", iso: "AR" },
  { code: "+56", name: "Chile", flag: "🇨🇱", iso: "CL" },
  { code: "+57", name: "Colombia", flag: "🇨🇴", iso: "CO" },
  { code: "+51", name: "Peru", flag: "🇵🇪", iso: "PE" },
  { code: "+58", name: "Venezuela", flag: "🇻🇪", iso: "VE" },
  { code: "+593", name: "Ecuador", flag: "🇪🇨", iso: "EC" },
  { code: "+591", name: "Bolivia", flag: "🇧🇴", iso: "BO" },
  { code: "+595", name: "Paraguay", flag: "🇵🇾", iso: "PY" },
  { code: "+598", name: "Uruguay", flag: "🇺🇾", iso: "UY" },
  { code: "+507", name: "Panama", flag: "🇵🇦", iso: "PA" },
  { code: "+506", name: "Costa Rica", flag: "🇨🇷", iso: "CR" },
  { code: "+502", name: "Guatemala", flag: "🇬🇹", iso: "GT" },
  { code: "+503", name: "El Salvador", flag: "🇸🇻", iso: "SV" },
  { code: "+504", name: "Honduras", flag: "🇭🇳", iso: "HN" },
  { code: "+505", name: "Nicaragua", flag: "🇳🇮", iso: "NI" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿", iso: "NZ" },
];

const STEPS = [
  { label: "Your number" },
  { label: "Verify" },
  { label: "Wallet ready" },
  { label: "Send crypto" },
];

const STEPS_DETAIL = [
  { icon: Shield, title: "Register your number", desc: "Enter any phone number with country code. Works globally — any country, any carrier." },
  { icon: MessageSquare, title: "Receive your 6-digit code", desc: "A verification code is generated. In this demo the OTP is shown directly for testing." },
  { icon: Wallet, title: "Your wallet is ready", desc: "Enter the code and a unique Base wallet address is created and bound to your number." },
  { icon: Send, title: "Send crypto via SMS", desc: 'Text "SEND 0.5 BASE TO <wallet>" to the BLOOB relay number — works without internet.' },
];

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateWalletAddress() {
  const chars = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * chars.length)];
  return addr;
}

function CountrySelector({
  selected,
  onSelect,
}: {
  selected: (typeof COUNTRIES)[0];
  onSelect: (c: (typeof COUNTRIES)[0]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-testid="country-selector-btn"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-14 px-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 transition-colors text-sm font-medium whitespace-nowrap"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="text-muted-foreground">{selected.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-16 z-50 w-72 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-white/5">
              <input
                autoFocus
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm outline-none border border-white/10 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.map((c, i) => (
                <button
                  key={`${c.iso}-${i}`}
                  type="button"
                  onClick={() => { onSelect(c); setOpen(false); setSearch(""); }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left ${selected.iso === c.iso && selected.name === c.name ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-xs opacity-60">{c.code}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-6">No results</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(i: number, v: string) {
    const digits = value.split("");
    digits[i] = v.replace(/\D/g, "").slice(-1);
    const next = digits.join("").padEnd(6, "");
    onChange(next.slice(0, 6));
    if (v && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !value[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, ""));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  }

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          data-testid={`otp-digit-${i}`}
          className="w-12 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
        />
      ))}
    </div>
  );
}

export default function SmsWallet() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp] = useState(generateOTP);
  const [walletAddress] = useState(generateWalletAddress);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");

  function handleSendCode() {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 6) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    setPhoneError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(1); }, 1200);
  }

  function handleVerifyCode() {
    if (otp.length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }
    if (otp !== generatedOtp) {
      setOtpError("Incorrect code. Try again.");
      return;
    }
    setOtpError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1000);
  }

  function handleReset() {
    setStep(0);
    setPhone("");
    setOtp("");
    setPhoneError("");
    setOtpError("");
  }

  const shortAddress = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-8">

          {/* Top heading */}
          <div className="mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary text-xs font-bold tracking-widest uppercase mb-6"
            >
              SMS Wallet
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]"
            >
              Your wallet.<br />
              <span className="text-primary">One text away.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl"
            >
              Link your phone number — a Base wallet address is generated instantly.
              Send crypto from any SMS app, anywhere in the world, with zero internet required.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left: Steps + SMS commands */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="space-y-6 mb-10">
                {STEPS_DETAIL.map((s, i) => (
                  <div key={i} className={`flex gap-4 transition-opacity duration-300 ${step >= i ? "opacity-100" : "opacity-40"}`}>
                    <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold border transition-colors ${step > i ? "bg-primary border-primary text-white" : step === i ? "border-primary text-primary bg-primary/10" : "border-white/10 text-muted-foreground"}`}>
                      {step > i ? <Check className="w-4 h-4" /> : `0${i + 1}`}
                    </div>
                    <div>
                      <p className={`font-semibold mb-0.5 ${step === i ? "text-white" : "text-muted-foreground"}`}>{s.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SMS commands box */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">SMS commands you can use</span>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  {[
                    "SEND 0.5 BASE TO 0x7kX...4mPq",
                    "SEND 10 USDC TO +62812345678",
                    "BALANCE",
                    "RECEIVE",
                    "HELP",
                  ].map((cmd, i) => (
                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                      <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                      <code className="text-primary/80">{cmd}</code>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Multi-step form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-[#0d0d0d] border border-white/8 rounded-3xl overflow-hidden shadow-2xl">

                {/* Progress bar */}
                <div className="px-8 pt-8 pb-6 border-b border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    {STEPS.map((s, i) => (
                      <div key={i} className="flex items-center flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${step > i ? "bg-primary text-white" : step === i ? "bg-primary/20 border border-primary text-primary" : "bg-white/5 text-muted-foreground border border-white/10"}`}>
                          {step > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className="flex-1 h-px mx-2 bg-white/10 relative overflow-hidden">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-primary"
                              initial={false}
                              animate={{ width: step > i ? "100%" : "0%" }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{STEPS[step]?.label}</span>
                    <span>Step {step + 1} / {STEPS.length}</span>
                  </div>
                </div>

                {/* Form content */}
                <div className="px-8 py-8">
                  <AnimatePresence mode="wait">

                    {/* Step 0: Phone number */}
                    {step === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <h2 className="text-2xl font-black mb-1">Enter your number</h2>
                        <p className="text-sm text-muted-foreground mb-7">Works globally — any country, any carrier.</p>

                        <div className="flex gap-3 mb-2">
                          <CountrySelector selected={country} onSelect={setCountry} />
                          <input
                            type="tel"
                            placeholder="812 345 6789"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                            data-testid="input-phone"
                            className="flex-1 h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-primary/60 transition-colors"
                          />
                        </div>

                        {phoneError && <p className="text-red-400 text-xs mb-4">{phoneError}</p>}

                        <p className="text-xs text-muted-foreground mb-7 mt-2">
                          No SMS will be sent in this demo. The OTP code will be shown directly for testing.
                        </p>

                        <button
                          onClick={handleSendCode}
                          disabled={loading}
                          data-testid="btn-send-code"
                          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          {loading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <>Get verification code <ArrowRight className="w-4 h-4" /></>
                          )}
                        </button>

                        <div className="flex items-center justify-center gap-4 mt-5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Non-custodial</span>
                          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> No KYC</span>
                          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Works globally</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 1: OTP */}
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <h2 className="text-2xl font-black mb-1">Enter your code</h2>
                        <p className="text-sm text-muted-foreground mb-2">
                          We simulated sending a code to{" "}
                          <span className="text-white font-medium">{country.code} {phone}</span>
                        </p>

                        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-7 flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Demo OTP code (shown for testing only)</p>
                            <p className="text-2xl font-black text-primary tracking-widest">{generatedOtp}</p>
                          </div>
                        </div>

                        <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpError(""); }} />

                        {otpError && <p className="text-red-400 text-xs mt-3 text-center">{otpError}</p>}

                        <button
                          onClick={handleVerifyCode}
                          disabled={loading || otp.length < 6}
                          data-testid="btn-verify"
                          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
                        >
                          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Verify & create wallet <ArrowRight className="w-4 h-4" /></>}
                        </button>

                        <button onClick={() => setStep(0)} className="w-full mt-3 text-sm text-muted-foreground hover:text-white transition-colors">
                          Back
                        </button>
                      </motion.div>
                    )}

                    {/* Step 2: Wallet ready */}
                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <div className="text-center mb-8">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet className="w-8 h-8 text-primary" />
                          </div>
                          <h2 className="text-2xl font-black mb-2">Wallet activated!</h2>
                          <p className="text-sm text-muted-foreground">Your Base wallet is linked to your number. Ready to send and receive.</p>
                        </div>

                        <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 mb-6 space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Phone number</p>
                            <p className="font-semibold">{country.flag} {country.code} {phone}</p>
                          </div>
                          <div className="border-t border-white/5 pt-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Base wallet address</p>
                            <p className="font-mono text-sm text-primary break-all">{walletAddress}</p>
                          </div>
                          <div className="border-t border-white/5 pt-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Network</p>
                            <p className="font-semibold flex items-center gap-2">Base <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Live Now</span></p>
                          </div>
                        </div>

                        <button
                          onClick={() => setStep(3)}
                          data-testid="btn-next-send"
                          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          Try sending crypto <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}

                    {/* Step 3: Send demo */}
                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <h2 className="text-2xl font-black mb-1">Send via SMS</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                          Text any of these commands to the BLOOB relay number — works online or offline.
                        </p>

                        <div className="space-y-3 mb-6">
                          {[
                            { cmd: `SEND 0.5 BASE TO ${shortAddress}`, label: "Send BASE to wallet" },
                            { cmd: `SEND 10 USDC TO ${country.code}${phone}`, label: "Send USDC to number" },
                            { cmd: "BALANCE", label: "Check your balance" },
                            { cmd: "RECEIVE", label: "Get your receive address" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-4">
                              <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <div>
                                <code className="text-sm text-primary font-mono">{item.cmd}</code>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-muted-foreground">
                          <p>
                            <span className="text-primary font-semibold">Offline mode active.</span>{" "}
                            BLOOB routes your SMS through a distributed relay network across 190+ regions. Confirmed on-chain in under 60 seconds.
                          </p>
                        </div>

                        <button
                          onClick={handleReset}
                          data-testid="btn-reset"
                          className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
                        >
                          Start over
                        </button>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
