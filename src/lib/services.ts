export const CONTACT = {
  whatsapp: "+237697657734",
  whatsappDisplay: "+237 697 657 734",
  tel: "+237694360978",
  email: "contact@chreolempire.com",
  address: "Siège : Ékié / Dernier Poteau, Yaoundé – Cameroun · Annexe : Vallée 3, Boutiques Deido, Douala – Cameroun",
  paypalEmail: "LARAMBAMBO@GMAIL.COM",
};

export const SOCIAL_LINKS = {
  facebook:      "https://www.facebook.com/chreolempire",
  facebookGroup: "https://www.facebook.com/groups/chreolempire",
  telegram:      "https://t.me/chreolempire",
  instagram:     "https://www.instagram.com/chreolempire",
  googleBusiness:"https://maps.app.goo.gl/y6ZUqprA579ykBc46",
  googleReview:  "https://g.page/r/CQaaC7b5Jbg_EAE/review",
  businesslist:  "https://www.businesslist.co.cm/company/138059/chreol-empire-services-digitaux",
  trustpilot:    "https://trustpilot.com/review/monelecam.fr",
  mapsSiege:     "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Ékié / Dernier Poteau, Yaoundé, Cameroun"),
  mapsAnnexe:     "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Vallée 3, Boutiques Deido, Douala, Cameroun"),
};

export const IMAGES = {
  logo:       "/assets/Logo_Chreol_Empire_revue-removebg-preview.png",
  whatsapp:   "/assets/whatsapp.webp",
  telegram:   "/assets/telegram.webp",
  instagram:  "/assets/instagram.webp",
  xTwitter:   "/assets/x-twitter.webp",
  email:      "/assets/email.webp",
  psn:     "/assets/PlayStation_Store_Card.webp",
  itunes:  "/assets/itunes-gifts-for-business-hero_2x.webp",
  roblox:  "/assets/App-icon-roblox.webp",
  robux:   "/assets/App-icon-roblox.webp",
  steam:   "/assets/Steam_Gift_Cards.webp",
  razer:   "/assets/Gift_cards-Razer_Gold.webp",
  nintendo:"/assets/Gift card Nintendo.webp",
  google:  "/assets/Gift card GooglePlay.webp",
  uba:     "/assets/UBA Cameroun logo.png",
  ubaCard: "/assets/Carte UBA Cameroun pour RECHARGE.webp",
  paypal:  "/assets/Paypal.webp",
  paypal2: "/assets/Achat_VentePaypal.webp",
  crypto:  "/assets/Cryptomonnaies-visuel.webp",
  cryptoMomo: "/assets/Monnaie Crypto Chreol Empire en cfa mobile money.webp",
  coupons: "/assets/contenu-pack-transcash.webp",
  pcs:     "/assets/PCS-Mastercard.webp",
  transcash:"/assets/echange-transcash.webp",
  factures:"/assets/paiement-+-facture-services.webp",
  transfer: "/assets/Chreol Empire Transfert.png",
  mtn:     "/assets/MTN Mobile Money (MoMo) Payment .webp",
  orange:  "/assets/orange-money.webp",
  expressUnion: "/assets/Express Union logo.webp",
  yoomee: "/assets/Yoomee Money logo.webp",
  canal:   "/assets/Canal-Plus logo.webp",
  eneo:    "/assets/Eneo logo.webp",
  camwater:"/assets/Camwater logo.webp",
  startimes:"/assets/StarTimes logo.webp",
  boutique:   "/assets/boutique.webp",
  banner:     "/assets/banner-chreol-empire-cameroun.webp.webp",
  googleAvis: "/assets/google-avis-client-grande.webp",
  orangeQR:   "/assets/orange-money-qr-code.png",
  orangeQRFull: "/assets/orange-money-qr-chreol-empire.jpeg",
};

// ── Compte marchand Orange Money (QR + code marchand) ─────────────────────────
// Source : affiche officielle « Orange Money — Scan & pay via Max it ».
// QR 0015757444 · code marchand 1052061 · nom CHREOL EMPIRE · USSD #150*47#
export const ORANGE_MONEY_COMMERCE = {
  merchantCode: "1052061",
  merchantName: "CHREOL EMPIRE",
  qrCode:       "0015757444",
  ussd:         "#150*47#",
  /** QR code recadré, lisible sur mobile et dans les emails */
  image:        "/assets/orange-money-qr-code.png",
  /** Photo complète de l'affiche fournie par le marchand (conservée dans le projet) */
  poster:       "/assets/orange-money-qr-chreol-empire.jpeg",
  /** Même affiche, sous le nom du fichier d'origine : public/assets/Orange Chreol Empire.jpeg */
  posterFile:   "Orange Chreol Empire.jpeg",
  /** Commission de l'opérateur sur les encaissements marchands (1 %). */
  feeRate:      0.01,
} as const;

/** Commission Orange Money arrondie en FCFA (0 si l'opérateur n'est pas Orange). */
export function orangeMoneyFee(amount: number, operatorId: string): number {
  if (operatorId !== "orange" || !Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount * ORANGE_MONEY_COMMERCE.feeRate);
}

// ── Dépôt MTN Mobile Money (numéro personnel, frais de retrait opérateur) ────
export const MTN_MONEY = {
  phone:        "+237683682958",
  phoneDisplay: "+237 683 682 958",
  accountName:  "Vernatus Mesue Etube",
  /** Frais de retrait prélevés par MTN Cameroun, ajoutés au dépôt. */
  feeRate:      0.015,
} as const;

/** Frais ajoutés au montant quand le client dépose (Orange 1 %, MTN 1,5 %). */
export function collectionFee(amount: number, operatorId: string): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (operatorId === "orange") return Math.round(amount * ORANGE_MONEY_COMMERCE.feeRate);
  if (operatorId === "mtn") return Math.round(amount * MTN_MONEY.feeRate);
  return 0;
}

export function collectionFeeLabel(operatorId: string): string {
  if (operatorId === "orange") return "Frais Orange Money (1 %)";
  if (operatorId === "mtn") return "Frais de retrait MTN (1,5 %)";
  return "Frais opérateur";
}

// Gift card prices: EUR and USD use the same FCFA tariff.
const STANDARD_AMOUNTS = [
  { label: "10€",  price: 8500, previousPrice: 8900 },
  { label: "15€",  price: 12800, previousPrice: 12900 },
  { label: "20€",  price: 15800, previousPrice: 16800 },
  { label: "25€",  price: 18500, previousPrice: 20500 },
  { label: "30€",  price: 24000, previousPrice: 24500 },
  { label: "40€",  price: 31400, previousPrice: 32000 },
  { label: "50€",  price: 35800, previousPrice: 39500 },
  { label: "75€",  price: 54000, previousPrice: 58500 },
  { label: "80€",  price: 59800, previousPrice: 61500 },
  { label: "100€", price: 72500, previousPrice: 76500 },
  { label: "150€", price: 103800, previousPrice: 102000 },
  { label: "200€", price: 136000, previousPrice: 135000 },
  { label: "300€", price: 205000, previousPrice: 204000 },
  { label: "500€", price: 340000, previousPrice: 340000 },
];

const ITUNES_GP_AMOUNTS = STANDARD_AMOUNTS;

export const USD_STANDARD_AMOUNTS = STANDARD_AMOUNTS.map(amount => ({
  label: amount.label.replace("€", "$") ,
  price: amount.price,
  previousPrice: amount.previousPrice,
}));

export const GIFT_CARDS = [
  { id: "psn",        name: "PSN PlayStation",   image: IMAGES.psn,      color: "#003791", tier: "standard" as const, amounts: STANDARD_AMOUNTS, usAmounts: USD_STANDARD_AMOUNTS },
  { id: "steam",      name: "Steam",             image: IMAGES.steam,    color: "#1B2838", tier: "standard" as const, amounts: STANDARD_AMOUNTS, usAmounts: USD_STANDARD_AMOUNTS },
  { id: "razer",      name: "Razer Gold",        image: IMAGES.razer,    color: "#44D62C", tier: "standard" as const, amounts: STANDARD_AMOUNTS, usAmounts: USD_STANDARD_AMOUNTS },
  { id: "roblox-eur", name: "Roblox — Carte cadeau", image: IMAGES.roblox, color: "#E8232A", tier: "robux" as const, amounts: STANDARD_AMOUNTS },
  { id: "nintendo",   name: "Nintendo eShop",    image: IMAGES.nintendo, color: "#E70012", tier: "standard" as const, amounts: STANDARD_AMOUNTS, usAmounts: USD_STANDARD_AMOUNTS },
  { id: "itunes",     name: "iTunes / App Store",image: IMAGES.itunes,   color: "#0A84FF", tier: "itunes" as const,   amounts: ITUNES_GP_AMOUNTS },
  { id: "googleplay", name: "Google Play",       image: IMAGES.google,   color: "#34A853", tier: "itunes" as const,   amounts: ITUNES_GP_AMOUNTS, usAmounts: USD_STANDARD_AMOUNTS },
  {
    id: "robux", name: "Robux", image: IMAGES.robux, color: "#E8232A", tier: "robux" as const,
    amounts: [
      { label: "100 Robux",   price: 2500 },
      { label: "200 Robux",   price: 3500 },
      { label: "400 Robux",   price: 5500 },
      { label: "800 Robux",   price: 10500 },
      { label: "1000 Robux",  price: 12500 },
      { label: "2000 Robux",  price: 23000 },
      { label: "4000 Robux",  price: 45500 },
      { label: "10000 Robux", price: 108750 },
    ],
  },
];

export const UBA_CARDS = [
  { segment: "I",   price: 10500, limit: "2 500 000 FCFA/mois", features: ["Utilisation standard","Validité 2-3 ans","Paiements en ligne"] },
  { segment: "II",  price: 17500, limit: "4 500 000 FCFA/mois", features: ["Assurance achats","Activation express","Support prioritaire"], popular: true },
  { segment: "III", price: 25000, limit: "10 000 000 FCFA/mois",features: ["Tier Business","Support VIP 24/7","Limite maximale"] },
];

export const UBA_RECHARGE_FEES = [
  { min: 1500,   max: 5000,   fee: 1000, type: "fixed" as const },
  { min: 5001,   max: 40000,  fee: 2000, type: "fixed" as const },
  { min: 40001,  max: 100000, fee: 5,    type: "percent" as const },
  { min: 100001, max: 300000, fee: 4,    type: "percent" as const },
  { min: 300001, max: 500000, fee: 3.5,  type: "percent" as const },
];

export const CRYPTO_RATES = [
  { id: "usdt", name: "USDT", fullName: "Tether",         icon: "₮",  color: "#26A17B", buyRate: 580,       sellRate: 700,       unit: "USD" },
  { id: "usdc", name: "USDC", fullName: "USD Coin",       icon: "◎",  color: "#2775CA", buyRate: 580,       sellRate: 700,       unit: "USD" },
  { id: "btc",  name: "BTC",  fullName: "Bitcoin",        icon: "₿",  color: "#F7931A", buyRate: 58000000,  sellRate: 70000000,  unit: "BTC" },
  { id: "trx",  name: "TRX",  fullName: "Tron",           icon: "◈",  color: "#EB0029", buyRate: 151,       sellRate: 182,       unit: "TRX" },
  { id: "sol",  name: "SOL",  fullName: "Solana",         icon: "◎",  color: "#9945FF", buyRate: 99000,     sellRate: 120000,    unit: "SOL" },
  { id: "ltc",  name: "LTC",  fullName: "Litecoin",       icon: "Ł",  color: "#A6A9AA", buyRate: 62000,     sellRate: 75000,     unit: "LTC" },
  { id: "eth",  name: "ETH",  fullName: "Ethereum",       icon: "Ξ",  color: "#627EEA", buyRate: 2900000,   sellRate: 3500000,   unit: "ETH" },
  { id: "ada",  name: "ADA",  fullName: "Cardano",        icon: "₳",  color: "#0033AD", buyRate: 330,       sellRate: 400,       unit: "ADA" },
  { id: "bnb",  name: "BNB",  fullName: "BNB Chain",      icon: "◈",  color: "#F3BA2F", buyRate: 435000,    sellRate: 525000,    unit: "BNB" },
];

export const CRYPTO_NETWORKS: Record<string, string[]> = {
  usdt: ["BEP20","TRC20", "ERC20", "SPL", "Arbitrum"],
  usdc: ["ERC20", "BEP20", "SPL"],
  btc:  ["Bitcoin"],
  trx:  ["TRC20"],
  sol:  ["SPL"],
  ltc:  ["Litecoin"],
  eth:  ["ERC20", "Arbitrum"],
  ada:  ["Cardano"],
  bnb:  ["BEP20"],
};

export const CRYPTO_WALLETS: Record<string, Record<string, string>> = {
  usdt: {
    TRC20:    "TMiSeBpQQ7AeKzN34wvzC5uybXHFvcyfo6",
    BEP20:    "0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85",
    ERC20:    "0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85",
    SPL:      "Egme6fgZ1rQHcNfpDaNNsGh3LBe2aoou4FtuS8MCd71d",
    Arbitrum: "0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85",
    Aptos:    "0xb30a843b80c8B6Eda7Df0d80b0829263256fE85c8b370be02c977ae30eac1",
    Celo:     "0x640a90a213560756ea03a1cae5741b0b47495caa",
    Polkadot: "14ipdSddWWmkN4pJdk56WFM6BT1Y1zmfiXvDVyxGqPnsKHXk",
  },
  usdc: {
    ERC20:    "0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85",
    BEP20:    "0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85",
    SPL:      "Egme6fgZ1rQHcNfpDaNNsGh3LBe2aoou4FtuS8MCd71d",
  },
  btc: {
    Bitcoin:  "bc1q7qzvsrlyn96x6mwfs48hzqrcxfpsqusacj356k",
  },
  trx: {
    TRC20:    "TMiSeBpQQ7AeKzN34wvzC5uybXHFvcyfo6",
  },
  sol: {
    SPL:      "Egme6fgZ1rQHcNfpDaNNsGh3LBe2aoou4FtuS8MCd71d",
  },
  ltc: {
    Litecoin: "ltc1q2tlsexsslwwswkh6yk2nsuy4eu8ancwn9x9lgh",
  },
  eth: {
    ERC20:    "0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85",
    Arbitrum: "0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85",
  },
  ada: {
    Cardano:  "addr1q9mxu5zlhu3mlymfk84zxujj9arrn38gcx67nxnfm5dv43kdr5xh7gfcp3ehfjm9zjs4gwjjm9n5ln3cg0fn0v4gwm0s7uch3z",
  },
  bnb: {
    BEP20:    "0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85",
  },
};

export const COUPON_RATES = {
  pcs:       { rate: 450, commission: 7,  formula: "(montant − 7%) × 450", codeLength: 10, codeType: "alphanumérique" as const },
  transcash: { rate: 450, commission: 0,  formula: "montant × 450",         codeLength: 12, codeType: "numérique" as const },
};

export const PAYPAL_RATES = {
  sellRate: 520,
  buyRate:  700,
};

export const PAYPAL_LIMITS = {
  sell: { min: 5,    max: 500,    currency: "€",    label: "Vente (retrait)" },
  buy:  { min: 3500,  max: 500000, currency: "FCFA", label: "Achat (recharge)" },
};

/** Euros à envoyer ou à recevoir pour un montant FCFA.
 *  in  = le client paie la boutique (on achète son PayPal à sellRate).
 *  out = la boutique paie le client (on vend du PayPal à buyRate).
 */
export function fcfaToPaypalEur(fcfa: number, direction: "in" | "out"): number {
  const rate = direction === "in" ? PAYPAL_RATES.sellRate : PAYPAL_RATES.buyRate;
  if (!rate || !Number.isFinite(fcfa) || fcfa <= 0) return 0;
  return Math.round((fcfa / rate) * 100) / 100;
}

/** Montant à payer en crypto, toujours en USD. 1 USD = taux d'achat USDT. */
export function cryptoPayUsdRate(): number {
  return CRYPTO_RATES.find(c => c.id === "usdt")?.buyRate ?? 580;
}

export function fcfaToPayUsd(fcfa: number): number {
  const rate = cryptoPayUsdRate();
  if (!rate || !Number.isFinite(fcfa) || fcfa <= 0) return 0;
  return Math.round((fcfa / rate) * 100) / 100;
}

/** Tarif à régler selon le moyen choisi. Le prix catalogue reste en FCFA. */
export function paymentQuote(fcfa: number, methodId: string | null): { amount: string; note: string } {
  if (!Number.isFinite(fcfa) || fcfa <= 0) return { amount: "—", note: "" };
  if (methodId === "orange") {
    const due = fcfa + collectionFee(fcfa, "orange");
    return { amount: `${due.toLocaleString("fr-FR")} FCFA`, note: "Dont commission Orange Money 1 %" };
  }
  if (methodId === "mtn") {
    const due = fcfa + collectionFee(fcfa, "mtn");
    return { amount: `${due.toLocaleString("fr-FR")} FCFA`, note: "Dont frais de retrait MTN 1,5 %" };
  }
  if (methodId === "paypal") {
    return {
      amount: `${fcfaToPaypalEur(fcfa, "in").toFixed(2)} €`,
      note: `Proches et Familles · 1 € = ${PAYPAL_RATES.sellRate.toLocaleString("fr-FR")} FCFA`,
    };
  }
  if (methodId === "crypto") {
    return {
      amount: `${fcfaToPayUsd(fcfa).toFixed(2)} USD`,
      note: `Même montant pour chaque crypto · 1 USD = ${cryptoPayUsdRate().toLocaleString("fr-FR")} FCFA`,
    };
  }
  if (methodId === "iwopay") {
    return { amount: `${fcfa.toLocaleString("fr-FR")} FCFA`, note: "Iwopay · Orange Money et MTN MoMo Cameroun, sans commission boutique" };
  }
  if (methodId === "gimac") {
    return { amount: `${fcfa.toLocaleString("fr-FR")} FCFA`, note: "GIMAC · sans commission boutique" };
  }
  return { amount: `${fcfa.toLocaleString("fr-FR")} FCFA`, note: "Choisissez un moyen pour voir le montant à régler" };
}

/** Unités crypto quand la boutique verse un actif. Le paiement client, lui, reste en USD. */
export function fcfaToCryptoUnits(fcfa: number, cryptoId: string, direction: "in" | "out"): number {
  const row = CRYPTO_RATES.find(c => c.id === cryptoId);
  if (!row || !Number.isFinite(fcfa) || fcfa <= 0) return 0;
  const rate = direction === "in" ? row.buyRate : row.sellRate;
  if (!rate) return 0;
  return fcfa / rate;
}

export function formatCryptoUnits(amount: number, unit: string): string {
  if (!Number.isFinite(amount) || amount <= 0) return "—";
  const digits = unit === "USD" || unit === "TRX" || unit === "ADA" ? 2 : 6;
  return amount.toFixed(digits);
}

export const MOMO_OPERATORS = [
  { id: "orange", name: "Orange Money",  color: "#FF6600", image: IMAGES.orange },
  { id: "mtn",    name: "MTN MoMo",      color: "#FFC107", image: IMAGES.mtn },
  { id: "gimac",  name: "Gimac",         color: "#006B3D", image: "" },
  { id: "eu",     name: "Express Union", color: "#0066CC", image: IMAGES.expressUnion },
  { id: "yoomee", name: "Yoomee Money",  color: "#9B59B6", image: IMAGES.yoomee },
];

/** Moyen d'encaissement Iwopay, proposé à côté d'Orange Money et de MTN. Uniquement OM et MoMo Cameroun. */
export const IWOPAY_METHOD = { id: "iwopay", name: "Iwopay", color: "#0EA5E9", image: "" } as const;

export const IWOPAY_SCOPE =
  "Iwopay est disponible uniquement pour les Mobile Money camerounais : Orange Money (OM) et MTN MoMo (MOMO).";

export const PAYPAL_PAY_METHOD = { id: "paypal", name: "PayPal", color: "#003087", image: IMAGES.paypal } as const;
export const CRYPTO_PAY_METHOD = { id: "crypto", name: "Crypto", color: "#26A17B", image: IMAGES.crypto } as const;

export function isAltPay(id: string): id is "gimac" | "paypal" | "crypto" {
  return id === "gimac" || id === "paypal" || id === "crypto";
}

export const FACTURE_BILLERS = [
  { id: "canal",     name: "Canal+",    image: IMAGES.canal,      color: "#0071BC", desc: "Abonnement Canal+ Cameroun" },
  { id: "eneo",      name: "Eneo",      image: IMAGES.eneo,       color: "#FFD700", desc: "Facture d'électricité Eneo" },
  { id: "camwater",  name: "Camwater",  image: IMAGES.camwater,   color: "#00AEEF", desc: "Facture d'eau Camwater" },
  { id: "startimes", name: "StarTimes", image: IMAGES.startimes,  color: "#E31837", desc: "Abonnement StarTimes" },
];

export const FACTURE_COMMISSION = 200;

export const SERVICE_STOCK: Record<string, { inStock: boolean; note?: string }> = {
  "cartes-cadeaux": { inStock: true },
  "crypto":         { inStock: true },
  "coupons":        { inStock: true },
  "uba":            { inStock: true },
  "paypal":         { inStock: true },
  "factures":       { inStock: true },
};

// Services exposés dans le sous-menu "Services" de la navbar
export const NAV_SERVICES = [
  { slug: "cartes-cadeaux", tk: "svc.giftcards", emoji: "🎮", color: "#C9A84C", href: "/services/cartes-cadeaux" },
  { slug: "crypto",         tk: "svc.crypto",    emoji: "₿",  color: "#26A17B", href: "/services/crypto" },
  { slug: "coupons",        tk: "svc.coupons",   emoji: "🎫", color: "#25D366", href: "/services/coupons" },
  { slug: "uba",            tk: "svc.uba",       emoji: "💳", color: "#8B0000", href: "/services/uba" },
  { slug: "paypal",         tk: "svc.paypal",    emoji: "💸", color: "#003087", href: "/services/paypal" },
  { slug: "factures",       tk: "svc.factures",  emoji: "🔄", color: "#FF6B00", href: "/services/factures" },
];
