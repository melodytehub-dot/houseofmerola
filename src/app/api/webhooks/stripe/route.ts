import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/content";

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

  // A completed Checkout session means an order was paid — log it here so it can feed an orders list or fulfilment flow.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || "unknown";
    console.info(`[stripe] order completed: ${session.id} · ${email}`);
  }

  return NextResponse.json({ received: true });
}
