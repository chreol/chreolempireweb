"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabase";
import { IMAGES, CONTACT } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const OPERATORS = [
  {
    id:         "orange" as const,
    label:      "Orange Money",
    color:      "#FF6600",
    merchant:   "692251299",
    merchantName: "Ets Tagny",
    // montant sera injecté dynamiquement
    ussdFn:     (amount: number) => `#150*14*518554*692251299*${amount}#`,
    pin:        4,
    image:      IMAGES.orange,
    type:       "Transfert UV",
  },
  {
    id:         "mtn" as const,
    label:      "MTN MoMo",
    color:      "#FFC107",
    merchant:   "672416141",
    merchantName: "ETS Content",
    ussdFn:     (amount: number) => `*126*14*672416141*${amount}#`,
    pin:        5,
    image:      IMAGES.mtn,
    type:       "Flotte",
  },
];
type OpId = "orange" | "mtn";

export default function CartPage() {
  const { items, total, removeItem, adjustQty, clearCart } = useCart();
  const { t } = useLanguage();
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState<string | null>(null);
  const [referral, setReferral]     = useState("");
  const [emailError, setEmailError] = useState("");
  const [payStep, setPayStep]       = useState<null | "choose" | "ussd">(null);
  const [selectedOp, setSelectedOp] = useState<OpId | null>(null);

  const isSell = items.length > 0 && items.every(i => i.type === "sell");
  const summary = items.map(i => `${i.cardName} ×${i.qty} (${i.amount})`).join(", ");
  const opConfig = OPERATORS.find(o => o.id === selectedOp);

  function buildMsgPlain(opLabel?: string) {
    const lines = items.map(i => {
      if (i.details) {
        return `• ${i.cardName}\n  ${i.details}\n  Montant : ${(i.price * i.qty).toLocaleString("fr-FR")} FCFA`;
      }
      return `• ${i.cardName} — ${i.amount} × ${i.qty} = ${(i.price * i.qty).toLocaleString("fr-FR")} FCFA`;
    }).join("\n\n");
    const payLabel = isSell ? "Vente / Échange" : (opLabel ?? "Via WhatsApp");
    return `Je souhaite :\n${lines}\n\nTotal : ${total.toLocaleString("fr-FR")} FCFA\nPaiement : ${payLabel}\n\nTél : ${phone}${referral ? `\nCode parrainage : ${referral.toUpperCase()}` : ""}`;
  }

  function handleOrderClick() {
    if (!email) {
      setEmailError("Email requis pour recevoir la confirmation de commande");
      return;
    }
    setEmailError("");
    setSelectedOp(null);
    setPayStep("choose");
  }

  async function handleConfirmOrder() {
    if (!selectedOp) return;
    setLoading(true);

    const opLabel = opConfig?.label ?? "Via WhatsApp";
    track("cart_checkout", { items: items.length, total, operator: opLabel });
    const orderId = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    void supabase.from("orders").insert({
      id: orderId,
      type: "achat",
      summary,
      total,
      item_count: items.length,
      payment_method: opLabel,
      status: "pending",
      payment_status: "whatsapp",
      client_name: name || "Client web",
      client_email: email,
      client_city: "Douala",
    }).then(({ error }) => {
      if (error) console.error("[cart-wa] insert:", error.message);
    });

    void fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        clientName: name || "Client",
        clientEmail: email,
        clientPhone: phone.replace(/\D/g, "") || "000000000",
        paymentMethod: opLabel,
        sourceUrl: `${window.location.origin}/cart`,
        items: items.map(i => ({
          name: i.cardName,
          qty: i.qty,
          price: i.price,
          amount: i.amount,
          details: i.details,
        })),
        total,
      }),
    }).catch(err => console.error("[cart-wa] notify:", err));

    const waUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(buildMsgPlain(opLabel))}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    clearCart();
    setDone(orderId);
    setLoading(false);
  }

  /* ── Empty state ── */
  if (items.length === 0 && !done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="text-2xl font-black text-white mb-2">{t("cart.empty")}</h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>{t("cart.empty.desc")}</p>
        <Link href="/services" className="inline-block px-6 py-3 rounded-full font-black text-black text-sm" style={{ background: "var(--gold)" }}>
          {t("btn.see_all")}
        </Link>
      </div>
    );
  }

  /* ── Success state ── */
  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">⚡</p>
        <h1 className="text-2xl font-black text-white mb-2">
          {isSell ? t("cart.success.sell") : t("cart.success.buy")}
        </h1>
        <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
          {isSell ? t("cart.success.sell.desc") : t("cart.success.buy.desc")}
        </p>
        <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>
          {t("history.ref")} {done.slice(-8).toUpperCase()}
        </p>
        <Link href="/services" className="inline-block px-6 py-3 rounded-full font-black text-black text-sm" style={{ background: "var(--gold)" }}>
          {t("cart.continue")}
        </Link>
      </div>
    );
  }

  /* ── Cart ── */
  return (
    <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">{t("cart.title")}</h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold px-4 py-2 rounded-full transition-colors hover:text-white"
          style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
        >
          {t("cart.clear")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Left: items + total ── */}
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-sm truncate">{item.cardName}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{item.amount}</p>
                {item.type === "sell" && (
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#26A17B22", color: "#26A17B" }}>
                    Vente
                  </span>
                )}
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => adjustQty(item.id, -1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black transition-colors hover:text-white"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                >
                  −
                </button>
                <span className="font-black text-white text-sm w-4 text-center">{item.qty}</span>
                <button
                  onClick={() => adjustQty(item.id, +1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black transition-colors hover:text-white"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                >
                  +
                </button>
              </div>

              <div className="text-right shrink-0">
                <p className="font-black tabular-nums" style={{ color: "var(--gold)" }}>
                  {(item.price * item.qty).toLocaleString("fr-FR")} F
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs mt-1 transition-colors hover:text-red-400"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t("cart.remove")}
                </button>
              </div>
            </div>
          ))}

          <div
            className="flex justify-between items-center p-4 rounded-2xl"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-strong)" }}
          >
            <span className="font-black text-white">{t("cart.total")}</span>
            <span className="text-2xl font-black tabular-nums" style={{ color: "var(--gold)" }}>
              {total.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>

        {/* ── Right: checkout ── */}
        <div className="flex flex-col gap-5">

          {/* Infos client */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              {t("cart.your_info")}
            </p>
            <div className="flex flex-col gap-3">
              <input type="text"  placeholder={t("cart.name")}  value={name}  onChange={e => setName(e.target.value)}  className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
              <div>
                <input type="email" placeholder={t("cart.email")} value={email} onChange={e => { setEmail(e.target.value); if (e.target.value) setEmailError(""); }} className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none" style={{ background: "var(--bg-card)", border: `1px solid ${emailError ? "#EF4444" : "var(--border)"}` }} />
                {emailError && <p className="text-xs mt-1 px-1" style={{ color: "#EF4444" }}>{emailError}</p>}
              </div>
              <input type="tel"   placeholder={t("cart.phone")} value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
              {/* Code parrainage */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("cart.referral")}
                  value={referral}
                  onChange={e => setReferral(e.target.value.replace(/\s/g, "").toUpperCase())}
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none uppercase tracking-widest"
                  style={{ background: "var(--gold-dim)", border: "1px solid var(--gold)", color: "var(--gold)" }}
                />
                {referral && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black" style={{ color: "var(--gold)" }}>
                    🎁 −500 FCFA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info vente */}
          {isSell && (
            <div
              className="rounded-2xl p-4"
              style={{ background: "#26A17B12", border: "1px solid #26A17B33" }}
            >
              <p className="text-sm font-bold mb-1" style={{ color: "#26A17B" }}>
                {t("cart.sell_info.title")}
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {t("cart.sell_info.desc")}
              </p>
            </div>
          )}

          {/* ── Étape 1 : choix opérateur ── */}
          {!isSell && payStep === "choose" && (
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-strong)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                💳 Choisissez votre opérateur de paiement
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {OPERATORS.map(op => (
                  <button
                    key={op.id}
                    onClick={() => { setSelectedOp(op.id); setPayStep("ussd"); }}
                    className="p-4 rounded-2xl flex flex-col items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.97]"
                    style={{
                      background: selectedOp === op.id ? "var(--bg-card)" : "var(--bg-card)",
                      border: `2px solid ${op.color}44`,
                    }}
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
                onClick={() => setPayStep(null)}
                className="w-full text-xs py-2 rounded-xl transition-opacity hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                ← Annuler
              </button>
            </div>
          )}

          {/* ── Étape 2 : instructions USSD ── */}
          {!isSell && payStep === "ussd" && opConfig && (
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-elevated)", border: `2px solid ${opConfig.color}55` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  <Image src={opConfig.image} alt={opConfig.label} fill style={{ objectFit: "cover" }} unoptimized />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    💳 Instructions de Paiement
                  </p>
                  <p className="text-sm font-black" style={{ color: opConfig.color }}>{opConfig.label} — {opConfig.type}</p>
                </div>
              </div>

              {/* Étapes numérotées */}
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>1</span>
                  <div>
                    <p className="text-xs font-bold text-white">Code Marchand</p>
                    <p className="text-sm font-black tabular-nums mt-0.5" style={{ color: opConfig.color }}>{opConfig.merchant}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Nom : {opConfig.merchantName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>2</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white mb-1">Composez directement</p>
                    <div className="rounded-xl px-3 py-2 font-mono text-sm font-black break-all" style={{ background: "#0A0A0A", color: opConfig.color, border: `1px solid ${opConfig.color}33` }}>
                      {opConfig.ussdFn(total)}
                    </div>
                    <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                      Remplacez <strong style={{ color: "var(--text-secondary)" }}>{total}</strong> par <strong style={{ color: opConfig.color }}>{total.toLocaleString("fr-FR")}</strong> FCFA si demandé
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: opConfig.color, color: "#000" }}>3</span>
                  <div>
                    <p className="text-xs font-bold text-white">Montant à régler</p>
                    <p className="text-xl font-black tabular-nums mt-0.5" style={{ color: opConfig.color }}>
                      {total.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: "#EF4444", color: "#fff" }}>!</span>
                  <p className="text-xs pt-1" style={{ color: "#FCA5A5" }}>
                    Une fois payé, envoyez la <strong>capture d&apos;écran</strong> de confirmation sur WhatsApp pour déclencher l&apos;envoi de votre commande.
                  </p>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96] disabled:opacity-50 mb-2"
                style={{ background: "#25D366" }}
              >
                {loading ? t("cart.loading") : (
                  <><Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" /> J&apos;ai payé — Continuer sur WhatsApp</>
                )}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setPayStep("choose")}
                  className="flex-1 text-xs py-2 rounded-xl transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  ← Changer
                </button>
                <button
                  onClick={() => setPayStep(null)}
                  className="flex-1 text-xs py-2 rounded-xl font-bold transition-opacity hover:opacity-70"
                  style={{ color: "#EF4444", background: "#EF444415" }}
                >
                  ✕ Annuler
                </button>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col gap-3">
            {isSell ? (
              <WAPopover
                getMsg={buildMsgPlain}
                prefillPrenom={name}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                style={{ background: "#25D366" }}
              >
                {t("cart.wa.sell")}
              </WAPopover>
            ) : payStep === null && (
              <button
                onClick={handleOrderClick}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96] disabled:opacity-50"
                style={{ background: "#25D366" }}
              >
                {loading ? t("cart.loading") : (
                  <><Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" /> {t("cart.wa.order")}</>
                )}
              </button>
            )}
          </div>

          {/* Info sécurité */}
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>🔒</span>
            <span>{t("cart.security")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
