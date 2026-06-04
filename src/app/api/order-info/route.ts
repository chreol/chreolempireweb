import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest): Promise<Response> {
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key   = process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!sbUrl) return Response.json({ error: "non configuré" }, { status: 503 });

  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id) return Response.json({ error: "id requis" }, { status: 400 });

  const res = await fetch(
    `${sbUrl}/rest/v1/orders?id=eq.${encodeURIComponent(id)}&select=id,summary,total,status,payment_method,proof_url,created_at`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );

  if (!res.ok) return Response.json({ error: "introuvable" }, { status: 404 });

  const rows = await res.json();
  const order = Array.isArray(rows) ? rows[0] : null;
  if (!order) return Response.json({ error: "introuvable" }, { status: 404 });

  // Retourne uniquement les champs non-sensibles
  return Response.json({
    id:             order.id,
    summary:        order.summary,
    total:          order.total,
    status:         order.status,
    payment_method: order.payment_method,
    proof_url:      order.proof_url ?? null,
    created_at:     order.created_at,
  });
}
