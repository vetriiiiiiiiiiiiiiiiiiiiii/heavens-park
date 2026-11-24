import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enquirySchema, firstError } from "@/lib/validation";
import { notifyEnquiry } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`enq:${clientIp(req)}`, 5)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const parsed = enquirySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json(firstError(parsed.error), { status: 400 });
  const { website, ...d } = parsed.data;
  if (website) return NextResponse.json({ error: "Rejected" }, { status: 400 });
  const e = await db.enquiry.create({ data: { ...d, email: d.email ?? null, date: d.date || null, guests: d.guests ?? null, message: d.message || null } });
  notifyEnquiry({ ...d }).catch(() => {});
  return NextResponse.json({ ok: true, id: e.id }, { status: 201 });
}
