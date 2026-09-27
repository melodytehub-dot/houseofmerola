import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProducts, getPromos, getSettings, getStripe } from "@/lib/content";
import { checkPromoForEmail } from "@/lib/promos";
import type { Product } from "@/lib/products";

export const dynamic = "force-dynamic";

interface Line {
  slug: string;
  name: string;
  price: number; // GBP, client-claimed; always re-priced from the catalogue below
  qty: number;
  variant?: string;
}

/* Option labels themselves contain "·" (e.g. "A3 · 30 × 42 cm"), so the
 * variant string can never be split on that separator. Instead we rebuild
 * every label the configurator could have produced and match it exactly —
 * the same combination the client priced. */
const BLANK = { label: undefined, priceDelta: 0 };
function priceFromVariant(product: Product, variant: string): number | null {
  const materials = product.materialOptions ?? [];
  const sizes = product.sizeOptions ?? [];
  if (materials.length === 0 && sizes.length === 0) return product.price;
  const blanks = [BLANK];
  for (const material of [...blanks, ...materials]) {
    for (const size of [...blanks, ...sizes]) {
      const composed = [material.label, size.label].filter(Boolean).join(" · ");
      if (composed === variant) {
        return product.price + material.priceDelta + size.priceDelta;
      }
    }
  }
  return null;
}

/** Legacy/free-text fallback: add any label we still recognise. */
function priceFromKnownLabels(product: Product, variant: string): number {
  let unit = product.price;
  for (const part of variant.split("·").map((s) => s.trim()).filter(Boolean)) {
    const material = (product.materialOptions ?? []).find((o) => o.label === part);
    const size = (product.sizeOptions ?? []).find((o) => o.label === part);
    if (material) unit += material.priceDelta;
    else if (size) unit += size.priceDelta;
  }
  return unit;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    items?: Line[];
    zone?: "uk" | "international";
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    postcode?: string;
    promoCode?: string;
  } | null;
  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  const name = String(body?.name ?? "").trim().slice(0, 120);
  const email = String(body?.email ?? "").trim().slice(0, 200);
  const address = String(body?.address ?? "").trim().slice(0, 200);
  const city = String(body?.city ?? "").trim().slice(0, 120);
  const postcode = String(body?.postcode ?? "").trim().slice(0, 40);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !address || !city || !postcode) {
    return NextResponse.json({ error: "Name, a valid email and a full delivery address (street, city and postcode) are required." }, { status: 400 });
  }

  // Never trust client-sent prices: re-price every line from the live
  // catalogue so tampered totals are rejected before touching Stripe.
  const catalogue = new Map((await getProducts()).map((p) => [p.slug, p]));
  const priced = items.map((item) => {
    const slug = String(item.slug ?? "");
    const product = catalogue.get(slug);
    const qty = Math.floor(Number(item.qty));
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 99) return null;
    const variant = typeof item.variant === "string" ? item.variant.slice(0, 200) : undefined;
    const matched = variant ? priceFromVariant(product, variant) : product.price;
    const unit = matched ?? priceFromKnownLabels(product, variant ?? "");
    if (!Number.isFinite(item.price) || Math.round(item.price * 100) !== Math.round(unit * 100)) {
      return null;
    }
    return { product, qty, unit, variant };
  });
  if (priced.some((p) => p === null)) {
    return NextResponse.json({ error: "Your basket contains items or prices we no longer recognise. Please review your basket and try again." }, { status: 400 });
  }
  const lines = priced as NonNullable<(typeof priced)[number]>[];

  const settings = await getSettings();
  const stripeCfg = await getStripe();

  // Promo codes are single-use and bound to one email: always re-check the
  // code here (the client also pre-checks), even on the manual path below.
  const promoInput = String(body?.promoCode ?? "").trim();
  let promo: { code: string; percentOff: number } | null = null;
  if (promoInput) {
    const checked = checkPromoForEmail(await getPromos(), promoInput, email);
    if (!checked.ok) {
      return NextResponse.json({ error: checked.error }, { status: 400 });
    }
    promo = { code: checked.promo.code, percentOff: checked.promo.percentOff };
  }

  const secret = stripeCfg.mode === "live" ? stripeCfg.live.secretKey : stripeCfg.sandbox.secretKey;
  const publishable = stripeCfg.mode === "live" ? stripeCfg.live.publishableKey : stripeCfg.sandbox.publishableKey;

  if (!secret) {
    return NextResponse.json({ fallback: true });
  }

  let stripe: Stripe;
  try {
    stripe = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });
  } catch {
    return NextResponse.json({ error: "Stripe is not configured correctly." }, { status: 500 });
  }

  const origin = new URL(request.url).origin;

  const lineItems = lines.map((item) => ({
    quantity: item.qty,
    price_data: {
      currency: settings.commerce.currency?.toLowerCase() || "gbp",
      unit_amount: Math.round(item.unit * 100),
      product_data: {
        name: item.product.name,
        description: item.variant || undefined,
      },
    },
  }));

  // Zone-aware shipping (mirror of the cart logic): UK by default, international when chosen.
  const isInternational = body?.zone === "international";
  const freeThreshold = isInternational
    ? settings.commerce.internationalFreeShippingThreshold
    : settings.commerce.freeShippingThreshold;
  const shippingFee = isInternational
    ? settings.commerce.internationalShippingFee
    : settings.commerce.shippingFee;
  const subtotal = lines.reduce((sum, i) => sum + i.unit * i.qty, 0);
  const shipping = freeThreshold > 0 && subtotal >= freeThreshold ? 0 : shippingFee;
  const displayName = isInternational ? "International delivery" : "UK delivery";

  try {
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (promo) {
      const coupon = await stripe.coupons.create({
        percent_off: promo.percentOff,
        duration: "once",
        name: `House of Merola ${promo.code}`,
      });
      discounts = [{ coupon: coupon.id }];
    }
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
      ...(discounts ? { discounts } : {}),
      ...(shipping > 0
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: Math.round(shipping * 100), currency: settings.commerce.currency?.toLowerCase() || "gbp" },
                  display_name: displayName,
                },
              },
            ],
          }
        : {}),
      success_url: `${origin}/checkout?success=1`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      metadata: {
        source: "houseofmerola",
        ...(isInternational ? { delivery_zone: "international" } : { delivery_zone: "uk" }),
        ...(settings.metadata.url ? { site: settings.metadata.url } : {}),
        contact_name: name,
        contact_address: address,
        ...(city ? { contact_city: city } : {}),
        ...(postcode ? { contact_postcode: postcode } : {}),
        ...(promo
          ? { promo_code: promo.code, promo_percent: String(promo.percentOff) }
          : {}),
      },
    });

    return NextResponse.json({ url: session.url, publishableKey: publishable });
  } catch {
    return NextResponse.json({ error: "Could not open Stripe Checkout." }, { status: 500 });
  }
}
