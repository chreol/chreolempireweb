import Link from "next/link";
import Image from "next/image";
import { CONTACT, IMAGES } from "@/lib/services";

const SERVICES = [
  { image: IMAGES.psn,       title: "Cartes Cadeaux",    sub: "PSN · iTunes · Roblox · Steam · Razer · Nintendo", color: "#C9A84C", href: "/services/cartes-cadeaux", emoji: "🎮" },
  { image: IMAGES.cryptoMomo,title: "Crypto & MoMo",     sub: "USDT · BTC · TRX · ETH — 0% commission",           color: "#26A17B", href: "/services/crypto",          emoji: "₿" },
  { image: IMAGES.coupons,   title: "Coupons",           sub: "Transcash · PCS Mastercard",                        color: "#25D366", href: "/services/coupons",         emoji: "🎫" },
  { image: IMAGES.ubaCard,   title: "UBA Cameroun",      sub: "Achat carte & recharge",                            color: "#8B0000", href: "/services/uba",             emoji: "💳" },
  { image: IMAGES.paypal2,   title: "PayPal Europe",     sub: "Achat & vente de solde PayPal",                     color: "#003087", href: "/services/paypal",          emoji: "💸" },
  { image: IMAGES.factures,  title: "Factures & MoMo",   sub: "Canal+ · Eneo · Camwater · Échange MoMo",           color: "#FF6B00", href: "/services/factures",        emoji: "🔄" },
];

const STEPS = [
  { n: "1", title: "Choisissez",    desc: "Parcourez notre catalogue et sélectionnez votre service." },
  { n: "2", title: "Commandez",     desc: "Ajoutez au panier ou envoyez via WhatsApp en 30 secondes." },
  { n: "3", title: "Payez",         desc: "MTN MoMo, Orange Money ou Campay — 100% sécurisé." },
  { n: "4", title: "Recevez",       desc: "Votre code ou virement en 15–30 min, garanti." },
];

const STATS = [
  { value: "500+",   label: "Clients satisfaits" },
  { value: "0%",     label: "Commission crypto" },
  { value: "15 min", label: "Délai moyen" },
  { value: "7j/7",   label: "Support WhatsApp" },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: "var(--bg-primary)" }} />
        <div className="absolute -top-64 -right-64 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: "var(--gold)", opacity: 0.045, filter: "blur(120px)" }} />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "#25D366", opacity: 0.035, filter: "blur(100px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "var(--gold)", opacity: 0.02, filter: "blur(80px)" }} />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left — Text */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black mb-8"
                style={{ background: "var(--gold)", color: "#0A0A0A" }}>
                🛡️ Magasin officiel · Douala, Cameroun
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 text-white">
                Cartes cadeaux<br />
                <span style={{ color: "var(--gold)" }}>&amp; crypto</span><br />
                au meilleur taux
              </h1>

              <p className="text-lg sm:text-xl mb-10 max-w-xl mx-auto lg:mx-0" style={{ color: "var(--text-secondary)" }}>
                PSN, iTunes, Roblox, USDT, BTC, PCS, Transcash — livraison express 15–30 min via WhatsApp. Paiement Mobile Money.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/services"
                  className="px-8 py-4 rounded-2xl font-black text-black text-base transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96] text-center"
                  style={{ background: "var(--gold)" }}>
                  Voir le catalogue →
                </Link>
                <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl font-black text-white text-base transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96] text-center"
                  style={{ background: "#25D366" }}>
                  <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
                  Commander sur WhatsApp
                </a>
              </div>

              {/* Stats inline */}
              <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
                {STATS.map(s => (
                  <div key={s.label}>
                    <p className="text-2xl font-black tabular-nums" style={{ color: "var(--gold)" }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Image mosaic */}
            <div className="hidden lg:flex flex-col gap-4 shrink-0 w-[440px]">
              {/* Top wide card */}
              <div className="relative h-48 rounded-3xl overflow-hidden" style={{ boxShadow: "var(--shadow-border)" }}>
                <Image src={IMAGES.psn} alt="PSN" fill style={{ objectFit: "cover" }}
                  className="outline outline-1 -outline-offset-1 outline-white/10" unoptimized />
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,55,145,0.6) 0%, transparent 60%)" }} />
                <span className="absolute bottom-3 left-4 text-sm font-black text-white">PSN · iTunes · Roblox</span>
              </div>
              {/* Bottom 2 cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-36 rounded-3xl overflow-hidden" style={{ boxShadow: "var(--shadow-border)" }}>
                  <Image src={IMAGES.cryptoMomo} alt="Crypto" fill style={{ objectFit: "cover" }}
                    className="outline outline-1 -outline-offset-1 outline-white/10" unoptimized />
                  <div className="absolute inset-0" style={{ background: "rgba(38,161,123,0.4)" }} />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white">Crypto</span>
                </div>
                <div className="relative h-36 rounded-3xl overflow-hidden" style={{ boxShadow: "var(--shadow-border)" }}>
                  <Image src={IMAGES.paypal2} alt="PayPal" fill style={{ objectFit: "cover" }}
                    className="outline outline-1 -outline-offset-1 outline-white/10" unoptimized />
                  <div className="absolute inset-0" style={{ background: "rgba(0,48,135,0.4)" }} />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>Catalogue</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Tous nos services</h2>
          </div>
          <Link href="/services" className="text-sm font-bold hidden sm:block transition-opacity hover:opacity-70"
            style={{ color: "var(--gold)" }}>Tout voir →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {SERVICES.map((s, i) => (
            <Link key={i} href={s.href}
              className="group relative rounded-3xl overflow-hidden transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
              style={{ boxShadow: `0 0 0 1px ${s.color}33`, minHeight: 200 }}>
              <div className="absolute inset-0">
                <Image src={s.image} alt={s.title} fill style={{ objectFit: "cover" }}
                  className="outline outline-1 -outline-offset-1 outline-white/10 transition-transform duration-500 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)` }} />
              </div>
              <div className="relative h-full p-5 flex flex-col justify-end" style={{ minHeight: 200 }}>
                <span className="text-3xl mb-2">{s.emoji}</span>
                <p className="font-black text-white text-lg leading-tight">{s.title}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{s.sub}</p>
                <span className="mt-3 text-xs font-black uppercase tracking-widest transition-[opacity,transform] duration-200 group-hover:translate-x-1"
                  style={{ color: s.color }}>Commander →</span>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/services" className="mt-6 flex items-center justify-center sm:hidden text-sm font-bold"
          style={{ color: "var(--gold)" }}>Voir tous les services →</Link>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-border)" }}>
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>Processus</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Comment ça marche ?</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0"
                  style={{ background: "var(--gold)", color: "#0A0A0A" }}>
                  {s.n}
                </div>
                <div>
                  <p className="font-black text-white text-base mb-1">{s.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAYMENT METHODS ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <h2 className="text-2xl font-black mb-6 text-white text-center">Modes de paiement acceptés</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { image: IMAGES.mtn,    label: "MTN MoMo",    sub: "Mobile Money" },
            { image: IMAGES.orange, label: "Orange Money", sub: "Mobile Money" },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-4 px-6 py-4 rounded-2xl"
              style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-border)" }}>
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <Image src={p.image} alt={p.label} fill style={{ objectFit: "cover" }}
                  className="outline outline-1 -outline-offset-1 outline-white/10" unoptimized />
              </div>
              <div>
                <p className="font-black text-white text-sm">{p.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.sub}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-border)" }}>
            <span className="text-3xl shrink-0">💬</span>
            <div>
              <p className="font-black text-white text-sm">WhatsApp</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Paiement direct</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA WHATSAPP ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-border)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% -20%, #C9A84C12 0%, transparent 60%)" }} />
          <div className="relative">
            <p className="text-4xl mb-4">💬</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Prêt à commander ?
            </h2>
            <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Notre équipe répond en moins de 5 min. WhatsApp disponible 7j/7, de 7h à 23h.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Bonjour Chreol Empire, je souhaite passer une commande.")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-base transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                style={{ background: "#25D366" }}>
                <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
                Ouvrir WhatsApp
              </a>
              <Link href="/services"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", boxShadow: "var(--shadow-border)" }}>
                Voir le catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
