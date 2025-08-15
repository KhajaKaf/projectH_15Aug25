import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecret() {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) throw new Error("AUTH_JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function GET(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const { payload } = await jwtVerify(token, getSecret());
    return NextResponse.json({
      user: { id: payload.sub, email: payload.email, role: payload.role, name: payload.name },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}