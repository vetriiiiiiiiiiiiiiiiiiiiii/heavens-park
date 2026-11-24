"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { restaurant, telLink, waLink } from "@/content/restaurant";
import { quotes } from "@/content/quotes";
import { useLang } from "@/components/i18n/LangProvider";
import { replayIntro } from "@/components/intro/Intro";
import { Rule, Star8 } from "@/components/ui/Ornament";
import { NAV, Wordmark } from "./Header";
import { Split } from "@/components/motion/Split";
import { Arabesque, hijri, num } from "@/components/ui/Arabic";

export function HoursList({ className = "" }: { className?: string }) {
  const { t, lang } = useLang();
  return (
    <dl className={`hours ${className}`}>
      {restaurant.hours.map((h) => (
        <div key={h.days.en}>
          <dt>{t(h.days)}</dt>
          <dd dir="ltr">
            {num(h.open, lang)} – {num(h.close === "23:59" ? "00:00" : h.close, lang)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Newsletter() {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  return (
    <form
      className="newsletter"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy");
        try {
          const r = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
          const j = await r.json();
          if (!r.ok) throw new Error(j.error || "Error");
          setState("ok");
          setMsg(lang === "ar" ? "شكراً لك — سنكتب إليك قريباً." : "Thank you — we'll write when the season turns.");
          setEmail("");
        } catch (err) {
          setState("err");
          setMsg(err instanceof Error ? err.message : "Error");
        }
      }}
    >
      <label htmlFor="nl-email" className="eyebrow">
        {lang === "ar" ? "رسائل من الفناء" : "Letters from the courtyard"}
      </label>
      <div className="newsletter-row">
        <input
          id="nl-email"
          type="email"
          required
          placeholder={lang === "ar" ? "بريدك الإلكتروني" : "Your email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <button type="submit" disabled={state === "busy"}>
          {state === "busy" ? "…" : lang === "ar" ? "اشترك" : "Subscribe"}
        </button>
      </div>
      <p className={`form-msg ${state === "err" ? "is-err" : ""}`} aria-live="polite">
        {msg}
      </p>
    </form>
  );
}

function TodayHijri() {
  const { lang } = useLang();
  const [label, setLabel] = useState("");
  useEffect(() => {
    const d = new Date();
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    setLabel(hijri(iso, lang));
  }, [lang]);
  if (!label) return null;
  return (
    <span className="footer-hijri" lang={lang}>
      {label}
    </span>
  );
}

export function Footer() {
  const pathname = usePathname();
  const { t, lang } = useLang();
  if (pathname.startsWith("/admin")) return null;
  const q = quotes.foodShared;
  return (
    <footer className="site-footer">
      <div className="footer-arch" aria-hidden />
      <Arabesque className="footer-arabesque" />
      <div className="footer-quote" data-reveal>
        <p className="footer-quote-ar" lang="ar" dir="rtl">
          {q.ar}
        </p>
        {lang === "en" && <p className="footer-quote-en">“{q.en}”</p>}
        <cite>{t(q.source)}</cite>
      </div>

      <Rule className="text-gold/60 my-14" wide />

      <div className="footer-grid" data-stagger>
        <div className="footer-brand">
          <Wordmark />
          <p>
            {lang === "ar"
              ? "الضيف عندنا ربّ البيت. تعال كما أنت، واجلس ما شئت، وغادر وقد صرت من الأهل."
              : "Here the guest is master of the house. Come as you are, stay as long as you like, leave as family."}
          </p>
          <div className="footer-social">
            {restaurant.social.instagram && (
              <a href={restaurant.social.instagram} target="_blank" rel="noopener">
                Instagram
              </a>
            )}
            {restaurant.social.facebook && (
              <a href={restaurant.social.facebook} target="_blank" rel="noopener">
                Facebook
              </a>
            )}
            <a href={waLink()} target="_blank" rel="noopener">
              WhatsApp
            </a>
          </div>
        </div>

        <nav aria-label="Footer" className="footer-col">
          <h3 className="eyebrow">{lang === "ar" ? "روابط" : "Explore"}</h3>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{t(n.label)}</Link>
              </li>
            ))}
            <li>
              <Link href="/reservations">{lang === "ar" ? "الحجوزات" : "Reservations"}</Link>
            </li>
            <li>
              <Link href="/reservations/manage">{lang === "ar" ? "إدارة حجزك" : "Manage a booking"}</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-col">
          <h3 className="eyebrow">{lang === "ar" ? "ساعات العمل" : "Hours"}</h3>
          <HoursList />
        </div>

        <div className="footer-col">
          <h3 className="eyebrow">{lang === "ar" ? "زورونا" : "Visit"}</h3>
          <address>
            {t(restaurant.address.line1)}
            <br />
            {t(restaurant.address.line2)}
          </address>
          <p className="mt-3">
            <a href={telLink} dir="ltr">
              {restaurant.phone}
            </a>
            <br />
            <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
          </p>
          <Newsletter />
        </div>
      </div>

      <div className="footer-giant" aria-hidden>
        {lang === "ar" ? <Split text={restaurant.name.ar} /> : <Split text="Heavens Park" by="char" />}
      </div>

      <div className="footer-base">
        <span>
          © {new Date().getFullYear()} {t(restaurant.name)}
        </span>
        <Star8 size={9} />
        <TodayHijri />
        <Star8 size={9} />
        <button type="button" onClick={replayIntro} className="link-quiet">
          {lang === "ar" ? "إعادة المقدمة" : "Replay intro"}
        </button>
      </div>
    </footer>
  );
}
