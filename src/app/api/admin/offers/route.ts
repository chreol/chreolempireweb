import { NextRequest } from "next/server";

export const runtime = "edge";

function authOk(req: NextRequest): boolean {
  const token  = req.cookies.get("admin_token")?.value ?? "";
  const secret = process.env.ADMIN_PASSWORD ?? "chreolempire-admin";
  return token === secret;
}

const SB_HEADERS = (key: string) => ({
  "Content-Type": "application/json",
  apikey: key,
  Authorization: `Bearer ${key}`,
});

export async function GET(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return Response.json([]);

  const res = await fetch(`${url}/rest/v1/offers?select=*&order=created_at.desc`, {
    headers: SB_HEADERS(key),
  });
  return Response.json(await res.json());
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const body = await req.json();
  const offer = {
    id:          crypto.randomUUID(),
    title:       body.title,
    description: body.description,
    price:       parseInt(body.price, 10) || 0,
    promo_price: body.promo_price ? parseInt(body.promo_price, 10) : null,
    service:     body.service,
    currency:    body.currency ?? "FCFA",
    badge:       body.badge ?? null,
    active:      body.active ?? true,
    expires_at:  body.expires_at ?? null,
    wa_prefill:  body.wa_prefill ?? null,
  };

  const res = await fetch(`${url}/rest/v1/offers`, {
    method: "POST",
    headers: { ...SB_HEADERS(key), Prefer: "return=representation" },
    body: JSON.stringify(offer),
  });
  return Response.json(await res.json(), { status: res.ok ? 201 : 502 });
}

export async function PATCH(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const { id, ...patch } = await req.json();
  const res = await fetch(`${url}/rest/v1/offers?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...SB_HEADERS(key), Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
  return new Response(null, { status: res.ok ? 204 : 502 });
}

export async function DELETE(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const { id } = await req.json();
  const res = await fetch(`${url}/rest/v1/offers?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: SB_HEADERS(key),
  });
  return new Response(null, { status: res.ok ? 204 : 502 });
}
