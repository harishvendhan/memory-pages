import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import paper from "@/assets/paper.jpg";

interface LoveMessageModalProps {
  isOpen: boolean;
  onProceed: () => void;
}

export function LoveMessageModal({ isOpen, onProceed }: LoveMessageModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Reset to first step whenever opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const handleNext = () => {
    setStep(2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Candlelit dim backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => {
              if (step === 1) {
                setStep(2);
              } else {
                onProceed();
              }
            }}
          />

          {/* Romantic Pop-up Card with step transition */}
          <motion.div
            key={`modal-step-${step}`}
            initial={{ opacity: 0, scale: 0.75, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", damping: 22, stiffness: 260 },
            }}
            exit={{ opacity: 0, scale: 0.85, y: -20, transition: { duration: 0.25 } }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-2 border-gold/70 bg-[#f7f2e8] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(244,114,182,0.35)] select-none sm:p-10"
          >
            {/* Paper fiber texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
              style={{ backgroundImage: `url(${paper})`, backgroundSize: "cover" }}
              aria-hidden
            />

            {/* Inner gold filigree border */}
            <div className="pointer-events-none absolute inset-3 rounded-xl border border-gold/40" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              {step === 1 ? (
                <>
                  {/* Step 1: Floating animated heart badge */}
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.4,
                      ease: "easeInOut",
                    }}
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100/80 shadow-[0_0_20px_rgba(244,114,182,0.6)] border border-pink-300 text-3xl"
                  >
                    💖
                  </motion.div>

                  {/* Decorative top divider */}
                  <div className="mb-4 flex items-center justify-center gap-2 opacity-70">
                    <span className="h-[0.5px] w-12 bg-[#9c814b]" />
                    <span className="font-display text-[0.65rem] text-[#9c814b]">❖</span>
                    <span className="h-[0.5px] w-12 bg-[#9c814b]" />
                  </div>

                  {/* Message 1 */}
                  <h2 className="font-script text-3xl sm:text-4xl text-[#831843] font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(244,114,182,0.4)]">
                    “this is for you chellow 😘”
                  </h2>

                  <p className="mt-3 font-body text-xs tracking-widest text-[#786c5e] uppercase">
                    A keepsake of our story & memories
                  </p>

                  {/* Decorative bottom divider */}
                  <div className="my-5 flex items-center justify-center gap-2 opacity-70">
                    <span className="h-[0.5px] w-12 bg-[#9c814b]" />
                    <span className="font-display text-[0.65rem] text-[#9c814b]">❖</span>
                    <span className="h-[0.5px] w-12 bg-[#9c814b]" />
                  </div>

                  {/* Step 1 Next Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217,119,6,0.6)" }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={handleNext}
                    className="group relative mt-2 flex items-center justify-center gap-2 rounded-full border border-gold bg-gradient-to-r from-[#92400e] via-[#b45309] to-[#92400e] px-8 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#fef3c7] shadow-lg transition-all cursor-pointer"
                  >
                    <span>Click Here</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">💕</span>
                  </motion.button>
                </>
              ) : (
                <>
                  {/* Step 2: Playful animated emoji */}
                  <motion.div
                    animate={{
                      rotate: [-10, 10, -10],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut",
                    }}
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/80 shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-amber-300 text-3xl"
                  >
                    😅
                  </motion.div>

                  {/* Decorative top divider */}
                  <div className="mb-4 flex items-center justify-center gap-2 opacity-70">
                    <span className="h-[0.5px] w-12 bg-[#9c814b]" />
                    <span className="font-display text-[0.65rem] text-[#9c814b]">❖</span>
                    <span className="h-[0.5px] w-12 bg-[#9c814b]" />
                  </div>

                  {/* Message 2 requested by user */}
                  <h2 className="font-script text-3xl sm:text-4xl text-[#831843] font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(244,114,182,0.4)]">
                    “koncham wait panu di chellow 😅”
                  </h2>

                  <p className="mt-3 font-body text-xs tracking-widest text-[#786c5e] uppercase">
                    Konjam suspense irukanumla... ready-ah? ✨
                  </p>

                  {/* Decorative bottom divider */}
                  <div className="my-5 flex items-center justify-center gap-2 opacity-70">
                    <span className="h-[0.5px] w-12 bg-[#9c814b]" />
                    <span className="font-display text-[0.65rem] text-[#9c814b]">❖</span>
                    <span className="h-[0.5px] w-12 bg-[#9c814b]" />
                  </div>

                  {/* Step 2 Proceed Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217,119,6,0.6)" }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={onProceed}
                    className="group relative mt-2 flex items-center justify-center gap-2 rounded-full border border-gold bg-gradient-to-r from-[#92400e] via-[#b45309] to-[#92400e] px-8 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#fef3c7] shadow-lg transition-all cursor-pointer"
                  >
                    <span>Ippo Open Pannu</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">📖</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
