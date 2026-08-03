import { motion } from "framer-motion";

export function Scene4BowDraw() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#080d1e] via-[#122347] to-[#060c1c] overflow-hidden select-none">
      {/* Converging Starlight Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="size-80 rounded-full bg-gradient-to-tr from-amber-400/25 via-gold/30 to-transparent blur-3xl"
        />
      </div>

      {/* Bow and Arrow Charging */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center justify-center"
      >
        <div className="relative size-60 sm:size-72 flex items-center justify-center">
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full drop-shadow-[0_0_30px_rgba(212,175,55,0.75)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Golden Curved Bow */}
            <path
              d="M70 40 C 40 100, 40 140, 70 200"
              stroke="url(#bowGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Bowstring Drawn Back */}
            <motion.path
              d="M70 40 L 140 120 L 70 200"
              stroke="#fff9e6"
              strokeWidth="2"
              animate={{ d: ["M70 40 L 70 120 L 70 200", "M70 40 L 145 120 L 70 200"] }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />

            {/* Glowing Golden Arrow */}
            <motion.g
              initial={{ x: -20, opacity: 0.4 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            >
              {/* Arrow shaft */}
              <line
                x1="45"
                y1="120"
                x2="175"
                y2="120"
                stroke="url(#arrowGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Arrow tip heart shape */}
              <path
                d="M175 120 L 160 110 L 168 120 L 160 130 Z"
                fill="#fff9e6"
                className="drop-shadow-[0_0_12px_#fff]"
              />
            </motion.g>

            {/* Gradients */}
            <defs>
              <linearGradient id="bowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff8e7" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#b8860b" />
              </linearGradient>
              <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mt-3 font-display text-sm italic tracking-widest text-[#f5ebd7]"
        >
          Aiming for the most cherished memory...
        </motion.p>
      </motion.div>
    </div>
  );
}
