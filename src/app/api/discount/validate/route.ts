import { NextResponse } from "next/server";
import { getPromos } from "@/lib/content";
import { checkPromoForEmail, EMAIL_RE } from "@/lib/promos";

export const dynamic = "force-dynamic";

/** Live-check a promo code against a checkout email (also re-checked server-side). */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    code?: string;
    email?: string;
  } | null;
  const code = String(body?.code ?? "").trim();
  const email = String(body?.email ?? "").trim();
  if (!code) {
    return NextResponse.json({ error: "Please enter your promo code." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter your checkout email first — codes only work with the email they were sent to." },
      { status: 400 },
    );
  }
  const checked = checkPromoForEmail(await getPromos(), code, email);
  if (!checked.ok) {
    return NextResponse.json({ error: checked.error }, { status: 400 });
  }
  return NextResponse.json({
    valid: true,
    code: checked.promo.code,
    percentOff: checked.promo.percentOff,
  });
}
