import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest): Promise<Response> {
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key   = process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!sbUrl) return Response.json({ duplicate: false });

  const email = new URL(req.url).searchParams.get("email")?.trim().toLowerCase();
  if (!email) return Response.json({ duplicate: false });

  // Cherche une commande pending du même email dans les 30 dernières minutes
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const endpoint = `${sbUrl}/rest/v1/orders`
    + `?select=id,total,summary,created_at`
    + `&client_email=eq.${encodeURIComponent(email)}`
    + `&status=eq.pending`
    + `&created_at=gte.${encodeURIComponent(since)}`
    + `&order=created_at.desc`
    + `&limit=1`;

  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  }).catch(() => null);

  if (!res?.ok) return Response.json({ duplicate: false });

  const rows = await res.json().catch(() => []);
  const order = Array.isArray(rows) && rows[0];

  if (!order) return Response.json({ duplicate: false });

  return Response.json({
    duplicate:  true,
    orderId:    order.id,
    total:      order.total,
    summary:    order.summary,
    created_at: order.created_at,
  });
}
