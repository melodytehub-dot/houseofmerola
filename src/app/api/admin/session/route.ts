import { NextResponse } from "next/server";
import { isAdminEnabled, isAuthenticated } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({
    enabled: isAdminEnabled(),
    authenticated: await isAuthenticated(),
  });
}
