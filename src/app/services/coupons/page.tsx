"use client";

import { useState } from "react";
import Image from "next/image";
import { COUPON_RATES, CONTACT, IMAGES } from "@/lib/services";
import Link from "next/link";

type CouponType = "pcs" | "transcash";

export default function CouponsPage() {
  const [type, setType] = useState<CouponType>("pcs");
  const [val, setVal] = useState("");

  const r = COUPON_RATES[type];
  const num = parseFloat(val.replace(",", "."));
  const net = !isNaN(num) && num > 0
    ? type === "pcs" ? Math.round(num * (1 - r.commission / 100)) : num
    : null;
  const fcfa = net ? Math.round(net * r.rate) : null;

  function buildWA() {
    const msg = `Bonjour, je veux échanger un coupon ${type === "pcs" ? "PCS Mastercard" : "Transcash"} de ${val}€ → recevoir ${fcfa?.toLocaleString("fr-FR")} FCFA`;
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        <Link href="/services" className="hover:text-white">Services</Link>
        <span>›</span>
        <span className="text-white">Échange Coupons</span>
      </div>

      {/* Hero */}
      <div className="relative h-40 rounded-3xl overflow-hidden mb-6">
        <Image src={IMAGES.coupons} alt="Coupons" fill style={{ objectFit: "cover" }} unoptimized />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <h1 className="text-3xl font-black text-white mb-1">Échange Coupons</h1>
          <p style={{ color: "rgba(255,255,255,0.75)" }}>Transcash · PCS Mastercard — 440 FCFA/€</p>
        </div>
      </div>

      {/* Type selector */}
      <div className="flex gap-3 mb-8">
        {([
          { key: "pcs",       label: "🎟 PCS Mastercard",  sub: `${COUPON_RATES.pcs.rate} FCFA/€ (−${COUPON_RATES.pcs.commission}% commission)` },
          { key: "transcash", label: "💳 Transcash",       sub: `${COUPON_RATES.transcash.rate} FCFA/€ — 0 commission` },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            className="flex-1 p-4 rounded-2xl text-left transition-all"
            style={{
              background: type === t.key ? "#1B5E2022" : "var(--bg-card)",
              border: `2px solid ${type === t.key ? "#1B5E20" : "var(--border)"}`,
            }}
          >
            <p className="font-black text-white text-sm">{t.label}</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-secondary)" }}>{t.sub}</p>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          Valeur du coupon (€)
        </p>
        <input
          type="number"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="ex: 50"
          className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        />
      </div>

      {/* Result */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Vous recevez</p>
        <p className="text-4xl font-black mb-1" style={{ color: "var(--gold)" }}>
          {fcfa ? `${fcfa.toLocaleString("fr-FR")} FCFA` : "—"}
        </p>
        {type === "pcs" && fcfa && net && (
          <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
            ({num}€ − {r.commission}% = {net.toFixed(2)}€ × {r.rate} FCFA/€)
          </p>
        )}
        {type === "transcash" && fcfa && (
          <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
            ({num}€ × {r.rate} FCFA/€)
          </p>
        )}
        {!fcfa && <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>Entrez la valeur de votre coupon</p>}

        <a
          href={buildWA()}
          target="_blank" rel="noopener noreferrer"
          className="block w-full py-4 rounded-full font-black text-white text-center text-sm transition-opacity hover:opacity-85"
          style={{ background: "#25D366" }}
        >
          💬 Démarrer l'échange sur WhatsApp
        </a>
      </div>

      {/* Process */}
      <div className="rounded-2xl p-5" style={{ background: "#0A1A0A", border: "1px solid #1B5E2044" }}>
        <p className="font-black text-white mb-4">📋 Comment ça marche</p>
        {[
          "Entrez la valeur de votre coupon",
          "Cliquez sur 'Démarrer l'échange sur WhatsApp'",
          "Envoyez-nous le code de votre coupon",
          "Recevez votre FCFA sur Mobile Money en quelques minutes",
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-3 mb-3">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
              style={{ background: "var(--gold)", color: "#0A0A0A" }}
            >
              {i + 1}
            </span>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
