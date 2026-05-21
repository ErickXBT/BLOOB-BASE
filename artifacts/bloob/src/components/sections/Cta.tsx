import { motion } from "framer-motion";
import { Link } from "wouter";
import { Wallet } from "lucide-react";

export default function Cta() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-white/10 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[150px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Crypto without limits.
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Join the next billion users taking true ownership of their assets, connected or not.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/wallet">
                <button className="flex items-center justify-center gap-2 bg-primary text-white px-10 py-4 rounded-full font-bold transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
                  <Wallet className="w-5 h-5" />
                  Open Wallet
                </button>
              </Link>
              <Link href="/sms-wallet">
                <button className="flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/20 hover:border-white/50 hover:bg-white/5 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95">
                  Set Up SMS Wallet
                </button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="bg-white/5 px-4 py-2 rounded-full border border-white/5">Free forever</span>
              <span className="bg-white/5 px-4 py-2 rounded-full border border-white/5">No KYC</span>
              <span className="bg-white/5 px-4 py-2 rounded-full border border-white/5">Self-Custody</span>
              <span className="bg-white/5 px-4 py-2 rounded-full border border-white/5">Base Mainnet</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
