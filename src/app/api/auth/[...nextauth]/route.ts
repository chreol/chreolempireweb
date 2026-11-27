import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

type AuthContext = { params: Promise<{ nextauth: string[] }> };

async function handle(req: NextRequest, context: AuthContext) {
  const error = req.nextUrl.searchParams.get("error");
  const error_description = req.nextUrl.searchParams.get("error_description");
  const error_uri = req.nextUrl.searchParams.get("error_uri");
  if (error || error_description || error_uri) {
    console.error("[Auth][Google] callback", { error, error_description, error_uri });
  }
  return handler(req, context);
}

export { handle as GET, handle as POST };
