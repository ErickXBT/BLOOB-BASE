import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Eye, EyeOff, Copy, Check, AlertTriangle, ArrowLeft, Loader2, KeyRound, FileKey } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import bloobLogo from "@assets/bloob_logo.png";

type Step = "welcome" | "create-backup" | "import" | "password" | "encrypting" | "unlock";

type ImportMode = "mnemonic" | "privatekey";

function WordGrid({ words }: { words: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {words.map((word, i) => (
        <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
          <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}.</span>
          <span className="text-sm font-mono text-white">{word}</span>
        </div>
      ))}
    </div>
  );
}

export default function WalletOnboarding() {
  const { createWallet, importFromMnemonic, importFromPrivateKey, unlock, hasWallet } = useWallet();
  const [, navigate] = useLocation();

  const [step, setStep] = useState<Step>(hasWallet ? "unlock" : "welcome");
  const [importMode, setImportMode] = useState<ImportMode>("mnemonic");
  const [pendingType, setPendingType] = useState<"create" | "import">("create");
  const [mnemonic, setMnemonic] = useState("");
  const [generatedMnemonic, setGeneratedMnemonic] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [backedUp, setBackedUp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const copyMnemonic = () => {
    navigator.clipboard.writeText(generatedMnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = async () => {
    setError("");
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setStep("encrypting");
    try {
      const phrase = await createWallet(password);
      setGeneratedMnemonic(phrase);
      setStep("create-backup");
    } catch (e: any) {
      setError(e.message);
      setStep("password");
    }
  };

  const handleImport = async () => {
    setError("");
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setStep("encrypting");
    try {
      if (importMode === "mnemonic") {
        await importFromMnemonic(mnemonic, password);
      } else {
        await importFromPrivateKey(privateKey, password);
      }
      navigate("/wallet/app");
    } catch (e: any) {
      setError("Invalid " + (importMode === "mnemonic" ? "seed phrase" : "private key"));
      setStep("password");
    }
  };

  const handleUnlock = async () => {
    setError("");
    setLoading(true);
    try {
      await unlock(password);
      navigate("/wallet/app");
    } catch {
      setError("Wrong password");
    } finally {
      setLoading(false);
    }
  };

  const slide = {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -32 },
    transition: { duration: 0.25 },
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm font-medium group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to BLOOB
          </Link>
          <img src={bloobLogo} alt="BLOOB" className="w-8 h-8" />
        </div>

        <AnimatePresence mode="wait">

          {/* WELCOME */}
          {step === "welcome" && (
            <motion.div key="welcome" {...slide} className="text-center">
              <h1 className="text-3xl font-black mb-2">BLOOB Wallet</h1>
              <p className="text-muted-foreground text-sm mb-8">Your non-custodial Base wallet. Online or offline.</p>
              <div className="space-y-3">
                <button
                  onClick={() => { setPendingType("create"); setStep("password"); }}
                  className="w-full bg-primary text-white font-bold rounded-2xl py-4 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create New Wallet
                </button>
                <button
                  onClick={() => { setPendingType("import"); setStep("import"); }}
                  className="w-full bg-white/6 border border-white/10 text-white font-bold rounded-2xl py-4 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Import Existing Wallet
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Compatible with MetaMask, Phantom, and all EVM wallets.
              </p>
            </motion.div>
          )}

          {/* UNLOCK */}
          {step === "unlock" && (
            <motion.div key="unlock" {...slide} className="text-center">
              <h1 className="text-2xl font-black mb-1">Welcome back</h1>
              <p className="text-muted-foreground text-sm mb-6">Enter your password to unlock</p>
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleUnlock()}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground outline-none focus:border-primary/50 pr-12"
                />
                <button onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
              <button
                onClick={handleUnlock}
                disabled={loading}
                className="w-full bg-primary text-white font-bold rounded-2xl py-4 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Unlock Wallet
              </button>
            </motion.div>
          )}

          {/* IMPORT */}
          {step === "import" && (
            <motion.div key="import" {...slide}>
              <button onClick={() => setStep("welcome")} className="flex items-center gap-1 text-muted-foreground text-sm mb-6 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-2xl font-black mb-1">Import Wallet</h2>
              <p className="text-muted-foreground text-sm mb-6">Use your existing seed phrase or private key.</p>

              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setImportMode("mnemonic")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${importMode === "mnemonic" ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/5 border-white/10 text-muted-foreground"}`}
                >
                  <FileKey className="w-4 h-4" /> Seed Phrase
                </button>
                <button
                  onClick={() => setImportMode("privatekey")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${importMode === "privatekey" ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/5 border-white/10 text-muted-foreground"}`}
                >
                  <KeyRound className="w-4 h-4" /> Private Key
                </button>
              </div>

              {importMode === "mnemonic" ? (
                <textarea
                  value={mnemonic}
                  onChange={e => setMnemonic(e.target.value)}
                  placeholder="Enter your 12 or 24-word seed phrase, separated by spaces..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground outline-none focus:border-primary/50 font-mono text-sm resize-none mb-4"
                />
              ) : (
                <input
                  type="text"
                  value={privateKey}
                  onChange={e => setPrivateKey(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground outline-none focus:border-primary/50 font-mono text-sm mb-4"
                />
              )}

              <div className="flex items-start gap-2 bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-3 mb-5">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-400">Never share your seed phrase or private key with anyone.</p>
              </div>

              <button
                onClick={() => setStep("password")}
                disabled={importMode === "mnemonic" ? mnemonic.trim().split(/\s+/).length < 12 : privateKey.length < 64}
                className="w-full bg-primary text-white font-bold rounded-2xl py-4 hover:bg-primary/90 transition-all disabled:opacity-40"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* PASSWORD */}
          {step === "password" && (
            <motion.div key="password" {...slide}>
              <button onClick={() => setStep(pendingType === "create" ? "welcome" : "import")} className="flex items-center gap-1 text-muted-foreground text-sm mb-6 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-2xl font-black mb-1">Set a Password</h2>
              <p className="text-muted-foreground text-sm mb-6">This encrypts your wallet locally on this device.</p>

              <div className="space-y-3 mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password (min. 8 chars)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground outline-none focus:border-primary/50 pr-12"
                  />
                  <button onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground outline-none focus:border-primary/50"
                />
              </div>
              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
              <button
                onClick={pendingType === "create" ? handleCreate : handleImport}
                disabled={!password || !confirmPassword}
                className="w-full bg-primary text-white font-bold rounded-2xl py-4 hover:bg-primary/90 transition-all disabled:opacity-40"
              >
                {pendingType === "create" ? "Create Wallet" : "Import Wallet"}
              </button>
            </motion.div>
          )}

          {/* ENCRYPTING */}
          {step === "encrypting" && (
            <motion.div key="encrypting" {...slide} className="text-center py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
              <p className="text-white font-bold">Encrypting your wallet…</p>
              <p className="text-muted-foreground text-sm mt-1">This may take a few seconds</p>
            </motion.div>
          )}

          {/* CREATE BACKUP */}
          {step === "create-backup" && (
            <motion.div key="backup" {...slide}>
              <h2 className="text-2xl font-black mb-1">Back Up Seed Phrase</h2>
              <p className="text-muted-foreground text-sm mb-5">
                Write these 12 words in order. Anyone with these words controls your wallet.
              </p>

              <div className="relative mb-4">
                <WordGrid words={generatedMnemonic.split(" ")} />
                <button
                  onClick={copyMnemonic}
                  className="absolute -top-1 -right-1 p-1.5 rounded-lg bg-white/8 border border-white/10 text-muted-foreground hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-start gap-2 bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-3 mb-5">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-400">Never share this phrase. BLOOB cannot recover it for you.</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer mb-5">
                <input type="checkbox" checked={backedUp} onChange={e => setBackedUp(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
                <span className="text-sm text-muted-foreground">I've saved my seed phrase safely</span>
              </label>

              <button
                onClick={() => navigate("/wallet/app")}
                disabled={!backedUp}
                className="w-full bg-primary text-white font-bold rounded-2xl py-4 hover:bg-primary/90 transition-all disabled:opacity-40"
              >
                Enter Wallet →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
