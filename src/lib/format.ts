import type { SiteSettings } from "./site";

type Commerce = SiteSettings["commerce"];

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function formatGBP(amount: number): string {
  return gbp.format(amount);
}

/** Whole-pound display (drops trailing .00), e.g. 50 -> "£50", 3.95 -> "£3.95". */
export function formatGBPWhole(amount: number): string {
  return formatGBP(amount).replace(/\.00$/, "");
}

/** Carriage summary for the UK zone, e.g. "UK delivery from £3.95 · free over £50". */
export function ukDeliverySummary(commerce: Commerce): string {
  const fee = formatGBPWhole(commerce.shippingFee);
  return commerce.freeShippingThreshold > 0
    ? `UK delivery from ${fee} · free over ${formatGBPWhole(commerce.freeShippingThreshold)}`
    : `UK delivery ${fee}`;
}

/**
 * Carriage summary for the international / rest-of-world zone, or an empty
 * string when international shipping is turned off in the admin.
 */
export function internationalDeliverySummary(commerce: Commerce): string {
  if (!commerce.internationalEnabled) return "";
  const fee = formatGBPWhole(commerce.internationalShippingFee);
  return commerce.internationalFreeShippingThreshold > 0
    ? `International delivery from ${fee} · free over ${formatGBPWhole(commerce.internationalFreeShippingThreshold)}`
    : `International delivery from ${fee}`;
}

/** Combined summary, e.g. "UK delivery from £3.95 · free over £50 · International delivery from £15". */
export function deliverySummary(commerce: Commerce): string {
  const uk = ukDeliverySummary(commerce);
  const intl = internationalDeliverySummary(commerce);
  return intl ? `${uk} · ${intl}` : uk;
}

