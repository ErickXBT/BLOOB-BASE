import { motion } from "framer-motion";
import { QrCode, BarChart3, Webhook, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const merchantFeatures = [
  {
    icon: <QrCode className="w-8 h-8 text-primary" />,
    title: "Payment Links & QR",
    desc: "Generate instant payment links or display QR codes for in-person retail. No hardware required."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    title: "Analytics Dashboard",
    desc: "Track sales, monitor volume, and export accounting reports in real-time."
  },
  {
    icon: <Webhook className="w-8 h-8 text-primary" />,
    title: "API + Webhooks",
    desc: "Integrate seamlessly with Shopify, WooCommerce, or your custom checkout flow."
  },
  {
    icon: <RefreshCcw className="w-8 h-8 text-primary" />,
    title: "Auto Settlement",
    desc: "Automatically convert volatile assets into stablecoins like USDC to protect your margins."
  }
];

export default function Merchant() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary text-sm font-bold tracking-widest uppercase mb-4"
            >
              Merchant Ecosystem
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tight"
            >
              Accept crypto from <br className="hidden sm:block" />
              <span className="text-primary">anyone, anywhere.</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 text-muted-foreground"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">0.1%</span>
              <span className="text-sm">Flat Fee</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">0s</span>
              <span className="text-sm">Chargebacks</span>
            </div>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {merchantFeatures.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary/10 border border-primary/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-2 text-white">Merchant Beta Available</h3>
            <p className="text-primary/80 font-medium">No subscription · 0.1% fee · Settled in USDC</p>
          </div>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full font-bold px-8 w-full md:w-auto">
            Join Beta Program →
          </Button>
        </motion.div>

      </div>
    </section>
  );
}