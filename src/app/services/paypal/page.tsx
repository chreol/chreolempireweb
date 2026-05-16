"use client";

import { useState } from "react";
import Image from "next/image";
import { PAYPAL_LIMITS, CONTACT, IMAGES } from "@/lib/services";
import Link from "next/link";

type Dir = "sell" | "buy";
const SELL_RATE = 700; // FCFA per €
const BUY_RATE  = 650; // FCFA per €

export default function PayPalPage() {
  const [dir, setDir] = useState<Dir>("sell");
  const [amount, setAmount] = useState("");

  const num = parseFloat(amount.replace(",", "."));
  const rate = dir === "sell" ? SELL_RATE : BUY_RATE;

  const result = !isNaN(num) && num > 0
    ? dir === "sell"
      ? { label: "Vous recevez", value: `${Math.round(num * rate).toLocaleString("fr-FR")} FCFA` }
      : { label: "Vous payez", value: `${Math.round(num * rate).toLocaleString("fr-FR")} FCFA` }
    : null;

  function buildWA() {
    const msg = dir === "sell"
      ? `Bonjour, je veux vendre ${amount}€ PayPal → recevoir ${Math.round(num * rate).toLocaleString("fr-FR")} FCFA`
      : `Bonjour, je veux acheter ${amount}€ de solde PayPal → payer ${Math.round(num * rate).toLocaleString("fr-FR")} FCFA`;
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        <Link href="/services" className="hover:text-white">Services</Link>
        <span>›</span>
        <span className="text-white">PayPal Europe</span>
      </div>

      {/* Hero */}
      <div className="relative h-40 rounded-3xl overflow-hidden mb-6">
        <Image src={IMAGES.paypal2} alt="PayPal" fill style={{ objectFit: "cover" }} unoptimized />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2))" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <h1 className="text-3xl font-black text-white mb-1">PayPal Europe</h1>
          <p style={{ color: "rgba(255,255,255,0.75)" }}>Achat & vente de solde PayPal — taux compétitif</p>
        </div>
      </div>

      {/* Direction */}
      <div className="flex gap-3 mb-8">
        {([
          { key: "sell", label: "💰 Je vends mon PayPal", sub: `${SELL_RATE} FCFA/€ — PayPal → FCFA` },
          { key: "buy",  label: "💳 J'achète du solde",   sub: `${BUY_RATE} FCFA/€ — FCFA → PayPal` },
        ] as const).map(d => (
          <button
            key={d.key}
            onClick={() => setDir(d.key)}
            className="flex-1 p-4 rounded-2xl text-left transition-all"
            style={{
              background: dir === d.key ? "#00308722" : "var(--bg-card)",
              border: `2px solid ${dir === d.key ? "#003087" : "var(--border)"}`,
            }}
          >
            <p className="font-black text-white text-sm">{d.label}</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-secondary)" }}>{d.sub}</p>
          </button>
        ))}
      </div>

      {/* Limits */}
      <div
        className="flex gap-4 p-4 rounded-2xl mb-6 text-sm"
        style={{ background: "#00308712", border: "1px solid #00308733" }}
      >
        <div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Minimum</p>
          <p className="font-bold text-white">
            {dir === "sell" ? `${PAYPAL_LIMITS.sell.min}€` : `${PAYPAL_LIMITS.buy.min.toLocaleString("fr-FR")} FCFA`}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Maximum</p>
          <p className="font-bold text-white">
            {dir === "sell" ? `${PAYPAL_LIMITS.sell.max}€` : `${PAYPAL_LIMITS.buy.max.toLocaleString("fr-FR")} FCFA`}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Taux</p>
          <p className="font-bold" style={{ color: "var(--gold)" }}>{rate} FCFA/€</p>
        </div>
      </div>

      {/* Input */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          Montant en €
        </p>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
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
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
          {result?.label ?? "Résultat"}
        </p>
        <p className="text-4xl font-black mb-4" style={{ color: "var(--gold)" }}>
          {result?.value ?? "—"}
        </p>

        <a
          href={buildWA()}
          target="_blank" rel="noopener noreferrer"
          className="block w-full py-4 rounded-full font-black text-white text-center text-sm transition-opacity hover:opacity-85"
          style={{ background: "#25D366" }}
        >
          💬 Démarrer la transaction sur WhatsApp
        </a>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "#00308710", border: "1px solid #00308733" }}
      >
        <p className="font-black text-white mb-3">ℹ️ Informations</p>
        <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <li>✅ Compte PayPal Europe uniquement (France, Belgique, Italie…)</li>
          <li>✅ Pas de compte PayPal Cameroun ni USA</li>
          <li>✅ Transfert reçu sur Mobile Money (MTN/Orange)</li>
          <li>✅ Transaction traitée en 15–30 min</li>
        </ul>
      </div>
    </div>
  );
}
