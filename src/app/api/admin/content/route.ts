import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getContent,
  getStripe,
  maskStripe,
  mergeStripe,
  setContent,
} from "@/lib/content";
import type { Content } from "@/lib/site";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getContent();
  return NextResponse.json({
    ...content,
    stripe: maskStripe(content.stripe),
  });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as Partial<Content> | null;
  if (!body || !Array.isArray(body.products) || !Array.isArray(body.collections)) {
    return NextResponse.json(
      { error: "Invalid content payload." },
      { status: 400 },
    );
  }
  const current = await getContent();
  const stripe = mergeStripe(current.stripe, body.stripe ?? (await getStripe()));
  const next: Content = {
    products: body.products,
    collections: body.collections,
    settings: body.settings ?? current.settings,
    stripe,
  };
  await setContent(next);
  return NextResponse.json({ ok: true, content: { ...next, stripe: maskStripe(next.stripe) } });
}
