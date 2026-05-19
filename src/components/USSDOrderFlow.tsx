"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { CONTACT, IMAGES } from "@/lib/services";

const OPERATORS = [
  {
    id:           "orange" as const,
    label:        "Orange Money",
    color:        "#FF6600",
    merchant:     "692251299",
    merchantName: "Ets Tagny",
    type:         "Transfert UV",
    ussdFn:       (amount: number) => `#150*14*518554*692251299*${amount}#`,
    pin:          4,
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
    pin:          5,
    image:        IMAGES.mtn,
  },
] as const;

interface USSDOrderFlowProps {
  /** Montant total en FCFA affiché dans les instructions USSD */
  total: number;
  /** Retourne le corps du message WhatsApp (sans la ligne opérateur) */
  getMsg: () => string;
  /** Validation avant ouverture — retourne false pour bloquer */
  onBeforeOpen?: () => boolean;
  /** Pré-remplit le prénom (optionnel) */
  prefillPrenom?: string;
  /** Titre de la modale */
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function USSDOrderFlow({
  total,
  getMsg,
  onBeforeOpen,
  prefillPrenom,
  title = "Instructions de paiement",
  className,
  style,
  children,
}: USSDOrderFlowProps) {
  const [open, setOpen]           = useState(false);
  const [step, setStep]           = useState<"choose" | "ussd">("choose");
  const [selectedOp, setSelectedOp] = useState<"orange" | "mtn" | null>(null);
  const [prenom, setPrenom]       = useState(prefillPrenom ?? "");

  const opConfig = OPERATORS.find(o => o.id === selectedOp);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleOpen() {
    if (onBeforeOpen && !onBeforeOpen()) return;
    setStep("choose");
    setSelectedOp(null);
    setPrenom(prefillPrenom ?? "");
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleChoose(id: "orange" | "mtn") {
    setSelectedOp(id);
    setStep("ussd");
  }

  function handleConfirm() {
    if (!opConfig) return;
    const p = prenom.trim() || "Client";
    track("whatsapp_open", { context: title, operator: opConfig.label });
    const body = getMsg();
    const opLine = `\nPaiement via : ${opConfig.label}`;
    const msg = encodeURIComponent(`Bonjour Chreol Empire, je m'appelle ${p}.\n\n${body}${opLine}`);
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  const isBlock = className?.includes("w-full");

  return (
    <div className={`relative ${isBlock ? "w-full" : "inline-block"}`}>
      <button type="button" onClick={handleOpen} className={className} style={style}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-sm flex flex-col gap-4 rounded-3xl p-6"
            style={{
              background: "var(--bg-elevated)",
              border: `1px solid ${opConfig ? opConfig.color + "55" : "var(--border)"}`,
              boxShadow: "0 24px 64px rgba(0,0,0,0.85)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-opacity hover:opacity-70"
              style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}
              aria-label="Fermer"
            >
              ✕
            </button>

            {/* Header */}
            <div className="pr-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                💳 {title}
              </p>
              <p className="font-black text-white text-base">
                {step === "choose"
                  ? "Choisissez votre opérateur"
                  : opConfig?.label + " — " + opConfig?.type}
              </p>
            </div>

            <div className="h-px" style={{ background: "var(--border)" }} />

            {/* ── Étape 1 : choisir l'opérateur ── */}
            {step === "choose" && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  {OPERATORS.map(op => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => handleChoose(op.id)}
                      className="p-4 rounded-2xl flex flex-col items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.97]"
                      style={{ background: "var(--bg-card)", border: `2px solid ${op.color}44` }}
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                        <Image src={op.image} alt={op.label} fill style={{ objectFit: "cover" }} unoptimized />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black" style={{ color: op.color }}>{op.label}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{op.type}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-xs py-2 rounded-xl transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  ← Annuler
                </button>
              </div>
            )}

            {/* ── Étape 2 : instructions USSD ── */}
            {step === "ussd" && opConfig && (
              <div className="flex flex-col gap-4">
                {/* Étapes numérotées */}
                <div className="flex flex-col gap-3">
                  {/* 1 — Code marchand */}
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>1</span>
                    <div>
                      <p className="text-xs font-bold text-white">Code Marchand</p>
                      <p className="text-base font-black tabular-nums mt-0.5" style={{ color: opConfig.color }}>{opConfig.merchant}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Nom : {opConfig.merchantName}</p>
                    </div>
                  </div>

                  {/* 2 — Code USSD */}
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>2</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white mb-1">Composez directement</p>
                      <div
                        className="rounded-xl px-3 py-2 font-mono text-sm font-black break-all"
                        style={{ background: "#0A0A0A", color: opConfig.color, border: `1px solid ${opConfig.color}33` }}
                      >
                        {opConfig.ussdFn(total)}
                      </div>
                    </div>
                  </div>

                  {/* 3 — Montant */}
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>3</span>
                    <div>
                      <p className="text-xs font-bold text-white">Montant à régler</p>
                      <p className="text-2xl font-black tabular-nums mt-0.5" style={{ color: opConfig.color }}>
                        {total.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>
                  </div>

                  {/* Alerte screenshot */}
                  <div
                    className="rounded-xl p-3 text-xs"
                    style={{ background: "#EF444415", border: "1px solid #EF444433", color: "#FCA5A5" }}
                  >
                    ⚠️ Une fois payé, envoyez la <strong>capture d&apos;écran</strong> de confirmation sur WhatsApp pour déclencher l&apos;envoi immédiat de votre commande.
                  </div>
                </div>

                {/* Prénom */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Votre prénom *
                  </label>
                  <input
                    type="text"
                    placeholder="Jean-Paul, Aminata…"
                    value={prenom}
                    onChange={e => setPrenom(e.target.value)}
                    maxLength={50}
                    className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  />
                </div>

                {/* Boutons */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                    style={{ background: "#25D366" }}
                  >
                    <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
                    J&apos;ai payé — Continuer sur WhatsApp
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep("choose")}
                      className="flex-1 text-xs py-2 rounded-xl transition-opacity hover:opacity-70"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ← Changer d&apos;opérateur
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 text-xs py-2 rounded-xl font-bold transition-opacity hover:opacity-70"
                      style={{ color: "#EF4444", background: "#EF444415" }}
                    >
                      ✕ Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
