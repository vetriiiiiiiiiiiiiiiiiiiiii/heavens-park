import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const [items, subscribers] = await Promise.all([
    db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    db.subscriber.count(),
  ]);
  return NextResponse.json({ items, subscribers });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const p = z.object({ id: z.string(), status: z.enum(["new", "contacted", "closed"]) }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  return NextResponse.json(await db.enquiry.update({ where: { id: p.data.id }, data: { status: p.data.status } }));
}
