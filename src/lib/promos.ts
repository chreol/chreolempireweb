export interface Promo {
  id: string;
  emoji: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  originalPrice: number;
  promoPrice: number;
  currency: "FCFA" | "€";
  discountPct: number;
  service: string;
  product: string;
  expiresAt: string | null; // ISO date string, null = no timer (stock-based only)
  maxQty: number | null;    // null = unlimited
  remaining: number | null; // null = unknown
  whatsappPrefill: string;
}

// ── Modifiez ces offres librement — c'est la seule source de vérité ──────────
export const PROMOS: Promo[] = [
  {
    id: "psn-20-house-tariff",
    emoji: "🔥",
    badge: "HOT DEAL",
    badgeColor: "#F59E0B",
    title: "Carte PSN 20€ Europe — geste de la maison",
    description: "Nouveau tarif : profitez de la carte PSN 20€ à 15 800 FCFA au lieu de 16 800 FCFA. Livraison WhatsApp 15-30 min.",
    originalPrice: 16800,
    promoPrice: 15800,
    currency: "FCFA",
    discountPct: 6,
    service: "cartes-cadeaux",
    product: "psn",
    expiresAt: "2026-09-30T23:59:00",
    maxQty: 3,
    remaining: 3,
    whatsappPrefill: "Bonjour, je souhaite profiter du HOT DEAL PSN 20€ Europe à 15 800 FCFA, geste de la maison. Pouvez-vous confirmer la disponibilité ?",
  },
  {
    id: "psn-20-promo",
    emoji: "🎮",
    badge: "⚡ Flash",
    badgeColor: "#F59E0B",
    title: "Carte PSN 20€ Europe",
    description: "Rechargez votre wallet PlayStation au meilleur prix. Code livré en 15 min via WhatsApp.",
    originalPrice: 15000,
    promoPrice: 13500,
    currency: "FCFA",
    discountPct: 10,
    service: "cartes-cadeaux",
    product: "psn",
    expiresAt: "2026-06-20T23:59:00",
    maxQty: 20,
    remaining: 7,
    whatsappPrefill: "Bonjour, je voudrais profiter de l'offre flash PSN 20€ à 13 500 FCFA. Pouvez-vous me confirmer la disponibilité ?",
  },
  {
    id: "usdt-bonus-rate",
    emoji: "₿",
    badge: "🔥 Taux bonus",
    badgeColor: "#EF4444",
    title: "USDT → FCFA taux spécial",
    description: "Cette semaine seulement : nous achetons votre USDT (TRC20) à 600 FCFA/$. Taux habituel : 580 FCFA/$.",
    originalPrice: 580,
    promoPrice: 600,
    currency: "FCFA",
    discountPct: 0,
    service: "crypto",
    product: "usdt",
    expiresAt: "2026-06-18T23:59:00",
    maxQty: null,
    remaining: null,
    whatsappPrefill: "Bonjour, je veux profiter du taux spécial USDT 600 FCFA/$ cette semaine. J'ai [montant] USDT à vendre.",
  },
  {
    id: "robux-bundle",
    emoji: "🟦",
    badge: "🎁 Exclusif",
    badgeColor: "#8B5CF6",
    title: "Robux 10€ — Offre groupée",
    description: "Achetez 2 cartes Robux 10€ et obtenez la 3ème à -50%. Idéal pour offrir ou stocker du crédit Roblox.",
    originalPrice: 22500,
    promoPrice: 18750,
    currency: "FCFA",
    discountPct: 17,
    service: "cartes-cadeaux",
    product: "robux",
    expiresAt: null,
    maxQty: 15,
    remaining: 12,
    whatsappPrefill: "Bonjour, je veux profiter de l'offre groupée Robux 3×10€ à 18 750 FCFA. Pouvez-vous confirmer la disponibilité ?",
  },
  {
    id: "paypal-sell-bonus",
    emoji: "💸",
    badge: "🌟 Limité",
    badgeColor: "#0EA5E9",
    title: "Vente PayPal : 590 FCFA/€",
    description: "Vendez votre solde PayPal Europe à 590 FCFA par euro (taux habituel : 580 FCFA/€). Minimum 20€.",
    originalPrice: 580,
    promoPrice: 590,
    currency: "FCFA",
    discountPct: 0,
    service: "paypal",
    product: "paypal-sell",
    expiresAt: "2026-06-22T23:59:00",
    maxQty: null,
    remaining: null,
    whatsappPrefill: "Bonjour, je veux profiter du taux spécial PayPal → FCFA à 590 FCFA/€. J'ai [montant]€ à vendre.",
  },
];
