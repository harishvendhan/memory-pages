import { motion } from "framer-motion";

export function Scene11Handoff() {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none select-none z-30"
    >
      <div className="text-center">
        <div className="font-display text-2xl text-[#d4af37] animate-pulse">
          ❖
        </div>
      </div>
    </motion.div>
  );
}
