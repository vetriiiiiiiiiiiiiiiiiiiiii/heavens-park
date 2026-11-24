import { NextResponse } from "next/server";
import { checkPassword, createSession } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`admin:${clientIp(req)}`, 5, 5 * 60_000)) return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !checkPassword(password)) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  await createSession();
  return NextResponse.json({ ok: true });
}
