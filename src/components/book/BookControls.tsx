import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { cn } from "@/lib/utils";

interface BookControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

const base =
  "grid size-12 place-items-center rounded-full border border-gold-deep/40 bg-leather-deep/70 text-gold backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-gold/70 disabled:opacity-25 disabled:hover:scale-100";

export function BookControls({ onPrev, onNext, canPrev, canNext }: BookControlsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous page"
        className={cn(base, "absolute left-2 top-1/2 z-20 -translate-y-1/2 lg:-left-20")}
      >
        <HiChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next page"
        className={cn(base, "absolute right-2 top-1/2 z-20 -translate-y-1/2 lg:-right-20")}
      >
        <HiChevronRight className="size-6" />
      </button>
    </>
  );
}