"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { bismillah } from "@/content/quotes";
import { useAmbientAudio } from "@/components/audio/AudioProvider";
import { useLang } from "@/components/i18n/LangProvider";
import { Lantern } from "@/components/atmosphere/Lantern";
import { Smoke } from "@/components/atmosphere/Atmosphere";

const SEEN_KEY = "hp_intro_seen";
export const REPLAY_EVENT = "hp:replay-intro";

export function replayIntro() {
  window.dispatchEvent(new Event(REPLAY_EVENT));
}

/**
 * Opening film: emerald dark → haze → lanterns → light → Bismillah →
 * translation → ENTER. ~5s, skippable at any moment, shown once per
 * visitor (localStorage), replayable from the footer.
 * Visibility before hydration is governed by html[data-intro] (set by an
 * inline script in <head>) so returning visitors never see a flash.
 */
export function Intro() {
  const [state, setState] = useState<"hidden" | "playing" | "leaving">("hidden");
  const { start } = useAmbientAudio();
  const { lang } = useLang();
  const isAdmin = usePathname().startsWith("/admin");

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (!seen && !window.location.pathname.startsWith("/admin")) setState("playing");
    const replay = () => {
      window.scrollTo({ top: 0 });
      document.documentElement.dataset.intro = "show";
      setState("playing");
    };
    window.addEventListener(REPLAY_EVENT, replay);
    return () => window.removeEventListener(REPLAY_EVENT, replay);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("intro-lock", state === "playing");
  }, [state]);

  const close = useCallback(
    (withSound: boolean) => {
      if (withSound) start();
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setState("leaving");
      window.dispatchEvent(new Event("hp:intro-leave"));
      window.setTimeout(() => {
        setState("hidden");
        document.documentElement.dataset.intro = "seen";
      }, 1400);
    },
    [start],
  );

  useEffect(() => {
    if (state !== "playing") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close]);

  if (state === "hidden" || isAdmin) return null;

  return (
    <div
      className={`intro ${state === "leaving" ? "intro--leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Bismillah — welcome to Heavens Park"
    >
      <div className="intro-bg" />
      <Smoke className="intro-smoke" density={1.2} />

      <div className="intro-lanterns" aria-hidden>
        <div className="intro-lantern" style={{ left: "12%", ["--d" as string]: "0.6s", ["--s" as string]: 0.8 }}>
          <div className="lantern-swing" style={{ ["--swing" as string]: "8s" }}>
            <Lantern uid="i1" chain={60} variant="amber" />
          </div>
        </div>
        <div className="intro-lantern" style={{ left: "26%", ["--d" as string]: "1.0s", ["--s" as string]: 0.55 }}>
          <div className="lantern-swing" style={{ ["--swing" as string]: "9.5s" }}>
            <Lantern uid="i2" chain={180} variant="emerald" />
          </div>
        </div>
        <div className="intro-lantern" style={{ right: "14%", ["--d" as string]: "0.8s", ["--s" as string]: 0.72 }}>
          <div className="lantern-swing" style={{ ["--swing" as string]: "8.8s" }}>
            <Lantern uid="i3" chain={110} variant="ruby" />
          </div>
        </div>
        <div className="intro-lantern" style={{ right: "29%", ["--d" as string]: "1.2s", ["--s" as string]: 0.46 }}>
          <div className="lantern-swing" style={{ ["--swing" as string]: "10s" }}>
            <Lantern uid="i4" chain={30} variant="amber" />
          </div>
        </div>
      </div>

      <div className="intro-light" aria-hidden />

      <div className="intro-content">
        <p className="intro-bismillah" lang="ar" dir="rtl">
          {bismillah.ar}
        </p>
        <p className="intro-translation">{bismillah.en}</p>
        <button type="button" data-intro-enter className="intro-enter" onClick={() => close(true)}>
          <span>{lang === "ar" ? "ادخل التجربة" : "Enter the experience"}</span>
        </button>
        <p className="intro-note">{lang === "ar" ? "مع موسيقى العود" : "with music · headphones welcome"}</p>
      </div>

      <button type="button" className="intro-skip" onClick={() => close(false)}>
        {lang === "ar" ? "تخطّي المقدمة" : "Skip intro"}
      </button>
    </div>
  );
}
