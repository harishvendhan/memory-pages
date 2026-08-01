interface PhotoMessageProps {
  src: string;
  caption?: string;
  tilt: number;
}

/** A printed photograph with a white border, taped into the book. */
export function PhotoMessage({ src, caption, tilt }: PhotoMessageProps) {
  return (
    <div
      className="gpu inline-block rounded-[3px] bg-paper p-2 pb-6 transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]"
      style={{ transform: `rotate(${tilt}deg)`, boxShadow: "var(--shadow-photo)" }}
    >
      <img
        src={src}
        alt={caption ?? "A photograph kept in the book"}
        loading="lazy"
        width={1024}
        height={768}
        className="h-auto w-full rounded-[2px] object-cover"
      />
      {caption ? (
        <p className="mt-3 px-1 text-center font-script text-sm italic text-ink-soft">{caption}</p>
      ) : null}
    </div>
  );
}