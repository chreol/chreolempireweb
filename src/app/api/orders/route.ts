import { NextRequest } from "next/server";
import { isAuthorizedInternal, unauthorized } from "@/lib/internalAuth";

export const runtime = "edge";

// Commandes client (historique) : récupérées depuis Supabase par email.
// Champs nécessaires à l'affichage : mode de paiement, statut, détails/instructions, montant.
export async function GET(req: NextRequest): Promise<Response> {
  if (!isAuthorizedInternal(req)) return unauthorized();

  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key   = process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!sbUrl) return Response.json({ error: "non configure" }, { status: 503 });

  const email = new URL(req.url).searchParams.get("email")?.trim().toLowerCase();
  const userId = new URL(req.url).searchParams.get("userId")?.trim();
  if (!email && !userId) return Response.json({ error: "email requis" }, { status: 400 });

  let query = `select=id,summary,total,status,payment_status,payment_method,client_name,client_email,client_phone,details,created_at&order=created_at.desc&limit=50`;
  if (userId) {
    // Commandes du propriétaire (userId) OU commandes dont l'email correspond (achats invités).
    if (email) {
      query += `&or=(user_id.eq.${encodeURIComponent(userId)},client_email.eq.${encodeURIComponent(email)})`;
    } else {
      query += `&user_id=eq.${encodeURIComponent(userId)}`;
    }
  } else {
    query += `&client_email=eq.${encodeURIComponent(email ?? "")}`;
  }

  const res = await fetch(
    `${sbUrl}/rest/v1/orders?${query}`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );

  if (!res.ok) return Response.json({ error: "Erreur Supabase" }, { status: 502 });
  const rows = await res.json();
  const orders = Array.isArray(rows) ? rows : [];
  return Response.json(orders);
}
