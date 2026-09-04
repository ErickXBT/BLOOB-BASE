import { useState } from "react";
import { Link } from "wouter";
import { Award, FileCode, Check, Copy, ExternalLink, Code } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function LicensesPage() {
  const [copied, setCopied] = useState(false);

  const mitText = `MIT License

Copyright (c) 2026 BLOOB Labs & Community Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  const copyLicense = () => {
    navigator.clipboard.writeText(mitText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dependencies = [
    { name: "React & React DOM", license: "MIT", url: "https://react.dev", purpose: "Reactive client interface" },
    { name: "Vite", license: "MIT", url: "https://vitejs.dev", purpose: "Next-gen frontend build tool" },
    { name: "TailwindCSS", license: "MIT", url: "https://tailwindcss.com", purpose: "Utility-first design framework" },
    { name: "Framer Motion", license: "MIT", url: "https://www.framer.com/motion", purpose: "Fluid gesture & spring animations" },
    { name: "Lucide React", license: "ISC", url: "https://lucide.dev", purpose: "Open-source iconography" },
    { name: "Viem & Wagmi", license: "MIT", url: "https://viem.sh", purpose: "High-performance TypeScript Ethereum & Base interface" },
    { name: "TanStack Query", license: "MIT", url: "https://tanstack.com", purpose: "Asynchronous state management" },
    { name: "Wouter", license: "MIT", url: "https://github.com/molefrog/wouter", purpose: "Minimalist client router" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary uppercase mb-4">
              <Award className="w-3.5 h-3.5" />
              Open Source Compliance
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Licenses & Attribution
            </h1>
            <p className="text-sm text-muted-foreground">
              BLOOB is built with open-source spirit and powered by leading Web3 protocols.
            </p>
          </div>

          {/* Core MIT License */}
          <div className="bg-[#0e0e17] border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black text-white">BLOOB Core Protocol License</h3>
              </div>
              <button
                onClick={copyLicense}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy License Text"}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {mitText}
            </pre>
          </div>

          {/* Third Party Dependencies Table */}
          <div className="bg-[#0c0c14] border border-white/5 rounded-3xl p-6 sm:p-10 mb-12">
            <h3 className="text-lg font-black text-white mb-2">Third-Party Open Source Libraries</h3>
            <p className="text-xs text-muted-foreground mb-6">
              We express gratitude to the authors of these open-source building blocks powering BLOOB:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white font-bold">
                    <th className="pb-3 pr-4">Software Package</th>
                    <th className="pb-3 pr-4">License</th>
                    <th className="pb-3 pr-4">Role in BLOOB</th>
                    <th className="pb-3">Project Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dependencies.map((dep) => (
                    <tr key={dep.name} className="text-muted-foreground">
                      <td className="py-3.5 pr-4 font-bold text-white">{dep.name}</td>
                      <td className="py-3.5 pr-4 font-mono text-emerald-400">{dep.license}</td>
                      <td className="py-3.5 pr-4">{dep.purpose}</td>
                      <td className="py-3.5">
                        <a
                          href={dep.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Official Site <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-white transition-colors">
              ← Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
