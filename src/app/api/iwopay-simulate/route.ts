export const runtime = "edge";

import { fulfillIwopayOrder } from "@/lib/iwopay";

interface IwopaySimulateBody {
  orderId: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  paymentMethod?: string;
  sourceUrl?: string;
  items?: Array<{ name: string; qty: number; price: number; amount: string }>;
  total?: number;
}

// Simulation (dev / tests) : déclenche le payout Iwopay pour une commande donnée
// comme si le statut de la transaction était "100" / "01" (paiement confirmé).
export async function POST(request: Request): Promise<Response> {
  let body: IwopaySimulateBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), { status: 400 });
  }

  if (!body?.orderId) {
    return new Response(JSON.stringify({ ok: false, error: "orderId requis" }), { status: 400 });
  }

  const result = await fulfillIwopayOrder({
    orderId: body.orderId,
    clientName: body.clientName,
    clientEmail: body.clientEmail,
    clientPhone: body.clientPhone,
    paymentMethod: body.paymentMethod ?? "Iwopay",
    sourceUrl: body.sourceUrl,
    items: body.items,
    total: body.total,
  });

  return Response.json({ ok: result.ok, reason: result.reason ?? "none" }, { status: result.ok ? 200 : 500 });
}
