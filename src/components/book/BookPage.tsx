import paper from "@/assets/paper.jpg";
import type { Message } from "@/data/conversation";
import { MessageEntry } from "@/components/messages/MessageEntry";
import { cn } from "@/lib/utils";

interface BookPageProps {
  side: "left" | "right";
  heading: string;
  subheading: string;
  messages: Message[];
  pageNumber: number;
  totalPages: number;
  highlight?: string;
}

/** A single paper page with texture, gutter shading and a page number. */
export function BookPage({
  side,
  heading,
  subheading,
  messages,
  pageNumber,
  totalPages,
  highlight,
}: BookPageProps) {
  return (
    <div
      className={cn(
        "surface-paper relative flex h-full flex-col overflow-hidden",
        side === "left" ? "rounded-l-[0.4rem] md:rounded-r-none" : "rounded-r-[0.4rem] md:rounded-l-none",
        "rounded-[0.4rem]",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
        style={{ backgroundImage: `url(${paper})`, backgroundSize: "cover" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 hidden w-16 md:block"
        style={{
          [side === "left" ? "right" : "left"]: 0,
          backgroundImage:
            side === "left" ? "var(--gradient-gutter-left)" : "var(--gradient-gutter-right)",
        }}
        aria-hidden
      />

      <div className="relative flex h-full flex-col px-6 py-7 sm:px-9 sm:py-9">
        <header className="mb-6 shrink-0 text-center">
          <p className="font-body text-[0.6rem] uppercase tracking-[0.42em] text-ink-soft">
            {subheading}
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink sm:text-[1.7rem]">{heading}</h2>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-gold-deep/50" />
            <span className="size-1 rotate-45 bg-gold-deep/70" />
            <span className="h-px w-10 bg-gold-deep/50" />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1">
          {messages.map((message, i) => (
            <MessageEntry key={message.id} message={message} index={i} highlight={highlight} />
          ))}
        </div>

        <footer className="mt-5 shrink-0 text-center font-body text-[0.65rem] tracking-[0.3em] text-ink-soft">
          PAGE {pageNumber} / {totalPages}
        </footer>
      </div>
    </div>
  );
}