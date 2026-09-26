import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProducts, getSettings, getStripe } from "@/lib/content";

export const dynamic = "force-dynamic";

interface Line {
  slug: string;
  name: string;
  price: number; // GBP, client-claimed; always re-priced from the catalogue below
  qty: number;
  variant?: string;
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
    let unit = product.price;
    const variant = typeof item.variant === "string" ? item.variant.slice(0, 200) : undefined;
    if (variant) {
      for (const part of variant.split("·").map((s) => s.trim()).filter(Boolean)) {
        const material = (product.materialOptions ?? []).find((o) => o.label === part);
        const size = (product.sizeOptions ?? []).find((o) => o.label === part);
        if (material) unit += material.priceDelta;
        else if (size) unit += size.priceDelta;
        // Unrecognised parts (e.g. base material names) add nothing.
      }
    }
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
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
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
      },
    });

    return NextResponse.json({ url: session.url, publishableKey: publishable });
  } catch {
    return NextResponse.json({ error: "Could not open Stripe Checkout." }, { status: 500 });
  }
}
