import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiMagnifyingGlass, HiXMark, HiArrowRight, HiBookOpen } from "react-icons/hi2";
import type { SearchHit } from "@/types/conversation";

interface PageMeta {
  pageNumber: number;
  chapter: string;
  date: string;
  leafIndex: number;
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelect: (leafIndex: number, term: string) => void;
  onSelectPage?: (pageNumber: number) => void;
  searchFn?: (term: string) => SearchHit[];
  totalPages?: number;
  pages?: PageMeta[];
}

/** Frontend-only search overlay with full text search & direct page number jumping. */
export function SearchOverlay({
  open,
  onClose,
  onSelect,
  onSelectPage,
  searchFn,
  totalPages,
  pages,
}: SearchOverlayProps) {
  const [term, setTerm] = useState("");

  // Detect if user typed a page number (e.g. "5", "page 12", "p 7", "pg: 3")
  const pageMatch = useMemo(() => {
    const q = term.trim();
    if (!q) return null;

    const match = q.match(/^(?:page\s*:?|pg\s*:?|p\s*:?)?\s*(\d+)\s*$/i);
    if (!match || !match[1]) return null;

    const pageNum = parseInt(match[1], 10);
    if (isNaN(pageNum) || pageNum <= 0) return null;
    if (totalPages && pageNum > totalPages) return null;

    const pageInfo = pages?.find((p) => p.pageNumber === pageNum);
    return {
      pageNumber: pageNum,
      chapter: pageInfo?.chapter ?? "Our Story",
      date: pageInfo?.date ?? "",
      leafIndex: pageInfo?.leafIndex ?? Math.floor((pageNum - 1) / 2),
    };
  }, [term, totalPages, pages]);

  const hits = useMemo<SearchHit[]>(() => {
    const q = term.trim().toLowerCase();
    if (q.length < 2) return [];

    if (searchFn) {
      return searchFn(q);
    }

    return [];
  }, [term, searchFn]);

  const handleSelectPage = (pageNum: number, leafIdx: number) => {
    if (onSelectPage) {
      onSelectPage(pageNum);
    } else {
      onSelect(leafIdx, "");
    }
    onClose();
  };

  const handleSelectHit = (hit: SearchHit) => {
    onSelect(hit.leafIndex, term.trim());
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pageMatch) {
      handleSelectPage(pageMatch.pageNumber, pageMatch.leafIndex);
    } else if (hits.length > 0) {
      handleSelectHit(hits[0]!);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]"
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
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="surface-paper relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gold-deep/40 shadow-2xl"
            style={{ boxShadow: "var(--shadow-book)" }}
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
              <HiMagnifyingGlass className="size-5 text-gold-deep shrink-0" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search a word or enter page number (e.g. 5, page 12)…"
                aria-label="Search text input"
                className="w-full bg-transparent font-display text-lg text-ink outline-none placeholder:text-ink-soft/70"
              />
              {term && (
                <button
                  type="button"
                  onClick={() => setTerm("")}
                  className="rounded-full p-1 text-ink-soft hover:text-ink transition-colors"
                  aria-label="Clear input"
                >
                  <HiXMark className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="rounded-full p-1 text-ink-soft hover:text-ink transition-colors ml-1"
              >
                <HiXMark className="size-5" />
              </button>
            </form>

            {/* Results Section */}
            <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2">
              {/* Direct Page Jump Card (If user typed a page number) */}
              {pageMatch && (
                <button
                  type="button"
                  onClick={() => handleSelectPage(pageMatch.pageNumber, pageMatch.leafIndex)}
                  className="group flex w-full items-center justify-between rounded-xl border border-gold/50 bg-gradient-to-r from-amber-500/15 via-pink-500/10 to-amber-500/15 p-4 text-left shadow-sm transition-all hover:scale-[1.01] hover:border-gold hover:bg-gold/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/20 text-gold-deep shadow-inner">
                      <HiBookOpen className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-semibold text-ink group-hover:text-gold-deep">
                          Go directly to Page {pageMatch.pageNumber}
                        </span>
                        <span className="rounded-full bg-gold/20 px-2 py-0.5 font-body text-[0.6rem] font-medium uppercase tracking-wider text-gold-deep">
                          Page Jump
                        </span>
                      </div>
                      <p className="font-body text-xs text-ink-soft mt-0.5">
                        {pageMatch.chapter} {pageMatch.date ? `· ${pageMatch.date}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-body text-xs font-medium uppercase tracking-wider text-gold-deep group-hover:translate-x-0.5 transition-transform">
                    <span>Jump</span>
                    <HiArrowRight className="size-4" />
                  </div>
                </button>
              )}

              {/* Text Search Hits */}
              {hits.length > 0 ? (
                hits.map((hit, i) => (
                  <button
                    key={`${hit.page}-${i}`}
                    type="button"
                    onClick={() => handleSelectHit(hit)}
                    className="block w-full rounded-xl border border-ink/5 bg-transparent p-4 text-left transition-colors hover:bg-paper-shade"
                  >
                    <div className="flex items-center justify-between font-body text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft">
                      <span>{hit.chapter}</span>
                      <span className="font-semibold text-gold-deep">Page {hit.page}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 font-display text-[1.05rem] text-ink">
                      {hit.excerpt}
                    </p>
                    <span className="font-body text-[0.6rem] uppercase tracking-[0.2em] text-gold-deep mt-1 inline-block">
                      {hit.author === "me" ? "Written by Me" : "Written by You"}
                    </span>
                  </button>
                ))
              ) : !pageMatch ? (
                <div className="px-6 py-10 text-center">
                  <p className="font-script text-base italic text-ink-soft">
                    {term.trim().length === 0
                      ? "Type a word, a name, or enter a page number like 5."
                      : "No matching messages found. Try another search term or page number."}
                  </p>
                  {totalPages && totalPages > 0 && (
                    <p className="mt-2 font-body text-[0.65rem] uppercase tracking-widest text-ink-soft/70">
                      Total book pages: 1 to {totalPages}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}