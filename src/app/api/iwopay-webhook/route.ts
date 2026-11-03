export const runtime = "edge";

import { isIwopaySuccess, fulfillIwopayOrder } from "@/lib/iwopay";

interface IwopayWebhookBody {
  transactionId?: string;
  status?: string;
  amount?: string;
  currency?: string;
  /** Référence de transaction / référence de commande générée par le merchant */
  merchantReference?: string;
  /** IDs internes de commande Chreol Empire */
  orderId?: string;
  externalOderID?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  paymentMethod?: string;
  sourceUrl?: string;
  items?: Array<{ name: string; qty: number; price: number; amount: string }>;
  total?: number;
}

/** Idempotence : mémorise les références transaction traitées (best-effort, instance mémoire) */
const processedRefs = new Set<string>();

export async function POST(request: Request): Promise<Response> {
  // 0. Secret partagé optionnel : si IWOPAY_WEBHOOK_SECRET est défini, Iwopay
  //    doit fournir ?key=<secret> (URL du callback) ou le header x-iwopay-secret.
  const expected = process.env.IWOPAY_WEBHOOK_SECRET?.trim();
  if (expected) {
    const provided = request.headers.get("x-iwopay-secret")
      ?? new URL(request.url).searchParams.get("key")
      ?? "";
    if (provided !== expected) {
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    }
  }

  // 1. Récupérer le corps de la requête (JSON envoyé par Iwopay)
  let body: IwopayWebhookBody;
  try {
    body = await request.json();
  } catch {
    // Body invalide → on accepte quand même la connexion (webhook déjà accusé)
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  console.log(
    `✅ Webhook Iwopay reçu | status=${body.status} | transaction=${body.transactionId ?? "none"} | order=${body.orderId ?? body.merchantReference ?? body.externalOderID ?? "none"}`
  );

  // 2. VÉRIFICATION DE SÉCURITÉ (Signature)
  // Consultez la documentation Iwopay pour savoir comment vérifier la signature.
  // Souvent, il faut comparer un hash envoyé dans les headers (ex: 'x-iwopay-signature')
  // avec un hash calculé à partir du corps de la requête et de votre clé secrète.
  // Si la signature est invalide, rejetez la requête.
  // const signature = request.headers.get("x-iwopay-signature");
  // ...

  // 3. Extraire les informations clés de la notification
  const status = body.status;
  const orderId = body.orderId || body.merchantReference || body.externalOderID;
  const transactionRef = body.transactionId || body.externalOderID || orderId;

  // 4. Idempotence : ignorer les doublons (même transaction reçue 2x)
  if (transactionRef) {
    if (processedRefs.has(transactionRef)) {
      console.log(`[iwopay-webhook] Doublon ignoré — transaction=${transactionRef}`);
      return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
    }
    processedRefs.add(transactionRef);
  }

  if (!orderId) {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  // 5. Si le paiement n'est pas abouti → on ignore (mais on répond 200 pour ne pas relancer)
  if (!isIwopaySuccess(status)) {
    console.log(`[iwopay-webhook] Paiement non abouti — order=${orderId} status=${status}`);
    return new Response(JSON.stringify({ received: true, message: "Statut non payé, ignoré" }), { status: 200 });
  }

  // 6. Mise à jour de la commande + déclenchement notifications (payout / fulfillment)
  const result = await fulfillIwopayOrder({
    orderId,
    clientName: body.clientName,
    clientEmail: body.clientEmail,
    clientPhone: body.clientPhone,
    paymentMethod: body.paymentMethod ?? "Iwopay",
    sourceUrl: body.sourceUrl,
    items: body.items,
    total: body.total,
  });

  console.log(`[iwopay-webhook] payout triggered → order=${orderId} ok=${result.ok} reason=${result.reason ?? "none"}`);

  // 7. Répondre à Iwopay pour accuser réception (OBLIGATOIRE)
  // La plupart des passerelles attendent un code 200 pour ne pas renvoyer la notification.
  return new Response(JSON.stringify({ received: true, success: result.ok }), { status: 200 });
}

export async function GET(): Promise<Response> {
  return Response.json({ ok: true });
}
