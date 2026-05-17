"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UBA_CARDS, UBA_RECHARGE_FEES, IMAGES } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";

function calcFee(amount: number) {
  const tier = UBA_RECHARGE_FEES.find(t => amount >= t.min && amount <= t.max);
  if (!tier) return 0;
  return tier.type === "fixed" ? tier.fee : Math.round(amount * tier.fee / 100);
}

export default function UBAPage() {
  const { addItem } = useCart();
  const { addEntry } = useHistory();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [mode, setMode]           = useState<"buy" | "recharge">("buy");

  /* ── Buy mode state ── */
  const [selectedSeg, setSelectedSeg]   = useState<string | null>(null);
  const [buyName, setBuyName]           = useState("");
  const [buyPhone, setBuyPhone]         = useState("");
  const [buyAccepted, setBuyAccepted]   = useState(false);
  const [buyErrors, setBuyErrors]       = useState<Record<string, string>>({});

  /* ── Recharge mode state ── */
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

  /* ── Buy validation ── */
  function validateBuy() {
    const e: Record<string, string> = {};
    if (!selectedSeg) e.seg = "Sélectionnez un segment de carte";
    if (!buyName.trim()) e.buyName = "Nom complet requis";
    if (!buyPhone || buyPhone.length !== 9) e.buyPhone = "Numéro invalide (9 chiffres)";
    if (!buyAccepted) e.accepted = "Vous devez accepter les conditions";
    setBuyErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleBuyAddToCart() {
    if (!validateBuy()) { showToast("Corrigez les erreurs", "error"); return; }
    const card = UBA_CARDS.find(c => c.segment === selectedSeg)!;
    addItem({
      id: `uba-buy-${Date.now()}`,
      cardName: `Carte UBA Segment ${card.segment}`,
      amount: `${card.price.toLocaleString("fr-FR")} FCFA · Limite ${card.limit}`,
      price: card.price,
      type: "buy",
      details: `Segment ${card.segment} | Nom : ${buyName} | +237 ${buyPhone}`,
    });
    addEntry({
      service: `UBA — Achat Carte Segment ${card.segment}`,
      details: `${card.price.toLocaleString("fr-FR")} FCFA | Nom : ${buyName}`,
      amount: card.price,
      currency: "FCFA",
      status: "pending",
    });
    showToast("Carte UBA ajoutée au panier !", "success");
  }

  /* ── Recharge validation ── */
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

  function buildRechargeMsgPlain() {
    return `💳 RECHARGE UBA\nCarte : ${card6}••••••${card4}\nClient ID : ${clientId}\nNom : ${fullName}\nTéléphone : +237 ${phone}\nMontant : ${numAmount.toLocaleString("fr-FR")} FCFA\nFrais : ${fee.toLocaleString("fr-FR")} FCFA\nTotal à payer : ${total.toLocaleString("fr-FR")} FCFA`;
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

  function handleRechargeBeforeOpen() {
    const ok = validate();
    if (!ok) { showToast("Corrigez les erreurs", "error"); return false; }
    return true;
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

      <h1 className="text-3xl font-black text-white mb-1">{t("p.uba.title")}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        {t("p.uba.sub")}
      </p>

      {/* Tab toggle */}
      <div className="flex rounded-2xl p-1 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {(["buy", "recharge"] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setErrors({}); setBuyErrors({}); }}
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

            {/* Card selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
              {UBA_CARDS.map(card => (
                <button
                  key={card.segment}
                  type="button"
                  onClick={() => { setSelectedSeg(card.segment); setBuyErrors(p => ({ ...p, seg: "" })); }}
                  className="flex flex-col rounded-2xl overflow-hidden text-left transition-all"
                  style={{
                    background: "var(--bg-card)",
                    border: `2px solid ${selectedSeg === card.segment ? "var(--gold)" : card.popular ? "#C9A84C44" : "var(--border)"}`,
                    boxShadow: selectedSeg === card.segment ? "0 0 0 3px rgba(201,168,76,0.15)" : "none",
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
                    {selectedSeg === card.segment && (
                      <div className="mt-1 text-center text-xs font-black py-1 rounded-lg" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
                        ✓ Sélectionné
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {buyErrors.seg && <p className="text-xs font-semibold mb-4 mt-1" style={{ color: "#EF4444" }}>{buyErrors.seg}</p>}

            {/* Documentation form — shown after card selection */}
            {selectedSeg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 mt-6"
              >
                <div className="rounded-2xl p-4" style={{ background: "#8B000012", border: "1px solid #8B000044" }}>
                  <p className="text-sm font-bold mb-1" style={{ color: "#CD5C5C" }}>📋 Informations requises</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Ces informations sont nécessaires pour activer votre carte UBA Cameroun. Un agent vous contactera pour finaliser.
                  </p>
                </div>

                <Field label="Nom complet" error={buyErrors.buyName}>
                  <input
                    type="text"
                    placeholder="Votre nom complet"
                    value={buyName}
                    autoFocus
                    onChange={e => { setBuyName(e.target.value); setBuyErrors(p => ({ ...p, buyName: "" })); }}
                    className={inputCls}
                    style={buyErrors.buyName ? inputErr : inputBase}
                  />
                </Field>

                <Field label="Téléphone (+237)" error={buyErrors.buyPhone}>
                  <div className="flex items-center rounded-2xl overflow-hidden" style={buyErrors.buyPhone ? inputErr : inputBase}>
                    <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                    <input
                      type="tel"
                      placeholder="6XXXXXXXX"
                      value={buyPhone}
                      maxLength={9}
                      onChange={e => { setBuyPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setBuyErrors(p => ({ ...p, buyPhone: "" })); }}
                      className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                    />
                  </div>
                </Field>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={buyAccepted}
                    onChange={e => { setBuyAccepted(e.target.checked); setBuyErrors(p => ({ ...p, accepted: "" })); }}
                    className="mt-0.5 shrink-0 w-4 h-4 accent-amber-400"
                  />
                  <span className="text-xs leading-relaxed" style={{ color: buyErrors.accepted ? "#EF4444" : "var(--text-secondary)" }}>
                    J&apos;ai lu et j&apos;accepte de fournir les éléments nécessaires au bureau Chreol Empire pour obtenir ma carte UBA Cameroun (pièce d&apos;identité, justificatif).
                  </span>
                </label>
                {buyErrors.accepted && (
                  <p className="text-xs font-semibold -mt-2" style={{ color: "#EF4444" }}>{buyErrors.accepted}</p>
                )}

                <button
                  onClick={handleBuyAddToCart}
                  className="w-full py-4 rounded-full font-black text-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                  style={{ background: "var(--gold)" }}
                >
                  🛒 Ajouter au panier
                </button>
              </motion.div>
            )}
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
                  autoFocus
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
                  maxLength={9}
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
                style={{ background: "#8B000018", border: "1px solid #8B000055" }}
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
            <WAPopover
              onBeforeOpen={handleRechargeBeforeOpen}
              getMsg={buildRechargeMsgPlain}
              prefillPrenom={fullName}
              className="w-full py-3 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "#25D366" }}
            >
              <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
              Commander directement via WhatsApp
            </WAPopover>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
