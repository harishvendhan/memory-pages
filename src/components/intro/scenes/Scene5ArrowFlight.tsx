import { motion } from "framer-motion";

export function Scene5ArrowFlight() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#09152e] via-[#10244c] to-[#0b1733] overflow-hidden select-none">
      {/* Motion Blur & Light Streaks */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.18),transparent_60%)] pointer-events-none" />

      {/* Flying Glowing Golden Arrow with Contrail */}
      <motion.div
        initial={{ x: "-60vw", y: "15vh", rotate: -5, opacity: 0 }}
        animate={{ x: "60vw", y: "-15vh", rotate: -5, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.8, ease: [0.25, 1, 0.5, 1] }}
        className="relative flex items-center"
      >
        {/* Shimmering Golden Particle Tail */}
        <div className="w-64 sm:w-96 h-3.5 bg-gradient-to-r from-transparent via-amber-300/60 to-white rounded-full blur-[2px] shadow-[0_0_24px_rgba(255,230,150,0.9)]" />

        {/* Arrow Tip */}
        <div className="size-6 -ml-3 rotate-45 bg-white rounded-sm shadow-[0_0_30px_#ffffff]" />
      </motion.div>
    </div>
  );
}
