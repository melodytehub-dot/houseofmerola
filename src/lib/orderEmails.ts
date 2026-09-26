import type { Order } from "./site";

/* ────────────────────────────────────────────────────────────────
 * Branded order emails (customer confirmation + studio alert).
 * Table-based with inline styles so they render in Gmail, Apple
 * Mail and Outlook. Headings use Cormorant Garamond with a Georgia
 * fallback and body uses Montserrat with a Helvetica fallback,
 * matching the site; a Google Fonts link is included for clients
 * that render webfonts.
 * ──────────────────────────────────────────────────────────────── */

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

function money(n: number): string {
  return `£${n.toFixed(2)}`;
}

function firstName(name?: string): string {
  return name?.trim().split(" ")[0] || "";
}

function deliveryLine(order: Order): string {
  return [order.address, order.city, order.postcode].filter(Boolean).join(", ");
}

function itemRows(order: Order): string {
  return order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e9d9be;font-family:${SANS};font-size:14px;color:${NAVY};">
          <span style="font-weight:bold;">${esc(i.name)}</span>
          ${i.variant ? `<br><span style="font-size:12px;color:${STEEL};">${esc(i.variant)}</span>` : ""}
          <br><span style="font-size:12px;color:${STEEL};">Qty ${i.qty}</span>
        </td>
        <td align="right" valign="top" style="padding:10px 0 10px 12px;border-bottom:1px solid #e9d9be;font-family:${SANS};font-size:14px;color:${NAVY};white-space:nowrap;">${money(i.unitPrice * i.qty)}</td>
      </tr>`,
    )
    .join("");
}

function totals(order: Order, totalLabel = "Total paid"): string {
  const zone = order.deliveryZone === "international" ? "International" : "UK";
  const discount = typeof order.discount === "number" && order.discount > 0 ? order.discount : 0;
  return `
      <tr>
        <td style="padding:8px 0 0;font-family:${SANS};font-size:13px;color:${STEEL};">Subtotal</td>
        <td align="right" style="padding:8px 0 0;font-family:${SANS};font-size:13px;color:${STEEL};">${money(order.subtotal)}</td>
      </tr>
      ${
        discount > 0
          ? `
      <tr>
        <td style="padding:4px 0 0;font-family:${SANS};font-size:13px;color:${OXBLOOD};">Discount${order.promoCode ? ` · ${esc(order.promoCode)}` : ""}</td>
        <td align="right" style="padding:4px 0 0;font-family:${SANS};font-size:13px;color:${OXBLOOD};">−${money(discount)}</td>
      </tr>`
          : ""
      }
      <tr>
        <td style="padding:4px 0 0;font-family:${SANS};font-size:13px;color:${STEEL};">Delivery · ${zone}</td>
        <td align="right" style="padding:4px 0 0;font-family:${SANS};font-size:13px;color:${STEEL};">${order.shipping === 0 ? "Free" : money(order.shipping)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0 0;font-family:${SERIF};font-size:17px;font-weight:bold;color:${NAVY};">${totalLabel}</td>
        <td align="right" style="padding:10px 0 0;font-family:${SERIF};font-size:17px;font-weight:bold;color:${NAVY};">${money(order.total)}</td>
      </tr>`;
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

export function customerSubject(): string {
  return "Your House of Merola order is confirmed";
}

export function merchantSubject(order: Order): string {
  return `New order: ${order.name || order.email} — ${money(order.total)}`;
}

export function customerText(order: Order): string {
  const greet = firstName(order.name);
  const discount = typeof order.discount === "number" && order.discount > 0 ? order.discount : 0;
  return [
    `Grazie${greet ? `, ${greet}` : ""}! Your payment was successful and your order will be processed shortly.`,
    "",
    "Your order:",
    ...order.items.map(
      (i) => `• ${i.name}${i.variant ? ` (${i.variant})` : ""} × ${i.qty} — ${money(i.unitPrice * i.qty)}`,
    ),
    "",
    `Subtotal: ${money(order.subtotal)}`,
    ...(discount > 0 ? [`Discount${order.promoCode ? ` (${order.promoCode})` : ""}: −${money(discount)}`] : []),
    `Delivery (${order.deliveryZone === "international" ? "International" : "UK"}): ${
      order.shipping === 0 ? "Free" : money(order.shipping)
    }`,
    `Total paid: ${money(order.total)}`,
    "",
    deliveryLine(order) ? `Delivering to: ${deliveryLine(order)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function merchantText(order: Order): string {
  const discount = typeof order.discount === "number" && order.discount > 0 ? order.discount : 0;
  return [
    `A new ${order.deliveryZone === "international" ? "international" : "UK"} order just completed.`,
    "",
    ...order.items.map(
      (i) => `• ${i.name}${i.variant ? ` (${i.variant})` : ""} × ${i.qty} — ${money(i.unitPrice * i.qty)}`,
    ),
    "",
    `Subtotal: ${money(order.subtotal)}`,
    ...(discount > 0 ? [`Discount${order.promoCode ? ` (${order.promoCode})` : ""}: −${money(discount)}`] : []),
    `Delivery: ${order.shipping === 0 ? "Free" : money(order.shipping)}`,
    `Total: ${money(order.total)} (${order.currency.toUpperCase()})`,
    "",
    `Customer: ${order.name || "—"} <${order.email}>`,
    deliveryLine(order) ? `Deliver to: ${deliveryLine(order)}` : "",
    `Session: ${order.id}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function customerHtml(order: Order, siteUrl: string): string {
  const greet = firstName(order.name);
  const deliverTo = deliveryLine(order);
  return shell(
    `Your House of Merola order is confirmed and will be processed shortly. Total ${money(order.total)}.`,
    `
      <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${OCHRE};">● ORDER CONFIRMED</div>
      <h1 style="font-family:${SERIF};font-size:27px;line-height:1.25;color:${NAVY};margin:10px 0 6px;">Grazie${greet ? `, ${esc(greet)}` : ""}!</h1>
      <p style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0 0 20px;">Your payment was successful and your order will be processed shortly. Here is what you ordered:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows(order)}${totals(order)}</table>
      ${
        deliverTo
          ? `<div style="margin-top:20px;background-color:${CREAM};border-radius:8px;padding:14px 16px;font-family:${SANS};font-size:12px;line-height:1.6;color:${NAVY};"><span style="font-size:10px;letter-spacing:2px;color:${STEEL};">DELIVERING TO</span><br>${esc(deliverTo)}</div>`
          : ""
      }
      ${button(`${siteUrl}/shop`, "CONTINUE SHOPPING", OXBLOOD)}
    `,
    siteUrl,
  );
}

export function merchantHtml(order: Order, siteUrl: string): string {
  const deliverTo = deliveryLine(order);
  return shell(
    `New ${order.deliveryZone} order from ${order.name || order.email} — ${money(order.total)}.`,
    `
      <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${OCHRE};">● NEW ORDER · ${order.deliveryZone === "international" ? "INTERNATIONAL" : "UK"} · ${money(order.total).toUpperCase()}</div>
      <h1 style="font-family:${SERIF};font-size:24px;line-height:1.25;color:${NAVY};margin:10px 0 6px;">${esc(order.name || "New order")}</h1>
      <p style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0 0 20px;">
        <a href="mailto:${esc(order.email)}" style="color:${OCHRE};">${esc(order.email)}</a>
        ${order.promoCode ? `<br>Promo code: <strong style="color:${NAVY};">${esc(order.promoCode)}</strong>` : ""}
        ${deliverTo ? `<br>Deliver to: ${esc(deliverTo)}` : ""}
        <br><span style="font-size:11px;">Session ${esc(order.id)}</span>
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows(order)}${totals(order, "Total")}</table>
      ${button(`${siteUrl}/admin`, "OPEN ORDERS IN ADMIN", NAVY)}
    `,
    siteUrl,
  );
}
