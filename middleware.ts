import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecret() {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) throw new Error("AUTH_JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate /admin (and its children)
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow the login page itself
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "ADMIN") {
      const url = new URL("/admin/login", req.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    const url = new URL("/admin/login", req.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};