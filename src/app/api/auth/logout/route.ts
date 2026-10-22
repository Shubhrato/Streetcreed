import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

// POST /api/auth/logout — destroys the session cookie server-side.
export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
