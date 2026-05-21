import { motion } from "framer-motion";
import { SignalHigh, Bot, LayoutGrid, Shield, Zap, Layers } from "lucide-react";

const features = [
  {
    icon: <SignalHigh className="w-6 h-6 text-primary" />,
    title: "Offline Mode",
    description: "Send transactions via SMS when you lose data coverage. Automatically detects connection drops."
  },
  {
    icon: <Bot className="w-6 h-6 text-primary" />,
    title: "AI Assistant",
    description: "Chat naturally to execute complex multi-step transactions, swaps, or check market conditions."
  },
  {
    icon: <LayoutGrid className="w-6 h-6 text-primary" />,
    title: "DeFi Hub",
    description: "Built-in staking, lending, and liquidity provision across top protocols with one-tap execution."
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: "True Self-Custody",
    description: "Your keys, your crypto. Even over SMS, transactions are signed locally before broadcasting."
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Instant Setup",
    description: "No seed phrase panic. Start with a passkey, upgrade to full self-custody when you're ready."
  },
  {
    icon: <Layers className="w-6 h-6 text-primary" />,
    title: "Multi-Chain",
    description: "Built for Base, seamlessly supporting Ethereum, Optimism, Solana, and more from one interface."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-card/30" id="features">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-bold tracking-widest uppercase mb-4"
          >
            Features
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
          >
            Built for how crypto <br className="hidden sm:block" />
            should actually work.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Everything essential. Nothing unnecessary.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 rounded-2xl p-8 hover:bg-white/[0.03] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}