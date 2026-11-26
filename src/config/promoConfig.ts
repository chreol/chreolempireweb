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

export function cartUnitPrice(item: { price: number; productId?: string }): number {
  if (!item.productId) return item.price;
  return applyGiftPromo(item.productId, item.price);
}
