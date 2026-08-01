import { AnimatePresence, motion } from "framer-motion";
import paper from "@/assets/paper.jpg";

interface PageFlipSheetProps {
  flipKey: number;
  direction: "next" | "prev";
}

/**
 * Hyper-realistic 3D turning page leaf with specular candlelight reflections
 * and dynamic paper shadow projection across the book spine.
 */
export function PageFlipSheet({ flipKey, direction }: PageFlipSheetProps) {
  const next = direction === "next";

  return (
    <AnimatePresence>
      {flipKey > 0 && (
        <>
          {/* Shadow cast onto the static page below during leaf turn */}
          <motion.div
            key={`shadow-${flipKey}`}
            aria-hidden
            className="pointer-events-none absolute inset-y-0 hidden w-1/2 md:block z-10"
            style={{ [next ? "left" : "right"]: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <div
              className="h-full w-full"
              style={{
                background: next
                  ? "linear-gradient(90deg, oklch(0.1 0.02 45 / 0.6) 0%, transparent 60%)"
                  : "linear-gradient(270deg, oklch(0.1 0.02 45 / 0.6) 0%, transparent 60%)",
              }}
            />
          </motion.div>

          {/* Rotating paper leaf */}
          <motion.div
            key={flipKey}
            aria-hidden
            className="gpu pointer-events-none absolute inset-y-0 hidden w-1/2 md:block z-20"
            style={{
              [next ? "right" : "left"]: 0,
              transformOrigin: next ? "left center" : "right center",
              transformStyle: "preserve-3d",
              backgroundImage: `var(--gradient-paper), url(${paper})`,
              backgroundSize: "cover",
              boxShadow: "var(--shadow-page)",
              borderRadius: next ? "0 0.4rem 0.4rem 0" : "0.4rem 0 0 0.4rem",
            }}
            initial={{ rotateY: 0, opacity: 1 }}
            animate={{ rotateY: next ? -178 : 178, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 1, 0.35, 1] }}
          >
            {/* Candlelight specular sheen sweeping across paper arch */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0] }}
              transition={{ duration: 1.1 }}
              style={{
                background: next
                  ? "linear-gradient(115deg, transparent 30%, oklch(0.95 0.1 85 / 0.45) 50%, oklch(0.15 0.03 45 / 0.5) 75%)"
                  : "linear-gradient(245deg, transparent 30%, oklch(0.95 0.1 85 / 0.45) 50%, oklch(0.15 0.03 45 / 0.5) 75%)",
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}