import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSettings, getStripe } from "@/lib/content";

export const dynamic = "force-dynamic";

interface Line {
  name: string;
  price: number; // GBP
  qty: number;
  variant?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { items?: Line[] } | null;
  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const settings = await getSettings();
  const stripeCfg = await getStripe();
  const secret = stripeCfg.mode === "live" ? stripeCfg.live.secretKey : stripeCfg.sandbox.secretKey;
  const publishable = stripeCfg.mode === "live" ? stripeCfg.live.publishableKey : stripeCfg.sandbox.publishableKey;

  // Fall back to the current mock confirmation if Stripe isn't wired up yet.
  if (!stripeCfg.enabled || !secret) {
    return NextResponse.json({ fallback: true });
  }

  let stripe: Stripe;
  try {
    stripe = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });
  } catch {
    return NextResponse.json({ error: "Stripe is not configured correctly." }, { status: 500 });
  }

  const origin = new URL(request.url).origin;

  const lineItems = items.map((item) => ({
    quantity: Math.max(1, Math.min(99, item.qty)),
    price_data: {
      currency: settings.commerce.currency?.toLowerCase() || "gbp",
      unit_amount: Math.round(item.price * 100),
      product_data: {
        name: item.name,
        description: item.variant || undefined,
      },
    },
  }));

  // Compute shipping (mirror of the cart logic) as a single line item.
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping =
    settings.commerce.freeShippingThreshold > 0 &&
    subtotal >= settings.commerce.freeShippingThreshold
      ? 0
      : settings.commerce.shippingFee;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      ...(shipping > 0
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: Math.round(shipping * 100), currency: settings.commerce.currency?.toLowerCase() || "gbp" },
                  display_name: "UK delivery",
                },
              },
            ],
          }
        : {}),
      success_url: `${origin}/checkout?success=1`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      metadata: {
        source: "houseofmerola",
        ...(settings.metadata.url ? { site: settings.metadata.url } : {}),
      },
    });

    return NextResponse.json({ url: session.url, publishableKey: publishable });
  } catch {
    return NextResponse.json({ error: "Could not open Stripe Checkout." }, { status: 500 });
  }
}
