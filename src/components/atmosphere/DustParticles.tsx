import { useEffect, useMemo, useState } from "react";

interface DustParticlesProps {
  count?: number;
}

/** Floating dust motes drifting through the candlelight. Pure CSS, GPU friendly. */
export function DustParticles({ count = 34 }: DustParticlesProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 3,
        delay: Math.random() * 24,
        duration: 22 + Math.random() * 26,
        drift: `${(Math.random() - 0.5) * 160}px`,
        opacity: 0.15 + Math.random() * 0.45,
      })),
    [count],
  );

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {motes.map((m) => (
        <span
          key={m.id}
          className="gpu absolute bottom-[-10vh] rounded-full bg-candle"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            filter: "blur(0.4px)",
            animation: `dust-drift ${m.duration}s linear ${m.delay}s infinite`,
            ["--dust-x" as string]: m.drift,
            ["--dust-opacity" as string]: m.opacity,
          }}
        />
      ))}
    </div>
  );
}