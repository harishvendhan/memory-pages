import { motion } from "framer-motion";

export function Scene9GiftBox() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a0f1d] via-[#141d33] to-[#070b14] overflow-hidden select-none">
      {/* Radiant Light Escaping */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.3, opacity: 0.8 }}
        transition={{ duration: 3.0, ease: "easeInOut" }}
        className="absolute size-96 rounded-full bg-gradient-to-tr from-amber-400/30 via-yellow-200/20 to-transparent blur-3xl pointer-events-none"
      />

      {/* Velvet & Gold Gift Box */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center justify-center"
      >
        <div className="relative size-60 sm:size-72 flex flex-col items-center justify-center">
          {/* Ascending Lid */}
          <motion.div
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: -65, rotate: -8 }}
            transition={{ duration: 2.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 w-48 sm:w-56 h-14 rounded-t-lg bg-gradient-to-r from-[#5a1322] via-[#7e1d32] to-[#5a1322] border-2 border-[#d4af37] shadow-[0_4px_25px_rgba(212,175,55,0.6)] flex items-center justify-center"
          >
            {/* Golden Ribbon Bow */}
            <div className="absolute -top-5 size-10 rounded-full border-2 border-[#ffd700] bg-gradient-to-tr from-[#d4af37] to-[#fff3cc] shadow-[0_0_15px_#ffd700] flex items-center justify-center">
              <span className="text-xs">🎀</span>
            </div>
          </motion.div>

          {/* Glowing Box Base */}
          <div className="relative z-10 w-44 sm:w-52 h-36 rounded-b-lg bg-gradient-to-b from-[#6b182b] via-[#4f101e] to-[#360a14] border-2 border-t-0 border-[#d4af37] shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center">
            {/* Golden Vertical Ribbon */}
            <div className="w-8 h-full bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] shadow-[0_0_12px_rgba(255,215,0,0.6)]" />

            {/* Radiant core light beam escaping */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-200/40 to-white/60 blur-md pointer-events-none"
            />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="mt-4 font-display text-sm uppercase tracking-[0.35em] text-[#f7e6b7]"
        >
          A Gift Forged from Memories
        </motion.p>
      </motion.div>
    </div>
  );
}
