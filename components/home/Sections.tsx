"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { restaurant, telLink, waLink, directionsLink, mapEmbed } from "@/content/restaurant";
import { signatureDishes } from "@/content/menu";
import { quotes } from "@/content/quotes";
import { useLang, T } from "@/components/i18n/LangProvider";
import { Photo } from "@/components/ui/Photo";
import { Rule, Star8, PatternField } from "@/components/ui/Ornament";
import { HeroLanterns, Smoke } from "@/components/atmosphere/Atmosphere";
import { Steam } from "@/components/atmosphere/Steam";
import { Arabesque, Calligraphy, DallahArt, Eyebrow, HorseshoeArch, Mashrabiya, arNum, num } from "@/components/ui/Arabic";
import { Split, ST } from "@/components/motion/Split";
import { BookingForm } from "@/components/booking/BookingForm";
import { HoursList } from "@/components/layout/Footer";

const Arrow = () => (
  <svg className="arrow" width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" aria-hidden>
    <path d="M0 5h20M16 1l4 4-4 4" />
  </svg>
);

const price = (p: number | string, lang: "en" | "ar" = "en") => `${restaurant.currency}${num(p, lang)}`;

/* ── A · HERO ─────────────────────────────────────────────── */
export function Hero() {
  const { lang } = useLang();
  return (
    <section className="hero" aria-label="Welcome">
      <Photo k="heroInterior" className="hero-photo" sizes="100vw" priority />
      <div className="hero-shade" aria-hidden />
      <Mashrabiya />
      <Smoke className="hero-smoke" />
      <HeroLanterns />

      <div className="hero-content">
        <p className="hero-welcome font-ruqaa" lang="ar">
          أهلاً وسهلاً
        </p>
        <h1 className="hero-title display">
          {lang === "ar" ? (
            <span className="hero-title-ar">
              <Split text={restaurant.name.ar} />
            </span>
          ) : (
            <>
              <span className="hero-title-1">
                <Split text="Heavens" by="char" />
              </span>
              <span className="hero-title-2">
                <em>
                  <Split text="Park" by="char" />
                </em>
              </span>
            </>
          )}
        </h1>
        <p className="hero-tag">{lang === "ar" ? restaurant.tagline.ar : restaurant.tagline.en}</p>
        <p className="hero-desc">
          <T
            en="Mandi drawn from the pit, kebabs from the charcoal, coffee poured from the dallah — served beneath lanterns, the way hospitality has been kept for centuries."
            ar="مندي يخرج من الحفرة، ومشاوي من الجمر، وقهوة تُسكب من الدلّة — تحت ضوء الفوانيس، كما حُفظت الضيافة منذ قرون."
          />
        </p>
        <div className="hero-cta">
          <Link href="/reservations" className="btn-arch">
            <T en="Reserve your table" ar="احجز طاولتك" />
          </Link>
          <Link href="/menu" className="link-line">
            <T en="Explore our menu" ar="اكتشف قائمتنا" /> <Arrow />
          </Link>
        </div>
      </div>

      <div className="hero-calli" aria-hidden>
        <span className="hero-calli-word" lang="ar">
          حيّاكم
        </span>
        <span className="hero-calli-rule" />
        <span className="hero-calli-sub">{lang === "ar" ? "حللتم أهلاً ونزلتم سهلاً" : "You are among family here"}</span>
      </div>
      <div className="hero-scroll" aria-hidden>
        <span />
      </div>
    </section>
  );
}

/* ── B · ATMOSPHERE ───────────────────────────────────────── */
export function Atmosphere() {
  const { t } = useLang();
  const spaces = [
    { k: "majlis" as const, n: "١", title: { en: "The Majlis", ar: "المجلس" }, cap: { en: "Low cushions, zellige walls, and the hours that disappear.", ar: "وسائد منخفضة وجدران من الزليج، وساعات تمضي دون أن نشعر." } },
    { k: "courtyard" as const, n: "٢", title: { en: "The Courtyard", ar: "الفناء" }, cap: { en: "An olive tree, blue tiles, and evening air.", ar: "شجرة زيتون وبلاط أزرق ونسيم المساء." } },
    { k: "privateDining" as const, n: "٣", title: { en: "The Inner Court", ar: "الصحن الداخلي" }, cap: { en: "Carved arches around a private table.", ar: "أقواس منقوشة حول مائدة خاصة." } },
    { k: "openKitchen" as const, n: "٤", title: { en: "The Spice Room", ar: "غرفة البهارات" }, cap: { en: "Baharat ground every week, never bought ready.", ar: "بهارات تُطحن كل أسبوع، لا تُشترى جاهزة." } },
    { k: "entrance" as const, n: "٥", title: { en: "The Gate", ar: "البوابة" }, cap: { en: "Step through the arch, leave the city behind.", ar: "اعبر القوس واترك المدينة خلفك." } },
  ];
  return (
    <section className="atmos paper" aria-labelledby="atmos-title">
      <div className="atmos-intro calli-host">
        <Calligraphy text="الدار" />
        <Eyebrow en="The House" ar="الدار" />
        <h2 id="atmos-title" className="display atmos-title" data-split>
          <ST en="Step into the dar," ar="ادخل الدار،" />
          <br />
          <em>
            <ST en="leave the city outside." ar="واترك المدينة خلفك." />
          </em>
        </h2>
        <Arabesque className="arabesque--title" />
        <p className="lede atmos-lede" data-reveal>
          <T
            en="Heavens Park is built like a courtyard house: rooms opening onto rooms, each lit only as much as it needs. Find a corner, take off your shoes in the majlis, and let the evening take its time."
            ar="بُنيت هيفنز بارك كدار ذات فناء: غرف تنفتح على غرف، كلٌّ منها مضاء بقدر حاجته. اختر ركنك، واخلع نعليك في المجلس، ودع المساء يأخذ وقته."
          />
        </p>
      </div>

      <div className="atmos-grid">
        {spaces.map((s, i) => (
          <figure key={s.k} className={`atmos-fig atmos-fig--${i + 1}`} data-reveal style={{ ["--rd" as string]: `${(i % 2) * 0.12}s` }}>
            <Photo k={s.k} frame={i === 0 ? "arch" : "none"} className="atmos-photo" sizes="(max-width: 768px) 100vw, 45vw" />
            <figcaption>
              <span className="atmos-num">{s.n}</span>
              <span className="atmos-cap-title">{t(s.title)}</span>
              <span className="atmos-cap">{t(s.cap)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ── C · SIGNATURE DISHES ─────────────────────────────────── */
export function Signatures() {
  const { t, lang } = useLang();
  const [lead, ...rest] = signatureDishes;
  return (
    <section className="sig" aria-labelledby="sig-title">
      <PatternField className="sig-pattern" id="sig-girih" />
      <header className="sig-head calli-host">
        <Calligraphy text="من النار" className="calli--center" />
        <Eyebrow en="From the fire" ar="من النار" />
        <h2 id="sig-title" className="display sig-title" data-split>
          <ST en="The" ar="" /> <em><ST en="sufra" ar="السفرة" /></em>
        </h2>
        <Arabesque className="arabesque--title" />
        <p className="sig-sub" data-reveal>
          <T en="Signature dishes from the fire, the tannour and the dallah — laid out to be shared." ar="أطباقنا المميزة من النار والتنور والدلّة — تُفرش للمشاركة." />
        </p>
      </header>

      <article className="sig-lead steam-host">
        <div className="sig-lead-media">
          <Photo k={lead.image} className="sig-lead-photo photo--zellige" sizes="(max-width: 768px) 100vw, 60vw" />
          <Steam origin={0.5} spread={0.4} />
          <div className="sig-glow" aria-hidden />
        </div>
        <div className="sig-lead-text">
          <span className="sig-no num-ar">{arNum("01")}</span>
          <h3 className="display">{t(lead.name)}</h3>
          <p className="sig-ar font-arabic" lang="ar">
            {lang === "ar" ? lead.name.en : lead.name.ar}
          </p>
          <p className="sig-desc">{t(lead.desc)}</p>
          <p className="sig-price" dir="ltr">
            {price(lead.price, lang)}
          </p>
        </div>
      </article>

      <div className="sig-rail-wrap">
        <div className="sig-rail-head">
          <span className="eyebrow">
            <T en="The sufra continues" ar="وتمتد السفرة" />
          </span>
          <span className="sig-rail-progress" aria-hidden>
            <span />
          </span>
        </div>
        <div className="sig-rail">
          {rest.map((d, i) => (
            <article key={d.id} className="sig-card steam-host">
              <div className="sig-card-media">
                <Photo k={d.image} className="sig-card-photo" sizes="(max-width: 1024px) 80vw, 34vw" />
                <Steam origin={0.5} spread={0.5} />
                <div className="sig-glow" aria-hidden />
                <span className="sig-card-no num-ar">{arNum(String(i + 2).padStart(2, "0"))}</span>
              </div>
              <div className="sig-card-text">
                <h3>{t(d.name)}</h3>
                <p className="sig-card-alt" lang={lang === "ar" ? "en" : "ar"}>
                  {lang === "ar" ? d.name.en : d.name.ar}
                </p>
                <p className="sig-desc">{t(d.desc)}</p>
                <span className="sig-price" dir="ltr">
                  {price(d.price, lang)}
                </span>
              </div>
            </article>
          ))}
          <Link href="/menu" className="sig-card sig-card--end">
            <span className="sig-card-end-ar font-ruqaa" lang="ar">
              القائمة
            </span>
            <span className="link-line">
              <T en="The full menu" ar="القائمة الكاملة" /> <Arrow />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── D · OUR STORY (teaser) ───────────────────────────────── */
export function StoryTeaser() {
  return (
    <section className="story-t sand" aria-labelledby="story-title">
      <div className="story-t-media" data-reveal>
        <Photo k="hands" className="story-t-photo photo--zellige" sizes="(max-width: 768px) 100vw, 40vw" />
        <Photo k="bread" className="story-t-photo2" sizes="(max-width: 768px) 60vw, 22vw" />
      </div>
      <div className="story-t-text calli-host">
        <Calligraphy text="حكاية" />
        <Eyebrow en="Our story" ar="حكايتنا" />
        <h2 id="story-title" className="display story-t-title" data-split>
          <ST en="Recipes carried" ar="وصفاتٌ حُملت" />
          <br />
          <em>
            <ST en="across the sand." ar="عبر الرمال." />
          </em>
        </h2>
        <Arabesque className="arabesque--title" />
        <p className="dropcap" data-reveal>
          <T
            en="Mandi was born in the Hadramawt, cooked in pits dug into the earth and sealed with embers. Kabsa travelled the peninsula on caravans. Our kitchen keeps those methods — the clay, the smoke, the patience — and cooks them for a new city."
            ar="وُلد المندي في حضرموت، يُطهى في حفر تُحفر في الأرض وتُغلق على الجمر. وسافرت الكبسة عبر الجزيرة مع القوافل. ومطبخنا يحفظ تلك الطرق — الطين والدخان والصبر — ويطهوها لمدينة جديدة."
          />
        </p>
        <ol className="principles" data-stagger>
          <li>
            <span>١</span>
            <T en="Slow fire over fast heat." ar="النار الهادئة قبل الحرارة السريعة." />
          </li>
          <li>
            <span>٢</span>
            <T en="Spice blends ground in-house, every week." ar="خلطات بهارات تُطحن عندنا كل أسبوع." />
          </li>
          <li>
            <span>٣</span>
            <T en="Plates made for sharing, never for one." ar="أطباق للمشاركة، لا لشخص واحد." />
          </li>
        </ol>
        <Link href="/story" className="link-line" data-reveal>
          <T en="Read our story" ar="اقرأ حكايتنا" /> <Arrow />
        </Link>
      </div>
    </section>
  );
}

/* ── E · HOSPITALITY ──────────────────────────────────────── */
export function Hospitality() {
  const { t, lang } = useLang();
  const q = quotes.honourGuest;
  return (
    <section className="hosp" aria-labelledby="hosp-title">
      <PatternField className="hosp-pattern" id="hosp-girih" />
      <div className="hosp-shade" aria-hidden />
      <div className="hosp-inner">
        <HorseshoeArch />
        <Eyebrow en="Diyafa · Hospitality" ar="الضيافة" />
        <h2 id="hosp-title" className="sr-only">
          <T en="Arabian hospitality" ar="الضيافة العربية" />
        </h2>
        <blockquote className="hosp-quote" data-reveal>
          <p className="hosp-ar" lang="ar" dir="rtl">
            {q.ar}
          </p>
          {lang === "en" && <p className="hosp-en">“{q.en}”</p>}
          <footer>
            <cite>{t(q.source)}</cite>
          </footer>
        </blockquote>
        <Arabesque className="hosp-rule arabesque--light" />
        <div className="hosp-ritual" data-reveal>
          <DallahArt className="hosp-dallah" />
          <p>
            <T
              en="Before the menu, before the questions — coffee. Gahwa is poured into small cups, a few sips at a time, with dates on the side. Your cup will be refilled until you give it a gentle shake. That is how a guest is welcomed here."
              ar="قبل القائمة، وقبل الأسئلة — القهوة. تُسكب القهوة في فناجين صغيرة، رشفات قليلة في كل مرة، ومعها التمر. ويُعاد ملء فنجانك حتى تهزّه هزّة خفيفة. هكذا يُستقبل الضيف هنا."
            />
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── F · REVIEWS (real only) ──────────────────────────────── */
type Reviews = { configured: boolean; rating?: number; count?: number; url?: string; reviews?: { rating: number; text: string; author: string; when: string }[]; error?: boolean };

export function ReviewsSection() {
  const { lang } = useLang();
  const [data, setData] = useState<Reviews | null>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ configured: false }));
  }, []);
  const googleUrl = data?.url || restaurant.social.googleReviews || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.mapQuery)}`;
  const list = data?.reviews || [];
  const r = list[i];

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="reviews-inner calli-host">
        <Calligraphy text="ضيوفنا" className="calli--center" />
        <Eyebrow en="In our guests’ words" ar="بكلمات ضيوفنا" />
        <h2 id="reviews-title" className="sr-only">
          <T en="Guest reviews" ar="آراء الضيوف" />
        </h2>
        {r ? (
          <figure className="review" key={i}>
            <div className="review-stars" aria-label={`${r.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, s) => (
                <Star8 key={s} size={12} className={s < r.rating ? "opacity-100" : "opacity-25"} />
              ))}
            </div>
            <blockquote className="review-text">“{r.text.length > 420 ? r.text.slice(0, 420).trim() + "…" : r.text}”</blockquote>
            <figcaption>
              {r.author} <span>· {r.when} · Google</span>
            </figcaption>
            {list.length > 1 && (
              <div className="review-nav">
                <button onClick={() => setI((i - 1 + list.length) % list.length)} aria-label="Previous review">
                  ←
                </button>
                <span dir="ltr">
                  {i + 1} / {list.length}
                </span>
                <button onClick={() => setI((i + 1) % list.length)} aria-label="Next review">
                  →
                </button>
              </div>
            )}
          </figure>
        ) : (
          <div className="review review--empty" data-reveal>
            <p className="review-text">
              <T en="We would rather you hear it from our guests than from us." ar="نفضّل أن تسمعها من ضيوفنا لا منّا." />
            </p>
          </div>
        )}
        {data?.rating && (
          <p className="review-meta" dir="ltr">
            {data.rating.toFixed(1)} / 5 · {data.count} {lang === "ar" ? "تقييم على Google" : "Google reviews"}
          </p>
        )}
        <a className="link-line mt-10" href={googleUrl} target="_blank" rel="noopener">
          <T en="Read all reviews on Google" ar="اقرأ جميع التقييمات على Google" /> <Arrow />
        </a>
      </div>
    </section>
  );
}

/* ── Booking band ─────────────────────────────────────────── */
export function BookingBand() {
  return (
    <section className="book-band" id="reserve" aria-labelledby="book-title">
      <div className="book-band-head calli-host">
        <Calligraphy text="أهلاً" className="calli--left" />
        <Eyebrow en="Reservations" ar="الحجوزات" />
        <h2 id="book-title" className="display book-band-title" data-split>
          <ST en="Keep a place" ar="احجز مكانك" />
          <br />
          <em>
            <ST en="in the majlis." ar="في المجلس." />
          </em>
        </h2>
        <Arabesque className="arabesque--title" />
        <p className="lede" data-reveal>
          <T en="Under a minute. You’ll receive a reference straight away." ar="أقل من دقيقة. ستحصل على رقم الحجز فوراً." />
        </p>
        <p className="book-band-alt" data-reveal>
          <T en="Twelve or more? " ar="اثنا عشر شخصاً أو أكثر؟ " />
          <Link href="/events" className="text-gold underline underline-offset-4">
            <T en="Plan a gathering" ar="خطّط لمناسبة" />
          </Link>
        </p>
      </div>
      <div className="book-band-form" data-reveal>
        <BookingForm variant="inline" />
      </div>
    </section>
  );
}

/* ── G · LOCATION ─────────────────────────────────────────── */
export function Location({ heading = true }: { heading?: boolean }) {
  const { t } = useLang();
  return (
    <section className="loc paper" aria-labelledby="loc-title">
      <div className="loc-map" data-reveal>
        <iframe
          title="Map — Heavens Park"
          src={mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="loc-text calli-host">
        <Calligraphy text="الباب" />
        {heading && (
          <>
            <Eyebrow en="Find us" ar="موقعنا" />
            <h2 id="loc-title" className="display loc-title" data-split>
              <ST en="The door with" ar="الباب ذو" />
              <br />
              <em>
                <ST en="the lanterns." ar="الفوانيس." />
              </em>
            </h2>
        <Arabesque className="arabesque--title" />
          </>
        )}
        <address className="loc-address" data-reveal>
          {t(restaurant.address.line1)}
          <br />
          {t(restaurant.address.line2)}
        </address>
        <div data-reveal>
          <HoursList className="loc-hours" />
        </div>
        <p className="loc-phone" data-reveal>
          <a href={telLink} dir="ltr">
            {restaurant.phone}
          </a>
        </p>
        <div className="loc-actions" data-stagger>
          <a className="btn-arch" href={directionsLink} target="_blank" rel="noopener">
            <T en="Get directions" ar="احصل على الاتجاهات" />
          </a>
          <a className="link-line" href={waLink()} target="_blank" rel="noopener">
            WhatsApp <Arrow />
          </a>
          <a className="link-line" href={telLink}>
            <T en="Call us" ar="اتصل بنا" /> <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Page hero for inner pages ────────────────────────────── */
export function PageHero({
  k,
  eyebrow,
  title,
  titleEm,
  ar,
}: {
  k: Parameters<typeof Photo>[0]["k"];
  eyebrow: { en: string; ar: string };
  title: { en: string; ar: string };
  titleEm?: { en: string; ar: string };
  ar?: string;
}) {
  const { t } = useLang();
  return (
    <section className="phero">
      <Photo k={k} className="phero-photo" sizes="100vw" priority />
      <div className="phero-shade" aria-hidden />
      <Smoke className="hero-smoke" density={0.7} />
      <HeroLanterns />
      <div className="phero-content">
        {ar && (
          <p className="phero-ar font-ruqaa" lang="ar">
            {ar}
          </p>
        )}
        <Eyebrow en={eyebrow.en} ar={eyebrow.ar} reveal={false} />
        <h1 className="display phero-title">
          <Split text={t(title)} />
          {titleEm && (
            <>
              {" "}
              <em>
                <Split text={t(titleEm)} />
              </em>
            </>
          )}
        </h1>
        <Arabesque className="arabesque--title arabesque--light" />
      </div>
    </section>
  );
}
