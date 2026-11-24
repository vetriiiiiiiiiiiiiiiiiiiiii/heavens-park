"use client";

import { useEffect, useRef } from "react";

/**
 * Rising steam — a small canvas of soft, slowly expanding wisps.
 * - Only runs while on screen (IntersectionObserver)
 * - Disabled for reduced motion and on coarse-pointer / small screens
 * - Intensifies when the parent `.steam-host` is hovered
 */
export function Steam({ className = "", origin = 0.5, spread = 0.35 }: { className?: string; origin?: number; spread?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    if (reduce || small) return;

    const ctx = canvas.getContext("2d")!;
    const host = canvas.closest(".steam-host") as HTMLElement | null;
    let w = 0,
      h = 0,
      raf = 0,
      running = false,
      hot = false,
      last = performance.now(),
      acc = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // pre-rendered soft puff sprite
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sc = sprite.getContext("2d")!;
    const g = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,248,235,0.55)");
    g.addColorStop(0.5, "rgba(255,245,230,0.18)");
    g.addColorStop(1, "rgba(255,245,230,0)");
    sc.fillStyle = g;
    sc.fillRect(0, 0, 64, 64);

    type P = { x: number; y: number; r: number; life: number; max: number; vx: number; vy: number; seed: number };
    const ps: P[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = () => {
      ps.push({
        x: w * origin + (Math.random() - 0.5) * w * spread,
        y: h * 0.98,
        r: 10 + Math.random() * 14,
        life: 0,
        max: 3.2 + Math.random() * 2.4,
        vx: (Math.random() - 0.5) * 6,
        vy: -(14 + Math.random() * 16),
        seed: Math.random() * 1000,
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt * (hot ? 9 : 4.5);
      while (acc > 1) {
        spawn();
        acc -= 1;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life += dt;
        const k = p.life / p.max;
        if (k >= 1) {
          ps.splice(i, 1);
          continue;
        }
        // curling drift
        p.x += (p.vx + Math.sin(p.seed + p.life * 1.6) * 10) * dt;
        p.y += p.vy * dt;
        p.vy *= 0.995;
        const r = p.r * (1 + k * 3.2);
        const a = Math.sin(Math.PI * k) * (hot ? 0.34 : 0.22);
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    const on = () => (hot = true);
    const off = () => (hot = false);
    host?.addEventListener("pointerenter", on);
    host?.addEventListener("pointerleave", off);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host?.removeEventListener("pointerenter", on);
      host?.removeEventListener("pointerleave", off);
    };
  }, [origin, spread]);

  return <canvas ref={ref} className={`steam ${className}`} aria-hidden />;
}
