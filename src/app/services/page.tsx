"use client";

import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import { useLanguage } from "@/contexts/LanguageContext";

const SERVICE_DATA = [
  { image: IMAGES.psn,        tk: "svc.giftcards", emoji: "🎮", color: "#C9A84C", href: "/services/cartes-cadeaux", tags: ["PSN", "iTunes", "Roblox", "Steam", "Razer", "Nintendo"] },
  { image: IMAGES.cryptoMomo, tk: "svc.crypto",    emoji: "₿",  color: "#26A17B", href: "/services/crypto",          tags: ["USDT", "BTC", "TRX", "ETH", "MTN", "Orange"] },
  { image: IMAGES.transcash,  tk: "svc.coupons",   emoji: "🎫", color: "#25D366", href: "/services/coupons",         tags: ["Transcash", "PCS", "440 FCFA/€", "Mobile Money"] },
  { image: IMAGES.ubaCard,    tk: "svc.uba",       emoji: "💳", color: "#8B0000", href: "/services/uba",             tags: ["Segment I", "Segment II", "Segment III", "Recharge"] },
  { image: IMAGES.paypal2,    tk: "svc.paypal",    emoji: "💸", color: "#003087", href: "/services/paypal",          tags: ["PayPal", "700 FCFA/€", "Europe", "France"] },
  { image: IMAGES.factures,   tk: "svc.factures",  emoji: "🔄", color: "#FF6B00", href: "/services/factures",        tags: ["Canal+", "Eneo", "Camwater", "StarTimes", "MoMo"] },
];

const POPULAR = [
  { image: IMAGES.psn,      name: "PSN 10€",        price: "7 500 FCFA",  href: "/services/cartes-cadeaux", color: "#003791", badge: "🔥 Top vente",    prefill: "🎮 Je veux commander PSN 10€ [Europe] — 7 500 FCFA" },
  { image: IMAGES.steam,    name: "Steam 20€",       price: "14 500 FCFA", href: "/services/cartes-cadeaux", color: "#1B2838", badge: "🎮 Populaire",    prefill: "🎮 Je veux commander Steam 20€ [Europe] — 14 500 FCFA" },
  { image: IMAGES.roblox,   name: "Robux 800R",      price: "10 500 FCFA", href: "/services/cartes-cadeaux", color: "#E8232A", badge: "👾 Trending",     prefill: "🎮 Je veux commander 800 Robux — 10 500 FCFA" },
  { image: IMAGES.crypto,   name: "USDT 10$",        price: "5 800 FCFA",  href: "/services/crypto",          color: "#26A17B", badge: "₿ 0% commission", prefill: "💱 Je veux vendre 10 USDT (TRC20) — environ 5 800 FCFA" },
  { image: IMAGES.itunes,   name: "iTunes 25€",      price: "18 000 FCFA", href: "/services/cartes-cadeaux", color: "#0A84FF", badge: "🎵 Populaire",    prefill: "🎵 Je veux commander iTunes/App Store 25€ — 18 000 FCFA" },
  { image: IMAGES.paypal2,  name: "PayPal 20€",      price: "11 600 FCFA", href: "/services/paypal",          color: "#003087", badge: "💸 Express",      prefill: "💸 Je veux vendre 20€ PayPal — environ 11 600 FCFA" },
  { image: IMAGES.nintendo, name: "Nintendo 50€",    price: "34 000 FCFA", href: "/services/cartes-cadeaux", color: "#E70012", badge: "🎮 Populaire",    prefill: "🎮 Je veux commander Nintendo eShop 50€ — 34 000 FCFA" },
  { image: IMAGES.razer,    name: "Razer Gold 20€",  price: "14 500 FCFA", href: "/services/cartes-cadeaux", color: "#44D62C", badge: "⚡ Rapide",       prefill: "🎮 Je veux commander Razer Gold 20€ — 14 500 FCFA" },
];

export default function ServicesPage() {
  const { t } = useLanguage();
  const SERVICES = SERVICE_DATA.map(s => ({
    ...s,
    title: t(`${s.tk}.title`),
    sub:   t(`${s.tk}.sub`),
    desc:  t(`${s.tk}.desc`),
  }));

  return (
    <div className="overflow-x-hidden">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-8">
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>{t("services.catalogue")}</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">{t("services.h1")}</h1>
            <p className="text-base max-w-lg" style={{ color: "var(--text-secondary)" }}>
              {t("services.subtitle")}
            </p>
          </div>
          <WAPopover
            title={t("services.btn.now")}
            align="right"
            dropDown
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="" width={18} height={18} unoptimized className="shrink-0" />
            {t("services.btn.now")}
          </WAPopover>
        </div>
      </div>

      {/* ── Produits populaires ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--gold)" }}>
            {t("services.popular")}
          </p>
          <Link href="/services/cartes-cadeaux"
            className="text-xs font-bold transition-opacity hover:opacity-70"
            style={{ color: "var(--text-muted)" }}>
            {t("services.see_all")}
          </Link>
        </div>

        {/* Horizontal scroll strip */}
        <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
          {POPULAR.map((p, i) => (
            <div
              key={i}
              className="shrink-0 flex flex-col rounded-2xl overflow-hidden"
              style={{
                width: 148,
                background: "var(--bg-card)",
                border: `1px solid ${p.color}33`,
              }}
            >
              {/* Thumbnail image */}
              <Link href={p.href} className="relative block h-20 w-full shrink-0 overflow-hidden">
                <Image
                  src={p.image} alt={p.name} fill
                  style={{ objectFit: "cover" }} unoptimized
                  className="transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6))" }} />
                <span
                  className="absolute top-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: p.color, color: "#fff" }}
                >
                  {p.badge}
                </span>
              </Link>

              <div className="p-2.5 flex flex-col gap-2 flex-1">
                <Link href={p.href} className="block">
                  <p className="font-black text-white text-xs leading-tight line-clamp-1">{p.name}</p>
                  <p className="text-xs font-bold tabular-nums" style={{ color: "var(--gold)" }}>{p.price}</p>
                </Link>
                <WAPopover
                  prefill={p.prefill}
                  align="center"
                  dropDown={false}
                  className="w-full py-1.5 rounded-xl font-black text-white text-[11px] flex items-center justify-center gap-1 transition-opacity hover:opacity-85"
                  style={{ background: "#25D366" }}
                >
                  <Image src={IMAGES.whatsapp} alt="" width={11} height={11} unoptimized className="shrink-0" />
                  {t("services.btn.short")}
                </WAPopover>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-12">
        <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>
          {t("services.all")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {SERVICES.map(s => (
            <div
              key={s.href}
              className="group flex flex-col rounded-3xl overflow-hidden"
              style={{ background: "var(--bg-card)", boxShadow: `0 0 0 1px ${s.color}33` }}
            >
              {/* Image banner — clickable */}
              <Link href={s.href} className="relative h-44 w-full overflow-hidden block">
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
              </Link>

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
                <div className="flex gap-2 pt-1">
                  <Link
                    href={s.href}
                    className="flex-1 py-2.5 rounded-xl font-black text-xs flex items-center justify-center transition-opacity hover:opacity-85"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                  >
                    {t("services.btn.view")}
                  </Link>
                  <WAPopover
                    prefill={`Je souhaite utiliser le service "${s.title}" — ${s.sub}`}
                    align="right"
                    dropDown={false}
                    className="flex-1 py-2.5 rounded-xl font-black text-white text-xs flex items-center justify-center gap-1 transition-opacity hover:opacity-85"
                    style={{ background: "#25D366" }}
                  >
                    <Image src={IMAGES.whatsapp} alt="" width={13} height={13} unoptimized className="shrink-0" />
                    {t("services.btn.short")}
                  </WAPopover>
                </div>
              </div>
            </div>
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
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{t("services.cta.title")}</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              {t("services.cta.sub")}
            </p>
            <WAPopover
              title={t("services.cta.title")}
              dropDown
              align="center"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "#25D366" }}
            >
              <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
              {t("services.cta.btn")}
            </WAPopover>
          </div>
        </div>
      </div>
    </div>
  );
}
