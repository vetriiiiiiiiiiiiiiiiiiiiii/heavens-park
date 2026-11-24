"use client";

/**
 * MOTION DIRECTOR
 * One place that choreographs the whole site with GSAP + ScrollTrigger,
 * on top of Lenis smooth scrolling. Rebuilt per route and per language;
 * fully disabled for prefers-reduced-motion. Pieces:
 *   - smooth scroll (desktop pointers only)
 *   - hero: letter-by-letter entrance after the Bismillah, scroll parallax
 *   - [data-split] headings: words rise out of a mask
 *   - photos: wipe-up reveal + slow parallax inside the frame
 *   - calligraphy watermarks drift; girih friezes slide with scroll
 *   - horseshoe arch draws itself; the hadith is revealed right → left
 *   - signature dishes ride a pinned horizontal rail
 *   - lanterns swing harder when you scroll fast (elastic settle)
 *   - header tucks away on scroll down, returns on scroll up
 *   - cursor ring + magnetic primary buttons
 */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useLang } from "@/components/i18n/LangProvider";

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __gsap: unknown }).__gsap = { gsap, ScrollTrigger };
}

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;

let lenis: Lenis | null = null;

export function MotionDirector() {
  const pathname = usePathname();
  const { lang } = useLang();
  const [cursor, setCursor] = useState(false);
  useEffect(() => setCursor(finePointer() && !reduced()), []);

  /* ── global: smooth scroll, header, lanterns ─────────────── */
  useEffect(() => {
    if (reduced()) return;
    const html = document.documentElement;
    html.classList.add("motion-on");
    // a reload always starts at the door, so the entrance choreography plays
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    if (finePointer()) {
      lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true, anchors: { offset: -130 } });
      lenis.on("scroll", ScrollTrigger.update);
      // pinned sections change the page height — keep Lenis's scroll limit in sync
      const resize = () => lenis?.resize();
      ScrollTrigger.addEventListener("refresh", resize);
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // pause smooth scroll while intro / overlays lock the page
      const mo = new MutationObserver(() => {
        const locked = html.classList.contains("intro-lock") || html.classList.contains("nav-lock");
        if (locked) lenis?.stop();
        else lenis?.start();
      });
      mo.observe(html, { attributes: true, attributeFilter: ["class"] });

      return () => {
        ScrollTrigger.removeEventListener("refresh", resize);
        mo.disconnect();
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = null;
        html.classList.remove("motion-on");
      };
    }
    return () => html.classList.remove("motion-on");
  }, []);

  // lanterns react to scroll velocity; header hides on the way down
  useEffect(() => {
    if (reduced()) return;
    const header = document.querySelector<HTMLElement>(".site-header");
    const svgs = gsap.utils.toArray<SVGElement>(".lantern .lantern-svg");
    const rot = svgs.map((s) => {
      gsap.set(s, { transformOrigin: "60px 0px" });
      return gsap.quickTo(s, "rotation", { duration: 1.6, ease: "elastic.out(1, 0.25)" });
    });
    let settle: number | undefined;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const v = self.getVelocity();
        const angle = gsap.utils.clamp(-9, 9, v / 260);
        rot.forEach((r, i) => r(angle * (i % 2 ? -0.8 : 1)));
        window.clearTimeout(settle);
        settle = window.setTimeout(() => rot.forEach((r) => r(0)), 140);
        if (header && !document.documentElement.classList.contains("nav-lock")) {
          header.classList.toggle("is-tucked", self.direction === 1 && self.scroll() > 520);
        }
      },
    });
    return () => {
      st.kill();
      window.clearTimeout(settle);
    };
  }, [pathname]);

  return cursor ? <Cursor /> : null;
}

/* ── Cursor ring + magnetic buttons ───────────────────────── */
function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const arch = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced() || !ring.current || !arch.current || !dustRef.current) return;
    const html = document.documentElement;
    html.classList.add("has-arabic-cursor");
    const r = ring.current;
    const xr = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const yr = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });
    const tilt = gsap.quickTo(arch.current, "rotation", { duration: 0.6, ease: "power3" });

    // gold dust: a small pool of stars shed along fast strokes
    const dust = Array.from(dustRef.current.children) as HTMLElement[];
    let di = 0;
    let travelled = 0;
    let lx = -1;
    let ly = -1;

    const move = (e: PointerEvent) => {
      xr(e.clientX);
      yr(e.clientY);
      if (lx >= 0) {
        const dx = e.clientX - lx;
        const dy = e.clientY - ly;
        tilt(gsap.utils.clamp(-14, 14, dx * 0.6));
        travelled += Math.hypot(dx, dy);
        if (travelled > 46) {
          travelled = 0;
          const d = dust[di++ % dust.length];
          gsap.fromTo(
            d,
            { x: e.clientX, y: e.clientY, scale: gsap.utils.random(0.6, 1.1), rotate: 0, opacity: 0.95 },
            { x: `+=${gsap.utils.random(-10, 10)}`, y: `+=${gsap.utils.random(12, 28)}`, rotate: 90, scale: 0.1, opacity: 0, duration: gsap.utils.random(0.7, 1.1), ease: "power2.out", overwrite: true },
          );
        }
      }
      lx = e.clientX;
      ly = e.clientY;

      const t = e.target as HTMLElement;
      const field = t.closest("input, textarea, select");
      const media = !field && t.closest(".photo, .steam-host, .gallery-item, .sig-card");
      const link = !field && !media && t.closest("a, button, label, [role='button']");
      r.classList.toggle("is-link", !!link);
      r.classList.toggle("is-media", !!media);
      r.classList.toggle("is-field", !!field);
      r.classList.add("is-on");
    };
    const settle = () => tilt(0);
    let settleT: number | undefined;
    const moveSettle = () => {
      window.clearTimeout(settleT);
      settleT = window.setTimeout(settle, 120);
    };
    const leave = () => r.classList.remove("is-on");
    const down = () => r.classList.add("is-down");
    const up = () => r.classList.remove("is-down");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointermove", moveSettle);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    // magnetic primary buttons
    const btnMove = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>(".btn-arch, .sound-toggle, .intro-enter");
      document.querySelectorAll<HTMLElement>(".is-magnet").forEach((m) => {
        if (m !== b) {
          m.classList.remove("is-magnet");
          gsap.to(m, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
        }
      });
      if (!b) return;
      const rect = b.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      b.classList.add("is-magnet");
      gsap.to(b, { x: dx * 0.28, y: dy * 0.38, duration: 0.5, ease: "power3.out" });
    };
    window.addEventListener("pointermove", btnMove);

    return () => {
      html.classList.remove("has-arabic-cursor");
      window.clearTimeout(settleT);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointermove", moveSettle);
      window.removeEventListener("pointermove", btnMove);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <>
      {/* trailing pointed-arch frame */}
      <div ref={ring} className="cursor-ring" aria-hidden>
        <div ref={arch} className="cursor-arch">
          <svg viewBox="0 0 44 58" width="44" height="58">
            <path className="cursor-arch-fill" d="M4 57V24C4 13 13 6 22 2c9 4 18 11 18 22v33z" />
            <path className="cursor-arch-shadow" d="M4 57V24C4 13 13 6 22 2c9 4 18 11 18 22v33" />
            <path className="cursor-arch-line" d="M4 57V24C4 13 13 6 22 2c9 4 18 11 18 22v33" />
            <path className="cursor-arch-inner" d="M10 57V26c0-7 6-12 12-15 6 3 12 8 12 15v31" />
          </svg>
          <span className="cursor-label">
            <span className="cursor-label-ar" lang="ar">
              عرض
            </span>
            <span className="cursor-label-en">View</span>
          </span>
        </div>
      </div>
      {/* gold dust */}
      <div ref={dustRef} className="cursor-dust-pool" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <svg key={i} className="cursor-dust" viewBox="-6 -6 12 12" width="9" height="9">
            <rect x="-3.4" y="-3.4" width="6.8" height="6.8" />
            <rect x="-3.4" y="-3.4" width="6.8" height="6.8" transform="rotate(45)" />
          </svg>
        ))}
      </div>
    </>
  );
}

/**
 * Per-page choreography. Called from app/template.tsx so it runs only after
 * the page subtree has hydrated (template effects fire after their children).
 */
export function usePageMotion() {
  const pathname = usePathname();
  const { lang } = useLang();
  useEffect(() => {
    if (reduced()) return;
    lenis?.scrollTo(0, { immediate: true });
    const rtl = lang === "ar";
    const dir = rtl ? -1 : 1;
    let ctx: gsap.Context | undefined;

    // timer, not rAF: background tabs never fire rAF, and setup must not wait for visibility
    const raf = window.setTimeout(() => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        /* HERO ------------------------------------------------- */
        const hero = document.querySelector<HTMLElement>(".hero");
        if (hero) {
          const chars = hero.querySelectorAll(".hero-title .swi, .hero-title .sc");
          const lead = hero.querySelectorAll(".hero-welcome, .hero-tag, .hero-desc, .hero-cta > *");
          const calli = hero.querySelector(".hero-calli");
          gsap.set(chars, { yPercent: 120, rotateX: -70, opacity: 0 });
          gsap.set(lead, { y: 30, opacity: 0 });
          if (calli) gsap.set(calli, { opacity: 0, scale: 0.92, filter: "blur(8px)" });

          const play = () => {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            tl.to(".hero-welcome", { y: 0, opacity: 1, duration: 1.2 }, 0)
              .to(chars, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.5, stagger: 0.055 }, 0.15)
              .to([".hero-tag", ".hero-desc"], { y: 0, opacity: 1, duration: 1.2, stagger: 0.12 }, 0.75)
              .to(".hero-cta > *", { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, 1)
              .to(calli, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2.2, ease: "power2.out" }, 0.6);
          };
          if (document.documentElement.dataset.intro === "show") {
            window.addEventListener("hp:intro-leave", play, { once: true });
          } else play();

          // scroll: the room recedes, the words lift away
          gsap.to(".hero-photo", { scale: 1.18, yPercent: 10, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
          gsap.to(".hero-content", { y: () => -window.innerHeight * 0.18, opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "35% top", end: "bottom top", scrub: true } });
          if (calli) gsap.to(calli, { y: () => -window.innerHeight * 0.3, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
          gsap.to(".mashrabiya", { yPercent: -12, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
        }

        /* INNER PAGE HERO -------------------------------------- */
        const phero = document.querySelector<HTMLElement>(".phero");
        if (phero) {
          gsap.from(phero.querySelectorAll(".phero-title .swi"), { yPercent: 120, opacity: 0, duration: 1.4, stagger: 0.07, ease: "expo.out", delay: 0.55 });
          gsap.from(phero.querySelectorAll(".phero-ar, .eyebrow"), { y: 20, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", delay: 0.4 });
          gsap.to(".phero-photo", { scale: 1.15, yPercent: 12, ease: "none", scrollTrigger: { trigger: phero, start: "top top", end: "bottom top", scrub: true } });
        }

        /* SPLIT HEADINGS --------------------------------------- */
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          gsap.from(el.querySelectorAll(".swi"), {
            yPercent: 115,
            rotate: 4 * dir,
            opacity: 0,
            duration: 1.3,
            stagger: 0.06,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });

        /* ARABESQUES draw outward from the central star ------- */
        gsap.utils.toArray<HTMLElement>(".arabesque--title").forEach((a) => {
          ScrollTrigger.create({ trigger: a, start: "top 92%", once: true, onEnter: () => a.classList.add("is-drawn") });
        });

        /* DALLAH: drawn stroke by stroke ------------------------ */
        const dallah = document.querySelectorAll<SVGPathElement>(".hosp-dallah path");
        if (dallah.length) {
          dallah.forEach((p) => p.setAttribute("pathLength", "1"));
          gsap.fromTo(dallah, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: ".hosp-dallah", start: "top 85%" } });
        }

        /* PHOTOS ----------------------------------------------- */
        gsap.utils.toArray<HTMLElement>(".photo").forEach((ph) => {
          if (ph.closest(".hero, .phero, .lightbox, .sig-rail, .menu-peek")) return;
          const img = ph.querySelector(".photo-img");
          gsap.fromTo(
            ph,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: ph, start: "top 88%" } },
          );
          if (img) {
            gsap.fromTo(img, { scale: 1.3 }, { scale: 1.08, duration: 1.9, ease: "expo.out", scrollTrigger: { trigger: ph, start: "top 88%" } });
            gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: ph, start: "top bottom", end: "bottom top", scrub: true } });
          }
        });

        /* CALLIGRAPHY WATERMARKS ------------------------------- */
        gsap.utils.toArray<HTMLElement>(".calli").forEach((c) => {
          const center = c.classList.contains("calli--center");
          gsap.set(c, { yPercent: -50, xPercent: center ? -50 : 0 });
          gsap.fromTo(c, { x: () => -window.innerWidth * 0.06 * dir }, { x: () => window.innerWidth * 0.06 * dir, ease: "none", scrollTrigger: { trigger: c.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.from(c, { opacity: 0, scale: 0.9, duration: 2, ease: "power2.out", scrollTrigger: { trigger: c.parentElement, start: "top 80%" } });
        });

        /* GIRIH FRIEZES slide with scroll ---------------------- */
        gsap.utils.toArray<HTMLElement>(".girih-band svg").forEach((svg, i) => {
          gsap.fromTo(svg, { x: 0 }, { x: (i % 2 ? 1 : -1) * 176, ease: "none", scrollTrigger: { trigger: svg, start: "top bottom", end: "bottom top", scrub: true } });
        });

        /* HOSPITALITY: arch draws, hadith written right → left -- */
        const hosp = document.querySelector<HTMLElement>(".hosp");
        if (hosp) {
          const paths = hosp.querySelectorAll<SVGPathElement>(".horseshoe path");
          paths.forEach((p) => p.setAttribute("pathLength", "1"));
          gsap.fromTo(paths, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, stagger: 0.15, ease: "power2.inOut", scrollTrigger: { trigger: hosp, start: "top 70%" } });
          gsap.from(hosp.querySelectorAll(".horseshoe g"), { scale: 0, rotate: 90, transformOrigin: "50% 50%", duration: 1.4, ease: "back.out(2)", delay: 1.4, scrollTrigger: { trigger: hosp, start: "top 70%" } });
          gsap.fromTo(".hosp-ar", { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 2.4, ease: "power2.inOut", scrollTrigger: { trigger: ".hosp-ar", start: "top 80%" } });
          gsap.from([".hosp-en", ".hosp-quote cite"], { y: 24, opacity: 0, duration: 1.4, stagger: 0.2, delay: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".hosp-ar", start: "top 80%" } });
        }

        /* SIGNATURE RAIL: pinned horizontal ride on desktop ---- */
        mm.add("(min-width: 1024px)", () => {
          const wrap = document.querySelector<HTMLElement>(".sig-rail-wrap");
          const rail = document.querySelector<HTMLElement>(".sig-rail");
          if (!wrap || !rail) return;
          const distance = () => rail.scrollWidth - window.innerWidth;
          const tween = gsap.to(rail, {
            x: () => -distance() * dir,
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
          });
          gsap.utils.toArray<HTMLElement>(".sig-rail .photo-img").forEach((img) => {
            gsap.fromTo(img, { xPercent: -8 * dir, scale: 1.18 }, { xPercent: 8 * dir, scale: 1.18, ease: "none", scrollTrigger: { trigger: img.closest(".sig-card"), containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
          });
          const bar = document.querySelector<HTMLElement>(".sig-rail-progress span");
          if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: wrap, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        });

        /* SIGNATURE LEAD ----------------------------------------- */
        gsap.from(".sig-lead-text > *", { y: 40, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".sig-lead", start: "top 70%" } });

        /* MARQUEE: speed follows the scroll -------------------- */
        gsap.utils.toArray<HTMLElement>(".marquee-track").forEach((track, i) => {
          const reverse = i % 2 === 0; // Arabic row (first) glides rightward, as Arabic reads
          const loop = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: 38, ease: "none", repeat: -1 });
          ScrollTrigger.create({
            trigger: track,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 7);
              gsap.to(loop, { timeScale: boost * (self.direction === 1 ? 1 : -1), duration: 0.25, overwrite: true });
              gsap.to(loop, { timeScale: self.direction === 1 ? 1 : -1, duration: 1.2, delay: 0.25, overwrite: false });
            },
          });
        });

        /* STAGGERED GROUPS ------------------------------------- */
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((g) => {
          gsap.from(g.children, { y: 36, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: g, start: "top 85%" } });
        });

        /* FOOTER GIANT WORDMARK -------------------------------- */
        const giant = document.querySelector<HTMLElement>(".footer-giant");
        if (giant) {
          gsap.from(giant.querySelectorAll(".sc, .swi"), { yPercent: 110, duration: 1.6, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: giant, start: "top 95%" } });
        }

        ScrollTrigger.refresh();
      });
    });

    // images & fonts change heights after load — keep triggers honest
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    const t = window.setTimeout(refresh, 1500);

    return () => {
      window.clearTimeout(raf);
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx?.revert();
    };
  }, [pathname, lang]);

}
