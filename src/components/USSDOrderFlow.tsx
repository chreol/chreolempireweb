"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { CONTACT, IMAGES, ORANGE_MONEY_COMMERCE, MTN_MONEY, collectionFee, isAltPay } from "@/lib/services";
import IwopayDebitForm from "@/components/IwopayDebitForm";
import PayInstruction from "@/components/PayInstruction";

export interface MerchantInfo {
  merchant: string;
  merchantName: string;
  type?: string;
  ussdFn: (amount: number) => string;
  /** Numéro imprimé sous le QR code marchand */
  qrCode?: string;
  /** Image du QR code marchand (chemin public) */
  qrImage?: string;
}

type PayOp = "orange" | "mtn" | "iwopay" | "gimac" | "paypal" | "crypto";

interface OperatorConfig {
  id: PayOp;
  label: string;
  color: string;
  merchant: string;
  merchantName: string;
  type: string;
  ussdFn: (amount: number) => string;
  pin: number;
  image: string;
  qrCode?: string;
  qrImage?: string;
}

const OPERATORS: readonly OperatorConfig[] = [
  {
    id:           "orange",
    label:        "Orange Money",
    color:        "#FF6600",
    merchant:     ORANGE_MONEY_COMMERCE.merchantCode,
    merchantName: ORANGE_MONEY_COMMERCE.merchantName,
    type:         "Scan & Pay / Max it",
    ussdFn:       () => ORANGE_MONEY_COMMERCE.ussd,
    pin:          4,
    image:        IMAGES.orange,
    qrCode:       ORANGE_MONEY_COMMERCE.qrCode,
    qrImage:      ORANGE_MONEY_COMMERCE.image,
  },
  {
    id:           "mtn",
    label:        "MTN MoMo",
    color:        "#FFC107",
    merchant:     MTN_MONEY.phoneDisplay,
    merchantName: MTN_MONEY.accountName,
    type:         "Dépôt",
    ussdFn:       (amount: number) => `Déposez ${amount.toLocaleString("fr-FR")} FCFA au ${MTN_MONEY.phoneDisplay}`,
    pin:          5,
    image:        IMAGES.mtn,
  },
  {
    id:           "iwopay",
    label:        "Iwopay",
    color:        "#0EA5E9",
    merchant:     "Demande sur votre numéro",
    merchantName: "CHREOL EMPIRE",
    type:         "Encaissement",
    ussdFn:       () => "Validez la demande reçue sur votre téléphone",
    pin:          4,
    image:        "",
  },
  {
    id:           "gimac",
    label:        "Gimac",
    color:        "#006B3D",
    merchant:     MTN_MONEY.phoneDisplay,
    merchantName: MTN_MONEY.accountName,
    type:         "Transfert CEMAC",
    ussdFn:       (amount: number) => `Transfert GIMAC vers le Cameroun : ${amount.toLocaleString("fr-FR")} FCFA`,
    pin:          4,
    image:        "",
  },
  {
    id:           "paypal",
    label:        "PayPal",
    color:        "#003087",
    merchant:     CONTACT.paypalEmail,
    merchantName: "Proches et Familles",
    type:         "Proches et Familles",
    ussdFn:       () => CONTACT.paypalEmail,
    pin:          0,
    image:        IMAGES.paypal,
  },
  {
    id:           "crypto",
    label:        "Crypto",
    color:        "#26A17B",
    merchant:     "Wallet boutique",
    merchantName: "CHREOL EMPIRE",
    type:         "Wallet",
    ussdFn:       () => "Adresse selon l'actif et le réseau",
    pin:          0,
    image:        IMAGES.crypto,
  },
];

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
  /** Restreint les opérateurs proposés (ex: ["orange"] si MTN est indisponible) */
  availableOps?: readonly PayOp[];
  /** Surcharge les informations marchand (nouveau compte, QR code…) */
  merchantOverride?: Partial<Record<PayOp, MerchantInfo>>;
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
  availableOps,
  merchantOverride,
  className,
  style,
  children,
}: USSDOrderFlowProps) {
  const [open, setOpen]           = useState(false);
  const [step, setStep]           = useState<"choose" | "ussd">("choose");
  const [selectedOp, setSelectedOp] = useState<PayOp | null>(null);
  const [prenom, setPrenom]       = useState(prefillPrenom ?? "");
  const [payLine, setPayLine]     = useState("");

  const payableIds = availableOps ?? (["orange", "mtn", "iwopay", "gimac", "paypal", "crypto"] as const);
  const ops: OperatorConfig[] = OPERATORS
    .map(o => {
      const ov = merchantOverride?.[o.id];
      if (!ov) return o;
      return { ...o, ...ov, type: ov.type ?? o.type };
    });

  const opConfig = ops.find(o => o.id === selectedOp);
  const fee = opConfig ? collectionFee(total, opConfig.id) : 0;
  const due = total + fee;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleOpen() {
    if (onBeforeOpen && !onBeforeOpen()) return;
    setPrenom(prefillPrenom ?? "");
    // Un seul opérateur disponible → on saute l'étape de sélection
    if (payableIds.length === 1) {
      setSelectedOp(payableIds[0]);
      setStep("ussd");
      setOpen(true);
      return;
    }
    setStep("choose");
    setSelectedOp(null);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleChoose(id: PayOp) {
    setSelectedOp(id);
    setStep("ussd");
  }

  function handleConfirm() {
    if (!opConfig) return;
    const p = prenom.trim() || "Client";
    track("whatsapp_open", { context: title, operator: opConfig.label });
    const body = getMsg();
    const opLine = `\nPaiement via : ${opConfig.label}${payLine ? `\n${payLine}` : ""}`;
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
                <div className={`grid gap-3 ${ops.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {ops.map(op => {
                    const openOp = payableIds.includes(op.id);
                    return (
                    <button
                      key={op.id}
                      type="button"
                      disabled={!openOp}
                      onClick={() => { if (openOp) handleChoose(op.id); }}
                      className="p-4 rounded-2xl flex flex-col items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.97] disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ background: "var(--bg-card)", border: `2px solid ${op.color}44`, opacity: openOp ? 1 : 0.55 }}
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center font-black text-white" style={{ background: op.image ? undefined : op.color }}>
                        {op.image ? (
                          <Image src={op.image} alt={op.label} fill style={{ objectFit: "cover" }} unoptimized />
                        ) : "💨"}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black" style={{ color: op.color }}>{op.label}</p>
                        <p className="text-[10px] mt-0.5 font-black" style={{ color: openOp ? "#22C55E" : "var(--text-muted)" }}>
                          {openOp ? "Disponible" : "Indisponible"}
                        </p>
                      </div>
                    </button>
                    );
                  })}
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
            {step === "ussd" && opConfig && opConfig.id === "iwopay" && (
              <div className="flex flex-col gap-4">
                <IwopayDebitForm amount={due} motif={title} />
                <div className="flex gap-2">
                  {payableIds.length > 1 && (
                    <button type="button" onClick={() => setStep("choose")} className="flex-1 text-xs py-2 rounded-xl" style={{ color: "var(--text-muted)" }}>
                      ← Changer d&apos;opérateur
                    </button>
                  )}
                  <button type="button" onClick={handleClose} className="flex-1 text-xs py-2 rounded-xl font-bold" style={{ color: "#EF4444", background: "#EF444415" }}>
                    ✕ Annuler
                  </button>
                </div>
              </div>
            )}

            {step === "ussd" && opConfig && isAltPay(opConfig.id) && (
              <div className="flex flex-col gap-4">
                <PayInstruction
                  kind={opConfig.id}
                  fcfa={due}
                  direction="in"
                  onLine={setPayLine}
                />
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
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-black text-white text-sm"
                  style={{ background: "#25D366" }}
                >
                  <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
                  J&apos;ai payé — Continuer sur WhatsApp
                </button>
                <div className="flex gap-2">
                  {payableIds.length > 1 && (
                    <button type="button" onClick={() => setStep("choose")} className="flex-1 text-xs py-2 rounded-xl" style={{ color: "var(--text-muted)" }}>
                      ← Changer d&apos;opérateur
                    </button>
                  )}
                  <button type="button" onClick={handleClose} className="flex-1 text-xs py-2 rounded-xl font-bold" style={{ color: "#EF4444", background: "#EF444415" }}>
                    ✕ Annuler
                  </button>
                </div>
              </div>
            )}

            {step === "ussd" && opConfig && opConfig.id !== "iwopay" && !isAltPay(opConfig.id) && (
              <div className="flex flex-col gap-4">
                {/* Étapes numérotées */}
                <div className="flex flex-col gap-3">
                  {/* 1 — Code marchand */}
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>1</span>
                    <div>
                      <p className="text-xs font-bold text-white">{opConfig.id === "mtn" ? "Numéro de dépôt" : "Code Marchand"}</p>
                      <p className="text-base font-black tabular-nums mt-0.5" style={{ color: opConfig.color }}>{opConfig.merchant}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Nom : {opConfig.merchantName}</p>
                    </div>
                  </div>

                  {/* 2 — Code USSD */}
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>2</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white mb-1">{opConfig.id === "orange" ? "Composez directement" : "Instruction"}</p>
                      <div
                        className="rounded-xl px-3 py-2 font-mono text-sm font-black break-all"
                        style={{ background: "#0A0A0A", color: opConfig.color, border: `1px solid ${opConfig.color}33` }}
                      >
                        {opConfig.ussdFn(due)}
                      </div>
                    </div>
                  </div>

                  {/* QR marchand (optionnel) */}
                  {opConfig.qrImage && (
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>📷</span>
                      <div>
                        <p className="text-xs font-bold text-white">Ou scannez le QR code marchand</p>
                        <div className="mt-2 relative w-36 h-36 rounded-xl overflow-hidden" style={{ background: "#FFFFFF" }}>
                          <Image src={opConfig.qrImage} alt={`QR code ${opConfig.merchantName}`} fill style={{ objectFit: "contain" }} unoptimized />
                        </div>
                        {opConfig.qrCode && (
                          <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>Réf. QR : {opConfig.qrCode}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3 — Montant */}
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>3</span>
                    <div>
                      <p className="text-xs font-bold text-white">Montant à régler</p>
                      <p className="text-2xl font-black tabular-nums mt-0.5" style={{ color: opConfig.color }}>
                        {due.toLocaleString("fr-FR")} FCFA
                      </p>
                      {fee > 0 && (
                        <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                          Dont {opConfig.id === "mtn" ? "frais de retrait MTN 1,5 %" : "commission Orange Money 1 %"} : {fee.toLocaleString("fr-FR")} FCFA
                        </p>
                      )}
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
                    {payableIds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep("choose")}
                        className="flex-1 text-xs py-2 rounded-xl transition-opacity hover:opacity-70"
                        style={{ color: "var(--text-muted)" }}
                      >
                        ← Changer d&apos;opérateur
                      </button>
                    )}
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
