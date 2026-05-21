import { motion } from "framer-motion";

export default function VideoSection() {
  return (
    <section className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <video
          src="/bloob-video.mp4"
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
