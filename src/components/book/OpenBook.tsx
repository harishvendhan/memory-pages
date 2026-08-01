import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiMagnifyingGlass, HiOutlineListBullet } from "react-icons/hi2";
import { leaves, TOTAL_PAGES } from "@/data/conversation";
import { useBookNavigation } from "@/hooks/useBookNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookPage } from "./BookPage";
import { BookControls } from "./BookControls";
import { PageFlipSheet } from "./PageFlipSheet";
import { Ribbon } from "./Ribbon";
import { SearchOverlay } from "@/components/overlays/SearchOverlay";
import { ContentsDrawer } from "@/components/overlays/ContentsDrawer";

/** The open volume: two paper pages, leather binding, flipping and overlays. */
export function OpenBook() {
  const isMobile = useIsMobile();
  const sheetsPerLeaf = isMobile ? 2 : 1;
  const total = leaves.length * sheetsPerLeaf;

  const [flipKey, setFlipKey] = useState(0);
  const { index, direction, flipNext, flipPrev, turnToIndex, canNext, canPrev } =
    useBookNavigation({ total, onFlip: () => setFlipKey((k) => k + 1) });

  const [search, setSearch] = useState(false);
  const [contents, setContents] = useState(false);
  const [highlight, setHighlight] = useState<string>("");
  const [bookmarked, setBookmarked] = useState<number | null>(null);

  const leafIndex = isMobile ? Math.floor(index / 2) : index;
  const leaf = leaves[Math.min(leafIndex, leaves.length - 1)]!;
  const mobileSide: "left" | "right" = index % 2 === 0 ? "left" : "right";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
  }, []);

  const goToLeaf = (target: number) => turnToIndex(target * sheetsPerLeaf);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setContents(true)}
          className="flex items-center gap-2 rounded-full border border-gold-deep/40 bg-leather-deep/60 px-4 py-2 font-body text-[0.65rem] uppercase tracking-[0.28em] text-gold backdrop-blur-sm transition-colors hover:border-gold/70"
        >
          <HiOutlineListBullet className="size-4" /> Contents
        </button>
        <p className="hidden font-script text-sm italic text-muted-foreground sm:block">
          {leaf.date} · {leaf.chapter}
        </p>
        <button
          type="button"
          onClick={() => setSearch(true)}
          className="flex items-center gap-2 rounded-full border border-gold-deep/40 bg-leather-deep/60 px-4 py-2 font-body text-[0.65rem] uppercase tracking-[0.28em] text-gold backdrop-blur-sm transition-colors hover:border-gold/70"
        >
          <HiMagnifyingGlass className="size-4" /> Search
        </button>
      </div>

      {/* Book body */}
      <div className="relative" style={{ perspective: "2400px" }}>
        <BookControls onPrev={flipPrev} onNext={flipNext} canPrev={canPrev} canNext={canNext} />

        <Ribbon
          active={bookmarked === leafIndex}
          onToggle={() => setBookmarked((b) => (b === leafIndex ? null : leafIndex))}
          className="right-10 top-0 sm:right-16"
        />

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) flipNext();
            if (info.offset.x > 70) flipPrev();
          }}
          className="gpu surface-leather relative overflow-hidden rounded-xl border border-gold-deep/30 p-2 sm:p-3"
          style={{ boxShadow: "var(--shadow-book)", touchAction: "pan-y" }}
          initial={{ opacity: 0, y: 30, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-2 rounded-lg border border-gold/20 sm:inset-3" aria-hidden />

          <div className="relative grid h-[74vh] min-h-[480px] grid-cols-1 overflow-hidden rounded-lg md:h-[78vh] md:grid-cols-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${index}-a`}
                initial={{ opacity: 0, x: direction === "next" ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full min-h-0 md:col-span-2 md:grid md:grid-cols-2"
              >
                {(!isMobile || mobileSide === "left") && (
                  <BookPage
                    side="left"
                    heading={leaf.chapter}
                    subheading="My messages"
                    messages={leaf.left}
                    pageNumber={leaf.pageNumber}
                    totalPages={TOTAL_PAGES}
                    highlight={highlight}
                  />
                )}
                {(!isMobile || mobileSide === "right") && (
                  <BookPage
                    side="right"
                    heading={leaf.chapter}
                    subheading="Their messages"
                    messages={leaf.right}
                    pageNumber={leaf.pageNumber + 1}
                    totalPages={TOTAL_PAGES}
                    highlight={highlight}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* spine shadow */}
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-10 -translate-x-1/2 md:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.25 0.04 45 / 0.45) 40%, oklch(0.2 0.03 45 / 0.6) 50%, oklch(0.25 0.04 45 / 0.45) 60%, transparent)",
              }}
              aria-hidden
            />

            <PageFlipSheet flipKey={flipKey} direction={direction} />

            {/* corner drag / peel */}
            <motion.button
              type="button"
              aria-label="Turn the page"
              onClick={flipNext}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-0 right-0 size-16 cursor-grab active:cursor-grabbing"
              style={{
                background:
                  "linear-gradient(315deg, oklch(0.82 0.03 82) 0 42%, transparent 42.5%)",
                filter: "drop-shadow(-4px -4px 8px oklch(0 0 0 / 0.35))",
              }}
            />
          </div>
        </motion.div>
      </div>

      <p className="mt-5 text-center font-body text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground">
        Swipe, drag the corner, or use ← →
      </p>

      <SearchOverlay
        open={search}
        onClose={() => setSearch(false)}
        onSelect={(target, term) => {
          setHighlight(term);
          goToLeaf(target);
        }}
      />
      <ContentsDrawer
        open={contents}
        onClose={() => setContents(false)}
        onSelect={goToLeaf}
        currentIndex={leafIndex}
      />
    </div>
  );
}