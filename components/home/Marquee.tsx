"use client";

/** Two bands of dish names in Ruqaa calligraphy, gliding in opposite directions; speed follows the scroll. */
const ROW_A = ["مندي", "كبسة", "مشاوي", "شاورما", "مضغوط", "حنيذ", "سمبوسة"];
const ROW_B = ["Kunafa", "Gahwa", "Luqaimat", "Umm Ali", "Jallab", "Tannour bread", "Karak"];

function Row({ words, ar }: { words: string[]; ar: boolean }) {
  const seq = [...words, ...words];
  return (
    <div className={`marquee-row ${ar ? "marquee-row--ar" : "marquee-row--en"}`} dir="ltr">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div className="marquee-group" key={k} aria-hidden={k === 1}>
            {seq.map((w, i) => (
              <span key={i} className="marquee-item">
                <span lang={ar ? "ar" : "en"}>{w}</span>
                <svg viewBox="-12 -12 24 24" width="22" height="22" className="marquee-star" aria-hidden>
                  <rect x="-7" y="-7" width="14" height="14" />
                  <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section className="marquee" aria-label="From our kitchen">
      <Row words={ROW_A} ar />
      <Row words={ROW_B} ar={false} />
    </section>
  );
}
