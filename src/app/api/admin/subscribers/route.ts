import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSubscribers, removeSubscriber } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ subscribers: await getSubscribers() });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  await removeSubscriber(body.id);
  return NextResponse.json({ ok: true });
}
