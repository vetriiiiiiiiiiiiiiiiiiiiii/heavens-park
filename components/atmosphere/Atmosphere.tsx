"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Lantern } from "./Lantern";

/**
 * Global lantern layer. Fixed to the page edges, pointer-events none,
 * drifts upward slightly with scroll (parallax) and swings slowly.
 * On small screens only two are rendered (CSS), with gentler motion.
 */
const LANTERNS = [
  { side: "left", x: "1.2vw", chain: 40, scale: 0.62, variant: "amber", depth: 0.18, swing: 7.5, delay: -1.2, mobile: true },
  { side: "left", x: "5.4vw", chain: 150, scale: 0.42, variant: "emerald", depth: 0.32, swing: 9.1, delay: -3.6, mobile: false },
  { side: "right", x: "1.6vw", chain: 90, scale: 0.55, variant: "ruby", depth: 0.24, swing: 8.3, delay: -0.4, mobile: true },
  { side: "right", x: "6vw", chain: 10, scale: 0.36, variant: "amber", depth: 0.4, swing: 10.4, delay: -5.1, mobile: false },
] as const;

export function LanternLayer() {
  const ref = useRef<HTMLDivElement>(null);
  const hidden = usePathname().startsWith("/admin");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--scroll", String(Math.min(window.scrollY, 1600)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (hidden) return null;
  return (
    <div ref={ref} className="lantern-layer" aria-hidden>
      {LANTERNS.map((l, i) => (
        <div
          key={i}
          className={`lantern ${l.mobile ? "" : "lantern--desktop"}`}
          style={
            {
              [l.side]: l.x,
              "--s": l.scale,
              "--depth": l.depth,
              "--swing": `${l.swing}s`,
              "--delay": `${l.delay}s`,
            } as React.CSSProperties
          }
        >
          <div className="lantern-swing">
            <Lantern uid={`g${i}`} chain={l.chain} variant={l.variant} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Smoke / haze: an SVG turbulence texture rendered once as an image,
 * then drifted with GPU transforms only — no per-frame filter work.
 */
export function Smoke({ className = "", density = 1 }: { className?: string; density?: number }) {
  return (
    <div className={`smoke ${className}`} aria-hidden style={{ "--density": density } as React.CSSProperties}>
      <div className="smoke-layer smoke-layer--a" />
      <div className="smoke-layer smoke-layer--b" />
    </div>
  );
}

/** Phones: the global layer is hidden; two small lanterns hang inside the hero instead and scroll away with it. */
export function HeroLanterns() {
  return (
    <div className="hero-lanterns" aria-hidden>
      <div className="hero-lantern" style={{ left: "7%" }}>
        <div className="lantern-swing" style={{ ["--swing" as string]: "12s" }}>
          <Lantern uid="m1" chain={70} variant="amber" />
        </div>
      </div>
      <div className="hero-lantern" style={{ right: "9%" }}>
        <div className="lantern-swing" style={{ ["--swing" as string]: "13s", ["--delay" as string]: "-4s" }}>
          <Lantern uid="m2" chain={20} variant="emerald" />
        </div>
      </div>
    </div>
  );
}
