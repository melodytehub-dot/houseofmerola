import { randomBytes } from "crypto";
import type { PromoCode } from "./site";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Verification links stay valid for 48 hours. */
export const VERIFY_TTL_MS = 48 * 60 * 60 * 1000;

export function newVerifyToken(): { token: string; expiresAt: string } {
  return {
    token: randomBytes(32).toString("hex"),
    expiresAt: new Date(Date.now() + VERIFY_TTL_MS).toISOString(),
  };
}

/** Memorable, unambiguous codes such as MEROLA-K7Q2XD. */
export function generatePromoCode(): string {
  const bytes = randomBytes(6);
  let suffix = "";
  for (const b of bytes) suffix += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return `MEROLA-${suffix}`;
}

export type PromoCheck =
  | { ok: true; promo: PromoCode }
  | { ok: false; error: string };

/**
 * Single source of truth for code validity: the code must exist, be
 * active, unexpired, unused, and bound to the checkout email.
 */
export function checkPromoForEmail(
  promos: PromoCode[],
  code: string,
  email: string,
  now = new Date(),
): PromoCheck {
  const wanted = code.trim().toUpperCase();
  const promo = promos.find((p) => p.code.toUpperCase() === wanted);
  if (!promo) return { ok: false, error: "We don’t recognise that code. Please check it and try again." };
  if (!promo.active) return { ok: false, error: "That code has been disabled. Please contact the studio if you need help." };
  if (promo.usedAt) return { ok: false, error: "That code has already been used." };
  if (promo.expiresAt <= now.toISOString()) {
    return { ok: false, error: "That code has expired." };
  }
  if (promo.email.toLowerCase() !== email.trim().toLowerCase()) {
    return {
      ok: false,
      error: "That code was issued to a different email address. Please check out with the email your code was sent to.",
    };
  }
  return { ok: true, promo };
}

export function promoExpired(promo: PromoCode, now = new Date()): boolean {
  return promo.expiresAt <= now.toISOString();
}

/** Whole days remaining, for admin display. */
export function promoDaysLeft(promo: PromoCode, now = new Date()): number {
  return Math.max(0, Math.ceil((new Date(promo.expiresAt).getTime() - now.getTime()) / 86400000));
}
