import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PaperCardProps {
  children: ReactNode;
  time: string;
  author: "me" | "them";
  className?: string;
}

/** A message printed onto a small slip of paper, pressed into the page. */
export function PaperCard({ children, time, author, className }: PaperCardProps) {
  return (
    <figure
      className={cn(
        "group relative max-w-[92%] rounded-2xl border px-4 py-3 transition-transform duration-500 ease-out sm:px-5 sm:py-4",
        "border-ink/10 bg-paper",
        author === "me" ? "mr-auto -rotate-[0.35deg]" : "ml-auto rotate-[0.35deg]",
        "hover:-translate-y-0.5",
        className,
      )}
      style={{ boxShadow: "var(--shadow-note)" }}
    >
      <div className="text-ink">{children}</div>
      <figcaption className="mt-2 flex items-center gap-2 font-body text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft">
        <span className="h-px w-4 bg-ink-soft/40" />
        {time}
      </figcaption>
    </figure>
  );
}