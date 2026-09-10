import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getOrders, setOrderStatus } from "@/lib/content";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: await getOrders() });
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    status?: "new" | "fulfilled";
  } | null;
  if (!body?.id || (body.status !== "new" && body.status !== "fulfilled")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  await setOrderStatus(body.id, body.status);
  return NextResponse.json({ ok: true });
}
