/* Branded discount emails (verification link, issued promo code and the
 * studio's new-verification alert). Table-based with inline styles for
 * Gmail, Apple Mail and Outlook. All type is Montserrat with a Helvetica
 * fallback; a Google Fonts link is included for clients that render
 * webfonts. A `prefers-color-scheme` style block (+ Outlook.com
 * `[data-ogsc]` fallbacks) keeps the design legible in dark mode, with
 * the logo kept on a light pill so the crest stays crisp. */

const NAVY = "#0e2a4d";
const OXBLOOD = "#6b0f1a";
const OCHRE = "#c6932b";
const STEEL = "#4d6b8a";
const CREAM = "#f3e6d2";
const CREAM_SOFT = "#faf4e8";
const SANS = "Montserrat,Helvetica,Arial,sans-serif";

const DARK_BG = "#0b1526";
const DARK_CARD = "#14213a";
const DARK_LINE = "#2c3f5c";
const DARK_BOX = "#1d2f4d";
const DARK_HEADING = "#f3e6d2";
const DARK_TEXT = "#c3cfdd";
const DARK_MUTED = "#9fb0c3";

const DARK_CSS = `
:root { color-scheme: light dark; supported-color-schemes: light dark; }
@media (prefers-color-scheme: dark) {
  .dm-body { background-color: ${DARK_BG} !important; }
  .dm-card { background-color: ${DARK_CARD} !important; }
  .dm-head { background-color: ${DARK_CARD} !important; border-bottom-color: ${DARK_LINE} !important; }
  .dm-logo { background-color: #ffffff !important; }
  .dm-h { color: ${DARK_HEADING} !important; }
  .dm-n { color: ${DARK_HEADING} !important; }
  .dm-t { color: ${DARK_TEXT} !important; }
  .dm-card strong { color: ${DARK_HEADING} !important; }
  .dm-row { border-bottom-color: ${DARK_LINE} !important; }
  .dm-box { background-color: ${DARK_BOX} !important; }
  .dm-codebox { background-color: ${DARK_BOX} !important; }
  .dm-foot { color: ${DARK_MUTED} !important; }
}`;

function esc(value: string | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(preheader: string, inner: string, siteUrl: string): string {
  const logo = `${siteUrl}/images/logo.png`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${DARK_CSS}</style></head><body class="dm-body" style="margin:0;padding:0;background-color:${CREAM};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="dm-body" style="background-color:${CREAM};">
    <tr><td align="center" style="padding:28px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="dm-card" style="max-width:600px;width:100%;background-color:${CREAM_SOFT};border-radius:12px;overflow:hidden;">
        <tr><td class="dm-head" style="background-color:${CREAM_SOFT};padding:22px 32px 6px;text-align:center;border-bottom:1px solid #e9d9be;">
          <div class="dm-logo" style="display:inline-block;background-color:#ffffff;border-radius:12px;padding:8px 20px;">
            <img src="${logo}" alt="House of Merola" width="140" style="display:block;margin:0 auto;max-width:140px;height:auto;border:0;">
          </div>
          <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${OCHRE};padding:10px 0 4px;">ART FOR A MORE MAGICAL HOME</div>
        </td></tr>
        <tr><td style="padding:26px 32px 8px;">${inner}</td></tr>
        <tr><td class="dm-foot" style="padding:20px 32px 28px;text-align:center;font-family:${SANS};font-size:11px;line-height:1.7;color:${STEEL};">
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
  return `<div class="dm-codebox" style="margin:20px 0;padding:16px;text-align:center;background-color:${CREAM};border:1px dashed ${OCHRE};border-radius:8px;">
    <div class="dm-t" style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${STEEL};">YOUR DISCOUNT CODE</div>
    <div class="dm-n" style="font-family:${SANS};font-size:24px;font-weight:700;letter-spacing:2px;color:${NAVY};padding-top:6px;">${esc(code)}</div>
  </div>`;
}

export function verifySubject(): string {
  return "One more step: verify your email for up to 20% off";
}

export function verifyText(link: string): string {
  return [
    "Please confirm this email address and get up to 20% off your first piece.",
    "",
    `Verify here (valid for 48 hours): ${link}`,
  ].join("\n");
}

export function verifyHtml(link: string, siteUrl: string): string {
  return shell(
    "Verify your email to join the House list and receive up to 20% off.",
    `
      <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${OCHRE};">● JOIN THE HOUSE</div>
      <h1 class="dm-h" style="font-family:${SANS};font-size:24px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 6px;">Benvenuti — one more step</h1>
      <p class="dm-t" style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0 0 6px;">Please confirm this email address and get <strong style="color:${NAVY};">up to 20% off</strong> your first piece.</p>
      ${button(link, "VERIFY MY EMAIL", OXBLOOD)}
      <p class="dm-t" style="font-family:${SANS};font-size:11px;line-height:1.7;color:${STEEL};margin:12px 0 0;">This link is valid for 48 hours. If the button doesn’t work, paste this into your browser:<br><a href="${esc(link)}" style="color:${OCHRE};word-break:break-all;">${esc(link)}</a></p>
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
      <h1 class="dm-h" style="font-family:${SANS};font-size:24px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 6px;">Your ${percentOff}% awaits</h1>
      <p class="dm-t" style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0;">Enter this code at checkout to take <strong style="color:${NAVY};">${percentOff}% off</strong> your order:</p>
      ${codeBox(code)}
      <p class="dm-t" style="font-family:${SANS};font-size:12px;line-height:1.7;color:${STEEL};margin:0;">One use only, and it works with <strong style="color:${NAVY};">${esc(email)}</strong> — please check out with this address. Valid until <strong style="color:${NAVY};">${esc(expiry)}</strong>.</p>
      ${button(`${siteUrl}/shop`, "BROWSE THE COLLECTION", NAVY)}
    `,
    siteUrl,
  );
}

export function verifiedNotifySubject(email: string): string {
  return `New verified subscriber: ${email}`;
}

export function broadcastText(heading: string, message: string, ctaLabel?: string, ctaUrl?: string): string {
  return [
    heading,
    "",
    ...message.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    "",
    ...(ctaLabel && ctaUrl ? [`${ctaLabel}: ${ctaUrl}`] : []),
  ]
    .filter(Boolean)
    .join("\n");
}

export function broadcastHtml(
  heading: string,
  message: string,
  ctaLabel: string | undefined,
  ctaUrl: string | undefined,
  siteUrl: string,
): string {
  const paras = message
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p class="dm-t" style="font-family:${SANS};font-size:13px;line-height:1.8;color:${STEEL};margin:0 0 12px;">${esc(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
  const href = ctaUrl
    ? ctaUrl.startsWith("/")
      ? `${siteUrl}${ctaUrl}`
      : ctaUrl
    : "";
  return shell(
    `${heading} — news from House of Merola.`,
    `
      <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${OCHRE};">● NEWS FROM THE HOUSE</div>
      <h1 class="dm-h" style="font-family:${SANS};font-size:24px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 12px;">${esc(heading)}</h1>
      ${paras}
      ${ctaLabel && href ? button(href, ctaLabel.toUpperCase(), OXBLOOD) : ""}
    `,
    siteUrl,
  );
}export function verifiedNotifyText(email: string, source: string, verifiedAt: string): string {
  return [
    "A visitor just verified their email on the House list.",
    "",
    `Email: ${email}`,
    `Joined via: ${source === "newsletter" ? "newsletter form" : "discount banner"}`,
    `Verified: ${verifiedAt}`,
    "",
    "Open the Promos tab in the admin to issue them a discount code.",
  ].join("\n");
}

export function verifiedNotifyHtml(email: string, source: string, verifiedAt: string, siteUrl: string): string {
  const when = new Date(verifiedAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return shell(
    `A new subscriber (${email}) just verified — ready for a discount code.`,
    `
      <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${OCHRE};">● NEW VERIFICATION</div>
      <h1 class="dm-h" style="font-family:${SANS};font-size:24px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 6px;">Email verified</h1>
      <p class="dm-t" style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0 0 6px;">A visitor just confirmed their address and joined the House list — they are ready for a discount code:</p>
      <div class="dm-box dm-n" style="margin:14px 0;background-color:${CREAM};border-radius:8px;padding:14px 16px;font-family:${SANS};font-size:13px;line-height:1.7;color:${NAVY};">
        <a href="mailto:${esc(email)}" style="color:${OCHRE};font-weight:600;word-break:break-all;">${esc(email)}</a>
        <br><span class="dm-t" style="font-size:12px;color:${STEEL};">Via ${source === "newsletter" ? "newsletter form" : "discount banner"} · verified ${esc(when)}</span>
      </div>
      ${button(`${siteUrl}/admin`, "OPEN PROMOS IN ADMIN", NAVY)}
    `,
    siteUrl,
  );
}
