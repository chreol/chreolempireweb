import Link from "next/link";
import Image from "next/image";
import { CONTACT, IMAGES } from "@/lib/services";


const SERVICES = [
  {
    image: IMAGES.psn, title: "Cartes Cadeaux", emoji: "🎮",
    sub: "PSN · iTunes · Roblox · Steam · Razer Gold · Nintendo",
    desc: "Codes authentiques, toutes régions (Europe, USA, UK…). Livraison WhatsApp en 15–30 min.",
    color: "#C9A84C", href: "/services/cartes-cadeaux",
    tags: ["PSN", "iTunes", "Roblox", "Steam", "Razer", "Nintendo"],
  },
  {
    image: IMAGES.cryptoMomo, title: "Crypto & MoMo", emoji: "₿",
    sub: "USDT · BTC · TRX · ETH · SOL · BNB — 0% commission",
    desc: "Achetez ou vendez vos cryptos contre FCFA via Mobile Money. Taux du marché en temps réel.",
    color: "#26A17B", href: "/services/crypto",
    tags: ["USDT", "BTC", "TRX", "ETH", "MTN", "Orange"],
  },
  {
    image: IMAGES.transcash, title: "Échange Coupons", emoji: "🎫",
    sub: "Transcash · PCS Mastercard",
    desc: "Échangez vos coupons Transcash ou PCS Mastercard contre du FCFA. Taux 440 FCFA/€.",
    color: "#25D366", href: "/services/coupons",
    tags: ["Transcash", "PCS", "440 FCFA/€", "Mobile Money"],
  },
  {
    image: IMAGES.ubaCard, title: "UBA Cameroun", emoji: "💳",
    sub: "Achat carte & recharge — Segments I, II, III",
    desc: "Obtenez votre carte UBA Cameroun ou rechargez votre solde existant rapidement.",
    color: "#8B0000", href: "/services/uba",
    tags: ["Segment I", "Segment II", "Segment III", "Recharge"],
  },
  {
    image: IMAGES.paypal2, title: "PayPal Europe", emoji: "💸",
    sub: "Achat & vente de solde PayPal Europe",
    desc: "Vendez votre solde PayPal ou achetez du solde. 580 FCFA/€ achat · 700 FCFA/€ vente.",
    color: "#003087", href: "/services/paypal",
    tags: ["PayPal", "700 FCFA/€", "Europe", "France"],
  },
  {
    image: IMAGES.factures, title: "Factures & Échange MoMo", emoji: "🔄",
    sub: "Canal+ · Eneo · Camwater · Échange entre opérateurs",
    desc: "Payez vos factures ou échangez de l'argent entre opérateurs MoMo sans frais.",
    color: "#FF6B00", href: "/services/factures",
    tags: ["Canal+", "Eneo", "Camwater", "StarTimes", "MoMo"],
  },
];

export default function ServicesPage() {
  return (
    <div className="overflow-x-hidden">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-10">
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>Catalogue</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Nos Services</h1>
            <p className="text-base max-w-lg" style={{ color: "var(--text-secondary)" }}>
              Livraison express · Paiement Mobile Money · Support 7j/7
            </p>
          </div>
          <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#25D366" }}>
            <Image src={IMAGES.whatsapp} alt="" width={18} height={18} unoptimized className="shrink-0" />
            Commander maintenant
          </a>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {SERVICES.map(s => (
            <Link key={s.href} href={s.href}
              className="group flex flex-col rounded-3xl overflow-hidden transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
              style={{ background: "var(--bg-card)", boxShadow: `0 0 0 1px ${s.color}33` }}>
              {/* Image banner */}
              <div className="relative h-44 w-full overflow-hidden">
                <Image src={s.image} alt={s.title} fill style={{ objectFit: "cover" }}
                  className="outline outline-1 -outline-offset-1 outline-white/10 transition-transform duration-500 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75))" }} />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="font-black text-xl text-white leading-tight">{s.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>{s.sub}</p>
                  </div>
                  <span className="text-2xl shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: s.color }}>→</span>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-4 flex-1">
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{ background: s.color + "18", color: s.color }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-border)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% -10%, #25D36612 0%, transparent 60%)" }} />
          <div className="relative">
            <p className="text-3xl mb-3">💬</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Besoin d'aide pour commander ?</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Contactez-nous directement — nous traitons la plupart des demandes spéciales.
            </p>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "#25D366" }}>
              <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
              Ouvrir WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
