import { motion } from "framer-motion";
import { CheckCircle2, Wifi, WifiOff, ArrowRight } from "lucide-react";

export default function HybridArchitecture() {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-bold tracking-widest uppercase mb-4"
          >
            Hybrid System
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6"
          >
            Two networks. <br />
            <span className="text-primary">One seamless experience.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            BLOOB intelligently routes your transactions through the optimal path. Full power when you have data, unstoppability when you don't.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors duration-500"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Wifi className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl font-bold mb-6">Connected Mode</h3>
            
            <ul className="space-y-4">
              {['Direct Chain Access', 'Near-instant confirmation', 'Swaps, Staking & DeFi', 'Live portfolio sync', 'Real-time pricing'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors duration-500"
          >
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white mb-6">
              <WifiOff className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl font-bold mb-6">Offline Mode (SMS)</h3>
            
            <ul className="space-y-4">
              {['SMS Relay Technology', 'Works on basic GSM networks', '190+ supported regions', 'True self-custody maintained', 'Auto-retry & failover'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-white/50 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black/50 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 overflow-x-auto"
        >
          <div className="flex flex-col items-center gap-2 text-center min-w-32">
            <div className="w-12 h-12 rounded-xl bg-card border border-white/10 flex items-center justify-center shadow-lg">
              📱
            </div>
            <span className="text-sm font-medium">Your Device</span>
          </div>
          
          <ArrowRight className="text-white/20 hidden md:block" />
          <div className="w-px h-8 bg-white/10 md:hidden" />
          
          <div className="flex flex-col items-center gap-2 text-center min-w-32">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              ⚙️
            </div>
            <span className="text-sm font-medium text-primary">BLOOB Engine</span>
          </div>
          
          <ArrowRight className="text-white/20 hidden md:block" />
          <div className="w-px h-8 bg-white/10 md:hidden" />
          
          <div className="flex flex-col items-center gap-2 text-center min-w-32">
            <div className="w-12 h-12 rounded-xl bg-card border border-white/10 flex items-center justify-center shadow-lg">
              📡
            </div>
            <span className="text-sm font-medium">Relay Layer</span>
          </div>
          
          <ArrowRight className="text-white/20 hidden md:block" />
          <div className="w-px h-8 bg-white/10 md:hidden" />
          
          <div className="flex flex-col items-center gap-2 text-center min-w-32">
            <div className="w-12 h-12 rounded-xl bg-card border border-white/10 flex items-center justify-center shadow-lg">
              🔗
            </div>
            <span className="text-sm font-medium">Blockchain</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}