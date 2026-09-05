import { Link } from "wouter";
import { ExternalLink } from "lucide-react";
import bloobLogo from "@assets/bloob_logo.png";
import ambassadorBanner from "@assets/ambassador_program.jpg";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "BLOOB Wallet",     href: "/wallet",     internal: true  },
      { label: "Stocks Market",    href: "/stocks",     internal: true  },
      { label: "Token Analyzer",   href: "/analyzer",   internal: true  },
      { label: "Media Gallery",    href: "/gallery",    internal: true  },
      { label: "SMS Wallet",       href: "/sms-wallet", internal: true  },
      { label: "Roadmap",          href: "/roadmap",    internal: true  },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation",    href: "/docs",         internal: true },
      { label: "Quick Start",      href: "/quickstart",   internal: true },
      { label: "Merchant API",     href: "/merchant-api", internal: true },
      { label: "Relay Network",    href: "/network",      internal: true },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Stocks Market",    href: "/stocks",       internal: true },
      { label: "Token Analyzer",   href: "/analyzer",     internal: true },
      { label: "Media Gallery",    href: "/gallery",      internal: true },
      { label: "Network Status",   href: "/network",      internal: true },
      { label: "Merchant Beta",    href: "/beta",         internal: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms",        internal: true },
      { label: "Privacy Policy",   href: "/privacy",      internal: true },
      { label: "Cookie Policy",    href: "/cookies",      internal: true },
      { label: "Licenses",         href: "/licenses",     internal: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8 bg-black">
      <div className="container mx-auto px-4 md:px-8">

        {/* ── AMBASSADOR PROGRAM CARD ── */}
        <div className="mb-16">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdq9MnFvwLeZufL2wE_W4Mixm7uIT0C2uxlDWt9xWQXpwfJHg/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-blue-500/30 hover:border-blue-400 shadow-2xl hover:shadow-[0_0_40px_rgba(37,99,235,0.35)] transition-all duration-300"
          >
            <img
              src={ambassadorBanner}
              alt="BLOOB Ambassador Program — Join Now"
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end justify-end p-4 sm:p-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-blue-600 font-black text-xs sm:text-sm shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                Join Now <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8 mb-20">

          {/* Brand col */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <img src={bloobLogo} alt="BLOOB Logo" className="w-9 h-9 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl tracking-tight">BLOOB</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              The non-custodial Base wallet that works anywhere — online and offline via SMS relay.
            </p>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                ONLINE · 99.97% Uptime
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              <Link href="/wallet" className="text-xs font-bold text-primary hover:underline">
                → Open Wallet
              </Link>
              <Link href="/beta" className="text-xs font-bold text-muted-foreground hover:text-white transition-colors">
                → Merchant Beta
              </Link>
              <Link href="/docs" className="text-xs font-bold text-muted-foreground hover:text-white transition-colors">
                → Docs
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-sm text-white mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    {link.internal ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-white/5 text-xs text-muted-foreground">
          <p>© 2026 BLOOB Labs. All rights reserved.</p>
          <p className="font-medium text-white/30">Built for the next billion users · Base Mainnet</p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Powered by Base</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
