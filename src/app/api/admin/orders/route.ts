import { NextRequest } from "next/server";

export const runtime = "edge";

function authOk(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value ?? "";
  const secret = process.env.ADMIN_PASSWORD ?? "chreolempire-admin";
  return token === secret;
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit  = parseInt(searchParams.get("limit") ?? "50", 10);

  let endpoint = `${url}/rest/v1/orders?select=*&order=created_at.desc&limit=${limit}`;
  if (status && status !== "all") endpoint += `&status=eq.${status}`;

  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });

  const data = await res.json();
  return Response.json(data);
}

export async function PATCH(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const { id, status } = await req.json();
  if (!id || !status) return Response.json({ error: "id et status requis" }, { status: 400 });

  const res = await fetch(`${url}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}`, Prefer: "return=minimal" },
    body: JSON.stringify({ status }),
  });

  return new Response(null, { status: res.ok ? 204 : 502 });
}
