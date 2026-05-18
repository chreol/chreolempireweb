export const runtime = "edge";

interface CampayWebhookBody {
  reference: string;
  status: "SUCCESS" | "FAILED";
  amount: string;
  currency: string;
  operator: string;
  code: string;
  operator_reference: string;
  endpoint: string;
  signature: string;
  external_reference: string;
  username: string;
}

async function verifySignature(secret: string, payload: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signatureBytes = hexToBytes(signature);
  return crypto.subtle.verify("HMAC", key, signatureBytes, encoder.encode(payload));
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

async function insertOrder(body: CampayWebhookBody, serviceId: string, clientPhone: string, productCode: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;

  const operatorLabel = body.operator?.toLowerCase().includes("orange") ? "Orange Money" : "MTN MoMo";

  await fetch(`${url}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      type: "achat",
      summary: `${serviceId} — ${body.amount} XAF via ${operatorLabel} (${clientPhone})${productCode ? ` — ${productCode}` : ""}`,
      total: parseInt(body.amount, 10),
      payment_method: operatorLabel,
      item_count: 1,
      status: "done",
      payment_reference: body.reference,
      payment_status: "auto",
      payment_auto: true,
      client_name: clientPhone,
      client_city: "Douala",
      details: {
        serviceId,
        clientPhone,
        productCode: productCode || null,
        operator_reference: body.operator_reference,
        campay_reference: body.reference,
      },
    }),
  });
}

async function sendEmailNotification(body: CampayWebhookBody, serviceId: string, clientPhone: string, productCode: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const operatorLabel = body.operator?.toLowerCase().includes("orange") ? "Orange Money" : "MTN MoMo";
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Chreol Empire <onboarding@resend.dev>";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: ["chreolempire00@gmail.com"],
      subject: `✅ Nouveau paiement — ${body.amount} XAF (${serviceId})`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
          <h2 style="color:#B8860B;margin-bottom:16px">✅ Paiement reçu — Chreol Empire</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666">Montant</td><td style="font-weight:bold">${body.amount} XAF</td></tr>
            <tr><td style="padding:8px 0;color:#666">Opérateur</td><td>${operatorLabel}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Téléphone client</td><td>${clientPhone}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Service</td><td>${serviceId}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Produit</td><td>${productCode || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Référence Campay</td><td style="font-size:12px">${body.reference}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Référence opérateur</td><td style="font-size:12px">${body.operator_reference}</td></tr>
          </table>
          <p style="margin-top:24px;padding:12px;background:#fff3cd;border-radius:8px;font-size:14px">
            ⚠️ Penser à livrer le produit au client via WhatsApp : <strong>${clientPhone}</strong>
          </p>
        </div>
      `,
    }),
  });
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.CAMPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[campay-webhook] CAMPAY_WEBHOOK_SECRET not configured");
    return new Response(JSON.stringify({ error: "Misconfigured" }), { status: 500 });
  }

  let body: CampayWebhookBody;
  let rawBody: string;
  try {
    rawBody = await request.text();
    body = JSON.parse(rawBody) as CampayWebhookBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const isValid = await verifySignature(secret, rawBody, body.signature ?? "");
  if (!isValid) {
    console.warn("[campay-webhook] Signature invalide — référence:", body.reference);
    return new Response(JSON.stringify({ error: "Signature invalide" }), { status: 401 });
  }

  const { status, reference, external_reference, amount, operator } = body;
  console.log(`[campay-webhook] Reçu | ref=${reference} | status=${status} | amount=${amount} XAF | op=${operator}`);

  if (status !== "SUCCESS") {
    console.log(`[campay-webhook] Paiement non abouti — ref=${reference} status=${status}`);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  const [serviceId, clientPhone, productCode] = (external_reference ?? "").split("|");

  if (!serviceId || !clientPhone) {
    console.error("[campay-webhook] external_reference malformé:", external_reference);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  console.log(`[campay-webhook] SUCCESS — service=${serviceId} | phone=${clientPhone} | product=${productCode ?? "N/A"} | ${amount} XAF`);

  await Promise.allSettled([
    insertOrder(body, serviceId, clientPhone, productCode ?? ""),
    sendEmailNotification(body, serviceId, clientPhone, productCode ?? ""),
  ]);

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
