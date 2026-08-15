import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion, AnimatePresence } from "framer-motion";
import { HiMagnifyingGlass, HiOutlineListBullet, HiOutlineBookOpen, HiHome, HiArrowUp } from "react-icons/hi2";
import { useMemoryBook } from "@/hooks/useMemoryBook";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookPage } from "./BookPage";
import { BookControls } from "./BookControls";
import { Ribbon } from "./Ribbon";
import { SearchDialog } from "@/components/search/SearchDialog";
import { ContentsDrawer } from "@/components/overlays/ContentsDrawer";

interface FlipBookRef {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    turnToPage: (page: number) => void;
    getCurrentPageIndex: () => number;
    getPageCount: () => number;
  };
}

interface OpenBookProps {
  memoryBook: ReturnType<typeof useMemoryBook>;
  onClose?: () => void;
}

export function OpenBook({ memoryBook, onClose }: OpenBookProps) {
  const { leaves, totalPages, search: searchAdapter, chapters, isPaginating } = memoryBook;
  const isMobile = useIsMobile();
  const bookRef = useRef<FlipBookRef | null>(null);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [search, setSearch] = useState(false);
  const [contents, setContents] = useState(false);
  const [highlight, setHighlight] = useState<string>("");
  const [bookmarked, setBookmarked] = useState<number | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Flatten leaves into single pages for continuous chronological reading
  const singlePages = useMemo(() => {
    const pages: Array<{
      id: string;
      side: "left" | "right";
      heading: string;
      subheading: string;
      messages: typeof leaves[0]["left"];
      blocks?: typeof leaves[0]["leftBlocks"];
      pageNumber: number;
      leafIndex: number;
      date: string;
      chapter: string;
    }> = [];

    leaves.forEach((leaf, leafIndex) => {
      // Left page (Front)
      pages.push({
        id: `p-${leaf.pageNumber}-left`,
        side: "left",
        heading: leaf.chapter,
        subheading: "Our Story",
        messages: leaf.left,
        blocks: leaf.leftBlocks,
        pageNumber: leaf.pageNumber,
        leafIndex,
        date: leaf.date,
        chapter: leaf.chapter,
      });

      // Right page (Back)
      pages.push({
        id: `p-${leaf.pageNumber}-right`,
        side: "right",
        heading: leaf.chapter,
        subheading: "Our Story",
        messages: leaf.right,
        blocks: leaf.rightBlocks,
        pageNumber: leaf.pageNumber + 1,
        leafIndex,
        date: leaf.date,
        chapter: leaf.chapter,
      });
    });

    return pages;
  }, [leaves]);

  console.log("OpenBook singlePages length:", singlePages.length);
  if (singlePages.length > 0) {
    console.log("OpenBook first page:", singlePages[0]);
  }

  const activePageIndex = Math.min(currentPageIndex, Math.max(0, singlePages.length - 1));
  const activePage = singlePages[activePageIndex];
  
  const activeLeafIndex = activePage?.leafIndex ?? 0;

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const goToFirstPage = useCallback(() => {
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      bookRef.current?.pageFlip()?.turnToPage(0);
      setCurrentPageIndex(0);
    }
  }, [isMobile]);

  const turnToLeaf = useCallback(
    (targetLeafIndex: number) => {
      if (isMobile) {
        const targetPage = singlePages.find((p) => p.leafIndex === targetLeafIndex);
        if (targetPage) {
          const el = document.getElementById(`page-${targetPage.pageNumber}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      } else {
        const targetPageIndex = targetLeafIndex * 2;
        bookRef.current?.pageFlip()?.turnToPage(targetPageIndex);
      }
    },
    [isMobile, singlePages],
  );

  const turnToPage = useCallback(
    (targetPageNumber: number) => {
      const clamped = Math.max(1, Math.min(totalPages, targetPageNumber));
      if (isMobile) {
        const targetPage =
          singlePages.find((p) => p.pageNumber === clamped) ||
          singlePages.find((p) => p.pageNumber >= clamped) ||
          singlePages[0];
        if (targetPage) {
          const el = document.getElementById(`page-${targetPage.pageNumber}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      } else {
        const pageIndex = singlePages.findIndex((p) => p.pageNumber === clamped);
        if (pageIndex !== -1) {
          bookRef.current?.pageFlip()?.turnToPage(pageIndex);
          setCurrentPageIndex(pageIndex);
        } else {
          const fallbackIndex = Math.max(0, clamped - 1);
          bookRef.current?.pageFlip()?.turnToPage(fallbackIndex);
          setCurrentPageIndex(fallbackIndex);
        }
      }
    },
    [isMobile, singlePages, totalPages],
  );

  const allMessages = useMemo(() => {
    const msgs: typeof leaves[0]["left"] = [];
    leaves.forEach((l) => msgs.push(...l.left, ...l.right));
    return msgs;
  }, [leaves]);

  const triggerMessageHighlight = useCallback((messageId: string) => {
    // Small timeout to allow page flip / DOM update to settle
    setTimeout(() => {
      const el = document.querySelector(
        `[data-message-id="${messageId}"], #msg-${messageId}`,
      ) as HTMLElement | null;

      if (el) {
        el.classList.remove("golden-glow-highlight");
        void el.offsetWidth; // Trigger reflow
        el.classList.add("golden-glow-highlight");
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });

        setTimeout(() => {
          el.classList.remove("golden-glow-highlight");
        }, 3000);
      }
    }, 280);
  }, []);

  const handleSearchNavigate = useCallback(
    (targetPage: number, messageId: string) => {
      turnToPage(targetPage);
      triggerMessageHighlight(messageId);
    },
    [turnToPage, triggerMessageHighlight],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isMobile) {
        if (e.key === "ArrowRight") flipNext();
        if (e.key === "ArrowLeft") flipPrev();
      }
      if (e.key === "/" || (e.key === "f" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape") {
        setSearch(false);
        setContents(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipNext, flipPrev, isMobile]);

  const canPrev = currentPageIndex > 0;
  const canNext = currentPageIndex < singlePages.length - 1;

  return (
    <div className="relative mx-auto w-full max-w-6xl px-3 pb-16 pt-4 sm:px-6">
      {/* Screen Reader ARIA Live Announcement */}
      <div className="sr-only" aria-live="polite">
        Page {activePage?.pageNumber ?? "?"} of {totalPages}, {activePage?.chapter ?? ""} - {activePage?.date ?? ""}
      </div>

      {/* Toolbar - Sticky on mobile for effortless navigation while scrolling */}
      <div className="sticky top-2 z-40 mb-5 flex items-center justify-between gap-2 rounded-full border border-gold-deep/30 bg-leather-deep/90 px-3 py-2 sm:static sm:bg-transparent sm:border-0 sm:px-0 sm:py-0 sm:mb-6 backdrop-blur-md">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-full border border-gold-deep/40 bg-leather-deep/70 px-3 py-1.5 sm:py-2 font-body text-[0.65rem] uppercase tracking-[0.22em] text-gold backdrop-blur-sm transition-colors hover:border-gold/70 hover:bg-leather/80"
              title="Close book and return to cover"
            >
              <HiOutlineBookOpen className="size-4" /> Cover
            </button>
          )}
          <button
            type="button"
            onClick={goToFirstPage}
            className="flex items-center gap-1.5 rounded-full border border-gold-deep/40 bg-leather-deep/70 px-3 py-1.5 sm:py-2 font-body text-[0.65rem] uppercase tracking-[0.22em] text-gold backdrop-blur-sm transition-colors hover:border-gold/70 hover:bg-leather/80"
            title="Go to First Page"
          >
            <HiHome className="size-3.5" /> First Page
          </button>
          <button
            type="button"
            onClick={() => setContents(true)}
            className="flex items-center gap-1.5 rounded-full border border-gold-deep/40 bg-leather-deep/70 px-3 py-1.5 sm:py-2 sm:px-4 font-body text-[0.65rem] uppercase tracking-[0.28em] text-gold backdrop-blur-sm transition-colors hover:border-gold/70 hover:bg-leather/80"
          >
            <HiOutlineListBullet className="size-4" /> Contents
          </button>
        </div>

        <p className="hidden font-script text-sm italic text-muted-foreground sm:block">
          {activePage?.date ?? ""} · {activePage?.chapter ?? ""}
        </p>

        <button
          type="button"
          onClick={() => setSearch(true)}
          className="flex items-center gap-1.5 rounded-full border border-gold-deep/40 bg-leather-deep/70 px-3.5 py-1.5 sm:py-2 sm:px-4 font-body text-[0.65rem] uppercase tracking-[0.28em] text-gold backdrop-blur-sm transition-colors hover:border-gold/70 hover:bg-leather/80"
        >
          <HiMagnifyingGlass className="size-4" /> Search
        </button>
      </div>

      {/* Book body container */}
      {isMobile ? (
        /* Mobile: Continuous natural vertical parchment scroll */
        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-12">
          {singlePages.map((p) => (
            <div
              key={p.id}
              id={`page-${p.pageNumber}`}
              className="gpu surface-leather relative overflow-hidden rounded-xl border border-gold-deep/30 p-1.5 shadow-2xl"
              style={{ boxShadow: "var(--shadow-book)" }}
            >
              <div className="absolute inset-1.5 rounded-lg border border-gold/20 pointer-events-none z-20" aria-hidden />
              <div className="relative overflow-hidden rounded-lg">
                <BookPage
                  side={p.side}
                  heading={p.heading}
                  subheading={p.subheading}
                  messages={p.messages}
                  blocks={p.blocks}
                  pageNumber={p.pageNumber}
                  totalPages={totalPages}
                  highlight={highlight}
                  className="min-h-[520px] h-auto"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Desktop: 3D Flipbook Experience */
        <div className="relative" style={{ perspective: "2400px" }}>
          <BookControls onPrev={flipPrev} onNext={flipNext} canPrev={canPrev} canNext={canNext} />

          <Ribbon
            active={bookmarked === activeLeafIndex}
            onToggle={() => setBookmarked((b) => (b === activeLeafIndex ? null : activeLeafIndex))}
            className="right-10 top-0 sm:right-16 z-30"
          />

          <motion.div
            className="gpu surface-leather relative overflow-hidden rounded-xl border border-gold-deep/30 p-1.5 sm:p-3 mx-auto w-full max-w-5xl"
            style={{ boxShadow: "var(--shadow-book)" }}
            initial={{ opacity: 0, y: 30, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-1.5 rounded-lg border border-gold/20 sm:inset-3 pointer-events-none z-20" aria-hidden />

            {/* HTMLFlipBook Physical 3D Engine Container */}
            <div className="relative flex items-center justify-center h-[86vh] min-h-[520px] max-h-[840px] md:h-[88vh] md:min-h-[700px] md:max-h-none overflow-hidden rounded-lg">
              <AnimatePresence>
                {isPaginating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-40 flex items-center justify-center bg-leather-deep/60 backdrop-blur-xs"
                  >
                    <p className="font-script text-sm italic text-gold tracking-widest animate-pulse">
                      Paginating memories…
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* @ts-expect-error react-pageflip typings wrapper */}
              <HTMLFlipBook
                ref={bookRef}
                width={540}
                height={840}
                size="stretch"
                minWidth={320}
                maxWidth={720}
                minHeight={650}
                maxHeight={1100}
                maxShadowOpacity={0.8}
                showCover={false}
                mobileScrollSupport={true}
                drawShadow={true}
                flippingTime={900}
                usePortrait={false}
                startZIndex={1}
                autoSize={true}
                clickEventForward={true}
                disableFlipByClick={true}
                className="memory-flipbook flex items-center justify-center"
                onFlip={(e: { data: number }) => setCurrentPageIndex(e.data)}
              >
                {singlePages.map((p) => (
                  <BookPage
                    key={p.id}
                    side={p.side}
                    heading={p.heading}
                    subheading={p.subheading}
                    messages={p.messages}
                    blocks={p.blocks}
                    pageNumber={p.pageNumber}
                    totalPages={totalPages}
                    highlight={highlight}
                  />
                ))}
              </HTMLFlipBook>

              {/* Central Spine shadow layer */}
              <div
                className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-10 -translate-x-1/2 md:block z-20"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.25 0.04 45 / 0.45) 40%, oklch(0.2 0.03 45 / 0.6) 50%, oklch(0.25 0.04 45 / 0.45) 60%, transparent)",
                }}
                aria-hidden
              />
            </div>
          </motion.div>
        </div>
      )}

      <p className="mt-8 text-center font-body text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground md:mt-5">
        {isMobile ? "Scroll down to explore our story" : "Drag page corners, swipe, or use ← →"}
      </p>

      <SearchDialog
        messages={allMessages}
        leaves={leaves}
        isOpen={search}
        onOpenChange={setSearch}
        onNavigate={handleSearchNavigate}
      />
      <ContentsDrawer
        open={contents}
        onClose={() => setContents(false)}
        onSelect={turnToLeaf}
        currentIndex={activeLeafIndex}
        chapters={chapters}
      />

      {/* Floating Quick Action Pill when scrolled down */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.88 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 right-4 z-50 flex items-center gap-2 shadow-2xl sm:bottom-7 sm:right-7 select-none"
          >
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-full border border-gold-deep/50 bg-leather-deep/95 px-3 py-2 font-body text-[0.68rem] uppercase tracking-[0.2em] text-gold shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all hover:scale-105 hover:border-gold hover:bg-leather active:scale-95 cursor-pointer"
                title="Return to Book Cover"
              >
                <HiOutlineBookOpen className="size-4" /> Cover
              </button>
            )}
            <button
              type="button"
              onClick={goToFirstPage}
              className="flex items-center gap-1.5 rounded-full border border-gold-deep/60 bg-gradient-to-r from-[#3c2a1e] via-[#2a1d15] to-[#3c2a1e] px-3.5 py-2 font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-gold shadow-[0_6px_20px_rgba(0,0,0,0.6),0_0_12px_rgba(200,153,56,0.3)] backdrop-blur-md transition-all hover:scale-105 hover:border-gold hover:text-white active:scale-95 cursor-pointer"
              title="Back to First Page"
            >
              <HiArrowUp className="size-4 animate-bounce" /> First Page
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}