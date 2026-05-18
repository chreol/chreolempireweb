"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PROMOS, type Promo } from "@/lib/promos";
import { CONTACT } from "@/lib/services";

// ── Countdown hook ────────────────────────────────────────────────────────
function useCountdown(target: string | null): string {
  const calc = useCallback(() => {
    if (!target) return "";
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return "Expiré";
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [target]);

  const [display, setDisplay] = useState(calc);

  useEffect(() => {
    if (!target) return;
    setDisplay(calc());
    const id = setInterval(() => setDisplay(calc()), 1000);
    return () => clearInterval(id);
  }, [target, calc]);

  return display;
}

// ── Promo card ────────────────────────────────────────────────────────────
function PromoCard({ promo }: { promo: Promo }) {
  const countdown = useCountdown(promo.expiresAt);
  const expired   = countdown === "Expiré";
  const hasTimer  = promo.expiresAt !== null;
  const isSoldOut = promo.remaining !== null && promo.remaining === 0;

  const pctFill = promo.remaining !== null && promo.maxQty !== null
    ? (promo.remaining / promo.maxQty) * 100
    : null;

  const isBonus = promo.discountPct === 0;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${expired || isSoldOut ? "var(--border)" : "var(--border-strong)"}`,
        opacity: expired || isSoldOut ? 0.55 : 1,
      }}
    >
      {/* Top band */}
      <div className="flex items-center justify-between px-4 py-2"
        style={{ background: `${promo.badgeColor}18`, borderBottom: `1px solid ${promo.badgeColor}30` }}>
        <span className="text-xs font-black" style={{ color: promo.badgeColor }}>
          {promo.badge}
        </span>
        {hasTimer && !expired && (
          <span className="text-xs font-black tabular-nums" style={{ color: promo.badgeColor }}>
            ⏱ {countdown}
          </span>
        )}
        {expired && <span className="text-xs font-bold text-red-400">Offre terminée</span>}
        {isSoldOut && <span className="text-xs font-bold text-red-400">Épuisé</span>}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl shrink-0">{promo.emoji}</span>
          <div>
            <h2 className="font-black text-white text-base leading-tight">{promo.title}</h2>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {promo.description}
            </p>
          </div>
        </div>

        {/* Price */}
        {isBonus ? (
          <div className="mb-4">
            <span className="text-2xl font-black" style={{ color: promo.badgeColor }}>
              {promo.promoPrice.toLocaleString("fr-FR")} {promo.currency}/unité
            </span>
            <span className="text-xs ml-2 line-through" style={{ color: "var(--text-muted)" }}>
              {promo.originalPrice.toLocaleString("fr-FR")} {promo.currency} habituellement
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-black" style={{ color: "var(--gold)" }}>
              {promo.promoPrice.toLocaleString("fr-FR")} {promo.currency}
            </span>
            <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>
              {promo.originalPrice.toLocaleString("fr-FR")}
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full"
              style={{ background: "#10B981", color: "white" }}>
              -{promo.discountPct}%
            </span>
          </div>
        )}

        {/* Stock bar */}
        {pctFill !== null && promo.remaining !== null && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Stock restant</span>
              <span className="text-[10px] font-bold" style={{ color: pctFill < 30 ? "#EF4444" : "var(--text-secondary)" }}>
                {promo.remaining} / {promo.maxQty}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${pctFill}%`,
                  background: pctFill < 30 ? "#EF4444" : "#10B981",
                }} />
            </div>
            {pctFill < 30 && !isSoldOut && (
              <p className="text-[10px] font-bold mt-1" style={{ color: "#EF4444" }}>
                ⚠ Plus que {promo.remaining} disponible{promo.remaining > 1 ? "s" : ""} !
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        {!expired && !isSoldOut ? (
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(promo.whatsappPrefill)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm text-white transition-opacity hover:opacity-85"
            style={{ background: "#25D366" }}
          >
            💬 Profiter de l&apos;offre
          </a>
        ) : (
          <Link href={`/services/${promo.service}`}
            className="flex items-center justify-center w-full py-3 rounded-xl font-black text-sm transition-opacity hover:opacity-75"
            style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            Voir le service →
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function PromoPage() {
  const activePromos = PROMOS.filter(p => {
    const expired = p.expiresAt ? new Date(p.expiresAt) < new Date() : false;
    const soldOut = p.remaining !== null && p.remaining === 0;
    return !expired && !soldOut;
  });
  const pastPromos = PROMOS.filter(p => !activePromos.includes(p));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Offres spéciales</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black mb-3"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {activePromos.length} offre{activePromos.length > 1 ? "s" : ""} active{activePromos.length > 1 ? "s" : ""}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
          Offres spéciales<br />
          <span style={{ color: "var(--gold)" }}>& promotions du moment</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Taux bonifiés, packs exclusifs et réductions flash. Disponibles pour une durée ou quantité limitée — profitez-en avant la fin.
        </p>
      </div>

      {/* Active promos */}
      {activePromos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {activePromos.map(p => <PromoCard key={p.id} promo={p} />)}
        </div>
      ) : (
        <div className="rounded-2xl p-10 text-center mb-12"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-4xl mb-3">🔔</p>
          <p className="font-black text-white mb-1">Aucune offre active en ce moment</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            Revenez bientôt ou demandez à être notifié sur WhatsApp dès la prochaine promotion.
          </p>
          <a href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Bonjour, je voudrais être notifié de vos prochaines offres spéciales.")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black text-white"
            style={{ background: "#25D366" }}>
            💬 M&apos;alerter sur WhatsApp
          </a>
        </div>
      )}

      {/* Expired / sold-out section */}
      {pastPromos.length > 0 && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
            Offres terminées
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pastPromos.map(p => <PromoCard key={p.id} promo={p} />)}
          </div>
        </div>
      )}

      {/* Trust + CTA bottom */}
      <div className="mt-12 rounded-2xl p-6"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <p className="font-black text-white mb-1">Vous cherchez un service non affiché ici ?</p>
        <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
          Tous nos services restent disponibles aux tarifs standard, 7j/7 de 7h à 23h.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/services"
            className="px-5 py-2.5 rounded-full text-sm font-black transition-opacity hover:opacity-85"
            style={{ background: "var(--gold)", color: "#0A0A0A" }}>
            Voir tous les services →
          </Link>
          <a href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Bonjour, j'ai une question sur vos offres.")}`}
            target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-sm font-black text-white transition-opacity hover:opacity-85"
            style={{ background: "#25D366" }}>
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
