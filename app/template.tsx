"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePageMotion } from "@/components/motion/Motion";

/**
 * Arch transition: each new page opens through a pointed arch that grows
 * from the centre of an emerald veil until it frames the whole screen.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const veil = useRef<SVGSVGElement>(null);
  const [done, setDone] = useState(false);
  usePageMotion();

  useEffect(() => {
    const v = veil.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setDone(true);
    const hole = v.querySelector(".veil-hole");
    const line = v.querySelector(".veil-line");
    const star = v.querySelector(".veil-star");
    const tl = gsap.timeline({ onComplete: () => setDone(true) });
    tl.fromTo(star, { scale: 0, rotate: -90, transformOrigin: "50% 50%" }, { scale: 1, rotate: 0, duration: 0.45, ease: "back.out(2)" })
      .fromTo([hole, line], { scale: 0.02, svgOrigin: "50 62" }, { scale: 14, svgOrigin: "50 62", duration: 1.25, ease: "expo.inOut" }, 0.15)
      .to(star, { opacity: 0, duration: 0.3 }, 0.35)
      .to(line, { opacity: 0, duration: 0.5 }, 0.9);
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <div className="page-enter">{children}</div>
      {!done && (
        <svg ref={veil} className="veil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <mask id="veil-mask" maskUnits="userSpaceOnUse" x="-500" y="-500" width="1100" height="1100">
              <rect x="-500" y="-500" width="1100" height="1100" fill="white" />
              <path className="veil-hole" d="M42 70V56c0-5 4-9 8-11.5 4 2.5 8 6.5 8 11.5v14z" fill="black" />
            </mask>
          </defs>
          <rect x="-500" y="-500" width="1100" height="1100" fill="#063C30" mask="url(#veil-mask)" />
          <path className="veil-line" d="M42 70V56c0-5 4-9 8-11.5 4 2.5 8 6.5 8 11.5v14" fill="none" stroke="#C5A15B" strokeWidth=".25" />
          <g className="veil-star" transform="translate(50 40)" fill="none" stroke="#C5A15B" strokeWidth=".35">
            <rect x="-2" y="-2" width="4" height="4" />
            <rect x="-2" y="-2" width="4" height="4" transform="rotate(45)" />
          </g>
        </svg>
      )}
    </>
  );
}
