import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, saveOrder } from "@/lib/content";
import type { OrderItem } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const cfg = await getStripe();
  const secret = cfg.mode === "live" ? cfg.live.webhookSecret : cfg.sandbox.webhookSecret;
  if (!secret) {
    return NextResponse.json({ received: true });
  }
  const signature = req.headers.get("stripe-signature") || "";
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session, secret);
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
  secret: string,
) {
  const stripe = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });
  let expanded = session;
  try {
    expanded = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "line_items.data.price.product"],
    });
  } catch {
    /* Fall back to the session object delivered with the event. */
  }

  const items: OrderItem[] = (expanded.line_items?.data ?? []).map((li) => {
    // `price` is a live Price object once expanded; its `product` holds our name.
    const price = typeof li.price === "object" && li.price ? li.price : null;
    const productName =
      price && typeof price.product === "object" && price.product && "name" in price.product
        ? price.product.name
        : null;
    const unitAmount =
      price?.unit_amount ?? (li.quantity ? li.amount_subtotal / li.quantity : 0);
    return {
      name: productName ?? li.description ?? "Item",
      unitPrice: unitAmount / 100,
      qty: li.quantity ?? 1,
      variant: li.description || undefined,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const total = (expanded.amount_total ?? 0) / 100;
  const shipping = Math.max(0, total - subtotal);
  const currency = expanded.currency ?? "gbp";
  const zone =
    expanded.metadata?.delivery_zone === "international" ? "international" : "uk";

  await saveOrder({
    id: expanded.id,
    createdAt: new Date().toISOString(),
    email: expanded.customer_details?.email || "unknown",
    name: expanded.customer_details?.name ?? undefined,
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
