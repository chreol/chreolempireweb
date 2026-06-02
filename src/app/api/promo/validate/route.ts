// Public endpoint — validates a promo code for a given order total
export const runtime = "edge";

export async function POST(request: Request): Promise<Response> {
  const { code, total } = await request.json().catch(() => ({ code: "", total: 0 }));
  if (!code || !total) return Response.json({ error: "code et total requis" }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url) return Response.json({ error: "non configuré" }, { status: 503 });

  const res  = await fetch(`${url}/rest/v1/promo_codes?code=eq.${encodeURIComponent(code.toUpperCase())}&active=eq.true&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows = await res.json();
  const promo = Array.isArray(rows) ? rows[0] : null;

  if (!promo) return Response.json({ valid: false, error: "Code promo invalide ou expiré" });
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) return Response.json({ valid: false, error: "Code promo expiré" });
  if (promo.max_uses > 0 && promo.uses >= promo.max_uses) return Response.json({ valid: false, error: "Code promo épuisé" });
  if (promo.min_order > 0 && total < promo.min_order) return Response.json({ valid: false, error: `Commande minimum ${promo.min_order.toLocaleString("fr-FR")} FCFA` });

  const discount = promo.type === "percent"
    ? Math.round(total * promo.value / 100)
    : promo.value;

  return Response.json({ valid: true, discount, type: promo.type, value: promo.value, description: promo.description });
}
