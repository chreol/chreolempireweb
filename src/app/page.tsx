"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES, SOCIAL_LINKS } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import { useLanguage } from "@/contexts/LanguageContext";

const SERVICE_DATA = [
  { image: IMAGES.psn,        tk: "svc.giftcards", color: "#C9A84C", href: "/services/cartes-cadeaux", emoji: "🎮" },
  { image: IMAGES.cryptoMomo, tk: "svc.crypto",    color: "#26A17B", href: "/services/crypto",          emoji: "₿" },
  { image: IMAGES.coupons,    tk: "svc.coupons",   color: "#25D366", href: "/services/coupons",         emoji: "🎫" },
  { image: IMAGES.ubaCard,    tk: "svc.uba",       color: "#8B0000", href: "/services/uba",             emoji: "💳" },
  { image: IMAGES.paypal2,    tk: "svc.paypal",    color: "#003087", href: "/services/paypal",          emoji: "💸" },
  { image: IMAGES.factures,   tk: "svc.factures",  color: "#FF6B00", href: "/services/factures",        emoji: "🔄" },
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
    name: "Jean-Paul M.", city: "Douala", rating: 5, service: "PSN",
    text: "Code PSN reçu en 20 minutes. Très professionnel et prix compétitif. Je recommande sans hésiter !",
    date: "il y a 2 jours",
  },
  {
    name: "Aminata K.", city: "Yaoundé", rating: 5, service: "Crypto",
    text: "J'ai échangé 100 USDT contre FCFA, taux honnête et virement MTN MoMo instantané. Merci Chreol Empire !",
    date: "il y a 1 semaine",
  },
  {
    name: "Patrick N.", city: "Bafoussam", rating: 5, service: "Coupons",
    text: "Coupon Transcash échangé sans aucun problème. L'équipe répond très vite sur WhatsApp.",
    date: "il y a 3 jours",
  },
  {
    name: "Marie-Claire B.", city: "Douala", rating: 5, service: "UBA",
    text: "Rechargement de carte UBA rapide et sans complications. Service client au top, je suis très satisfaite.",
    date: "il y a 5 jours",
  },
  {
    name: "Rodrigue E.", city: "Douala", rating: 5, service: "PayPal",
    text: "Achat de solde PayPal parfait. Taux correct, livraison WhatsApp en moins de 30 min. Fiable !",
    date: "il y a 2 semaines",
  },
  {
    name: "Solange T.", city: "Limbé", rating: 5, service: "Factures",
    text: "Paiement de ma facture Eneo en moins de 15 minutes. Je commande ici chaque mois maintenant !",
    date: "il y a 4 jours",
  },
];

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
                  style={{ color: s.color }}>{t("services.btn.order")}</span>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white">{t("section.how")}</h2>
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

      {/* ── AVIS CLIENTS ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>Témoignages</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t("section.reviews")}</h2>
          {/* Google rating badge */}
          <a href={SOCIAL_LINKS.googleBusiness} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-border)", border: "1px solid var(--border)" }}>
            <span className="font-black text-sm" style={{ color: "#EA4335" }}>G</span>
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ))}
            </div>
            <span className="font-black text-sm" style={{ color: "var(--text-primary)" }}>4.9</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>· Voir sur Google</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {visibleIdx.map((avisI, slot) => {
              const a = AVIS[avisI];
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
                  <div className="flex items-center gap-0.5">
                    {[...Array(a.rating)].map((_, j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
                    &ldquo;{a.text}&rdquo;
                  </p>
                  <div className="pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
                    <div>
                      <p className="text-sm font-black" style={{ color: "var(--text-primary)" }}>{a.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.city} · {a.date}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-bold"
                      style={{ background: "var(--bg-elevated)", color: "var(--gold)" }}>
                      {a.service}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ── PAYMENT METHODS ── */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <h2 className="text-2xl font-black mb-6 text-white text-center">{t("section.payment")}</h2>
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
