import { HiBookmark } from "react-icons/hi2";
import { cn } from "@/lib/utils";

interface RibbonProps {
  active: boolean;
  onToggle: () => void;
  className?: string;
}

/** Silk ribbon bookmark falling out of the book. */
export function Ribbon({ active, onToggle, className }: RibbonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? "Remove bookmark" : "Bookmark this page"}
      className={cn(
        "group absolute z-20 flex w-9 flex-col items-center transition-all duration-500",
        active ? "translate-y-0" : "-translate-y-6 hover:-translate-y-3",
        className,
      )}
    >
      <span
        className="h-24 w-5 rounded-b-[2px] sm:h-32"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.48 0.17 25), oklch(0.36 0.14 25) 70%, oklch(0.3 0.12 25))",
          boxShadow: "0 12px 22px -12px oklch(0 0 0 / 0.8)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
        }}
      />
      <HiBookmark
        className={cn(
          "mt-1 size-4 transition-colors",
          active ? "text-gold" : "text-gold/40 group-hover:text-gold/80",
        )}
      />
    </button>
  );
}