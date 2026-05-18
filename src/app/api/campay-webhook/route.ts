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

function stripSignature(rawBody: string, signature: string): string {
  // Campay signe le body JSON sans le champ "signature"
  const escaped = signature.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return rawBody
    .replace(new RegExp(`,\\s*"signature"\\s*:\\s*"${escaped}"\\s*`), "")
    .replace(new RegExp(`"signature"\\s*:\\s*"${escaped}"\\s*,\\s*`), "")
    .replace(new RegExp(`"signature"\\s*:\\s*"${escaped}"`), "");
}

async function verifySignature(secret: string, rawBody: string, signature: string): Promise<boolean> {
  if (!signature) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  // Essai 1 : body sans le champ signature (schéma standard Campay)
  const bodyWithoutSig = stripSignature(rawBody, signature);
  const sigBytes = hexToBytes(signature);

  const ok1 = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(bodyWithoutSig));
  if (ok1) return true;

  // Essai 2 : body complet (certaines versions Campay)
  const ok2 = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(rawBody));
  return ok2;
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

async function upsertOrder(body: CampayWebhookBody, serviceId: string, clientPhone: string, productCode: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;

  const operatorLabel = body.operator?.toLowerCase().includes("orange") ? "Orange Money" : "MTN MoMo";
  const patch = {
    status: "done",
    payment_reference: body.reference,
    payment_status: "auto",
    payment_auto: true,
    details: {
      serviceId,
      clientPhone,
      productCode: productCode || null,
      operator_reference: body.operator_reference,
      campay_reference: body.reference,
    },
  };

  // Si vient du panier : productCode = orderId existant → UPDATE
  if (serviceId === "cart" && productCode) {
    const res = await fetch(`${url}/rest/v1/orders?id=eq.${encodeURIComponent(productCode)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify(patch),
    });
    console.log(`[campay-webhook] Supabase PATCH (cart) → ${res.status}`);
    return;
  }

  // Sinon (checkout direct) : INSERT nouvel ordre
  const id = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const res = await fetch(`${url}/rest/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}`, Prefer: "return=minimal" },
    body: JSON.stringify({
      id,
      type: "achat",
      summary: `${serviceId} — ${body.amount} XAF via ${operatorLabel} (${clientPhone})${productCode ? ` — ${productCode}` : ""}`,
      total: parseInt(body.amount, 10),
      payment_method: operatorLabel,
      item_count: 1,
      client_name: clientPhone,
      client_city: "Douala",
      ...patch,
    }),
  });
  console.log(`[campay-webhook] Supabase INSERT → ${res.status}`);
}

async function sendEmailNotification(body: CampayWebhookBody, serviceId: string, clientPhone: string, productCode: string) {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) return;

  const operatorLabel = body.operator?.toLowerCase().includes("orange") ? "Orange Money" : "MTN MoMo";
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "chreolempire00@gmail.com";

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": brevoKey },
    body: JSON.stringify({
      sender: { id: parseInt(process.env.BREVO_SENDER_ID ?? "1", 10) },
      to: [{ email: "chreolempire00@gmail.com" }],
      subject: `✅ Nouveau paiement — ${body.amount} XAF (${serviceId})`,
      htmlContent: `
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
            ⚠️ Livrer le produit au client via WhatsApp : <strong>${clientPhone}</strong>
          </p>
        </div>
      `,
    }),
  });
  console.log(`[campay-webhook] Brevo email → ${res.status}`);
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.CAMPAY_WEBHOOK_SECRET;

  let body: CampayWebhookBody;
  let rawBody: string;
  try {
    rawBody = await request.text();
    body = JSON.parse(rawBody) as CampayWebhookBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  // Log complet pour debug (headers + body brut)
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => { headers[k] = v; });
  console.log("[campay-webhook] HEADERS:", JSON.stringify(headers));
  console.log("[campay-webhook] RAW BODY:", rawBody);

  // Vérification signature
  if (secret) {
    const isValid = await verifySignature(secret, rawBody, body.signature ?? "");
    if (!isValid) {
      // En mode debug : on log l'échec mais on ne rejette pas
      if (process.env.CAMPAY_STRICT_SIG === "true") {
        console.error("[campay-webhook] Signature invalide — REJET");
        return new Response(JSON.stringify({ error: "Signature invalide" }), { status: 401 });
      }
      console.warn("[campay-webhook] Signature invalide — mode debug, on continue");
    } else {
      console.log("[campay-webhook] Signature OK");
    }
  }

  const { status, reference, external_reference, amount, operator } = body;
  console.log(`[campay-webhook] status=${status} | ref=${reference} | amount=${amount} XAF | op=${operator}`);

  if (status !== "SUCCESS") {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  const [serviceId, clientPhone, productCode] = (external_reference ?? "").split("|");

  if (!serviceId || !clientPhone) {
    console.error("[campay-webhook] external_reference malformé:", external_reference);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  console.log(`[campay-webhook] SUCCESS → service=${serviceId} | phone=${clientPhone} | product=${productCode ?? "N/A"}`);

  await Promise.allSettled([
    upsertOrder(body, serviceId, clientPhone, productCode ?? ""),
    sendEmailNotification(body, serviceId, clientPhone, productCode ?? ""),
  ]);

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
