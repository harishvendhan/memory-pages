import { memo } from "react";
import type { Message } from "@/types/conversation";
import { Avatar } from "./Avatar";
import { PhotoMessage } from "./PhotoMessage";
import { VoiceMessage } from "./VoiceMessage";
import { VideoMessage } from "./VideoMessage";
import { SharedPostMessage } from "./SharedPostMessage";
import { CallMessage } from "./CallMessage";
import { FallbackPlaceholder } from "./FallbackPlaceholder";
import { cn } from "@/lib/utils";
import { getDisplayName } from "@/lib/displayName";

interface MessageEntryProps {
  message: Message;
  index: number;
  isFirst?: boolean | undefined;
  previousAuthor?: "me" | "them" | undefined;
  highlight?: string | undefined;
}

function Highlighted({ text, term }: { text: string; term?: string | undefined }) {
  if (!term) return <>{text}</>;
  const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={i} className="rounded bg-gold/40 px-0.5 text-ink">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Universal Instagram DM renderer matching the reference image layout:
 * - Direct paper printing (no bubbles, no cards, no boxes)
 * - Harish 💙 (Royal Deep Blue) far left vs Aishu ❤️ (Crimson Red) far right
 * - Universal DM support (text, photos, videos, voice notes, gifs, shares, calls, links, stickers, attachments)
 * - Graceful degradation fallback for unknown/future DM types
 */
export const MessageEntry = memo(function MessageEntry({
  message,
  index,
  isFirst,
  previousAuthor,
  highlight,
}: MessageEntryProps) {
  const isMe = message.author === "me";
  const rawDisplayName = getDisplayName(message.senderName ?? (isMe ? "Me" : "You"));
  // Format with iconic heart emoji matching reference design
  const formattedName = isMe
    ? (rawDisplayName.includes("💙") ? rawDisplayName : `${rawDisplayName} 💙`)
    : (rawDisplayName.includes("❤️") ? rawDisplayName : `${rawDisplayName} ❤️`);
  const isDifferentAuthor = previousAuthor && previousAuthor !== message.author;
  const tilt = (index % 2 === 0 ? 1 : -1) * (0.6 + (index % 3) * 0.4);

  const renderContent = () => {
    switch (message.type) {
      case "text":
        return (
          <p className="font-display text-[0.92rem] leading-[1.5] text-[#2a2217] font-normal break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
            <Highlighted text={message.text} term={highlight} />
          </p>
        );

      case "photo":
        return (
          <div className="mt-1 max-w-[280px]">
            <PhotoMessage
              src={message.src}
              caption={message.caption}
              tilt={tilt}
            />
          </div>
        );

      case "voice":
        return (
          <div className="mt-1">
            <VoiceMessage
              id={message.id}
              src={message.src}
              duration={message.duration}
              caption={message.caption}
            />
          </div>
        );

      case "video":
        return (
          <div className="mt-1 max-w-[320px]">
            <VideoMessage
              poster={message.poster}
              duration={message.duration}
              caption={message.caption}
            />
          </div>
        );

      case "gif":
        return (
          <div className="mt-1 max-w-[260px]">
            <PhotoMessage src={message.src} caption={message.caption} tilt={tilt} />
          </div>
        );

      case "share":
        return (
          <div className="mt-1">
            <SharedPostMessage
              shareType={message.shareType}
              title={message.title}
              previewUrl={message.previewUrl}
              authorName={message.authorName}
              caption={message.caption}
            />
          </div>
        );

      case "call":
        return (
          <div className="mt-1">
            <CallMessage callType={message.callType} duration={message.duration} />
          </div>
        );

      case "attachment":
        return (
          <div className="mt-1 font-display text-xs italic text-[#5c4a2a] break-words">
            📄 Document attachment: {message.fileName ?? "File"}
          </div>
        );

      case "sticker":
        return (
          <div className="mt-1">
            {message.src ? (
              <img src={message.src} alt="Sticker" className="h-24 w-24 object-contain" />
            ) : (
              <span className="text-4xl">{message.stickerName ?? "✨"}</span>
            )}
          </div>
        );

      case "link":
        return (
          <a
            href={message.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block font-display text-[0.88rem] text-gold-deep underline decoration-gold/60 underline-offset-2 hover:text-gold"
          >
            {message.title ?? message.url}
          </a>
        );

      case "placeholder":
        return (
          <div className="mt-1 break-words">
            <FallbackPlaceholder
              placeholderText={message.placeholderText}
              originalType={message.originalType}
            />
          </div>
        );

      default:
        // Graceful degradation for future / unknown message types
        return (
          <div className="mt-1 break-words">
            <FallbackPlaceholder
              placeholderText="Content format unavailable"
              originalType={(message as { type?: string }).type}
            />
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "relative flex w-full",
        isFirst ? "mt-0" : isDifferentAuthor ? "mt-7" : "mt-4",
        isMe ? "justify-start" : "justify-end"
      )}
    >
      {/* Delicate vintage section divider matching reference design */}
      {!isFirst && isDifferentAuthor && (
        <div className="absolute -top-4 left-0 w-full flex items-center justify-center gap-3 opacity-55 select-none" aria-hidden>
          <span className="h-[0.5px] w-20 bg-[#b89c66]" />
          <span className="font-display text-[0.62rem] text-[#9c814b]">❖</span>
          <span className="h-[0.5px] w-20 bg-[#b89c66]" />
        </div>
      )}

      {/* Message Row */}
      <div
        className={cn(
          "flex gap-3.5",
          isMe ? "flex-row mr-auto" : "flex-row-reverse ml-auto",
        )}
        style={{ width: "fit-content", maxWidth: "75%" }}
      >
        {/* Profile Avatar (48px circular) */}
        <div className="shrink-0">
          <Avatar author={message.author} name={rawDisplayName} />
        </div>

        {/* Printed Message Content */}
        <div
          className={cn(
            "flex flex-col min-w-0 w-full",
            isMe ? "items-start text-left" : "items-end text-right",
          )}
        >
          {/* Sender Name */}
          <div
            className="font-display text-[0.9rem] font-medium tracking-wide mb-0.5 select-none whitespace-nowrap"
            style={{ color: isMe ? "#1E3A8A" : "#991B1B" }}
          >
            {formattedName}
          </div>

          {renderContent()}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={cn("mt-1 flex gap-1", isMe ? "justify-start" : "justify-end")}>
              {message.reactions.map((r, i) => (
                <span
                  key={i}
                  className="rounded-full bg-paper-shade/40 px-2 py-0.5 text-[0.58rem] border border-[#d4af37]/30 text-ink-soft"
                >
                  {r.reaction}
                </span>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <span className="mt-0.5 font-body text-[0.65rem] tracking-wider text-[#857a6c]">
            {message.time}
          </span>
        </div>
      </div>
    </div>
  );
});