"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MOMO_OPERATORS, IWOPAY_METHOD, IWOPAY_SCOPE, PAYPAL_PAY_METHOD, CRYPTO_PAY_METHOD, isAltPay } from "@/lib/services";
import PayInstruction from "@/components/PayInstruction";
import { savePaymentMethod, loadPaymentMethod } from "@/lib/clientInfo";
import { useLanguage } from "@/contexts/LanguageContext";

// Les 3 opérateurs proposés en chips (les 2 principaux + Gimac CEMAC)
const SELECTABLE = [
  ...MOMO_OPERATORS.filter(o => o.id === "orange" || o.id === "mtn"),
  IWOPAY_METHOD,
  ...MOMO_OPERATORS.filter(o => o.id === "gimac"),
  PAYPAL_PAY_METHOD,
  CRYPTO_PAY_METHOD,
];

export const PAYMENT_LABELS: Record<string, string> = {
  orange: "Orange Money",
  mtn:    "MTN MoMo",
  iwopay: "Iwopay",
  gimac:  "Gimac (CEMAC)",
  paypal: "PayPal (Proches et Familles)",
  crypto: "Crypto",
};

// Retourne le libellé "Mode de paiement" envoyé à l'API selon l'id sélectionné.
// Pas de sélection → "Via WhatsApp" (fallback intelligent).
export function resolvePaymentMethod(opId: string | null): string {
  if (!opId) return "Via WhatsApp";
  return PAYMENT_LABELS[opId] ?? "Via WhatsApp";
}

interface Props {
  value: string | null;
  onChange: (opId: string | null) => void;
  /** Montant catalogue en FCFA, pour afficher le tarif du moyen choisi. */
  amount?: number;
}

export default function PaymentMethodSelector({ value, onChange, amount = 0 }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const { t } = useLanguage();

  // Pré-sélection depuis localStorage au montage (sans forcer)
  useEffect(() => {
    if (value === null) {
      const saved = loadPaymentMethod();
      if (saved && SELECTABLE.some(o => o.id === saved)) onChange(saved);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lever le flag d'hydratation après lecture du choix mémorisé
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(opId: string) {
    const next = value === opId ? null : opId; // re-clic = désélection
    onChange(next);
    if (next) savePaymentMethod(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
        {t("pms.label")} <span style={{ opacity: 0.7 }}>{t("f.optional")}</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SELECTABLE.map(o => {
          const active = value === o.id;
          return (
            <button
              type="button"
              key={o.id}
              onClick={() => handleSelect(o.id)}
              className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl transition-all active:scale-[0.97]"
              style={{
                background: active ? o.color + "22" : "var(--bg-card)",
                border: `2px solid ${active ? o.color : "var(--border)"}`,
              }}
            >
              {o.image ? (
                <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0">
                  <Image src={o.image} alt={o.name} fill style={{ objectFit: "cover" }} unoptimized />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-md flex items-center justify-center font-black text-white text-[10px] shrink-0"
                  style={{ background: o.color }}>{o.name.slice(0, 1)}</div>
              )}
              <span className="text-[11px] font-bold leading-tight"
                style={{ color: active ? o.color : "var(--text-secondary)" }}>
                {o.name}
              </span>
            </button>
          );
        })}
      </div>

      {hydrated && value === "iwopay" && (
        <p className="text-[11px] mt-1" style={{ color: "var(--text-secondary)" }}>{IWOPAY_SCOPE}</p>
      )}

      {hydrated && value && isAltPay(value) && value !== "gimac" && (
        <PayInstruction kind={value} fcfa={amount} direction="in" />
      )}

      {/* Instructions Gimac (transfert CEMAC) */}
      {hydrated && value === "gimac" && (
        <div className="rounded-2xl p-4 mt-1 text-xs" style={{ background: "#006B3D14", border: "1px solid #006B3D44" }}>
          <p className="font-black mb-2" style={{ color: "#00A65A" }}>{t("pms.gimac_title")}</p>
          <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
            {t("pms.gimac_intro")}
          </p>
          <div className="flex flex-col gap-1.5" style={{ color: "var(--text-secondary)" }}>
            {[
              t("pms.gimac_1"),
              t("pms.gimac_2"),
              t("pms.gimac_3"),
              t("pms.gimac_4"),
              t("pms.gimac_5"),
              t("pms.gimac_6"),
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5"
                  style={{ background: "#006B3D", color: "#fff" }}>{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
