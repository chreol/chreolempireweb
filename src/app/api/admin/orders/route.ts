import { NextRequest } from "next/server";

export const runtime = "edge";

function authOk(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value ?? "";
  const secret = process.env.ADMIN_PASSWORD ?? "chreolempire-admin";
  return token === secret;
}

// Service key bypasse les RLS — obligatoire pour SELECT admin
function sbHeaders(write = false) {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const anonKey    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const key = (write || !serviceKey) ? anonKey : serviceKey;
  return {
    "Content-Type": "application/json",
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit  = parseInt(searchParams.get("limit") ?? "100", 10);

  let endpoint = `${url}/rest/v1/orders?select=*&order=created_at.desc&limit=${limit}`;
  if (status && status !== "all") endpoint += `&status=eq.${status}`;

  const res  = await fetch(endpoint, { headers: sbHeaders(false) });
  const data = await res.json();

  if (!res.ok) {
    console.error("[admin/orders GET]", res.status, data);
    return Response.json({ error: "Erreur Supabase — vérifiez SUPABASE_SERVICE_KEY", detail: data }, { status: 502 });
  }
  return Response.json(data);
}

export async function PATCH(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const body = await req.json();
  const { id, status, ...rest } = body;
  if (!id) return Response.json({ error: "id requis" }, { status: 400 });

  const patch: Record<string, unknown> = { ...rest };
  if (status) patch.status = status;

  const res = await fetch(`${url}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...sbHeaders(true), Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });

  return new Response(null, { status: res.ok ? 204 : 502 });
}
