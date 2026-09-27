import {
  CREAM,
  NAVY,
  OCHRE,
  OXBLOOD,
  SANS,
  STEEL,
  emailButton as button,
  emailShell as shell,
  esc,
  eyebrow,
} from "./emailShell";
function codeBox(code: string): string {
  return `<div class="dm-codebox" style="margin:20px 0;padding:16px;text-align:center;background-color:${CREAM};border:1px dashed ${OCHRE};border-radius:8px;">
    ${eyebrow("YOUR DISCOUNT CODE", STEEL)}
    <div class="dm-n dm-code" style="font-family:${SANS};font-size:24px;font-weight:700;letter-spacing:1.5px;color:${NAVY};padding-top:6px;">${esc(code)}</div>
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
      ${eyebrow("● JOIN THE HOUSE")}
      <h1 class="dm-h dm-h1" style="font-family:${SANS};font-size:24px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 6px;">Benvenuti — one more step</h1>
      <p class="dm-t dm-lead" style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0 0 6px;">Please confirm this email address and get <strong style="color:${NAVY};">up to 20% off</strong> your first piece.</p>
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
      ${eyebrow("● A GIFT FROM THE STUDIO")}
      <h1 class="dm-h dm-h1" style="font-family:${SANS};font-size:24px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 6px;">Your ${percentOff}% awaits</h1>
      <p class="dm-t dm-lead" style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0;">Enter this code at checkout to take <strong style="color:${NAVY};">${percentOff}% off</strong> your order:</p>
      ${codeBox(code)}
      <p class="dm-t dm-lead" style="font-family:${SANS};font-size:12px;line-height:1.7;color:${STEEL};margin:0;">One use only, and it works with <strong style="color:${NAVY};">${esc(email)}</strong> — please check out with this address. Valid until <strong style="color:${NAVY};">${esc(expiry)}</strong>.</p>
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
        `<p class="dm-t dm-lead" style="font-family:${SANS};font-size:13px;line-height:1.8;color:${STEEL};margin:0 0 12px;">${esc(p).replace(/\n/g, "<br>")}</p>`,
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
      ${eyebrow("● NEWS FROM THE HOUSE")}
      <h1 class="dm-h dm-h1" style="font-family:${SANS};font-size:24px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 12px;">${esc(heading)}</h1>
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
      ${eyebrow("● NEW VERIFICATION")}
      <h1 class="dm-h dm-h1" style="font-family:${SANS};font-size:24px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 6px;">Email verified</h1>
      <p class="dm-t dm-lead" style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0 0 6px;">A visitor just confirmed their address and joined the House list — they are ready for a discount code:</p>
      <div class="dm-box dm-n dm-box-pad" style="margin:14px 0;background-color:${CREAM};border-radius:8px;padding:14px 16px;font-family:${SANS};font-size:13px;line-height:1.7;color:${NAVY};">
        <a href="mailto:${esc(email)}" style="color:${OCHRE};font-weight:600;word-break:break-all;">${esc(email)}</a>
        <br><span class="dm-t" style="font-size:12px;color:${STEEL};">Via ${source === "newsletter" ? "newsletter form" : "discount banner"} · verified ${esc(when)}</span>
      </div>
      ${button(`${siteUrl}/admin`, "OPEN PROMOS IN ADMIN", NAVY)}
    `,
    siteUrl,
  );
}
