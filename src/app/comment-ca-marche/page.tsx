import Link from "next/link";

interface Step {
  icon: string;
  title: string;
  desc: string;
}

interface ServiceGuide {
  id: string;
  emoji: string;
  title: string;
  color: string;
  href: string;
  delay: string;
  steps: Step[];
}

const GUIDES: ServiceGuide[] = [
  {
    id: "cartes",
    emoji: "🎮",
    title: "Cartes Cadeaux",
    color: "#C9A84C",
    href: "/services/cartes-cadeaux",
    delay: "5 – 30 min",
    steps: [
      { icon: "🔍", title: "Choisissez votre carte", desc: "Sélectionnez la carte (PSN, Steam, Roblox, iTunes…) et le montant souhaité sur notre site." },
      { icon: "💬", title: "Envoyez votre commande", desc: "Cliquez sur « Commander via WhatsApp ». Le message est pré-rempli avec tous les détails." },
      { icon: "💸", title: "Payez par Mobile Money", desc: "Effectuez votre paiement MTN MoMo ou Orange Money au numéro que nous vous indiquons, puis envoyez la capture." },
      { icon: "✅", title: "Recevez votre code", desc: "Votre code de carte cadeau est livré directement sur WhatsApp dans les 5 à 30 minutes." },
    ],
  },
  {
    id: "crypto-vente",
    emoji: "₿",
    title: "Crypto → FCFA (Vente)",
    color: "#26A17B",
    href: "/services/crypto",
    delay: "15 – 30 min",
    steps: [
      { icon: "💱", title: "Choisissez votre crypto", desc: "Sélectionnez la crypto (USDT, BTC, TRX…) et le réseau blockchain (TRC20, BEP20…)." },
      { icon: "📤", title: "Envoyez vos cryptos", desc: "Transférez le montant voulu à notre adresse wallet affichée sur le site. Conservez votre TxID." },
      { icon: "📋", title: "Partagez le TxID", desc: "Envoyez le hash de transaction sur WhatsApp ainsi qu'une capture d'écran de l'envoi." },
      { icon: "💚", title: "Recevez votre FCFA", desc: "Dès confirmation blockchain, nous virons le FCFA sur votre MTN MoMo ou Orange Money (15–30 min)." },
    ],
  },
  {
    id: "crypto-achat",
    emoji: "💳",
    title: "FCFA → Crypto (Achat)",
    color: "#9945FF",
    href: "/services/crypto",
    delay: "15 – 60 min",
    steps: [
      { icon: "💱", title: "Choisissez la crypto", desc: "Sélectionnez la crypto voulue, le réseau, et renseignez votre adresse wallet de destination." },
      { icon: "💸", title: "Payez par Mobile Money", desc: "Envoyez le montant en FCFA par MTN MoMo ou Orange Money et partagez la capture sur WhatsApp." },
      { icon: "✅", title: "Recevez vos cryptos", desc: "Nous envoyons les cryptos à votre wallet dans les 15 à 60 minutes après confirmation de votre paiement." },
    ],
  },
  {
    id: "paypal",
    emoji: "💸",
    title: "PayPal Europe",
    color: "#003087",
    href: "/services/paypal",
    delay: "15 – 30 min",
    steps: [
      { icon: "💶", title: "Mode Vente — Vendez vos euros", desc: "Indiquez le montant (min 20€), votre compte PayPal source et votre numéro Mobile Money." },
      { icon: "📤", title: "Envoyez depuis PayPal", desc: "Transférez le montant sur notre compte PayPal indiqué sur WhatsApp." },
      { icon: "💚", title: "Recevez votre FCFA", desc: "Dès réception, nous virons le FCFA sur votre MoMo en 15–30 min au taux du jour (580 FCFA/€)." },
      { icon: "💳", title: "Mode Achat — Rechargez PayPal", desc: "Payez en FCFA par Mobile Money et indiquez l'email PayPal de destination. Rechargé en 30 min (700 FCFA/€)." },
    ],
  },
  {
    id: "coupons",
    emoji: "🎫",
    title: "Coupons Transcash / PCS",
    color: "#25D366",
    href: "/services/coupons",
    delay: "10 – 20 min",
    steps: [
      { icon: "🎫", title: "Entrez le code coupon", desc: "Collez votre code PCS Mastercard (8 chiffres) ou Transcash (12 chiffres) dans le formulaire. Plusieurs codes ? Séparez-les par des virgules." },
      { icon: "📋", title: "Indiquez votre Mobile Money", desc: "Renseignez votre nom, opérateur (MTN / Orange) et numéro de téléphone pour recevoir votre FCFA." },
      { icon: "💚", title: "Recevez votre FCFA", desc: "Nous vérifions et validons votre coupon, puis virons le FCFA sur votre compte en 10 à 20 minutes." },
    ],
  },
  {
    id: "uba",
    emoji: "💳",
    title: "Carte UBA Cameroun",
    color: "#8B0000",
    href: "/services/uba",
    delay: "24 – 72h (achat) / 15 min (recharge)",
    steps: [
      { icon: "🃏", title: "Choisissez votre segment", desc: "Segment I (10 500 FCFA), Segment II (17 500 FCFA) ou Segment III (25 000 FCFA) selon votre usage." },
      { icon: "💸", title: "Payez par Mobile Money", desc: "Effectuez le paiement par MTN MoMo ou Orange Money et transmettez la preuve sur WhatsApp avec vos informations." },
      { icon: "📦", title: "Recevez votre carte", desc: "Votre carte UBA Visa prépayée est livrée physiquement ou les données de recharge en 24 à 72 heures ouvrées." },
      { icon: "🔄", title: "Rechargez quand vous voulez", desc: "Utilisez l'onglet « Recharge » sur le site pour recharger votre carte existante en quelques minutes." },
    ],
  },
  {
    id: "factures",
    emoji: "🔄",
    title: "Paiement Factures & Échange MoMo",
    color: "#FF6B00",
    href: "/services/factures",
    delay: "5 – 30 min",
    steps: [
      { icon: "🔌", title: "Choisissez le fournisseur", desc: "Sélectionnez Canal+, Eneo, Camwater ou StarTimes selon votre facture à payer." },
      { icon: "📋", title: "Renseignez votre identifiant", desc: "Entrez votre numéro de téléphone (9 chiffres) ou numéro de décodeur (14 chiffres) selon le fournisseur." },
      { icon: "💸", title: "Payez le montant + commission", desc: "Une commission fixe de 200 FCFA s'ajoute au montant. Payez le total par MTN MoMo ou Orange Money." },
      { icon: "✅", title: "Facture réglée confirmée", desc: "Votre facture est payée sous 15–30 minutes. Vous recevez la confirmation sur WhatsApp." },
    ],
  },
];

const GLOBAL_STEPS = [
  { n: "1", icon: "🛍️", title: "Choisissez votre service", desc: "Parcourez notre catalogue, calculez votre montant en temps réel." },
  { n: "2", icon: "💬", title: "Commandez sur WhatsApp", desc: "Le message est pré-rempli automatiquement avec tous les détails." },
  { n: "3", icon: "💸", title: "Payez par Mobile Money", desc: "MTN MoMo ou Orange Money — rapide, sécurisé, sans carte bancaire." },
  { n: "4", icon: "✅", title: "Recevez en 15–30 min", desc: "Livraison directement sur WhatsApp ou sur votre wallet selon le service." },
];

const FAQ_ITEMS = [
  { q: "Est-ce sécurisé de payer par Mobile Money ?", a: "Oui. MTN MoMo et Orange Money utilisent un code PIN que vous seul connaissez. Vos coordonnées bancaires ne transitent jamais par notre plateforme. Nous opérons depuis 2012 sans aucun incident signalé." },
  { q: "Que se passe-t-il si je ne reçois pas mon produit ?", a: "Contactez-nous immédiatement sur WhatsApp au +237 694 360 978. Nous traitons chaque réclamation sous 2 heures. Si l'erreur vient de notre côté, le produit est remplacé ou remboursé." },
  { q: "Peut-on commander la nuit ?", a: "Le site est disponible 24h/24. Nous traitons les commandes de 7h à 23h tous les jours. Les commandes passées hors de ces heures sont traitées dès l'ouverture." },
  { q: "Puis-je commander pour quelqu'un d'autre ?", a: "Absolument. Renseignez simplement le numéro Mobile Money ou l'email PayPal de la personne concernée. Pour les cartes cadeaux, aucun numéro n'est nécessaire." },
  { q: "Le taux affiché est-il garanti ?", a: "Le taux est garanti au moment de la confirmation de votre commande. Pour les cryptos et PayPal, le taux appliqué est celui en vigueur lors de notre échange WhatsApp." },
];

export default function CommentCaMarchePage() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          <a href="/" className="hover:text-white transition-colors">Accueil</a>
          <span>›</span>
          <span style={{ color: "var(--gold)" }}>Comment ça marche</span>
        </div>

        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>Guide complet</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
          Commander en toute<br />
          <span style={{ color: "var(--gold)" }}>confiance</span>
        </h1>
        <p className="text-base max-w-xl mb-10" style={{ color: "var(--text-secondary)" }}>
          Paiement Mobile Money, livraison WhatsApp, 0% commission. Voici exactement comment se déroule chaque transaction chez Chreol Empire.
        </p>

        {/* Global 4 steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {GLOBAL_STEPS.map((s, i) => (
            <div key={s.n} className="relative flex flex-col items-center text-center gap-3 p-4 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shrink-0"
                style={{ background: "var(--gold)", color: "#0A0A0A" }}>
                {s.n}
              </div>
              <p className="text-lg">{s.icon}</p>
              <div>
                <p className="font-black text-white text-sm mb-1">{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
              {i < GLOBAL_STEPS.length - 1 && (
                <span className="hidden sm:block absolute -right-3 top-8 text-lg z-10" style={{ color: "var(--gold)" }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Per-service steppers */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 flex flex-col gap-10">
        <p className="text-xs font-black uppercase tracking-widest -mb-4" style={{ color: "var(--text-muted)" }}>
          Détail par service
        </p>

        {GUIDES.map(guide => (
          <div key={guide.id} className="rounded-3xl overflow-hidden"
            style={{ border: `1px solid ${guide.color}33`, background: "var(--bg-card)" }}>

            {/* Service header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ background: `${guide.color}12`, borderBottom: `1px solid ${guide.color}22` }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{guide.emoji}</span>
                <div>
                  <p className="font-black text-white text-base">{guide.title}</p>
                  <p className="text-xs font-bold" style={{ color: guide.color }}>⏱ {guide.delay}</p>
                </div>
              </div>
              <a href={guide.href}
                className="px-4 py-2 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
                style={{ background: guide.color, color: "#fff" }}>
                Accéder →
              </a>
            </div>

            {/* Steps */}
            <div className="p-6">
              <div className="flex flex-col gap-0">
                {guide.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 font-black"
                        style={{ background: `${guide.color}20`, border: `2px solid ${guide.color}`, color: guide.color }}>
                        {i + 1}
                      </div>
                      {i < guide.steps.length - 1 && (
                        <div className="w-0.5 flex-1 my-1 min-h-[1.5rem]" style={{ background: `${guide.color}33` }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-5 pt-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{step.icon}</span>
                        <p className="font-black text-white text-sm">{step.title}</p>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--gold)" }}>Questions fréquentes</p>
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="group rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none font-black text-white text-sm">
                {item.q}
                <span className="shrink-0 text-base transition-transform group-open:rotate-45" style={{ color: "var(--gold)" }}>+</span>
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <div className="rounded-3xl p-8 sm:p-12 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-4xl mb-4">💬</p>
          <h2 className="text-2xl font-black text-white mb-2">Prêt à commander ?</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Une question ? Notre équipe est disponible tous les jours de 7h à 23h sur WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`https://wa.me/237694360978?text=${encodeURIComponent("Bonjour, je souhaite passer une commande.")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-sm transition-opacity hover:opacity-85"
              style={{ background: "#25D366" }}>
              💬 Ouvrir WhatsApp
            </a>
            <Link href="/services"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm transition-opacity hover:opacity-85"
              style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              Voir nos services →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
