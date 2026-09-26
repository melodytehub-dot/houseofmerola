import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, saveOrder } from "@/lib/content";
import type { OrderItem } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const cfg = await getStripe();
  const mode = cfg.mode === "live" ? cfg.live : cfg.sandbox;
  const webhookSecret = mode.webhookSecret;
  if (!webhookSecret) {
    return NextResponse.json({ received: true });
  }
  const signature = req.headers.get("stripe-signature") || "";
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(webhookSecret, { apiVersion: "2025-02-24.acacia" });
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // The signing secret authenticates the event; the API secret key is what
    // allows us to call the Stripe API and expand line items. They are not
    // interchangeable, so pass the API key here.
    await handleCheckoutCompleted(session, mode.secretKey);
  }

  return NextResponse.json({ received: true });
}

/**
 * Persist a paid checkout session as an order so it can be managed from the
 * admin Orders panel. Uses the session id as the key so Stripe's at-least-once
 * delivery and manual retries never create duplicates.
 */
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  apiKey: string,
) {
  let expanded = session;
  if (apiKey) {
    try {
      const stripe = new Stripe(apiKey, { apiVersion: "2025-02-24.acacia" });
      expanded = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product"],
      });
    } catch {
      /* Fall back to the session object delivered with the event. */
    }
  }

  const items: OrderItem[] = (expanded.line_items?.data ?? []).map((li) => {
    // `price` is a live Price object once expanded; its `product` holds the
    // name we set, and `description` holds the variant line.
    const price = typeof li.price === "object" && li.price ? li.price : null;
    const rawProduct =
      price && typeof price.product === "object" && price.product ? price.product : null;
    const product = rawProduct && "name" in rawProduct ? rawProduct : null;
    const productName = product?.name ?? null;
    const variant = product?.description || undefined;
    const unitAmount =
      price?.unit_amount ?? (li.quantity ? li.amount_subtotal / li.quantity : 0);
    return {
      name: productName ?? li.description ?? "Item",
      unitPrice: unitAmount / 100,
      qty: li.quantity ?? 1,
      variant,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const total = (expanded.amount_total ?? 0) / 100;
  // Prefer Stripe's own shipping breakdown; fall back to the difference when
  // line items weren't available (e.g. the API key was missing).
  const statedShipping = expanded.total_details?.amount_shipping;
  const shipping =
    typeof statedShipping === "number"
      ? statedShipping / 100
      : Math.max(0, total - subtotal);
  const currency = expanded.currency ?? "gbp";
  const zone =
    expanded.metadata?.delivery_zone === "international" ? "international" : "uk";
  const meta = expanded.metadata ?? {};
  const text = (v: unknown, max: number) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;

  await saveOrder({
    id: expanded.id,
    createdAt: new Date().toISOString(),
    email: expanded.customer_details?.email || expanded.customer_email || "unknown",
    name: text(meta.contact_name, 120) ?? expanded.customer_details?.name ?? undefined,
    address: text(meta.contact_address, 200),
    city: text(meta.contact_city, 120),
    postcode: text(meta.contact_postcode, 40),
    deliveryZone: zone,
    currency,
    subtotal,
    shipping,
    total,
    items,
    status: "new",
    paymentStatus: "paid",
  });
}
