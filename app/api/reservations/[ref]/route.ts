import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { firstError, modifySchema, normalisePhone } from "@/lib/validation";
import { isBookableDateTime, isSlotAvailable } from "@/lib/availability";
import { notifyBooking } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { Seating } from "@/content/restaurant";

type Ctx = { params: Promise<{ ref: string }> };

const pub = (r: { ref: string; name: string; date: string; time: string; guests: number; seating: string; status: string; occasion: string | null }) => ({
  ref: r.ref,
  name: r.name,
  date: r.date,
  time: r.time,
  guests: r.guests,
  seating: r.seating,
  status: r.status,
  occasion: r.occasion,
});

/** Guest must prove ownership with the phone number used to book. */
async function load(ref: string, phoneRaw: string | null) {
  if (!phoneRaw) return null;
  const r = await db.reservation.findUnique({ where: { ref: ref.toUpperCase().trim() } });
  if (!r || r.phone !== normalisePhone(phoneRaw)) return null;
  return r;
}

export async function GET(req: Request, { params }: Ctx) {
  if (!rateLimit(`lookup:${clientIp(req)}`, 15)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const { ref } = await params;
  const r = await load(ref, new URL(req.url).searchParams.get("phone"));
  if (!r) return NextResponse.json({ error: "We couldn't find a booking with that reference and phone number." }, { status: 404 });
  return NextResponse.json(pub(r));
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!rateLimit(`modify:${clientIp(req)}`, 10)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const { ref } = await params;
  const parsed = modifySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json(firstError(parsed.error), { status: 400 });
  const d = parsed.data;
  const r = await load(ref, d.phone);
  if (!r) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (r.status !== "confirmed") return NextResponse.json({ error: "This booking can no longer be changed." }, { status: 409 });
  if (!isBookableDateTime(d.date, d.time)) return NextResponse.json({ error: "That time can't be booked.", field: "time" }, { status: 409 });

  const updated = await db.$transaction(
    async (tx) => {
      if (!(await isSlotAvailable(d.date, d.time, d.seating as Seating, d.guests, r.ref, tx))) return null;
      return tx.reservation.update({ where: { ref: r.ref }, data: { date: d.date, time: d.time, guests: d.guests, seating: d.seating } });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
  if (!updated) return NextResponse.json({ error: "That time is fully booked. Please choose another.", field: "time" }, { status: 409 });
  notifyBooking(updated, "modified").catch(() => {});
  return NextResponse.json(pub(updated));
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!rateLimit(`cancel:${clientIp(req)}`, 10)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const { ref } = await params;
  const body = await req.json().catch(() => ({}));
  const r = await load(ref, body?.phone ?? null);
  if (!r) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (r.status === "cancelled") return NextResponse.json(pub(r));
  const updated = await db.reservation.update({ where: { ref: r.ref }, data: { status: "cancelled" } });
  notifyBooking(updated, "cancelled").catch(() => {});
  return NextResponse.json(pub(updated));
}
