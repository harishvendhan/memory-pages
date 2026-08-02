import { useEffect, useMemo, useState, memo } from "react";

interface HeartBubblesProps {
  count?: number;
}

const NICKNAMES = [
  { text: "meow", emoji: "🐾" },
  { text: "podusu", emoji: "✨" },
  { text: "papa", emoji: "💖" },
  { text: "kutty ma", emoji: "🌸" },
  { text: "chellow", emoji: "💕" },
];

/**
 * Romantic translucent glowing heart bubbles & floating nickname words drifting gently upwards in the background.
 * Pure GPU accelerated CSS animation with layout containment.
 */
export const HeartBubbles = memo(function HeartBubbles({ count = 42 }: HeartBubblesProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const itemType: "word" | "bubble" | "heart" =
          i % 3 === 0 ? "word" : i % 3 === 1 ? "bubble" : "heart";
        
        const nickname = NICKNAMES[Math.floor(i / 3) % NICKNAMES.length] ?? NICKNAMES[0]!;
        const size = 14 + (i % 5) * 6; // 14px to 38px
        const delay = (i * 0.35 + Math.random() * 1.8) % 8;
        const duration = 6.5 + (i % 5) * 1.3 + Math.random() * 2; // 6.5s - 14s
        const left = ((i * 4.2 + 5) % 92) + Math.random() * 3;
        const drift = `${(Math.random() - 0.5) * 160}px`;
        const rotation = `${(Math.random() - 0.5) * 24}deg`;
        const opacity = itemType === "word" ? 0.5 + Math.random() * 0.4 : 0.3 + Math.random() * 0.5;

        return {
          id: i,
          type: itemType,
          word: nickname.text,
          emoji: nickname.emoji,
          left,
          size,
          delay,
          duration,
          drift,
          rotation,
          opacity,
        };
      }),
    [count],
  );

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      style={{ contain: "layout style paint" }}
      aria-hidden
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="gpu absolute bottom-[-8vh] flex items-center justify-center pointer-events-none select-none"
          style={{
            left: `${b.left}%`,
            width: b.type === "word" ? "auto" : b.size,
            height: b.type === "word" ? "auto" : b.size,
            animation: `heart-float ${b.duration}s ease-in-out ${b.delay}s infinite`,
            ["--heart-x" as string]: b.drift,
            ["--heart-rot" as string]: b.rotation,
            ["--heart-opacity" as string]: b.opacity,
          }}
        >
          {b.type === "word" ? (
            /* Floating luminous nickname capsule */
            <div className="flex items-center gap-1.5 rounded-full border border-pink-300/40 bg-gradient-to-r from-pink-500/20 via-rose-400/15 to-amber-500/20 px-3 py-1 shadow-[0_0_14px_rgba(244,114,182,0.45),inset_0_0_6px_rgba(255,255,255,0.4)] backdrop-blur-[2px] whitespace-nowrap">
              <span className="font-display italic font-medium text-xs sm:text-sm tracking-wide text-[#fce7f3] drop-shadow-[0_0_8px_rgba(244,114,182,0.85)]">
                {b.word}
              </span>
              <span className="text-[10px] sm:text-xs opacity-90 drop-shadow-[0_0_6px_rgba(244,114,182,0.6)]">
                {b.emoji}
              </span>
            </div>
          ) : b.type === "bubble" ? (
            /* Glassmorphic bubble enclosing a luminous heart */
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: b.size,
                height: b.size,
                background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), rgba(244,114,182,0.2) 50%, rgba(219,39,119,0.08) 90%)",
                boxShadow: "0 0 8px rgba(244,114,182,0.35), inset 0 0 4px rgba(255,255,255,0.6)",
                border: "0.5px solid rgba(255,255,255,0.4)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-1/2 h-1/2 text-pink-400/80 drop-shadow-[0_0_4px_rgba(244,114,182,0.7)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          ) : (
            /* Floating glowing heart with soft specular highlight */
            <svg
              viewBox="0 0 24 24"
              fill="url(#heart-gradient)"
              className="w-full h-full text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]"
            >
              <defs>
                <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#f472b6" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#db2777" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
});
