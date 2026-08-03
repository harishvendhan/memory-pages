import { motion } from "framer-motion";

export function Scene10BookReveal() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#080d1a] via-[#101930] to-[#060912] overflow-hidden select-none">
      {/* Rising Golden Particles from Folded Letter */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${40 + (i % 6) * 4}vw`,
              y: "90vh",
              opacity: 0,
              scale: 0.4,
            }}
            animate={{
              y: `${25 + ((i * 7) % 50)}vh`,
              x: `${35 + ((i * 13) % 30)}vw`,
              opacity: [0, 0.9, 0],
              scale: [0.4, 1.3, 0.2],
            }}
            transition={{
              duration: 2.8 + (i % 4) * 0.4,
              repeat: Infinity,
              delay: (i % 8) * 0.3,
              ease: "easeOut",
            }}
            className="absolute size-2 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-[0_0_12px_rgba(255,215,0,0.9)]"
          />
        ))}
      </div>

      {/* Golden Aura Glow */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute size-96 rounded-full bg-gradient-to-tr from-amber-400/25 via-gold/30 to-transparent blur-3xl pointer-events-none"
      />

      {/* Floating & Levitation Book Materializing from Golden Dust */}
      <motion.div
        initial={{ y: 60, scale: 0.8, rotateX: 20, opacity: 0 }}
        animate={{ y: 0, scale: 1, rotateX: 0, opacity: 1 }}
        transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Leather Bound Book Cover Shell */}
        <div className="relative w-68 h-92 sm:w-76 sm:h-[26rem] rounded-r-2xl rounded-l-md border-4 border-[#8f7540] bg-gradient-to-br from-[#2a1b12] via-[#1e130c] to-[#120a06] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.45)] p-6 flex flex-col items-center justify-between">
          {/* Top Gold Corner Filigree */}
          <div className="w-full flex justify-between text-[#d4af37] text-lg select-none opacity-80">
            <span>╔</span>
            <span>✦</span>
            <span>╗</span>
          </div>

          {/* Center Embossed Titles */}
          <div className="text-center my-auto px-2">
            <div className="mb-2 font-display text-2xl text-[#d4af37] select-none">
              ❖
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#fff2d1] via-[#d4af37] to-[#aa8022] uppercase drop-shadow-[0_2px_10px_rgba(212,175,55,0.6)]">
              Our Story
            </h1>
            <div className="mx-auto my-3 flex items-center justify-center gap-2 opacity-60">
              <span className="h-px w-10 bg-[#d4af37]" />
              <span className="font-display text-[0.6rem] text-[#d4af37]">❦</span>
              <span className="h-px w-10 bg-[#d4af37]" />
            </div>
            <p className="font-display text-xs sm:text-sm font-semibold tracking-[0.18em] text-[#f5dfaa] drop-shadow-[0_1px_4px_rgba(212,175,55,0.4)]">
              For Jasmeena Farveen ❤️
            </p>
          </div>

          {/* Bottom Gold Corner Filigree */}
          <div className="w-full flex justify-between text-[#d4af37] text-lg select-none opacity-80">
            <span>╚</span>
            <span className="text-xs uppercase tracking-widest text-[#a68a52]">Vol. I</span>
            <span>╝</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
