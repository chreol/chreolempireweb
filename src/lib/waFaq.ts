// Base de connaissances du bot FAQ WhatsApp.
// Chaque entrée : mots-clés déclencheurs + réponse. Matching simple par score.

export interface FaqEntry {
  keywords: string[];
  answer: string;
}

export const WA_FAQ: FaqEntry[] = [
  {
    keywords: ["bonjour", "salut", "bonsoir", "hello", "coucou", "hi"],
    answer: "Bonjour et bienvenue chez Chreol Empire ! 👋\n\nJe peux vous renseigner sur :\n🎮 Cartes cadeaux (PSN, Roblox, Steam…)\n₿ Crypto (USDT, BTC…)\n💳 Carte UBA\n💸 PayPal\n🎫 Coupons Transcash/PCS\n📋 Paiement factures\n\nQue puis-je faire pour vous ?",
  },
  {
    keywords: ["carte cadeau", "psn", "playstation", "roblox", "robux", "steam", "itunes", "google play", "nintendo", "razer", "vbucks", "v-bucks", "fortnite"],
    answer: "🎮 Cartes cadeaux disponibles : PSN, Roblox/Robux, Steam, iTunes, Google Play, Nintendo, Razer…\n\nLivraison du code en 15-30 min après paiement MTN MoMo ou Orange Money. 0% commission.\n\n👉 Commandez ici : https://shop.chreolempire.com/services/cartes-cadeaux\n\nQuel produit et quel montant souhaitez-vous ?",
  },
  {
    keywords: ["crypto", "usdt", "bitcoin", "btc", "trx", "tron", "ethereum", "eth", "vendre crypto", "acheter crypto", "tether"],
    answer: "₿ Échange crypto contre FCFA — 0% commission.\n\nNous achetons votre USDT à 580 FCFA/$ et vendons à 700 FCFA/$. Réseau TRC20 recommandé (rapide, frais quasi nuls).\n\n👉 https://shop.chreolempire.com/services/crypto\n\nQuelle crypto et quel montant ?",
  },
  {
    keywords: ["uba", "carte uba", "carte bancaire", "carte visa", "carte prepayee", "carte prépayée", "amazon"],
    answer: "💳 Carte UBA prépayée Visa — utilisable sur Amazon, Netflix, PayPal, partout dans le monde.\n\nSegment I : 10 500 F · II : 17 500 F · III : 25 000 F.\nActivation en 1 à 24h+ après dossier complet (CNI, photo, plan de localisation, NUI).\n\n👉 https://shop.chreolempire.com/services/uba",
  },
  {
    keywords: ["paypal", "solde paypal", "vendre paypal", "acheter paypal"],
    answer: "💸 PayPal Europe ↔ FCFA.\n\nNous rachetons votre solde à 580 FCFA/€ et vendons à 700 FCFA/€. Comptes européens uniquement (France, Belgique, Suisse…).\n\n👉 https://shop.chreolempire.com/services/paypal",
  },
  {
    keywords: ["coupon", "transcash", "pcs", "mastercard", "echanger coupon", "échanger coupon"],
    answer: "🎫 Échange Transcash & PCS Mastercard.\n\nTaux : 480 FCFA/€. Transcash 0% commission, PCS 7%. Minimum 20€. Paiement MoMo en 15 min après vérification du code.\n\n👉 https://shop.chreolempire.com/services/coupons",
  },
  {
    keywords: ["facture", "canal", "eneo", "camwater", "startimes", "payer facture", "echange momo", "échange momo"],
    answer: "📋 Paiement factures (Canal+, Eneo, Camwater, StarTimes) — commission 200 FCFA seulement.\n\nÉchange entre opérateurs MoMo (MTN ↔ Orange) sans frais.\n\n👉 https://shop.chreolempire.com/services/factures",
  },
  {
    keywords: ["prix", "tarif", "combien", "cout", "coût", "taux"],
    answer: "💰 Nos tarifs varient selon le service :\n\n🎮 Cartes cadeaux : selon le montant (taux ~750 F/€)\n₿ Crypto : 580-700 FCFA/$\n💸 PayPal : 580-700 FCFA/€\n🎫 Coupons : 480 FCFA/€\n💳 UBA : dès 10 500 F\n📋 Factures : +200 F\n\nDites-moi quel produit vous intéresse pour un prix exact !",
  },
  {
    keywords: ["paiement", "payer", "momo", "mtn", "orange money", "moyen de paiement", "comment payer"],
    answer: "💳 Moyens de paiement acceptés :\n🟡 MTN Mobile Money\n🟠 Orange Money\n🔵 Express Union\n📲 Yoomee Money\n\nAprès votre commande, un agent vous envoie les instructions de paiement. Livraison dès confirmation !",
  },
  {
    keywords: ["delai", "délai", "combien de temps", "livraison", "rapide", "duree", "durée", "temps"],
    answer: "⚡ Délais de livraison :\n🎮 Cartes cadeaux : 15-30 min\n₿ Crypto : 15-45 min\n🎫 Coupons : 15 min\n💳 Carte UBA : 1 à 24h+ (dossier requis)\n📋 Factures : 5-15 min\n\nService disponible 7j/7 de 7h à 23h.",
  },
  {
    keywords: ["fiable", "arnaque", "confiance", "serieux", "sérieux", "garantie", "securise", "sécurisé", "avis"],
    answer: "🛡️ Chreol Empire, c'est la confiance depuis 2012 :\n✅ 127+ avis Google (4.9/5)\n✅ Boutique physique : Vallée 3, Deido, Douala\n✅ Codes authentiques garantis (remboursement si problème)\n✅ Plus de 12 ans d'activité\n\nVous pouvez commander en toute sérénité !",
  },
  {
    keywords: ["horaire", "ouvert", "disponible", "heure", "quand"],
    answer: "🕐 Nous sommes disponibles 7 jours sur 7, de 7h à 23h.\n\nLes commandes passées hors de ces horaires sont traitées dès l'ouverture le lendemain matin.",
  },
  {
    keywords: ["boutique", "adresse", "ou etes", "où êtes", "localisation", "magasin", "physique"],
    answer: "📍 Notre boutique :\nVallée 3, Boutiques Deido, Douala, Cameroun.\n\nVous pouvez aussi tout commander en ligne et recevoir par WhatsApp — pas besoin de vous déplacer !",
  },
  {
    keywords: ["merci", "thanks", "thank you", "parfait", "super", "ok merci"],
    answer: "Avec plaisir ! 🙏 N'hésitez pas si vous avez d'autres questions. À très bientôt chez Chreol Empire ! 🎮🇨🇲",
  },
];

const FALLBACK =
  "Merci pour votre message ! 🙏\n\nUn agent Chreol Empire va vous répondre dans les plus brefs délais (7h-23h, 7j/7).\n\nEn attendant, vous pouvez consulter nos services : https://shop.chreolempire.com/services";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function matchFaq(message: string): string {
  const text = normalize(message);
  let best: { score: number; answer: string } | null = null;

  for (const entry of WA_FAQ) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (text.includes(normalize(kw))) score += kw.length; // mots plus longs = plus spécifiques
    }
    if (score > 0 && (!best || score > best.score)) best = { score, answer: entry.answer };
  }

  return best?.answer ?? FALLBACK;
}
