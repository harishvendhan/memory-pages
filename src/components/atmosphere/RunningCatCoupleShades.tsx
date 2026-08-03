import { useMemo } from "react";
import { motion } from "framer-motion";

export interface RunningCatCoupleShadesProps {
  opacity?: number;
  className?: string;
}

export function RunningCatCoupleShades({
  opacity = 0.32,
  className = "",
}: RunningCatCoupleShadesProps) {
  // Generate a trail of floating hearts that spawn along the run path
  const floatingHearts = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        delay: i * 1.3,
        duration: 2.2 + (i % 3) * 0.4,
        size: 14 + (i % 3) * 4,
        offsetX: -15 + (i % 4) * 8,
      })),
    [],
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-10 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* ── Running Cat Couple Container (Traverses from Left to Right) ── */}
      <motion.div
        initial={{ x: "-30vw" }}
        animate={{ x: "120vw" }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear",
          delay: 0.5,
        }}
        className="absolute bottom-6 sm:bottom-12 flex items-end"
      >
        {/* Bobbing Running Motion Group */}
        <motion.div
          animate={{
            y: [0, -10, 0, -10, 0],
            rotate: [-1, 2, -1, 2, -1],
          }}
          transition={{
            duration: 0.65,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex items-end gap-1 sm:gap-2 filter drop-shadow-[0_4px_12px_rgba(244,114,182,0.4)]"
        >
          {/* ── Floating Love Hearts Spawning Above Couple ── */}
          <div className="absolute -top-10 left-8 sm:left-14 pointer-events-none">
            {floatingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 0, scale: 0.5, y: 0, x: heart.offsetX }}
                animate={{
                  opacity: [0, 0.9, 0],
                  scale: [0.5, 1.2, 0.7],
                  y: [-5, -45],
                  x: [heart.offsetX, heart.offsetX + 15],
                }}
                transition={{
                  duration: heart.duration,
                  delay: heart.delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute text-pink-400 font-bold"
                style={{ fontSize: `${heart.size}px` }}
              >
                💖
              </motion.div>
            ))}
          </div>

          {/* ── Cat 1: Unavan Cat Silhouette Shade ── */}
          <div className="relative">
            <svg
              viewBox="0 0 100 65"
              className="w-16 h-11 sm:w-22 sm:h-15 fill-[#2a1728] text-[#f472b6]"
            >
              {/* Cat Body */}
              <ellipse cx="48" cy="38" rx="28" ry="16" />

              {/* Cat Head */}
              <circle cx="75" cy="25" r="14" />

              {/* Ears */}
              <polygon points="68,14 74,4 78,14" />
              <polygon points="76,14 83,6 86,17" />

              {/* Muzzle / Whisker cheek */}
              <circle cx="86" cy="27" r="3" />

              {/* Playful animated tail */}
              <motion.path
                d="M 22 36 Q 10 24 6 12 Q 4 6 10 4 Q 14 6 12 14 Q 14 26 24 38 Z"
                animate={{ rotate: [-8, 12, -8] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "22px 36px" }}
              />

              {/* Running Front Leg 1 */}
              <motion.path
                d="M 64 46 Q 72 58 80 60 Q 76 62 68 56 Z"
                animate={{ rotate: [-20, 25, -20] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "64px 46px" }}
              />

              {/* Running Front Leg 2 */}
              <motion.path
                d="M 58 46 Q 66 56 72 62 Q 68 64 60 54 Z"
                animate={{ rotate: [25, -20, 25] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "58px 46px" }}
              />

              {/* Running Back Leg 1 */}
              <motion.path
                d="M 32 46 Q 22 58 14 62 Q 18 64 28 54 Z"
                animate={{ rotate: [25, -25, 25] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "32px 46px" }}
              />

              {/* Running Back Leg 2 */}
              <motion.path
                d="M 38 46 Q 30 56 24 64 Q 28 65 36 56 Z"
                animate={{ rotate: [-25, 25, -25] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "38px 46px" }}
              />
            </svg>
          </div>

          {/* ── Cute Central Connection Heart Between Them ── */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              y: [-2, 2, -2],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-pink-400 text-sm sm:text-base -mx-1 sm:-mx-2 mb-6"
          >
            💕
          </motion.div>

          {/* ── Cat 2: Meow Kutty (Jasmeena) Silhouette Shade with cute bow ── */}
          <div className="relative">
            <svg
              viewBox="0 0 95 62"
              className="w-14 h-10 sm:w-20 sm:h-14 fill-[#351a30] text-[#f472b6]"
            >
              {/* Cat Body */}
              <ellipse cx="44" cy="36" rx="24" ry="14" />

              {/* Cat Head */}
              <circle cx="68" cy="24" r="12.5" />

              {/* Ears */}
              <polygon points="62,14 67,5 71,14" />
              <polygon points="69,14 75,7 78,16" />

              {/* Cute Hair Bow on Head */}
              <path
                d="M 60 12 Q 56 8 60 6 Q 64 8 62 12 Z"
                fill="#f472b6"
              />
              <path
                d="M 64 12 Q 68 8 64 6 Q 60 8 62 12 Z"
                fill="#f472b6"
              />
              <circle cx="62" cy="9" r="2" fill="#fda4af" />

              {/* Playful curving tail forming a heart shape arc */}
              <motion.path
                d="M 22 34 Q 12 20 16 8 Q 22 2 26 10 Q 24 18 20 28 Z"
                animate={{ rotate: [12, -10, 12] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "22px 34px" }}
              />

              {/* Running Front Leg 1 */}
              <motion.path
                d="M 58 44 Q 66 54 74 58 Q 70 60 62 52 Z"
                animate={{ rotate: [-22, 22, -22] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "58px 44px" }}
              />

              {/* Running Front Leg 2 */}
              <motion.path
                d="M 52 44 Q 60 52 66 58 Q 62 60 54 50 Z"
                animate={{ rotate: [22, -22, 22] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "52px 44px" }}
              />

              {/* Running Back Leg 1 */}
              <motion.path
                d="M 28 44 Q 18 54 12 58 Q 16 60 24 50 Z"
                animate={{ rotate: [22, -22, 22] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "28px 44px" }}
              />

              {/* Running Back Leg 2 */}
              <motion.path
                d="M 34 44 Q 26 52 20 60 Q 24 61 32 52 Z"
                animate={{ rotate: [-22, 22, -22] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "34px 44px" }}
              />
            </svg>
          </div>

          {/* ── Cute Fading Trail of Paw Prints in the background ── */}
          <div className="absolute -left-12 bottom-1 flex gap-2 text-pink-300/40 text-xs sm:text-sm">
            <motion.span
              animate={{ opacity: [0.6, 0.1, 0.6] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              🐾
            </motion.span>
            <motion.span
              animate={{ opacity: [0.1, 0.6, 0.1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
            >
              🐾
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Second subtle couple running in the upper background with a delay ── */}
      <motion.div
        initial={{ x: "-30vw" }}
        animate={{ x: "120vw" }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          delay: 8.5,
        }}
        className="absolute top-12 sm:top-16 opacity-45 scale-75 flex items-end"
      >
        <motion.div
          animate={{
            y: [0, -6, 0, -6, 0],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex items-end gap-1 filter drop-shadow-[0_2px_8px_rgba(244,114,182,0.3)]"
        >
          <span className="text-xl sm:text-2xl">🐱</span>
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-xs text-pink-400 mb-2"
          >
            💕
          </motion.span>
          <span className="text-xl sm:text-2xl">🐱</span>
          <span className="text-xs text-pink-300 ml-1">✨🐾</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
