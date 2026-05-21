import { motion } from "framer-motion";

export default function VideoFaq() {
  return (
    <section className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-center mb-4"
        >
          Questions people
          <br />
          <span className="text-primary">ask most.</span>
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <video
          src="/bloob-video4.mp4"
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
