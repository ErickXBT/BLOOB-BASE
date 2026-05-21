import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const stats = [
  { label: "Relay Nodes", value: 847, suffix: "" },
  { label: "Regions", value: 190, suffix: "+" },
  { label: "TX Today", value: 12483, suffix: "" },
  { label: "Uptime", value: 99.97, suffix: "%", isFloat: true }
];

function Counter({ value, isFloat = false }: { value: number, isFloat?: boolean }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    let startTime: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // easeOutExpo
      const current = progress === 1 ? end : end * (1 - Math.pow(2, -10 * progress));
      setCount(current);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);
  
  return (
    <span ref={nodeRef}>
      {isFloat ? count.toFixed(2) : Math.floor(count).toLocaleString()}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-12 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x border-white/5">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`flex flex-col items-center justify-center text-center ${i % 2 !== 0 ? 'border-l border-white/5 md:border-none' : ''} ${i > 0 ? 'md:border-l md:border-white/5' : ''}`}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">
                <Counter value={stat.value} isFloat={stat.isFloat} />
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}