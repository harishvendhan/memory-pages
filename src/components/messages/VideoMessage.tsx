import { memo } from "react";
import { HiMiniPlay } from "react-icons/hi2";

interface VideoMessageProps {
  poster: string;
  duration: string;
  caption?: string | undefined;
}

/** Film still with a gilded play button. */
export const VideoMessage = memo(function VideoMessage({
  poster,
  duration,
  caption,
}: VideoMessageProps) {
  return (
    <div
      className="gpu group relative overflow-hidden rounded-md bg-paper p-2"
      style={{ boxShadow: "var(--shadow-photo)" }}
    >
      <div className="relative overflow-hidden rounded-[3px]">
        <img
          src={poster}
          alt={caption ?? "Video memory"}
          loading="lazy"
          decoding="async"
          width={1024}
          height={768}
          className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-leather-deep/25" />
        <button
          type="button"
          aria-label="Play video memory"
          className="absolute inset-0 grid place-items-center"
        >
          <span
            className="grid size-14 place-items-center rounded-full text-gold-foreground transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold-glow)" }}
          >
            <HiMiniPlay className="ml-1 size-6" />
          </span>
        </button>
        <span className="absolute bottom-2 right-2 rounded bg-leather-deep/70 px-2 py-0.5 font-body text-[0.65rem] tracking-widest text-paper">
          {duration}
        </span>
      </div>
      {caption ? (
        <p className="mt-2 px-1 text-center font-script text-sm italic text-ink-soft">{caption}</p>
      ) : null}
    </div>
  );
});