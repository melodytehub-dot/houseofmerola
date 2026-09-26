import { NextResponse } from "next/server";
import { getSettings, upsertSubscriber } from "@/lib/content";
import { EMAIL_RE, newVerifyToken } from "@/lib/promos";
import { sendEmail, siteUrlFrom } from "@/lib/resend";
import { verifyHtml, verifySubject, verifyText } from "@/lib/discountEmails";

export const dynamic = "force-dynamic";

/**
 * Join the mailing list. From the discount banner (`sendVerification: true`)
 * the subscriber gets a verification link; from the newsletter form the
 * address is simply recorded.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    source?: string;
    sendVerification?: boolean;
  } | null;
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const source = body?.source === "newsletter" ? "newsletter" : "discount";
  const wantVerification = body?.sendVerification !== false && source === "discount";

  const existing = await upsertSubscriber({ email, source });
  if (existing.verified) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  if (!wantVerification) {
    await upsertSubscriber({ email, source });
    return NextResponse.json({ ok: true });
  }

  const { token, expiresAt } = newVerifyToken();
  await upsertSubscriber({ email, source, verifyToken: token, tokenExpiresAt: expiresAt });

  const settings = await getSettings().catch(() => null);
  const siteUrl = settings?.metadata.url || siteUrlFrom(request);
  const link = `${siteUrl}/discount/verify?token=${token}`;
  const merchant = process.env.ORDER_NOTIFY_EMAIL || process.env.ENQUIRY_TO_EMAIL || "";
  const { sent } = await sendEmail(
    {
      to: email,
      ...(merchant ? { replyTo: merchant } : {}),
      subject: verifySubject(),
      html: verifyHtml(link, siteUrl),
      text: verifyText(link),
    },
  );
  return NextResponse.json({ ok: true, emailSent: sent });
}
