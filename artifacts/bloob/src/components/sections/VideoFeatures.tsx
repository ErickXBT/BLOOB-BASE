import { motion } from "framer-motion";

export default function VideoFeatures() {
  return (
    <section className="w-full py-20 md:py-32">

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
