import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function Scene8Petals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Rose Petals & Butterflies
    const PETAL_COUNT = 35;
    const petals = Array.from({ length: PETAL_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      size: Math.random() * 12 + 8,
      vx: Math.random() * 1.5 - 0.75,
      vy: Math.random() * 2.0 + 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      color: Math.random() > 0.4 ? "rgba(180, 30, 60, 0.85)" : "rgba(220, 90, 115, 0.75)",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of petals) {
        p.x += p.vx + Math.sin(p.rotation) * 0.8;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw Petal Shape
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.ellipse(0, 0, p.size * 0.6, p.size, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />

      {/* Floating Golden Butterflies / Fireflies */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <span className="text-3xl animate-bounce">🦋</span>
        </div>
      </motion.div>
    </div>
  );
}
