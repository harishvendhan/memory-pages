import { useEffect, useState, useRef, useCallback } from "react";
import type { Message, BookLeaf } from "@/types/conversation";
import {
  heightCache,
  preloadMediaDimensions,
  paginateMessagesWithCache,
} from "@/lib/layout/heightPaginator";

interface UseAsyncPaginatorOptions {
  messages: Message[];
  containerWidth?: number;
  fontScale?: number;
  printableHeight?: number;
  initialPageNumber?: number;
}

export function useAsyncPaginator({
  messages,
  containerWidth = 400,
  fontScale = 1.0,
  printableHeight = 580,
  initialPageNumber = 12,
}: UseAsyncPaginatorOptions) {
  const [leaves, setLeaves] = useState<BookLeaf[]>([]);
  const [isPaginating, setIsPaginating] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const prevViewportWidth = useRef<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
  const prevFontScale = useRef<number>(fontScale);

  const computeLayout = useCallback(
    async (forceRepaginate = false) => {
      // If already locked and not forcing repagination, do not change page boundaries while reading
      if (isLocked && !forceRepaginate) {
        return;
      }

      setIsPaginating(true);

      // Async non-blocking execution via microtask/yield
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Preload media dimensions before finalizing pagination lock
      const mediaDims = await preloadMediaDimensions(messages);

      // Calculate paginated leaves with cache
      const newLeaves = paginateMessagesWithCache(
        messages,
        containerWidth,
        fontScale,
        printableHeight,
        24,
        initialPageNumber,
        mediaDims,
      );

      setLeaves(newLeaves);
      setIsPaginating(false);
      setIsLocked(true); // Lock layout once completed
    },
    [messages, containerWidth, fontScale, printableHeight, initialPageNumber, isLocked],
  );

  // Invalidate cache and repaginate on viewport width or font scale changes
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (Math.abs(currentWidth - prevViewportWidth.current) > 30) {
        prevViewportWidth.current = currentWidth;
        heightCache.invalidate(); // Invalidate cache on viewport width change
        setIsLocked(false); // Unlock to allow repagination
        computeLayout(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computeLayout]);

  // Initial computation
  useEffect(() => {
    if (messages.length > 0 && !isLocked) {
      computeLayout(false);
    }
  }, [messages, computeLayout, isLocked]);

  const forceRepaginate = useCallback(() => {
    heightCache.invalidate();
    setIsLocked(false);
    computeLayout(true);
  }, [computeLayout]);

  return {
    leaves,
    isPaginating,
    isLocked,
    forceRepaginate,
  };
}
