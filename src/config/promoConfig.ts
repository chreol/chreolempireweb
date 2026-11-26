import { GIFT_CARDS } from "@/lib/services";

/** Fin de la campagne affichée sur la bannière et sur /promo. */
export const PROMO_END_DATE = new Date("2026-12-31T23:59:59");

export function isPromoActive(now = Date.now()): boolean {
  return now < PROMO_END_DATE.getTime();
}

export interface GiftPromo {
  id: string;
  discountPercent: number;
  label: string;
}

/** Réductions cartes cadeaux. Les id correspondent à GIFT_CARDS. */
export const GIFT_PROMOS: GiftPromo[] = [
  { id: "psn", discountPercent: 5, label: "-5%" },
  { id: "itunes", discountPercent: 3, label: "-3%" },
  { id: "googleplay", discountPercent: 3, label: "-3%" },
];

export function giftPromoFor(productId: string): GiftPromo | undefined {
  if (!isPromoActive()) return undefined;
  return GIFT_PROMOS.find((promo) => promo.id === productId);
}

/** Prix catalogue si la campagne est finie, sinon prix réduit arrondi. */
export function applyGiftPromo(productId: string, basePrice: number): number {
  const promo = giftPromoFor(productId);
  if (!promo) return basePrice;
  return Math.round(basePrice * (1 - promo.discountPercent / 100));
}

export interface PricedCartItem {
  price: number;
  amount?: string;
  productId?: string;
  isPromo?: boolean;
}

/** Tarif catalogue d'une carte, indépendant du prix envoyé par le navigateur. */
export function catalogGiftPrice(productId?: string, amount?: string): number | null {
  if (!productId || !amount) return null;
  const card = GIFT_CARDS.find((item) => item.id === productId);
  if (!card) return null;
  const label = amount.trim();
  const lists = [card.amounts, "usAmounts" in card ? card.usAmounts : undefined];
  for (const list of lists) {
    const row = list?.find((entry) => entry.label === label);
    if (row) return row.price;
  }
  return null;
}

/**
 * Prix unitaire retenu par le serveur.
 * Promo : tarif catalogue réduit, seulement si la date de campagne est encore valide.
 * Sans promo : tarif catalogue si la carte est reconnue, sinon le prix déjà calculé côté service.
 */
export function authoritativeUnitPrice(item: {
  price?: number;
  amount?: string;
  productId?: string;
  isPromo?: boolean;
}): number {
  const posted = Math.round(Number(item.price) || 0);
  const catalog = catalogGiftPrice(item.productId, item.amount);
  if (!item.isPromo) return catalog ?? posted;
  const base = catalog ?? posted;
  if (!isPromoActive() || catalog == null || !item.productId) return base;
  return applyGiftPromo(item.productId, catalog);
}

/** Le panier n'applique la promo que si l'article a été ajouté avec isPromo. */
export function cartUnitPrice(item: PricedCartItem): number {
  if (!item.isPromo) return item.price;
  return authoritativeUnitPrice(item);
}
