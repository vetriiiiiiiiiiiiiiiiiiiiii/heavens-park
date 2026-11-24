"use client";

/**
 * Arabic architectural & calligraphic vocabulary.
 * Each piece has one job: frame, divide, or label — never filler.
 */
import { useLang } from "@/components/i18n/LangProvider";

/** Eyebrow label, bilingual in English mode: "THE HOUSE ✦ الدار" */
export function Eyebrow({ en, ar, className = "", reveal = true }: { en: string; ar: string; className?: string; reveal?: boolean }) {
  const { lang } = useLang();
  return (
    <p className={`eyebrow eyebrow-bi ${className}`} data-reveal={reveal ? "" : undefined}>
      {lang === "ar" ? (
        <span className="eyebrow-ar">{ar}</span>
      ) : (
        <>
          <span>{en}</span>
          <svg width="9" height="9" viewBox="-6 -6 12 12" aria-hidden className="eyebrow-star">
            <rect x="-3.6" y="-3.6" width="7.2" height="7.2" fill="currentColor" />
            <rect x="-3.6" y="-3.6" width="7.2" height="7.2" transform="rotate(45)" fill="currentColor" />
          </svg>
          <span className="eyebrow-ar" lang="ar">
            {ar}
          </span>
        </>
      )}
    </p>
  );
}

/** A large calligraphic word set behind a heading, like a word painted on plaster. */
export function Calligraphy({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`calli ${className}`} aria-hidden lang="ar" dir="rtl">
      {text}
    </span>
  );
}

/**
 * Shurafāt — the stepped merlons that crown mosque and palace walls.
 * Used as the skyline where a dark section meets a light one.
 */
export function Merlons({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  return (
    <div className={`merlons ${flip ? "merlons--flip" : ""}`} style={{ background: from, ["--to" as string]: to }} aria-hidden>
      <span />
    </div>
  );
}

/** A narrow band of interlaced eight-pointed stars — a tiled frieze between dark rooms. */
export function GirihBand({ className = "" }: { className?: string }) {
  return (
    <div className={`girih-band ${className}`} aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="girih-band" width="44" height="44" patternUnits="userSpaceOnUse" x="0" y="0">
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <g transform="translate(22 22)">
                <rect x="-11" y="-11" width="22" height="22" />
                <rect x="-11" y="-11" width="22" height="22" transform="rotate(45)" />
                <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" />
              </g>
              <path d="M0 22h6.4M37.6 22H44M22 0v6.4M22 37.6V44" />
              <path d="M0 0l6.5 6.5M44 0l-6.5 6.5M0 44l6.5-6.5M44 44l-6.5-6.5" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih-band)" />
      </svg>
    </div>
  );
}

/** Mashrabiya — turned-wood lattice screen, seen from inside the house. */
export function Mashrabiya({ className = "" }: { className?: string }) {
  return (
    <div className={`mashrabiya ${className}`} aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="mashrabiya" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="scale(1.75)">
            <rect width="34" height="34" fill="none" />
            <g fill="#140b03" stroke="#6b4a22" strokeWidth=".5">
              {/* turned bead at each crossing */}
              <circle cx="17" cy="17" r="5.6" />
              <circle cx="0" cy="0" r="5.6" />
              <circle cx="34" cy="0" r="5.6" />
              <circle cx="0" cy="34" r="5.6" />
              <circle cx="34" cy="34" r="5.6" />
              {/* spindles */}
              <rect x="15.4" y="0" width="3.2" height="34" />
              <rect x="0" y="15.4" width="34" height="3.2" />
              <rect x="-1.6" y="0" width="3.2" height="34" />
              <rect x="32.4" y="0" width="3.2" height="34" />
              <rect x="0" y="-1.6" width="34" height="3.2" />
              <rect x="0" y="32.4" width="34" height="3.2" />
            </g>
            <g fill="#c99a4f" opacity=".35">
              <circle cx="15.5" cy="15.5" r="1.4" />
            </g>
          </pattern>
          <linearGradient id="mash-fade" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".45" stopColor="#fff" stopOpacity=".9" />
            <stop offset="1" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id="mash-mask">
            <rect width="100%" height="100%" fill="url(#mash-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#mashrabiya)" mask="url(#mash-mask)" />
      </svg>
    </div>
  );
}

/** Horseshoe (Moorish) arch outline, used to frame sacred text and key moments. */
export function HorseshoeArch({ className = "" }: { className?: string }) {
  return (
    <svg className={`horseshoe ${className}`} viewBox="0 0 400 520" fill="none" preserveAspectRatio="none" aria-hidden>
      {/* inner horseshoe: arc closes past the semicircle, jambs drop from the springing points */}
      <path d="M69 520V322A160 160 0 1 1 331 322V520" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      {/* outer moulding */}
      <path d="M52.6 520V333A180 180 0 1 1 347.4 333V520" stroke="currentColor" strokeWidth=".7" opacity=".55" vectorEffect="non-scaling-stroke" />
      {/* imposts */}
      <path d="M44 322h34M322 322h34" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      <g transform="translate(200 50)">
        <rect x="-7" y="-7" width="14" height="14" fill="currentColor" />
        <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Eastern Arabic numerals: 1 → ١ */
export const arNum = (n: number | string) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

/**
 * Arabesque (islimi) — a symmetrical vine scroll with split-palmette tips,
 * meeting at a central eight-pointed star. Used under section headings.
 */
export function Arabesque({ className = "" }: { className?: string }) {
  const half = (
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      {/* main stem */}
      <path d="M128 18 C110 18 104 6 90 8 C76 10 76 26 62 26 C48 26 46 12 34 12 C24 12 20 20 12 18" />
      {/* spirals */}
      <path d="M90 8 C84 2 76 4 77 10 C78 14 83 13 82 10" />
      <path d="M62 26 C56 32 48 30 49 24 C50 20 55 21 54 24" />
      <path d="M34 12 C30 6 23 8 24 13 C25 16 29 15 28 13" />
      {/* split palmettes */}
      <path d="M104 14 C100 8 96 9 98 13 C94 12 94 17 99 17" />
      <path d="M76 22 C72 28 68 27 70 23 C66 24 66 19 71 19" />
      <path d="M46 16 C42 10 38 11 40 15 C36 14 36 19 41 19" />
      <path d="M12 18 C6 14 2 18 4 21 C6 24 10 22 12 18 Z" fill="currentColor" fillOpacity=".35" />
    </g>
  );
  return (
    <svg className={`arabesque ${className}`} viewBox="0 0 300 36" width="300" height="36" aria-hidden>
      {half}
      <g transform="translate(300 0) scale(-1 1)">{half}</g>
      <g transform="translate(150 18)" fill="none" stroke="currentColor" strokeWidth="1.1">
        <rect x="-8" y="-8" width="16" height="16" />
        <rect x="-8" y="-8" width="16" height="16" transform="rotate(45)" />
        <circle r="3" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Dallah and two finjan cups — a single-line brass drawing. */
export function DallahArt({ className = "" }: { className?: string }) {
  return (
    <svg className={`dallah-art ${className}`} viewBox="0 0 220 170" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* finial + lid */}
      <path d="M78 10 l4 -6 l4 6" />
      <path d="M74 22 C74 14 90 14 90 22" />
      <path d="M70 24 h24" />
      {/* neck */}
      <path d="M73 24 C72 34 70 40 66 46 M91 24 C92 34 94 40 98 46" />
      <path d="M66 46 h32" />
      {/* body */}
      <path d="M66 46 C46 62 44 100 54 120 C60 132 104 132 110 120 C120 100 118 62 98 46" />
      <path d="M56 84 h52" opacity=".5" />
      <path d="M58 98 h48" opacity=".5" />
      {/* foot */}
      <path d="M58 126 C56 134 52 138 48 140 h68 C112 138 108 134 106 126" />
      {/* beak spout */}
      <path d="M58 62 C40 52 30 34 18 20 C16 18 14 22 16 24 C26 40 34 60 54 78" />
      {/* handle */}
      <path d="M104 52 C130 52 136 76 124 96 C120 104 112 110 108 112" />
      {/* engraved band */}
      <g strokeWidth="1">
        {[62, 72, 82, 92, 102].map((x) => (
          <path key={x} d={`M${x} 90 l3 -4 l3 4 l-3 4 z`} />
        ))}
      </g>
      {/* finjan cups */}
      <path d="M150 112 C150 128 176 128 176 112 Z" />
      <path d="M150 112 h26" />
      <path d="M186 124 C186 138 208 138 208 124 Z" />
      <path d="M186 124 h22" />
      {/* steam */}
      <path d="M160 104 C156 96 166 92 162 84" opacity=".6" />
      <path d="M168 102 C164 94 174 90 170 82" opacity=".4" />
      {/* tray line */}
      <path d="M30 150 C80 160 160 160 214 150" opacity=".6" />
    </svg>
  );
}

/** Hijri (Umm al-Qura) date for a YYYY-MM-DD string, e.g. "29 Jumada I 1448 AH". */
export function hijri(date: string, lang: "en" | "ar") {
  try {
    const d = new Date(`${date}T12:00:00`);
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-islamic-umalqura" : "en-GB-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

/** Numbers in the visitor's script: Eastern Arabic digits in Arabic mode. */
export const num = (v: number | string, lang: "en" | "ar") => (lang === "ar" ? arNum(v) : String(v));
