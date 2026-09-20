import { NextResponse } from "next/server";
import { addEnquiry, slugify } from "@/lib/content";
import type { Enquiry } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<Enquiry> | null;
  if (!body || !body.name || !EMAIL_RE.test(body.email || "")) {
    return NextResponse.json(
      { error: "Please provide your name and a valid email." },
      { status: 400 },
    );
  }
  const enquiry = await addEnquiry({
    kind: body.kind === "contact" ? "contact" : "bespoke",
    name: String(body.name).slice(0, 120),
    email: String(body.email).slice(0, 200),
    text: body.text ? String(body.text).slice(0, 2000) : undefined,
    notes: body.notes ? String(body.notes).slice(0, 4000) : undefined,
    productName: body.productName ? String(body.productName).slice(0, 200) : undefined,
    material: body.material ? String(body.material).slice(0, 200) : undefined,
    size: body.size ? String(body.size).slice(0, 200) : undefined,
    reference: body.reference
      ? {
          name: String(body.reference.name).slice(0, 200),
          dataUrl: String(body.reference.dataUrl).slice(0, 8_000_000),
        }
      : null,
  });

  // Optional: forward the enquiry to a transactional email provider if configured.
  if (process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.ENQUIRY_FROM_EMAIL || "House of Merola <onboarding@resend.dev>",
          to: process.env.ENQUIRY_TO_EMAIL,
          reply_to: enquiry.email,
          subject: `New ${enquiry.kind} enquiry: ${enquiry.name}`,
          text: [
            `Type: ${enquiry.kind}`,
            enquiry.productName ? `Piece: ${enquiry.productName}` : "",
            enquiry.material ? `Material: ${enquiry.material}` : "",
            enquiry.size ? `Size: ${enquiry.size}` : "",
            enquiry.text ? `Message: ${enquiry.text}` : "",
            enquiry.notes ? `Notes: ${enquiry.notes}` : "",
            `Reference image: ${enquiry.reference ? enquiry.reference.name : "none"}`,
            `From: ${enquiry.name} <${enquiry.email}>`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
    } catch {
      /* email is best-effort; the enquiry is already persisted */
    }
  }

  return NextResponse.json({ ok: true, id: enquiry.id, slug: slugify(enquiry.name) });
}
