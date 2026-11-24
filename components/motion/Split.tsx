"use client";

import { useLang } from "@/components/i18n/LangProvider";

/**
 * React-owned text splitting (safe across re-renders and language changes —
 * we never mutate React's text nodes from GSAP).
 * Words are split for Arabic so letters keep their joins.
 */
export function Split({ text, by = "word", className = "" }: { text: string; by?: "word" | "char"; className?: string }) {
  const parts = text.split(/(\s+)/).filter((p) => p.length);
  return (
    <span className={`split ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="split-vis">
        {parts.map((p, i) =>
          /^\s+$/.test(p) ? (
            <span key={i} className="ssp">
              {" "}
            </span>
          ) : (
            <span key={i} className="sw">
              <span className="swi">
                {by === "char"
                  ? Array.from(p).map((c, j) => (
                      <span key={j} className="sc">
                        {c}
                      </span>
                    ))
                  : p}
              </span>
            </span>
          ),
        )}
      </span>
    </span>
  );
}

/** Bilingual split: <ST en="…" ar="…" /> — Arabic always by word. */
export function ST({ en, ar, by = "word" }: { en: string; ar: string; by?: "word" | "char" }) {
  const { lang } = useLang();
  const text = lang === "ar" ? ar : en;
  if (!text) return null;
  return <Split text={text} by={lang === "ar" ? "word" : by} />;
}
