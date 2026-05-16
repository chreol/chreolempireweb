import Link from "next/link";
import Image from "next/image";
import { CONTACT, IMAGES } from "@/lib/services";

const PROMOS = [
  { image: IMAGES.psn,      title: "PSN 10€",           sub: "7 500 FCFA — Livraison immédiate",      badge: "🔥 Top vente",    color: "#003791", href: "/services/cartes-cadeaux" },
  { image: IMAGES.crypto,   title: "USDT — 580 FCFA/$", sub: "Vente rapide, paiement Mobile Money",   badge: "📈 Taux du jour",  color: "#26A17B", href: "/services/crypto" },
  { image: IMAGES.paypal,   title: "PayPal — 700 FCFA/€",sub:"Achetez votre solde PayPal Europe",    badge: "✅ Disponible",    color: "#003087", href: "/services/paypal" },
  { image: IMAGES.pcs,      title: "PCS — 440 FCFA/€",  sub: "Échange coupon PCS instantané",         badge: "⚡ Express",       color: "#C9A84C", href: "/services/coupons" },
  { image: IMAGES.ubaCard,  title: "Recharge UBA",       sub: "Carte UBA Segment I, II, III",         badge: "🆕 Service",       color: "#8B0000", href: "/services/uba" },
];

const SERVICES = [
  { image: IMAGES.psn,      title: "Cartes Cadeaux",       sub: "PSN · iTunes · Roblox · Steam · Razer · Nintendo",  color: "#C9A84C", href: "/services/cartes-cadeaux" },
  { image: IMAGES.cryptoMomo,title: "Crypto & MoMo",       sub: "USDT · BTC · TRX — 0% commission",                 color: "#26A17B", href: "/services/crypto" },
  { image: IMAGES.coupons,   title: "Coupons",              sub: "Transcash · PCS Mastercard",                        color: "#1B5E20", href: "/services/coupons" },
  { image: IMAGES.ubaCard,   title: "UBA Cameroun",         sub: "Achat carte & recharge",                            color: "#8B0000", href: "/services/uba" },
  { image: IMAGES.paypal2,   title: "PayPal Europe",        sub: "Achat & vente de solde PayPal",                     color: "#003087", href: "/services/paypal" },
  { image: IMAGES.factures,  title: "Paiement Factures",    sub: "Canal+ · Eneo · Camwater · StarTimes",             color: "#FF6B00", href: "/services/factures" },
];

const STEPS = [
  { n: "1", title: "Choisissez votre service", desc: "Parcourez notre catalogue et sélectionnez le produit." },
  { n: "2", title: "Passez votre commande",    desc: "Ajoutez au panier et commandez via WhatsApp ou Mobile Money." },
  { n: "3", title: "Paiement sécurisé",        desc: "MTN MoMo, Orange Money ou Campay — 100% sécurisé." },
  { n: "4", title: "Livraison express",        desc: "Recevez votre code ou confirmation en 15–30 min." },
];

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 max-w-6xl mx-auto">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "var(--gold)", opacity: 0.06, filter: "blur(60px)" }}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
          {/* Text */}
          <div className="flex-1">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-6"
              style={{ background: "var(--gold)", color: "#0A0A0A" }}
            >
              🛡️ Magasin officiel · Douala, Cameroun
            </span>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4 text-white">
              Vos cartes cadeaux &amp;<br />
              <span style={{ color: "var(--gold)" }}>crypto au meilleur taux</span>
            </h1>

            <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
              PSN, iTunes, Roblox, Steam, USDT, BTC, PCS, Transcash — livraison express
              15–30 min via WhatsApp. Paiement Mobile Money.
            </p>

            <div className="flex flex-col gap-2 mb-8">
              {["✅ Codes authentiques garantis", "⚡ Livraison 15–30 min", "💬 Support WhatsApp 7j/7"].map(b => (
                <span key={b} className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{b}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="px-6 py-3 rounded-full font-black text-black text-sm transition-opacity hover:opacity-85"
                style={{ background: "var(--gold)" }}
              >
                Voir le catalogue →
              </Link>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-black text-white text-sm transition-opacity hover:opacity-85"
                style={{ background: "#25D366" }}
              >
                💬 Commander sur WhatsApp
              </a>
            </div>
          </div>

          {/* Hero image grid */}
          <div className="hidden lg:grid grid-cols-2 gap-3 shrink-0">
            {[IMAGES.psn, IMAGES.crypto, IMAGES.itunes, IMAGES.roblox].map((src, i) => (
              <div
                key={i}
                className="relative w-36 h-28 rounded-2xl overflow-hidden"
                style={{ border: "1px solid var(--border)" }}
              >
                <Image src={src} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.15)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMOTIONS ── */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">
        <h2 className="text-xl font-black mb-5 text-white">Promotions du moment</h2>
        <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
          {PROMOS.map((p, i) => (
            <Link
              key={i}
              href={p.href}
              className="shrink-0 w-64 rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
              style={{ background: "var(--bg-card)", border: `1px solid ${p.color}44` }}
            >
              {/* Image */}
              <div className="relative h-36 w-full">
                <Image src={p.image} alt={p.title} fill style={{ objectFit: "cover" }} unoptimized />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${p.color}99)` }} />
                <span
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black"
                  style={{ background: "rgba(0,0,0,0.7)", color: "white" }}
                >
                  {p.badge}
                </span>
              </div>
              <div className="p-3">
                <p className="font-black text-sm text-white">{p.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>{p.sub}</p>
                <span className="text-xs font-bold mt-2 block" style={{ color: "var(--gold)" }}>Commander →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">
        <h2 className="text-xl font-black mb-5 text-white">Tous nos services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <Link
              key={i}
              href={s.href}
              className="group relative rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ border: `1px solid ${s.color}33` }}
            >
              {/* Background image */}
              <div className="relative h-36">
                <Image src={s.image} alt={s.title} fill style={{ objectFit: "cover" }} unoptimized />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)" }} />
              </div>
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-black text-white text-sm">{s.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>{s.sub}</p>
              </div>
              <div
                className="absolute top-3 right-3 text-xl transition-transform group-hover:translate-x-0.5"
                style={{ color: "var(--gold)" }}
              >→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">
        <h2 className="text-xl font-black mb-8 text-white text-center">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(s => (
            <div key={s.n} className="flex flex-col items-center text-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl"
                style={{ background: "var(--gold)", color: "#0A0A0A" }}
              >
                {s.n}
              </div>
              <p className="font-black text-white">{s.title}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAYMENT METHODS ── */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">
        <h2 className="text-xl font-black mb-5 text-white text-center">Modes de paiement acceptés</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { image: IMAGES.mtn,    label: "MTN MoMo" },
            { image: IMAGES.orange, label: "Orange Money" },
          ].map(p => (
            <div
              key={p.label}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                <Image src={p.image} alt={p.label} fill style={{ objectFit: "cover" }} unoptimized />
              </div>
              <span className="font-bold text-white text-sm">{p.label}</span>
            </div>
          ))}
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-2xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <span className="text-2xl">💬</span>
            <span className="font-bold text-white text-sm">WhatsApp</span>
          </div>
        </div>
      </section>

      {/* ── CTA WHATSAPP ── */}
      <section className="px-4 pb-20 max-w-6xl mx-auto">
        <div
          className="rounded-3xl p-8 text-center relative overflow-hidden"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 0%, #C9A84C0A 0%, transparent 70%)" }}
          />
          <p className="text-3xl mb-2">💬</p>
          <h2 className="text-2xl font-black text-white mb-2">Une question ? Commandez maintenant</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Notre équipe répond en moins de 5 min. WhatsApp disponible 7j/7.
          </p>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Bonjour Chreol Empire, je souhaite passer une commande.")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-white text-base transition-opacity hover:opacity-85"
            style={{ background: "#25D366" }}
          >
            💬 Ouvrir WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
