/** Minimal Resend client shared by the discount flows. */

/** The studio inbox that receives customer-facing notifications. Falls back
 * to the live studio address so mail still lands if an env var is unset/blank. */
export const STUDIO_EMAIL = "hello@houseofmerola.co.uk";

export function merchantEmail(): string {
  return (
    process.env.ORDER_NOTIFY_EMAIL?.trim() ||
    process.env.ENQUIRY_TO_EMAIL?.trim() ||
    STUDIO_EMAIL
  );
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail(
  payload: EmailPayload,
  fromOverride?: string,
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, error: "Email is not configured." };
  const from =
    fromOverride ||
    process.env.ORDER_FROM_EMAIL ||
    process.env.ENQUIRY_FROM_EMAIL ||
    "House of Merola <hello@houseofmerola.co.uk>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: payload.to,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[discount] resend rejected email to ${payload.to} (${res.status}): ${detail.slice(0, 200)}`);
      return { sent: false, error: "The email could not be delivered." };
    }
    return { sent: true };
  } catch (e) {
    console.error(`[discount] resend send failed to ${payload.to}: ${e instanceof Error ? e.message : "unknown error"}`);
    return { sent: false, error: "The email could not be delivered." };
  }
}

export function siteUrlFrom(request: Request, fallback?: string): string {
  try {
    return new URL(request.url).origin;
  } catch {
    return fallback || "https://houseofmerola.co.uk";
  }
}
