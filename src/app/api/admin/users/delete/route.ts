import { NextRequest } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

async function authOk(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value ?? "";
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(token, secret));
}

// Suppression d'un utilisateur (Supabase Auth admin).
export async function DELETE(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const id = String((body as { id?: string }).id ?? "");
  if (!id) return Response.json({ error: "id requis" }, { status: 400 });

  const res = await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!res.ok) return Response.json({ error: "Erreur suppression utilisateur" }, { status: 502 });
  return Response.json({ ok: true });
}
