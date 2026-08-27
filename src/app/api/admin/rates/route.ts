import { NextRequest } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "edge";

async function authOk(req: NextRequest) {
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(req.cookies.get("admin_token")?.value ?? "", secret));
}
function sbKey() { return process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""; }
function sbH()   { const k = sbKey(); return { "Content-Type": "application/json", apikey: k, Authorization: `Bearer ${k}` }; }

export async function GET(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return Response.json([]);
  const res = await fetch(`${url}/rest/v1/exchange_rates?select=*&order=updated_at.desc`, { headers: sbH() });
  return Response.json(await res.json());
}

export async function PATCH(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const { id, buy_rate, sell_rate, label } = await req.json();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (buy_rate  !== undefined) patch.buy_rate  = buy_rate;
  if (sell_rate !== undefined) patch.sell_rate = sell_rate;
  if (label)                   patch.label     = label;

  const res = await fetch(`${url}/rest/v1/exchange_rates?id=eq.${id}`, {
    method: "PATCH", headers: { ...sbH(), Prefer: "return=minimal" }, body: JSON.stringify(patch),
  });
  return new Response(null, { status: res.ok ? 204 : 502 });
}
