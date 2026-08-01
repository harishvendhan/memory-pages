import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { RoomBackdrop } from "@/components/atmosphere/RoomBackdrop";
import { BookCover } from "@/components/book/BookCover";
import { OpenBook } from "@/components/book/OpenBook";

const title = "Our Story — A Premium Digital Memory Book";
const description =
  "A candlelit leather memory book that keeps every message, photograph and voice note you ever shared.";

export const Route = createFileRoute("/")({
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
});

type Stage = "closed" | "opening" | "open";

function Index() {
  const [stage, setStage] = useState<Stage>("closed");

  const openBook = () => {
    setStage("opening");
    window.setTimeout(() => setStage("open"), 1500);
  };

  return (
    <RoomBackdrop>
      <main className="relative flex min-h-screen w-full items-center justify-center">
        <AnimatePresence mode="wait">
          {stage !== "open" ? (
            <motion.section
              key="cover"
              className="flex flex-col items-center py-20"
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: stage === "opening" ? 1.12 : 1,
              }}
              exit={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <BookCover opening={stage === "opening"} onOpen={openBook} />
              <p className="mt-14 font-body text-[0.6rem] uppercase tracking-[0.45em] text-muted-foreground">
                Handbound · Volume One
              </p>
            </motion.section>
          ) : (
            <motion.section
              key="book"
              className="w-full"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <OpenBook />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </RoomBackdrop>
  );
}
