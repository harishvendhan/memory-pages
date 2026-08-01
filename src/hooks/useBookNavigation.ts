import { useCallback, useEffect, useState } from "react";

interface Options {
  total: number;
  onFlip?: (direction: "next" | "prev") => void;
}

/**
 * Placeholder page-flip controller.
 * Mirrors the react-pageflip API (flipNext / flipPrev / turnToPage) so the
 * component tree can be swapped to the real library without changes upstream.
 */
export function useBookNavigation({ total, onFlip }: Options) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const flipNext = useCallback(() => {
    setIndex((i) => {
      if (i >= total - 1) return i;
      setDirection("next");
      onFlip?.("next");
      return i + 1;
    });
  }, [total, onFlip]);

  const flipPrev = useCallback(() => {
    setIndex((i) => {
      if (i <= 0) return i;
      setDirection("prev");
      onFlip?.("prev");
      return i - 1;
    });
  }, [onFlip]);

  const turnToIndex = useCallback(
    (next: number) => {
      setIndex((i) => {
        const clamped = Math.max(0, Math.min(total - 1, next));
        setDirection(clamped >= i ? "next" : "prev");
        return clamped;
      });
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipNext();
      if (e.key === "ArrowLeft") flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipNext, flipPrev]);

  return {
    index,
    direction,
    flipNext,
    flipPrev,
    turnToIndex,
    canNext: index < total - 1,
    canPrev: index > 0,
  };
}