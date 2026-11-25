/** Identité légale de CHREOL EMPIRE SARL, maison mère du shop. */
export const COMPANY = {
  name: "CHREOL EMPIRE SARL",
  headquarters: "Ékié / Dernier Poteau, Yaoundé – Cameroun",
  rccm: "CM-NSI-02-2026-B12-0898",
  niu: "M092618984598Y",
  phone: "+237 683 682 958",
  whatsapp: "+237 697 657 734",
  email: "contact@chreolempire.com",
  website: "www.chreolempire.com",
} as const;

/**
 * Facture autorisée seulement si la commande est livrée ou payée.
 * Dans ce shop, « livrée » est le statut `done` (admin / e-mail « Livré »).
 * « payée » est `payment_status` auto, ou les libellés PAID / DELIVERED.
 */
export function canDownloadInvoice(status: string | null | undefined, paymentStatus: string | null | undefined): boolean {
  const s = (status ?? "").trim().toLowerCase();
  const p = (paymentStatus ?? "").trim().toLowerCase();
  const delivered = s === "done" || s === "delivered" || s === "livree" || s === "livrée";
  const paid = p === "paid" || p === "payee" || p === "payée" || p === "auto" || s === "paid";
  return delivered || paid;
}
