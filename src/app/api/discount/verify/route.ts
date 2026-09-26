import { NextResponse } from "next/server";
import { getSettings, verifySubscriberByToken } from "@/lib/content";
import { sendEmail, siteUrlFrom } from "@/lib/resend";
import {
  verifiedNotifyHtml,
  verifiedNotifySubject,
  verifiedNotifyText,
} from "@/lib/discountEmails";

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
  // Tell the studio someone is ready for a code; never fail verification itself.
  try {
    const merchant = process.env.ORDER_NOTIFY_EMAIL || process.env.ENQUIRY_TO_EMAIL || "";
    if (merchant) {
      const settings = await getSettings().catch(() => null);
      const siteUrl = settings?.metadata.url || siteUrlFrom(request);
      await sendEmail({
        to: merchant,
        replyTo: sub.email,
        subject: verifiedNotifySubject(sub.email),
        html: verifiedNotifyHtml(sub.email, sub.source, sub.verifiedAt || sub.createdAt, siteUrl),
        text: verifiedNotifyText(sub.email, sub.source, sub.verifiedAt || sub.createdAt),
      });
    }
  } catch (e) {
    console.error(`[discount] verification notify failed: ${e instanceof Error ? e.message : "unknown error"}`);
  }
  return NextResponse.json({ ok: true, email: sub.email });
}
