import { memo } from "react";
import { motion } from "framer-motion";

export interface RunningCatCoupleShadesProps {
  opacity?: number;
  className?: string;
}

// ── Reusable Cat Couple Shade Figure ──
interface CatCoupleFigureProps {
  scale?: number;
  reverse?: boolean;
  bowColor?: string;
  heartText?: string;
}

const CatCoupleFigure = memo(function CatCoupleFigure({
  scale = 1,
  reverse = false,
  bowColor = "#f472b6",
  heartText = "💖",
}: CatCoupleFigureProps) {
  return (
    <div
      className={`relative flex items-end gap-1.5 sm:gap-2.5 filter drop-shadow-[0_4px_14px_rgba(244,114,182,0.45)] ${
        reverse ? "-scale-x-100" : ""
      }`}
      style={{ transform: `scale(${scale}) ${reverse ? "scaleX(-1)" : ""}` }}
    >
      {/* ── Floating Heart Popping from Steps ── */}
      <motion.div
        animate={{
          y: [-4, -30, -50],
          opacity: [0, 0.95, 0],
          scale: [0.6, 1.25, 0.8],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="absolute -top-7 left-10 pointer-events-none text-pink-400 font-bold select-none text-base sm:text-lg"
      >
        {heartText}
      </motion.div>

      {/* ── Cat 1: Unavan Cat (Slightly taller, perked ears) ── */}
      <div className="relative">
        <svg
          viewBox="0 0 100 65"
          className="w-14 h-10 sm:w-20 sm:h-14 fill-[#2a1728] text-[#f472b6]"
        >
          {/* Body */}
          <ellipse cx="48" cy="38" rx="28" ry="16" />
          {/* Head */}
          <circle cx="75" cy="25" r="14" />
          {/* Ears */}
          <polygon points="68,14 74,4 78,14" />
          <polygon points="76,14 83,6 86,17" />
          {/* Muzzle */}
          <circle cx="86" cy="27" r="3" />
          {/* Swishing Tail */}
          <motion.path
            d="M 22 36 Q 10 24 6 12 Q 4 6 10 4 Q 14 6 12 14 Q 14 26 24 38 Z"
            animate={{ rotate: [-10, 14, -10] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "22px 36px" }}
          />
          {/* Front Leg 1 */}
          <motion.path
            d="M 64 46 Q 72 58 80 60 Q 76 62 68 56 Z"
            animate={{ rotate: [-24, 26, -24] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "64px 46px" }}
          />
          {/* Front Leg 2 */}
          <motion.path
            d="M 58 46 Q 66 56 72 62 Q 68 64 60 54 Z"
            animate={{ rotate: [26, -24, 26] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "58px 46px" }}
          />
          {/* Back Leg 1 */}
          <motion.path
            d="M 32 46 Q 22 58 14 62 Q 18 64 28 54 Z"
            animate={{ rotate: [26, -26, 26] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "32px 46px" }}
          />
          {/* Back Leg 2 */}
          <motion.path
            d="M 38 46 Q 30 56 24 64 Q 28 65 36 56 Z"
            animate={{ rotate: [-26, 26, -26] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "38px 46px" }}
          />
        </svg>
      </div>

      {/* ── Central Love Spark 💕 ── */}
      <motion.div
        animate={{
          scale: [1, 1.35, 1],
          y: [-3, 3, -3],
        }}
        transition={{
          duration: 0.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-pink-400 text-xs sm:text-sm -mx-1 mb-5 select-none"
      >
        💕
      </motion.div>

      {/* ── Cat 2: Meow Kutty (Cute bow, curved heart tail) ── */}
      <div className="relative">
        <svg
          viewBox="0 0 95 62"
          className="w-13 h-9 sm:w-18 sm:h-13 fill-[#351a30] text-[#f472b6]"
        >
          {/* Body */}
          <ellipse cx="44" cy="36" rx="24" ry="14" />
          {/* Head */}
          <circle cx="68" cy="24" r="12.5" />
          {/* Ears */}
          <polygon points="62,14 67,5 71,14" />
          <polygon points="69,14 75,7 78,16" />
          {/* Bow on Head */}
          <path d="M 60 12 Q 56 8 60 6 Q 64 8 62 12 Z" fill={bowColor} />
          <path d="M 64 12 Q 68 8 64 6 Q 60 8 62 12 Z" fill={bowColor} />
          <circle cx="62" cy="9" r="2" fill="#fda4af" />
          {/* Curved Heart Tail */}
          <motion.path
            d="M 22 34 Q 12 20 16 8 Q 22 2 26 10 Q 24 18 20 28 Z"
            animate={{ rotate: [14, -12, 14] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "22px 34px" }}
          />
          {/* Front Leg 1 */}
          <motion.path
            d="M 58 44 Q 66 54 74 58 Q 70 60 62 52 Z"
            animate={{ rotate: [-24, 24, -24] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "58px 44px" }}
          />
          {/* Front Leg 2 */}
          <motion.path
            d="M 52 44 Q 60 52 66 58 Q 62 60 54 50 Z"
            animate={{ rotate: [24, -24, 24] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "52px 44px" }}
          />
          {/* Back Leg 1 */}
          <motion.path
            d="M 28 44 Q 18 54 12 58 Q 16 60 24 50 Z"
            animate={{ rotate: [24, -24, 24] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "28px 44px" }}
          />
          {/* Back Leg 2 */}
          <motion.path
            d="M 34 44 Q 26 52 20 60 Q 24 61 32 52 Z"
            animate={{ rotate: [-24, 24, -24] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "34px 44px" }}
          />
        </svg>
      </div>

      {/* Trailing Pawprints */}
      <div className="absolute -left-10 bottom-0.5 flex gap-1.5 text-pink-300/50 text-[10px] sm:text-xs">
        <motion.span
          animate={{ opacity: [0.7, 0.1, 0.7] }}
          transition={{ duration: 0.75, repeat: Infinity }}
        >
          🐾
        </motion.span>
        <motion.span
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: 0.35 }}
        >
          🐾
        </motion.span>
      </div>
    </div>
  );
});

export function RunningCatCoupleShades({
  opacity = 0.38,
  className = "",
}: RunningCatCoupleShadesProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-10 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* ══════════════════════════════════════════════════════════
          1. TOP TRACK (Left to Right — Gentle Upper Stride)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "-30vw" }}
        animate={{ x: "120vw" }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
          delay: 1.0,
        }}
        className="absolute top-[6%] sm:top-[8%] opacity-80"
      >
        <motion.div
          animate={{ y: [0, -8, 0, -8, 0], rotate: [-1, 1.5, -1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={0.75} heartText="💖" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          2. UPPER-MIDDLE TRACK (Right to Left — Playful Reversed Stride)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "120vw" }}
        animate={{ x: "-30vw" }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 4.5,
        }}
        className="absolute top-[22%] sm:top-[25%] opacity-70"
      >
        <motion.div
          animate={{ y: [0, -10, 0, -10, 0], rotate: [1.5, -1, 1.5] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={0.7} reverse={true} heartText="💕" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          3. CENTER FLOATING TRACK (Left to Right — Playful Leap)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "-30vw" }}
        animate={{ x: "120vw" }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          delay: 9.0,
        }}
        className="absolute top-[42%] sm:top-[45%] opacity-60"
      >
        <motion.div
          animate={{ y: [0, -12, 0, -12, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={0.8} heartText="✨" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          4. LOWER-MIDDLE TRACK (Right to Left — Romantic Gallop)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "120vw" }}
        animate={{ x: "-30vw" }}
        transition={{
          duration: 16.5,
          repeat: Infinity,
          ease: "linear",
          delay: 11.5,
        }}
        className="absolute top-[64%] sm:top-[66%] opacity-85"
      >
        <motion.div
          animate={{ y: [0, -9, 0, -9, 0], rotate: [1, -1.5, 1] }}
          transition={{ duration: 0.58, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={0.85} reverse={true} heartText="🥰" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          5. BOTTOM TRACK (Left to Right — Grounded Main Couple)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "-30vw" }}
        animate={{ x: "120vw" }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 0.2,
        }}
        className="absolute bottom-[3%] sm:bottom-[5%] opacity-95"
      >
        <motion.div
          animate={{ y: [0, -11, 0, -11, 0], rotate: [-1.5, 2, -1.5] }}
          transition={{ duration: 0.62, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={1.0} heartText="💖" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          6. DIAGONAL PLAYFUL KITTENS ROAMING
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "-20vw", y: "80vh" }}
        animate={{ x: "115vw", y: "15vh" }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
          delay: 6.0,
        }}
        className="absolute opacity-50 scale-65"
      >
        <div className="flex items-center gap-1 text-pink-300 drop-shadow-[0_2px_8px_rgba(244,114,182,0.4)]">
          <span className="text-xl">🐱</span>
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="text-xs text-pink-400"
          >
            💕
          </motion.span>
          <span className="text-xl">🐱</span>
          <span className="text-xs text-pink-200 ml-1">🐾✨</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: "115vw", y: "20vh" }}
        animate={{ x: "-20vw", y: "75vh" }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "linear",
          delay: 14.0,
        }}
        className="absolute opacity-45 scale-60 -scale-x-100"
      >
        <div className="flex items-center gap-1 text-pink-300 drop-shadow-[0_2px_8px_rgba(244,114,182,0.4)]">
          <span className="text-xl">🐱</span>
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="text-xs text-pink-400"
          >
            💖
          </motion.span>
          <span className="text-xl">🐱</span>
          <span className="text-xs text-pink-200 ml-1">🐾</span>
        </div>
      </motion.div>
    </div>
  );
}
