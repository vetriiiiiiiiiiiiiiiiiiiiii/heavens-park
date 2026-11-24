import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { notifyBooking } from "@/lib/notify";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const url = new URL(req.url);
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || from;
  const q = (url.searchParams.get("q") || "").trim();
  const where = q
    ? { OR: [{ ref: { contains: q.toUpperCase() } }, { name: { contains: q } }, { phone: { contains: q.replace(/\s/g, "") } }] }
    : { date: { gte: from, lte: to } };
  const items = await db.reservation.findMany({ where, orderBy: [{ date: "asc" }, { time: "asc" }], take: 500 });
  return NextResponse.json({ items });
}

const patch = z.object({ ref: z.string(), status: z.enum(["confirmed", "seated", "completed", "cancelled", "no_show"]) });

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const p = patch.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const r = await db.reservation.update({ where: { ref: p.data.ref }, data: { status: p.data.status } });
  if (p.data.status === "cancelled") notifyBooking(r, "cancelled").catch(() => {});
  return NextResponse.json(r);
}
