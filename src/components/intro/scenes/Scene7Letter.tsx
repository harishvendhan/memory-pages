import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IntroAudioController } from "@/components/intro/useIntroAudio";
import paperTexture from "@/assets/paper.jpg";

interface Scene7LetterProps {
  audioController?: IntroAudioController;
  isReducedMotion?: boolean;
  onProceedToBook?: () => void;
}

interface LetterLine {
  text: string;
  isTitle?: boolean;
  isSalutation?: boolean;
  isClosing?: boolean;
  isSignature?: boolean;
  pauseAfterMs: number;
  typingSpeedMs: number;
}

interface LetterPage {
  pageNumber: number;
  lines: LetterLine[];
}

const LETTER_PAGES: LetterPage[] = [
  // ── Page 1: Opening & Birthday Dedication ──
  {
    pageNumber: 1,
    lines: [
      {
        text: "❤️ For Jasmeena Farveen (My Meow Kutty 🐾) ❤️",
        isTitle: true,
        pauseAfterMs: 1000,
        typingSpeedMs: 38,
      },
      {
        text: "My Lovable Meow Kutty 🐱💕,",
        isSalutation: true,
        pauseAfterMs: 1400,
        typingSpeedMs: 38,
      },
      {
        text: "If you're reading this... it means you've just opened a little piece of my heart.",
        pauseAfterMs: 1600,
        typingSpeedMs: 28,
      },
      {
        text: "Today is your birthday... and I wanted to give you something that isn't bought from a store...",
        pauseAfterMs: 1600,
        typingSpeedMs: 26,
      },
      {
        text: "something that no price could ever define.",
        pauseAfterMs: 2000,
        typingSpeedMs: 30,
      },
    ],
  },

  // ── Page 2: Every Memory That Made Us 'Us' ──
  {
    pageNumber: 2,
    lines: [
      {
        text: "Every smile we shared...",
        pauseAfterMs: 800,
        typingSpeedMs: 32,
      },
      {
        text: "every random conversation...",
        pauseAfterMs: 800,
        typingSpeedMs: 30,
      },
      {
        text: "every late-night chat...",
        pauseAfterMs: 800,
        typingSpeedMs: 30,
      },
      {
        text: "every moment of happiness...",
        pauseAfterMs: 800,
        typingSpeedMs: 30,
      },
      {
        text: "every misunderstanding that made us stronger...",
        pauseAfterMs: 1100,
        typingSpeedMs: 28,
      },
      {
        text: "and every memory that made us \"us\"...",
        pauseAfterMs: 1300,
        typingSpeedMs: 30,
      },
      {
        text: "deserves to live forever.",
        isClosing: true,
        pauseAfterMs: 2200,
        typingSpeedMs: 36,
      },
    ],
  },

  // ── Page 3: Timeless Love & The Book ──
  {
    pageNumber: 3,
    lines: [
      {
        text: "Phones can be changed. Chats can disappear. Time keeps moving forward.",
        pauseAfterMs: 1600,
        typingSpeedMs: 26,
      },
      {
        text: "But love... and the memories created with it... should never be forgotten.",
        pauseAfterMs: 1800,
        typingSpeedMs: 26,
      },
      {
        text: "That's why I gathered every little memory I could...",
        pauseAfterMs: 1400,
        typingSpeedMs: 28,
      },
      {
        text: "and carefully turned them into this book.",
        isClosing: true,
        pauseAfterMs: 2200,
        typingSpeedMs: 32,
      },
    ],
  },

  // ── Page 4: Hope & Moments ──
  {
    pageNumber: 4,
    lines: [
      {
        text: "As you turn these pages... I hope you smile at the moments we've shared.",
        pauseAfterMs: 1400,
        typingSpeedMs: 26,
      },
      {
        text: "I hope you laugh at our silly conversations. I hope you remember how beautiful our journey has been.",
        pauseAfterMs: 1600,
        typingSpeedMs: 24,
      },
      {
        text: "And whenever life feels difficult... I hope this little book reminds you that...",
        pauseAfterMs: 1400,
        typingSpeedMs: 26,
      },
      {
        text: "there will always be someone who treasures every single memory with you.",
        pauseAfterMs: 1800,
        typingSpeedMs: 28,
      },
      {
        text: "This isn't just a collection of messages. It's a collection of moments that made me grateful that our paths crossed.",
        isClosing: true,
        pauseAfterMs: 2200,
        typingSpeedMs: 24,
      },
    ],
  },

  // ── Page 5: Birthday Wish & Signature ──
  {
    pageNumber: 5,
    lines: [
      {
        text: "So today... on your special day... I have only one wish...",
        pauseAfterMs: 1400,
        typingSpeedMs: 28,
      },
      {
        text: "May your smile always stay as beautiful as the memories inside these pages.",
        pauseAfterMs: 1600,
        typingSpeedMs: 26,
      },
      {
        text: "Happy Birthday, My Love. ❤️",
        isTitle: true,
        pauseAfterMs: 1800,
        typingSpeedMs: 36,
      },
      {
        text: "Thank you... for being one of the most beautiful chapters of my life.",
        pauseAfterMs: 1800,
        typingSpeedMs: 28,
      },
      {
        text: "With all my love,",
        isSalutation: true,
        pauseAfterMs: 1200,
        typingSpeedMs: 32,
      },
      {
        text: "❤️ Epadiku Unavan ❤️",
        isSignature: true,
        pauseAfterMs: 3000,
        typingSpeedMs: 40,
      },
    ],
  },
];

export function Scene7Letter({
  audioController,
  isReducedMotion = false,
  onProceedToBook,
}: Scene7LetterProps) {
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);
  const [revealedChars, setRevealedChars] = useState<number>(0);
  const [isFolding, setIsFolding] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  const isCancelledRef = useRef<boolean>(false);

  const currentPage = LETTER_PAGES[currentPageIdx] || LETTER_PAGES[0]!;

  // Drifting Rose Petals
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: `${(i * 7.5 + 4) % 96}%`,
        delay: (i * 0.8) % 5,
        duration: 8 + (i % 4) * 2,
        size: 14 + (i % 3) * 6,
        rotateStart: (i * 45) % 360,
      })),
    [],
  );

  // Floating Golden Dust
  const dustParticles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${(i * 5.8 + 8) % 92}%`,
        delay: (i * 0.5) % 4,
        duration: 5 + (i % 3) * 1.5,
        size: 2 + (i % 3),
      })),
    [],
  );

  const handleFinishLetter = useCallback(() => {
    setIsFolding(true);
    audioController?.playMagicalChime();
    setTimeout(() => {
      setIsCompleted(true);
      onProceedToBook?.();
    }, 2400);
  }, [audioController, onProceedToBook]);

  const handleNextPage = useCallback(() => {
    setIsManualMode(true);
    if (currentPageIdx < LETTER_PAGES.length - 1) {
      audioController?.playPaperRustle();
      setCurrentPageIdx((prev) => prev + 1);
      setCurrentLineIdx(99); // Show all lines on new page immediately
      setRevealedChars(999);
    } else {
      handleFinishLetter();
    }
  }, [currentPageIdx, audioController, handleFinishLetter]);

  const handlePrevPage = useCallback(() => {
    if (currentPageIdx > 0) {
      setIsManualMode(true);
      audioController?.playPaperRustle();
      setCurrentPageIdx((prev) => prev - 1);
      setCurrentLineIdx(99);
      setRevealedChars(999);
    }
  }, [currentPageIdx, audioController]);

  useEffect(() => {
    if (isManualMode) return;
    isCancelledRef.current = false;

    if (isReducedMotion) {
      // Reduced motion
      let pIdx = 0;
      let lIdx = 0;

      const stepReduced = () => {
        if (isCancelledRef.current) return;

        const page = LETTER_PAGES[pIdx];
        if (!page) {
          handleFinishLetter();
          return;
        }

        const line = page.lines[lIdx];
        if (!line) {
          pIdx++;
          lIdx = 0;
          setCurrentPageIdx(pIdx);
          setCurrentLineIdx(0);
          setRevealedChars(0);
          setTimeout(stepReduced, 800);
          return;
        }

        setCurrentPageIdx(pIdx);
        setCurrentLineIdx(lIdx);
        setRevealedChars(line.text.length);

        if (pIdx === LETTER_PAGES.length - 1 && lIdx === page.lines.length - 1) {
          audioController?.playMagicalChime();
        }

        const pause = line.pauseAfterMs;
        lIdx++;
        setTimeout(stepReduced, pause);
      };

      stepReduced();
      return () => {
        isCancelledRef.current = true;
      };
    }

    // Calligraphy / Fountain Pen Writing Engine
    let pIdx = currentPageIdx;
    let lIdx = 0;
    let charIdx = 0;

    const typeNextChar = () => {
      if (isCancelledRef.current) return;

      const page = LETTER_PAGES[pIdx];
      if (!page) {
        handleFinishLetter();
        return;
      }

      const line = page.lines[lIdx];
      if (!line) {
        audioController?.playPaperRustle();
        pIdx++;
        lIdx = 0;
        charIdx = 0;
        setCurrentPageIdx(pIdx);
        setCurrentLineIdx(0);
        setRevealedChars(0);
        setTimeout(typeNextChar, 1000);
        return;
      }

      setCurrentPageIdx(pIdx);
      setCurrentLineIdx(lIdx);

      if (charIdx < line.text.length) {
        charIdx++;
        setRevealedChars(charIdx);

        if (charIdx % 2 === 0) {
          audioController?.playFeatherPen();
        }

        const variance =
          line.typingSpeedMs +
          (Math.random() * 12 - 6) -
          (charIdx > 12 ? 4 : 0);
        setTimeout(typeNextChar, Math.max(16, variance));
      } else {
        if (pIdx === LETTER_PAGES.length - 1 && lIdx === page.lines.length - 1) {
          audioController?.playMagicalChime();
        }

        lIdx++;
        charIdx = 0;
        setTimeout(typeNextChar, line.pauseAfterMs);
      }
    };

    typeNextChar();

    return () => {
      isCancelledRef.current = true;
    };
  }, [isManualMode, isReducedMotion, audioController, handleFinishLetter, currentPageIdx]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a0d17] via-[#141018] to-[#08060a] p-3 sm:p-6 overflow-hidden select-none">
      {/* Warm flickering candlelight atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.22),transparent_70%)] pointer-events-none animate-candle" />

      {/* Floating Golden Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {dustParticles.map((d) => (
          <motion.div
            key={d.id}
            initial={{ y: "100vh", opacity: 0, scale: 0.5 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.4],
            }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: d.left, width: d.size, height: d.size }}
            className="absolute rounded-full bg-amber-200/80 shadow-[0_0_8px_rgba(255,215,0,0.8)]"
          />
        ))}
      </div>

      {/* Drifting Romantic Rose Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {petals.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              y: "-10vh",
              x: 0,
              rotateZ: p.rotateStart,
              rotateY: 0,
              opacity: 0,
            }}
            animate={{
              y: "110vh",
              x: [0, 25, -20, 15, 0],
              rotateZ: [p.rotateStart, p.rotateStart + 180, p.rotateStart + 360],
              rotateY: [0, 180, 360],
              opacity: [0, 0.75, 0.75, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ left: p.left, width: p.size, height: p.size * 1.3 }}
            className="absolute rounded-tl-full rounded-br-full bg-gradient-to-br from-[#d93850]/80 via-[#9c1428]/70 to-[#5a0914]/80 shadow-[0_4px_12px_rgba(156,20,40,0.35)]"
          />
        ))}
      </div>

      {/* Parchment Love Letter Card */}
      <AnimatePresence mode="wait">
        {!isCompleted && (
          <motion.div
            key={`letter-page-${currentPageIdx}`}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={
              isFolding
                ? {
                    scale: [1, 0.7, 0.3, 0],
                    rotateY: [0, 45, 90, 120],
                    rotateX: [0, 15, 30, 45],
                    y: [0, -30, -80, -120],
                    opacity: [1, 1, 0.6, 0],
                  }
                : { scale: 1, opacity: 1, y: 0 }
            }
            exit={{ scale: 0.94, opacity: 0, y: -10 }}
            transition={{
              duration: isFolding ? 2.2 : 0.6,
              ease: isFolding ? [0.4, 0, 0.2, 1] : [0.22, 1, 0.36, 1],
            }}
            className="relative z-20 w-full max-w-xl min-h-[30rem] sm:min-h-[32rem] rounded-2xl border-2 border-[#b89c66]/80 bg-[#f7f2e8] p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(212,175,55,0.3)] overflow-hidden flex flex-col justify-between"
          >
            {/* Paper Texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-45 mix-blend-multiply"
              style={{
                backgroundImage: `url(${paperTexture})`,
                backgroundSize: "cover",
              }}
              aria-hidden
            />

            {/* Inner Border Vignette */}
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                boxShadow: "inset 0 0 45px oklch(0.2 0.04 45 / 0.45)",
              }}
              aria-hidden
            />

            {/* Top Page Header */}
            <div className="relative z-10 flex items-center justify-between text-[#8f7540] text-xs font-display tracking-widest opacity-80 mb-2 border-b border-[#d4af37]/30 pb-2">
              <span className="font-semibold">❦ Jasmeena Farveen</span>
              <span className="text-[0.72rem] uppercase tracking-wider text-[#991b1b] font-bold">
                Chapter {currentPage.pageNumber} of {LETTER_PAGES.length}
              </span>
              <span className="font-semibold">Unavan ❦</span>
            </div>

            {/* Calligraphy Letter Lines */}
            <div className="relative z-10 flex-1 flex flex-col justify-center space-y-3 sm:space-y-3.5 text-[#2b1f14] my-2">
              {currentPage.lines.map((line, lIdx) => {
                let textToDisplay = "";
                const isActive = lIdx === currentLineIdx;
                const isPast = isManualMode || lIdx < currentLineIdx;

                if (isPast) {
                  textToDisplay = line.text;
                } else if (isActive) {
                  textToDisplay = line.text.slice(0, revealedChars);
                }

                if (!textToDisplay && !isActive) return null;

                return (
                  <div key={lIdx} className="relative">
                    {/* Header Title */}
                    {line.isTitle && (
                      <h1 className="font-display text-center text-xl sm:text-2xl font-bold tracking-wide text-[#991b1b] drop-shadow-[0_1px_3px_rgba(153,27,27,0.3)] my-1">
                        {textToDisplay}
                        {isActive && !isFolding && (
                          <span className="inline-block w-1.5 h-4 ml-1 bg-[#991b1b] animate-pulse align-middle" />
                        )}
                      </h1>
                    )}

                    {/* Salutation */}
                    {line.isSalutation && (
                      <p className="font-serif font-bold text-base sm:text-lg text-[#8c1d1d] tracking-wide drop-shadow-[0_0.5px_1px_rgba(140,29,29,0.3)]">
                        {textToDisplay}
                        {isActive && !isFolding && (
                          <span className="inline-block w-1.5 h-4 ml-1 bg-[#8c1d1d] animate-pulse align-middle" />
                        )}
                      </p>
                    )}

                    {/* Signature */}
                    {line.isSignature && (
                      <div className="text-center pt-2">
                        <p className="font-display font-extrabold text-xl sm:text-2xl text-[#991b1b] tracking-wider drop-shadow-[0_1px_4px_rgba(153,27,27,0.4)]">
                          {textToDisplay}
                          {isActive && !isFolding && (
                            <span className="inline-block w-2 h-5 ml-1 bg-[#991b1b] animate-pulse align-middle" />
                          )}
                        </p>
                      </div>
                    )}

                    {/* Regular Paragraph */}
                    {!line.isTitle && !line.isSalutation && !line.isSignature && (
                      <p
                        className={`font-serif leading-relaxed text-[0.96rem] sm:text-[1.06rem] drop-shadow-[0_0.5px_0.5px_rgba(43,31,20,0.35)] ${
                          line.isClosing
                            ? "font-semibold italic text-[#3f2518]"
                            : "text-[#2b1f14]"
                        }`}
                      >
                        {textToDisplay}
                        {isActive && !isFolding && (
                          <span className="inline-block w-1.5 h-4 ml-1 bg-[#2b1f14] animate-pulse align-middle" />
                        )}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Navigation & Handoff Controls */}
            <div className="relative z-10 pt-3 border-t border-[#d4af37]/30 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPageIdx === 0}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif tracking-wide border transition-all ${
                  currentPageIdx === 0
                    ? "opacity-30 cursor-not-allowed border-transparent text-[#786c5e]"
                    : "border-[#b89c66] bg-[#f0e7d5] hover:bg-[#ebdcc4] text-[#4a3b2c] shadow-sm cursor-pointer"
                }`}
              >
                ⮜ Previous
              </button>

              {/* Page Dots */}
              <div className="flex items-center gap-1.5">
                {LETTER_PAGES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsManualMode(true);
                      setCurrentPageIdx(idx);
                      setCurrentLineIdx(99);
                      setRevealedChars(999);
                    }}
                    className={`size-2.5 rounded-full transition-all cursor-pointer ${
                      currentPageIdx === idx
                        ? "bg-[#991b1b] scale-125 shadow-[0_0_6px_rgba(153,27,27,0.6)]"
                        : "bg-[#d4af37]/50 hover:bg-[#d4af37]"
                    }`}
                    title={`Page ${idx + 1}`}
                  />
                ))}
              </div>

              {currentPageIdx < LETTER_PAGES.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide border border-[#b89c66] bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] text-[#fff7ed] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Next Page ➔
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishLetter}
                  className="px-4 py-1.5 rounded-lg text-xs font-display font-bold tracking-wide border border-[#b89c66] bg-gradient-to-r from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-[#fff7ed] shadow-[0_2px_10px_rgba(185,28,28,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer animate-pulse"
                >
                  Open Our Story 📖
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folding Paper Golden Sparkle Burst */}
      {isFolding && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.4, 0],
                opacity: [1, 1, 0],
                x: (Math.cos((i * 12 * Math.PI) / 180) * (80 + (i % 5) * 35)),
                y: (Math.sin((i * 12 * Math.PI) / 180) * (80 + (i % 5) * 35)) - 40,
              }}
              transition={{ duration: 2.2, ease: "easeOut", delay: 0.6 }}
              className="absolute size-3 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-200 to-white shadow-[0_0_15px_rgba(255,215,0,0.9)]"
            />
          ))}
        </div>
      )}
    </div>
  );
}
