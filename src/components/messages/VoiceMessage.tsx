import { memo, useMemo, useState, useRef, useEffect, useCallback } from "react";
import { HiMiniPlay, HiMiniPause } from "react-icons/hi2";
import { globalAudioPlayer } from "@/lib/audioPlayer";

interface VoiceMessageProps {
  duration: string;
  caption?: string | undefined;
  id?: string | undefined;
  src?: string | undefined;
}

function parseDurationToSeconds(durStr: string): number {
  if (!durStr) return 0;
  const parts = durStr.split(":").map(Number);
  if (parts.length === 2 && !isNaN(parts[0]!) && !isNaN(parts[1]!)) {
    return parts[0]! * 60 + parts[1]!;
  }
  return 0;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** Luxury voice note audio pill with unified global audio playback and waveform scrubbing */
export const VoiceMessage = memo(function VoiceMessage({
  duration,
  caption,
  id = "",
  src,
}: VoiceMessageProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to global audio player state
  const [audioState, setAudioState] = useState(() => globalAudioPlayer.getState());

  useEffect(() => {
    return globalAudioPlayer.subscribe(() => {
      setAudioState({ ...globalAudioPlayer.getState() });
    });
  }, []);

  const isCurrentTrack = audioState.playingId === id;
  const isPlaying = isCurrentTrack && audioState.isPlaying;
  const isLoading = isCurrentTrack && audioState.isLoading;
  const currentTime = isCurrentTrack ? audioState.currentTime : 0;

  const parsedDuration = parseDurationToSeconds(duration);
  const totalSeconds = isCurrentTrack && audioState.duration > 0 ? audioState.duration : parsedDuration;

  // Hash-based procedural bar heights (28 bars)
  const bars = useMemo(() => {
    const seed = `${id}-${duration}-${caption ?? ""}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return Array.from({ length: 28 }, (_, idx) => {
      const val = Math.abs(Math.sin(hash + idx * 0.7));
      return 0.3 + val * 0.7; // 30% to 100% height
    });
  }, [id, duration, caption]);

  const togglePlay = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) {
        e.stopPropagation();
      }
      if (!src) {
        console.warn("No audio src for voice message:", id);
        return;
      }
      globalAudioPlayer.toggle(id, src, parsedDuration);
    },
    [id, src, parsedDuration],
  );

  const handleWaveformClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!waveformRef.current || !src) return;
      const rect = waveformRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, clickX / rect.width));
      const targetDuration = totalSeconds > 0 ? totalSeconds : 10;
      const targetTime = percent * targetDuration;

      if (!isCurrentTrack || !isPlaying) {
        globalAudioPlayer.play(id, src, parsedDuration).then(() => {
          globalAudioPlayer.seek(targetTime);
        });
      } else {
        globalAudioPlayer.seek(targetTime);
      }
    },
    [id, src, totalSeconds, isCurrentTrack, isPlaying, parsedDuration],
  );

  const progress = totalSeconds > 0 ? Math.min(1, Math.max(0, currentTime / totalSeconds)) : 0;
  const activeBarIndex = Math.floor(progress * bars.length);

  // Time display: show currentTime when playing or scrubbed, otherwise duration prop
  const timeDisplay = isPlaying || currentTime > 0
    ? `${formatTime(currentTime)} / ${formatTime(totalSeconds || parsedDuration)}`
    : duration;

  return (
    <div
      className="flex flex-col items-start py-0.5"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 border border-[#d6c5ad] select-none transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] cursor-pointer"
        style={{
          background: isPlaying
            ? "linear-gradient(180deg, #f3e6c8 0%, #ecdcb5 100%)"
            : "linear-gradient(180deg, #ebdcb9 0%, #e2d2ad 100%)",
          boxShadow: isPlaying
            ? "inset 0 1px 2px rgba(255,255,255,0.8), 0 0 12px rgba(200,153,56,0.25)"
            : "inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.08)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          togglePlay(e);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Play/Pause button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay(e);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
          className="grid size-7 shrink-0 place-items-center rounded-full bg-[#c89938] text-white shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-[#b5852b] cursor-pointer"
        >
          <span className="pointer-events-none flex items-center justify-center">
            {isLoading ? (
              <span className="inline-block size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <HiMiniPause className="size-3.5" />
            ) : (
              <HiMiniPlay className="ml-0.5 size-3.5" />
            )}
          </span>
        </button>

        {/* Clickable scrubbable waveform */}
        <div
          ref={waveformRef}
          onClick={handleWaveformClick}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex h-5 w-32 items-center gap-[2px] cursor-pointer py-1 group"
          title="Click to seek"
        >
          {bars.map((h, i) => {
            const isFilled = i <= activeBarIndex;
            return (
              <span
                key={i}
                className="w-[2.5px] rounded-full transition-all duration-150 group-hover:opacity-100 pointer-events-none"
                style={{
                  height: `${(isPlaying && isFilled ? h * 1.2 : h) * 100}%`,
                  backgroundColor: isFilled ? "#854d0e" : "#c4a773",
                  boxShadow: isPlaying && isFilled ? "0 0 4px rgba(180,83,9,0.5)" : "none",
                  opacity: isFilled ? 1 : 0.65,
                }}
              />
            );
          })}
        </div>

        {/* Duration / Progress Text */}
        <span className="font-body text-[0.68rem] font-medium tracking-wider text-[#5c4a2a] tabular-nums whitespace-nowrap min-w-[32px] text-right pointer-events-none">
          {timeDisplay}
        </span>
      </div>

      {caption ? (
        <p className="mt-1 font-script text-xs italic text-ink-soft">{caption}</p>
      ) : null}
    </div>
  );
});