export const CONTACT = {
  whatsapp: "+237697657734",
  whatsappDisplay: "+237 697 657 734",
  tel: "+237694360978",
  email: "contact@chreolempire.com",
  address: "Vallée 3, Boutiques Deido, Douala, Cameroun",
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
};

export const IMAGES = {
  logo:       "/assets/chreolempire logo avec contact m.webp",
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
  mtn:     "/assets/MTN Mobile Money (MoMo) Payment .webp",
  orange:  "/assets/orange-money.webp",
  expressUnion: "/assets/Express Union logo.webp",
  yoomee: "/assets/Yoomee Money logo.webp",
  canal:   "/assets/Canal+ logo.webp",
  eneo:    "/assets/Eneo logo.webp",
  camwater:"/assets/Camwater logo.webp",
  startimes:"/assets/StarTimes logo.webp",
  boutique:   "/assets/boutique.webp",
  banner:     "/assets/Baniere_ChreolEMpire_Cartes-Cadeaux.webp",
  googleAvis: "/assets/google-avis-client-grande.webp",
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
  usdt: ["TRC20", "BEP20", "ERC20", "SPL", "Arbitrum"],
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
  pcs:       { rate: 480, commission: 7,  formula: "(montant − 7%) × 480", codeLength: 10, codeType: "alphanumérique" as const },
  transcash: { rate: 480, commission: 0,  formula: "montant × 480",         codeLength: 12, codeType: "numérique" as const },
};

export const PAYPAL_RATES = {
  sellRate: 580,
  buyRate:  700,
};

export const PAYPAL_LIMITS = {
  sell: { min: 20,    max: 500,    currency: "€",    label: "Vente (retrait)" },
  buy:  { min: 3500,  max: 500000, currency: "FCFA", label: "Achat (recharge)" },
};

export const MOMO_OPERATORS = [
  { id: "orange", name: "Orange Money",  color: "#FF6600", image: IMAGES.orange },
  { id: "mtn",    name: "MTN MoMo",      color: "#FFC107", image: IMAGES.mtn },
  { id: "gimac",  name: "Gimac",         color: "#006B3D", image: "" },
  { id: "eu",     name: "Express Union", color: "#0066CC", image: IMAGES.expressUnion },
  { id: "yoomee", name: "Yoomee Money",  color: "#9B59B6", image: IMAGES.yoomee },
];

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
