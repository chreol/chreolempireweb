import { NextRequest } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

async function authOk(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value ?? "";
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(token, secret));
}

// Liste des utilisateurs inscrits (Supabase Auth admin).
export async function GET(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get("per_page") ?? "100", 10)));

  const res = await fetch(`${url}/auth/v1/admin/users?page=${page}&per_page=${perPage}`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!res.ok) return Response.json({ error: "Erreur Supabase" }, { status: 502 });
  const data = await res.json();
  const users = (Array.isArray(data?.users) ? data.users : []) as Array<Record<string, unknown>>;

  const list = users.map((u) => {
    const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
    const name = String(meta.full_name ?? meta.name ?? "");
    return {
      id: String(u.id ?? ""),
      email: String(u.email ?? ""),
      name,
      created_at: String(u.created_at ?? ""),
      confirmed_at: String(u.confirmed_at ?? ""),
    };
  });

  return Response.json({ users: list, total: Number(data?.total ?? list.length) });
}
