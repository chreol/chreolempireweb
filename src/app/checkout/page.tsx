"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { CONTACT } from "@/lib/services";

// ── Cameroonian prefix → operator detection ───────────────────────────────
type Operator = "orange" | "mtn";

function detectOperator(phone: string): Operator | null {
  if (phone.length < 2) return null;
  const p2 = phone.slice(0, 2);
  if (p2 === "69") return "orange";
  if (p2 === "67" || p2 === "68") return "mtn";
  if (phone.length >= 3) {
    const p3 = phone.slice(0, 3);
    if (["655", "656", "657", "658", "659"].includes(p3)) return "orange";
    if (["650", "651", "652", "653", "654"].includes(p3)) return "mtn";
  }
  return null;
}

function isValidPhone(phone: string, operator: Operator | null): boolean {
  return phone.length === 9 && operator !== null;
}

// ── State machine ─────────────────────────────────────────────────────────
type PayState = "idle" | "submitting" | "waiting_pin" | "success" | "error";

const PIN_TIMEOUT_SECS = 75;

// ── Operator config ───────────────────────────────────────────────────────
const OPERATORS: { id: Operator; name: string; color: string; ussd: string; pinLength: number }[] = [
  { id: "orange", name: "Orange Money", color: "#FF6600", ussd: "#150*50#",  pinLength: 4 },
  { id: "mtn",    name: "MTN MoMo",     color: "#FFC107", ussd: "*126*1#",   pinLength: 5 },
];

// ── Main checkout inner component ─────────────────────────────────────────
function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();

  const service  = params.get("service")  ?? "";
  const label    = params.get("label")    ?? "Commande Chreol Empire";
  const amountRaw = params.get("amount")  ?? "0";
  const product  = params.get("product")  ?? service;
  const amount   = parseInt(amountRaw, 10);

  const [phone,    setPhone]    = useState("");
  const [operator, setOperator] = useState<Operator | null>(null);
  const [state,    setState]    = useState<PayState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(PIN_TIMEOUT_SECS);
  const [reference, setReference] = useState("");

  // Auto-detect operator from phone digits
  useEffect(() => {
    const detected = detectOperator(phone);
    setOperator(detected);
  }, [phone]);

  // Countdown during WAITING_FOR_PIN
  useEffect(() => {
    if (state !== "waiting_pin") return;
    setCountdown(PIN_TIMEOUT_SECS);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setState("error");
          setErrorMsg("Le délai pour saisir votre PIN a expiré. Vous pouvez réessayer ou continuer via WhatsApp.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  function buildWhatsAppMsg() {
    const op = operator === "orange" ? "Orange Money" : "MTN MoMo";
    return encodeURIComponent(
      `Bonjour, je veux commander : ${label} — ${amount.toLocaleString("fr-FR")} FCFA\n` +
      `Paiement via ${op} : +237 ${phone}`,
    );
  }

  const handleSubmit = useCallback(async () => {
    if (!isValidPhone(phone, operator) || amount <= 0) return;
    setState("submitting");
    setErrorMsg("");

    const externalRef = `${product}|${phone}|${Date.now()}`;

    try {
      const res = await fetch("/api/campay-collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, operator, amount, label, externalReference: externalRef }),
      });
      const data = await res.json() as { reference?: string; status?: string; error?: string };

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Erreur serveur");
      }
      setReference(data.reference ?? "");
      setState("waiting_pin");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue. Réessayez ou contactez-nous via WhatsApp.");
    }
  }, [phone, operator, amount, label, product]);

  const opConfig = OPERATORS.find(o => o.id === operator);
  const phoneValid = isValidPhone(phone, operator);

  // ── Screens ───────────────────────────────────────────────────────────────

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-white mb-2">Paiement confirmé !</h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Votre commande <strong className="text-white">{label}</strong> est en cours de traitement.<br />
          Vous recevrez votre produit sur WhatsApp dans les <strong className="text-white">15 à 30 minutes</strong>.
        </p>
        <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>Référence : {reference}</p>
        <Link href="/"
          className="px-6 py-3 rounded-full font-black text-sm"
          style={{ background: "var(--gold)", color: "#0A0A0A" }}>
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  if (state === "waiting_pin") {
    const mins = Math.floor(countdown / 60);
    const secs = String(countdown % 60).padStart(2, "0");
    const pct  = (countdown / PIN_TIMEOUT_SECS) * 100;

    return (
      <div className="max-w-md mx-auto px-4 py-16 flex flex-col items-center text-center">
        {/* Animated phone icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: opConfig?.color ?? "var(--gold)", opacity: 0.15, position: "absolute", inset: 0 }} />
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl relative"
            style={{ border: `3px solid ${opConfig?.color ?? "var(--gold)"}` }}>
            📱
          </div>
        </div>

        <h2 className="text-xl font-black text-white mb-2">
          Consultez votre téléphone
        </h2>
        <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
          Une demande de paiement a été envoyée au <strong className="text-white">+237 {phone}</strong>.
        </p>
        <p className="text-sm mb-6 font-semibold" style={{ color: opConfig?.color ?? "var(--gold)" }}>
          Saisissez votre code PIN {opConfig?.name} ({opConfig?.pinLength} chiffres) pour valider.
        </p>

        {/* USSD fallback */}
        <div className="w-full rounded-2xl p-4 mb-6 text-left"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Pas de prompt ? Composez
          </p>
          <p className="text-lg font-black font-mono" style={{ color: opConfig?.color }}>
            {opConfig?.ussd}
          </p>
        </div>

        {/* Countdown ring */}
        <div className="relative w-24 h-24 mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle cx="50" cy="50" r="44" fill="none"
              stroke={countdown > 20 ? (opConfig?.color ?? "var(--gold)") : "#EF4444"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-black tabular-nums text-white">
              {mins > 0 ? `${mins}:${secs}` : `${countdown}`}
            </span>
          </div>
        </div>
        <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>secondes restantes pour valider</p>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Le paiement tarde ?{" "}
          <a href={`https://wa.me/${CONTACT.whatsapp}?text=${buildWhatsAppMsg()}`}
            target="_blank" rel="noopener noreferrer"
            className="font-bold underline" style={{ color: "#25D366" }}>
            Continuer avec un agent WhatsApp
          </a>
        </p>
      </div>
    );
  }

  // ── IDLE / SUBMITTING / ERROR form ────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--text-secondary)" }}>
        ← Retour
      </button>

      {/* Order recap */}
      <div className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-strong)" }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
          Votre commande
        </p>
        <p className="text-lg font-black text-white mb-0.5">{label}</p>
        <p className="text-3xl font-black" style={{ color: "var(--gold)" }}>
          {amount.toLocaleString("fr-FR")} <span className="text-base">FCFA</span>
        </p>
      </div>

      <h1 className="text-xl font-black text-white mb-6">Payer avec Mobile Money</h1>

      {/* Phone input */}
      <div className="flex flex-col gap-1 mb-5">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Numéro de téléphone
        </label>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: "var(--bg-elevated)", border: `1px solid ${operator ? (opConfig?.color ?? "var(--border)") : "var(--border)"}`, transition: "border-color 0.2s" }}>
          {/* Flag / operator badge */}
          <span className="text-lg shrink-0">
            {operator === "orange" ? "🟠" : operator === "mtn" ? "🟡" : "🏳️"}
          </span>
          <span className="text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="6X XX XX XX X"
            value={phone}
            maxLength={9}
            onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
            className="flex-1 bg-transparent text-white text-sm font-mono outline-none placeholder:text-[var(--text-muted)]"
          />
          {operator && (
            <span className="text-xs font-black shrink-0 px-2 py-0.5 rounded-full"
              style={{ background: opConfig?.color, color: "#0A0A0A" }}>
              {operator === "orange" ? "Orange" : "MTN"}
            </span>
          )}
        </div>

        {/* Validation feedback */}
        {phone.length > 0 && !operator && phone.length >= 2 && (
          <span className="text-xs font-semibold" style={{ color: "#EF4444" }}>
            Préfixe non reconnu — vérifiez votre numéro (ex: 676, 691…)
          </span>
        )}
        {phone.length > 0 && operator && !phoneValid && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {9 - phone.length} chiffre{9 - phone.length > 1 ? "s" : ""} restant{9 - phone.length > 1 ? "s" : ""}
          </span>
        )}
        {phoneValid && (
          <span className="text-xs font-semibold" style={{ color: "#10B981" }}>
            ✓ Numéro {opConfig?.name} valide
          </span>
        )}
      </div>

      {/* Operator selector (manual override) */}
      <div className="flex flex-col gap-1 mb-6">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Opérateur Mobile Money
        </label>
        <div className="grid grid-cols-2 gap-3">
          {OPERATORS.map(op => (
            <button key={op.id}
              onClick={() => setOperator(op.id)}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background: operator === op.id ? `${op.color}22` : "var(--bg-elevated)",
                border: `2px solid ${operator === op.id ? op.color : "var(--border)"}`,
              }}>
              <span className="text-2xl">{op.id === "orange" ? "🟠" : "🟡"}</span>
              <div className="text-left">
                <p className="text-xs font-black text-white">{op.name}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{op.id === "orange" ? "67x / 69x" : "67x / 68x"}</p>
              </div>
              {operator === op.id && (
                <span className="ml-auto text-sm" style={{ color: op.color }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {state === "error" && errorMsg && (
        <div className="rounded-xl p-4 mb-4"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <p className="text-sm font-semibold" style={{ color: "#FCA5A5" }}>{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!phoneValid || state === "submitting"}
        className="w-full py-4 rounded-2xl font-black text-base transition-all mb-4"
        style={{
          background: phoneValid && state !== "submitting" ? "var(--gold)" : "var(--bg-card)",
          color: phoneValid && state !== "submitting" ? "#0A0A0A" : "var(--text-muted)",
          cursor: phoneValid && state !== "submitting" ? "pointer" : "not-allowed",
        }}>
        {state === "submitting" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Envoi en cours…
          </span>
        ) : (
          `Payer ${amount.toLocaleString("fr-FR")} FCFA`
        )}
      </button>

      {/* WhatsApp fallback */}
      <div className="text-center">
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Vous préférez parler à un agent ?</p>
        <a href={`https://wa.me/${CONTACT.whatsapp}?text=${buildWhatsAppMsg()}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-75"
          style={{ color: "#25D366" }}>
          <span>💬</span> Continuer via WhatsApp
        </a>
      </div>

      {/* Trust */}
      <div className="mt-8 pt-6 flex items-center justify-center gap-4 flex-wrap"
        style={{ borderTop: "1px solid var(--border)" }}>
        {["🔒 Paiement sécurisé", "⚡ Livraison 15–30 min", "✅ Codes garantis"].map(b => (
          <span key={b} className="text-xs" style={{ color: "var(--text-muted)" }}>{b}</span>
        ))}
      </div>
    </div>
  );
}

// ── Suspense boundary required for useSearchParams in App Router ──────────
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Chargement…</p>
        </div>
      </div>
    }>
      <CheckoutInner />
    </Suspense>
  );
}
