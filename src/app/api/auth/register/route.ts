import { NextResponse } from "next/server";
import { createSessionToken, hashPassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validation";

// POST /api/auth/register — validates, hashes the password with bcrypt
// and creates the account, then signs the new user in.
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (rateLimited(`register:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Invalid details", field: first?.path[0] },
      { status: 422 },
    );
  }
  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  let existing;
  try {
    existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  } catch {
    return NextResponse.json(
      { error: "Accounts are not configured yet — connect the database first (DATABASE_URL, see README)." },
      { status: 503 },
    );
  }
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists — sign in instead." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name: name.trim(), email: normalizedEmail, passwordHash },
  });

  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "CUSTOMER" | "ADMIN",
  };
  const token = await createSessionToken(sessionUser);
  await setSessionCookie(token);
  return NextResponse.json({ user: sessionUser }, { status: 201 });
}
