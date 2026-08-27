export const runtime = "edge";
import { createAdminToken, getAdminSecret } from "@/lib/adminAuth";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request): Promise<Response> {
  const { password } = await request.json().catch(() => ({ password: "" }));
  const secret = getAdminSecret();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && now < entry.resetAt && entry.count >= 5) {
    return Response.json({ error: "Trop de tentatives, réessayez dans une minute" }, { status: 429 });
  }
  if (!secret) return Response.json({ error: "Authentification admin non configurée" }, { status: 503 });

  if (password !== secret) {
    if (!entry || now >= entry.resetAt) attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    else entry.count++;
    return Response.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  attempts.delete(ip);
  const token = await createAdminToken(secret);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
    },
  });
}

export async function DELETE(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": "admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
    },
  });
}
