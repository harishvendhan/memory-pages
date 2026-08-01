import { memo } from "react";
import { HiOutlineShare, HiOutlineFilm, HiOutlineUser } from "react-icons/hi2";

interface SharedPostMessageProps {
  shareType: "post" | "reel" | "profile" | "story_reply";
  title?: string | undefined;
  previewUrl?: string | undefined;
  authorName?: string | undefined;
  caption?: string | undefined;
}

export const SharedPostMessage = memo(function SharedPostMessage({
  shareType,
  title,
  previewUrl,
  authorName,
  caption,
}: SharedPostMessageProps) {
  const getIcon = () => {
    switch (shareType) {
      case "reel":
        return <HiOutlineFilm className="size-4 text-[#9c814b]" />;
      case "profile":
        return <HiOutlineUser className="size-4 text-[#9c814b]" />;
      default:
        return <HiOutlineShare className="size-4 text-[#9c814b]" />;
    }
  };

  const getLabel = () => {
    switch (shareType) {
      case "reel":
        return "Shared Reel";
      case "profile":
        return "Shared Profile";
      case "story_reply":
        return "Story Reply";
      default:
        return "Shared Post";
    }
  };

  return (
    <div
      className="inline-flex flex-col rounded-md border border-[#d6c5ad] bg-[#ebdcb9]/40 p-2.5 max-w-[280px] select-none"
      style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={title ?? "Shared preview"}
          loading="lazy"
          className="h-32 w-full rounded-[2px] object-cover mb-2"
        />
      ) : null}
      <div className="flex items-center gap-2 font-display text-xs font-semibold text-[#5c4a2a]">
        {getIcon()}
        <span>{getLabel()}</span>
        {authorName ? <span className="opacity-75 font-normal">@{authorName}</span> : null}
      </div>
      {title ? <p className="mt-1 font-display text-xs italic text-[#2c2416]">{title}</p> : null}
      {caption ? <p className="mt-0.5 font-display text-[0.8rem] text-ink-soft">{caption}</p> : null}
    </div>
  );
});
