"use client";

import { useState } from "react";
import { CRYPTO_RATES, CONTACT } from "@/lib/services";
import Link from "next/link";

type Dir = "buy" | "sell";

export default function CryptoPage() {
  const [dir, setDir] = useState<Dir>("sell");
  const [cryptoId, setCryptoId] = useState("usdt");
  const [amount, setAmount] = useState("");

  const crypto = CRYPTO_RATES.find(c => c.id === cryptoId)!;
  const rate = dir === "sell" ? crypto.sellRate : crypto.buyRate;

  const num = parseFloat(amount.replace(",", "."));
  const fcfa = !isNaN(num) && num > 0
    ? (dir === "sell" ? Math.round(num * rate) : Math.round(num))
    : null;
  const cryptoAmt = !isNaN(num) && num > 0 && dir === "buy"
    ? (num / rate).toFixed(6)
    : null;

  function buildWA() {
    const label = dir === "sell"
      ? `Je veux vendre ${amount} ${crypto.name} → recevoir ${fcfa?.toLocaleString("fr-FR")} FCFA`
      : `Je veux acheter ${crypto.name} pour ${amount} FCFA → environ ${cryptoAmt} ${crypto.name}`;
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Bonjour Chreol Empire, ${label}`)}`;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        <Link href="/services" className="hover:text-white">Services</Link>
        <span>›</span>
        <span className="text-white">Crypto & MoMo</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">Crypto & Échange Mobile Money</h1>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        Achetez ou vendez vos cryptos contre FCFA. Taux du marché, 0% commission.
      </p>

      {/* Direction */}
      <div className="flex gap-2 mb-6">
        {([
          { key: "sell", label: "💰 Je vends mes crypto", sub: "Crypto → FCFA" },
          { key: "buy",  label: "💳 J'achète des crypto",  sub: "FCFA → Crypto" },
        ] as const).map(d => (
          <button
            key={d.key}
            onClick={() => setDir(d.key)}
            className="flex-1 p-4 rounded-2xl text-left transition-all"
            style={{
              background: dir === d.key ? "#26A17B22" : "var(--bg-card)",
              border: `2px solid ${dir === d.key ? "#26A17B" : "var(--border)"}`,
            }}
          >
            <p className="font-black text-white text-sm">{d.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{d.sub}</p>
          </button>
        ))}
      </div>

      {/* Crypto selector */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Choisissez votre crypto</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CRYPTO_RATES.map(c => (
            <button
              key={c.id}
              onClick={() => setCryptoId(c.id)}
              className="p-3 rounded-2xl text-left transition-all"
              style={{
                background: cryptoId === c.id ? c.color + "22" : "var(--bg-card)",
                border: `2px solid ${cryptoId === c.id ? c.color : "var(--border)"}`,
              }}
            >
              <span className="text-2xl block mb-1">{c.icon}</span>
              <p className="text-sm font-black text-white">{c.name}</p>
              <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                {dir === "sell"
                  ? `Achat: ${c.sellRate.toLocaleString("fr-FR")} FCFA`
                  : `Vente: ${c.buyRate.toLocaleString("fr-FR")} FCFA`}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Amount input */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          {dir === "sell" ? `Montant en ${crypto.name}` : "Montant en FCFA"}
        </p>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder={dir === "sell" ? `ex: 10 ${crypto.name}` : "ex: 50000"}
          className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        />
      </div>

      {/* Result card */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
              {dir === "sell" ? "Vous recevez" : "Vous obtenez (environ)"}
            </p>
            <p className="text-3xl font-black" style={{ color: "var(--gold)" }}>
              {dir === "sell"
                ? (fcfa ? `${fcfa.toLocaleString("fr-FR")} FCFA` : "—")
                : (cryptoAmt ? `${cryptoAmt} ${crypto.name}` : "—")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Taux appliqué</p>
            <p className="font-black text-white">
              1 {crypto.name} = {rate.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
        </div>

        <a
          href={buildWA()}
          target="_blank" rel="noopener noreferrer"
          className="block w-full py-4 rounded-full font-black text-white text-center text-sm transition-opacity hover:opacity-85"
          style={{ background: "#25D366" }}
        >
          💬 Finaliser sur WhatsApp
        </a>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "0%", label: "Commission", desc: "Aucun frais caché" },
          { icon: "⚡", label: "Rapide", desc: "Transaction en 15-30 min" },
          { icon: "🔒", label: "Sécurisé", desc: "Paiement Mobile Money" },
        ].map(b => (
          <div key={b.label} className="p-4 rounded-2xl text-center" style={{ background: "var(--bg-card)" }}>
            <p className="text-2xl font-black mb-1" style={{ color: "var(--gold)" }}>{b.icon}</p>
            <p className="font-bold text-white text-sm">{b.label}</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
