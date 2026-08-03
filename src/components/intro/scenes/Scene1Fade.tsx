import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function Scene1Fade() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 60 FPS Golden dust & twinkling stars canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const PARTICLE_COUNT = 65;
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity =
          p.opacity * (0.6 + 0.4 * Math.sin(p.pulsePhase));

        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 2.4,
        );
        grad.addColorStop(0, `rgba(245, 215, 130, ${currentOpacity})`);
        grad.addColorStop(0.5, `rgba(212, 175, 55, ${currentOpacity * 0.5})`);
        grad.addColorStop(1, "rgba(212, 175, 55, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 1.02 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        className="relative z-10 text-center px-6 max-w-xl"
      >
        <div className="mb-4 font-display text-2xl text-[#d4af37]/80 select-none">
          ✦
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal italic tracking-wide text-[#f5ebd7] drop-shadow-[0_2px_14px_rgba(212,175,55,0.45)]">
          &ldquo;Close your eyes for a moment...&rdquo;
        </h1>
        <div className="mx-auto mt-4 flex items-center justify-center gap-3 opacity-40">
          <span className="h-px w-16 bg-[#d4af37]" />
          <span className="font-display text-[0.6rem] text-[#d4af37]">❖</span>
          <span className="h-px w-16 bg-[#d4af37]" />
        </div>
      </motion.div>
    </div>
  );
}
