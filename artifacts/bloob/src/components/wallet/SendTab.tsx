import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2, ExternalLink } from "lucide-react";
import { ethers } from "ethers";
import { useWallet } from "@/contexts/WalletContext";

type Token = "ETH" | "USDC";

export default function SendTab() {
  const { sendETH, sendUSDC, balances, provider, address } = useWallet();
  const [token, setToken] = useState<Token>("ETH");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [gasEst, setGasEst] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState("");

  const currentBalance = balances.find(b => b.symbol === token)?.balance ?? "0";

  const estimateGas = async () => {
    if (!to || !amount || !ethers.isAddress(to)) return;
    try {
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice ?? 0n;
      const gasLimit = token === "ETH" ? 21000n : 65000n;
      const gasCostWei = gasPrice * gasLimit;
      setGasEst(parseFloat(ethers.formatEther(gasCostWei)).toFixed(8) + " ETH");
    } catch {}
  };

  const handleSend = async () => {
    setError("");
    setTxHash(null);
    if (!ethers.isAddress(to)) { setError("Invalid address"); return; }
    if (!amount || parseFloat(amount) <= 0) { setError("Enter a valid amount"); return; }
    setLoading(true);
    try {
      const tx = token === "ETH"
        ? await sendETH(to, amount)
        : await sendUSDC(to, amount);
      setTxHash(tx.hash);
      setTo(""); setAmount(""); setGasEst(null);
    } catch (e: any) {
      setError(e?.reason ?? e?.message ?? "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {txHash && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-semibold">Transaction sent!</span>
          </div>
          <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
            className="text-xs text-emerald-400 flex items-center gap-1 hover:underline">
            View <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      )}

      {/* Token selector */}
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Token</label>
        <div className="flex gap-2">
          {(["ETH", "USDC"] as Token[]).map(t => (
            <button
              key={t}
              onClick={() => { setToken(t); setGasEst(null); setError(""); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${token === t ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Balance: <span className="text-white font-semibold">{currentBalance} {token}</span></p>
      </div>

      {/* Recipient */}
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">To</label>
        <input
          type="text"
          value={to}
          onChange={e => setTo(e.target.value)}
          onBlur={estimateGas}
          placeholder="0x..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground outline-none focus:border-primary/50 font-mono text-sm"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Amount</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={e => { setAmount(e.target.value); setGasEst(null); }}
            onBlur={estimateGas}
            placeholder="0.00"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground outline-none focus:border-primary/50"
          />
          <button
            onClick={() => setAmount(currentBalance)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary font-bold hover:underline"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Gas estimate */}
      {gasEst && (
        <div className="bg-white/4 border border-white/6 rounded-xl px-4 py-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated gas</span>
          <span className="text-white font-medium">{gasEst}</span>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleSend}
        disabled={loading || !to || !amount}
        className="w-full bg-primary text-white font-bold rounded-2xl py-4 hover:bg-primary/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
          : <><ArrowRight className="w-4 h-4" /> Send {token}</>
        }
      </button>
    </div>
  );
}
