"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES, SOCIAL_LINKS, SERVICE_STOCK } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import { useLanguage } from "@/contexts/LanguageContext";

const SERVICE_DATA = [
  { image: IMAGES.psn,        tk: "svc.giftcards", color: "#C9A84C", href: "/services/cartes-cadeaux", stockId: "cartes-cadeaux", emoji: "🎮", price: "à partir de 7 500 FCFA" },
  { image: IMAGES.cryptoMomo, tk: "svc.crypto",    color: "#26A17B", href: "/services/crypto",          stockId: "crypto",         emoji: "₿",  price: "taux temps réel" },
  { image: IMAGES.coupons,    tk: "svc.coupons",   color: "#25D366", href: "/services/coupons",         stockId: "coupons",        emoji: "🎫", price: "450 FCFA/€" },
  { image: IMAGES.factures,   tk: "svc.transfert", color: "#FF6B00", href: "/services/transfert",      stockId: "transfert",      emoji: "💸", price: "Envoyer / recevoir" },
  { image: IMAGES.ubaCard,    tk: "svc.uba",       color: "#8B0000", href: "/services/uba",             stockId: "uba",            emoji: "💳", price: "à partir de 10 500 FCFA" },
  { image: IMAGES.paypal2,    tk: "svc.paypal",    color: "#003087", href: "/services/paypal",          stockId: "paypal",         emoji: "💸", price: "580 FCFA/€" },
  { image: IMAGES.factures,   tk: "svc.factures",  color: "#FF6B00", href: "/services/factures",        stockId: "factures",       emoji: "🔄", price: "+200 FCFA par facture" },
];

const STEPS_DATA = [
  { n: "1", tk: "step.1" },
  { n: "2", tk: "step.2" },
  { n: "3", tk: "step.3" },
  { n: "4", tk: "step.4" },
];

const STAT_DATA = [
  { value: "500+",   lk: "hero.stat.clients" },
  { value: "0%",     lk: "hero.stat.commission" },
  { value: "15 min", lk: "hero.stat.delay" },
  { value: "7j/7",   lk: "hero.stat.support" },
];

const AVIS = [
  {
    name: "Jean-Paul M.", city: "Douala",     rating: 5, service: "PSN",      source: "Google",
    color: "#003791",
    text: "Code PSN reçu en 20 minutes. Très professionnel et prix compétitif. Je recommande sans hésiter !",
    date: "il y a 2 jours",
  },
  {
    name: "Aminata K.",   city: "Yaoundé",    rating: 5, service: "Crypto",   source: "WhatsApp",
    color: "#9945FF",
    text: "J'ai échangé 100 USDT contre FCFA, taux honnête et virement MTN MoMo instantané. Merci Chreol Empire !",
    date: "il y a 1 semaine",
  },
  {
    name: "Patrick N.",   city: "Bafoussam",  rating: 5, service: "Coupons",  source: "Facebook",
    color: "#25D366",
    text: "Coupon Transcash échangé sans aucun problème. L'équipe répond très vite sur WhatsApp.",
    date: "il y a 3 jours",
  },
  {
    name: "Marie-Claire B.", city: "Douala",  rating: 5, service: "UBA",      source: "Google",
    color: "#8B0000",
    text: "Rechargement de carte UBA rapide et sans complications. Service client au top, je suis très satisfaite.",
    date: "il y a 5 jours",
  },
  {
    name: "Rodrigue E.",  city: "Douala",     rating: 5, service: "PayPal",   source: "WhatsApp",
    color: "#003087",
    text: "Achat de solde PayPal parfait. Taux correct, livraison WhatsApp en moins de 30 min. Fiable !",
    date: "il y a 2 semaines",
  },
  {
    name: "Solange T.",   city: "Limbé",      rating: 5, service: "Factures", source: "Google",
    color: "#FF6B00",
    text: "Paiement de ma facture Eneo en moins de 15 minutes. Je commande ici chaque mois maintenant !",
    date: "il y a 4 jours",
  },
  {
    name: "Kevin A.",     city: "Douala",     rating: 5, service: "PSN",      source: "Google",
    color: "#0066CC",
    text: "FIFA 25 acheté en un clic, code reçu sur WhatsApp en 15 minutes top chrono. Transaction 100% fiable.",
    date: "il y a 6 jours",
  },
  {
    name: "Christelle F.", city: "Yaoundé",  rating: 5, service: "Crypto",   source: "Facebook",
    color: "#26A17B",
    text: "J'avais peur des arnaques mais tout s'est parfaitement passé. 50 USDT convertis, paiement Orange Money immédiat.",
    date: "il y a 3 jours",
  },
  {
    name: "Hervé D.",     city: "Buea",       rating: 5, service: "Cartes",   source: "WhatsApp",
    color: "#C9A84C",
    text: "Steam 50€ pour mon frère en Europe, code valide en 25 minutes. Prix bien meilleur qu'ailleurs. Merci !",
    date: "il y a 1 semaine",
  },
  {
    name: "Sandra M.",    city: "Douala",     rating: 5, service: "PayPal",   source: "Google",
    color: "#1877F2",
    text: "Vente de mes euros PayPal, j'ai reçu mon MTN MoMo rapidement. Taux transparent, aucune mauvaise surprise.",
    date: "il y a 9 jours",
  },
  {
    name: "Blaise K.",    city: "Ngaoundéré", rating: 5, service: "Factures", source: "WhatsApp",
    color: "#229ED9",
    text: "Échange Orange vers MTN effectué en 10 minutes. Service impeccable, je reviendrai certainement.",
    date: "il y a 2 jours",
  },
  {
    name: "Nadège P.",    city: "Douala",     rating: 5, service: "Coupons",  source: "Google",
    color: "#E50914",
    text: "Coupon PCS Mastercard reconnu immédiatement. Aucun problème, service rapide et honnête. 5 étoiles mérités !",
    date: "il y a 5 jours",
  },
];

const SOURCE_ICONS: Record<string, { bg: string; label: string; icon: string; image?: string }> = {
  Google:   { bg: "#EA4335", label: "Google",   icon: "G", image: IMAGES.googleAvis },
  WhatsApp: { bg: "#25D366", label: "WhatsApp", icon: "W" },
  Facebook: { bg: "#1877F2", label: "Facebook", icon: "f" },
};

const TOTAL_AVIS = AVIS.length;

export default function HomePage() {
  const { t } = useLanguage();

  /* ── Rotating reviews ── */
  const [visibleIdx, setVisibleIdx] = useState<number[]>([0, 1, 2]);
  const [replacingSlot, setReplacingSlot] = useState<number | null>(null);

  const rotateOne = useCallback(() => {
    setVisibleIdx(prev => {
      const used = new Set(prev);
      const pool = Array.from({ length: TOTAL_AVIS }, (_, i) => i).filter(i => !used.has(i));
      if (pool.length === 0) return prev;
      const newCard = pool[Math.floor(Math.random() * pool.length)];
      const slot    = Math.floor(Math.random() * prev.length);
      setReplacingSlot(slot);
      setTimeout(() => setReplacingSlot(null), 400);
      return prev.map((v, i) => i === slot ? newCard : v);
    });
  }, []);

  useEffect(() => {
    const id = setInterval(rotateOne, 3500);
    return () => clearInterval(id);
  }, [rotateOne]);

  const SERVICES = SERVICE_DATA.map(s => ({
    ...s,
    title: t(`${s.tk}.title`),
    sub:   t(`${s.tk}.sub`),
  }));
  const STEPS = STEPS_DATA.map(s => ({
    ...s,
    title: t(`${s.tk}.title`),
    desc:  t(`${s.tk}.desc`),
  }));
  const STATS = STAT_DATA.map(s => ({ ...s, label: t(s.lk) }));

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Background photo — boutique Chreol Empire */}
        <div className="absolute inset-0 overflow-hidden">
          <Image src={IMAGES.boutique} alt="" fill style={{ objectFit: "cover", objectPosition: "center 30%" }} unoptimized priority />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.78)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.1) 60%, rgba(10,10,10,0.45) 100%)" }} />
        </div>
        {/* Glow accents */}
        <div className="absolute -top-64 -right-64 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: "var(--gold)", opacity: 0.06, filter: "blur(120px)" }} />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "#25D366", opacity: 0.045, filter: "blur(100px)" }} />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left — Text */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black mb-8"
                style={{ background: "var(--gold)", color: "#0A0A0A" }}>
                {t("hero.badge")}
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 text-white">
                <span
                  className="flex items-center gap-2 mb-3 text-sm sm:text-base font-black tracking-[0.18em] uppercase"
                  style={{ color: "var(--gold)", fontSize: "clamp(11px, 1.4vw, 16px)", opacity: 0.95 }}
                >
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-black shrink-0"
                    style={{ background: "var(--gold)", color: "#0A0A0A", letterSpacing: "0.1em" }}>
                    💳 UBA
                  </span>
                  {t("u.buy_unavailable_title")}
                </span>
                {t("hero.h1.1")}<br />
                <span style={{ color: "var(--gold)" }}>&amp; crypto</span><br />
                {t("hero.h1.3")}
              </h1>

              <p className="text-lg sm:text-xl mb-10 max-w-xl mx-auto lg:mx-0" style={{ color: "var(--text-secondary)" }}>
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/services"
                  className="flex items-center justify-center px-8 py-4 rounded-2xl font-black text-black text-base transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                  style={{ background: "var(--gold)" }}>
                  {t("hero.cta.catalog")}
                </Link>
                <WAPopover
                  dropDown
                  align="center"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-base transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                  style={{ background: "#25D366" }}
                >
                  <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
                  {t("hero.cta.wa")}
                </WAPopover>
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

            {/* Right — Image mosaic (clickable) */}
            <div className="hidden lg:flex flex-col gap-4 shrink-0 w-[440px]">
              {/* Top wide card */}
              <Link href="/services/cartes-cadeaux"
                className="relative h-48 rounded-3xl overflow-hidden block transition-transform duration-300 hover:scale-[1.02]"
                style={{ boxShadow: "var(--shadow-border)" }}>
                <Image src={IMAGES.psn} alt="PSN" fill style={{ objectFit: "cover" }}
                  className="outline outline-1 -outline-offset-1 outline-white/10" unoptimized />
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,55,145,0.6) 0%, transparent 60%)" }} />
                <span className="absolute bottom-3 left-4 text-sm font-black text-white">PSN · iTunes · Roblox</span>
              </Link>
              {/* Bottom 2 cards */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/services/crypto"
                  className="relative h-36 rounded-3xl overflow-hidden block transition-transform duration-300 hover:scale-[1.02]"
                  style={{ boxShadow: "var(--shadow-border)" }}>
                  <Image src={IMAGES.cryptoMomo} alt="Crypto" fill style={{ objectFit: "cover" }}
                    className="outline outline-1 -outline-offset-1 outline-white/10" unoptimized />
                  <div className="absolute inset-0" style={{ background: "rgba(38,161,123,0.4)" }} />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white">Crypto</span>
                </Link>
                <Link href="/services/paypal"
                  className="relative h-36 rounded-3xl overflow-hidden block transition-transform duration-300 hover:scale-[1.02]"
                  style={{ boxShadow: "var(--shadow-border)" }}>
                  <Image src={IMAGES.paypal2} alt="PayPal" fill style={{ objectFit: "cover" }}
                    className="outline outline-1 -outline-offset-1 outline-white/10" unoptimized />
                  <div className="absolute inset-0" style={{ background: "rgba(0,48,135,0.4)" }} />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white">PayPal</span>
                </Link>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white">{t("section.services")}</h2>
          </div>
          <Link href="/services" className="text-sm font-bold hidden sm:block transition-opacity hover:opacity-70"
            style={{ color: "var(--gold)" }}>Tout voir →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {SERVICES.map((s, i) => (
            <div key={i} className="group rounded-3xl overflow-hidden flex flex-col transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl"
              style={{ boxShadow: `0 0 0 1px ${s.color}33` }}>
              {/* Clickable image area */}
              <Link href={s.href} className="relative block flex-1" style={{ minHeight: 180 }}>
                <Image src={s.image} alt={s.title} fill style={{ objectFit: "cover" }}
                  className="outline outline-1 -outline-offset-1 outline-white/10 transition-transform duration-500 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)` }} />
                <div className="relative p-5 flex flex-col justify-end" style={{ minHeight: 180 }}>
                  <span className="text-3xl mb-2">{s.emoji}</span>
                  <p className="font-black text-white text-lg leading-tight">{s.title}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{s.sub}</p>
                  <span className="inline-block mt-2 text-xs font-black px-2 py-0.5 rounded-full w-fit" style={{ background: "var(--gold)", color: "#0A0A0A" }}>{s.price}</span>
                </div>
              </Link>
              {/* Action buttons */}
              <div className="flex gap-2 p-3 shrink-0" style={{ background: "var(--bg-card)", borderTop: `1px solid ${s.color}22` }}>
                <Link href={s.href}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-center transition-opacity hover:opacity-80"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  Voir →
                </Link>
                {SERVICE_STOCK[s.stockId]?.inStock !== false ? (
                  <WAPopover
                    prefill={`Bonjour, je voudrais commander : ${s.title}. Pouvez-vous m'aider ?`}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-opacity hover:opacity-80 shrink-0"
                    style={{ background: "#25D366" }}
                  >
                    <Image src={IMAGES.whatsapp} alt="Commander via WhatsApp" width={22} height={22} unoptimized />
                  </WAPopover>
                ) : (
                  <WAPopover
                    prefill={`Bonjour, je souhaite être averti dès que le service "${s.title}" sera à nouveau disponible.`}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-base transition-opacity hover:opacity-80 shrink-0"
                    style={{ background: "var(--bg-elevated)", border: "1px solid #FFC10755" }}
                  >
                    🔔
                  </WAPopover>
                )}
              </div>
            </div>
          ))}
        </div>

        <Link href="/services" className="mt-6 flex items-center justify-center sm:hidden text-sm font-bold"
          style={{ color: "var(--gold)" }}>Voir tous les services →</Link>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden" style={{ boxShadow: "var(--shadow-border)" }}>
          <Image
            src="/assets/comment_Ca_Marche.webp"
            alt=""
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            unoptimized
            className="pointer-events-none"
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.82)" }} />
          <div className="relative">
            <div className="text-center mb-10">
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>Processus</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white">{t("section.how")}</h2>
              <Link href="/comment-ca-marche" className="inline-block mt-3 text-sm font-bold transition-opacity hover:opacity-70" style={{ color: "var(--gold)" }}>
                Guide complet →
              </Link>
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
        </div>
      </section>

      {/* ── AVIS CLIENTS ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>Témoignages vérifiés</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t("section.reviews")}</h2>

          {/* Social proof bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {/* Google badge */}
            <a href={SOCIAL_LINKS.googleBusiness} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-opacity hover:opacity-80"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <Image src={IMAGES.googleAvis} alt="Google" width={20} height={20} unoptimized className="shrink-0 rounded-sm" />
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
              </div>
              <span className="font-black text-xs text-white">4.9</span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>/ 5 · 127 avis Google</span>
            </a>
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: "#25D366" }} />
              <span className="text-xs font-bold text-white">+500 clients satisfaits</span>
            </div>
            {/* Years badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <span className="text-sm">🏅</span>
              <span className="text-xs font-bold text-white">13 ans d&apos;activité</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {visibleIdx.map((avisI, slot) => {
              const a = AVIS[avisI];
              const initials = a.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
              const src = SOURCE_ICONS[a.source];
              return (
                <motion.div
                  key={`${slot}-${avisI}`}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: replacingSlot === slot ? 0.4 : 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="p-5 rounded-2xl flex flex-col gap-3"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  {/* Header: avatar + name + source */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0"
                        style={{ background: a.color }}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black truncate" style={{ color: "var(--text-primary)" }}>{a.name}</p>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0" style={{ background: "#25D36622", color: "#25D366" }}>✓</span>
                        </div>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{a.city} · {a.date}</p>
                      </div>
                    </div>
                    {/* Source badge */}
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center font-black text-white text-[11px] shrink-0"
                      style={src.image ? {} : { background: src.bg }} title={src.label}>
                      {src.image
                        ? <Image src={src.image} alt={src.label} width={24} height={24} unoptimized className="w-full h-full object-cover" />
                        : src.icon}
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(a.rating)].map((_, j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
                    &ldquo;{a.text}&rdquo;
                  </p>

                  {/* Service badge */}
                  <div className="pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-bold"
                      style={{ background: "var(--bg-elevated)", color: "var(--gold)" }}>
                      {a.service}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Voir tous les avis — 3 plateformes */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Google */}
          <a href={SOCIAL_LINKS.googleReview} target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "var(--bg-card)", border: "1px solid #EA433530" }}>
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <Image src={IMAGES.googleAvis} alt="Google" width={48} height={48} unoptimized className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-sm">Google</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
                <span className="text-[11px] font-black text-white ml-1">4.9</span>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>· 127 avis</span>
              </div>
            </div>
            <span className="text-xs font-bold shrink-0 transition-colors group-hover:text-white" style={{ color: "var(--text-muted)" }}>→</span>
          </a>

          {/* BusinessList */}
          <a href={SOCIAL_LINKS.businesslist} target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "var(--bg-card)", border: "1px solid #2563EB30" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xl shrink-0"
              style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)" }}>
              B
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-sm">BusinessList</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
                <span className="text-[11px] font-black text-white ml-1">5.0</span>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>· 48 avis</span>
              </div>
            </div>
            <span className="text-xs font-bold shrink-0 transition-colors group-hover:text-white" style={{ color: "var(--text-muted)" }}>→</span>
          </a>

          {/* Trustpilot */}
          <a href={SOCIAL_LINKS.trustpilot} target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "var(--bg-card)", border: "1px solid #00B67A30" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xl shrink-0"
              style={{ background: "linear-gradient(135deg, #00B67A 0%, #007B52 100%)" }}>
              ★
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-sm">Trustpilot</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill="#00B67A"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
                <span className="text-[11px] font-black text-white ml-1">4.8</span>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>· 35 avis</span>
              </div>
            </div>
            <span className="text-xs font-bold shrink-0 transition-colors group-hover:text-white" style={{ color: "var(--text-muted)" }}>→</span>
          </a>
        </div>
      </section>

      {/* ── PAYMENT METHODS ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h2 className="text-2xl font-black text-white text-center">{t("section.payment")}</h2>
          <Link href="/paiement" className="text-xs font-bold transition-opacity hover:opacity-70" style={{ color: "var(--gold)" }}>Voir tous →</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { image: IMAGES.mtn,      label: "MTN MoMo",    sub: "Mobile Money" },
            { image: IMAGES.orange,   label: "Orange Money", sub: "Mobile Money" },
            { image: IMAGES.whatsapp, label: "WhatsApp",     sub: "Paiement direct" },
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
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🔒", title: "Paiement 100% sécurisé", sub: "MTN MoMo · Orange Money · Express Union" },
            { icon: "✅", title: "Satisfait ou remboursé", sub: "Code défectueux ? Remplacé sans discussion." },
            { icon: "🏅", title: "Codes authentiques garantis", sub: "Sources officielles · Depuis 2012" },
          ].map(b => (
            <div key={b.title} className="flex items-center gap-4 p-5 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <span className="text-3xl shrink-0">{b.icon}</span>
              <div>
                <p className="font-black text-white text-sm">{b.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA WHATSAPP ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center"
          style={{ boxShadow: "var(--shadow-border)" }}>
          {/* Banner background */}
          <div className="absolute inset-0">
            <Image src={IMAGES.banner} alt="" fill style={{ objectFit: "cover", objectPosition: "center" }} unoptimized />
            <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.72)" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.18) 0%, transparent 60%)" }} />
          </div>
          <div className="relative">
            <p className="text-4xl mb-4">💬</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              {t("section.cta.title")}
            </h2>
            <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
              {t("section.cta.sub")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WAPopover
                prefill="Je souhaite passer une commande."
                dropDown
                align="center"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-base transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                style={{ background: "#25D366" }}
              >
                <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
                Ouvrir WhatsApp
              </WAPopover>
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
