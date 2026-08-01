import { AnimatePresence, motion } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import type { Chapter } from "@/types/conversation";

import { getDisplayName } from "@/lib/displayName";

interface ContentsDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (leafIndex: number) => void;
  currentIndex: number;
  chapters?: Chapter[];
}

/** Elegant table of contents drawer. */
export function ContentsDrawer({
  open,
  onClose,
  onSelect,
  currentIndex,
  chapters = [],
}: ContentsDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Table of contents"
        >
          <div className="absolute inset-0 bg-leather-deep/75 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="surface-leather absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col border-r border-gold-deep/40 px-7 py-9"
            style={{ boxShadow: "var(--shadow-book)" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-[0.6rem] uppercase tracking-[0.42em] text-gold/70">
                  Our Story
                </p>
                <h2 className="text-gilded mt-2 font-display text-3xl">Table of Contents</h2>
              </div>
              <button type="button" onClick={onClose} aria-label="Close contents">
                <HiXMark className="size-6 text-gold/70 transition-colors hover:text-gold" />
              </button>
            </div>

            <div className="mt-8 flex-1 space-y-1 overflow-y-auto">
              {chapters.map((chapter, i) => (
                <button
                  key={`${chapter.title}-${i}`}
                  type="button"
                  onClick={() => {
                    onSelect(i);
                    onClose();
                  }}
                  className="group flex w-full items-baseline gap-3 rounded-lg px-3 py-4 text-left transition-colors hover:bg-gold/10"
                >
                  <span className="font-display text-lg text-gold/60">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span
                      className={`block font-display text-xl ${i === currentIndex ? "text-gold" : "text-foreground"}`}
                    >
                      {getDisplayName(chapter.title)}
                    </span>
                    <span className="block font-body text-xs italic text-muted-foreground">
                      {getDisplayName(chapter.subtitle)}
                    </span>
                  </span>
                  <span className="font-body text-[0.65rem] tracking-[0.2em] text-gold/60">
                    {chapter.page}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 border-t border-gold-deep/25 pt-5 text-center font-script text-sm italic text-muted-foreground">
              A book filled with lovable words.
            </p>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}