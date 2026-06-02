import { NextRequest } from "next/server";

export const runtime = "edge";

function authOk(req: NextRequest) {
  return req.cookies.get("admin_token")?.value === (process.env.ADMIN_PASSWORD ?? "chreolempire-admin");
}
function sbKey() { return process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""; }

interface OrderRow {
  id: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  summary: string | null;
  total: number | null;
  payment_method: string | null;
  status: string | null;
  created_at: string | null;
}

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return new Response("Non autorisé", { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = sbKey();
  if (!url) return new Response("Supabase non configuré", { status: 503 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "csv";
  const month  = searchParams.get("month"); // format YYYY-MM, optionnel

  let endpoint = `${url}/rest/v1/orders?select=*&order=created_at.desc&limit=5000`;
  if (month) {
    const start = `${month}-01T00:00:00`;
    const [y, m] = month.split("-").map(Number);
    const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
    endpoint += `&created_at=gte.${start}&created_at=lt.${next}-01T00:00:00`;
  }

  const res  = await fetch(endpoint, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  const rows: OrderRow[] = await res.json();
  const list = Array.isArray(rows) ? rows : [];

  if (format === "json") {
    const done = list.filter(o => o.status === "done");
    return Response.json({
      period: month ?? "tout",
      totalOrders:   list.length,
      doneOrders:    done.length,
      pendingOrders: list.filter(o => o.status === "pending").length,
      cancelled:     list.filter(o => o.status === "cancelled").length,
      revenue:       done.reduce((s, o) => s + (o.total ?? 0), 0),
      byPayment:     Object.entries(
        done.reduce((acc, o) => { const k = o.payment_method ?? "?"; acc[k] = (acc[k] ?? 0) + (o.total ?? 0); return acc; }, {} as Record<string, number>)
      ),
    });
  }

  // CSV
  const headers = ["ID", "Date", "Client", "Email", "Téléphone", "Résumé", "Total FCFA", "Paiement", "Statut"];
  const lines = [headers.join(";")];
  for (const o of list) {
    lines.push([
      o.id,
      o.created_at ? new Date(o.created_at).toLocaleString("fr-FR") : "",
      o.client_name, o.client_email, o.client_phone,
      o.summary, o.total, o.payment_method, o.status,
    ].map(csvCell).join(";"));
  }
  const csv = "﻿" + lines.join("\n"); // BOM pour Excel

  const filename = `chreol-commandes-${month ?? "tout"}.csv`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
