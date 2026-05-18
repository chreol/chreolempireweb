export interface BlogPost {
  slug: string;
  title: string;
  headline: string;
  description: string;
  date: string;
  dateISO: string;
  readTime: number;
  category: string;
  emoji: string;
  keywords: string[];
  sections: BlogSection[];
  faq: { q: string; a: string }[];
  relatedService: { href: string; label: string };
}

export type BlogSection =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "tip"; title: string; text: string }
  | { type: "cta"; label: string; href: string };

export const POSTS: BlogPost[] = [
  {
    slug: "acheter-robux-vbucks-cameroun",
    emoji: "🎮",
    category: "Cartes Cadeaux",
    title: "Comment acheter des Robux et V-Bucks au Cameroun en 2025",
    headline: "Guide complet pour acheter Robux (Roblox) et V-Bucks (Fortnite) depuis Douala ou n'importe quelle ville du Cameroun, en payant MTN MoMo ou Orange Money.",
    description: "Comment acheter des Robux Roblox ou V-Bucks Fortnite au Cameroun en 2025 ? Payez en FCFA via MTN MoMo ou Orange Money. Livraison du code en 15 minutes sur WhatsApp.",
    date: "15 mai 2025",
    dateISO: "2025-05-15",
    readTime: 6,
    keywords: ["acheter robux cameroun", "acheter vbucks cameroun", "robux douala", "fortnite cameroun", "roblox fcfa", "vbucks fcfa", "cartes cadeaux jeux cameroun"],
    relatedService: { href: "/services/cartes-cadeaux", label: "Voir les prix Robux & V-Bucks" },
    sections: [
      { type: "p", text: "Roblox et Fortnite sont deux des jeux les plus populaires chez les jeunes camerounais. Mais acheter des Robux ou des V-Bucks depuis Douala, Yaoundé ou Bafoussam n'est pas évident : les boutiques officielles n'acceptent pas les paiements Mobile Money, et les cartes de crédit restent peu accessibles." },
      { type: "p", text: "Chreol Empire résout ce problème depuis 2012. Voici exactement comment procéder." },
      { type: "h2", text: "Pourquoi les plateformes officielles ne fonctionnent pas au Cameroun ?" },
      { type: "p", text: "La boutique Roblox et le shop Fortnite exigent une carte Visa ou Mastercard internationale, ou un compte PayPal avec solde suffisant. MTN MoMo et Orange Money ne sont pas reconnus comme moyens de paiement directs sur ces plateformes." },
      { type: "p", text: "La solution : passer par une carte cadeau rechargeable. Ces cartes existent en valeurs de 5€, 10€, 15€, 20€, 25€, 50€, et permettent d'ajouter du solde directement sur votre compte Roblox ou Epic Games (Fortnite) — sans carte bancaire." },
      { type: "h2", text: "Combien coûtent les Robux au Cameroun ?" },
      { type: "p", text: "Le taux de change appliqué par Chreol Empire est d'environ 750 FCFA par euro. Voici les équivalences indicatives pour les montants les plus courants :" },
      { type: "ul", items: [
        "Carte Roblox 5€ → environ 3 750 FCFA (400 Robux)",
        "Carte Roblox 10€ → environ 7 500 FCFA (800 Robux)",
        "Carte Roblox 20€ → environ 15 000 FCFA (1 700 Robux + bonus)",
        "Carte V-Bucks 10€ → environ 7 500 FCFA (1 000 V-Bucks)",
        "Carte V-Bucks 20€ → environ 15 000 FCFA (2 800 V-Bucks)",
      ]},
      { type: "tip", title: "Bon à savoir", text: "Le prix exact est confirmé au moment de la commande selon le taux du jour. Consultez notre ticker de taux en haut de page pour le cours en temps réel." },
      { type: "h2", text: "Comment passer votre commande en 3 étapes ?" },
      { type: "ul", items: [
        "Étape 1 — Choisissez votre carte (Roblox ou V-Bucks) et le montant souhaité sur notre page Cartes Cadeaux.",
        "Étape 2 — Cliquez sur Commander ou contactez-nous directement sur WhatsApp (+237 694 360 978). Précisez le type de carte, le montant et votre région de compte (EU, US, UK…).",
        "Étape 3 — Effectuez le paiement par MTN MoMo ou Orange Money au numéro indiqué. Le code vous est livré sur WhatsApp dans les 15 à 30 minutes.",
      ]},
      { type: "h2", text: "Comment activer votre code Robux ou V-Bucks ?" },
      { type: "h3", text: "Activer sur Roblox" },
      { type: "ul", items: [
        "Connectez-vous sur roblox.com ou l'application Roblox.",
        "Cliquez sur votre avatar (haut à droite) → Robux.",
        "Sélectionnez « Réechanger une carte cadeau ».",
        "Saisissez le code reçu via WhatsApp et confirmez.",
      ]},
      { type: "h3", text: "Activer sur Fortnite (V-Bucks)" },
      { type: "ul", items: [
        "Connectez-vous sur epicgames.com → Mon compte.",
        "Allez dans « Transactions » → « Utiliser un code ».",
        "Saisissez le code à 25 caractères reçu sur WhatsApp.",
        "Les V-Bucks s'ajoutent automatiquement à votre compte Fortnite.",
      ]},
      { type: "tip", title: "Attention à la région", text: "Vérifiez bien que la région de votre carte correspond à votre compte de jeu. Un code Europe ne fonctionne pas sur un compte USA. En cas de doute, précisez-le lors de votre commande et nous vous orienterons." },
      { type: "h2", text: "Chreol Empire : disponible partout au Cameroun" },
      { type: "p", text: "Notre boutique est 100% en ligne. Vous pouvez commander depuis Douala, Yaoundé, Bafoussam, Bamenda, Limbé ou n'importe quelle ville — tant que vous avez accès à WhatsApp et à Mobile Money. Pas de déplacement, pas d'attente." },
      { type: "p", text: "Nous sommes disponibles 7 jours sur 7, de 7h à 23h. Les commandes passées hors de ces horaires sont traitées dès l'ouverture le lendemain." },
      { type: "cta", label: "Voir les prix Robux & V-Bucks →", href: "/services/cartes-cadeaux" },
    ],
    faq: [
      { q: "Peut-on acheter des Robux au Cameroun avec Orange Money ?", a: "Oui. Chreol Empire accepte Orange Money, MTN MoMo, Express Union et Yoomee Money. Vous recevez le code de votre carte cadeau Roblox sur WhatsApp dans les 15 à 30 minutes après le paiement." },
      { q: "Quelle région choisir pour ma carte Roblox au Cameroun ?", a: "La région Europe (EU) est la plus polyvalente et fonctionne avec la majorité des comptes créés sans VPN. Si votre compte a été créé via un serveur américain, précisez-le lors de la commande pour recevoir une carte US." },
      { q: "Peut-on acheter des V-Bucks Fortnite sans carte bancaire au Cameroun ?", a: "Absolument. Chreol Empire vous permet d'acheter des cartes V-Bucks Fortnite en payant uniquement par Mobile Money (MTN MoMo ou Orange Money). Aucune carte bancaire n'est requise." },
      { q: "Les codes sont-ils garantis authentiques ?", a: "Oui. Tous nos codes proviennent de sources officielles et vérifiées. En cas de problème à l'activation, nous remplaçons ou remboursons intégralement, sans discussion." },
      { q: "Peut-on commander pour quelqu'un d'autre (cadeau) ?", a: "Oui. Pour une carte cadeau Roblox ou Fortnite destinée à un ami, il vous suffit de passer la commande normalement. Vous recevez le code sur votre WhatsApp et vous le transmettez à qui vous voulez." },
    ],
  },
  {
    slug: "echanger-usdt-bitcoin-contre-fcfa-cameroun",
    emoji: "₿",
    category: "Crypto & Mobile Money",
    title: "USDT, Bitcoin, TRX : comment échanger ses crypto contre FCFA au Cameroun",
    headline: "Guide pratique pour vendre vos cryptomonnaies (USDT, BTC, ETH, TRX, SOL…) contre des FCFA et recevoir le montant sur MTN MoMo ou Orange Money en moins d'une heure.",
    description: "Comment vendre vos USDT, Bitcoin ou TRX contre FCFA au Cameroun ? Recevez votre argent sur MTN MoMo ou Orange Money. 0% commission, taux compétitifs, service disponible 7j/7 à Douala.",
    date: "10 mai 2025",
    dateISO: "2025-05-10",
    readTime: 7,
    keywords: ["usdt fcfa cameroun", "echanger bitcoin fcfa", "vendre crypto cameroun", "usdt mtn momo", "crypto douala", "bitcoin fcfa douala", "vendre usdt orange money"],
    relatedService: { href: "/services/crypto", label: "Voir les taux crypto actuels" },
    sections: [
      { type: "p", text: "Le marché crypto au Cameroun est en pleine explosion. De plus en plus de Camerounais reçoivent des paiements en USDT, gagnent des TRX sur des plateformes P2P, ou souhaitent liquider une position Bitcoin. Mais comment convertir ces actifs en FCFA reçus directement sur Mobile Money ?" },
      { type: "p", text: "Chreol Empire opère ce service depuis 2012, avec 0% de commission et des taux parmi les plus compétitifs de Douala." },
      { type: "h2", text: "Quelles cryptomonnaies peut-on échanger au Cameroun ?" },
      { type: "p", text: "Chreol Empire traite actuellement les 9 principales cryptomonnaies en circulation :" },
      { type: "ul", items: [
        "USDT (Tether) — réseau TRC20, BEP20, ERC20",
        "USDC — réseau ERC20, BEP20",
        "Bitcoin (BTC) — réseau Bitcoin natif",
        "Ethereum (ETH) — réseau ERC20 ou Arbitrum",
        "Binance Coin (BNB) — réseau BEP20",
        "Solana (SOL) — réseau SPL",
        "TRON (TRX) — réseau TRC20",
        "Litecoin (LTC) — réseau Litecoin",
        "Cardano (ADA) — réseau Cardano",
      ]},
      { type: "h2", text: "Quels sont les taux actuels USDT / FCFA ?" },
      { type: "p", text: "Les taux pratiqués par Chreol Empire sont visibles en temps réel dans le ticker en haut de chaque page. À titre indicatif :" },
      { type: "ul", items: [
        "Nous achetons votre USDT : 580 FCFA par dollar",
        "Nous vendons de l'USDT : 700 FCFA par dollar",
        "Bitcoin (achat) : environ 58 000 000 FCFA par BTC",
        "Ethereum (achat) : environ 2 900 000 FCFA par ETH",
        "Solana (achat) : environ 99 000 FCFA par SOL",
      ]},
      { type: "tip", title: "Taux garantis", text: "Le taux est verrouillé au moment où vous envoyez votre transaction. Si le marché bouge pendant votre transfert, c'est le taux de la confirmation qui s'applique — pas celui de la demande." },
      { type: "h2", text: "Comment vendre vos crypto contre FCFA : étape par étape" },
      { type: "ul", items: [
        "Étape 1 — Contactez-nous sur WhatsApp (+237 694 360 978) en précisant : la crypto à vendre, le montant, le réseau de transfert, votre opérateur Mobile Money (MTN ou Orange) et votre numéro.",
        "Étape 2 — Nous confirmons le taux du moment et vous communiquons notre adresse wallet de réception.",
        "Étape 3 — Envoyez vos crypto sur le wallet indiqué et partagez le TxID (hash de transaction).",
        "Étape 4 — Dès confirmation sur la blockchain, nous vous versons les FCFA sur votre Mobile Money. Délai : 15–45 minutes selon la congestion réseau.",
      ]},
      { type: "h2", text: "Pourquoi choisir Chreol Empire pour vendre vos crypto ?" },
      { type: "ul", items: [
        "0% de commission — vous recevez exactement le montant calculé au taux affiché.",
        "Pas de KYC contraignant pour les petits montants (moins de 500 000 FCFA).",
        "Traitement 7j/7 de 7h à 23h, dimanche inclus.",
        "Présence physique à Douala (Vallée 3, Deido) pour les gros volumes.",
        "127+ avis clients vérifiés, note 4.9/5.",
      ]},
      { type: "h2", text: "Est-ce légal d'échanger des crypto contre FCFA au Cameroun ?" },
      { type: "p", text: "La BEAC (Banque des États de l'Afrique Centrale) n'a pas encore émis de réglementation interdisant explicitement la détention et l'échange de cryptomonnaies pour les particuliers. L'activité de change informel est encadrée par des règles de bonne pratique." },
      { type: "p", text: "Chreol Empire opère dans ce cadre depuis 2012 sans incident signalé. Pour les montants importants ou les besoins professionnels, nous pouvons fournir un justificatif d'échange sur demande." },
      { type: "cta", label: "Voir les taux crypto actuels →", href: "/services/crypto" },
    ],
    faq: [
      { q: "Comment vendre du USDT contre FCFA au Cameroun ?", a: "Contactez Chreol Empire sur WhatsApp au +237 694 360 978. Précisez le montant en USDT, le réseau de transfert (TRC20 de préférence pour les frais réduits), votre opérateur Mobile Money et votre numéro. Nous vous envoyons notre wallet et versons les FCFA dès confirmation." },
      { q: "Quel réseau utiliser pour envoyer de l'USDT au Cameroun ?", a: "TRC20 (réseau TRON) est recommandé pour sa rapidité (1–2 minutes) et ses frais quasi nuls (moins de 1 USDT). Évitez ERC20 qui peut coûter 5–20$ de gas fees." },
      { q: "Peut-on recevoir des FCFA sur Orange Money après une vente de Bitcoin ?", a: "Oui. Chreol Empire verse le montant équivalent directement sur votre numéro Orange Money, MTN MoMo, Express Union ou Yoomee Money selon votre choix." },
      { q: "Quel est le montant minimum pour échanger des crypto chez Chreol Empire ?", a: "Le minimum est de 10 USD équivalent (environ 5 800 FCFA). Il n'y a pas de maximum fixe — contactez-nous pour les gros volumes afin de convenir d'un taux négocié." },
      { q: "Combien de temps prend la conversion crypto → FCFA ?", a: "15 à 45 minutes en général. Le délai dépend de la congestion du réseau blockchain. Pour TRC20, c'est souvent moins de 10 minutes. Pour Bitcoin, comptez 30–60 minutes (1 confirmation réseau)." },
    ],
  },
  {
    slug: "carte-psn-cameroun-ps4-ps5",
    emoji: "🎮",
    category: "Cartes Cadeaux",
    title: "Carte PSN au Cameroun : tout ce qu'il faut savoir pour jouer sur PS4 et PS5",
    headline: "Guide complet pour acheter une carte PlayStation Network (PSN) au Cameroun : prix en FCFA, régions disponibles, comment activer le crédit et quoi acheter avec.",
    description: "Achetez votre carte PSN au Cameroun depuis Douala. Paiement MTN MoMo ou Orange Money, livraison du code en 15 minutes. Régions EU, US, UK disponibles. Prix en FCFA garanti.",
    date: "5 mai 2025",
    dateISO: "2025-05-05",
    readTime: 7,
    keywords: ["carte psn cameroun", "psn douala", "acheter playstation store cameroun", "psn fcfa", "psn mtn momo", "carte playstation cameroun", "psn pas cher cameroun"],
    relatedService: { href: "/services/cartes-cadeaux", label: "Acheter une carte PSN maintenant" },
    sections: [
      { type: "p", text: "La PlayStation 4 et la PlayStation 5 ont conquis les foyers camerounais. Mais accéder au PlayStation Store depuis Douala pose un problème récurrent : Sony n'accepte pas les paiements Mobile Money, et la plupart des utilisateurs n'ont pas de carte Visa internationale." },
      { type: "p", text: "La carte PSN (PlayStation Network) est la solution. Elle fonctionne comme un bon de recharge : vous achetez un code, vous l'activez sur votre compte PSN, et votre wallet PlayStation est crédité. Vous pouvez alors acheter des jeux, des abonnements PS Plus, du contenu téléchargeable (DLC) ou tout autre item disponible sur la boutique." },
      { type: "h2", text: "Combien coûte une carte PSN au Cameroun ?" },
      { type: "p", text: "Chreol Empire applique un taux de change d'environ 750 FCFA par euro. Les prix varient selon le montant et la région :" },
      { type: "ul", items: [
        "PSN 10€ (Europe) → environ 7 500 FCFA",
        "PSN 20€ (Europe) → environ 15 000 FCFA",
        "PSN 50€ (Europe) → environ 37 500 FCFA",
        "PSN 10$ (USA) → environ 6 500 FCFA",
        "PSN 20$ (USA) → environ 13 000 FCFA",
        "PSN 50$ (USA) → environ 32 500 FCFA",
      ]},
      { type: "tip", title: "Prix indicatifs", text: "Les prix exacts sont confirmés au moment de la commande selon le taux du jour. Consultez le ticker de taux Chreol Empire pour le cours en temps réel." },
      { type: "h2", text: "Quelle région PSN choisir depuis le Cameroun ?" },
      { type: "p", text: "La région de votre carte PSN doit correspondre à la région de votre compte PlayStation. Voici les options disponibles chez Chreol Empire :" },
      { type: "ul", items: [
        "Europe (EU) — idéale si votre compte a été créé sur un réseau européen. Fonctionne en France, Belgique, Espagne, Italie, Allemagne.",
        "France (FR) — carte spécifique France, légèrement moins chère que la zone EU.",
        "USA (US) — nécessaire si vous avez un compte américain (souvent pour accéder à des jeux sortis plus tôt ou du contenu exclusif US).",
        "UK — pour les comptes créés en Grande-Bretagne.",
        "Global — compatible avec la majorité des comptes, peu importe la région.",
      ]},
      { type: "tip", title: "Conseil pratique", text: "En cas de doute sur la région de votre compte, allez dans Paramètres → Compte utilisateur → Infos compte sur votre PS4/PS5. La zone est indiquée clairement. Transmettez cette information lors de votre commande." },
      { type: "h2", text: "Comment activer une carte PSN sur PS4 ou PS5 ?" },
      { type: "h3", text: "Activation depuis la console" },
      { type: "ul", items: [
        "Allez dans le PlayStation Store depuis votre console.",
        "Faites défiler jusqu'en bas du menu latéral et sélectionnez « Utiliser un code ».",
        "Saisissez le code à 12 caractères reçu via WhatsApp.",
        "Le crédit s'ajoute immédiatement à votre Wallet PlayStation.",
      ]},
      { type: "h3", text: "Activation depuis un navigateur web" },
      { type: "ul", items: [
        "Rendez-vous sur store.playstation.com et connectez-vous.",
        "Cliquez sur votre avatar → Utiliser un code de jeu ou d'abonnement.",
        "Entrez le code reçu et confirmez.",
      ]},
      { type: "h2", text: "Que peut-on acheter avec une carte PSN ?" },
      { type: "ul", items: [
        "Jeux complets (PS4, PS5, rétrocompatibles)",
        "Contenu téléchargeable (DLC, extensions, skins)",
        "Abonnements PS Plus Essential, Extra ou Premium (accès au catalogue de jeux mensuels)",
        "Monnaie virtuelle de jeu (FIFA Points, Shark Cash Cards GTA V…)",
        "Films et séries en location ou achat sur PlayStation Video",
      ]},
      { type: "h2", text: "Pourquoi acheter votre carte PSN chez Chreol Empire ?" },
      { type: "ul", items: [
        "Paiement 100% Mobile Money : MTN MoMo, Orange Money, Express Union, Yoomee.",
        "Livraison du code en 15 à 30 minutes via WhatsApp.",
        "Codes authentiques garantis — remboursement ou remplacement en cas de problème.",
        "Service disponible 7j/7, de 7h à 23h.",
        "Boutique physique à Douala (Vallée 3, Deido) pour les achats en présentiel.",
      ]},
      { type: "cta", label: "Acheter une carte PSN maintenant →", href: "/services/cartes-cadeaux" },
    ],
    faq: [
      { q: "Peut-on acheter une carte PSN au Cameroun avec MTN MoMo ?", a: "Oui. Chreol Empire accepte MTN MoMo, Orange Money, Express Union et Yoomee Money. Vous recevez le code PSN sur WhatsApp dans les 15 à 30 minutes." },
      { q: "Ma carte PSN Europe fonctionnera-t-elle sur un compte camerounais ?", a: "Cela dépend de la région configurée sur votre compte PlayStation. La majorité des comptes créés par des utilisateurs camerounais sont en zone Europe et acceptent les cartes EU. En cas de doute, vérifiez dans Paramètres → Compte utilisateur sur votre console." },
      { q: "Peut-on acheter du PS Plus avec une carte PSN Chreol Empire ?", a: "Oui. Le crédit ajouté via la carte PSN peut servir à acheter n'importe quel abonnement disponible sur le PlayStation Store de votre région : PS Plus Essential (9,99€/mois), Extra ou Premium." },
      { q: "Est-ce que les cartes PSN de Chreol Empire expirent ?", a: "Les codes PSN n'ont pas de date d'expiration une fois activés. En revanche, un code non encore utilisé peut théoriquement expirer si non activé pendant plusieurs années — dans la pratique, activez-le dès réception." },
      { q: "Que faire si mon code PSN ne fonctionne pas à l'activation ?", a: "Contactez immédiatement Chreol Empire sur WhatsApp au +237 694 360 978 en partageant une capture d'écran du message d'erreur. Nous traitons chaque réclamation sous 2 heures et procédons au remplacement ou remboursement." },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find(p => p.slug === slug);
}
