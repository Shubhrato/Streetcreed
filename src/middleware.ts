import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Kept in sync with SESSION_COOKIE in src/lib/auth.ts (not imported here —
// lib/auth pulls in next/headers, which middleware cannot use).
const SESSION_COOKIE = "sc_session";

/**
 * Server-side route protection — runs on EVERY request to /account/*
 * and /admin/* before the page renders:
 *
 * - No session cookie, an expired token, or a token whose signature does
 *   not verify  →  redirect to /login (with a safe, internal callbackUrl).
 * - /admin additionally requires role=ADMIN inside the verified token.
 *
 * Because identity comes from the signed token — never from the URL —
 * editing the address bar cannot open another user's account.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let role: string | null = null;
  if (token && process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET), {
        algorithms: ["HS256"],
      });
      role = typeof payload.role === "string" ? payload.role : "CUSTOMER";
    } catch {
      role = null; // forged / expired / malformed
    }
  }

  if (role === null) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
