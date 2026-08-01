import { memo, useMemo, useState } from "react";
import { HiMiniPlay, HiMiniPause } from "react-icons/hi2";

interface VoiceMessageProps {
  duration: string;
  caption?: string | undefined;
  id?: string | undefined;
}

/** Luxury voice note audio pill matching the reference image. */
export const VoiceMessage = memo(function VoiceMessage({
  duration,
  caption,
  id = "",
}: VoiceMessageProps) {
  const [playing, setPlaying] = useState(false);

  const bars = useMemo(() => {
    const seed = `${id}-${duration}-${caption ?? ""}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return Array.from({ length: 28 }, (_, idx) => {
      const val = Math.abs(Math.sin(hash + idx * 0.7));
      return 0.3 + val * 0.7;
    });
  }, [id, duration, caption]);

  return (
    <div className="flex flex-col items-start py-0.5">
      <div
        className="inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 border border-[#d6c5ad] select-none"
        style={{
          background: "linear-gradient(180deg, #ebdcb9 0%, #e2d2ad 100%)",
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause voice note" : "Play voice note"}
          className="grid size-7 shrink-0 place-items-center rounded-full bg-[#c89938] text-white shadow-xs transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {playing ? <HiMiniPause className="size-3.5" /> : <HiMiniPlay className="ml-0.5 size-3.5" />}
        </button>

        <div className="flex h-5 w-32 items-center gap-[2px]">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-[2.5px] rounded-full transition-all duration-300"
              style={{
                height: `${(playing ? h * 1.1 : h) * 100}%`,
                backgroundColor: i % 4 === 0 ? "#946f25" : "#bca068",
                opacity: playing ? 0.95 : 0.75,
              }}
            />
          ))}
        </div>

        <span className="font-body text-[0.7rem] font-medium tracking-wide text-[#5c4a2a]">
          {duration}
        </span>
      </div>

      {caption ? (
        <p className="mt-1 font-script text-xs italic text-ink-soft">{caption}</p>
      ) : null}
    </div>
  );
});