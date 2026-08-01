import { forwardRef, memo } from "react";
import paper from "@/assets/paper.jpg";
import type { Message, ConversationBlock } from "@/types/conversation";
import { MessageEntry } from "@/components/messages/MessageEntry";
import { cn } from "@/lib/utils";

interface BookPageProps {
  side: "left" | "right";
  heading: string;
  subheading?: string | undefined;
  messages: Message[];
  blocks?: ConversationBlock[] | undefined;
  pageNumber: number;
  totalPages: number;
  highlight?: string | undefined;
  className?: string;
}

/**
 * Printed conversation page with isolated 4-layer structure:
 * 1. Isolated Header (shrink-0)
 * 2. Top Safe Area Padding (80-100px desktop, 70-90px tablet, 60-80px mobile)
 * 3. Conversation Area (<main />)
 * 4. Isolated Footer (shrink-0)
 */
export const BookPage = memo(
  forwardRef<HTMLDivElement, BookPageProps>(function BookPage(
    {
      side,
      heading,
      messages,
      blocks,
      pageNumber,
      highlight,
      className,
    },
    ref,
  ) {
    if (messages && messages.length > 0) {
      console.log(`BookPage ${pageNumber} rendering first message:`, messages[0]);
    }

    return (
      <div
        ref={ref}
        className={cn(
          "surface-paper page-sheet relative flex h-full w-full flex-col overflow-hidden bg-[#f7f2e8] shadow-md select-none",
          side === "left"
            ? "rounded-l-[0.4rem] md:rounded-r-none"
            : "rounded-r-[0.4rem] md:rounded-l-none",
          "rounded-[0.4rem]",
          className,
        )}
      >
        {/* Paper fiber texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
          style={{ backgroundImage: `url(${paper})`, backgroundSize: "cover" }}
          aria-hidden
        />

        {/* Page edge vignette */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            boxShadow: "inset 0 0 32px oklch(0.2 0.04 45 / 0.18)",
          }}
          aria-hidden
        />

        {/* Deep book spine binding gradient */}
        <div
          className="pointer-events-none absolute inset-y-0 hidden w-20 md:block z-10"
          style={{
            [side === "left" ? "right" : "left"]: 0,
            backgroundImage:
              side === "left"
                ? "var(--gradient-gutter-left)"
                : "var(--gradient-gutter-right)",
          }}
          aria-hidden
        />

        {/* Soft Botanical Watermark Corner Flourish */}
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 z-0 h-44 w-44 opacity-20 mix-blend-multiply",
            side === "left" ? "left-0" : "right-0 scale-x-[-1]",
          )}
          style={{
            backgroundImage: `radial-gradient(circle at bottom ${side === "left" ? "left" : "right"}, #8c734b 0%, transparent 70%)`,
          }}
          aria-hidden
        />

        {/* 4-Layer Page Layout Container */}
        <div className="relative z-10 flex h-full flex-col justify-between px-4 py-4 sm:px-8 sm:py-7">
          {/* Layer 1: Isolated Header (Fixed Top) */}
          <header className="shrink-0 text-center select-none pt-1 pb-1">
            <h2 className="font-display text-[0.72rem] sm:text-[0.78rem] font-medium tracking-[0.22em] sm:tracking-[0.28em] text-[#8c7853] uppercase">
              3 APRIL 2021 • {heading}
            </h2>
            <div className="mx-auto mt-1.5 flex items-center justify-center gap-2 opacity-60">
              <span className="h-[0.5px] w-10 sm:w-12 bg-[#9c814b]" />
              <span className="font-display text-[0.58rem] sm:text-[0.6rem] text-[#9c814b]">❖</span>
              <span className="h-[0.5px] w-10 sm:w-12 bg-[#9c814b]" />
            </div>
          </header>

          {/* Layer 2 & 3: Conversation Area with Balanced Top Safe Area */}
          <main className="flex min-h-0 flex-1 flex-col justify-start pt-3 sm:pt-5 pb-2 overflow-visible">
            {blocks && blocks.length > 0
              ? blocks.map((block, blockIdx) => (
                  <section key={block.id} className="flex flex-col">
                    {block.messages.map((message, i) => {
                      const prevMsg = i > 0 ? block.messages[i - 1] : undefined;
                      return (
                        <MessageEntry
                          key={message.id}
                          message={message}
                          index={blockIdx * 3 + i}
                          isFirst={i === 0}
                          previousAuthor={prevMsg?.author}
                          highlight={highlight}
                        />
                      );
                    })}
                  </section>
                ))
              : messages.map((message, i) => {
                  const prevMsg = i > 0 ? messages[i - 1] : undefined;
                  return (
                    <MessageEntry
                      key={message.id}
                      message={message}
                      index={i}
                      isFirst={i === 0}
                      previousAuthor={prevMsg?.author}
                      highlight={highlight}
                    />
                  );
                })}
          </main>

          {/* Layer 4: Isolated Footer (Fixed Bottom) */}
          <footer className="shrink-0 text-center font-display text-[0.8rem] sm:text-[0.85rem] tracking-[0.25em] text-[#8c7853] pt-1">
            ── {pageNumber} ──
          </footer>
        </div>
      </div>
    );
  }),
);