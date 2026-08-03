import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import paperTexture from "@/assets/paper.jpg";

export interface BirthdayLoveLetterProps {
  onComplete: () => void;
}

interface LetterLine {
  text: string;
  isTitle?: boolean;
  isSalutation?: boolean;
  isClosing?: boolean;
  isSignature?: boolean;
  isBirthdayHighlight?: boolean;
  isLoveDeclaration?: boolean;
  pauseAfterMs: number;
}

interface LetterPage {
  pageNumber: number;
  title: string;
  lines: LetterLine[];
}

const LETTER_PAGES: LetterPage[] = [
  // ── Page 1: Birthday Dedication ──
  {
    pageNumber: 1,
    title: "A Heartfelt Dedication",
    lines: [
      {
        text: "❤️ For Jasmeena Farveen (My Meow Kutty 🐾) ❤️",
        isTitle: true,
        pauseAfterMs: 700,
      },
      {
        text: "My Lovable Meow Kutty 🐱💕,",
        isSalutation: true,
        pauseAfterMs: 900,
      },
      {
        text: "If you're reading this... it means you've just opened a little piece of my heart. 💌✨",
        pauseAfterMs: 1000,
      },
      {
        text: "Today is your birthday... and I wanted to give you something that isn't bought from a store... 🎁",
        pauseAfterMs: 1000,
      },
      {
        text: "something that no price could ever define. 💖",
        isClosing: true,
        pauseAfterMs: 1400,
      },
    ],
  },

  // ── Page 2: Every Memory That Made Us 'Us' ──
  {
    pageNumber: 2,
    title: "Every Precious Moment",
    lines: [
      {
        text: "Every smile we shared... 😊",
        pauseAfterMs: 600,
      },
      {
        text: "every random conversation... 💬",
        pauseAfterMs: 600,
      },
      {
        text: "every late-night chat... 🌙",
        pauseAfterMs: 600,
      },
      {
        text: "every moment of happiness... 🥰",
        pauseAfterMs: 600,
      },
      {
        text: "every misunderstanding that made us stronger... 🥺🫂",
        pauseAfterMs: 800,
      },
      {
        text: "and every memory that made us \"us\"... 🌸",
        pauseAfterMs: 800,
      },
      {
        text: "deserves to live forever. ✨",
        isClosing: true,
        pauseAfterMs: 1400,
      },
    ],
  },

  // ── Page 3: Timeless Love & The Memory Book ──
  {
    pageNumber: 3,
    title: "Timeless Memories",
    lines: [
      {
        text: "Phones can be changed. Chats can disappear. Time keeps moving forward. ⏳",
        pauseAfterMs: 1000,
      },
      {
        text: "But love... and the memories created with it... should never be forgotten. 💫",
        pauseAfterMs: 1100,
      },
      {
        text: "That's why I gathered every little memory I could... 📸",
        pauseAfterMs: 900,
      },
      {
        text: "and carefully turned them into this book for you. 📖❤️",
        isClosing: true,
        pauseAfterMs: 1400,
      },
    ],
  },

  // ── Page 4: Hope & Warmth ──
  {
    pageNumber: 4,
    title: "Always In My Heart",
    lines: [
      {
        text: "As you turn these pages... I hope you smile at the moments we've shared. 🥹",
        pauseAfterMs: 1000,
      },
      {
        text: "I hope you laugh at our silly conversations. I hope you remember how beautiful our journey has been. 🐱🐾",
        pauseAfterMs: 1100,
      },
      {
        text: "And whenever life feels difficult... I hope this little book reminds you that... 🫂",
        pauseAfterMs: 1000,
      },
      {
        text: "there will always be someone who treasures every single memory with you. 💖",
        pauseAfterMs: 1200,
      },
      {
        text: "This is a collection of moments that made me grateful that our paths crossed. 🌷",
        isClosing: true,
        pauseAfterMs: 1400,
      },
    ],
  },

  // ── Page 5: Birthday Wishes, Epadiku Unavan & I Love You ──
  {
    pageNumber: 5,
    title: "Happy Birthday Wishes",
    lines: [
      {
        text: "So today... on your special day... I have only one wish... 🎂",
        pauseAfterMs: 800,
      },
      {
        text: "May your smile always stay as radiant and beautiful as ever. 🌟",
        pauseAfterMs: 900,
      },
      {
        text: "🎂 Happy Birthday, My Lovable Meow Kutty! 🐱💖🎉",
        isBirthdayHighlight: true,
        pauseAfterMs: 1200,
      },
      {
        text: "Thank you for being the most precious chapter of my life. 🌹",
        pauseAfterMs: 1000,
      },
      {
        text: "❤️ Epadiku Unavan ❤️",
        isSignature: true,
        pauseAfterMs: 1200,
      },
      {
        text: "💖 I Love You Jasmeena Farveen 💖",
        isLoveDeclaration: true,
        pauseAfterMs: 2500,
      },
    ],
  },
];

export function BirthdayLoveLetter({ onComplete }: BirthdayLoveLetterProps) {
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);
  const [revealedCharCount, setRevealedCharCount] = useState<number>(0);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const isCancelledRef = useRef<boolean>(false);
  const currentPage = LETTER_PAGES[currentPageIdx] || LETTER_PAGES[0]!;

  // Convert current lines into segmented characters array to avoid emoji split
  const pageLinesChars = useMemo(() => {
    return currentPage.lines.map((line) => Array.from(line.text));
  }, [currentPage]);

  // Drifting Rose Petals
  const petals = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        left: `${(i * 6.2 + 3) % 94}%`,
        delay: (i * 0.7) % 6,
        duration: 9 + (i % 4) * 2,
        size: 15 + (i % 3) * 5,
        rotateStart: (i * 50) % 360,
      })),
    [],
  );

  // Soft Floating Golden Embers
  const dustParticles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${(i * 4.9 + 5) % 92}%`,
        delay: (i * 0.4) % 5,
        duration: 6 + (i % 3) * 2,
        size: 2 + (i % 3),
      })),
    [],
  );

  const handleFinish = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  const handleNextPage = useCallback(() => {
    if (currentPageIdx < LETTER_PAGES.length - 1) {
      setIsManualMode(false);
      setCurrentPageIdx((prev) => prev + 1);
      setCurrentLineIdx(0);
      setRevealedCharCount(0);
    } else {
      handleFinish();
    }
  }, [currentPageIdx, handleFinish]);

  const handlePrevPage = useCallback(() => {
    if (currentPageIdx > 0) {
      setIsManualMode(true);
      setCurrentPageIdx((prev) => prev - 1);
      setCurrentLineIdx(99);
      setRevealedCharCount(9999);
    }
  }, [currentPageIdx]);

  const handleJumpToPage = (idx: number) => {
    setIsManualMode(true);
    setCurrentPageIdx(idx);
    setCurrentLineIdx(99);
    setRevealedCharCount(9999);
  };

  // Buttery-smooth, consistent fluid typewriter engine
  useEffect(() => {
    if (isManualMode) return;
    isCancelledRef.current = false;

    let pIdx = currentPageIdx;
    let lIdx = currentLineIdx;
    let charCount = revealedCharCount;

    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      if (isCancelledRef.current) return;

      const page = LETTER_PAGES[pIdx];
      if (!page) return;

      const linesChars = page.lines.map((l) => Array.from(l.text));
      const currentChars = linesChars[lIdx];

      if (!currentChars) {
        // Finished all lines on current page
        if (pIdx < LETTER_PAGES.length - 1) {
          timeoutId = setTimeout(() => {
            if (isCancelledRef.current) return;
            pIdx++;
            lIdx = 0;
            charCount = 0;
            setCurrentPageIdx(pIdx);
            setCurrentLineIdx(0);
            setRevealedCharCount(0);
            timeoutId = setTimeout(tick, 600);
          }, 2200);
        }
        return;
      }

      if (charCount < currentChars.length) {
        charCount++;
        setRevealedCharCount(charCount);
        // Silky smooth constant cadence ~28ms
        timeoutId = setTimeout(tick, 28);
      } else {
        // Line complete -> pause slightly before next line
        const pauseTime = page.lines[lIdx]?.pauseAfterMs ?? 800;
        lIdx++;
        charCount = 0;
        timeoutId = setTimeout(() => {
          if (isCancelledRef.current) return;
          setCurrentLineIdx(lIdx);
          setRevealedCharCount(0);
          tick();
        }, pauseTime);
      }
    };

    timeoutId = setTimeout(tick, 250);

    return () => {
      isCancelledRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [isManualMode, currentPageIdx]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#09060b]/95 p-3 sm:p-6 overflow-hidden select-none"
    >
      {/* Warm flickering candle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.22),transparent_70%)] pointer-events-none" />

      {/* Floating Golden Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {dustParticles.map((d) => (
          <motion.div
            key={d.id}
            initial={{ y: "100vh", opacity: 0, scale: 0.6 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.85, 0],
              scale: [0.6, 1.2, 0.4],
            }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: d.left, width: d.size, height: d.size }}
            className="absolute rounded-full bg-amber-200/90 shadow-[0_0_8px_rgba(255,215,0,0.8)]"
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
              x: [0, 20, -20, 15, 0],
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
            className="absolute rounded-tl-full rounded-br-full bg-gradient-to-br from-[#d93850]/80 via-[#9c1428]/75 to-[#5a0914]/80 shadow-[0_4px_12px_rgba(156,20,40,0.35)]"
          />
        ))}
      </div>

      {/* Skip to Book Button Top Right */}
      <button
        type="button"
        onClick={handleFinish}
        className="absolute top-4 right-4 z-30 flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-black/40 px-4 py-1.5 text-xs font-serif text-amber-200/80 backdrop-blur-md transition-all hover:bg-black/70 hover:text-amber-100 hover:border-[#d4af37] cursor-pointer"
      >
        <span>Skip to Book</span>
        <span className="text-xs">➔</span>
      </button>

      {/* Main Parchment Letter Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`letter-page-${currentPageIdx}`}
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 w-full max-w-xl min-h-[31rem] sm:min-h-[33.5rem] rounded-2xl border-2 border-[#b89c66]/90 bg-[#f7f2e8] p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.35)] overflow-hidden flex flex-col justify-between"
        >
          {/* Authentic Paper Texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-45 mix-blend-multiply"
            style={{
              backgroundImage: `url(${paperTexture})`,
              backgroundSize: "cover",
            }}
            aria-hidden
          />

          {/* Vignette Shadow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              boxShadow: "inset 0 0 50px oklch(0.2 0.04 45 / 0.5)",
            }}
            aria-hidden
          />

          {/* Header Title Bar */}
          <div className="relative z-10 flex items-center justify-between text-[#8f7540] text-xs font-display tracking-widest mb-3 border-b border-[#d4af37]/35 pb-2.5">
            <span className="font-semibold text-[0.75rem] flex items-center gap-1">
              <span>🐾</span>
              <span>Jasmeena Farveen</span>
            </span>
            <span className="text-[0.7rem] uppercase tracking-wider text-[#991b1b] font-bold bg-[#991b1b]/10 px-2.5 py-0.5 rounded-full border border-[#991b1b]/20">
              Page {currentPage.pageNumber} of {LETTER_PAGES.length}
            </span>
            <span className="font-semibold text-[0.75rem] flex items-center gap-1">
              <span>Epadiku Unavan</span>
              <span>❤️</span>
            </span>
          </div>

          {/* Letter Body */}
          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-2.5 sm:space-y-3 text-[#2b1f14] my-2">
            {currentPage.lines.map((line, lIdx) => {
              const chars = pageLinesChars[lIdx] || [];
              const isPastLine = isManualMode || lIdx < currentLineIdx;
              const isActiveLine = lIdx === currentLineIdx;
              const isFutureLine = !isManualMode && lIdx > currentLineIdx;

              if (isFutureLine) return null;

              return (
                <div key={lIdx} className="relative">
                  {/* Title */}
                  {line.isTitle && (
                    <h1 className="font-display text-center text-xl sm:text-2xl font-bold tracking-wide text-[#991b1b] drop-shadow-[0_1px_2px_rgba(153,27,27,0.25)] my-1">
                      {chars.map((char, cIdx) => {
                        const isCharVisible = isPastLine || cIdx < revealedCharCount;
                        if (!isCharVisible) return null;
                        return (
                          <span
                            key={cIdx}
                            className="transition-opacity duration-150 inline"
                            style={{ opacity: 1 }}
                          >
                            {char}
                          </span>
                        );
                      })}
                      {isActiveLine && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-[#991b1b] animate-pulse align-middle" />
                      )}
                    </h1>
                  )}

                  {/* Birthday Highlight Banner */}
                  {line.isBirthdayHighlight && (
                    <div className="text-center my-2 p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-pink-100/70 via-rose-100/80 to-pink-100/70 border border-pink-300/70 shadow-sm">
                      <h2 className="font-display text-lg sm:text-2xl font-extrabold tracking-wide text-[#831843] drop-shadow-[0_1px_3px_rgba(131,24,67,0.3)]">
                        {chars.map((char, cIdx) => {
                          const isCharVisible = isPastLine || cIdx < revealedCharCount;
                          if (!isCharVisible) return null;
                          return (
                            <span
                              key={cIdx}
                              className="transition-opacity duration-150 inline"
                              style={{ opacity: 1 }}
                            >
                              {char}
                            </span>
                          );
                        })}
                        {isActiveLine && (
                          <span className="inline-block w-2 h-5 ml-1 bg-[#831843] animate-pulse align-middle" />
                        )}
                      </h2>
                    </div>
                  )}

                  {/* Salutation */}
                  {line.isSalutation && (
                    <p className="font-serif font-bold text-base sm:text-lg text-[#8c1d1d] tracking-wide">
                      {chars.map((char, cIdx) => {
                        const isCharVisible = isPastLine || cIdx < revealedCharCount;
                        if (!isCharVisible) return null;
                        return (
                          <span
                            key={cIdx}
                            className="transition-opacity duration-150 inline"
                            style={{ opacity: 1 }}
                          >
                            {char}
                          </span>
                        );
                      })}
                      {isActiveLine && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-[#8c1d1d] animate-pulse align-middle" />
                      )}
                    </p>
                  )}

                  {/* Signature: Epadiku Unavan */}
                  {line.isSignature && (
                    <div className="text-center pt-1">
                      <p className="font-display font-extrabold text-lg sm:text-xl text-[#991b1b] tracking-wider drop-shadow-[0_1px_3px_rgba(153,27,27,0.3)]">
                        {chars.map((char, cIdx) => {
                          const isCharVisible = isPastLine || cIdx < revealedCharCount;
                          if (!isCharVisible) return null;
                          return (
                            <span
                              key={cIdx}
                              className="transition-opacity duration-150 inline"
                              style={{ opacity: 1 }}
                            >
                              {char}
                            </span>
                          );
                        })}
                        {isActiveLine && (
                          <span className="inline-block w-2 h-5 ml-1 bg-[#991b1b] animate-pulse align-middle" />
                        )}
                      </p>
                    </div>
                  )}

                  {/* Lovable Animated Love Declaration: I Love You Jasmeena Farveen */}
                  {line.isLoveDeclaration && (
                    <motion.div
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{
                        scale: [1, 1.04, 1],
                        opacity: 1,
                      }}
                      transition={{
                        scale: {
                          repeat: Infinity,
                          duration: 2.2,
                          ease: "easeInOut",
                        },
                        opacity: { duration: 0.6 },
                      }}
                      className="text-center my-1 sm:my-2 p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-rose-200/60 via-pink-100/80 to-rose-200/60 border border-pink-400/60 shadow-[0_0_20px_rgba(244,114,182,0.45)] relative overflow-hidden"
                    >
                      {/* Gentle heart aura shimmer */}
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.0,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-300/30 to-transparent pointer-events-none"
                      />

                      <h3 className="relative z-10 font-display text-xl sm:text-2xl font-black tracking-wide text-[#831843] drop-shadow-[0_2px_8px_rgba(190,24,93,0.35)] flex items-center justify-center gap-1.5">
                        <motion.span
                          animate={{ scale: [1, 1.25, 1], rotate: [0, 6, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 1.8 }}
                          className="inline-block text-xl sm:text-2xl"
                        >
                          💖
                        </motion.span>
                        <span>
                          {chars.map((char, cIdx) => {
                            // Don't duplicate outer heart emojis if they are in the text
                            if (char === "💖") return null;
                            const isCharVisible = isPastLine || cIdx < revealedCharCount;
                            if (!isCharVisible) return null;
                            return (
                              <span
                                key={cIdx}
                                className="transition-opacity duration-150 inline"
                                style={{ opacity: 1 }}
                              >
                                {char}
                              </span>
                            );
                          })}
                        </span>
                        <motion.span
                          animate={{ scale: [1, 1.25, 1], rotate: [0, -6, 6, 0] }}
                          transition={{ repeat: Infinity, duration: 1.8, delay: 0.2 }}
                          className="inline-block text-xl sm:text-2xl"
                        >
                          💖
                        </motion.span>
                      </h3>
                    </motion.div>
                  )}

                  {/* Standard Love Letter Sentences */}
                  {!line.isTitle &&
                    !line.isBirthdayHighlight &&
                    !line.isSalutation &&
                    !line.isSignature &&
                    !line.isLoveDeclaration && (
                      <p
                        className={`font-serif leading-relaxed text-[0.98rem] sm:text-[1.08rem] drop-shadow-[0_0.5px_0.5px_rgba(43,31,20,0.3)] ${
                          line.isClosing
                            ? "font-semibold italic text-[#3f2518]"
                            : "text-[#2b1f14]"
                        }`}
                      >
                        {chars.map((char, cIdx) => {
                          const isCharVisible = isPastLine || cIdx < revealedCharCount;
                          if (!isCharVisible) return null;
                          return (
                            <span
                              key={cIdx}
                              className="transition-opacity duration-150 inline"
                              style={{ opacity: 1 }}
                            >
                              {char}
                            </span>
                          );
                        })}
                        {isActiveLine && (
                          <span className="inline-block w-1.5 h-4 ml-1 bg-[#2b1f14] animate-pulse align-middle" />
                        )}
                      </p>
                    )}
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation & Controls */}
          <div className="relative z-10 pt-3 border-t border-[#d4af37]/35 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPageIdx === 0}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif tracking-wide border transition-all ${
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
                  onClick={() => handleJumpToPage(idx)}
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
                className="px-4 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide border border-[#b89c66] bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] text-[#fff7ed] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Next Page</span>
                <span>➔</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-1.5 rounded-lg text-xs font-display font-bold tracking-wide border border-[#b89c66] bg-gradient-to-r from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-[#fff7ed] shadow-[0_2px_12px_rgba(185,28,28,0.45)] hover:brightness-110 active:scale-95 transition-all cursor-pointer animate-pulse"
              >
                Open Memory Book 📖
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
