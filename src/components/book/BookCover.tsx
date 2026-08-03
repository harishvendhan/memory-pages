import { motion } from "framer-motion";
import leather from "@/assets/leather.jpg";

interface BookCoverProps {
  opening: boolean;
  onOpen: () => void;
  onReadLetter?: () => void;
}

/** The closed leather volume resting on the table. */
export function BookCover({ opening, onOpen, onReadLetter }: BookCoverProps) {
  return (
    <div className="relative" style={{ perspective: "2000px" }}>
      {/* shadow pooled on the table */}
      <div
        className="absolute -bottom-8 left-1/2 h-14 w-[85%] -translate-x-1/2 rounded-[50%] blur-2xl"
        style={{ background: "oklch(0.05 0.01 50 / 0.85)" }}
        aria-hidden
      />
      {/* page block behind the cover */}
      <div
        className="absolute inset-y-3 right-[-6px] w-3 rounded-r-sm"
        style={{
          background:
            "repeating-linear-gradient(180deg, oklch(0.93 0.02 88), oklch(0.82 0.03 82) 2px, oklch(0.93 0.02 88) 3px)",
        }}
        aria-hidden
      />

      <motion.div
        className="gpu relative h-[84vh] min-h-[500px] max-h-[820px] md:h-[90vh] md:min-h-[740px] md:max-h-[1050px] w-[min(90vw,540px)] overflow-hidden rounded-r-xl rounded-l-sm border border-gold-deep/30"
        style={{
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          backgroundImage: `var(--gradient-leather), url(${leather})`,
          backgroundBlendMode: "multiply",
          backgroundSize: "cover",
          boxShadow: "var(--shadow-book)",
        }}
        initial={{ rotateY: 0, rotateX: 6 }}
        animate={
          opening
            ? { rotateY: -155, rotateX: 0, opacity: 0.2 }
            : { rotateY: 0, rotateX: 6, opacity: 1 }
        }
        transition={{ duration: 1.8, ease: [0.32, 0, 0.2, 1] }}
        whileHover={opening ? {} : { rotateY: -8, rotateX: 3, scale: 1.015 }}
      >
        {/* spine */}
        <div
          className="absolute inset-y-0 left-0 w-6 sm:w-8"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.18 0.04 40), oklch(0.3 0.07 44) 60%, oklch(0.2 0.05 42))",
          }}
          aria-hidden
        />
        {/* embossed golden border */}
        <div className="absolute inset-3 sm:inset-6 rounded-sm border border-gold/50" aria-hidden />
        <div className="absolute inset-5 sm:inset-9 rounded-sm border border-gold/25" aria-hidden />

        <div className="relative flex h-full flex-col items-center justify-center px-4 sm:px-8 text-center">
          <span className="mb-4 sm:mb-5 h-px w-16 bg-gold/50" />
          <p className="font-body text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.32em] sm:tracking-[0.38em] text-gold/80 mb-2">
            Our Lovable Memories
          </p>
          <h1
            className="text-gilded font-display text-4xl leading-tight tracking-wide sm:text-5xl flex items-center justify-center gap-2.5"
            style={{ filter: "drop-shadow(0 2px 6px oklch(0 0 0 / 0.6))" }}
          >
            You <span className="inline-block text-3xl sm:text-4xl filter drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]">💖</span> Me
          </h1>
          <p className="mt-5 font-script text-sm italic text-gold/80 sm:text-base">
            “A book filled with our most cherished moments.”
          </p>
          <span className="mt-6 h-px w-16 bg-gold/50" />

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onOpen}
              className="group rounded-full border border-gold/60 bg-gold/10 px-7 py-2.5 font-body text-[0.7rem] uppercase tracking-[0.3em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold/20 hover:tracking-[0.4em] shadow-md cursor-pointer"
              style={{ boxShadow: "var(--shadow-gold-glow)" }}
            >
              Open Book 📖
            </button>

            {onReadLetter && (
              <motion.button
                type="button"
                onClick={onReadLetter}
                animate={{
                  scale: [1, 1.08, 1, 1.12, 1],
                  boxShadow: [
                    "0 0 10px rgba(244,114,182,0.4), 0 0 0px rgba(244,114,182,0)",
                    "0 0 25px rgba(244,114,182,0.85), 0 0 16px rgba(251,113,133,0.65)",
                    "0 0 10px rgba(244,114,182,0.4), 0 0 0px rgba(244,114,182,0)",
                    "0 0 34px rgba(244,114,182,1), 0 0 24px rgba(251,113,133,0.8)",
                    "0 0 10px rgba(244,114,182,0.4), 0 0 0px rgba(244,114,182,0)",
                  ],
                }}
                transition={{
                  duration: 1.35,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.14, 0.28, 0.44, 0.72],
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.94 }}
                className="group relative rounded-full border-2 border-[#f472b6] bg-gradient-to-r from-[#9d174d] via-[#be185d] to-[#9d174d] px-6 py-2.5 font-body text-[0.72rem] uppercase tracking-[0.25em] text-pink-100 transition-all duration-300 hover:border-pink-200 hover:text-white cursor-pointer flex items-center gap-2 overflow-hidden shadow-lg"
              >
                {/* Heartbeat pulse wave ring effect */}
                <motion.span
                  animate={{
                    scale: [0.95, 1.45, 0.95],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 1.35,
                    repeat: Infinity,
                    ease: "easeOut",
                    times: [0, 0.44, 1],
                  }}
                  className="absolute inset-0 rounded-full border border-pink-300 pointer-events-none"
                />

                <motion.span
                  animate={{ scale: [1, 1.35, 1, 1.42, 1] }}
                  transition={{
                    duration: 1.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.14, 0.28, 0.44, 0.72],
                  }}
                  className="inline-block text-base drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                >
                  💌
                </motion.span>

                <span className="font-semibold tracking-[0.28em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                  Birthday Letter
                </span>

                <motion.span
                  animate={{ scale: [1, 1.4, 1, 1.48, 1] }}
                  transition={{
                    duration: 1.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.14, 0.28, 0.44, 0.72],
                  }}
                  className="inline-block text-sm text-pink-200 drop-shadow-[0_0_8px_rgba(244,114,182,1)]"
                >
                  ❤️
                </motion.span>
              </motion.button>
            )}
          </div>
        </div>

        {/* candle sheen */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, oklch(1 0 0 / 0.14), transparent 38%, oklch(0 0 0 / 0.35))",
          }}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}