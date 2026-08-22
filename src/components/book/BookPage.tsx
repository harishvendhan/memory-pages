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

        {/* Quran-style Ornate Margin Design (Teal & Maroon Tazhib) - BULLETPROOF INLINE STYLES */}
        <div 
          className="pointer-events-none absolute inset-1.5 sm:inset-2 z-50"
          aria-hidden
        >
          {/* 1. Outer Teal border */}
          <div className="absolute inset-0 rounded-[3px]" style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#008b8b" }} />
          
          {/* 2. Scalloped / Sage green band (using dashed gold border over sage background) */}
          <div className="absolute inset-[2px] rounded-[2px]" style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "#8b998d" }} />
          <div className="absolute inset-[2px]" style={{ borderWidth: "3px", borderStyle: "dashed", borderColor: "#d4af37", opacity: 0.75, mixBlendMode: "color-burn" }} />
          
          {/* 3. Main Maroon patterned band using 4 explicit absolute divs to guarantee rendering */}
          <div className="absolute inset-[5px]">
            {/* Top */}
            <div className="absolute top-0 left-0 right-0" style={{ height: "16px", backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='16' height='16' fill='%235a1e2b'/%3E%3Cpath d='M8 0L16 8L8 16L0 8Z' fill='none' stroke='%23d4af37' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='8' r='2.5' fill='%23008b8b'/%3E%3Ccircle cx='8' cy='2' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='8' cy='14' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='2' cy='8' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='14' cy='8' r='0.75' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat-x" }} />
            {/* Bottom */}
            <div className="absolute bottom-0 left-0 right-0" style={{ height: "16px", backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='16' height='16' fill='%235a1e2b'/%3E%3Cpath d='M8 0L16 8L8 16L0 8Z' fill='none' stroke='%23d4af37' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='8' r='2.5' fill='%23008b8b'/%3E%3Ccircle cx='8' cy='2' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='8' cy='14' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='2' cy='8' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='14' cy='8' r='0.75' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat-x" }} />
            {/* Left */}
            <div className="absolute top-[16px] bottom-[16px] left-0" style={{ width: "16px", backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='16' height='16' fill='%235a1e2b'/%3E%3Cpath d='M8 0L16 8L8 16L0 8Z' fill='none' stroke='%23d4af37' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='8' r='2.5' fill='%23008b8b'/%3E%3Ccircle cx='8' cy='2' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='8' cy='14' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='2' cy='8' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='14' cy='8' r='0.75' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat-y" }} />
            {/* Right */}
            <div className="absolute top-[16px] bottom-[16px] right-0" style={{ width: "16px", backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='16' height='16' fill='%235a1e2b'/%3E%3Cpath d='M8 0L16 8L8 16L0 8Z' fill='none' stroke='%23d4af37' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='8' r='2.5' fill='%23008b8b'/%3E%3Ccircle cx='8' cy='2' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='8' cy='14' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='2' cy='8' r='0.75' fill='%23ffffff'/%3E%3Ccircle cx='14' cy='8' r='0.75' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat-y" }} />
          </div>

          {/* 4. Inner gold thin line */}
          <div className="absolute" style={{ top: "21px", bottom: "21px", left: "21px", right: "21px", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(212, 175, 55, 0.8)" }} />

          {/* 5. Inner Teal border */}
          <div className="absolute" style={{ top: "22px", bottom: "22px", left: "22px", right: "22px", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#008b8b" }} />
        </div>

        {/* 4-Layer Page Layout Container */}
        <div className="relative z-10 flex h-full flex-col justify-between px-8 pt-10 pb-8 sm:px-11 sm:pt-12 sm:pb-10">
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
            {pageNumber === 1 && (
              <div className="mb-6 flex justify-center px-4 relative items-center">
                {/* Blinking gold background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[95%] rounded-xl bg-yellow-400/50 blur-2xl animate-[pulse_2s_ease-in-out_infinite]" />
                
                {/* Twinkling Stars */}
                <div className="absolute -top-4 left-1/4 text-yellow-400 text-2xl animate-[pulse_1.5s_ease-in-out_infinite] filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] z-30">✦</div>
                <div className="absolute bottom-4 -right-2 text-yellow-300 text-xl animate-[pulse_2.2s_ease-in-out_infinite] filter drop-shadow-[0_0_6px_rgba(255,215,0,0.8)] z-30">✧</div>
                <div className="absolute top-1/3 -left-2 text-yellow-500 text-lg animate-[pulse_1.8s_ease-in-out_infinite] filter drop-shadow-[0_0_5px_rgba(255,215,0,0.8)] z-30">✨</div>

                <div className="relative overflow-hidden rounded-xl border-4 border-yellow-100/80 shadow-[0_0_35px_rgba(255,215,0,0.6)] animate-[pulse_2s_ease-in-out_infinite] transform -rotate-1 transition-transform hover:scale-[1.02] hover:rotate-0 duration-300">
                  <img
                    src="/photo-collage.png"
                    alt="Our Memories Collage"
                    className="max-h-72 sm:max-h-96 md:max-h-[28rem] w-auto object-cover relative z-10"
                  />
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] rounded-xl z-20" />
                </div>
              </div>
            )}
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