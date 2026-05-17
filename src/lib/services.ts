export const CONTACT = {
  whatsapp: "+237697657734",
  whatsappDisplay: "+237 697 657 734",
  tel: "+237694360978",
  email: "chreolempire00@gmail.com",
  address: "Vallée 3, Boutiques Deido, Douala, Cameroun",
  paypalEmail: "LARAMBAMBO@GMAIL.COM",
};

export const IMAGES = {
  logo:       "/assets/chreolempire logo avec contact m.webp",
  whatsapp:   "/assets/whatsapp.webp",
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
  mtn:     "/assets/MTN Mobile Money (MoMo) Payment .webp",
  orange:  "/assets/orange-money.webp",
  expressUnion: "/assets/Express Union logo.webp",
  yoomee: "/assets/Yoomee Money logo.webp",
  canal:   "/assets/Canal+ logo.webp",
  eneo:    "/assets/Eneo logo.webp",
  camwater:"/assets/Camwater logo.webp",
  startimes:"/assets/StarTimes logo.webp",
};

const STANDARD_AMOUNTS = [
  { label: "10€",  price: 7500 },
  { label: "20€",  price: 14500 },
  { label: "50€",  price: 34000 },
  { label: "100€", price: 67000 },
  { label: "150€", price: 99000 },
  { label: "200€", price: 132000 },
  { label: "300€", price: 196000 },
  { label: "500€", price: 340000 },
];

const ITUNES_GP_AMOUNTS = [
  { label: "5€",   price: 4000 },
  { label: "10€",  price: 7500 },
  { label: "15€",  price: 11000 },
  { label: "25€",  price: 18000 },
  { label: "50€",  price: 35000 },
  { label: "100€", price: 68500 },
  { label: "150€", price: 102000 },
  { label: "200€", price: 135000 },
  { label: "300€", price: 204000 },
  { label: "500€", price: 340000 },
];

export const GIFT_CARDS = [
  { id: "psn",        name: "PSN PlayStation",   image: IMAGES.psn,      color: "#003791", tier: "standard" as const, amounts: STANDARD_AMOUNTS },
  { id: "steam",      name: "Steam",             image: IMAGES.steam,    color: "#1B2838", tier: "standard" as const, amounts: STANDARD_AMOUNTS },
  { id: "razer",      name: "Razer Gold",        image: IMAGES.razer,    color: "#44D62C", tier: "standard" as const, amounts: STANDARD_AMOUNTS },
  { id: "roblox-eur", name: "Roblox (€)",        image: IMAGES.roblox,   color: "#E8232A", tier: "standard" as const, amounts: STANDARD_AMOUNTS },
  { id: "nintendo",   name: "Nintendo eShop",    image: IMAGES.nintendo, color: "#E70012", tier: "standard" as const, amounts: STANDARD_AMOUNTS },
  { id: "itunes",     name: "iTunes / App Store",image: IMAGES.itunes,   color: "#0A84FF", tier: "itunes" as const,   amounts: ITUNES_GP_AMOUNTS },
  { id: "googleplay", name: "Google Play",       image: IMAGES.google,   color: "#34A853", tier: "itunes" as const,   amounts: ITUNES_GP_AMOUNTS },
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
  { min: 1500,   max: 20000,  fee: 1500, type: "fixed" as const },
  { min: 20001,  max: 50000,  fee: 2000, type: "fixed" as const },
  { min: 50001,  max: 100000, fee: 5,    type: "percent" as const },
  { min: 100001, max: 350000, fee: 4,    type: "percent" as const },
  { min: 350001, max: 500000, fee: 3,    type: "percent" as const },
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
  usdt: ["TRC20", "BEP20", "ERC20"],
  usdc: ["ERC20", "BEP20", "SPL"],
  btc:  ["Bitcoin"],
  trx:  ["TRC20"],
  sol:  ["SPL"],
  ltc:  ["Litecoin"],
  eth:  ["ERC20", "Arbitrum"],
  ada:  ["Cardano"],
  bnb:  ["BEP20"],
};

export const COUPON_RATES = {
  pcs:       { rate: 440, commission: 7,  formula: "(montant − 7%) × 440", codeLength: 8,  codeType: "alphanumérique" as const },
  transcash: { rate: 440, commission: 0,  formula: "montant × 440",         codeLength: 12, codeType: "numérique" as const },
};

export const PAYPAL_RATES = {
  sellRate: 580,
  buyRate:  700,
};

export const PAYPAL_LIMITS = {
  sell: { min: 20,    max: 500,    currency: "€",    label: "Vente (retrait)" },
  buy:  { min: 10000, max: 500000, currency: "FCFA", label: "Achat (recharge)" },
};

export const MOMO_OPERATORS = [
  { id: "orange", name: "Orange Money",  color: "#FF6600", image: IMAGES.orange },
  { id: "mtn",    name: "MTN MoMo",      color: "#FFC107", image: IMAGES.mtn },
  { id: "eu",     name: "Express Union", color: "#0066CC", image: IMAGES.expressUnion },
  { id: "yoomee", name: "Yoomee Money",  color: "#9B59B6", image: IMAGES.yoomee },
];

export const FACTURE_BILLERS = [
  { id: "canal",     name: "Canal+",    emoji: "📺", color: "#0071BC", desc: "Abonnement Canal+ Cameroun" },
  { id: "eneo",      name: "Eneo",      emoji: "💡", color: "#FFD700", desc: "Facture d'électricité Eneo" },
  { id: "camwater",  name: "Camwater",  emoji: "💧", color: "#00AEEF", desc: "Facture d'eau Camwater" },
  { id: "startimes", name: "StarTimes", emoji: "📡", color: "#E31837", desc: "Abonnement StarTimes" },
];

export const FACTURE_COMMISSION = 200;
