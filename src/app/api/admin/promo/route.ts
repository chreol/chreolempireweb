import { NextRequest } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "edge";

async function authOk(req: NextRequest) {
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(req.cookies.get("admin_token")?.value ?? "", secret));
}

function sbKey() {
  return process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

function sbHeaders() {
  const k = sbKey();
  return { "Content-Type": "application/json", apikey: k, Authorization: `Bearer ${k}` };
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return Response.json([]);
  const res = await fetch(`${url}/rest/v1/promo_codes?select=*&order=created_at.desc`, { headers: sbHeaders() });
  return Response.json(await res.json());
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const body = await req.json();
  const code = {
    id:           crypto.randomUUID(),
    code:         body.code.toUpperCase().trim(),
    type:         body.type ?? "percent",   // "percent" | "fixed"
    value:        parseInt(body.value, 10),
    min_order:    parseInt(body.min_order ?? "0", 10),
    max_uses:     parseInt(body.max_uses ?? "0", 10),
    uses:         0,
    active:       true,
    expires_at:   body.expires_at ?? null,
    description:  body.description ?? null,
  };

  const res = await fetch(`${url}/rest/v1/promo_codes`, {
    method: "POST",
    headers: { ...sbHeaders(), Prefer: "return=representation" },
    body: JSON.stringify(code),
  });
  return Response.json(await res.json(), { status: res.ok ? 201 : 502 });
}

export async function DELETE(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return Response.json({ error: "Supabase non configuré" }, { status: 503 });
  const { id } = await req.json();
  await fetch(`${url}/rest/v1/promo_codes?id=eq.${id}`, { method: "DELETE", headers: sbHeaders() });
  return new Response(null, { status: 204 });
}
