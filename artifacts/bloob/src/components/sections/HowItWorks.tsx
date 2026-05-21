import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Coins, UserCheck, Send } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Open BLOOB",
    desc: "Launch the app. It automatically detects if you're online or offline.",
    icon: <Smartphone className="w-8 h-8 text-primary" />
  },
  {
    num: "02",
    title: "Choose Your Asset",
    desc: "Select what you want to send from your unified multi-chain portfolio.",
    icon: <Coins className="w-8 h-8 text-primary" />
  },
  {
    num: "03",
    title: "Choose Recipient",
    desc: "Enter a blockchain address, an ENS name, or just a phone number.",
    icon: <UserCheck className="w-8 h-8 text-primary" />
  },
  {
    num: "04",
    title: "Send",
    desc: "Sign locally. BLOOB routes it via the optimal network path.",
    icon: <Send className="w-8 h-8 text-primary" />
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-card/30" id="how-it-works">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-bold tracking-widest uppercase mb-4"
          >
            How BLOOB Works
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
          >
            Four simple steps. <br />
            <span className="text-primary">No internet required.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:bg-white/[0.02] transition-colors"
            >
              <div className="text-6xl font-black text-white/5 absolute top-4 right-4 pointer-events-none">
                {step.num}
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative z-10">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">{step.title}</h3>
              <p className="text-muted-foreground relative z-10">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-black border border-white/10 rounded-2xl p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Offline mode detected
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 hidden md:block" />
            <div className="flex items-center gap-3 text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              SMS relay activated
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 hidden md:block" />
            <div className="flex items-center gap-3 text-green-500">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Confirmed on-chain in under 60 seconds
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}