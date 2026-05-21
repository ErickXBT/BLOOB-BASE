import { motion } from "framer-motion";
import { Download, Smartphone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              HYBRID NETWORK · ONLINE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-6"
          >
            Crypto that <br />
            never stops. <br />
            <span className="text-primary">Always connected.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-12"
          >
            BLOOB is a next-generation hybrid crypto wallet. Access your assets directly on-chain when online, or via SMS relay when offline. Seamless, zero setup, unstoppable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95">
              <Smartphone className="w-5 h-5" />
              iOS — Coming Soon
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/10 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95">
              <Download className="w-5 h-5" />
              Android — Coming Soon
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
