import { motion } from "framer-motion";
import { RefreshCw, ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

function fmtTime(ts: string) {
  const d = new Date(parseInt(ts) * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function truncate(s: string, n = 6) {
  return s ? `${s.slice(0, n)}…${s.slice(-4)}` : "";
}

export default function PortfolioTab() {
  const { address, balances, txHistory, isLoadingBalances, refreshBalances } = useWallet();

  const icons: Record<string, string> = { ETH: "⟠", USDC: "$" };
  const colors: Record<string, string> = {
    ETH: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    USDC: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  };

  return (
    <div className="space-y-6">
      {/* Balances */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Assets</h3>
          <button
            onClick={refreshBalances}
            className="text-muted-foreground hover:text-white transition-colors"
            disabled={isLoadingBalances}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBalances ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="space-y-2">
          {balances.length === 0 && isLoadingBalances && (
            <div className="flex gap-2">
              {[0, 1].map(i => (
                <div key={i} className="flex-1 h-20 bg-white/4 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}
          {balances.map((token, i) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between bg-white/4 border border-white/6 rounded-2xl px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-black ${colors[token.symbol]}`}>
                  {icons[token.symbol]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{token.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {token.symbol === "ETH" ? "Ethereum on Base" : "USD Coin (Base)"}
                  </p>
                </div>
              </div>
              <p className="text-base font-black text-white">{token.balance}</p>
            </motion.div>
          ))}
          {balances.length === 0 && !isLoadingBalances && (
            <div className="bg-white/4 border border-white/6 rounded-2xl px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">No assets yet. Fund your wallet to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* TX History */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Transactions</h3>
        {txHistory.length === 0 && !isLoadingBalances && (
          <div className="bg-white/4 border border-white/6 rounded-2xl px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          </div>
        )}
        <div className="space-y-2">
          {txHistory.map((tx) => {
            const isSend = tx.from.toLowerCase() === address?.toLowerCase();
            return (
              <a
                key={tx.hash}
                href={`https://basescan.org/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white/4 border border-white/6 rounded-2xl px-4 py-3 hover:bg-white/6 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSend ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                    {isSend ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{isSend ? "Sent" : "Received"}</p>
                    <p className="text-xs text-muted-foreground">{fmtTime(tx.timeStamp)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${isSend ? "text-red-400" : "text-emerald-400"}`}>
                    {isSend ? "-" : "+"}{parseFloat(tx.value ? (Number(tx.value) / 1e18).toFixed(6) : "0")} ETH
                  </p>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
