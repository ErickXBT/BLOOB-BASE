import { Link } from "wouter";
import { Cookie, CheckCircle, XCircle, HardDrive, Shield, Trash2 } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-bold text-amber-400 uppercase mb-4">
              <Cookie className="w-3.5 h-3.5" />
              Tracking Transparency
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Cookie Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last Updated: January 1, 2026 · We Do Not Use Tracking Cookies
            </p>
          </div>

          {/* Highlights Box */}
          <div className="bg-[#0f0f18] border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 space-y-6">
            <h3 className="text-xl font-black text-white">The Short & Clear Answer:</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              BLOOB does <strong className="text-white">not</strong> place advertising cookies, profiling cookies, cross-site trackers, or third-party behavioral analytics on your device.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block mb-1">What We Use:</span>
                  <span className="text-muted-foreground">
                    Only essential browser <code className="text-emerald-400 font-mono">localStorage</code> for theme state, active wallet address, and UI preferences.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block mb-1">What We NEVER Use:</span>
                  <span className="text-muted-foreground">
                    No marketing cookies, no ad retargeting, no third-party tracking scripts, and no user surveillance.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-6 bg-[#0c0c14] border border-white/5 rounded-3xl p-6 sm:p-10 mb-12">
            <h3 className="text-lg font-bold text-white">Browser Storage Breakdown</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-muted-foreground border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white font-bold">
                    <th className="pb-3 pr-4">Key Name</th>
                    <th className="pb-3 pr-4">Storage Type</th>
                    <th className="pb-3 pr-4">Purpose</th>
                    <th className="pb-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  <tr>
                    <td className="py-3 pr-4 text-primary">bloob_theme</td>
                    <td className="py-3 pr-4">localStorage</td>
                    <td className="py-3 pr-4 font-sans">Saves dark/light mode preference</td>
                    <td className="py-3 font-sans">Persistent</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-primary">bloob_wallet_addr</td>
                    <td className="py-3 pr-4">localStorage</td>
                    <td className="py-3 pr-4 font-sans">Caches active connected address for dashboard display</td>
                    <td className="py-3 font-sans">Persistent (until disconnect)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-primary">bloob_currency</td>
                    <td className="py-3 pr-4">localStorage</td>
                    <td className="py-3 pr-4 font-sans">Selected fiat currency display (USD, EUR, IDR, etc.)</td>
                    <td className="py-3 font-sans">Persistent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Clear */}
          <div className="bg-[#0e0e17] border border-white/5 rounded-2xl p-6 flex items-start gap-4">
            <Trash2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
            <div className="text-xs text-muted-foreground space-y-1">
              <h4 className="font-bold text-white text-sm">How to remove local data:</h4>
              <p>
                You can wipe all stored data at any time via your browser settings: Menu → Clear Browsing Data → Cookies and other site data. You can also disconnect your wallet from the BLOOB navigation bar at any moment.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-white transition-colors">
              ← Privacy Policy
            </Link>
            <Link href="/licenses" className="hover:text-white transition-colors">
              Open Source Licenses →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
