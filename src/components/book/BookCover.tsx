import { motion } from "framer-motion";
import leather from "@/assets/leather.jpg";

interface BookCoverProps {
  opening: boolean;
  onOpen: () => void;
}

/** The closed leather volume resting on the table. */
export function BookCover({ opening, onOpen }: BookCoverProps) {
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

          <button
            type="button"
            onClick={onOpen}
            className="group mt-10 rounded-full border border-gold/60 px-8 py-3 font-body text-[0.7rem] uppercase tracking-[0.35em] text-gold transition-all duration-500 hover:border-gold hover:tracking-[0.45em]"
            style={{ boxShadow: "var(--shadow-gold-glow)" }}
          >
            Open Book
          </button>
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