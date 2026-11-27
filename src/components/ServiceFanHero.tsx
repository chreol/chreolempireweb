"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { IMAGES } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import { useLanguage } from "@/contexts/LanguageContext";

const STATS = [
  { value: "500+", lk: "hero.stat.clients" },
  { value: "0%", lk: "hero.stat.commission" },
  { value: "15 min", lk: "hero.stat.delay" },
  { value: "7j/7", lk: "hero.stat.support" },
] as const;

type FanDef = {
  id: string;
  nameKey: string;
  descKey: string;
  href: string;
  image: string;
};

const FAN_DEFS: FanDef[] = [
  { id: "cartes", nameKey: "fan.cartes.name", descKey: "fan.cartes.desc", href: "/services/cartes-cadeaux", image: IMAGES.psn },
  { id: "crypto", nameKey: "fan.crypto.name", descKey: "fan.crypto.desc", href: "/services/crypto", image: IMAGES.crypto },
  { id: "paypal", nameKey: "fan.paypal.name", descKey: "fan.paypal.desc", href: "/services/paypal", image: IMAGES.paypal2 },
  { id: "uba", nameKey: "fan.uba.name", descKey: "fan.uba.desc", href: "/services/uba", image: IMAGES.ubaCard },
  { id: "coupons", nameKey: "fan.coupons.name", descKey: "fan.coupons.desc", href: "/services/coupons", image: IMAGES.coupons },
  { id: "transfert", nameKey: "fan.transfert.name", descKey: "fan.transfert.desc", href: "/services/transfert", image: IMAGES.transfer },
];

const CORNERS = [
  { deg: -45, x: 100, y: 0 },
  { deg: 45, x: 100, y: 100 },
  { deg: 135, x: 0, y: 100 },
  { deg: 225, x: 0, y: 0 },
];

function rayToSquare(deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const t = Math.min(
    Math.abs(dx) < 1e-6 ? Infinity : 50 / Math.abs(dx),
    Math.abs(dy) < 1e-6 ? Infinity : 50 / Math.abs(dy),
  );
  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  return [clamp(50 + dx * t), clamp(50 + dy * t)];
}

function wedgeClip(start: number, end: number): string {
  const [x1, y1] = rayToSquare(start);
  const [x2, y2] = rayToSquare(end);
  const fmt = (n: number) => `${n.toFixed(2)}%`;
  const corners = CORNERS
    .filter((c) => c.deg > start + 0.2 && c.deg < end - 0.2)
    .sort((a, b) => a.deg - b.deg);
  const pts = [
    "50% 50%",
    `${fmt(x1)} ${fmt(y1)}`,
    ...corners.map((c) => `${c.x}% ${c.y}%`),
    `${fmt(x2)} ${fmt(y2)}`,
  ];
  return `polygon(${pts.join(", ")})`;
}

const SLICE = 360 / FAN_DEFS.length;
const GAP = 0.9;
const FAN_ORIGIN = -90 - SLICE / 2;

const FAN = FAN_DEFS.map((service, i) => {
  const sweepStart = FAN_ORIGIN + i * SLICE;
  const mid = sweepStart + SLICE / 2;
  const rad = (mid * Math.PI) / 180;
  return {
    ...service,
    clip: wedgeClip(sweepStart + GAP / 2, sweepStart + SLICE - GAP / 2),
    lx: 50 + Math.cos(rad) * 31,
    ly: 50 + Math.sin(rad) * 31,
  };
});

export default function ServiceFanHero() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 lg:px-12 pt-10 pb-16 lg:pt-14 lg:pb-24">
      <Image
        src={IMAGES.boutique}
        alt=""
        fill
        priority
        unoptimized
        className="object-cover"
        style={{ objectPosition: "center 30%" }}
      />
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-3xl text-center lg:mb-10">
          <span
            suppressHydrationWarning
            className="mb-5 inline-flex items-center rounded-full px-4 py-2 text-xs font-black"
            style={{ background: "var(--gold)", color: "#0A0A0A" }}
          >
            {t("hero.badge")}
          </span>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.16em]" style={{ color: "var(--gold)" }}>
            {t("u.buy_unavailable_title")}
          </p>
          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("hero.h1.1")}
            <br />
            <span style={{ color: "var(--gold)" }}>&amp; crypto</span>
            <br />
            {t("hero.h1.3")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:hidden">
          {FAN.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative flex min-h-[148px] flex-col justify-end overflow-hidden rounded-2xl p-4 transition-transform duration-200 ease-out active:scale-[0.96]"
              style={{ boxShadow: "0 0 0 1px rgba(201,168,76,0.32), 0 16px 36px rgba(0,0,0,0.35)" }}
            >
              <Image
                src={service.image}
                alt=""
                fill
                unoptimized
                className="object-cover outline outline-1 -outline-offset-1 outline-white/10"
              />
              <span className="absolute inset-0 bg-black/60 transition-[background-color] duration-200 ease-out group-hover:bg-black/30" />
              <span className="absolute inset-0 bg-[var(--gold)] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-25" />
              <span className="relative">
                <p className="text-sm font-black leading-tight text-white transition-colors duration-200 ease-out group-hover:text-[var(--gold)]">
                  {t(service.nameKey)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/80">{t(service.descKey)}</p>
              </span>
            </Link>
          ))}
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-[640px] lg:block">
          {FAN.map((service) => {
            const lit = activeId === service.id;
            return (
              <Link
                key={service.id}
                href={service.href}
                className="group absolute inset-0 block"
                style={{ clipPath: service.clip, zIndex: lit ? 2 : 1 }}
                onMouseEnter={() => setActiveId(service.id)}
                onMouseLeave={() => setActiveId((current) => (current === service.id ? null : current))}
                onFocus={() => setActiveId(service.id)}
                onBlur={() => setActiveId((current) => (current === service.id ? null : current))}
                aria-label={t(service.nameKey)}
                aria-describedby={lit ? `fan-tip-${service.id}` : undefined}
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover outline outline-1 -outline-offset-1 outline-white/10"
                />
                <span className="absolute inset-0 bg-black/60 transition-[background-color] duration-200 ease-out group-hover:bg-black/30 group-focus-visible:bg-black/30" />
                <span className="absolute inset-0 bg-[var(--gold)] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-30 group-focus-visible:opacity-30" />
              </Link>
            );
          })}

          {FAN.map((service) => {
            const lit = activeId === service.id;
            return (
              <div
                key={`${service.id}-label`}
                className="pointer-events-none absolute z-30 w-32 -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${service.lx}%`, top: `${service.ly}%` }}
              >
                <p
                  className="text-[13px] font-black uppercase leading-tight tracking-wide transition-colors duration-200 ease-out"
                  style={{
                    color: lit ? "var(--gold)" : "#FFFFFF",
                    textShadow: "0 1px 8px rgba(0,0,0,0.85)",
                  }}
                >
                  {t(service.nameKey)}
                </p>
                <AnimatePresence>
                  {lit && (
                    <motion.p
                      id={`fan-tip-${service.id}`}
                      role="tooltip"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                      className="absolute bottom-full left-1/2 mb-3 w-52 -translate-x-1/2 rounded-2xl px-3 py-2 text-left text-xs font-medium leading-relaxed normal-case tracking-normal"
                      style={{
                        background: "#0A0A0A",
                        color: "#F5F0E6",
                        boxShadow: "0 0 0 1px rgba(201,168,76,0.55), 0 16px 40px rgba(0,0,0,0.45)",
                      }}
                    >
                      {t(service.descKey)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <div
            className="absolute left-1/2 top-1/2 z-20 flex aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{
              background: "#0A0A0A",
              boxShadow: "0 0 0 1px rgba(201,168,76,0.75), 0 0 48px rgba(201,168,76,0.22)",
            }}
          >
            <Image
              src={IMAGES.logo}
              alt="CHREOL EMPIRE SARL"
              width={220}
              height={220}
              priority
              unoptimized
              className="h-auto w-[74%]"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mt-10">
          <Link
            href="/services"
            className="flex items-center justify-center rounded-2xl px-8 py-4 text-base font-black text-black transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
            style={{ background: "var(--gold)" }}
          >
            {t("hero.cta.catalog")}
          </Link>
          <WAPopover
            dropDown
            align="center"
            className="flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black text-white transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
            {t("hero.cta.wa")}
          </WAPopover>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-6">
          {STATS.map((stat) => (
            <div key={stat.lk} className="text-center">
              <p className="text-2xl font-black tabular-nums" style={{ color: "var(--gold)" }}>
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                {t(stat.lk)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
