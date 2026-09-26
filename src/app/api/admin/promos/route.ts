import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  addPromo,
  getPromoByCode,
  getPromos,
  getSettings,
  removePromo,
  setPromoActive,
} from "@/lib/content";
import { EMAIL_RE, generatePromoCode } from "@/lib/promos";
import { sendEmail, siteUrlFrom } from "@/lib/resend";
import { promoCodeHtml, promoCodeSubject, promoCodeText } from "@/lib/discountEmails";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ promos: await getPromos() });
}

/** Issue a code to an email and email it to them automatically. */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    percentOff?: number;
    daysValid?: number;
    code?: string;
  } | null;
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const percentOff = Math.floor(Number(body?.percentOff));
  if (!Number.isFinite(percentOff) || percentOff < 1 || percentOff > 90) {
    return NextResponse.json({ error: "Discount must be between 1% and 90%." }, { status: 400 });
  }
  const daysValid = Math.floor(Number(body?.daysValid ?? 30));
  if (!Number.isFinite(daysValid) || daysValid < 1 || daysValid > 365) {
    return NextResponse.json({ error: "Validity must be between 1 and 365 days." }, { status: 400 });
  }
  let code = String(body?.code ?? "").trim().toUpperCase();
  if (code) {
    if (!/^[A-Z0-9-]{4,24}$/.test(code)) {
      return NextResponse.json(
        { error: "Custom codes use 4–24 letters, numbers and dashes." },
        { status: 400 },
      );
    }
    if (await getPromoByCode(code)) {
      return NextResponse.json({ error: "That code already exists." }, { status: 400 });
    }
  } else {
    do {
      code = generatePromoCode();
    } while (await getPromoByCode(code));
  }

  const promo = await addPromo({
    code,
    email,
    percentOff,
    active: true,
    expiresAt: new Date(Date.now() + daysValid * 86400000).toISOString(),
  });

  const settings = await getSettings().catch(() => null);
  const siteUrl = settings?.metadata.url || siteUrlFrom(request);
  const merchant = process.env.ORDER_NOTIFY_EMAIL || process.env.ENQUIRY_TO_EMAIL || "";
  const { sent, error } = await sendEmail({
    to: email,
    ...(merchant ? { replyTo: merchant } : {}),
    subject: promoCodeSubject(percentOff),
    html: promoCodeHtml(code, percentOff, promo.expiresAt, email, siteUrl),
    text: promoCodeText(code, percentOff, promo.expiresAt, email),
  });
  return NextResponse.json({ ok: true, promo, emailSent: sent, emailError: sent ? undefined : error });
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    active?: boolean;
    resend?: boolean;
  } | null;
  if (!body?.id) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.active === "boolean") {
    await setPromoActive(body.id, body.active);
    return NextResponse.json({ ok: true });
  }
  if (body.resend) {
    const promo = (await getPromos()).find((p) => p.id === body.id);
    if (!promo) {
      return NextResponse.json({ error: "Code not found." }, { status: 404 });
    }
    const settings = await getSettings().catch(() => null);
    const siteUrl = settings?.metadata.url || siteUrlFrom(request);
    const merchant = process.env.ORDER_NOTIFY_EMAIL || process.env.ENQUIRY_TO_EMAIL || "";
    const { sent, error } = await sendEmail({
      to: promo.email,
      ...(merchant ? { replyTo: merchant } : {}),
      subject: promoCodeSubject(promo.percentOff),
      html: promoCodeHtml(promo.code, promo.percentOff, promo.expiresAt, promo.email, siteUrl),
      text: promoCodeText(promo.code, promo.percentOff, promo.expiresAt, promo.email),
    });
    return NextResponse.json({ ok: true, emailSent: sent, emailError: sent ? undefined : error });
  }
  return NextResponse.json({ error: "Invalid request." }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  await removePromo(body.id);
  return NextResponse.json({ ok: true });
}
