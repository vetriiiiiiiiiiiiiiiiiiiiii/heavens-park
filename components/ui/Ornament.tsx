/* Ornamental vocabulary — all hand-drawn SVG, inherits currentColor. */

/** Eight-pointed star (khatam): two overlapping squares */
export function Star8({ size = 16, className = "", strokeWidth = 1.2 }: { size?: number; className?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="-12 -12 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <rect x="-7.5" y="-7.5" width="15" height="15" />
      <rect x="-7.5" y="-7.5" width="15" height="15" transform="rotate(45)" />
      <circle r="2.2" />
    </svg>
  );
}

/** Horizontal rule: hairline — star — hairline */
export function Rule({ className = "", wide = false }: { className?: string; wide?: boolean }) {
  return (
    <div className={`rule ${wide ? "rule--wide" : ""} ${className}`} aria-hidden>
      <span />
      <svg width="46" height="14" viewBox="0 0 46 14" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 7h12M34 7h12" />
        <g transform="translate(23 7)">
          <rect x="-4" y="-4" width="8" height="8" />
          <rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" />
        </g>
        <circle cx="15" cy="7" r="1" fill="currentColor" />
        <circle cx="31" cy="7" r="1" fill="currentColor" />
      </svg>
      <span />
    </div>
  );
}

/** Small crescent used sparingly (Ramadan / Eid context) */
export function Crescent({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M15.5 3.2A9 9 0 1 0 20.8 16 7.2 7.2 0 0 1 15.5 3.2Z" />
    </svg>
  );
}

/** Repeating girih-style tile for backgrounds (used in CSS via data URI too) */
export function PatternField({ className = "", id = "girih" }: { className?: string; id?: string }) {
  return (
    <svg className={className} aria-hidden width="100%" height="100%">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.6">
            <g transform="translate(28 28)">
              <rect x="-11" y="-11" width="22" height="22" />
              <rect x="-11" y="-11" width="22" height="22" transform="rotate(45)" />
              <circle r="4" />
            </g>
            <path d="M0 0l12.4 12.4M56 0L43.6 12.4M0 56l12.4-12.4M56 56L43.6 43.6" />
            <path d="M28 0v12.4M28 56V43.6M0 28h12.4M56 28H43.6" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Restaurant mark: star within a pointed arch */
export function Mark({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 40 50" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M3 49V22C3 11 12 4 20 1c8 3 17 10 17 21v27" />
      <path d="M8 49V23c0-8 6-13.5 12-16 6 2.5 12 8 12 16v26" opacity=".55" />
      <g transform="translate(20 27)">
        <rect x="-6.5" y="-6.5" width="13" height="13" />
        <rect x="-6.5" y="-6.5" width="13" height="13" transform="rotate(45)" />
        <circle r="2" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
