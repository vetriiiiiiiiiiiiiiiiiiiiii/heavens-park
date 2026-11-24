"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { bookingConfig, occasions, restaurant, SEATINGS, waLink, type Seating } from "@/content/restaurant";
import { useLang } from "@/components/i18n/LangProvider";
import { Star8 } from "@/components/ui/Ornament";
import { hijri, num } from "@/components/ui/Arabic";

type Slot = { time: string; available: boolean; remaining: number };
type Confirmed = { ref: string; name: string; date: string; time: string; guests: number; seating: string };

const L = {
  guests: { en: "Guests", ar: "عدد الضيوف" },
  date: { en: "Date", ar: "التاريخ" },
  seating: { en: "Seating", ar: "الجلسة" },
  time: { en: "Time", ar: "الوقت" },
  name: { en: "Full name", ar: "الاسم الكامل" },
  phone: { en: "Phone (WhatsApp preferred)", ar: "رقم الهاتف (يُفضّل واتساب)" },
  email: { en: "Email — optional", ar: "البريد الإلكتروني — اختياري" },
  occasion: { en: "Occasion", ar: "المناسبة" },
  notes: { en: "Anything we should know?", ar: "هل هناك ما ينبغي أن نعرفه؟" },
  notesPh: { en: "High chair, allergies, a quiet corner…", ar: "كرسي أطفال، حساسية طعام، ركن هادئ…" },
  pickDate: { en: "Choose a date to see open tables.", ar: "اختر تاريخاً لعرض الطاولات المتاحة." },
  loading: { en: "Checking the floor…", ar: "نتحقق من الطاولات…" },
  none: { en: "Fully booked for this choice — try another date or seating, or message us on WhatsApp.", ar: "لا توجد طاولات متاحة لهذا الاختيار — جرّب تاريخاً أو جلسة أخرى، أو راسلنا عبر واتساب." },
  confirm: { en: "Confirm reservation", ar: "تأكيد الحجز" },
  sending: { en: "Reserving…", ar: "جارٍ الحجز…" },
  lunch: { en: "Afternoon", ar: "الظهيرة" },
  dinner: { en: "Evening", ar: "المساء" },
};

function fmtDate(d: string, lang: "en" | "ar") {
  return new Date(`${d}T12:00:00`).toLocaleDateString(lang === "ar" ? "ar" : "en-GB", { weekday: "long", day: "numeric", month: "long" });
}

function icsFile(c: Confirmed) {
  const dt = (d: string, t: string, addMin = 0) => {
    const x = new Date(`${d}T${t}:00`);
    x.setMinutes(x.getMinutes() + addMin);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`;
  };
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Heavens Park//Reservations//EN",
    "BEGIN:VEVENT",
    `UID:${c.ref}@heavenspark`,
    `DTSTART:${dt(c.date, c.time)}`,
    `DTEND:${dt(c.date, c.time, bookingConfig.sittingMinutes)}`,
    `SUMMARY:Dinner at ${restaurant.name.en} (${c.ref})`,
    `LOCATION:${restaurant.address.line1.en}, ${restaurant.address.line2.en}`,
    `DESCRIPTION:${c.guests} guests · ref ${c.ref}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
}

export function BookingForm({ variant = "full" }: { variant?: "full" | "inline" }) {
  const { t, lang } = useLang();
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [seating, setSeating] = useState<Seating>("family");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [win, setWin] = useState<{ min: string; max: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", occasion: "", notes: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ error: string; field?: string } | null>(null);
  const [done, setDone] = useState<Confirmed | null>(null);
  const autoAdvanced = useRef(false);

  // first load: get the booking window & default date (today)
  useEffect(() => {
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    fetch(`/api/availability?date=${iso}&guests=2&seating=family`)
      .then((r) => r.json())
      .then((j) => {
        if (j.window) {
          setWin(j.window);
          setDate(j.window.min);
        }
      })
      .catch(() => {});
  }, []);

  // live availability
  useEffect(() => {
    if (!date) return;
    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/availability?date=${date}&guests=${guests}&seating=${seating}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j) => {
        const list: Slot[] = j.slots || [];
        // late in the evening, today may be full — quietly move to tomorrow once
        if (!autoAdvanced.current && win && date === win.min && !list.some((s) => s.available)) {
          autoAdvanced.current = true;
          const d = new Date(`${date}T00:00:00Z`);
          d.setUTCDate(d.getUTCDate() + 1);
          setDate(d.toISOString().slice(0, 10));
          return;
        }
        autoAdvanced.current = true;
        setSlots(list);
        setLoading(false);
      })
      .catch((e) => e.name !== "AbortError" && setLoading(false));
    return () => ctrl.abort();
  }, [date, guests, seating, win]);

  // drop a chosen time that became unavailable
  useEffect(() => {
    if (time && slots && !slots.find((s) => s.time === time && s.available)) setTime("");
  }, [slots, time]);

  const groups = useMemo(() => {
    const open = (slots || []).filter((s) => s.available);
    return {
      lunch: open.filter((s) => s.time < "17:00"),
      dinner: open.filter((s) => s.time >= "17:00"),
    };
  }, [slots]);

  const maxGuests = seating === "private" ? bookingConfig.seating.private.maxGuests : bookingConfig.maxGuests;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!time) return setError({ error: lang === "ar" ? "اختر وقتاً من الأوقات المتاحة." : "Please choose a time.", field: "time" });
    setBusy(true);
    try {
      const r = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, date, time, guests, seating, locale: lang }),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j);
        if (j.field === "time") {
          // refresh slots after a conflict
          setSlots(null);
          fetch(`/api/availability?date=${date}&guests=${guests}&seating=${seating}`)
            .then((x) => x.json())
            .then((x) => setSlots(x.slots || []));
        }
      } else {
        setDone(j);
        requestAnimationFrame(() => document.getElementById("booking-done")?.scrollIntoView({ behavior: "smooth", block: "center" }));
      }
    } catch {
      setError({ error: lang === "ar" ? "تعذّر الاتصال. حاول مرة أخرى." : "Connection problem. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    const seatLabel = t(bookingConfig.seating[done.seating as Seating].label);
    const wa = waLink(`Salaam! My reservation ref is ${done.ref} — ${done.date} at ${done.time}, ${done.guests} guests.`);
    return (
      <div id="booking-done" className={`booking-done booking--${variant}`} role="status">
        <Star8 size={30} className="text-gold" />
        <p className="eyebrow mt-6">{lang === "ar" ? "تم تأكيد طاولتك" : "Your table is confirmed"}</p>
        <h3 className="display booking-done-title">{lang === "ar" ? `أهلاً بك، ${done.name.split(" ")[0]}` : `We’ll be waiting, ${done.name.split(" ")[0]}.`}</h3>
        <dl className="booking-done-list">
          <div>
            <dt>{lang === "ar" ? "رقم الحجز" : "Reference"}</dt>
            <dd className="booking-ref" dir="ltr">
              {done.ref}
            </dd>
          </div>
          <div>
            <dt>{t(L.date)}</dt>
            <dd>
              {fmtDate(done.date, lang)}
              <span className="date-hijri">{hijri(done.date, lang)}</span>
            </dd>
          </div>
          <div>
            <dt>{t(L.time)}</dt>
            <dd dir="ltr">{num(done.time, lang)}</dd>
          </div>
          <div>
            <dt>{t(L.guests)}</dt>
            <dd>{done.guests}</dd>
          </div>
          <div>
            <dt>{t(L.seating)}</dt>
            <dd>{seatLabel}</dd>
          </div>
        </dl>
        <p className="booking-done-note">
          {lang === "ar"
            ? "احتفظ برقم الحجز. يمكنك تعديل الحجز أو إلغاؤه في أي وقت باستخدام الرقم ورقم هاتفك."
            : "Keep your reference. You can change or cancel any time with it and your phone number."}
        </p>
        <div className="booking-done-actions">
          <a className="btn-arch" href={wa} target="_blank" rel="noopener">
            {lang === "ar" ? "أرسل التأكيد عبر واتساب" : "Confirm on WhatsApp"}
          </a>
          <a className="link-line" href={icsFile(done)} download={`heavens-park-${done.ref}.ics`}>
            {lang === "ar" ? "أضف إلى التقويم" : "Add to calendar"}
          </a>
          <Link className="link-line" href={`/reservations/manage?ref=${done.ref}`}>
            {lang === "ar" ? "إدارة الحجز" : "Manage booking"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className={`booking booking--${variant}`} onSubmit={submit} noValidate>
      {/* 1 — when */}
      <fieldset className="booking-when">
        <legend className="sr-only">{lang === "ar" ? "تفاصيل الحجز" : "Booking details"}</legend>

        <div className="field">
          <span className="label" id="guests-label">
            {t(L.guests)}
          </span>
          <div className="stepper" role="group" aria-labelledby="guests-label">
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests" disabled={guests <= 1}>
              −
            </button>
            <output aria-live="polite">{num(guests, lang)}</output>
            <button type="button" onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))} aria-label="More guests" disabled={guests >= maxGuests}>
              +
            </button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="bk-date">{t(L.date)}</label>
          <input id="bk-date" type="date" required value={date} min={win?.min} max={win?.max} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="field booking-seating">
          <span className="label">{t(L.seating)}</span>
          <div className="choice-row">
            {SEATINGS.map((s) => (
              <label key={s} className="choice">
                <input type="radio" name="seating" value={s} checked={seating === s} onChange={() => setSeating(s)} />
                <span>{t(bookingConfig.seating[s].label)}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* 2 — time slots, live */}
      <div className="field booking-times" aria-live="polite">
        <span className="label">{t(L.time)}</span>
        {!date ? (
          <p className="booking-hint">{t(L.pickDate)}</p>
        ) : loading && !slots ? (
          <p className="booking-hint">{t(L.loading)}</p>
        ) : groups.lunch.length + groups.dinner.length === 0 ? (
          <p className="booking-hint">
            {t(L.none)}{" "}
            <a className="text-gold underline" href={waLink()} target="_blank" rel="noopener">
              WhatsApp
            </a>
          </p>
        ) : (
          <div className={`slot-groups ${loading ? "is-loading" : ""}`}>
            {(["lunch", "dinner"] as const).map(
              (g) =>
                groups[g].length > 0 && (
                  <div key={g} className="slot-group">
                    <span className="slot-group-label">{t(L[g])}</span>
                    <div className="choice-row">
                      {groups[g].map((s) => (
                        <label key={s.time} className="choice choice--slot">
                          <input type="radio" name="time" value={s.time} checked={time === s.time} onChange={() => setTime(s.time)} />
                          <span dir="ltr">{num(s.time, lang)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ),
            )}
          </div>
        )}
        {error?.field === "time" && <p className="err">{error.error}</p>}
      </div>

      {/* 3 — who */}
      <div className="booking-who">
        <div className="field">
          <label htmlFor="bk-name">{t(L.name)}</label>
          <input id="bk-name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {error?.field === "name" && <p className="err">{error.error}</p>}
        </div>
        <div className="field">
          <label htmlFor="bk-phone">{t(L.phone)}</label>
          <input id="bk-phone" required type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {error?.field === "phone" && <p className="err">{error.error}</p>}
        </div>
        <div className="field">
          <label htmlFor="bk-email">{t(L.email)}</label>
          <input id="bk-email" type="email" autoComplete="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {error?.field === "email" && <p className="err">{error.error}</p>}
        </div>
        <div className="field">
          <label htmlFor="bk-occasion">{t(L.occasion)}</label>
          <select id="bk-occasion" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
            {occasions.map((o) => (
              <option key={o.id} value={o.id}>
                {t(o.label)}
              </option>
            ))}
          </select>
        </div>
        {variant === "full" && (
          <div className="field booking-notes">
            <label htmlFor="bk-notes">{t(L.notes)}</label>
            <textarea id="bk-notes" rows={3} placeholder={t(L.notesPh)} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        )}
        {/* honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp-field" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} aria-hidden />
      </div>

      <div className="booking-submit">
        <button type="submit" className="btn-arch" disabled={busy}>
          {busy ? t(L.sending) : t(L.confirm)}
        </button>
        <p className={`form-msg ${error && error.field !== "time" ? "is-err" : ""}`} role="alert">
          {error && error.field !== "time" ? error.error : time ? `${fmtDate(date, lang)} (${hijri(date, lang)}) · ${num(time, lang)} · ${num(guests, lang)} ${lang === "ar" ? "ضيوف" : guests > 1 ? "guests" : "guest"}` : ""}
        </p>
      </div>
    </form>
  );
}
