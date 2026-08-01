import { useMemo, useState } from "react";
import { HiMiniPlay, HiMiniPause } from "react-icons/hi2";

interface VoiceMessageProps {
  duration: string;
  caption?: string | undefined;
}

/** Luxury audio card: gilded play control, engraved waveform, duration. */
export function VoiceMessage({ duration, caption }: VoiceMessageProps) {
  const [playing, setPlaying] = useState(false);
  const bars = useMemo(
    () => Array.from({ length: 38 }, () => 0.25 + Math.random() * 0.75),
    [],
  );

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gold-deep/30 bg-paper-shade/60 px-3 py-3">
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause voice note" : "Play voice note"}
        className="grid size-11 shrink-0 place-items-center rounded-full text-gold-foreground transition-transform duration-300 hover:scale-105"
        style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-note)" }}
      >
        {playing ? <HiMiniPause className="size-5" /> : <HiMiniPlay className="ml-0.5 size-5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex h-8 items-center gap-[3px]">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-[2px] flex-1 rounded-full transition-[height,opacity] duration-500"
              style={{
                height: `${(playing ? h * 1.15 : h) * 100}%`,
                background: i % 5 === 0 ? "var(--gold-deep)" : "var(--ink-soft)",
                opacity: playing ? 0.9 : 0.5,
              }}
            />
          ))}
        </div>
        <div className="mt-1 flex items-center justify-between font-body text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft">
          <span className="truncate pr-2 normal-case tracking-normal italic">{caption}</span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}