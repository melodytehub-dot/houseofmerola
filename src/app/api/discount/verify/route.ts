import { NextResponse } from "next/server";
import { verifySubscriberByToken } from "@/lib/content";

export const dynamic = "force-dynamic";

/** Consume an emailed verification token (used by /discount/verify). */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!token) {
    return NextResponse.json({ error: "This verification link is incomplete." }, { status: 400 });
  }
  const sub = await verifySubscriberByToken(token);
  if (!sub) {
    return NextResponse.json(
      { error: "This link has expired or was already used. Please join again and we’ll send a fresh one." },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true, email: sub.email });
}
