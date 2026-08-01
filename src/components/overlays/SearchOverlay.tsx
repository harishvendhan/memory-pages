import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import type { SearchHit, BookLeaf } from "@/types/conversation";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelect: (leafIndex: number, term: string) => void;
  searchFn?: (term: string) => SearchHit[];
}

/** Frontend-only search overlay with full accessibility support. */
export function SearchOverlay({ open, onClose, onSelect, searchFn }: SearchOverlayProps) {
  const [term, setTerm] = useState("");

  const hits = useMemo<SearchHit[]>(() => {
    const q = term.trim().toLowerCase();
    if (q.length < 2) return [];

    if (searchFn) {
      return searchFn(q);
    }

    return [];
  }, [term, searchFn]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search conversation"
        >
          <div
            className="absolute inset-0 bg-leather-deep/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ y: -24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="surface-paper relative w-full max-w-2xl overflow-hidden rounded-xl border border-gold-deep/40"
            style={{ boxShadow: "var(--shadow-book)" }}
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
              <HiMagnifyingGlass className="size-5 text-gold-deep" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search every word you ever wrote…"
                aria-label="Search text input"
                className="w-full bg-transparent font-display text-lg text-ink outline-none placeholder:text-ink-soft/70"
              />
              <button type="button" onClick={onClose} aria-label="Close search">
                <HiXMark className="size-5 text-ink-soft transition-colors hover:text-ink" />
              </button>
            </div>
            <div className="max-h-[46vh] overflow-y-auto">
              {hits.length === 0 ? (
                <p className="px-6 py-8 text-center font-script text-sm italic text-ink-soft">
                  {term.trim().length < 2
                    ? "Type a word, a name, a feeling."
                    : "Nothing in these pages, yet."}
                </p>
              ) : (
                hits.map((hit, i) => (
                  <button
                    key={`${hit.page}-${i}`}
                    type="button"
                    onClick={() => {
                      onSelect(hit.leafIndex, term.trim());
                      onClose();
                    }}
                    className="block w-full border-b border-ink/5 px-6 py-4 text-left transition-colors hover:bg-paper-shade"
                  >
                    <div className="flex items-center justify-between font-body text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft">
                      <span>{hit.chapter}</span>
                      <span>Page {hit.page}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 font-display text-[1.05rem] text-ink">
                      {hit.excerpt}
                    </p>
                    <span className="font-body text-[0.6rem] uppercase tracking-[0.2em] text-gold-deep">
                      {hit.author === "me" ? "Written by Me" : "Written by You"}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}