import { useState } from "react";
import { Copy, Check, MessageSquare, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useWallet } from "@/contexts/WalletContext";
import { Link } from "wouter";

export default function ReceiveTab() {
  const { address } = useWallet();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!address) return null;

  return (
    <div className="space-y-6">
      {/* QR Code */}
      <div className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-2xl mb-4">
          <QRCodeSVG value={address} size={180} level="H" />
        </div>
        <p className="text-xs text-muted-foreground mb-1">Your Base Wallet Address</p>
        <div className="flex items-center gap-2 max-w-full">
          <p className="text-sm font-mono text-white break-all text-center">{address}</p>
        </div>
      </div>

      {/* Copy button */}
      <button
        onClick={copy}
        className="w-full flex items-center justify-center gap-2 bg-white/6 border border-white/10 text-white font-bold rounded-2xl py-4 hover:bg-white/10 transition-all"
      >
        {copied
          ? <><Check className="w-4 h-4 text-emerald-400" /> Copied!</>
          : <><Copy className="w-4 h-4" /> Copy Address</>
        }
      </button>

      {/* Basescan link */}
      <a
        href={`https://basescan.org/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-white/4 border border-white/6 text-muted-foreground text-sm font-medium rounded-2xl py-3 hover:text-white hover:bg-white/8 transition-all"
      >
        <ExternalLink className="w-3.5 h-3.5" /> View on Basescan
      </a>

      {/* Network info */}
      <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-bold text-primary">Base Mainnet</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-muted-foreground">Chain ID</span><p className="text-white font-mono">8453</p></div>
          <div><span className="text-muted-foreground">Currency</span><p className="text-white font-mono">ETH</p></div>
          <div><span className="text-muted-foreground">RPC</span><p className="text-white font-mono text-[10px]">mainnet.base.org</p></div>
          <div><span className="text-muted-foreground">Explorer</span><p className="text-white font-mono text-[10px]">basescan.org</p></div>
        </div>
      </div>

      {/* SMS Wallet linkage */}
      <div className="bg-white/4 border border-white/6 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-white" />
          <span className="text-sm font-bold text-white">Offline Mode (SMS)</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Link this address to your phone number to send and receive crypto via SMS — no internet required.
        </p>
        <Link href="/sms-wallet" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
          Set up SMS Wallet →
        </Link>
      </div>
    </div>
  );
}
