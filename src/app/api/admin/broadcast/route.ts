import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSettings, getSubscribers } from "@/lib/content";
import { EMAIL_RE } from "@/lib/promos";
import { sendEmail, siteUrlFrom } from "@/lib/resend";
import { broadcastHtml, broadcastText } from "@/lib/discountEmails";

export const dynamic = "force-dynamic";

const MAX_RECIPIENTS = 100;

/** Compose and send a promotional email to verified subscribers. */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    audience?: string;
    emails?: string[];
    subject?: string;
    heading?: string;
    message?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  } | null;

  const subject = String(body?.subject ?? "").trim().slice(0, 140);
  const heading = String(body?.heading ?? "").trim().slice(0, 140);
  const message = String(body?.message ?? "").trim().slice(0, 5000);
  const ctaLabel = String(body?.ctaLabel ?? "").trim().slice(0, 40);
  const ctaUrl = String(body?.ctaUrl ?? "").trim().slice(0, 500);
  if (!subject || !heading || !message) {
    return NextResponse.json({ error: "Subject, headline and message are all required." }, { status: 400 });
  }
  if ((ctaLabel && !ctaUrl) || (!ctaLabel && ctaUrl)) {
    return NextResponse.json({ error: "Button label and link go together — fill in both or neither." }, { status: 400 });
  }
  if (ctaUrl && !/^(\/|https?:\/\/)/.test(ctaUrl)) {
    return NextResponse.json({ error: "The button link must start with / or http(s)://." }, { status: 400 });
  }

  const verified = (await getSubscribers()).filter((s) => s.verified);
  let recipients: string[];
  let skipped = 0;
  if (body?.audience === "selected") {
    const seen = new Set<string>();
    const wanted = (Array.isArray(body.emails) ? body.emails : [])
      .map((e) => String(e).trim().toLowerCase())
      .filter((e) => e && EMAIL_RE.test(e) && !seen.has(e) && (seen.add(e), true));
    if (wanted.length === 0) {
      return NextResponse.json({ error: "Tick at least one verified email first." }, { status: 400 });
    }
    const verifiedSet = new Set(verified.map((s) => s.email.toLowerCase()));
    recipients = wanted.filter((e) => verifiedSet.has(e));
    skipped = wanted.length - recipients.length;
    if (recipients.length === 0) {
      return NextResponse.json({ error: "None of the selected addresses are verified yet." }, { status: 400 });
    }
  } else {
    recipients = verified.map((s) => s.email);
  }
  if (recipients.length === 0) {
    return NextResponse.json({ error: "There are no verified emails to send to yet." }, { status: 400 });
  }
  if (recipients.length > MAX_RECIPIENTS) {
    return NextResponse.json(
      { error: `That’s ${recipients.length} recipients — please send to at most ${MAX_RECIPIENTS} at once.` },
      { status: 400 },
    );
  }

  const settings = await getSettings().catch(() => null);
  const siteUrl = settings?.metadata.url || siteUrlFrom(request);
  const html = broadcastHtml(heading, message, ctaLabel || undefined, ctaUrl || undefined, siteUrl);
  const text = broadcastText(
    heading,
    message,
    ctaLabel || undefined,
    ctaUrl
      ? ctaUrl.startsWith("/")
        ? `${siteUrl}${ctaUrl}`
        : ctaUrl
      : undefined,
  );

  let sent = 0;
  const failed: { email: string; error: string }[] = [];
  for (const to of recipients) {
    const { sent: ok } = await sendEmail({ to, subject, html, text });
    if (ok) sent += 1;
    else failed.push({ email: to, error: "email failed to send" });
  }
  return NextResponse.json({ ok: true, sent, failed, skipped });
}
