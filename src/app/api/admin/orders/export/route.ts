import { NextRequest } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "edge";

async function authOk(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value ?? "";
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(token, secret));
}

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

function csvEscape(v: unknown): string {
  const s = String(v ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return new Response("Non autorisé", { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return new Response("Supabase non configuré", { status: 503 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit  = Math.min(parseInt(searchParams.get("limit") ?? "500", 10) || 500, 2000);

  let endpoint = `${url}/rest/v1/orders?select=id,created_at,type,summary,total,item_count,payment_method,status,payment_status,client_name,client_email,client_phone,client_city&order=created_at.desc&limit=${limit}`;
  if (status && status !== "all") endpoint += `&status=eq.${status}`;

  const res  = await fetch(endpoint, { headers: sbHeaders(false) });
  const data = await res.json();

  if (!res.ok) {
    console.error("[admin/orders/export GET]", res.status, data);
    return new Response("Erreur Supabase", { status: 502 });
  }

  const rows = Array.isArray(data) ? data : [];
  const headers = [
    "id", "created_at", "type", "summary", "total", "item_count",
    "payment_method", "status", "payment_status", "client_name", "client_email", "client_phone", "client_city",
  ];
  const lines = [headers.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(headers.map(h => csvEscape((row as Record<string, unknown>)[h])).join(","));
  }

  const csv = lines.join("\r\n");
  return new Response(csv, {
    status: 200,
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="commandes-chreolempire.csv"' },
  });
}
