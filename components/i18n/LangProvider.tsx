"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Bi } from "@/content/restaurant";

export type Lang = "en" | "ar";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (b: Bi) => string; dir: "ltr" | "rtl" };

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ initial, children }: { initial: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.cookie = `hp_lang=${l}; path=/; max-age=31536000; samesite=lax`;
    try {
      localStorage.setItem("hp_lang", l);
    } catch {}
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = useCallback((b: Bi) => b[lang] || b.en, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const c = useContext(LangContext);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}

/** Inline bilingual text: <T en="..." ar="..." /> */
export function T({ en, ar }: Bi) {
  const { lang } = useLang();
  return <>{lang === "ar" ? ar : en}</>;
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className={`lang-toggle ${className}`}
      aria-label={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
    >
      <span className={lang === "en" ? "is-on" : ""}>EN</span>
      <span aria-hidden className="lang-sep" />
      <span className={`font-arabic ${lang === "ar" ? "is-on" : ""}`}>عربي</span>
    </button>
  );
}
