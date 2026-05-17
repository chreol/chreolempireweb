"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UBA_CARDS, UBA_RECHARGE_FEES, CONTACT, IMAGES } from "@/lib/services";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";

function calcFee(amount: number) {
  const tier = UBA_RECHARGE_FEES.find(t => amount >= t.min && amount <= t.max);
  if (!tier) return 0;
  return tier.type === "fixed" ? tier.fee : Math.round(amount * tier.fee / 100);
}

export default function UBAPage() {
  const { addItem } = useCart();
  const { addEntry } = useHistory();
  const { showToast } = useToast();

  const [mode, setMode]           = useState<"buy" | "recharge">("buy");
  const [card6, setCard6]         = useState("");
  const [card4, setCard4]         = useState("");
  const [clientId, setClientId]   = useState("");
  const [fullName, setFullName]   = useState("");
  const [phone, setPhone]         = useState("");
  const [amount, setAmount]       = useState("");
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const numAmount = parseInt(amount.replace(/\D/g, ""), 10) || 0;
  const fee       = calcFee(numAmount);
  const total     = numAmount + fee;

  function validate() {
    const e: Record<string, string> = {};
    if (card6.length !== 6) e.card6 = "6 chiffres requis";
    if (card4.length !== 4) e.card4 = "4 chiffres requis";
    if (!clientId || clientId.length > 10) e.clientId = "Client ID requis (max 10 chiffres)";
    if (!fullName.trim()) e.fullName = "Nom requis";
    if (!phone || phone.length !== 9) e.phone = "Numéro invalide (9 chiffres)";
    if (!amount || numAmount < 1500 || numAmount > 500000) e.amount = "Montant entre 1 500 et 500 000 FCFA";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildRechargeMsg() {
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\n` +
      `💳 RECHARGE UBA\n` +
      `Carte : ${card6}••••••${card4}\n` +
      `Client ID : ${clientId}\n` +
      `Nom : ${fullName}\n` +
      `Téléphone : +237 ${phone}\n` +
      `Montant : ${numAmount.toLocaleString("fr-FR")} FCFA\n` +
      `Frais : ${fee.toLocaleString("fr-FR")} FCFA\n` +
      `Total à payer : ${total.toLocaleString("fr-FR")} FCFA`,
    );
  }

  function buildBuyMsg(segment: string, price: number) {
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\n` +
      `🏦 ACHAT CARTE UBA\n` +
      `Segment : ${segment}\n` +
      `Prix : ${price.toLocaleString("fr-FR")} FCFA`,
    );
  }

  function handleAddToCart() {
    if (!validate()) { showToast("Corrigez les erreurs", "error"); return; }
    addItem({
      id: `uba-recharge-${Date.now()}`,
      cardName: "UBA Cameroun — Recharge",
      amount: `${numAmount.toLocaleString("fr-FR")} FCFA + ${fee.toLocaleString("fr-FR")} FCFA frais`,
      price: total,
      type: "buy",
      details: `Carte : ${card6}••••••${card4} | Client ID : ${clientId}\nNom : ${fullName} | +237 ${phone}\nMontant : ${numAmount.toLocaleString("fr-FR")} FCFA | Frais : ${fee.toLocaleString("fr-FR")} FCFA`,
    });
    addEntry({
      service: "UBA Cameroun — Recharge",
      details: `${numAmount.toLocaleString("fr-FR")} FCFA + ${fee.toLocaleString("fr-FR")} FCFA frais = ${total.toLocaleString("fr-FR")} FCFA`,
      amount: total,
      currency: "FCFA",
      status: "pending",
    });
    showToast("Recharge UBA ajoutée au panier !", "success");
  }

  function handleRecharge() {
    if (!validate()) { showToast("Corrigez les erreurs", "error"); return; }
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${buildRechargeMsg()}`, "_blank");
  }

  const inputCls  = "w-full px-4 py-3 rounded-2xl text-white text-sm outline-none";
  const inputBase = { background: "var(--bg-elevated)", border: "1px solid var(--border)" };
  const inputErr  = { ...inputBase, borderColor: "#EF4444" };

  function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</label>
        {children}
        {error && <span className="text-xs font-semibold" style={{ color: "#EF4444" }}>{error}</span>}
      </div>
    );
  }

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/services" className="hover:text-white transition-colors">Services</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>UBA Cameroun</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">UBA Cameroun</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Achetez votre carte UBA prépayée ou rechargez votre solde existant.
      </p>

      {/* Tab toggle */}
      <div className="flex rounded-2xl p-1 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {(["buy", "recharge"] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setErrors({}); }}
            className="flex-1 py-3 rounded-xl font-black text-sm transition-all"
            style={{
              background: mode === m ? "var(--gold)" : "transparent",
              color: mode === m ? "#0A0A0A" : "var(--text-secondary)",
            }}
          >
            {m === "buy" ? "🏦 Acheter une carte" : "⚡ Recharger ma carte"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {mode === "buy" ? (
          <motion.div key="buy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {UBA_CARDS.map(card => (
                <div
                  key={card.segment}
                  className="flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    background: "var(--bg-card)",
                    border: `1px solid ${card.popular ? "#C9A84C" : "var(--border)"}`,
                  }}
                >
                  {card.popular && (
                    <div className="text-center py-1 text-[10px] font-black" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
                      ⭐ POPULAIRE
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <p className="font-black text-white text-lg">Segment {card.segment}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Limite : {card.limit}</p>
                    </div>
                    <p className="text-xl font-black" style={{ color: "var(--gold)" }}>
                      {card.price.toLocaleString("fr-FR")} FCFA
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {card.features.map(f => (
                        <p key={f} className="text-xs flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--gold)" }}>✓</span> {f}
                        </p>
                      ))}
                    </div>
                    <a
                      href={`https://wa.me/${CONTACT.whatsapp}?text=${buildBuyMsg(card.segment, card.price)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-auto block text-center py-3 rounded-xl font-black text-sm transition-opacity hover:opacity-85"
                      style={{ background: card.popular ? "var(--gold)" : "var(--bg-elevated)", color: card.popular ? "#0A0A0A" : "var(--text-secondary)", border: "1px solid var(--border)" }}
                      onClick={() => addEntry({ service: `UBA — Achat Segment ${card.segment}`, details: `${card.price.toLocaleString("fr-FR")} FCFA`, amount: card.price, currency: "FCFA", status: "pending" })}
                    >
                      Commander →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="recharge" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col gap-5">

            {/* Card digits */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="6 premiers chiffres" error={errors.card6}>
                <input
                  type="tel"
                  placeholder="123456"
                  value={card6}
                  maxLength={6}
                  onChange={e => { setCard6(e.target.value.replace(/\D/g, "").slice(0, 6)); setErrors(p => ({ ...p, card6: "" })); }}
                  className={inputCls}
                  style={errors.card6 ? inputErr : inputBase}
                />
              </Field>
              <Field label="4 derniers chiffres" error={errors.card4}>
                <input
                  type="tel"
                  placeholder="7890"
                  value={card4}
                  maxLength={4}
                  onChange={e => { setCard4(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrors(p => ({ ...p, card4: "" })); }}
                  className={inputCls}
                  style={errors.card4 ? inputErr : inputBase}
                />
              </Field>
            </div>

            <Field label="Client ID (au dos de la carte, max 10 chiffres)" error={errors.clientId}>
              <input
                type="tel"
                placeholder="Votre Client ID"
                value={clientId}
                maxLength={10}
                onChange={e => { setClientId(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, clientId: "" })); }}
                className={inputCls}
                style={errors.clientId ? inputErr : inputBase}
              />
            </Field>

            <Field label="Nom complet" error={errors.fullName}>
              <input
                type="text"
                placeholder="Votre nom complet"
                value={fullName}
                onChange={e => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: "" })); }}
                className={inputCls}
                style={errors.fullName ? inputErr : inputBase}
              />
            </Field>

            <Field label="Téléphone (+237)" error={errors.phone}>
              <div className="flex items-center rounded-2xl overflow-hidden" style={errors.phone ? inputErr : inputBase}>
                <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                <input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setErrors(p => ({ ...p, phone: "" })); }}
                  className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                />
              </div>
            </Field>

            <Field label="Montant à recharger (1 500 – 500 000 FCFA)" error={errors.amount}>
              <input
                type="number"
                min="1500"
                max="500000"
                placeholder="ex: 25 000"
                value={amount}
                onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
                className={inputCls}
                style={errors.amount ? inputErr : inputBase}
              />
            </Field>

            {/* Fee summary */}
            {numAmount >= 1500 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-4"
                style={{ background: "#8B0000" + "18", border: "1px solid #8B000055" }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "var(--text-secondary)" }}>Recharge</span>
                  <span className="text-white font-bold tabular-nums">{numAmount.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "var(--text-secondary)" }}>Frais de service</span>
                  <span className="text-white font-bold tabular-nums">{fee.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-base pt-2" style={{ borderTop: "1px solid #8B000033" }}>
                  <span className="font-black text-white">Total à payer</span>
                  <span className="font-black tabular-nums" style={{ color: "var(--gold)" }}>{total.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </motion.div>
            )}

            {/* Fee table */}
            <details className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <summary className="px-4 py-3 text-xs font-bold cursor-pointer" style={{ background: "var(--bg-card)", color: "var(--text-secondary)", listStyle: "none" }}>
                📋 Grille des frais de recharge
              </summary>
              <div className="p-4" style={{ background: "var(--bg-elevated)" }}>
                {UBA_RECHARGE_FEES.map((t, i) => (
                  <div key={i} className="flex justify-between text-xs py-1.5" style={{ borderBottom: i < UBA_RECHARGE_FEES.length - 1 ? "1px solid var(--border)" : "none", color: "var(--text-secondary)" }}>
                    <span>{t.min.toLocaleString("fr-FR")} – {t.max.toLocaleString("fr-FR")} FCFA</span>
                    <span className="font-bold text-white">{t.type === "fixed" ? `${t.fee.toLocaleString("fr-FR")} FCFA` : `${t.fee}%`}</span>
                  </div>
                ))}
              </div>
            </details>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full font-black text-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "var(--gold)" }}
            >
              🛒 Ajouter au panier
            </button>
            <button
              onClick={handleRecharge}
              className="w-full py-3 rounded-full font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "#25D366" }}
            >
              <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
              Commander directement via WhatsApp
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
