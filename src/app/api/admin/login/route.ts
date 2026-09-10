import { NextResponse } from "next/server";
import {
  adminPassword,
  isAdminEnabled,
  sessionValue,
  ADMIN_SESSION_MAX_AGE,
} from "@/lib/auth";

const COOKIE = "hm_admin";

export async function POST(request: Request) {
  if (!isAdminEnabled()) {
    return NextResponse.json(
      { error: "Admin is not configured. Set the ADMIN_PASSWORD environment variable." },
      { status: 400 },
    );
  }
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!body.password || body.password !== adminPassword()) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}
