import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`nl:${clientIp(req)}`, 5)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const parsed = z.object({ email: z.string().trim().toLowerCase().email().max(120) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  await db.subscriber.upsert({ where: { email: parsed.data.email }, create: { email: parsed.data.email }, update: {} });
  return NextResponse.json({ ok: true });
}
