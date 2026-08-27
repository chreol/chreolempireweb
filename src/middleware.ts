import { NextRequest, NextResponse } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ne pas protéger la page de login elle-même → évite la boucle infinie
  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const token  = req.cookies.get("admin_token")?.value ?? "";
    const secret = getAdminSecret();
    if (!secret || !(await verifyAdminToken(token, secret))) {
      const login = req.nextUrl.clone();
      login.pathname = "/admin/login";
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
