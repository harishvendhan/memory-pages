import type { ReactNode } from "react";
import woodTable from "@/assets/wood-table.jpg";
import { DustParticles } from "./DustParticles";
import { HeartBubbles } from "./HeartBubbles";

/** The dark room: wooden table, candle glow, romantic heart bubbles, dust and vignette. */
export function RoomBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${woodTable})`, filter: "brightness(0.55) saturate(0.9)" }}
        aria-hidden
      />
      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-room)" }} aria-hidden />
      <div
        className="animate-candle absolute left-1/2 top-[-14rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.15 75 / 0.35), oklch(0.85 0.15 75 / 0.08) 45%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 35%, oklch(0.08 0.02 50 / 0.85) 100%)",
        }}
        aria-hidden
      />
      <DustParticles />
      <HeartBubbles />
      <div className="relative z-10">{children}</div>
    </div>
  );
}