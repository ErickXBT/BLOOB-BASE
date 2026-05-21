import { motion } from "framer-motion";

export default function VideoFeatures() {
  return (
    <section className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8 mb-12">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-primary text-xs font-bold tracking-widest uppercase mb-4 text-center"
        >
          Features
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-center mb-4"
        >
          Built for how crypto
          <br />
          <span className="text-primary">should actually work.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-center text-lg max-w-xl mx-auto"
        >
          Everything essential. Nothing unnecessary.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="w-full"
      >
        <video
          src="/bloob-video2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full block"
        />
      </motion.div>
    </section>
  );
}
