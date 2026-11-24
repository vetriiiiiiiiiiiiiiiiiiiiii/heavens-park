"use client";

import { useEffect } from "react";

/** One observer for the whole page: elements with [data-reveal] fade up once. */
export function RevealObserver() {
  useEffect(() => {
    const els = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els().forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => els().forEach((e) => io.observe(e));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
