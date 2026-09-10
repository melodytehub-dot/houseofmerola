import { cookies } from "next/headers";
import { hashPassword } from "./store";

const COOKIE = "hm_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

export function isAdminEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function sessionValue(): string {
  const p = adminPassword();
  return p ? hashPassword(p) : "";
}

export async function isAuthenticated(): Promise<boolean> {
  if (!isAdminEnabled()) return false;
  const store = await cookies();
  const val = store.get(COOKIE)?.value ?? "";
  return val === sessionValue();
}
