import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

function getSecret() {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) throw new Error("AUTH_JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const normalized = (email || "").trim().toLowerCase();

    if (!normalized || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Case-insensitive lookup (works even if DB email was stored with mixed case)
    const user = await prisma.user.findFirst({
      where: { email: { equals: normalized, mode: "insensitive" } },
      select: { id: true, email: true, name: true, role: true, passwordHash: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash || "");
    if (!ok || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Issue JWT
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name || "",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(getSecret());

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role, name: user.name || "" },
    });

    // HttpOnly; secure only in prod so localhost works
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      //secure: true,
      path: "/",
      //maxAge: 60 * 60 * 8, // 8 hours
    });

    return res;
  } catch (e) {
    console.error("login error", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}