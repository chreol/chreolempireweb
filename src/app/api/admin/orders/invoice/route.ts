import { NextRequest } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";
import { buildInvoicePdf, type InvoiceLine } from "@/lib/invoicePdf";

export const runtime = "nodejs";

function asRecord(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === "string") {
    try { return asRecord(JSON.parse(value)); } catch { return {}; }
  }
  return typeof value === "object" ? value as Record<string, unknown> : {};
}

function linesFrom(details: Record<string, unknown>, summary: string, total: number): InvoiceLine[] {
  const raw = details.items;
  if (!Array.isArray(raw)) return [{ name: summary || "Commande", qty: 1, price: total }];
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

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const secret = getAdminSecret();
    const token = req.cookies.get("admin_token")?.value ?? "";
    if (!secret || !(await verifyAdminToken(token, secret))) {
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const id = String(body.id ?? "").trim();
    if (!/^[A-Za-z0-9_-]{4,80}$/.test(id)) {
      return Response.json({ error: "Référence invalide" }, { status: 400 });
    }

    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!sbUrl || !key) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

    const orderRes = await fetch(
      `${sbUrl}/rest/v1/orders?id=eq.${encodeURIComponent(id)}&select=id,created_at,summary,total,client_name,client_email,client_phone,details&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!orderRes.ok) return Response.json({ error: "Commande introuvable" }, { status: 502 });
    const rows = await orderRes.json() as Array<Record<string, unknown>>;
    const order = Array.isArray(rows) ? rows[0] : undefined;
    if (!order) return Response.json({ error: "Commande introuvable" }, { status: 404 });

    const email = String(order.client_email ?? "").trim();
    if (!email.includes("@")) return Response.json({ error: "Cette commande n'a pas d'email client." }, { status: 400 });

    const details = asRecord(order.details);
    const total = Number(order.total ?? 0);
    const commission = Number(details.commission ?? 0);
    const pdf = await buildInvoicePdf({
      id,
      createdAt: String(order.created_at ?? ""),
      clientName: String(order.client_name ?? ""),
      clientEmail: email,
      clientPhone: String(order.client_phone ?? ""),
      lines: linesFrom(details, String(order.summary ?? ""), total),
      commission: Number.isFinite(commission) ? commission : 0,
      commissionLabel: String(details.commissionLabel ?? "Frais"),
      total,
    });

    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) return Response.json({ error: "Brevo non configuré" }, { status: 503 });

    const senderIdRaw = process.env.BREVO_SENDER_ID;
    const sender = senderIdRaw
      ? { id: parseInt(senderIdRaw, 10) }
      : { name: "Chreol Empire", email: process.env.BREVO_SENDER_EMAIL ?? "contact@chreolempire.com" };
    const ref = id.slice(-8).toUpperCase();
    const name = String(order.client_name ?? "Client");

    const mail = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": brevoKey },
      body: JSON.stringify({
        sender,
        to: [{ email, name }],
        subject: `Facture #${ref} — Chreol Empire`,
        htmlContent: `<p>Bonjour ${name},</p><p>Veuillez trouver votre facture <strong>#${ref}</strong> en pièce jointe.</p><p>Merci de votre confiance.<br>CHREOL EMPIRE SARL</p>`,
        attachment: [{ content: Buffer.from(pdf).toString("base64"), name: `facture-${id}.pdf` }],
      }),
    });
    if (!mail.ok) {
      console.error("[admin/invoice] Brevo", mail.status, (await mail.text()).slice(0, 300));
      return Response.json({ error: "L'envoi Brevo a échoué." }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[admin/invoice]", err);
    return Response.json({ error: "Envoi de la facture impossible." }, { status: 500 });
  }
}
