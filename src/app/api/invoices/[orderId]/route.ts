import { NextRequest } from "next/server";
import { isAuthorizedInternal, unauthorized } from "@/lib/internalAuth";
import { canDownloadInvoice } from "@/lib/companyInfo";
import { buildInvoicePdf, type InvoiceLine } from "@/lib/invoicePdf";

export const runtime = "nodejs";

interface OrderRow {
  id: string;
  created_at?: string;
  summary?: string;
  total?: number;
  status?: string;
  payment_status?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  details?: unknown;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === "string") {
    try { return asRecord(JSON.parse(value)); } catch { return {}; }
  }
  return typeof value === "object" ? value as Record<string, unknown> : {};
}

function linesFrom(details: Record<string, unknown>, summary: string, total: number): InvoiceLine[] {
  const raw = details.items;
  if (!Array.isArray(raw)) {
    return [{ name: summary || "Commande", qty: 1, price: total }];
  }
  const lines = raw.map((item) => {
    const row = asRecord(item);
    const qty = Number(row.qty ?? 1);
    const price = Number(row.price ?? 0);
    return {
      name: String(row.name ?? "Article"),
      qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
      price: Number.isFinite(price) ? price : 0,
    };
  }).filter(line => line.name);
  return lines.length > 0 ? lines : [{ name: summary || "Commande", qty: 1, price: total }];
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  if (!isAuthorizedInternal(req)) return unauthorized();

  const { orderId } = await ctx.params;
  const id = decodeURIComponent(orderId ?? "").trim();
  if (!/^[A-Za-z0-9_-]{4,80}$/.test(id)) {
    return Response.json({ error: "Référence invalide" }, { status: 400 });
  }

  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!sbUrl || !key) return Response.json({ error: "Stockage non configuré" }, { status: 503 });

  const res = await fetch(
    `${sbUrl}/rest/v1/orders?id=eq.${encodeURIComponent(id)}&select=id,created_at,summary,total,status,payment_status,client_name,client_email,client_phone,details&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
  );
  if (!res.ok) return Response.json({ error: "Commande introuvable" }, { status: 502 });

  const rows = await res.json() as OrderRow[];
  const order = Array.isArray(rows) ? rows[0] : undefined;
  if (!order) return Response.json({ error: "Commande introuvable" }, { status: 404 });

  if (!canDownloadInvoice(order.status, order.payment_status)) {
    return Response.json({ error: "Facture disponible uniquement pour une commande livrée ou payée" }, { status: 403 });
  }

  const details = asRecord(order.details);
  const total = Number(order.total ?? 0);
  const commission = Number(details.commission ?? 0);
  const pdf = await buildInvoicePdf({
    id: order.id,
    createdAt: order.created_at ?? "",
    clientName: order.client_name ?? "",
    clientEmail: order.client_email ?? "",
    clientPhone: order.client_phone ?? "",
    lines: linesFrom(details, order.summary ?? "", total),
    commission: Number.isFinite(commission) ? commission : 0,
    commissionLabel: String(details.commissionLabel ?? "Frais"),
    total,
  });

  return new Response(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${id}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
