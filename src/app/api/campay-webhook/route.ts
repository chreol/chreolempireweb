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

async function fetchOrderForEmail(orderId: string): Promise<{ client_name?: string; client_email?: string; summary?: string } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !orderId) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=client_name,client_email,summary`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(4000) },
    );
    if (!res.ok) return null;
    const rows = await res.json() as Array<{ client_name?: string; client_email?: string; summary?: string }>;
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

const SERVICE_SOURCE: Record<string, string> = {
  cart:        "/cart",
  psn:         "/services/cartes-cadeaux",
  itunes:      "/services/cartes-cadeaux",
  robux:       "/services/cartes-cadeaux",
  roblox:      "/services/cartes-cadeaux",
  steam:       "/services/cartes-cadeaux",
  nintendo:    "/services/cartes-cadeaux",
  google:      "/services/cartes-cadeaux",
  razer:       "/services/cartes-cadeaux",
  crypto:      "/services/crypto",
  usdt:        "/services/crypto",
  btc:         "/services/crypto",
  paypal:      "/services/paypal",
  "paypal-sell": "/services/paypal",
  coupons:     "/services/coupons",
  pcs:         "/services/coupons",
  transcash:   "/services/coupons",
  uba:         "/services/uba",
  factures:    "/services/factures",
};

async function sendEmailNotification(body: CampayWebhookBody, serviceId: string, clientPhone: string, productCode: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shop.chreolempire.com";
  const operatorLabel = body.operator?.toLowerCase().includes("orange") ? "Orange Money" : "MTN MoMo";
  const total = parseInt(body.amount, 10);
  const orderId = serviceId === "cart" && productCode ? productCode : `${Date.now()}-${productCode}`;

  // Pour les commandes panier, récupérer les infos client depuis Supabase
  const orderDetails = serviceId === "cart" && productCode
    ? await fetchOrderForEmail(productCode)
    : null;

  const clientName  = orderDetails?.client_name  ?? `Client +237${clientPhone}`;
  const clientEmail = orderDetails?.client_email  ?? "";
  const summary     = orderDetails?.summary       ?? `${serviceId}${productCode ? ` — ${productCode}` : ""}`;

  const sourcePath = SERVICE_SOURCE[serviceId] ?? "/checkout";
  const payload = {
    orderId,
    clientName,
    clientEmail: clientEmail || "noreply@chreolempire.com",
    clientPhone,
    paymentMethod: operatorLabel,
    sourceUrl: `${siteUrl}${sourcePath}`,
    items: [{ name: summary, qty: 1, price: total, amount: `${total.toLocaleString("fr-FR")} FCFA` }],
    total,
    campayReference: body.reference,
  };

  const notifyRes = await fetch(`${siteUrl}/api/notify-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
  console.log(`[campay-webhook] notify-order → ${notifyRes.status} (client=${clientEmail || "none"})`);
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
