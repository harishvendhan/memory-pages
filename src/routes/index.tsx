import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { RoomBackdrop } from "@/components/atmosphere/RoomBackdrop";
import { BookCover } from "@/components/book/BookCover";
import { OpenBook } from "@/components/book/OpenBook";
import { LoveMessageModal } from "@/components/book/LoveMessageModal";
import { BirthdayLoveLetter } from "@/components/intro/BirthdayLoveLetter";
import { useMemoryBook } from "@/hooks/useMemoryBook";
import { loadPublicConversation } from "@/lib/publicConversationLoader";

const title = "Our Lovable Memories — A Premium Digital Memory Book";
const description =
  "A candlelit leather memory book that keeps every message, photograph and voice note you ever shared.";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
}));

/**
 * Simplified App Stage Machine:
 *
 * "loading" → auto-detect from public folder
 *    → success: "closed"  (book cover → open)
 *    → fail:    "not_found" (Conversation not found screen)
 *
 * "closed" | "opening" | "open" → existing book cover + 3D flip (UNTOUCHED)
 */
type AppStage =
  | "loading"
  | "not_found"
  | "closed"
  | "opening"
  | "open";

function Index() {
  const [appStage, setAppStage] = useState<AppStage>("loading");
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [showLovePopup, setShowLovePopup] = useState(false);
  const timerRef = useRef<number | null>(null);

  // ── Memory Book (receives BookConversation, knows nothing of import source) ──
  const memoryBook = useMemoryBook();

  // ── On mount: try auto-discovery from public folder ──
  useEffect(() => {
    let isMounted = true;
    loadPublicConversation().then((conversation) => {
      if (!isMounted) return;
      if (conversation) {
        memoryBook.loadBookConversation(conversation);
        setAppStage("closed");
      } else {
        setAppStage("not_found");
      }
    }).catch((err) => {
      console.error("Failed to load public conversation:", err);
      if (isMounted) setAppStage("not_found");
    });
    
    return () => {
      isMounted = false;
    };
  }, [memoryBook.loadBookConversation]);

  const handleOpenClick = useCallback(() => {
    setShowLovePopup(true);
  }, []);

  const handleProceedToOpen = useCallback(() => {
    setShowLovePopup(false);
    setAppStage("opening");
    timerRef.current = window.setTimeout(() => setAppStage("open"), 1500);
  }, []);

  const handleCloseBook = useCallback(() => {
    setAppStage("closed");
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  // ── Render ──
  if (appStage === "open") {
    console.log("Before rendering OpenBook:", memoryBook.volume);
  }

  return (
    <RoomBackdrop>
      <main className="relative flex min-h-screen w-full items-center justify-center">
        <AnimatePresence mode="wait">

          {/* Auto-discovery loading */}
          {appStage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-screen items-center justify-center w-full"
            >
               <div className="w-full max-w-sm text-center">
                  <div className="mb-8 font-display text-2xl text-[#9c814b] animate-pulse select-none">
                    ❖
                  </div>
                  <p className="font-display text-[1rem] tracking-[0.18em] text-[#8c7853] uppercase animate-pulse">
                    Opening Memory Book...
                  </p>
               </div>
            </motion.div>
          )}

          {/* Conversation not found screen */}
          {appStage === "not_found" && (
             <motion.div
               key="not_found"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
               className="flex min-h-screen items-center justify-center w-full px-4"
             >
                <div className="w-full max-w-md text-center">
                  <div className="mb-4 font-display text-3xl text-[#9c814b] select-none">✦</div>
                  <h1 className="font-display text-[1.5rem] font-semibold tracking-[0.22em] text-[#8c7853] uppercase">
                    Conversation Not Found
                  </h1>
                  <div className="mx-auto mt-2.5 flex items-center justify-center gap-3 opacity-50">
                    <span className="h-px w-16 bg-[#9c814b]" />
                    <span className="font-display text-[0.6rem] text-[#9c814b]">❖</span>
                    <span className="h-px w-16 bg-[#9c814b]" />
                  </div>
                  <p className="mt-4 font-body text-[0.82rem] leading-relaxed text-[#7d7365]">
                    Could not find the conversation data.<br />
                    Please ensure the files are placed correctly in the public folder.
                  </p>
                </div>
             </motion.div>
          )}

          {/* Existing book cover + 3D page flip — UNTOUCHED */}
          {(appStage === "closed" || appStage === "opening") && (
            <motion.section
              key="cover"
              className="flex flex-col items-center justify-center py-4"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: appStage === "opening" ? 1.08 : 1,
              }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <BookCover
                opening={appStage === "opening"}
                onOpen={handleOpenClick}
                onReadLetter={() => setHasPlayedIntro(false)}
              />
              <p className="mt-4 font-body text-[0.62rem] uppercase tracking-[0.45em] text-muted-foreground">
                Handbound · Volume One
              </p>
            </motion.section>
          )}

          {appStage === "open" && (
            <motion.section
              key="book"
              className="w-full"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <OpenBook memoryBook={memoryBook} onClose={handleCloseBook} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Lovable Birthday Love Letter & Wishes (Words Slowly Appear on Paper) */}
        {!hasPlayedIntro && appStage !== "loading" && appStage !== "not_found" && (
          <BirthdayLoveLetter onComplete={() => setHasPlayedIntro(true)} />
        )}

        {/* Romantic Pop-up Message from the middle */}
        <LoveMessageModal
          isOpen={showLovePopup}
          onProceed={handleProceedToOpen}
        />
      </main>
    </RoomBackdrop>
  );
}
