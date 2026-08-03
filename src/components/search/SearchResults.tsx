import { memo } from "react";
import {
  HiChatBubbleBottomCenterText,
  HiSparkles,
  HiUser,
  HiCalendar,
  HiMicrophone,
  HiShare,
  HiArrowRight,
} from "react-icons/hi2";
import type { SearchResultItem, MatchType } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
  isIndexing: boolean;
  isReady: boolean;
  selectedIndex: number;
  onSelectResult: (result: SearchResultItem) => void;
}

/** Render match type icon and badge */
function MatchTypeBadge({ type }: { type: MatchType }) {
  switch (type) {
    case "emoji":
      return (
        <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-amber-700">
          <HiSparkles className="size-3" /> Emoji
        </span>
      );
    case "voiceCaption":
      return (
        <span className="flex items-center gap-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-indigo-700">
          <HiMicrophone className="size-3" /> Voice Note
        </span>
      );
    case "sharedPost":
      return (
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-emerald-700">
          <HiShare className="size-3" /> Shared
        </span>
      );
    case "sender":
      return (
        <span className="flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-blue-700">
          <HiUser className="size-3" /> Sender
        </span>
      );
    case "date":
      return (
        <span className="flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-rose-700">
          <HiCalendar className="size-3" /> Date
        </span>
      );
    case "content":
    default:
      return (
        <span className="flex items-center gap-1 rounded-full bg-gold/20 border border-gold/40 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-gold-deep">
          <HiChatBubbleBottomCenterText className="size-3" /> Message
        </span>
      );
  }
}

/** Highlight query terms inside the snippet */
function HighlightSnippet({
  snippet,
  query,
}: {
  snippet: string;
  query: string;
}) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  if (terms.length === 0) {
    return <span>{snippet}</span>;
  }

  const pattern = `(${terms
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`;

  try {
    const parts = snippet.split(new RegExp(pattern, "gi"));
    return (
      <>
        {parts.map((part, i) => {
          const isMatch = terms.some(
            (t) => t.toLowerCase() === part.toLowerCase(),
          );
          return isMatch ? (
            <mark
              key={i}
              className="rounded bg-gold/45 px-1 py-0.5 font-medium text-ink shadow-[0_0_8px_rgba(212,175,55,0.4)]"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </>
    );
  } catch {
    return <span>{snippet}</span>;
  }
}

export const SearchResults = memo(function SearchResults({
  query,
  results,
  isIndexing,
  isReady,
  selectedIndex,
  onSelectResult,
}: SearchResultsProps) {
  const trimmedQuery = query.trim();

  // Indexing State
  if (isIndexing && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none">
        <div className="mb-3 font-display text-2xl text-gold animate-spin">
          ❖
        </div>
        <p className="font-display text-base tracking-wide text-ink">
          Indexing memories...
        </p>
        <p className="mt-1 font-body text-xs text-ink-soft">
          Preparing instant fuzzy search across your conversation
        </p>
      </div>
    );
  }

  // Empty Query State (Initial Guide)
  if (!trimmedQuery) {
    return (
      <div className="py-8 px-6 text-center select-none">
        <div className="mb-2 font-display text-2xl text-gold-deep opacity-80">
          ✦
        </div>
        <h3 className="font-display text-lg font-medium text-ink">
          Instant Memory Search
        </h3>
        <p className="mt-1 font-body text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
          Type words in English, தமிழ் (e.g. வணக்கம்), Tanglish (e.g. vanakkam,
          kadhal), sender names, dates, or emojis (e.g. ❤️, ✨).
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {["❤️ love", "வணக்கம்", "vanakkam", "April 2021", "photo", "💙 Harish"].map(
            (sample) => (
              <span
                key={sample}
                className="rounded-full border border-gold-deep/30 bg-leather-deep/5 px-2.5 py-1 font-body text-[0.7rem] text-gold-deep select-none"
              >
                {sample}
              </span>
            ),
          )}
        </div>
      </div>
    );
  }

  // No Results State
  if (results.length === 0 && isReady) {
    return (
      <div className="py-10 px-6 text-center select-none">
        <div className="mb-2 font-display text-xl text-ink-soft/70">❖</div>
        <p className="font-display text-base italic text-ink">
          No memories found for &ldquo;{trimmedQuery}&rdquo;
        </p>
        <p className="mt-1.5 font-body text-xs text-ink-soft">
          Try a different keyword, check spelling, or search by emoji or date.
        </p>
      </div>
    );
  }

  // Active Results List
  return (
    <div
      role="listbox"
      aria-label="Search results"
      className="max-h-[58vh] overflow-y-auto p-2.5 sm:p-3 space-y-2 focus:outline-none"
    >
      <div className="flex items-center justify-between px-2 pb-1 text-[0.65rem] font-body uppercase tracking-wider text-ink-soft">
        <span>Found {results.length} memories</span>
        <span>Click or press Enter to open</span>
      </div>

      {results.map((item, idx) => {
        const isSelected = idx === selectedIndex;
        const isMe = item.author === "me";

        return (
          <button
            key={`${item.messageId}-${idx}`}
            role="option"
            aria-selected={isSelected}
            type="button"
            onClick={() => onSelectResult(item)}
            className={cn(
              "group flex w-full flex-col rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer select-none",
              isSelected
                ? "border-gold bg-gradient-to-r from-amber-500/15 via-gold/15 to-amber-500/10 shadow-sm scale-[1.01]"
                : "border-ink/10 bg-leather-deep/5 hover:border-gold-deep/40 hover:bg-paper-shade/70",
            )}
          >
            {/* Header: Sender, Badges, Page */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="font-display text-sm font-semibold truncate"
                  style={{ color: isMe ? "#1E3A8A" : "#991B1B" }}
                >
                  {item.senderName || (isMe ? "Me 💙" : "You ❤️")}
                </span>
                <MatchTypeBadge type={item.matchType} />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.date && (
                  <span className="hidden sm:inline font-body text-[0.68rem] text-ink-soft">
                    {item.date}
                  </span>
                )}
                <span className="rounded-md border border-gold-deep/40 bg-gold/15 px-2 py-0.5 font-display text-[0.72rem] font-semibold text-gold-deep">
                  Page {item.pageNumber}
                </span>
              </div>
            </div>

            {/* Snippet */}
            <p className="mt-2 line-clamp-2 font-display text-[0.95rem] leading-relaxed text-ink [overflow-wrap:anywhere]">
              <HighlightSnippet snippet={item.snippet} query={trimmedQuery} />
            </p>

            {/* Footer Jump Indicator */}
            <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-ink/5">
              <span className="font-body text-[0.62rem] uppercase tracking-wider text-ink-soft">
                Relevance: {Math.round(item.score * 100)}%
              </span>
              <div className="flex items-center gap-1 font-body text-[0.68rem] font-medium uppercase tracking-wider text-gold-deep group-hover:translate-x-0.5 transition-transform">
                <span>Turn to page</span>
                <HiArrowRight className="size-3.5" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
});
