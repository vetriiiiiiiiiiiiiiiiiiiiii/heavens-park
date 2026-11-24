"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { restaurant, telLink, waLink } from "@/content/restaurant";
import { LangToggle, useLang } from "@/components/i18n/LangProvider";
import { SoundToggle } from "@/components/audio/AudioProvider";
import { Mark, Star8 } from "@/components/ui/Ornament";

export const NAV = [
  { href: "/", label: { en: "Home", ar: "الرئيسية" } },
  { href: "/story", label: { en: "Our Story", ar: "حكايتنا" } },
  { href: "/menu", label: { en: "Menu", ar: "القائمة" } },
  { href: "/gallery", label: { en: "Gallery", ar: "المعرض" } },
  { href: "/events", label: { en: "Events", ar: "المناسبات" } },
  { href: "/contact", label: { en: "Contact", ar: "تواصل" } },
];

export function Wordmark({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang();
  return (
    <span className={`wordmark ${compact ? "wordmark--compact" : ""}`}>
      <Mark size={compact ? 22 : 26} className="wordmark-mark" />
      <span className="wordmark-text">
        {lang === "ar" ? (
          <span className="wordmark-ar">{restaurant.name.ar}</span>
        ) : (
          <>
            <span className="wordmark-en">Heavens</span>
            <span className="wordmark-en wordmark-en--park">Park</span>
          </>
        )}
      </span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const { t, lang } = useLang();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 48);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("nav-lock", open);
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header className={`site-header ${solid ? "is-solid" : ""} ${open ? "is-open" : ""}`}>
        <div className="site-header-inner">
          <Link href="/" className="header-logo" aria-label="Heavens Park — home">
            <Wordmark />
          </Link>

          <nav className="header-nav" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={pathname === n.href ? "is-active" : ""} aria-current={pathname === n.href ? "page" : undefined}>
                {t(n.label)}
                {lang === "en" && (
                  <span className="nav-ar" aria-hidden lang="ar">
                    {n.label.ar}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <LangToggle className="hidden xl:inline-flex" />
            <SoundToggle className="hidden xl:inline-flex" />
            <Link href="/reservations" className="btn-arch btn-arch--sm hidden md:inline-flex">
              {lang === "ar" ? "احجز طاولة" : "Reserve"}
            </Link>
            <button
              type="button"
              className="burger xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet overlay */}
      <div id="mobile-nav" className={`mobile-nav ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <div className="mobile-nav-pattern" aria-hidden />
        <nav aria-label="Mobile" className="mobile-nav-links">
          {NAV.map((n, i) => (
            <Link key={n.href} href={n.href} style={{ transitionDelay: `${open ? 80 + i * 45 : 0}ms` }}>
              <span className="mobile-nav-num">{lang === "ar" ? "٠١٢٣٤٥٦٧٨٩"[i + 1].padStart(2, "٠") : String(i + 1).padStart(2, "0")}</span>
              {t(n.label)}
              {lang === "en" && (
                <span className="nav-ar" aria-hidden lang="ar">
                  {n.label.ar}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mobile-nav-foot">
          <Link href="/reservations" className="btn-arch w-full justify-center">
            {lang === "ar" ? "احجز طاولتك" : "Reserve your table"}
          </Link>
          <div className="mobile-nav-quick">
            <a href={waLink()} target="_blank" rel="noopener">
              WhatsApp
            </a>
            <Star8 size={10} />
            <a href={telLink}>{lang === "ar" ? "اتصل" : "Call"}</a>
            <Star8 size={10} />
            <LangToggle />
            <SoundToggle />
          </div>
        </div>
      </div>
    </>
  );
}

/** Thin sticky bar on phones: reserve · WhatsApp · call */
export function MobileActionBar() {
  const pathname = usePathname();
  const { lang } = useLang();
  if (pathname.startsWith("/admin") || pathname.startsWith("/reservations")) return null;
  return (
    <div className="mobile-bar md:hidden">
      <a href={waLink()} target="_blank" rel="noopener" aria-label="WhatsApp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
        </svg>
      </a>
      <Link href="/reservations" className="mobile-bar-cta">
        {lang === "ar" ? "احجز طاولتك" : "Reserve a table"}
      </Link>
      <a href={telLink} aria-label="Call">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M5 3h3l2 5-2 1a11 11 0 0 0 7 7l1-2 5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
        </svg>
      </a>
    </div>
  );
}
