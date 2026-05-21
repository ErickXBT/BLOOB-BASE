import { motion } from "framer-motion";
import { SiEthereum, SiBinance, SiSolana } from "react-icons/si";
import { Layers } from "lucide-react";

const roadmap = [
  {
    chain: "BASE",
    status: "Live Now",
    icon: <Layers className="w-8 h-8 text-blue-500" />,
    progress: 100
  },
  {
    chain: "ETHEREUM",
    status: "Q3 2026",
    icon: <SiEthereum className="w-8 h-8 text-indigo-400" />,
    progress: 65
  },
  {
    chain: "BNB CHAIN",
    status: "Q4 2026",
    icon: <SiBinance className="w-8 h-8 text-yellow-400" />,
    progress: 40
  },
  {
    chain: "SOLANA",
    status: "Q4 2026",
    icon: <SiSolana className="w-8 h-8 text-purple-400" />,
    progress: 25
  }
];

export default function Roadmap() {
  return (
    <section className="py-24 border-y border-white/5 relative overflow-hidden" id="roadmap">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-bold tracking-widest uppercase mb-4"
          >
            Roadmap
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Expanding across <br />
            ecosystems.
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmap.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 rounded-3xl p-8 hover:border-primary/30 transition-colors group"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${item.progress === 100 ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 text-muted-foreground border-white/10'}`}>
                  {item.status}
                </div>
              </div>
              
              <h3 className="text-2xl font-black tracking-tight mb-6">{item.chain}</h3>
              
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${item.progress === 100 ? 'bg-primary' : 'bg-white/20'}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}