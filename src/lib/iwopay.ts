// ── Iwopay fulfillment helpers ────────────────────────────────────────────────
// Utilisé par le webhook Iwopay (/api/iwopay-webhook) et la simulation (/api/iwopay-simulate).

export const IWOPAY_SUCCESS_STATUSES = ["100", "01"];

export function isIwopaySuccess(status?: string): boolean {
  return !!status && IWOPAY_SUCCESS_STATUSES.includes(status);
}

export interface IwopayFulfillParams {
  orderId: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  paymentMethod?: string;
  sourceUrl?: string;
  items?: Array<{ name: string; qty: number; price: number; amount: string }>;
  total?: number;
}

export async function fulfillIwopayOrder(p: IwopayFulfillParams): Promise<{ ok: boolean; reason?: string }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shop.chreolempire.com";

  // 1. Marquer la commande comme terminée (payout effectué / statut confirmé)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key && p.orderId) {
    const patch = {
      status: "done",
      payment_reference: p.orderId,
      payment_status: "auto",
      payment_auto: true,
      details: {
        service: "iwopay",
        sourceUrl: p.sourceUrl ?? null,
        iwopay_reference: p.orderId,
        items: p.items ?? [],
      },
    };
    const res = await fetch(`${url}/rest/v1/orders?id=eq.${encodeURIComponent(p.orderId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return { ok: false, reason: `supabase_patch_${res.status}` };
  }

  // 2. Notifier l'admin + le client (via /api/notify-order)
  const items = p.items && p.items.length > 0
    ? p.items
    : [{ name: "Commande Iwopay", qty: 1, price: p.total ?? 0, amount: `${(p.total ?? 0).toLocaleString("fr-FR")} FCFA` }];
  const notifyRes = await fetch(`${siteUrl}/api/notify-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: p.orderId,
      clientName: p.clientName ?? "Client",
      clientEmail: p.clientEmail || "noreply@chreolempire.com",
      clientPhone: p.clientPhone || "",
      paymentMethod: p.paymentMethod ?? "Iwopay",
      sourceUrl: p.sourceUrl ?? "/services/paypal",
      items,
      total: p.total ?? items.reduce((s, i) => s + i.price * i.qty, 0),
      campayReference: p.orderId,
    }),
    signal: AbortSignal.timeout(10000),
  });
  const notifyOk = notifyRes.ok;

  if (!notifyOk) return { ok: false, reason: "notify_order_failed" };
  return { ok: true };
}
