"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { media, type MediaKey } from "@/content/media";
import { restaurant, waLink } from "@/content/restaurant";
import { useLang, T } from "@/components/i18n/LangProvider";
import { Photo } from "@/components/ui/Photo";
import { Crescent, Star8 } from "@/components/ui/Ornament";

/* ── STORY ────────────────────────────────────────────────── */
export function StoryChapters() {
  const { t } = useLang();
  const chapters: { k: MediaKey; n: string; title: { en: string; ar: string }; body: { en: string; ar: string }[]; tone: string }[] = [
    {
      k: "grillFire",
      n: "١",
      tone: "paper",
      title: { en: "Heritage", ar: "الإرث" },
      body: [
        {
          en: "Arabian cooking was shaped by travel. Rice came by sea, spices came by caravan, and the cooks of Yemen and the Gulf learned to make a feast from very little — meat, fire, time.",
          ar: "تشكّل المطبخ العربي بالسفر. جاء الأرز بحراً، وجاءت البهارات مع القوافل، وتعلّم طهاة اليمن والخليج أن يصنعوا وليمة من القليل — لحم ونار ووقت.",
        },
        {
          en: "Heavens Park was founded to cook those dishes properly: mandi in sealed ovens, kabsa built on a real stock, bread slapped against the hot wall of the tannour.",
          ar: "تأسست هيفنز بارك لتطهو تلك الأطباق كما ينبغي: مندي في أفران محكمة الإغلاق، وكبسة على مرق حقيقي، وخبز يُلصق على جدار التنور الحار.",
        },
      ],
    },
    {
      k: "spices",
      n: "٢",
      tone: "sand",
      title: { en: "The kitchen", ar: "المطبخ" },
      body: [
        {
          en: "Our chefs grind their own baharat, soak their own rice, and start the day's lamb before most of the city is awake. Nothing on the menu is rushed, because none of it can be.",
          ar: "يطحن طهاتنا البهارات بأنفسهم، وينقعون الأرز بأنفسهم، ويبدؤون لحم اليوم قبل أن تستيقظ المدينة. لا شيء في قائمتنا يُستعجل، لأن لا شيء منها يحتمل العجلة.",
        },
        {
          en: "The philosophy is simple: respect the ingredient, respect the method, and season for the person who will eat it.",
          ar: "فلسفتنا بسيطة: احترم المكوّن، واحترم الطريقة، وتبّل الطعام لمن سيأكله.",
        },
      ],
    },
    {
      k: "sharing",
      n: "٣",
      tone: "paper",
      title: { en: "Hospitality", ar: "الضيافة" },
      body: [
        {
          en: "In the Arab world a guest is honoured for three days before anyone asks why they came. We can't promise three days — but we can promise you won't be hurried.",
          ar: "في العالم العربي يُكرَم الضيف ثلاثة أيام قبل أن يُسأل عن سبب مجيئه. لا نَعِد بثلاثة أيام — لكننا نَعِد بألّا نستعجلك.",
        },
        {
          en: "Platters arrive for the middle of the table. Coffee arrives before you ask. And if you leave hungry, we have done something wrong.",
          ar: "تصل الصواني إلى وسط المائدة. وتصل القهوة قبل أن تطلبها. وإن غادرت جائعاً فقد أخطأنا.",
        },
      ],
    },
  ];
  return (
    <>
      {chapters.map((c, i) => (
        <section key={c.n} className={`chapter ${c.tone} ${i % 2 ? "chapter--flip" : ""}`}>
          <div data-reveal>
            <Photo k={c.k} frame={i === 1 ? "arch" : "none"} className="chapter-photo" sizes="(max-width: 1024px) 100vw, 45vw" />
          </div>
          <div className="chapter-text">
            <span className="chapter-num" data-reveal>
              {c.n}
            </span>
            <h2 className="display" data-reveal>
              {t(c.title)}
            </h2>
            {c.body.map((b, j) => (
              <p key={j} data-reveal>
                {t(b)}
              </p>
            ))}
          </div>
        </section>
      ))}
      <section className="pull">
        <p data-reveal>
          <T en="“Come as a guest," ar="«تعالَ ضيفاً،" /> <em><T en="leave as family.”" ar="وارحل من الأهل»" /></em>
        </p>
        <Link href="/reservations" className="btn-arch mt-14" data-reveal>
          <T en="Reserve your table" ar="احجز طاولتك" />
        </Link>
      </section>
    </>
  );
}

/* ── GALLERY ──────────────────────────────────────────────── */
const GALLERY: { k: MediaKey; ar: string; cap: { en: string; ar: string } }[] = [
  { k: "heroInterior", ar: "4/5", cap: { en: "Lantern light", ar: "ضوء الفوانيس" } },
  { k: "mandi", ar: "1/1", cap: { en: "Chicken mandi", ar: "مندي دجاج" } },
  { k: "grillFire", ar: "3/4", cap: { en: "Over the charcoal", ar: "فوق الجمر" } },
  { k: "sharing", ar: "4/3", cap: { en: "Dates for every guest", ar: "تمر لكل ضيف" } },
  { k: "majlis", ar: "3/4", cap: { en: "The majlis", ar: "المجلس" } },
  { k: "shawarmaSpit", ar: "4/5", cap: { en: "The spit", ar: "السيخ" } },
  { k: "kabsa", ar: "1/1", cap: { en: "Kabsa", ar: "كبسة" } },
  { k: "privateDining", ar: "4/3", cap: { en: "Carved arches", ar: "أقواس منقوشة" } },
  { k: "mixedGrill", ar: "4/5", cap: { en: "Mixed grill", ar: "مشاوي مشكلة" } },
  { k: "spread", ar: "3/4", cap: { en: "The feast", ar: "الوليمة" } },
  { k: "spices", ar: "4/3", cap: { en: "From the souk", ar: "من السوق" } },
  { k: "hands", ar: "4/5", cap: { en: "The dallah", ar: "الدلّة" } },
];

export function Gallery() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o! + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setOpen((o) => (o! - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("nav-lock");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("nav-lock");
    };
  }, [open]);

  return (
    <>
      <div className="gallery">
        {GALLERY.map((g, i) => (
          <button key={g.k} className="gallery-item" onClick={() => setOpen(i)} data-reveal style={{ ["--ar" as string]: g.ar }} aria-label={`Open image: ${media[g.k].alt}`}>
            <figure>
              <Photo k={g.k} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              <figcaption>{t(g.cap)}</figcaption>
            </figure>
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={t(GALLERY[open].cap)} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div>
            <Photo k={GALLERY[open].k} sizes="92vw" />
            <p className="lightbox-cap">{t(GALLERY[open].cap)}</p>
          </div>
          <button className="lightbox-close" onClick={() => setOpen(null)} aria-label="Close">
            ×
          </button>
          <button className="lightbox-nav" style={{ left: 16 }} onClick={() => setOpen((open - 1 + GALLERY.length) % GALLERY.length)} aria-label="Previous">
            ←
          </button>
          <button className="lightbox-nav" style={{ right: 16 }} onClick={() => setOpen((open + 1) % GALLERY.length)} aria-label="Next">
            →
          </button>
        </div>
      )}
    </>
  );
}

/* ── EVENTS ───────────────────────────────────────────────── */
const OCCASIONS: { k: MediaKey; title: { en: string; ar: string }; body: { en: string; ar: string }; crescent?: boolean }[] = [
  { k: "privateDining", title: { en: "Private celebrations", ar: "احتفالات خاصة" }, body: { en: "Birthdays, engagements, a promotion worth marking — one of our private rooms, lit for you alone.", ar: "أعياد ميلاد وخطوبة وترقية تستحق الاحتفال — إحدى غرفنا الخاصة، مضاءة لك وحدك." } },
  { k: "sharing", title: { en: "Family gatherings", ar: "تجمّعات عائلية" }, body: { en: "Long tables, whole lambs, and a menu built around everyone from grandparents to toddlers.", ar: "موائد طويلة وخراف كاملة وقائمة تناسب الجميع، من الأجداد إلى الأطفال." } },
  { k: "familyDining", title: { en: "Corporate dining", ar: "عشاء الشركات" }, body: { en: "Client dinners and team evenings with set menus, private space, and a single invoice.", ar: "عشاء العملاء وأمسيات الفريق بقوائم ثابتة ومكان خاص وفاتورة واحدة." } },
  { k: "spread", title: { en: "Wedding catering", ar: "ولائم الأعراس" }, body: { en: "Mandi and kabsa for hundreds, cooked by our team and served at your venue, with service staff on request.", ar: "مندي وكبسة للمئات، يطهوها فريقنا وتُقدَّم في مكانك، مع فريق خدمة عند الطلب." } },
  { k: "majlis", crescent: true, title: { en: "Ramadan Iftar", ar: "إفطار رمضان" }, body: { en: "Dates and water at the adhan, lentil soup, then the feast. Group iftar tables and suhoor by arrangement.", ar: "تمر وماء عند الأذان، ثم شوربة العدس، ثم الوليمة. موائد إفطار جماعية وسحور بالترتيب المسبق." } },
  { k: "mixedGrill", crescent: true, title: { en: "Eid celebrations", ar: "احتفالات العيد" }, body: { en: "Eid lunches for the whole family, festive platters and sweets to take home.", ar: "غداء العيد لكل العائلة، وصوانٍ احتفالية وحلويات تأخذها معك." } },
  { k: "grillFire", title: { en: "Chef’s table", ar: "طاولة الشيف" }, body: { en: "A seated evening by the fire, course after course, with the cooks explaining each dish.", ar: "أمسية بجوار النار، طبق بعد طبق، والطهاة يشرحون كل طبق." } },
];

export function Occasions() {
  const { t } = useLang();
  const AR = ["١", "٢", "٣", "٤", "٥", "٦", "٧"];
  return (
    <section className="occasions paper">
      {OCCASIONS.map((o, i) => (
        <article key={o.title.en} className="occasion">
          <span className="occasion-n" data-reveal>
            {AR[i]}
          </span>
          <div className="occasion-text" data-reveal>
            <h3 className="display">
              {t(o.title)}
              {o.crescent && <Crescent size={20} className="text-brass" />}
            </h3>
            <p>{t(o.body)}</p>
          </div>
          <div data-reveal className="occasion-media">
            <Photo k={o.k} className="occasion-photo" sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
        </article>
      ))}
    </section>
  );
}

export function EnquiryForm() {
  const { t, lang } = useLang();
  const types = [
    { en: "Private celebration", ar: "احتفال خاص" },
    { en: "Family gathering", ar: "تجمّع عائلي" },
    { en: "Corporate dining", ar: "عشاء شركة" },
    { en: "Wedding catering", ar: "ولائم أعراس" },
    { en: "Ramadan Iftar", ar: "إفطار رمضان" },
    { en: "Eid celebration", ar: "احتفال العيد" },
    { en: "Chef’s table", ar: "طاولة الشيف" },
    { en: "Other", ar: "أخرى" },
  ];
  const [f, setF] = useState({ name: "", phone: "", email: "", eventType: types[0].en, date: "", guests: "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "busy" | "ok">("idle");
  const [err, setErr] = useState("");

  if (state === "ok")
    return (
      <div className="booking-done">
        <Star8 size={30} className="text-gold" />
        <h3 className="display booking-done-title">{lang === "ar" ? "وصلتنا رسالتك." : "Your enquiry has reached us."}</h3>
        <p className="booking-done-note">
          {lang === "ar" ? "سيتواصل معك مسؤول المناسبات خلال يوم عمل واحد." : "Our events host will be in touch within one working day."}
        </p>
        <a href={waLink(`Salaam, I just sent an event enquiry (${f.eventType}).`)} className="link-line mt-6" target="_blank" rel="noopener">
          {lang === "ar" ? "أو راسلنا الآن عبر واتساب" : "Or message us now on WhatsApp"}
        </a>
      </div>
    );

  return (
    <form
      className="enquiry-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy");
        setErr("");
        const r = await fetch("/api/enquiries", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...f, guests: f.guests || undefined, date: f.date || undefined }),
        }).catch(() => null);
        const j = r ? await r.json().catch(() => ({})) : {};
        if (!r || !r.ok) {
          setErr(j.error || (lang === "ar" ? "تعذّر الإرسال، حاول مرة أخرى." : "Could not send. Please try again."));
          setState("idle");
        } else setState("ok");
      }}
    >
      <div className="field">
        <label htmlFor="q-name">{lang === "ar" ? "الاسم" : "Name"}</label>
        <input id="q-name" required autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="q-phone">{lang === "ar" ? "الهاتف" : "Phone"}</label>
        <input id="q-phone" required type="tel" dir="ltr" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="q-email">{lang === "ar" ? "البريد — اختياري" : "Email — optional"}</label>
        <input id="q-email" type="email" dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="q-type">{lang === "ar" ? "نوع المناسبة" : "Type of event"}</label>
        <select id="q-type" value={f.eventType} onChange={(e) => setF({ ...f, eventType: e.target.value })}>
          {types.map((x) => (
            <option key={x.en} value={x.en}>
              {t(x)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="q-date">{lang === "ar" ? "التاريخ المتوقع" : "Preferred date"}</label>
        <input id="q-date" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="q-guests">{lang === "ar" ? "عدد الضيوف" : "Number of guests"}</label>
        <input id="q-guests" type="number" min={1} inputMode="numeric" value={f.guests} onChange={(e) => setF({ ...f, guests: e.target.value })} />
      </div>
      <div className="field span-2">
        <label htmlFor="q-msg">{lang === "ar" ? "أخبرنا عن مناسبتك" : "Tell us about the occasion"}</label>
        <textarea id="q-msg" rows={4} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      </div>
      <input type="text" className="hp-field" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} aria-hidden />
      <div className="span-2 booking-submit">
        <button className="btn-arch" disabled={state === "busy"}>
          {state === "busy" ? "…" : lang === "ar" ? "أرسل الاستفسار" : "Send enquiry"}
        </button>
        <p className="form-msg is-err" role="alert">
          {err}
        </p>
      </div>
    </form>
  );
}

/* ── RESERVATIONS aside ───────────────────────────────────── */
export function ReservationAside() {
  const { lang } = useLang();
  return (
    <aside className="res-aside">
      <h2 className="display">
        <T en="Before you arrive" ar="قبل وصولك" />
      </h2>
      <p>
        <T en="Tables are held for 15 minutes past the booking time. We keep each table for two hours." ar="نحتفظ بالطاولة ١٥ دقيقة بعد موعد الحجز، ومدة الجلسة ساعتان." />
      </p>
      <p>
        <T en="Private rooms seat up to 20. For larger groups, weddings or catering, " ar="تتسع الغرف الخاصة حتى ٢٠ ضيفاً. للمجموعات الأكبر أو الأعراس أو الولائم، " />
        <Link href="/events" className="text-gold underline underline-offset-4">
          <T en="send an event enquiry" ar="أرسل استفساراً" />
        </Link>
        .
      </p>
      <p>
        <T en="Already booked? " ar="لديك حجز؟ " />
        <Link href="/reservations/manage" className="text-gold underline underline-offset-4">
          <T en="Change or cancel it here" ar="عدّله أو ألغِه من هنا" />
        </Link>
        .
      </p>
      <p>
        <T en="Prefer to talk? " ar="تفضّل الحديث؟ " />
        <a href={waLink()} className="text-gold underline underline-offset-4" target="_blank" rel="noopener">
          WhatsApp
        </a>{" "}
        {lang === "ar" ? "أو" : "or"}{" "}
        <a href={`tel:${restaurant.phoneE164}`} className="text-gold underline underline-offset-4" dir="ltr">
          {restaurant.phone}
        </a>
      </p>
    </aside>
  );
}
