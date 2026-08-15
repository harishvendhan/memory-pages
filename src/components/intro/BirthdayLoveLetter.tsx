import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import paperTexture from "@/assets/paper.jpg";
import { RunningCatCoupleShades } from "@/components/atmosphere/RunningCatCoupleShades";

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
        pauseAfterMs: 900,
      },
      {
        text: "My Lovable Meow Kutty 🐱💕,",
        isSalutation: true,
        pauseAfterMs: 1100,
      },
      {
        text: "If you're reading this... it means you've just opened a little piece of my heart. 💌✨",
        pauseAfterMs: 1300,
      },
      {
        text: "Today is your birthday... and I wanted to give you something that isn't bought from a store... 🎁",
        pauseAfterMs: 1300,
      },
      {
        text: "something that no price could ever define. 💖",
        isClosing: true,
        pauseAfterMs: 1800,
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
        pauseAfterMs: 850,
      },
      {
        text: "every random conversation... 💬",
        pauseAfterMs: 850,
      },
      {
        text: "every late-night chat... 🌙",
        pauseAfterMs: 850,
      },
      {
        text: "every moment of happiness... 🥰",
        pauseAfterMs: 850,
      },
      {
        text: "every misunderstanding that made us stronger... 🥺🫂",
        pauseAfterMs: 1000,
      },
      {
        text: "and every memory that made us \"us\"... 🌸",
        pauseAfterMs: 1000,
      },
      {
        text: "deserves to live forever. ✨",
        isClosing: true,
        pauseAfterMs: 1800,
      },
    ],
  },

  // ── Page 3: Timeless Love & The Memory Book ──
  {
    pageNumber: 3,
    title: "Timeless Memories",
    lines: [
      {
        text: "People say time flies, and moments fade away... ⏳",
        pauseAfterMs: 1100,
      },
      {
        text: "but I never wanted our memories to get lost in the noise of everyday life. 💭",
        pauseAfterMs: 1300,
      },
      {
        text: "So I built this world for you. 📖💫",
        pauseAfterMs: 1300,
      },
      {
        text: "A safe haven where every laughter, every shared silence, and every story stays alive. 🕊️",
        isClosing: true,
        pauseAfterMs: 1800,
      },
    ],
  },

  // ── Page 4: A Treasured Collection ──
  {
    pageNumber: 4,
    title: "Forever Treasured",
    lines: [
      {
        text: "As you turn the pages of this book... 📖✨",
        pauseAfterMs: 1100,
      },
      {
        text: "I hope you laugh at our silly conversations. I hope you remember how beautiful our journey has been. 🐱🐾",
        pauseAfterMs: 1400,
      },
      {
        text: "And whenever life feels difficult... I hope this little book reminds you that... 🫂",
        pauseAfterMs: 1300,
      },
      {
        text: "there will always be someone who treasures every single memory with you. 💖",
        pauseAfterMs: 1500,
      },
      {
        text: "This is a collection of moments that made me grateful that our paths crossed. 🌷",
        isClosing: true,
        pauseAfterMs: 1800,
      },
    ],
  },

  // ── Page 5: Birthday Wishes, Epadiku Unavan & Locked Secret Message ──
  {
    pageNumber: 5,
    title: "Happy Birthday Wishes",
    lines: [
      {
        text: "So today... on your special day... I have only one wish... 🎂",
        pauseAfterMs: 1100,
      },
      {
        text: "May your smile always stay as radiant and beautiful as ever. 🌟",
        pauseAfterMs: 1200,
      },
      {
        text: "🎂 Happy Birthday, My Lovable Meow Kutty! 🐱💖🎉",
        isBirthdayHighlight: true,
        pauseAfterMs: 1500,
      },
      {
        text: "Thank you for being the most precious chapter of my life. 🌹",
        pauseAfterMs: 1300,
      },
      {
        text: "❤️ Epadiku Unavan ❤️",
        isSignature: true,
        pauseAfterMs: 1500,
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

  // ── Lock System State for "unlock my heart meow 🫣" ──
  const [isHeartUnlocked, setIsHeartUnlocked] = useState<boolean>(false);
  const [showLockModal, setShowLockModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [lockError, setLockError] = useState<string>("");
  const [isWrongShake, setIsWrongShake] = useState<boolean>(false);
  const [showConfettiBurst, setShowConfettiBurst] = useState<boolean>(false);

  const isCancelledRef = useRef<boolean>(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
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

  // Floating Confetti Hearts Burst when unlocked
  const burstHearts = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        emoji: ["💖", "💕", "✨", "🌸", "🥰", "🎉", "🐱", "❤️"][i % 8],
        x: (i % 2 === 0 ? 1 : -1) * (30 + (i * 18) % 180),
        y: -40 - (i * 22) % 240,
        rotate: (i * 45) % 360,
        delay: (i * 0.04) % 0.4,
        scale: 0.8 + (i % 3) * 0.3,
      })),
    [],
  );

  // Synthesize sweet unlock harp chime sound using Web Audio API
  const playUnlockChime = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + i * 0.08 + 1.2,
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 1.3);
      });
    } catch {
      // Audio fallback silent
    }
  }, []);

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
      if (!isHeartUnlocked) {
        setShowLockModal(true);
      } else {
        handleFinish();
      }
    }
  }, [currentPageIdx, isHeartUnlocked, handleFinish]);

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

  // Handle password submission
  const handleUnlockSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Normalize input (remove slashes, dashes, spaces)
    const cleaned = passwordInput.trim().replace(/[-/\s.]/g, "");

    if (cleaned === "31122025" || passwordInput.trim() === "31/12/2025") {
      setLockError("");
      setIsHeartUnlocked(true);
      setShowLockModal(false);
      setShowConfettiBurst(true);
      playUnlockChime();
      setTimeout(() => {
        setShowConfettiBurst(false);
      }, 4000);
    } else {
      setLockError("Aiyo thappana password meow kutty! 🙈 Try again 🥰");
      setIsWrongShake(true);
      setTimeout(() => setIsWrongShake(false), 600);
    }
  };

  // Focus password input when modal opens
  useEffect(() => {
    if (showLockModal) {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 200);
    }
  }, [showLockModal]);

  // Buttery-smooth typewriter engine
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
            timeoutId = setTimeout(tick, 700);
          }, 3000);
        } else {
          // On last page, if not unlocked, gently prompt the lock
          if (!isHeartUnlocked) {
            timeoutId = setTimeout(() => {
              if (isCancelledRef.current) return;
              setShowLockModal(true);
            }, 1800);
          }
        }
        return;
      }

      if (charCount < currentChars.length) {
        charCount++;
        setRevealedCharCount(charCount);
        // Comfortable readable speed ~46ms per character
        timeoutId = setTimeout(tick, 46);
      } else {
        // Line complete -> pause comfortably before next line
        const pauseTime = page.lines[lIdx]?.pauseAfterMs ?? 1000;
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

    timeoutId = setTimeout(tick, 350);

    return () => {
      isCancelledRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [isManualMode, currentPageIdx, isHeartUnlocked]);

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

      {/* Cute Romantic Cat Couple Running in the Background Like Shades */}
      <RunningCatCoupleShades opacity={0.88} />

      {/* Skip to Book Button Top Right */}
      <button
        type="button"
        onClick={handleFinish}
        className="absolute top-4 right-4 z-30 flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-black/40 px-4 py-1.5 text-xs font-serif text-amber-200/80 backdrop-blur-md transition-all hover:bg-black/70 hover:text-amber-100 hover:border-[#d4af37] cursor-pointer"
      >
        <span>Skip to Book</span>
        <span>➔</span>
      </button>

      {/* Main Parchment Letter Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`letter-page-${currentPageIdx}`}
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-20 w-full max-w-2xl rounded-2xl p-6 sm:p-10 border-2 border-[#b89c66]/60 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.25)] overflow-hidden flex flex-col justify-between"
          style={{
            backgroundImage: `url(${paperTexture})`,
            backgroundSize: "cover",
            minHeight: "530px",
            maxHeight: "90vh",
          }}
        >
          {/* Subtle parchment vignette and aging stains */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              boxShadow: "inset 0 0 50px rgba(120,70,20,0.32)",
            }}
          />

          {/* Top Letter Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#d4af37]/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
                💌
              </span>
              <span className="font-serif italic text-xs sm:text-sm text-[#785a28] tracking-widest uppercase">
                {currentPage.title}
              </span>
            </div>
            <div className="font-serif text-xs font-bold tracking-wider text-[#996515]">
              Page {currentPage.pageNumber} of {LETTER_PAGES.length}
            </div>
          </div>

          {/* Letter Body Lines */}
          <div className="relative z-10 my-auto py-4 sm:py-6 space-y-3.5 sm:space-y-4">
            {currentPage.lines.map((line, lIdx) => {
              const isPastLine = isManualMode || lIdx < currentLineIdx;
              const isActiveLine = !isManualMode && lIdx === currentLineIdx;
              const isFutureLine = !isManualMode && lIdx > currentLineIdx;

              if (isFutureLine) return null;

              const chars = pageLinesChars[lIdx] || [];

              return (
                <div key={lIdx} className="min-h-[1.5rem]">
                  {/* Page Title */}
                  {line.isTitle && (
                    <div className="text-center pb-2 border-b border-[#c29b38]/30 mb-2">
                      <h1 className="font-display font-black text-xl sm:text-2xl text-[#831843] tracking-wide drop-shadow-[0_1px_3px_rgba(131,24,67,0.3)]">
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
                      </h1>
                    </div>
                  )}

                  {/* Birthday Highlight */}
                  {line.isBirthdayHighlight && (
                    <div className="text-center py-2 sm:py-2.5 my-1 rounded-xl bg-gradient-to-r from-amber-100/70 via-rose-100/80 to-amber-100/70 border border-amber-300/70 shadow-sm">
                      <h2 className="font-display font-black text-lg sm:text-2xl text-[#991b1b] tracking-wide drop-shadow-[0_1px_3px_rgba(153,27,27,0.3)]">
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
                    <div className="text-center pt-2">
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

                  {/* Standard Love Letter Sentences */}
                  {!line.isTitle &&
                    !line.isBirthdayHighlight &&
                    !line.isSalutation &&
                    !line.isSignature && (
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

            {/* ══════════════════════════════════════════════════════════════════
                PAGE 5: HEART LOCK SYSTEM & FINAL DECLARATION
               ══════════════════════════════════════════════════════════════════ */}
            {currentPageIdx === 4 && (isManualMode || currentLineIdx >= 4) && (
              <div className="pt-2">
                {!isHeartUnlocked ? (
                  /* ── LOCKED STATE: "Unlock my heart meow 🫣" Button ── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center my-2 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#831843]/15 via-[#be185d]/20 to-[#831843]/15 border-2 border-dashed border-[#be185d]/60 text-center"
                  >
                    <p className="text-xs sm:text-sm font-serif italic text-[#831843] mb-2.5">
                      A secret declaration is locked with love... 🔒
                    </p>

                    <motion.button
                      type="button"
                      onClick={() => setShowLockModal(true)}
                      animate={{
                        scale: [1, 1.06, 1, 1.09, 1],
                        boxShadow: [
                          "0 0 10px rgba(244,114,182,0.4)",
                          "0 0 25px rgba(244,114,182,0.8)",
                          "0 0 10px rgba(244,114,182,0.4)",
                          "0 0 30px rgba(244,114,182,0.95)",
                          "0 0 10px rgba(244,114,182,0.4)",
                        ],
                      }}
                      transition={{
                        duration: 1.35,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.14, 0.28, 0.44, 0.72],
                      }}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#9d174d] via-[#be185d] to-[#9d174d] text-pink-100 font-display font-bold text-sm sm:text-base tracking-wide border border-pink-300 shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-lg">🔒</span>
                      <span>unlock my heart meow 🫣</span>
                      <span className="text-lg">💖</span>
                    </motion.button>
                  </motion.div>
                ) : (
                  /* ── UNLOCKED STATE: Grand Animated "i love you di pondati 😘" ── */
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0, y: 15 }}
                    animate={{
                      scale: [1, 1.04, 1],
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      scale: {
                        repeat: Infinity,
                        duration: 2.0,
                        ease: "easeInOut",
                      },
                      opacity: { duration: 0.6 },
                      y: { duration: 0.6 },
                    }}
                    className="text-center my-2 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-200/80 via-pink-100/95 to-rose-200/80 border-2 border-pink-400 shadow-[0_0_25px_rgba(244,114,182,0.65)] relative overflow-hidden"
                  >
                    {/* Unlocked heart floating badge */}
                    <div className="absolute top-1 right-2 text-[0.65rem] font-serif font-bold text-pink-700 uppercase tracking-widest">
                      🔓 Heart Unlocked
                    </div>

                    {/* Glowing rose aura shimmer */}
                    <motion.div
                      animate={{
                        opacity: [0.35, 0.8, 0.35],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-300/40 to-transparent pointer-events-none"
                    />

                    <h3 className="relative z-10 font-display text-xl sm:text-3xl font-black tracking-wide text-[#831843] drop-shadow-[0_2px_8px_rgba(190,24,93,0.4)] flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ scale: [1, 1.3, 1], rotate: [0, 8, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                        className="inline-block text-2xl sm:text-3xl"
                      >
                        💖
                      </motion.span>
                      <span className="bg-gradient-to-r from-[#9d174d] via-[#e11d48] to-[#9d174d] bg-clip-text text-transparent">
                        i love you di pondati
                      </span>
                      <span>😘</span>
                      <motion.span
                        animate={{ scale: [1, 1.3, 1], rotate: [0, -8, 8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.6,
                          delay: 0.2,
                        }}
                        className="inline-block text-2xl sm:text-3xl"
                      >
                        💖
                      </motion.span>
                    </h3>
                  </motion.div>
                )}
              </div>
            )}
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
            ) : !isHeartUnlocked ? (
              <motion.button
                type="button"
                onClick={() => setShowLockModal(true)}
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 8px rgba(244,114,182,0.4)",
                    "0 0 16px rgba(244,114,182,0.8)",
                    "0 0 8px rgba(244,114,182,0.4)",
                  ],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="px-4 py-1.5 rounded-lg text-xs font-display font-bold tracking-wide border border-pink-400 bg-gradient-to-r from-[#9d174d] to-[#be185d] text-white shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🔒</span>
                <span>Unlock Heart 🫣</span>
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleFinish}
                animate={{
                  scale: [1, 1.04, 1],
                  boxShadow: [
                    "0 0 10px rgba(212,175,55,0.4)",
                    "0 0 22px rgba(212,175,55,0.85)",
                    "0 0 10px rgba(212,175,55,0.4)",
                  ],
                }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="px-5 py-1.5 rounded-lg text-xs font-display font-bold tracking-wide border border-[#d4af37] bg-gradient-to-r from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-[#fff7ed] shadow-[0_2px_14px_rgba(212,175,55,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Open Memory Book 📖
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          ROMANTIC HEART LOCK MODAL POPUP
         ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showLockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            {/* Modal Dialog Card */}
            <motion.div
              initial={{ scale: 0.82, y: 20, opacity: 0 }}
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
                x: isWrongShake ? [-12, 12, -8, 8, -4, 4, 0] : 0,
              }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 22,
                stiffness: 280,
                x: { duration: 0.45 },
              }}
              className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 border-2 border-pink-400/80 shadow-[0_0_50px_rgba(244,114,182,0.5),0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden"
              style={{
                backgroundImage: `url(${paperTexture})`,
                backgroundSize: "cover",
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLockModal(false)}
                className="absolute top-4 right-4 text-xs font-serif font-bold text-[#831843] bg-pink-100/80 hover:bg-pink-200 border border-pink-300 rounded-full px-2.5 py-1 cursor-pointer"
              >
                ✕
              </button>

              {/* Header Icon */}
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -6, 6, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 flex items-center justify-center text-3xl shadow-lg border-2 border-white mb-3"
                >
                  🔒
                </motion.div>

                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#831843] tracking-wide mb-2">
                  Unlock My Heart Meow 🫣
                </h3>

                {/* Password Clue in Tamil/Tanglish as requested */}
                <div className="p-3.5 my-2 rounded-2xl bg-rose-100/90 border border-rose-300/80 shadow-inner">
                  <p className="font-serif text-sm sm:text-base text-[#6b1636] leading-relaxed font-semibold">
                    “ password yenanu kekuriya 😇 nee yena first time patha
                    andha date dhan 31/12/2025 🥰 ”
                  </p>
                </div>
              </div>

              {/* Password Form */}
              <form onSubmit={handleUnlockSubmit} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="heart-password"
                    className="block text-center text-xs font-serif font-bold uppercase tracking-wider text-[#831843] mb-1.5"
                  >
                    Enter Date Password (DDMMYYYY)
                  </label>
                  <input
                    ref={passwordInputRef}
                    id="heart-password"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (lockError) setLockError("");
                    }}
                    placeholder="31122025"
                    className="w-full text-center text-xl sm:text-2xl tracking-[0.25em] font-mono font-bold py-2.5 px-4 rounded-xl border-2 border-[#be185d] bg-white/95 text-[#831843] focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-inner"
                  />
                  {lockError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-xs font-serif font-bold text-red-600 mt-1.5"
                    >
                      {lockError}
                    </motion.p>
                  )}
                </div>

                {/* Submit & Quick Fill Button */}
                <div className="flex flex-col gap-2 pt-1">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#9d174d] via-[#be185d] to-[#9d174d] text-white font-display font-bold text-sm sm:text-base tracking-wide border border-pink-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>💖</span>
                    <span>Unlock Heart 🔓</span>
                    <span>✨</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => {
                      setPasswordInput("31122025");
                      setTimeout(() => {
                        handleUnlockSubmit();
                      }, 100);
                    }}
                    className="text-center text-xs font-serif text-[#831843]/75 hover:text-[#831843] hover:underline cursor-pointer pt-1"
                  >
                    (Click here to auto-fill: 31122025 🐱💕)
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          FLOATING CONFETTI BURST WHEN UNLOCKED
         ══════════════════════════════════════════════════════════════════════ */}
      {showConfettiBurst && (
        <div className="fixed inset-0 pointer-events-none z-70 flex items-center justify-center overflow-hidden">
          {burstHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.2 }}
              animate={{
                x: h.x * 2.5,
                y: h.y * 2.5,
                opacity: [1, 1, 0],
                scale: [0.2, h.scale * 1.6, 0.6],
                rotate: [0, h.rotate],
              }}
              transition={{
                duration: 2.2,
                delay: h.delay,
                ease: "easeOut",
              }}
              className="absolute text-2xl sm:text-4xl select-none"
            >
              {h.emoji}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
