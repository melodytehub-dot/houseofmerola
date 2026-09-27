import type { Order } from "./site";
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

/* ────────────────────────────────────────────────────────────────
 * Branded order emails (customer confirmation + studio alert).
 * Table-based with inline styles so they render in Gmail, Apple
 * Mail and Outlook. All type is Figtree with a Helvetica
 * fallback; a Google Fonts link is included for clients that render
 * webfonts. A `prefers-color-scheme` style block (+ Outlook.com
 * `[data-ogsc]` fallbacks) keeps the design legible in dark mode,
 * with the logo kept on a light pill so the crest stays crisp.
 * ──────────────────────────────────────────────────────────────── */




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
        <td class="dm-row dm-n dm-cell" style="padding:10px 0;border-bottom:1px solid #e9d9be;font-family:${SANS};font-size:14px;color:${NAVY};">
          <span style="font-weight:bold;">${esc(i.name)}</span>
          ${i.variant ? `<br><span class="dm-t" style="font-size:12px;color:${STEEL};">${esc(i.variant)}</span>` : ""}
          <br><span class="dm-t" style="font-size:12px;color:${STEEL};">Qty ${i.qty}</span>
        </td>
        <td class="dm-row dm-n dm-cell" align="right" valign="top" style="padding:10px 0 10px 12px;border-bottom:1px solid #e9d9be;font-family:${SANS};font-size:14px;color:${NAVY};white-space:nowrap;">${money(i.unitPrice * i.qty)}</td>
      </tr>`,
    )
    .join("");
}

function totals(order: Order, totalLabel = "Total paid"): string {
  const zone = order.deliveryZone === "international" ? "International" : "UK";
  const discount = typeof order.discount === "number" && order.discount > 0 ? order.discount : 0;
  return `
      <tr>
        <td class="dm-t dm-sum" style="padding:8px 0 0;font-family:${SANS};font-size:13px;color:${STEEL};">Subtotal</td>
        <td class="dm-t dm-sum" align="right" style="padding:8px 0 0;font-family:${SANS};font-size:13px;color:${STEEL};">${money(order.subtotal)}</td>
      </tr>
      ${
        discount > 0
          ? `
      <tr>
        <td class="dm-off dm-sum" style="padding:4px 0 0;font-family:${SANS};font-size:13px;color:${OXBLOOD};">Discount${order.promoCode ? ` · ${esc(order.promoCode)}` : ""}</td>
        <td class="dm-off dm-sum" align="right" style="padding:4px 0 0;font-family:${SANS};font-size:13px;color:${OXBLOOD};">−${money(discount)}</td>
      </tr>`
          : ""
      }
      <tr>
        <td class="dm-t dm-sum" style="padding:4px 0 0;font-family:${SANS};font-size:13px;color:${STEEL};">Delivery · ${zone}</td>
        <td class="dm-t dm-sum" align="right" style="padding:4px 0 0;font-family:${SANS};font-size:13px;color:${STEEL};">${order.shipping === 0 ? "Free" : money(order.shipping)}</td>
      </tr>
      <tr>
        <td class="dm-h dm-total" style="padding:10px 0 0;font-family:${SANS};font-size:16px;font-weight:700;color:${NAVY};">${totalLabel}</td>
        <td class="dm-h dm-total" align="right" style="padding:10px 0 0;font-family:${SANS};font-size:16px;font-weight:700;color:${NAVY};">${money(order.total)}</td>
      </tr>`;
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
      ${eyebrow("● ORDER CONFIRMED")}
      <h1 class="dm-h dm-h1" style="font-family:${SANS};font-size:24px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 6px;">Grazie${greet ? `, ${esc(greet)}` : ""}!</h1>
      <p class="dm-t dm-lead" style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0 0 20px;">Your payment was successful and your order will be processed shortly. Here is what you ordered:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows(order)}${totals(order)}</table>
      ${
        deliverTo
          ? `<div class="dm-box dm-n dm-box-pad" style="margin-top:20px;background-color:${CREAM};border-radius:8px;padding:14px 16px;font-family:${SANS};font-size:12px;line-height:1.6;color:${NAVY};"><span class="dm-t" style="font-size:10px;letter-spacing:1.6px;color:${STEEL};">DELIVERING TO</span><br>${esc(deliverTo)}</div>`
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
      ${eyebrow(`● NEW ORDER · ${order.deliveryZone === "international" ? "INTERNATIONAL" : "UK"} · ${money(order.total).toUpperCase()}`)}
      <h1 class="dm-h dm-h1" style="font-family:${SANS};font-size:22px;font-weight:700;line-height:1.3;color:${NAVY};margin:10px 0 6px;">${esc(order.name || "New order")}</h1>
      <p class="dm-t dm-lead" style="font-family:${SANS};font-size:13px;line-height:1.7;color:${STEEL};margin:0 0 20px;">
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
