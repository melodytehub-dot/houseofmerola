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

  // Async fulfilment: record completed Checkout Sessions so orders are visible.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || "unknown";
    const name = session.customer_details?.name || email;
    // A real backend can write this to an orders table or trigger fulfilment.
    console.info(`[stripe] order completed: ${session.id} · ${email}`);
    void name;
  }

  return NextResponse.json({ received: true });
}
