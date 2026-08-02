import { useEffect, useMemo, useState, memo } from "react";

const NICKNAMES = [
  { text: "meow", emoji: "🐾" },
  { text: "podusu", emoji: "✨" },
  { text: "papa", emoji: "💖" },
  { text: "kutty ma", emoji: "🌸" },
  { text: "chellow", emoji: "💕" },
];

interface SideBubbleItem {
  id: number;
  side: "left" | "right";
  type: "word" | "heart" | "bubble";
  word: string;
  emoji: string;
  offsetPx: number; // distance from edge in px
  size: number;
  delay: number;
  duration: number;
  drift: string;
  rotation: string;
  opacity: number;
}

/**
 * Mobile-optimized side floating bubbles & nickname capsules.
 * Fixed in the viewport margins so they float smoothly and lightly alongside pages while scrolling.
 */
export const MobileSideBubbles = memo(function MobileSideBubbles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useMemo<SideBubbleItem[]>(() => {
    const list: SideBubbleItem[] = [];
    const countPerSide = 8;

    (["left", "right"] as const).forEach((side, sIdx) => {
      for (let i = 0; i < countPerSide; i++) {
        const globalIdx = sIdx * countPerSide + i;
        const itemType: "word" | "heart" | "bubble" =
          i % 3 === 0 ? "word" : i % 3 === 1 ? "heart" : "bubble";
        
        const nickname = NICKNAMES[(globalIdx) % NICKNAMES.length] ?? NICKNAMES[0]!;
        const size = itemType === "word" ? 0 : 12 + (i % 4) * 4; // 12px to 24px
        const delay = (i * 0.85 + (sIdx === 1 ? 0.45 : 0)) % 7;
        const duration = 5.5 + (i % 4) * 1.1 + Math.random() * 1.5; // 5.5s - 10s
        const offsetPx = 2 + (i % 3) * 8 + Math.random() * 4; // 2px - 22px from edge
        const drift = `${(side === "left" ? 1 : -1) * (4 + Math.random() * 12)}px`;
        const rotation = `${(Math.random() - 0.5) * 16}deg`;
        const opacity = itemType === "word" ? 0.6 + (i % 3) * 0.12 : 0.45 + (i % 3) * 0.15;

        list.push({
          id: globalIdx,
          side,
          type: itemType,
          word: nickname.text,
          emoji: nickname.emoji,
          offsetPx,
          size,
          delay,
          duration,
          drift,
          rotation,
          opacity,
        });
      }
    });

    return list;
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none sm:hidden"
      style={{ contain: "strict" }}
      aria-hidden
    >
      {items.map((b) => (
        <div
          key={b.id}
          className="gpu absolute bottom-[-6vh] flex items-center justify-center pointer-events-none select-none"
          style={{
            [b.side]: `${b.offsetPx}px`,
            width: b.type === "word" ? "auto" : b.size,
            height: b.type === "word" ? "auto" : b.size,
            animation: `side-bubble-float ${b.duration}s ease-in-out ${b.delay}s infinite`,
            ["--side-x" as string]: b.drift,
            ["--side-rot" as string]: b.rotation,
            ["--side-opacity" as string]: b.opacity,
          }}
        >
          {b.type === "word" ? (
            /* Micro luminous nickname capsule */
            <div className="flex items-center gap-1 rounded-full border border-pink-300/35 bg-gradient-to-r from-pink-500/20 via-rose-400/15 to-amber-400/20 px-2 py-0.5 shadow-[0_0_10px_rgba(244,114,182,0.35),inset_0_0_4px_rgba(255,255,255,0.4)] backdrop-blur-[1.5px] whitespace-nowrap">
              <span className="font-display italic font-medium text-[10px] tracking-tight text-[#fdf2f8] drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]">
                {b.word}
              </span>
              <span className="text-[9px] opacity-90 drop-shadow-[0_0_4px_rgba(244,114,182,0.6)]">
                {b.emoji}
              </span>
            </div>
          ) : b.type === "heart" ? (
            /* Mini glowing heart */
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-pink-300/85 drop-shadow-[0_0_6px_rgba(244,114,182,0.65)]"
              style={{ width: b.size, height: b.size }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            /* Translucent iridescent bubble */
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: b.size,
                height: b.size,
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45), rgba(244,114,182,0.2) 55%, rgba(219,39,119,0.06) 95%)",
                boxShadow: "0 0 6px rgba(244,114,182,0.3), inset 0 0 3px rgba(255,255,255,0.5)",
                border: "0.5px solid rgba(255,255,255,0.35)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
});
