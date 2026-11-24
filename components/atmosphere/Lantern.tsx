/**
 * Fanous — a brass lantern drawn in SVG.
 * Pierced-metal panels over coloured glass, domed crown, finial and chain.
 * Light comes from an inner radial glow (animated via CSS "flicker").
 */
type Variant = "emerald" | "ruby" | "amber";

const GLASS: Record<Variant, [string, string]> = {
  emerald: ["#3f8f6a", "#0f4a37"],
  ruby: ["#b8463a", "#5c1a16"],
  amber: ["#f0b25a", "#8a5520"],
};

export function Lantern({ variant = "amber", chain = 120, uid }: { variant?: Variant; chain?: number; uid: string }) {
  const [g1, g2] = GLASS[variant];
  const H = chain + 210;
  return (
    <svg viewBox={`0 0 120 ${H}`} width="120" height={H} aria-hidden className="lantern-svg" overflow="visible">
      <defs>
        <linearGradient id={`brass-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#5a3a15" />
          <stop offset=".3" stopColor="#c99a4f" />
          <stop offset=".5" stopColor="#f1d391" />
          <stop offset=".7" stopColor="#a87939" />
          <stop offset="1" stopColor="#3f2a10" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx=".5" cy=".55" r=".6">
          <stop offset="0" stopColor="#fff2c8" stopOpacity="1" />
          <stop offset=".35" stopColor="#f6b955" stopOpacity=".9" />
          <stop offset="1" stopColor="#a8571b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={g1} stopOpacity=".85" />
          <stop offset="1" stopColor={g2} stopOpacity=".95" />
        </linearGradient>
        <radialGradient id={`halo-${uid}`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#f3b860" stopOpacity=".55" />
          <stop offset="1" stopColor="#f3b860" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`body-${uid}`}>
          <path d="M34 0 H86 L96 22 V92 L86 112 H34 L24 92 V22 Z" />
        </clipPath>
        <pattern id={`pierce-${uid}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#2a1b08" />
          <g transform="translate(6 6)" fill="#000">
            <rect x="-3.4" y="-3.4" width="6.8" height="6.8" />
            <rect x="-3.4" y="-3.4" width="6.8" height="6.8" transform="rotate(45)" />
          </g>
        </pattern>
        <mask id={`mask-${uid}`}>
          <rect x="0" y="0" width="120" height="112" fill="white" />
          <rect x="0" y="0" width="120" height="112" fill={`url(#pierce-${uid})`} />
        </mask>
      </defs>

      {/* chain */}
      <g stroke="#8a6230" strokeWidth="1.6" fill="none">
        {Array.from({ length: Math.ceil(chain / 9) }).map((_, i) => (
          <ellipse key={i} cx="60" cy={i * 9 + 4} rx={i % 2 ? 1.6 : 3} ry="4.6" />
        ))}
      </g>

      <g transform={`translate(0 ${chain})`}>
        {/* light halo — the ambient warmth thrown into the room */}
        <circle className="lantern-halo" cx="60" cy="110" r="120" fill={`url(#halo-${uid})`} />

        {/* ring + finial */}
        <circle cx="60" cy="4" r="5" fill="none" stroke={`url(#brass-${uid})`} strokeWidth="2.4" />
        <path d="M56 9h8l2 10h-12z" fill={`url(#brass-${uid})`} />
        <circle cx="60" cy="22" r="4" fill={`url(#brass-${uid})`} />
        {/* dome */}
        <path d="M60 24c-10 4-26 14-30 32h60c-4-18-20-28-30-32z" fill={`url(#brass-${uid})`} />
        <path d="M38 50c6-10 14-16 22-20 8 4 16 10 22 20" fill="none" stroke="#3a250b" strokeWidth=".8" opacity=".6" />
        {[42, 51, 60, 69, 78].map((x) => (
          <circle key={x} cx={x} cy={47 - Math.abs(60 - x) * 0.25} r="1.3" fill="#ffd98a" className="lantern-flicker" />
        ))}
        <rect x="26" y="55" width="68" height="6" rx="1" fill={`url(#brass-${uid})`} />

        {/* body */}
        <g transform="translate(0 61)">
          <g clipPath={`url(#body-${uid})`}>
            <rect width="120" height="112" fill={`url(#glass-${uid})`} />
            <rect className="lantern-flicker" width="120" height="112" fill={`url(#glow-${uid})`} />
            {/* pierced brass overlay */}
            <rect width="120" height="112" fill={`url(#brass-${uid})`} mask={`url(#mask-${uid})`} opacity=".92" />
          </g>
          {/* frame */}
          <path d="M34 0 H86 L96 22 V92 L86 112 H34 L24 92 V22 Z" fill="none" stroke={`url(#brass-${uid})`} strokeWidth="3" />
          <path d="M44 0 V112 M76 0 V112" stroke={`url(#brass-${uid})`} strokeWidth="2.2" />
          <path d="M24 22 H96 M24 92 H96" stroke={`url(#brass-${uid})`} strokeWidth="2" />
          {/* central arch window */}
          <path d="M50 88 V46 c0-7 5-12 10-15 5 3 10 8 10 15 V88 z" fill="rgba(255,226,160,.25)" stroke="#f1d391" strokeWidth="1" className="lantern-flicker" />
        </g>

        {/* base */}
        <rect x="26" y="173" width="68" height="6" rx="1" fill={`url(#brass-${uid})`} />
        <path d="M32 179 H88 L68 198 H52 Z" fill={`url(#brass-${uid})`} />
        <path d="M56 198 h8 l-4 12 z" fill={`url(#brass-${uid})`} />
      </g>
    </svg>
  );
}
