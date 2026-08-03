import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import type { Message, BookLeaf } from "@/types/conversation";
import { useSearch, type SearchResultItem } from "@/hooks/useSearch";
import { SearchResults } from "./SearchResults";
import paper from "@/assets/paper.jpg";

interface SearchDialogProps {
  messages: Message[];
  leaves?: BookLeaf[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onNavigate?: (pageNumber: number, messageId: string) => void;
}

export function SearchDialog({
  messages,
  leaves,
  isOpen: controlledIsOpen,
  onOpenChange,
  onNavigate,
}: SearchDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { query, setQuery, results, isIndexing, isReady } = useSearch(messages, {
    leaves,
  });

  // Focus input on dialog open
  useEffect(() => {
    if (!isOpen) return;

    setSelectedIndex(0);
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard shortcut listener (/ or Ctrl+F / Cmd+F to open, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement;

      if (!isOpen && (e.key === "/" && !isInputActive) || ((e.key === "f" || e.key === "F") && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setIsOpen(true);
      } else if (isOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          setIsOpen(false);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            results.length > 0 ? (prev + 1) % results.length : 0,
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            results.length > 0
              ? (prev - 1 + results.length) % results.length
              : 0,
          );
        } else if (e.key === "Enter" && results.length > 0) {
          e.preventDefault();
          const target = results[selectedIndex] ?? results[0];
          if (target) {
            handleSelectResult(target);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, setIsOpen]);

  const handleSelectResult = useCallback(
    (result: SearchResultItem) => {
      setIsOpen(false);
      onNavigate?.(result.pageNumber, result.messageId);
    },
    [onNavigate, setIsOpen],
  );

  return (
    <>
      {/* Floating Antique Brass Search Button */}
      {!isOpen && (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Open AI Memory Search"
          title="Search memories (Press / or Ctrl+F)"
          className="fixed bottom-6 right-6 z-40 flex size-13 sm:size-14 items-center justify-center rounded-full border-2 border-[#d4af37]/80 bg-gradient-to-br from-[#4a3622] via-[#2d1e13] to-[#1a120b] shadow-[0_6px_22px_rgba(0,0,0,0.65),0_0_16px_rgba(212,175,55,0.4)] backdrop-blur-md cursor-pointer transition-all hover:border-[#f3e5ab] hover:shadow-[0_8px_28px_rgba(0,0,0,0.75),0_0_24px_rgba(212,175,55,0.6)]"
        >
          {/* Inner brass rim */}
          <div className="absolute inset-1 rounded-full border border-[#d4af37]/40 pointer-events-none" />
          <HiMagnifyingGlass className="size-6 text-[#f3e5ab] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
        </motion.button>
      )}

      {/* Parchment Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center px-3 pt-[8vh] sm:px-4 sm:pt-[10vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Search conversation memories"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-leather-deep/85 backdrop-blur-md transition-opacity"
              onClick={() => setIsOpen(false)}
              aria-hidden
            />

            {/* Parchment Dialog Shell */}
            <motion.div
              initial={{ y: -24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="surface-paper relative w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-gold-deep/60 bg-[#f7f2e8] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.25)] select-none"
            >
              {/* Paper texture overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage: `url(${paper})`,
                  backgroundSize: "cover",
                }}
                aria-hidden
              />

              {/* Ornate corner vignettes */}
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                  boxShadow: "inset 0 0 40px oklch(0.2 0.04 45 / 0.25)",
                }}
                aria-hidden
              />

              {/* Header Title with Vintage Flourishes */}
              <div className="relative z-10 flex items-center justify-between border-b border-[#9c814b]/30 px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-display text-base text-[#9c814b]">
                    ❖
                  </span>
                  <div>
                    <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-[#8c7853]">
                      Search Our Story
                    </h2>
                    <p className="font-body text-[0.62rem] text-ink-soft">
                      Multilingual AI fuzzy search across all chapters
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close search"
                  className="rounded-full p-1.5 text-ink-soft hover:bg-gold/15 hover:text-ink transition-colors cursor-pointer"
                >
                  <HiXMark className="size-5" />
                </button>
              </div>

              {/* Search Input Bar */}
              <div className="relative z-10 flex items-center gap-3 border-b border-[#9c814b]/20 px-5 py-3.5 bg-paper-shade/30">
                <HiMagnifyingGlass className="size-5 text-gold-deep shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search in English, தமிழ், Tanglish, or emojis (e.g. ❤️, vanakkam)..."
                  aria-label="Search input query"
                  className="w-full bg-transparent font-display text-lg text-ink outline-none placeholder:text-ink-soft/60"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear query text"
                    className="rounded-full p-1 text-ink-soft hover:text-ink transition-colors cursor-pointer"
                  >
                    <HiXMark className="size-4" />
                  </button>
                )}
              </div>

              {/* Live Search Results Container */}
              <div className="relative z-10">
                <SearchResults
                  query={query}
                  results={results}
                  isIndexing={isIndexing}
                  isReady={isReady}
                  selectedIndex={selectedIndex}
                  onSelectResult={handleSelectResult}
                />
              </div>

              {/* Footer Keyboard Hints */}
              <div className="relative z-10 flex items-center justify-between border-t border-[#9c814b]/20 px-4 py-2 bg-paper-shade/50 font-body text-[0.62rem] text-ink-soft">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="rounded border border-ink/20 bg-paper px-1 py-0.5 font-mono">
                      ↑
                    </kbd>{" "}
                    <kbd className="rounded border border-ink/20 bg-paper px-1 py-0.5 font-mono">
                      ↓
                    </kbd>{" "}
                    Navigate
                  </span>
                  <span>
                    <kbd className="rounded border border-ink/20 bg-paper px-1.5 py-0.5 font-mono">
                      Enter
                    </kbd>{" "}
                    Open
                  </span>
                </div>
                <span>
                  <kbd className="rounded border border-ink/20 bg-paper px-1.5 py-0.5 font-mono">
                    Esc
                  </kbd>{" "}
                  Close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
