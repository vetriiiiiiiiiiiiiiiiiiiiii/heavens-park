import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { firstError, reservationSchema } from "@/lib/validation";
import { isBookableDateTime, isSlotAvailable } from "@/lib/availability";
import { notifyBooking } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { toMin } from "@/lib/time";
import { bookingConfig, type Seating } from "@/content/restaurant";

const ALPH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeRef = () => "HP-" + Array.from({ length: 6 }, () => ALPH[randomInt(ALPH.length)]).join("");

export async function POST(req: Request) {
  if (!rateLimit(`book:${clientIp(req)}`, 6)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute and try again." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(firstError(parsed.error), { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ error: "Rejected" }, { status: 400 }); // bot

  if (!isBookableDateTime(d.date, d.time)) {
    return NextResponse.json({ error: "That time can no longer be booked. Please choose another.", field: "time" }, { status: 409 });
  }

  try {
    const result = await db.$transaction(
      async (tx) => {
        // Duplicate guard: same phone, same day, within one sitting window
        const sameDay = await tx.reservation.findMany({
          where: { phone: d.phone, date: d.date, status: { in: ["confirmed", "seated"] } },
          select: { ref: true, time: true },
        });
        const dup = sameDay.find((r) => Math.abs(toMin(r.time) - toMin(d.time)) < bookingConfig.sittingMinutes);
        if (dup) return { duplicate: dup.ref } as const;

        if (!(await isSlotAvailable(d.date, d.time, d.seating as Seating, d.guests, undefined, tx))) {
          return { full: true } as const;
        }

        for (let i = 0; i < 5; i++) {
          try {
            const r = await tx.reservation.create({
              data: {
                ref: makeRef(),
                name: d.name,
                phone: d.phone,
                email: d.email ?? null,
                date: d.date,
                time: d.time,
                guests: d.guests,
                seating: d.seating,
                occasion: d.occasion || null,
                notes: d.notes || null,
                locale: d.locale,
              },
            });
            return { reservation: r } as const;
          } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") continue; // ref clash, retry
            throw e;
          }
        }
        throw new Error("Could not allocate reference");
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    if ("duplicate" in result) {
      return NextResponse.json(
        { error: `You already have a booking around this time (ref ${result.duplicate}). You can change it from “Manage a booking”.`, ref: result.duplicate },
        { status: 409 },
      );
    }
    if ("full" in result) {
      return NextResponse.json({ error: "Sorry — that time has just filled. Please pick another slot.", field: "time" }, { status: 409 });
    }

    const r = result.reservation;
    notifyBooking(r, "created").catch(() => {});
    return NextResponse.json(
      { ref: r.ref, name: r.name, date: r.date, time: r.time, guests: r.guests, seating: r.seating, status: r.status },
      { status: 201 },
    );
  } catch (e) {
    console.error("[reservations] create failed", e);
    return NextResponse.json({ error: "We couldn't save your booking. Please try again or call us." }, { status: 500 });
  }
}
