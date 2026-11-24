/**
 * Booking notifications. Each channel activates only when its env vars are set:
 *   Email     — RESEND_API_KEY, EMAIL_FROM (+ STAFF_NOTIFY_EMAIL for staff copy)
 *   SMS       — TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM
 *   WhatsApp  — same Twilio creds + TWILIO_WHATSAPP_FROM (approved template sender)
 * Failures are logged and never block the booking itself.
 */
import { restaurant } from "@/content/restaurant";

type Booking = {
  ref: string;
  name: string;
  phone: string;
  email?: string | null;
  date: string;
  time: string;
  guests: number;
  seating: string;
  status: string;
};

type Kind = "created" | "modified" | "cancelled";

function message(b: Booking, kind: Kind) {
  const head =
    kind === "cancelled"
      ? `Your reservation ${b.ref} at ${restaurant.name.en} has been cancelled.`
      : `${kind === "modified" ? "Updated: " : ""}Your table at ${restaurant.name.en} is confirmed.`;
  return `${head}\nRef: ${b.ref}\n${b.date} at ${b.time} · ${b.guests} guest${b.guests > 1 ? "s" : ""} · ${b.seating}\nManage: ${process.env.SITE_URL || ""}/reservations/manage\n${restaurant.phone}`;
}

async function email(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, text }),
  });
  if (!r.ok) console.error("[notify] email failed", r.status, await r.text());
}

async function twilio(to: string, from: string | undefined, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const tok = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !tok || !from) return;
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${sid}:${tok}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  if (!r.ok) console.error("[notify] twilio failed", r.status, await r.text());
}

export async function notifyBooking(b: Booking, kind: Kind) {
  const text = message(b, kind);
  const subject = kind === "cancelled" ? `Reservation cancelled — ${b.ref}` : `Your table at ${restaurant.name.en} — ${b.ref}`;
  const jobs: Promise<unknown>[] = [];
  if (b.email) jobs.push(email(b.email, subject, text));
  if (process.env.STAFF_NOTIFY_EMAIL) jobs.push(email(process.env.STAFF_NOTIFY_EMAIL, `[${kind}] ${b.ref} — ${b.name}`, `${text}\nGuest phone: ${b.phone}`));
  jobs.push(twilio(b.phone, process.env.TWILIO_SMS_FROM, text));
  if (process.env.TWILIO_WHATSAPP_FROM) jobs.push(twilio(`whatsapp:${b.phone}`, `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`, text));
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("[notify]", r.reason));
  if (process.env.NODE_ENV !== "production") console.info(`[notify:${kind}]\n${text}`);
}

export async function notifyEnquiry(e: { name: string; phone: string; eventType: string; date?: string; guests?: number; message?: string }) {
  if (!process.env.STAFF_NOTIFY_EMAIL) return;
  await email(
    process.env.STAFF_NOTIFY_EMAIL,
    `New event enquiry — ${e.eventType} — ${e.name}`,
    `${e.name} (${e.phone})\n${e.eventType} · ${e.date || "date tbc"} · ${e.guests || "?"} guests\n\n${e.message || ""}`,
  ).catch((err) => console.error("[notify] enquiry", err));
}
