import { NextResponse } from "next/server";
import {
  adminPassword,
  isAdminEnabled,
  sessionValue,
  ADMIN_SESSION_MAX_AGE,
} from "@/lib/auth";

const COOKIE = "hm_admin";
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/* In-memory, per-instance throttle (Vercel instances are isolated, so this is a
 * best-effort guard rather than a universal lockout). Keyed by connecting IP. */
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  if (!isAdminEnabled()) {
    return NextResponse.json(
      { error: "Admin is not configured. Set the ADMIN_PASSWORD environment variable." },
      { status: 400 },
    );
  }

  const key = rateKey(request);
  const now = Date.now();
  const existing = attempts.get(key);
  if (existing && existing.resetAt > now && existing.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!body.password || body.password !== adminPassword()) {
    if (existing && existing.resetAt > now) {
      existing.count += 1;
    } else {
      attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    }
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }

  attempts.delete(key);
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
