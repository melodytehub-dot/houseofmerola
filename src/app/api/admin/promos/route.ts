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
import { merchantEmail, sendEmail, siteUrlFrom } from "@/lib/resend";
import { promoCodeHtml, promoCodeSubject, promoCodeText } from "@/lib/discountEmails";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ promos: await getPromos() });
}

/** Issue code(s) and email them automatically. Single (`email` + optional
 * custom `code`) or bulk (`emails`, always generated codes). */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    emails?: string[];
    percentOff?: number;
    daysValid?: number;
    code?: string;
  } | null;
  const percentOff = Math.floor(Number(body?.percentOff));
  if (!Number.isFinite(percentOff) || percentOff < 1 || percentOff > 90) {
    return NextResponse.json({ error: "Discount must be between 1% and 90%." }, { status: 400 });
  }
  const daysValid = Math.floor(Number(body?.daysValid ?? 30));
  if (!Number.isFinite(daysValid) || daysValid < 1 || daysValid > 365) {
    return NextResponse.json({ error: "Validity must be between 1 and 365 days." }, { status: 400 });
  }
  const settings = await getSettings().catch(() => null);
  const siteUrl = settings?.metadata.url || siteUrlFrom(request);
  const merchant = merchantEmail();

  const issueOne = async (email: string, customCode?: string) => {
    let code = (customCode ?? "").trim().toUpperCase();
    if (code) {
      if (!/^[A-Z0-9-]{4,24}$/.test(code)) throw new Error("Custom codes use 4–24 letters, numbers and dashes.");
      if (await getPromoByCode(code)) throw new Error("That code already exists.");
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
    const { sent, error } = await sendEmail({
      to: email,
      ...(merchant ? { replyTo: merchant } : {}),
      subject: promoCodeSubject(percentOff),
      html: promoCodeHtml(code, percentOff, promo.expiresAt, email, siteUrl),
      text: promoCodeText(code, percentOff, promo.expiresAt, email),
    });
    return { promo, sent, error };
  };

  // Bulk: one generated code per address, reported individually.
  if (Array.isArray(body?.emails)) {
    const seen = new Set<string>();
    const emails = body.emails
      .map((e) => String(e).trim().toLowerCase())
      .filter((e) => e && !seen.has(e) && (seen.add(e), true));
    if (emails.length === 0) {
      return NextResponse.json({ error: "Select at least one email address." }, { status: 400 });
    }
    if (emails.length > 50) {
      return NextResponse.json({ error: "Please send to at most 50 addresses at once." }, { status: 400 });
    }
    const bad = emails.filter((e) => !EMAIL_RE.test(e));
    if (bad.length > 0) {
      return NextResponse.json({ error: `These addresses don’t look valid: ${bad.slice(0, 3).join(", ")}` }, { status: 400 });
    }
    const promos = [];
    const failed: { email: string; error: string }[] = [];
    let emailed = 0;
    for (const email of emails) {
      try {
        const { promo, sent } = await issueOne(email);
        promos.push(promo);
        if (sent) emailed += 1;
        else failed.push({ email, error: "email failed to send" });
      } catch (e) {
        failed.push({ email, error: e instanceof Error ? e.message : "could not issue" });
      }
    }
    return NextResponse.json({ ok: true, promos, emailed, failed });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  try {
    const { promo, sent, error } = await issueOne(email, body?.code);
    return NextResponse.json({ ok: true, promo, emailSent: sent, emailError: sent ? undefined : error });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not issue the code." }, { status: 400 });
  }
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
    const merchant = merchantEmail();
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
