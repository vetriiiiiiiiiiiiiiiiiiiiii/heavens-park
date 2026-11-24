"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { bookingConfig, SEATINGS, waLink, type Seating } from "@/content/restaurant";
import { useLang } from "@/components/i18n/LangProvider";

type Booking = { ref: string; name: string; date: string; time: string; guests: number; seating: Seating; status: string };
type Slot = { time: string; available: boolean };

const STATUS = {
  confirmed: { en: "Confirmed", ar: "مؤكد" },
  cancelled: { en: "Cancelled", ar: "ملغى" },
  seated: { en: "Seated", ar: "تم الجلوس" },
  completed: { en: "Completed", ar: "مكتمل" },
  no_show: { en: "No-show", ar: "لم يحضر" },
} as Record<string, { en: string; ar: string }>;

export function ManageBooking() {
  const { t, lang } = useLang();
  const sp = useSearchParams();
  const [ref, setRef] = useState(sp.get("ref") || "");
  const [phone, setPhone] = useState("");
  const [b, setB] = useState<Booking | null>(null);
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState<{ date: string; time: string; guests: number; seating: Seating } | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (!edit || !b) return;
    fetch(`/api/availability?date=${edit.date}&guests=${edit.guests}&seating=${edit.seating}&exclude=${b.ref}`)
      .then((r) => r.json())
      .then((j) => setSlots(j.slots || []));
  }, [edit?.date, edit?.guests, edit?.seating, b]); // eslint-disable-line react-hooks/exhaustive-deps

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const r = await fetch(`/api/reservations/${encodeURIComponent(ref.trim())}?phone=${encodeURIComponent(phone)}`);
    const j = await r.json();
    setBusy(false);
    if (!r.ok) return setMsg({ text: j.error, err: true });
    setB(j);
  }

  async function save() {
    if (!edit || !b) return;
    setBusy(true);
    const r = await fetch(`/api/reservations/${b.ref}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...edit, phone }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) return setMsg({ text: j.error, err: true });
    setB(j);
    setEdit(null);
    setMsg({ text: lang === "ar" ? "تم تحديث حجزك." : "Your booking has been updated." });
  }

  async function cancel() {
    if (!b) return;
    setBusy(true);
    const r = await fetch(`/api/reservations/${b.ref}`, { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ phone }) });
    const j = await r.json();
    setBusy(false);
    setConfirmCancel(false);
    if (!r.ok) return setMsg({ text: j.error, err: true });
    setB(j);
    setMsg({ text: lang === "ar" ? "تم إلغاء الحجز. نأمل أن نراك قريباً." : "Your booking is cancelled. We hope to welcome you another time." });
  }

  if (!b) {
    return (
      <form onSubmit={lookup} className="manage-lookup">
        <div className="field">
          <label htmlFor="m-ref">{lang === "ar" ? "رقم الحجز" : "Booking reference"}</label>
          <input id="m-ref" required dir="ltr" placeholder="HP-XXXXXX" value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} />
        </div>
        <div className="field">
          <label htmlFor="m-phone">{lang === "ar" ? "رقم الهاتف المستخدم في الحجز" : "Phone number used to book"}</label>
          <input id="m-phone" required type="tel" dir="ltr" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button className="btn-arch" disabled={busy}>
          {busy ? "…" : lang === "ar" ? "اعثر على حجزي" : "Find my booking"}
        </button>
        <p className={`form-msg ${msg?.err ? "is-err" : ""}`} role="alert">
          {msg?.text}
        </p>
      </form>
    );
  }

  return (
    <div className="manage-card">
      <div className="manage-head">
        <span className="booking-ref" dir="ltr">
          {b.ref}
        </span>
        <span className={`status status--${b.status}`}>{t(STATUS[b.status] || STATUS.confirmed)}</span>
      </div>
      {!edit ? (
        <>
          <dl className="booking-done-list">
            <div>
              <dt>{lang === "ar" ? "الاسم" : "Name"}</dt>
              <dd>{b.name}</dd>
            </div>
            <div>
              <dt>{lang === "ar" ? "التاريخ" : "Date"}</dt>
              <dd>{new Date(`${b.date}T12:00:00`).toLocaleDateString(lang === "ar" ? "ar" : "en-GB", { weekday: "long", day: "numeric", month: "long" })}</dd>
            </div>
            <div>
              <dt>{lang === "ar" ? "الوقت" : "Time"}</dt>
              <dd dir="ltr">{b.time}</dd>
            </div>
            <div>
              <dt>{lang === "ar" ? "الضيوف" : "Guests"}</dt>
              <dd>{b.guests}</dd>
            </div>
            <div>
              <dt>{lang === "ar" ? "الجلسة" : "Seating"}</dt>
              <dd>{t(bookingConfig.seating[b.seating].label)}</dd>
            </div>
          </dl>
          {b.status === "confirmed" && (
            <div className="booking-done-actions">
              <button className="btn-arch" onClick={() => setEdit({ date: b.date, time: b.time, guests: b.guests, seating: b.seating })}>
                {lang === "ar" ? "تعديل الحجز" : "Change booking"}
              </button>
              {!confirmCancel ? (
                <button className="link-line" onClick={() => setConfirmCancel(true)}>
                  {lang === "ar" ? "إلغاء الحجز" : "Cancel booking"}
                </button>
              ) : (
                <span className="confirm-cancel">
                  {lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?"}
                  <button className="link-line text-[#e08b6d]" onClick={cancel} disabled={busy}>
                    {lang === "ar" ? "نعم، ألغِ" : "Yes, cancel"}
                  </button>
                  <button className="link-quiet" onClick={() => setConfirmCancel(false)}>
                    {lang === "ar" ? "لا" : "Keep it"}
                  </button>
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="manage-edit">
          <div className="manage-edit-grid">
            <div className="field">
              <label htmlFor="e-date">{lang === "ar" ? "التاريخ" : "Date"}</label>
              <input id="e-date" type="date" value={edit.date} onChange={(e) => setEdit({ ...edit, date: e.target.value, time: "" })} />
            </div>
            <div className="field">
              <label htmlFor="e-guests">{lang === "ar" ? "الضيوف" : "Guests"}</label>
              <input id="e-guests" type="number" min={1} max={bookingConfig.maxGuests} value={edit.guests} onChange={(e) => setEdit({ ...edit, guests: Number(e.target.value) || 1 })} />
            </div>
            <div className="field">
              <label htmlFor="e-seat">{lang === "ar" ? "الجلسة" : "Seating"}</label>
              <select id="e-seat" value={edit.seating} onChange={(e) => setEdit({ ...edit, seating: e.target.value as Seating })}>
                {SEATINGS.map((s) => (
                  <option key={s} value={s}>
                    {t(bookingConfig.seating[s].label)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field mt-6">
            <span className="label">{lang === "ar" ? "الوقت" : "Time"}</span>
            <div className="choice-row">
              {slots.filter((s) => s.available).length === 0 && <p className="booking-hint">{lang === "ar" ? "لا توجد أوقات متاحة." : "No open times for this choice."}</p>}
              {slots
                .filter((s) => s.available)
                .map((s) => (
                  <label key={s.time} className="choice choice--slot">
                    <input type="radio" name="etime" checked={edit.time === s.time} onChange={() => setEdit({ ...edit, time: s.time })} />
                    <span dir="ltr">{s.time}</span>
                  </label>
                ))}
            </div>
          </div>
          <div className="booking-done-actions">
            <button className="btn-arch" onClick={save} disabled={busy || !edit.time}>
              {lang === "ar" ? "حفظ التغييرات" : "Save changes"}
            </button>
            <button className="link-quiet" onClick={() => setEdit(null)}>
              {lang === "ar" ? "رجوع" : "Back"}
            </button>
          </div>
        </div>
      )}
      <p className={`form-msg mt-6 ${msg?.err ? "is-err" : ""}`} role="status">
        {msg?.text}
      </p>
      <p className="booking-hint mt-2">
        {lang === "ar" ? "تحتاج مساعدة؟ " : "Need a hand? "}
        <a className="text-gold" href={waLink(`Salaam, about booking ${b.ref}…`)} target="_blank" rel="noopener">
          WhatsApp
        </a>
      </p>
    </div>
  );
}
