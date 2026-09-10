import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getEnquiries, setEnquiryStatus } from "@/lib/content";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ enquiries: await getEnquiries() });
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    status?: "new" | "done";
  } | null;
  if (!body?.id || (body.status !== "new" && body.status !== "done")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  await setEnquiryStatus(body.id, body.status);
  return NextResponse.json({ ok: true });
}
