/* ────────────────────────────────────────────────────────────────
 * Shared shell for every branded email (order confirmations, the
 * studio's new-order alert, discount verification, promo codes,
 * broadcasts and admin notifications).
 *
 * Table-based with inline styles so it survives Gmail, Apple Mail and
 * Outlook. Type is Figtree with a Helvetica/Arial fallback and a
 * Google Fonts link for clients that render webfonts.
 *
 * Responsive by construction:
 *  - a `viewport` meta so phones do not fall back to a 980px layout
 *    viewport and scale the whole email down;
 *  - a fluid card (`width="100%"` + `max-width`) wrapped in an MSO
 *    ghost table so Outlook desktop still centres at 600px;
 *  - a `max-width:600px` media query that eases the gutters, logo,
 *    headings and buttons on small screens;
 *  - `prefers-color-scheme` rules so the design stays legible in
 *    dark mode, with the logo kept on a light pill so the crest
 *    stays crisp.
 * ──────────────────────────────────────────────────────────────── */

export const NAVY = "#0e2a4d";
export const OXBLOOD = "#6b0f1a";
export const OCHRE = "#c6932b";
export const STEEL = "#4d6b8a";
export const CREAM = "#f3e6d2";
export const CREAM_SOFT = "#faf4e8";
export const LINE = "#e9d9be";
export const SANS = "Figtree,Helvetica,Arial,sans-serif";

const DARK_BG = "#0b1526";
const DARK_CARD = "#14213a";
const DARK_LINE = "#2c3f5c";
const DARK_BOX = "#1d2f4d";
const DARK_HEADING = "#f3e6d2";
const DARK_TEXT = "#c3cfdd";
const DARK_MUTED = "#9fb0c3";

const CSS = `
:root { color-scheme: light dark; supported-color-schemes: light dark; }
html, body { margin:0 !important; padding:0 !important; width:100% !important; }
* { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse !important; }
img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
a { color:inherit; }
@media only screen and (max-width:600px) {
  .dm-wrap { padding:14px 10px !important; }
  .dm-head { padding:16px 16px 4px !important; }
  .dm-logo img { width:108px !important; }
  .dm-eyebrow { font-size:9px !important; letter-spacing:1.5px !important; }
  .dm-main { padding:20px 18px 6px !important; }
  .dm-foot { padding:18px 18px 22px !important; font-size:10px !important; }
  .dm-h1 { font-size:21px !important; line-height:1.28 !important; }
  .dm-lead { font-size:13px !important; line-height:1.65 !important; }
  .dm-box, .dm-box-pad { padding:12px 14px !important; }
  .dm-code { font-size:22px !important; }
  .dm-cta { margin:18px auto 2px !important; }
  .dm-cta a { display:block !important; padding:12px 18px !important; font-size:11px !important; }
  .dm-cell { font-size:13px !important; }
  .dm-sum { font-size:12px !important; }
  .dm-total { font-size:15px !important; }
}
@media (prefers-color-scheme: dark) {
  .dm-body { background-color:${DARK_BG} !important; }
  .dm-card { background-color:${DARK_CARD} !important; }
  .dm-head { background-color:${DARK_CARD} !important; border-bottom-color:${DARK_LINE} !important; }
  .dm-logo { background-color:#ffffff !important; }
  .dm-h, .dm-n { color:${DARK_HEADING} !important; }
  .dm-t { color:${DARK_TEXT} !important; }
  .dm-card strong { color:${DARK_HEADING} !important; }
  .dm-row { border-bottom-color:${DARK_LINE} !important; }
  .dm-box, .dm-codebox { background-color:${DARK_BOX} !important; }  .dm-off { color:#e8a0a8 !important; }
  .dm-foot { color:${DARK_MUTED} !important; }
}`;

export function esc(value: string | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Small uppercase kicker above each heading. */
export function eyebrow(text: string, color: string = OCHRE): string {
  return `<div class="dm-eyebrow" style="font-family:${SANS};font-size:10px;letter-spacing:2.2px;color:${color};">${esc(text)}</div>`;
}

/* Bulletproof pill button: VML roundrect for desktop Outlook, padded
 * anchor everywhere else. */
export function emailButton(href: string, label: string, bg: string): string {
  const safeHref = esc(href);
  const width = Math.max(150, label.length * 7 + 62);
  return `<table role="presentation" cellpadding="0" cellspacing="0" class="dm-cta" style="margin:22px auto 4px;"><tr><td align="center" bgcolor="${bg}" style="border-radius:999px;mso-padding-alt:13px 30px;">
    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:42px;v-text-anchor:middle;width:${width}px;" arcsize="50%" stroke="f" fillcolor="${bg}"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.6px;">${esc(label)}</center></v:roundrect><![endif]-->
    <a href="${safeHref}" style="display:inline-block;padding:13px 30px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:1.6px;color:#ffffff;text-decoration:none;border-radius:999px;">${esc(label)}</a>
  </td></tr></table>`;
}

export function emailShell(preheader: string, inner: string, siteUrl: string): string {
  const logo = `${siteUrl}/images/logo.png`;
  /* Zero-width filler keeps clients from pulling body copy into the
   * preview line. */
  const filler = "&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;";
  return `<!DOCTYPE html><html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="x-apple-disable-message-reformatting"><meta name="format-detection" content="telephone=no,address=no,email=no,date=no"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body class="dm-body" style="margin:0;padding:0;width:100%;background-color:${CREAM};">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${esc(preheader)}${filler.repeat(6)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="dm-body" style="background-color:${CREAM};">
    <tr><td align="center" class="dm-wrap" style="padding:24px 12px;">
      <!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="dm-card" style="max-width:600px;background-color:${CREAM_SOFT};border-radius:14px;">
        <tr><td class="dm-head" style="background-color:${CREAM_SOFT};padding:20px 28px 6px;text-align:center;border-bottom:1px solid ${LINE};border-radius:14px 14px 0 0;">
          <div class="dm-logo" style="display:inline-block;background-color:#ffffff;border-radius:12px;padding:8px 20px;">
            <img src="${logo}" alt="House of Merola" width="140" style="display:block;margin:0 auto;width:140px;max-width:140px;border:0;">
          </div>
          <div style="font-family:${SANS};font-size:10px;letter-spacing:2.2px;color:${OCHRE};padding:10px 0 4px;">ART FOR A MORE MAGICAL HOME</div>
        </td></tr>
        <tr><td class="dm-main" style="padding:24px 28px 8px;">${inner}</td></tr>
        <tr><td class="dm-foot" style="padding:20px 28px 26px;text-align:center;font-family:${SANS};font-size:11px;line-height:1.7;color:${STEEL};border-radius:0 0 14px 14px;">
          Handmade in our Liverpool studio · <a href="${siteUrl}" style="color:${OCHRE};text-decoration:underline;">houseofmerola.co.uk</a><br>
          Questions? Just reply to this email.
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body></html>`;
}
