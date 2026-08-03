import { memo } from "react";
import { motion } from "framer-motion";

export interface RunningCatCoupleShadesProps {
  opacity?: number;
  className?: string;
}

// ── Reusable Clearly Visible Glowing Cat Couple Shade Figure ──
interface CatCoupleFigureProps {
  scale?: number;
  reverse?: boolean;
  bowColor?: string;
  heartText?: string;
}

const CatCoupleFigure = memo(function CatCoupleFigure({
  scale = 1,
  reverse = false,
  bowColor = "#f43f5e",
  heartText = "💖",
}: CatCoupleFigureProps) {
  return (
    <div
      className={`relative flex items-end gap-2 sm:gap-3 filter drop-shadow-[0_0_10px_rgba(244,114,182,0.85)] drop-shadow-[0_0_20px_rgba(251,113,133,0.5)] ${
        reverse ? "-scale-x-100" : ""
      }`}
      style={{ transform: `scale(${scale}) ${reverse ? "scaleX(-1)" : ""}` }}
    >
      {/* ── Floating Glowing Heart Popping from Steps ── */}
      <motion.div
        animate={{
          y: [-6, -35, -55],
          opacity: [0, 1, 0],
          scale: [0.7, 1.35, 0.9],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="absolute -top-8 left-12 pointer-events-none text-pink-300 font-bold select-none text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]"
      >
        {heartText}
      </motion.div>

      {/* ── Cat 1: Unavan Cat (Tall, perked ears, glowing rose-violet outline) ── */}
      <div className="relative">
        <svg
          viewBox="0 0 100 65"
          className="w-16 h-12 sm:w-22 sm:h-16 fill-[#5a1a40] stroke-[#f472b6] stroke-[1.8]"
          style={{ overflow: "visible" }}
        >
          {/* Body */}
          <ellipse cx="48" cy="38" rx="28" ry="16" />

          {/* Happy Closed Smile Eye ^ */}
          <path
            d="M 72 23 Q 76 19 80 23"
            fill="none"
            stroke="#fbcfe8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Head */}
          <circle cx="75" cy="25" r="14" />

          {/* Ears with inner glow */}
          <polygon points="68,14 74,4 78,14" fill="#6b2148" />
          <polygon points="76,14 83,6 86,17" fill="#6b2148" />
          <polygon points="71,13 74,7 76,13" fill="#f472b6" stroke="none" />

          {/* Cute Nose & Whisker */}
          <circle cx="86" cy="26" r="2.5" fill="#fbcfe8" stroke="none" />
          <line x1="82" y1="28" x2="94" y2="26" stroke="#fbcfe8" strokeWidth="1.2" />
          <line x1="82" y1="30" x2="93" y2="33" stroke="#fbcfe8" strokeWidth="1.2" />

          {/* Swishing Tail */}
          <motion.path
            d="M 22 36 Q 10 24 6 12 Q 4 6 10 4 Q 14 6 12 14 Q 14 26 24 38 Z"
            animate={{ rotate: [-12, 16, -12] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "22px 36px" }}
          />

          {/* Front Leg 1 */}
          <motion.path
            d="M 64 46 Q 72 58 80 60 Q 76 62 68 56 Z"
            animate={{ rotate: [-26, 28, -26] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "64px 46px" }}
          />

          {/* Front Leg 2 */}
          <motion.path
            d="M 58 46 Q 66 56 72 62 Q 68 64 60 54 Z"
            animate={{ rotate: [28, -26, 28] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "58px 46px" }}
          />

          {/* Back Leg 1 */}
          <motion.path
            d="M 32 46 Q 22 58 14 62 Q 18 64 28 54 Z"
            animate={{ rotate: [28, -28, 28] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "32px 46px" }}
          />

          {/* Back Leg 2 */}
          <motion.path
            d="M 38 46 Q 30 56 24 64 Q 28 65 36 56 Z"
            animate={{ rotate: [-28, 28, -28] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "38px 46px" }}
          />
        </svg>
      </div>

      {/* ── Central Pulsing Love Spark 💕 ── */}
      <motion.div
        animate={{
          scale: [1, 1.45, 1],
          y: [-4, 4, -4],
        }}
        transition={{
          duration: 0.65,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-pink-300 text-sm sm:text-base -mx-1 mb-6 select-none drop-shadow-[0_0_8px_rgba(244,114,182,1)]"
      >
        💕
      </motion.div>

      {/* ── Cat 2: Meow Kutty (Glowing rose silhouette, cute bow, curved heart tail) ── */}
      <div className="relative">
        <svg
          viewBox="0 0 95 62"
          className="w-15 h-11 sm:w-20 sm:h-15 fill-[#6c2049] stroke-[#fb7185] stroke-[1.8]"
          style={{ overflow: "visible" }}
        >
          {/* Body */}
          <ellipse cx="44" cy="36" rx="24" ry="14" />

          {/* Happy Closed Smile Eye ^ */}
          <path
            d="M 65 22 Q 69 18 73 22"
            fill="none"
            stroke="#fbcfe8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Head */}
          <circle cx="68" cy="24" r="12.5" />

          {/* Ears */}
          <polygon points="62,14 67,5 71,14" fill="#7d2857" />
          <polygon points="69,14 75,7 78,16" fill="#7d2857" />
          <polygon points="64,13 67,8 69,13" fill="#f472b6" stroke="none" />

          {/* Cute Bright Hair Bow on Head */}
          <path d="M 59 11 Q 54 6 59 4 Q 63 6 61 11 Z" fill={bowColor} stroke="#fda4af" strokeWidth="0.8" />
          <path d="M 63 11 Q 68 6 63 4 Q 59 6 61 11 Z" fill={bowColor} stroke="#fda4af" strokeWidth="0.8" />
          <circle cx="61" cy="8" r="2.2" fill="#ffe4e6" stroke="none" />

          {/* Cute Nose & Whisker */}
          <circle cx="78" cy="25" r="2.2" fill="#fbcfe8" stroke="none" />
          <line x1="74" y1="27" x2="84" y2="25" stroke="#fbcfe8" strokeWidth="1.2" />
          <line x1="74" y1="29" x2="83" y2="32" stroke="#fbcfe8" strokeWidth="1.2" />

          {/* Curved Heart Tail */}
          <motion.path
            d="M 22 34 Q 12 20 16 8 Q 22 2 26 10 Q 24 18 20 28 Z"
            animate={{ rotate: [16, -14, 16] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "22px 34px" }}
          />

          {/* Front Leg 1 */}
          <motion.path
            d="M 58 44 Q 66 54 74 58 Q 70 60 62 52 Z"
            animate={{ rotate: [-26, 26, -26] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "58px 44px" }}
          />

          {/* Front Leg 2 */}
          <motion.path
            d="M 52 44 Q 60 52 66 58 Q 62 60 54 50 Z"
            animate={{ rotate: [26, -26, 26] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "52px 44px" }}
          />

          {/* Back Leg 1 */}
          <motion.path
            d="M 28 44 Q 18 54 12 58 Q 16 60 24 50 Z"
            animate={{ rotate: [26, -26, 26] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "28px 44px" }}
          />

          {/* Back Leg 2 */}
          <motion.path
            d="M 34 44 Q 26 52 20 60 Q 24 61 32 52 Z"
            animate={{ rotate: [-26, 26, -26] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "34px 44px" }}
          />
        </svg>
      </div>

      {/* Trailing Glowing Pawprints */}
      <div className="absolute -left-12 bottom-1 flex gap-2 text-pink-300 text-xs sm:text-sm drop-shadow-[0_0_6px_rgba(244,114,182,0.9)]">
        <motion.span
          animate={{ opacity: [1, 0.2, 1], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        >
          🐾
        </motion.span>
        <motion.span
          animate={{ opacity: [0.2, 1, 0.2], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: 0.35 }}
        >
          🐾
        </motion.span>
      </div>
    </div>
  );
});

export function RunningCatCoupleShades({
  opacity = 0.85,
  className = "",
}: RunningCatCoupleShadesProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-10 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* ══════════════════════════════════════════════════════════
          1. TOP TRACK (Left to Right — High Horizon)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "-30vw" }}
        animate={{ x: "120vw" }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "linear",
          delay: 0.8,
        }}
        className="absolute top-[6%] sm:top-[8%]"
      >
        <motion.div
          animate={{ y: [0, -9, 0, -9, 0], rotate: [-1, 2, -1] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={0.88} heartText="💖" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          2. UPPER-MIDDLE TRACK (Right to Left — Reversed Gallop)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "120vw" }}
        animate={{ x: "-30vw" }}
        transition={{
          duration: 14.5,
          repeat: Infinity,
          ease: "linear",
          delay: 4.2,
        }}
        className="absolute top-[23%] sm:top-[26%]"
      >
        <motion.div
          animate={{ y: [0, -11, 0, -11, 0], rotate: [2, -1, 2] }}
          transition={{ duration: 0.52, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={0.82} reverse={true} heartText="💕" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          3. CENTER FLOATING TRACK (Left to Right — Playful Trot)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "-30vw" }}
        animate={{ x: "120vw" }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
          delay: 8.5,
        }}
        className="absolute top-[43%] sm:top-[46%]"
      >
        <motion.div
          animate={{ y: [0, -12, 0, -12, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={0.92} heartText="✨" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          4. LOWER-MIDDLE TRACK (Right to Left — Romantic Dash)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "120vw" }}
        animate={{ x: "-30vw" }}
        transition={{
          duration: 15.5,
          repeat: Infinity,
          ease: "linear",
          delay: 11.0,
        }}
        className="absolute top-[64%] sm:top-[66%]"
      >
        <motion.div
          animate={{ y: [0, -10, 0, -10, 0], rotate: [1.5, -2, 1.5] }}
          transition={{ duration: 0.54, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={0.95} reverse={true} heartText="🥰" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          5. BOTTOM TRACK (Left to Right — Grounded Main Couple)
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "-30vw" }}
        animate={{ x: "120vw" }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
          delay: 0.2,
        }}
        className="absolute bottom-[3%] sm:bottom-[5%]"
      >
        <motion.div
          animate={{ y: [0, -12, 0, -12, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 0.58, repeat: Infinity, ease: "easeInOut" }}
        >
          <CatCoupleFigure scale={1.12} heartText="💖" />
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          6. DIAGONAL PLAYFUL KITTENS ROAMING
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: "-20vw", y: "80vh" }}
        animate={{ x: "115vw", y: "15vh" }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          delay: 5.5,
        }}
        className="absolute scale-85 drop-shadow-[0_0_12px_rgba(244,114,182,0.9)]"
      >
        <div className="flex items-center gap-1.5 text-pink-300 font-bold">
          <span className="text-2xl sm:text-3xl">🐱</span>
          <motion.span
            animate={{ scale: [1, 1.45, 1] }}
            transition={{ duration: 0.65, repeat: Infinity }}
            className="text-sm sm:text-base text-pink-300"
          >
            💕
          </motion.span>
          <span className="text-2xl sm:text-3xl">🐱</span>
          <span className="text-sm text-pink-200 ml-1">🐾✨</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: "115vw", y: "20vh" }}
        animate={{ x: "-20vw", y: "75vh" }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
          delay: 13.0,
        }}
        className="absolute scale-80 -scale-x-100 drop-shadow-[0_0_12px_rgba(244,114,182,0.9)]"
      >
        <div className="flex items-center gap-1.5 text-pink-300 font-bold">
          <span className="text-2xl sm:text-3xl">🐱</span>
          <motion.span
            animate={{ scale: [1, 1.45, 1] }}
            transition={{ duration: 0.65, repeat: Infinity }}
            className="text-sm sm:text-base text-pink-300"
          >
            💖
          </motion.span>
          <span className="text-2xl sm:text-3xl">🐱</span>
          <span className="text-sm text-pink-200 ml-1">🐾</span>
        </div>
      </motion.div>
    </div>
  );
}
