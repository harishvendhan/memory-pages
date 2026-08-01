import { memo } from "react";

interface PhotoMessageProps {
  src: string;
  caption?: string | undefined;
  tilt: number;
}

/** Small printed-photo style with thin white border directly on paper texture. */
export const PhotoMessage = memo(function PhotoMessage({
  src,
  caption,
  tilt,
}: PhotoMessageProps) {
  return (
    <div
      className="gpu inline-block rounded-xs bg-white/90 p-1.5 pb-4 transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]"
      style={{ transform: `rotate(${tilt * 0.6}deg)`, boxShadow: "var(--shadow-photo)" }}
    >
      <img
        src={src}
        alt={caption ?? "A photograph kept in the book"}
        loading="lazy"
        decoding="async"
        width={1024}
        height={768}
        className="h-auto max-h-[220px] w-full rounded-[1px] object-cover"
      />
      {caption ? (
        <p className="mt-2 px-1 text-center font-script text-xs italic text-ink-soft">{caption}</p>
      ) : null}
    </div>
  );
});