// ── Iwopay fulfillment helpers ────────────────────────────────────────────────
// Utilisé par le webhook Iwopay (/api/iwopay-webhook) et la simulation (/api/iwopay-simulate).

/** 01 = opération réussie. 1000 = en attente de validation. 100 = échec (doc Iwomi 1.3). */
export const IWOPAY_SUCCESS_STATUSES = ["01"];

export function isIwopaySuccess(status?: string): boolean {
  return !!status && IWOPAY_SUCCESS_STATUSES.includes(status);
}

export type IwopayCustomerState = "pending" | "paid" | "refused" | "cancelled" | "unknown";

/** Libellé montré au client. 01 validé, 1000 en attente, 100 / 409 refusé. */
export function mapIwopayCustomerState(status: string, message?: string): {
  state: IwopayCustomerState;
  label: string;
  detail: string;
} {
  const msg = (message ?? "").toLowerCase();
  if (status === "01") {
    return {
      state: "paid",
      label: "Validé",
      detail: "Le débit est confirmé. La commande est traitée sous 15 à 30 minutes.",
    };
  }
  if (status === "1000") {
    return {
      state: "pending",
      label: "En attente",
      detail: "Validez la demande sur votre téléphone avec votre code secret.",
    };
  }
  if (/annul|cancel/.test(msg)) {
    return {
      state: "cancelled",
      label: "Annulé",
      detail: "Le débit a été annulé. Vous pouvez relancer le paiement.",
    };
  }
  if (status === "409") {
    return { state: "refused", label: "Refusé", detail: "Solde insuffisant sur ce numéro." };
  }
  if (status === "100") {
    return { state: "refused", label: "Refusé", detail: "Iwopay a refusé le débit." };
  }
  if (status === "404") {
    return { state: "unknown", label: "Introuvable", detail: "Cette référence est inconnue chez Iwopay." };
  }
  return { state: "unknown", label: "Indisponible", detail: "Le statut n'a pas pu être lu. Réessayez." };
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
    headers: {
      "Content-Type": "application/json",
      ...(process.env.INTERNAL_API_SECRET ? { "x-internal-secret": process.env.INTERNAL_API_SECRET } : {}),
    },
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
