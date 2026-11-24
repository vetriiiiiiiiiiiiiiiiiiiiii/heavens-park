import { NextResponse } from "next/server";
import { SEATINGS, type Seating } from "@/content/restaurant";
import { dateWindow, getAvailability } from "@/lib/availability";

export const dynamic = "force-dynamic";

/** GET /api/availability?date=YYYY-MM-DD&guests=4&seating=family[&exclude=REF] */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date") || "";
  const guests = Math.max(1, Math.min(50, Number(url.searchParams.get("guests") || 2)));
  const seating = (url.searchParams.get("seating") || "family") as Seating;
  const exclude = url.searchParams.get("exclude") || undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !SEATINGS.includes(seating)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const win = dateWindow();
  if (date < win.min || date > win.max) return NextResponse.json({ slots: [], window: win });
  const slots = await getAvailability(date, seating, guests, exclude);
  return NextResponse.json({ slots, window: win }, { headers: { "Cache-Control": "no-store" } });
}
