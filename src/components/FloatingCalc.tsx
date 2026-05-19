"use client";

import { useState, useRef, useEffect } from "react";
import { track } from "@vercel/analytics";
import { PAYPAL_RATES, CRYPTO_RATES } from "@/lib/services";

const EUR_RATE  = PAYPAL_RATES.sellRate;                                // 1€  = 580 FCFA
const USD_RATE  = CRYPTO_RATES.find(c => c.id === "usdt")?.buyRate ?? 580; // 1$  = 580 FCFA

type Mode = "eur_fcfa" | "fcfa_eur" | "usd_fcfa" | "fcfa_usd";

const MODES: { key: Mode; label: string; from: string; to: string; rate: number }[] = [
  { key: "eur_fcfa",  label: "€ → FCFA",   from: "EUR",  to: "FCFA", rate: EUR_RATE },
  { key: "fcfa_eur",  label: "FCFA → €",   from: "FCFA", to: "EUR",  rate: EUR_RATE },
  { key: "usd_fcfa",  label: "$ → FCFA",   from: "USD",  to: "FCFA", rate: USD_RATE },
  { key: "fcfa_usd",  label: "FCFA → $",   from: "FCFA", to: "USD",  rate: USD_RATE },
];

export default function FloatingCalc() {
  const [open, setOpen]     = useState(false);
  const [mode, setMode]     = useState<Mode>("eur_fcfa");
  const [amount, setAmount] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = MODES.find(m => m.key === mode)!;
  const num     = parseFloat(amount) || 0;

  const toFcfa = mode === "eur_fcfa" || mode === "usd_fcfa";
  const result: string = num > 0
    ? toFcfa
      ? Math.round(num * current.rate).toLocaleString("fr-FR")
      : (num / current.rate).toFixed(2)
    : "";

  const fromLabel = current.from === "EUR" ? "€" : current.from === "USD" ? "$" : "FCFA";
  const toLabel   = current.to   === "EUR" ? "€" : current.to   === "USD" ? "$" : "FCFA";

  return (
    <div ref={ref} className="fixed sm:bottom-6 bottom-24 right-6 z-50 flex flex-col items-end gap-2">
      {/* Panel */}
      {open && (
        <div
          className="rounded-2xl p-4 w-72 shadow-2xl"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-strong)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header */}
          <p className="font-black text-xs uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>
            Calculatrice de change
          </p>

          {/* Mode grid */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {MODES.map(m => (
              <button
                key={m.key}
                onClick={() => { setMode(m.key); setAmount(""); }}
                className="py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: mode === m.key ? "var(--gold)" : "var(--bg-card)",
                  color:      mode === m.key ? "#0A0A0A"    : "var(--text-secondary)",
                  border:     `1px solid ${mode === m.key ? "transparent" : "var(--border)"}`,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="relative">
            <input
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={`Montant en ${current.from}`}
              className="w-full pl-3 pr-14 py-2.5 rounded-xl text-sm font-bold outline-none"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black"
              style={{ color: "var(--text-muted)" }}
            >
              {fromLabel}
            </span>
          </div>

          {/* Result */}
          {result ? (
            <div
              className="mt-3 p-3 rounded-xl text-center"
              style={{ background: "var(--gold-dim)", border: "1px solid var(--border-strong)" }}
            >
              <p className="text-[11px] mb-1" style={{ color: "var(--text-secondary)" }}>
                {amount} {fromLabel} =
              </p>
              <p className="text-2xl font-black" style={{ color: "var(--gold)" }}>
                {result} <span className="text-base">{toLabel}</span>
              </p>
              <p className="text-[10px] mt-1.5" style={{ color: "var(--text-muted)" }}>
                Taux indicatif · 1{current.from === "FCFA" ? toLabel : fromLabel} = {current.rate.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          ) : (
            <div
              className="mt-3 p-3 rounded-xl text-center text-xs"
              style={{ color: "var(--text-muted)", background: "var(--bg-card)" }}
            >
              Entrez un montant pour convertir
            </div>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => { if (!open) track("calc_use", { mode }); setOpen(v => !v); }}
        title="Calculatrice de change"
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: open ? "var(--gold)" : "var(--bg-elevated)",
          color:      open ? "#0A0A0A"    : "var(--gold)",
          border:     "1px solid var(--border-strong)",
          boxShadow:  "0 4px 20px rgba(0,0,0,0.35)",
        }}
        aria-label="Calculatrice de change"
      >
        {open ? "✕" : "⇄"}
      </button>
    </div>
  );
}
