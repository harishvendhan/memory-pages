import { motion } from "framer-motion";

export function Scene6CrystalHeart() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#091124] via-[#142345] to-[#0a1429] overflow-hidden select-none">
      {/* Central Radiance Glow */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
        className="absolute size-96 rounded-full bg-gradient-to-tr from-amber-300/30 via-rose-300/20 to-transparent blur-3xl pointer-events-none"
      />

      {/* Blossoming Crystal Heart Container */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center justify-center"
      >
        <div className="relative size-64 sm:size-80 flex items-center justify-center">
          {/* Faceted Crystal Heart SVG */}
          <motion.svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_0_40px_rgba(255,215,130,0.85)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M100 170 C 40 120, 20 80, 50 45 C 75 20, 95 40, 100 55 C 105 40, 125 20, 150 45 C 180 80, 160 120, 100 170 Z"
              fill="url(#crystalGrad)"
              stroke="#fff9e6"
              strokeWidth="2.5"
            />
            {/* Facet Refraction Lines */}
            <path d="M100 55 L 100 170" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" />
            <path d="M50 45 L 100 95 L 150 45" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" />
            <path d="M30 85 L 100 125 L 170 85" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" />

            <defs>
              <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#fce7a2" stopOpacity="0.65" />
                <stop offset="80%" stopColor="#f4a6b8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#e8738a" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Golden Letter Inside Heart */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute flex items-center justify-center"
          >
            <div className="w-24 h-16 sm:w-28 sm:h-20 rounded-md border border-amber-300/80 bg-gradient-to-br from-[#fff6de] via-[#f7e6b7] to-[#e6ca8c] shadow-[0_4px_20px_rgba(212,175,55,0.7)] flex items-center justify-center">
              <span className="font-display text-base text-[#9c814b]">✉️</span>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          className="mt-4 font-display text-sm uppercase tracking-[0.3em] text-[#f7e6b7]"
        >
          Unlocking a Treasured Letter
        </motion.p>
      </motion.div>
    </div>
  );
}
