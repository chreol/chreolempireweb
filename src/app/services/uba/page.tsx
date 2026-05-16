"use client";

import { useState } from "react";
import { UBA_CARDS, UBA_RECHARGE_FEES, CONTACT } from "@/lib/services";
import Link from "next/link";

type Mode = "card" | "recharge";

function calcFee(amount: number) {
  const row = UBA_RECHARGE_FEES.find(r => amount >= r.min && amount <= r.max);
  if (!row) return null;
  return row.type === "fixed" ? row.fee : Math.round(amount * row.fee / 100);
}

export default function UBAPage() {
  const [mode, setMode] = useState<Mode>("card");
  const [rechargeAmt, setRechargeAmt] = useState("");

  const num = parseFloat(rechargeAmt.replace(/\s/g, "").replace(",", "."));
  const fee = !isNaN(num) && num > 0 ? calcFee(num) : null;
  const total = fee != null ? num + fee : null;

  function buildWACard(segment: string, price: number) {
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Bonjour, je souhaite commander une carte UBA Segment ${segment} — ${price.toLocaleString("fr-FR")} FCFA`)}`;
  }

  function buildWARecharge() {
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Bonjour, je veux recharger ma carte UBA de ${num?.toLocaleString("fr-FR")} FCFA (frais: ${fee?.toLocaleString("fr-FR")} FCFA)`)}`;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        <Link href="/services" className="hover:text-white">Services</Link>
        <span>›</span>
        <span className="text-white">UBA Cameroun</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">UBA Cameroun</h1>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        Achat de carte UBA ou recharge de solde — traitement express.
      </p>

      {/* Mode */}
      <div className="flex gap-3 mb-8">
        {([
          { key: "card",    label: "🏦 Acheter une carte", sub: "Segments I, II, III" },
          { key: "recharge",label: "💳 Recharger",         sub: "Calculez vos frais" },
        ] as const).map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className="flex-1 p-4 rounded-2xl text-left transition-all"
            style={{
              background: mode === m.key ? "#8B000022" : "var(--bg-card)",
              border: `2px solid ${mode === m.key ? "#8B0000" : "var(--border)"}`,
            }}
          >
            <p className="font-black text-white text-sm">{m.label}</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-secondary)" }}>{m.sub}</p>
          </button>
        ))}
      </div>

      {mode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {UBA_CARDS.map(card => (
            <div
              key={card.segment}
              className="relative rounded-3xl p-5 flex flex-col gap-3"
              style={{
                background: "var(--bg-card)",
                border: card.popular ? "2px solid var(--gold)" : "1px solid var(--border)",
              }}
            >
              {card.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black text-black"
                  style={{ background: "var(--gold)" }}
                >
                  ⭐ Populaire
                </span>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Segment {card.segment}</p>
                <p className="text-2xl font-black" style={{ color: "var(--gold)" }}>{card.price.toLocaleString("fr-FR")} F</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Limite : {card.limit}</p>
              </div>
              <ul className="space-y-1.5">
                {card.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--gold)" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href={buildWACard(card.segment, card.price)}
                target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-full font-black text-sm text-center transition-opacity hover:opacity-85"
                style={{ background: "var(--gold)", color: "#0A0A0A" }}
              >
                Commander →
              </a>
            </div>
          ))}
        </div>
      )}

      {mode === "recharge" && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              Montant à recharger (FCFA)
            </p>
            <input
              type="number"
              value={rechargeAmt}
              onChange={e => setRechargeAmt(e.target.value)}
              placeholder="ex: 20000"
              className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            />
          </div>

          {total != null && (
            <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: "var(--text-secondary)" }}>Montant</span>
                <span className="font-bold text-white">{num.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span style={{ color: "var(--text-secondary)" }}>Frais de service</span>
                <span className="font-bold text-white">{fee!.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between text-base mb-5 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="font-black text-white">Total à payer</span>
                <span className="font-black text-2xl" style={{ color: "var(--gold)" }}>{total.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <a
                href={buildWARecharge()}
                target="_blank" rel="noopener noreferrer"
                className="block w-full py-4 rounded-full font-black text-white text-center text-sm"
                style={{ background: "#25D366" }}
              >
                💬 Procéder à la recharge via WhatsApp
              </a>
            </div>
          )}

          {/* Fee table */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <div className="px-4 py-3" style={{ background: "var(--bg-elevated)" }}>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Grille de frais</p>
            </div>
            {UBA_RECHARGE_FEES.map((row, i) => (
              <div key={i} className="flex justify-between px-4 py-3 text-sm" style={{ borderTop: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>
                  {row.min.toLocaleString("fr-FR")} – {row.max.toLocaleString("fr-FR")} FCFA
                </span>
                <span className="font-bold text-white">
                  {row.type === "fixed" ? `${row.fee.toLocaleString("fr-FR")} FCFA` : `${row.fee}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
