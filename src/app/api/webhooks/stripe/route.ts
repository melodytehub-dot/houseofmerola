import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, saveOrder } from "@/lib/content";
import type { Order, OrderItem } from "@/lib/site";

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

  const order: Order = {
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
  };
  await saveOrder(order);

  // Notify both sides by email; failures must never fail the webhook itself
  // (Stripe would retry a completed order, and the order is already saved).
  await sendOrderEmails(order);
}

/** Order confirmation to the customer plus a new-order alert to the studio. */
async function sendOrderEmails(order: Order) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const from =
    process.env.ORDER_FROM_EMAIL ||
    process.env.ENQUIRY_FROM_EMAIL ||
    "House of Merola <hello@houseofmerola.co.uk>";
  const merchant =
    process.env.ORDER_NOTIFY_EMAIL || process.env.ENQUIRY_TO_EMAIL || "";
  const money = (n: number) => `£${n.toFixed(2)}`;
  const lines = order.items
    .map(
      (i) =>
        `• ${i.name}${i.variant ? ` (${i.variant})` : ""} × ${i.qty} — ${money(i.unitPrice * i.qty)}`,
    )
    .join("\n");
  const deliverTo = [order.address, order.city, order.postcode]
    .filter(Boolean)
    .join(", ");

  const send = async (body: Record<string, unknown>) => {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch {
      /* email is best-effort; the order is already persisted */
    }
  };

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) {
    await send({
      from,
      to: order.email,
      ...(merchant ? { reply_to: merchant } : {}),
      subject: "Your House of Merola order is confirmed",
      text: [
        `Grazie${order.name ? `, ${order.name.split(" ")[0]}` : ""}! Your payment was successful and your order will be processed shortly.`,
        "",
        "Your order:",
        lines,
        "",
        `Subtotal: ${money(order.subtotal)}`,
        `Delivery (${order.deliveryZone === "international" ? "International" : "UK"}): ${
          order.shipping === 0 ? "Free" : money(order.shipping)
        }`,
        `Total paid: ${money(order.total)}`,
        "",
        deliverTo ? `Delivering to: ${deliverTo}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  if (merchant) {
    await send({
      from,
      to: merchant,
      reply_to: order.email,
      subject: `New order: ${order.name || order.email} — ${money(order.total)}`,
      text: [
        `A new ${order.deliveryZone === "international" ? "international" : "UK"} order just completed.`,
        "",
        lines,
        "",
        `Subtotal: ${money(order.subtotal)}`,
        `Delivery: ${order.shipping === 0 ? "Free" : money(order.shipping)}`,
        `Total: ${money(order.total)} (${order.currency.toUpperCase()})`,
        "",
        `Customer: ${order.name || "—"} <${order.email}>`,
        deliverTo ? `Deliver to: ${deliverTo}` : "",
        `Session: ${order.id}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }
}
