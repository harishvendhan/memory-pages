import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PaperCardProps {
  children: ReactNode;
  time: string;
  author: "me" | "them";
  className?: string;
}

/** Direct paper printing wrapper: NO chat bubbles, NO cards, NO background boxes. */
export const PaperCard = memo(function PaperCard({
  children,
  time,
  author,
  className,
}: PaperCardProps) {
  return (
    <div
      className={cn(
        "relative max-w-[92%] py-0.5",
        author === "me" ? "mr-auto text-left" : "ml-auto text-right",
        className,
      )}
    >
      <div className="text-ink">{children}</div>
      <div
        className={cn(
          "mt-1 flex items-center gap-1.5 font-body text-[0.65rem] tracking-widest text-ink-soft/70",
          author === "me" ? "justify-start" : "justify-end",
        )}
      >
        <span>{time}</span>
      </div>
    </div>
  );
});