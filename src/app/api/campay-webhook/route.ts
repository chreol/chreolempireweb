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

  console.log(`[campay-webhook] Paiement reçu | ref=${reference} | status=${status} | amount=${amount} XAF | op=${operator}`);

  if (status !== "SUCCESS") {
    console.log(`[campay-webhook] Paiement non abouti — ref=${reference} status=${status}`);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  // external_reference format: "serviceId|clientPhone|productCode"
  const [serviceId, clientPhone, productCode] = (external_reference ?? "").split("|");

  if (!serviceId || !clientPhone) {
    console.error("[campay-webhook] external_reference malformé:", external_reference);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  console.log(
    `[campay-webhook] SUCCESS — service=${serviceId} | phone=${clientPhone} | product=${productCode ?? "N/A"} | ${amount} XAF`,
  );

  // TODO: déclencher la livraison automatique selon serviceId
  // Exemples futurs :
  //   if (serviceId === "cartes-cadeaux") await sendGiftCardByWhatsApp(clientPhone, productCode);
  //   if (serviceId === "crypto")         await recordCryptoOrder(clientPhone, productCode, amount);

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
