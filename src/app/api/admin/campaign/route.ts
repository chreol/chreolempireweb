import { NextRequest } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "edge";

async function authOk(req: NextRequest) {
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(req.cookies.get("admin_token")?.value ?? "", secret));
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { subject, htmlContent, previewText, filterService } = await req.json();
  if (!subject || !htmlContent) return Response.json({ error: "subject et htmlContent requis" }, { status: 400 });

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) return Response.json({ error: "Brevo non configuré" }, { status: 503 });

  // Récupère la liste des emails uniques depuis les commandes Supabase
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  let sbUrl = `${url}/rest/v1/orders?select=client_email,client_name&not.client_email.is.null&not.client_email.eq.noreply@chreolempire.com`;
  if (filterService) sbUrl += `&details->>service=eq.${filterService}`;

  const ordersRes = await fetch(sbUrl, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  const orders    = await ordersRes.json() as { client_email: string; client_name: string }[];

  // Déduplique les emails
  const seen   = new Set<string>();
  const recipients: { email: string; name: string }[] = [];
  for (const o of (Array.isArray(orders) ? orders : [])) {
    if (o.client_email && !seen.has(o.client_email)) {
      seen.add(o.client_email);
      recipients.push({ email: o.client_email, name: o.client_name ?? "Client" });
    }
  }

  if (recipients.length === 0) return Response.json({ error: "Aucun destinataire trouvé", sent: 0 });

  // Envoi via Brevo
  const senderIdRaw = process.env.BREVO_SENDER_ID;
  const sender = senderIdRaw
    ? { id: parseInt(senderIdRaw, 10) }
    : { name: "Chreol Empire", email: process.env.BREVO_SENDER_EMAIL ?? "contact@chreolempire.com" };

  const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": brevoKey },
    body: JSON.stringify({
      sender,
      to: recipients,
      subject,
      htmlContent,
      ...(previewText ? { params: { previewText } } : {}),
    }),
  });

  if (!brevoRes.ok) {
    const err = await brevoRes.text();
    return Response.json({ error: "Brevo error", detail: err }, { status: 502 });
  }

  return Response.json({ ok: true, sent: recipients.length, recipients: recipients.map(r => r.email) });
}
