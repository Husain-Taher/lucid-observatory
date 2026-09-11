"use client";

import React, { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX?: number;
  targetY?: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  label?: string;
}

interface ConstellationCanvasProps {
  onTransitionComplete?: () => void;
}

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({ onTransitionComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<"breathe" | "reorganize" | "ready">("breathe");
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate subtle constellation observation points
    const count = 48;
    const points: Point[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      points.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 1.2,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    const startTime = performance.now();

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby points with gentle bone/dust lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = (1.0 - dist / 120) * 0.18;
            ctx.strokeStyle = `rgba(233, 229, 218, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw points
      const elapsed = (time - startTime) * 0.001;
      const breathScale = 1.0 + Math.sin(elapsed * 0.6) * 0.04;

      for (const p of points) {
        if (phase === "breathe") {
          // Slow organic breathing
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        } else if (phase === "reorganize" && p.targetX !== undefined && p.targetY !== undefined) {
          // Gently interpolate toward the 4 pillars
          p.x += (p.targetX - p.x) * 0.05;
          p.y += (p.targetY - p.y) * 0.05;
        }

        ctx.fillStyle = `rgba(233, 229, 218, ${p.alpha * breathScale})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Oxide accent on select points
        if (p.size > 2.2) {
          ctx.fillStyle = `rgba(197, 106, 67, 0.45)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [phase]);

  const handleBeginObserving = () => {
    setPhase("reorganize");
    setTimeout(() => {
      setPhase("ready");
      if (onTransitionComplete) onTransitionComplete();
    }, 900);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-lucid-ink flex items-center justify-center select-none">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Editorial Constellation Overlay */}
      <div className="relative z-10 text-center max-w-xl px-6 flex flex-col items-center">
        <h1 className="font-editorial text-5xl md:text-6xl text-lucid-bone tracking-wide font-normal mb-3">
          LUCID
        </h1>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-lucid-stone mb-12">
          See the market clearly.
        </p>

        {showPrompt && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
            <div className="space-y-1">
              <p className="font-editorial text-2xl md:text-3xl text-lucid-bone">
                Good evening.
              </p>
              <p className="text-sm text-lucid-stone font-sans max-w-sm mx-auto">
                Let&apos;s make the market a little less mysterious.
              </p>
            </div>

            <button
              onClick={handleBeginObserving}
              className="mt-4 px-8 py-3.5 rounded-full border border-lucid-oxide/70 bg-lucid-ash/60 text-lucid-bone hover:border-lucid-oxide hover:bg-lucid-oxide/10 transition-all font-mono text-xs uppercase tracking-widest flex items-center gap-2 group cursor-pointer shadow-lg"
            >
              <span>Begin observing</span>
              <span className="text-lucid-oxide group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <div className="mt-8 flex items-center gap-8 text-[11px] font-mono text-lucid-stone/60 uppercase tracking-widest">
              <span>SEE IT</span>
              <span>·</span>
              <span>READ THE ROOM</span>
              <span>·</span>
              <span>PRACTICE IT</span>
              <span>·</span>
              <span>REFLECT</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
