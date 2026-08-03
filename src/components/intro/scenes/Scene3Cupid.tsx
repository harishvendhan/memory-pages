import { motion } from "framer-motion";

export function Scene3Cupid() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#060a17] via-[#0d1b38] to-[#050b18] overflow-hidden select-none">
      {/* Background starlight shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

      {/* Celestial Cupid Figure */}
      <motion.div
        initial={{ x: -180, y: 30, opacity: 0, scale: 0.85 }}
        animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Golden halo glow */}
        <div className="absolute -top-12 size-40 rounded-full bg-gradient-to-b from-amber-300/30 to-transparent blur-xl pointer-events-none" />

        {/* Cupid SVG Silhouette / Figure */}
        <div className="relative size-48 sm:size-60 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_0_24px_rgba(212,175,55,0.65)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft celestial halo */}
            <circle
              cx="100"
              cy="42"
              r="18"
              stroke="#f7e4b2"
              strokeWidth="2.5"
              className="opacity-85"
            />

            {/* Wings with gentle flutter pulse */}
            <motion.path
              d="M85 85 C 40 40, 20 70, 30 110 C 45 130, 80 115, 90 95 Z"
              fill="url(#wingGradLeft)"
              animate={{ rotate: [-2, 4, -2] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M115 85 C 160 40, 180 70, 170 110 C 155 130, 120 115, 110 95 Z"
              fill="url(#wingGradRight)"
              animate={{ rotate: [2, -4, 2] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Cupid Body & Head */}
            <circle cx="100" cy="65" r="16" fill="#fce5b8" />
            <path
              d="M90 85 C 80 120, 85 145, 100 150 C 115 145, 120 120, 110 85 Z"
              fill="url(#bodyGrad)"
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="wingGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8e7" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="wingGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff8e7" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fce5b8" />
                <stop offset="100%" stopColor="#e6ba5e" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Gentle Caption */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-4 font-display text-sm uppercase tracking-[0.35em] text-[#f5ecd5]/80 text-center"
        >
          A Celestial Messenger Arrives
        </motion.p>
      </motion.div>
    </div>
  );
}
