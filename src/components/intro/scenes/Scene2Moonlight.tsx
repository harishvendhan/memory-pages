import { motion } from "framer-motion";

export function Scene2Moonlight() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#050914] via-[#09152e] to-[#040813] overflow-hidden select-none">
      {/* Luminous Moon and Celestial Rays */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-[12%] sm:top-[15%] flex items-center justify-center"
      >
        {/* Soft moonlight corona */}
        <div className="size-48 sm:size-64 rounded-full bg-gradient-to-tr from-amber-100/30 via-amber-200/15 to-transparent blur-2xl" />
        <div className="absolute size-24 sm:size-32 rounded-full bg-gradient-to-b from-[#fff7e6] via-[#f7e4b2] to-[#e6ca8a] shadow-[0_0_60px_rgba(247,228,178,0.6),0_0_120px_rgba(212,175,55,0.3)]" />
      </motion.div>

      {/* Atmospheric Star Field */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/5 via-transparent to-transparent pointer-events-none" />

      {/* Narrative Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 1.05 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        className="relative z-10 text-center px-6 max-w-xl mt-36 sm:mt-48"
      >
        <div className="mb-3 font-display text-xl text-[#e6ca8a]/70">❖</div>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal italic tracking-wide text-[#fff3db] drop-shadow-[0_2px_16px_rgba(230,202,138,0.5)]">
          &ldquo;Today isn&rsquo;t just another day...&rdquo;
        </h2>
        <p className="mt-3 font-body text-xs uppercase tracking-[0.3em] text-[#c9b48c]">
          Under this gentle midnight sky
        </p>
      </motion.div>
    </div>
  );
}
