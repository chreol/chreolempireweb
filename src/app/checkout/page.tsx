"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useRef } from "react";
import Image from "next/image";
import { CONTACT, IMAGES } from "@/lib/services";
import GoogleReviewsOptIn from "@/components/GoogleReviewsOptIn";

const PRODUCT_IMAGE: Record<string, string> = {
  psn:          IMAGES.psn,
  itunes:       IMAGES.itunes,
  robux:        IMAGES.robux,
  roblox:       IMAGES.roblox,
  steam:        IMAGES.steam,
  nintendo:     IMAGES.nintendo,
  google:       IMAGES.google,
  razer:        IMAGES.razer,
  crypto:       IMAGES.crypto,
  usdt:         IMAGES.crypto,
  btc:          IMAGES.crypto,
  paypal:       IMAGES.paypal,
  "paypal-sell": IMAGES.paypal2,
  coupons:      IMAGES.coupons,
  pcs:          IMAGES.pcs,
  transcash:    IMAGES.transcash,
  uba:          IMAGES.uba,
  factures:     IMAGES.factures,
};

const OPERATORS = [
  {
    id:           "orange" as const,
    label:        "Orange Money",
    color:        "#FF6600",
    merchant:     "692251299",
    merchantName: "Ets Tagny",
    type:         "Transfert UV",
    ussdFn:       (amount: number) => `#150*14*518554*692251299*${amount}#`,
    image:        IMAGES.orange,
  },
  {
    id:           "mtn" as const,
    label:        "MTN MoMo",
    color:        "#FFC107",
    merchant:     "672416141",
    merchantName: "ETS Content",
    type:         "Flotte",
    ussdFn:       (amount: number) => `*126*14*672416141*${amount}#`,
    image:        IMAGES.mtn,
  },
];

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();

  const label    = params.get("label")  ?? "Commande Chreol Empire";
  const amountRaw = params.get("amount") ?? "0";
  const product  = params.get("product") ?? "";
  const service  = params.get("service") ?? product;
  const amount   = parseInt(amountRaw, 10);

  const [step, setStep]             = useState<"choose" | "ussd">("choose");
  const [selectedOp, setSelectedOp] = useState<"orange" | "mtn" | null>(null);
  const [email, setEmail]           = useState("");
  const orderIdRef                  = useRef(`CE-${Date.now()}`);
  const opConfig = OPERATORS.find(o => o.id === selectedOp);

  function buildWAMsg() {
    const op = opConfig?.label ?? "Mobile Money";
    return encodeURIComponent(
      `Bonjour, je souhaite commander : ${label} — ${amount.toLocaleString("fr-FR")} FCFA\nPaiement via ${op}`,
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--text-secondary)" }}
      >
        ← Retour
      </button>

      {/* Product recap */}
      <div
        className="rounded-2xl p-5 mb-6 flex items-center gap-4"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-strong)" }}
      >
        {PRODUCT_IMAGE[service] && (
          <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden relative">
            <Image src={PRODUCT_IMAGE[service]} alt={label} fill style={{ objectFit: "cover" }} unoptimized />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>Votre commande</p>
          <p className="text-sm font-black text-white truncate mb-0.5">{label}</p>
          <p className="text-2xl font-black" style={{ color: "var(--gold)" }}>
            {amount.toLocaleString("fr-FR")} <span className="text-sm font-bold">FCFA</span>
          </p>
        </div>
      </div>

      {/* ── Étape 1 : choisir opérateur ── */}
      {step === "choose" && (
        <div>
          <h1 className="text-xl font-black text-white mb-2">💳 Instructions de Paiement</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Choisissez votre opérateur pour recevoir le code USSD de paiement.
          </p>
          {/* Email optionnel pour Google Avis */}
          <div className="mb-5">
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Email (optionnel — pour recevoir un avis Google)
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {OPERATORS.map(op => (
              <button
                key={op.id}
                onClick={() => { setSelectedOp(op.id); setStep("ussd"); }}
                className="p-5 rounded-2xl flex flex-col items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.97]"
                style={{ background: "var(--bg-elevated)", border: `2px solid ${op.color}55` }}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                  <Image src={op.image} alt={op.label} fill style={{ objectFit: "cover" }} unoptimized />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black" style={{ color: op.color }}>{op.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{op.type}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Vous préférez un agent ?</p>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${buildWAMsg()}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-75"
              style={{ color: "#25D366" }}
            >
              <Image src={IMAGES.whatsapp} alt="" width={16} height={16} unoptimized />
              Commander via WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* ── Étape 2 : instructions USSD ── */}
      {step === "ussd" && opConfig && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <Image src={opConfig.image} alt={opConfig.label} fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                💳 Instructions de Paiement
              </p>
              <p className="text-base font-black" style={{ color: opConfig.color }}>
                {opConfig.label} — {opConfig.type}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {/* 1 */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ background: opConfig.color, color: "#000" }}>1</span>
              <div>
                <p className="text-sm font-bold text-white">Code Marchand</p>
                <p className="text-lg font-black tabular-nums mt-1" style={{ color: opConfig.color }}>{opConfig.merchant}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Nom : {opConfig.merchantName}</p>
              </div>
            </div>

            {/* 2 */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ background: opConfig.color, color: "#000" }}>2</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white mb-2">Composez directement</p>
                <div
                  className="rounded-xl px-4 py-3 font-mono text-base font-black break-all"
                  style={{ background: "#0A0A0A", color: opConfig.color, border: `1px solid ${opConfig.color}44` }}
                >
                  {opConfig.ussdFn(amount)}
                </div>
              </div>
            </div>

            {/* 3 */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ background: opConfig.color, color: "#000" }}>3</span>
              <div>
                <p className="text-sm font-bold text-white">Montant à régler</p>
                <p className="text-3xl font-black tabular-nums mt-1" style={{ color: opConfig.color }}>
                  {amount.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
            </div>

            {/* Alerte */}
            <div className="rounded-xl p-4 text-sm" style={{ background: "#EF444415", border: "1px solid #EF444433", color: "#FCA5A5" }}>
              ⚠️ Une fois payé, envoyez la <strong>capture d&apos;écran</strong> de confirmation sur WhatsApp pour déclencher la livraison immédiate.
            </div>
          </div>

          {/* Bouton WA */}
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${buildWAMsg()}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-black text-white text-base mb-3"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="" width={22} height={22} unoptimized />
            J&apos;ai payé — Contacter l&apos;agent WhatsApp
          </a>
          <div className="flex gap-2">
            <button
              onClick={() => setStep("choose")}
              className="flex-1 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-70"
              style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
            >
              ← Changer d&apos;opérateur
            </button>
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-70"
              style={{ color: "#EF4444", background: "#EF444415" }}
            >
              ✕ Annuler
            </button>
          </div>
        </div>
      )}

      {/* Google Customer Reviews opt-in — se déclenche à l'étape paiement */}
      {step === "ussd" && (
        <GoogleReviewsOptIn
          orderId={orderIdRef.current}
          email={email}
          deliveryCountry="CM"
        />
      )}

      {/* Trust */}
      <div className="mt-8 pt-6 flex flex-wrap items-center justify-center gap-4" style={{ borderTop: "1px solid var(--border)" }}>
        {["🔒 Paiement sécurisé", "⚡ Livraison 15–30 min", "✅ Codes garantis"].map(b => (
          <span key={b} className="text-xs" style={{ color: "var(--text-muted)" }}>{b}</span>
        ))}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
          style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
      </div>
    }>
      <CheckoutInner />
    </Suspense>
  );
}
