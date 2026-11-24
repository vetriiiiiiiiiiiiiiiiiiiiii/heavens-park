import { bookingConfig, restaurant, type Seating } from "@/content/restaurant";
import { db } from "./db";
import type { Prisma } from "@prisma/client";

type Client = typeof db | Prisma.TransactionClient;
import { addDays, dayOfWeek, fromMin, nowInRestaurant, toMin } from "./time";

export type Slot = { time: string; available: boolean; remaining: number };

/** All bookable start times for a date, ignoring capacity. */
export function slotTimes(date: string): string[] {
  const hours = restaurant.bookingHours[dayOfWeek(date)];
  if (!hours) return [];
  const open = toMin(hours[0]);
  const close = toMin(hours[1]) + (hours[1] === "23:59" ? 1 : 0);
  const last = close - bookingConfig.lastBookingBeforeClose;
  const out: string[] = [];
  for (let m = open; m <= last; m += bookingConfig.slotMinutes) out.push(fromMin(m));
  return out;
}

export function dateWindow() {
  const now = nowInRestaurant();
  return { min: now.date, max: addDays(now.date, bookingConfig.maxDaysAhead) };
}

export function isBookableDateTime(date: string, time: string) {
  const { min, max } = dateWindow();
  if (date < min || date > max) return false;
  if (!slotTimes(date).includes(time)) return false;
  const now = nowInRestaurant();
  if (date === now.date && toMin(time) < now.minutes + bookingConfig.minLeadMinutes) return false;
  return true;
}

/** Load per slot for a seating, from overlapping confirmed bookings. */
export async function getAvailability(date: string, seating: Seating, guests: number, excludeRef?: string, client: Client = db): Promise<Slot[]> {
  const cfg = bookingConfig.seating[seating];
  const bookings = await client.reservation.findMany({
    where: { date, seating, status: { in: ["confirmed", "seated"] }, ...(excludeRef ? { NOT: { ref: excludeRef } } : {}) },
    select: { time: true, guests: true },
  });
  const sit = bookingConfig.sittingMinutes;
  return slotTimes(date).map((time) => {
    const s = toMin(time);
    const overlapping = bookings.filter((b) => {
      const b0 = toMin(b.time);
      return b0 < s + sit && s < b0 + sit;
    });
    const used = cfg.unit === "rooms" ? overlapping.length : overlapping.reduce((a, b) => a + b.guests, 0);
    const need = cfg.unit === "rooms" ? 1 : guests;
    const remaining = Math.max(0, cfg.capacity - used);
    const fitsRoom = cfg.unit !== "rooms" || guests <= (cfg as { maxGuests?: number }).maxGuests!;
    return { time, remaining, available: remaining >= need && fitsRoom && isBookableDateTime(date, time) };
  });
}

export async function isSlotAvailable(date: string, time: string, seating: Seating, guests: number, excludeRef?: string, client: Client = db) {
  const slots = await getAvailability(date, seating, guests, excludeRef, client);
  return slots.find((s) => s.time === time)?.available ?? false;
}
