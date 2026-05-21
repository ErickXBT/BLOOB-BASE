import { motion } from "framer-motion";

export default function VideoFaq() {
  return (
    <section className="w-full">
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
