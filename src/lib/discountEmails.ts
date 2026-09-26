/* Branded discount emails (verification link + issued promo code).
 * Same shell language as the order emails: cream card, centred logo,
 * Cormorant Garamond headings with Georgia fallback, Montserrat body
 * with Helvetica fallback, and a Google Fonts link for clients that
 * render webfonts. Table-based with inline styles for Gmail/Apple/Outlook. */

const NAVY = "#0e2a4d";
const OXBLOOD = "#6b0f1a";
const OCHRE = "#c6932b";
const STEEL = "#4d6b8a";
const CREAM = "#f3e6d2";
const CREAM_SOFT = "#faf4e8";
const SERIF = "'Cormorant Garamond',Georgia,'Times New Roman',serif";
const SANS = "Montserrat,Helvetica,Arial,sans-serif";

function esc(value: string | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(preheader: string, inner: string, siteUrl: string): string {
  const logo = `${siteUrl}/images/logo.png`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet"></head><body style="margin:0;padding:0;background-color:${CREAM};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM};">
    <tr><td align="center" style="padding:28px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${CREAM_SOFT};border-radius:12px;overflow:hidden;">
        <tr><td style="background-color:${CREAM_SOFT};padding:26px 32px 6px;text-align:center;border-bottom:1px solid #e9d9be;">
          <img src="${logo}" alt="House of Merola" width="190" style="display:block;margin:0 auto;max-width:190px;height:auto;border:0;">
          <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${OCHRE};padding:10px 0 4px;">ART FOR A MORE MAGICAL HOME</div>
        </td></tr>
        <tr><td style="padding:26px 32px 8px;">${inner}</td></tr>
        <tr><td style="padding:20px 32px 28px;text-align:center;font-family:${SANS};font-size:11px;line-height:1.7;color:${STEEL};">
          Handmade in our Liverpool studio · <a href="${siteUrl}" style="color:${OCHRE};text-decoration:underline;">houseofmerola.co.uk</a><br>
          Questions? Just reply to this email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function button(href: string, label: string, bg: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto 4px;"><tr><td align="center" bgcolor="${bg}" style="border-radius:999px;">
    <a href="${href}" style="display:inline-block;padding:12px 34px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:2px;color:#ffffff;text-decoration:none;">${esc(label)}</a>
  </td></tr></table>`;
}

function codeBox(code: string): string {
  return `<div style="margin:20px 0;padding:16px;text-align:center;background-color:${CREAM};border:1px dashed ${OCHRE};border-radius:8px;">
    <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${STEEL};">YOUR DISCOUNT CODE</div>
    <div style="font-family:${SANS};font-size:24px;font-weight:600;letter-spacing:2px;color:${NAVY};padding-top:6px;">${esc(code)}</div>
  </div>`;
}

export function verifySubject(): string {
  return "One more step: verify your email for up to 20% off";
}

export function verifyText(link: string): string {
  return [
    "Benvenuti! Please verify your email address to join the House list.",
    "",
    `Verify here (valid for 48 hours): ${link}`,
    "",
    "Once verified, the studio will send your personal discount code — up to 20% off your first piece.",
  ].join("\n");
}

export function verifyHtml(link: string, siteUrl: string): string {
  return shell(
    "Verify your email to join the House list and receive up to 20% off.",
    `
      <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${OCHRE};">● JOIN THE HOUSE</div>
      <h1 style="font-family:${SERIF};font-size:27px;line-height:1.25;color:${NAVY};margin:10px 0 6px;">Benvenuti — one more step</h1>
      <p style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0 0 6px;">Please confirm this email address so we can add you to the House list. Once verified, the studio will send your personal discount code — <strong style="color:${NAVY};">up to 20% off</strong> your first piece.</p>
      ${button(link, "VERIFY MY EMAIL", OXBLOOD)}
      <p style="font-family:${SANS};font-size:11px;line-height:1.7;color:${STEEL};margin:12px 0 0;">This link is valid for 48 hours. If the button doesn’t work, paste this into your browser:<br><a href="${esc(link)}" style="color:${OCHRE};word-break:break-all;">${esc(link)}</a></p>
    `,
    siteUrl,
  );
}

export function promoCodeSubject(percentOff: number): string {
  return `Your House of Merola discount: ${percentOff}% off`;
}

export function promoCodeText(code: string, percentOff: number, expiresAt: string, email: string): string {
  const expiry = new Date(expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return [
    `Grazie! Here is your personal ${percentOff}% discount code: ${code}`,
    "",
    `Enter it at checkout, using this email address (${email}) — the code only works with the email it was issued to, and can be used once, before ${expiry}.`,
    "",
    "With love from the Liverpool studio.",
  ].join("\n");
}

export function promoCodeHtml(code: string, percentOff: number, expiresAt: string, email: string, siteUrl: string): string {
  const expiry = new Date(expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return shell(
    `Your personal ${percentOff}% discount code is inside.`,
    `
      <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${OCHRE};">● A GIFT FROM THE STUDIO</div>
      <h1 style="font-family:${SERIF};font-size:27px;line-height:1.25;color:${NAVY};margin:10px 0 6px;">Your ${percentOff}% awaits</h1>
      <p style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0;">Enter this code at checkout to take <strong style="color:${NAVY};">${percentOff}% off</strong> your order:</p>
      ${codeBox(code)}
      <p style="font-family:${SANS};font-size:12px;line-height:1.7;color:${STEEL};margin:0;">One use only, and it works with <strong style="color:${NAVY};">${esc(email)}</strong> — please check out with this address. Valid until <strong style="color:${NAVY};">${esc(expiry)}</strong>.</p>
      ${button(`${siteUrl}/shop`, "BROWSE THE COLLECTION", NAVY)}
    `,
    siteUrl,
  );
}
