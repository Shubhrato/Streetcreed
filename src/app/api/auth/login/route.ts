import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

// POST /api/auth/login — verifies credentials against the DB (bcrypt),
// then issues a signed httpOnly session cookie. Generic error messages
// only: the response never reveals whether the email exists.
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (rateLimited(`login:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute and try again." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid credentials" }, { status: 422 });
  }
  const { email, password } = parsed.data;

  // Per-account throttle as well as per-IP (credential stuffing defence).
  if (rateLimited(`login-acct:${email.toLowerCase()}`, 8, 5 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts on this account. Please wait a few minutes." }, { status: 429 });
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  } catch {
    return NextResponse.json(
      { error: "Accounts are not configured yet — connect the database first (DATABASE_URL, see README)." },
      { status: 503 },
    );
  }

  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "CUSTOMER" | "ADMIN",
  };
  const token = await createSessionToken(sessionUser);
  await setSessionCookie(token);
  return NextResponse.json({ user: sessionUser });
}
