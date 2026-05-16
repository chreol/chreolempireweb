import Link from "next/link";
import Image from "next/image";
import { CONTACT, IMAGES } from "@/lib/services";

const SERVICES = [
  {
    image: IMAGES.psn, title: "Cartes Cadeaux",
    sub: "PSN · iTunes · Roblox · Steam · Razer Gold · Nintendo eShop",
    desc: "Tous les codes authentiques, toutes les régions (Europe, USA, UK…). Livraison code par WhatsApp en 15-30 min.",
    color: "#C9A84C", href: "/services/cartes-cadeaux",
    tags: ["PSN", "iTunes", "Roblox", "Steam", "Razer", "Nintendo"],
  },
  {
    image: IMAGES.cryptoMomo, title: "Crypto & Échange MoMo",
    sub: "USDT · BTC · TRX · USDC · ETH · SOL · BNB",
    desc: "Achetez ou vendez vos cryptomonnaies contre FCFA via Mobile Money. Taux du marché, 0% commission.",
    color: "#26A17B", href: "/services/crypto",
    tags: ["USDT", "BTC", "TRX", "MTN MoMo", "Orange Money"],
  },
  {
    image: IMAGES.transcash, title: "Échange Coupons",
    sub: "Transcash · PCS Mastercard",
    desc: "Échangez vos coupons Transcash ou PCS Mastercard contre du FCFA Mobile Money. Taux 440 FCFA/€.",
    color: "#1B5E20", href: "/services/coupons",
    tags: ["Transcash", "PCS", "440 FCFA/€"],
  },
  {
    image: IMAGES.ubaCard, title: "UBA Cameroun",
    sub: "Achat carte & recharge segment I, II, III",
    desc: "Obtenez votre carte UBA Cameroun ou rechargez votre solde en quelques minutes.",
    color: "#8B0000", href: "/services/uba",
    tags: ["Segment I", "Segment II", "Segment III", "Recharge"],
  },
  {
    image: IMAGES.paypal2, title: "PayPal Europe",
    sub: "Achat & vente de solde PayPal",
    desc: "Vendez votre solde PayPal européen ou achetez du solde. Taux compétitif, transfert rapide.",
    color: "#003087", href: "/services/paypal",
    tags: ["PayPal", "700 FCFA/€", "Europe"],
  },
  {
    image: IMAGES.factures, title: "Paiement Factures",
    sub: "Canal+ · Eneo · Camwater · StarTimes",
    desc: "Payez vos factures Camerounaises via notre service — rapide et sans déplacement.",
    color: "#FF6B00", href: "/services/factures",
    tags: ["Canal+", "Eneo", "Camwater", "StarTimes"],
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">Nos Services</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Tous nos produits et services disponibles — livraison express, paiement sécurisé.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SERVICES.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex flex-col rounded-3xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{ background: "var(--bg-card)", border: `1px solid ${s.color}33` }}
          >
            {/* Image banner */}
            <div className="relative h-40 w-full">
              <Image src={s.image} alt={s.title} fill style={{ objectFit: "cover" }} unoptimized />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.7))" }} />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="font-black text-lg text-white">{s.title}</p>
                  <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{s.sub}</p>
                </div>
                <span className="text-2xl transition-transform group-hover:translate-x-1" style={{ color: "var(--gold)" }}>→</span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map(t => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ background: s.color + "18", color: s.color }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* WhatsApp CTA */}
      <div
        className="mt-12 rounded-3xl p-8 text-center"
        style={{ background: "#0D1A0F", border: "1px solid #25D36633" }}
      >
        <p className="text-xl font-black text-white mb-2">Vous ne trouvez pas ce que vous cherchez ?</p>
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Contactez-nous directement sur WhatsApp — nous pouvons traiter la plupart des demandes spéciales.
        </p>
        <a
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-white text-sm"
          style={{ background: "#25D366" }}
        >
          💬 Contactez-nous
        </a>
      </div>
    </div>
  );
}
