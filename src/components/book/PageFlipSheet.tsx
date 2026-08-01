import { AnimatePresence, motion } from "framer-motion";
import paper from "@/assets/paper.jpg";

interface PageFlipSheetProps {
  flipKey: number;
  direction: "next" | "prev";
}

/**
 * Placeholder turning sheet. A real paper leaf rotates over the gutter with a
 * bending highlight; swapping in react-pageflip replaces only this component.
 */
export function PageFlipSheet({ flipKey, direction }: PageFlipSheetProps) {
  const next = direction === "next";
  return (
    <AnimatePresence>
      {flipKey > 0 && (
        <motion.div
          key={flipKey}
          aria-hidden
          className="gpu pointer-events-none absolute inset-y-0 hidden w-1/2 md:block"
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
          transition={{ duration: 1.05, ease: [0.32, 0, 0.2, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.05 }}
            animate={{ opacity: [0.05, 0.45, 0.05] }}
            transition={{ duration: 1.05 }}
            style={{
              background: next
                ? "linear-gradient(to left, oklch(0.2 0.03 45 / 0.55), transparent 60%)"
                : "linear-gradient(to right, oklch(0.2 0.03 45 / 0.55), transparent 60%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}