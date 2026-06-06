"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { UBA_CARDS, UBA_RECHARGE_FEES, IMAGES } from "@/lib/services";
import { saveClientInfo } from "@/lib/clientInfo";
import WAPopover from "@/components/WAPopover";
import USSDOrderFlow from "@/components/USSDOrderFlow";
import PaymentMethodSelector, { resolvePaymentMethod } from "@/components/PaymentMethodSelector";
import RelatedServices from "@/components/RelatedServices";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import FAQ from "@/components/FAQ";
import StepGuide from "@/components/StepGuide";
import { Field } from "@/components/FormField";

// FAQ en français pour le JSON-LD SEO
const FAQ_FR = [
  { q: "Comment obtenir une carte UBA Cameroun pour payer sur Amazon ?", a: "Commandez votre carte UBA Cameroun via WhatsApp en fournissant : CNI, plan de localisation, demi-photo et NUI. Activation rapide en 1 à 24h+ ouvrables après dossier complet. La carte Visa UBA est acceptée sur Amazon, Alibaba, Airbnb et tous les sites internationaux." },
  { q: "Quel est le plafond de la carte UBA Cameroun ?", a: "De 2 500 000 FCFA/mois pour le segment Classic à 10 000 000 FCFA/mois pour le segment Gold. La carte est utilisable pour les paiements en ligne et en magasin partout où Visa est accepté dans le monde." },
  { q: "La carte UBA Cameroun fonctionne-t-elle à l'international ?", a: "Oui, c'est une carte Visa prépayée internationale. Utilisable sur tous les sites e-commerce mondiaux (Amazon, Netflix, PayPal, Booking…) et dans les terminaux physiques Visa à l'étranger." },
  { q: "Combien coûte une carte UBA Cameroun à Douala ?", a: "De 10 500 FCFA pour la carte Classic à 25 000 FCFA pour la carte Gold selon votre segment. Les frais de recharge varient de 1 500 FCFA fixe (petits montants) à 3% pour les rechargements supérieurs à 350 000 FCFA." },
];

const PAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_FR.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

function calcFee(amount: number) {
  const tier = UBA_RECHARGE_FEES.find(t => amount >= t.min && amount <= t.max);
  if (!tier) return 0;
  return tier.type === "fixed" ? tier.fee : Math.round(amount * tier.fee / 100);
}

export default function UBAPage() {
  useEffect(() => { track("service_view", { service: "uba" }); }, []);
  const { addItem } = useCart();
  const { addEntry } = useHistory();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const STEPS_UBA = [
    { icon: "💳", title: t("u.step1.t"), description: t("u.step1.d"), tip: t("u.step1.tip") },
    { icon: "📋", title: t("u.step2.t"), description: t("u.step2.d"), tip: t("u.step2.tip") },
    { icon: "💰", title: t("u.step3.t"), description: t("u.step3.d"), tip: t("u.step3.tip") },
    { icon: "🏦", title: t("u.step4.t"), description: t("u.step4.d") },
    { icon: "📦", title: t("u.step5.t"), description: t("u.step5.d"), tip: t("u.step5.tip") },
  ];
  const PAGE_FAQ = [
    { q: t("u.faq1.q"), a: t("u.faq1.a") },
    { q: t("u.faq2.q"), a: t("u.faq2.a") },
    { q: t("u.faq3.q"), a: t("u.faq3.a") },
    { q: t("u.faq4.q"), a: t("u.faq4.a") },
  ];
  const REQUIRED_DOCS = [
    { icon: "🪪", label: t("u.doc_1") },
    { icon: "📍", label: t("u.doc_2") },
    { icon: "📸", label: t("u.doc_3") },
    { icon: "🔢", label: t("u.doc_4") },
  ];

  const orderIdRef = useRef("");
  const [mode, setMode]         = useState<"buy" | "recharge">("buy");
  const [payOp, setPayOp]       = useState<string | null>(null);

  /* ── Buy mode ── */
  const [selectedSeg, setSelectedSeg] = useState<string | null>(null);
  const [buyName, setBuyName]         = useState("");
  const [buyPhone, setBuyPhone]       = useState("");
  const [buyAccepted, setBuyAccepted] = useState(false);
  const [buyErrors, setBuyErrors]     = useState<Record<string, string>>({});

  /* ── Recharge mode ── */
  const [card6, setCard6]       = useState("");
  const [card4, setCard4]       = useState("");
  const [clientId, setClientId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [amount, setAmount]     = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});

  /* ── Refs for auto-advance ── */
  const refCard4    = useRef<HTMLInputElement>(null);
  const refClientId = useRef<HTMLInputElement>(null);
  const refFullName = useRef<HTMLInputElement>(null);
  const refPhone    = useRef<HTMLInputElement>(null);
  const refAmount   = useRef<HTMLInputElement>(null);
  const refBuyPhone = useRef<HTMLInputElement>(null);

  const numAmount = parseInt(amount.replace(/\D/g, ""), 10) || 0;
  const fee       = calcFee(numAmount);
  const total     = numAmount + fee;

  /* ── Buy validation ── */
  function validateBuy() {
    const e: Record<string, string> = {};
    if (!selectedSeg)                           e.seg      = t("u.select_seg");
    if (!buyName.trim())                        e.buyName  = t("u.name_required");
    const bpD = buyPhone.replace(/\D/g, "").replace(/^237/, "");
    if (bpD.length < 9) e.buyPhone = t("err.phone_invalid");
    if (!buyAccepted)                           e.accepted = t("u.accept_required");
    setBuyErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleBuyAddToCart() {
    if (!validateBuy()) { showToast(t("err.fix"), "error"); return; }
    saveClientInfo({ name: buyName, phone: buyPhone });
    const card = UBA_CARDS.find(c => c.segment === selectedSeg)!;
    addItem({
      id: `uba-buy-${Date.now()}`,
      cardName: `Carte UBA Segment ${card.segment}`,
      amount: `${card.price.toLocaleString("fr-FR")} FCFA · Limite ${card.limit}`,
      price: card.price,
      type: "buy",
      details: `Segment ${card.segment}${buyName ? ` | Nom : ${buyName}` : ""} | +237 ${buyPhone}`,
    });
    addEntry({
      service: `UBA — Achat Carte Segment ${card.segment}`,
      details: `${card.price.toLocaleString("fr-FR")} FCFA${buyName ? ` | Nom : ${buyName}` : ""}`,
      amount: card.price,
      currency: "FCFA",
      status: "pending",
    });
    showToast(t("u.added_buy"), "success");
  }

  /* ── Recharge validation ── */
  function validate() {
    const e: Record<string, string> = {};
    if (card6.length !== 6)                             e.card6    = t("u.card6_err");
    if (card4.length !== 4)                             e.card4    = t("u.card4_err");
    if (!clientId || clientId.length > 10)              e.clientId = t("u.client_id_err");
    if (!fullName.trim())                               e.fullName = t("u.name_required");
    const phD = phone.replace(/\D/g, "").replace(/^237/, "");
    if (phD.length < 9) e.phone = t("err.phone_invalid");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t("err.email_valid");
    if (!amount || numAmount < 1500 || numAmount > 500000) e.amount = t("u.amount_err");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildRechargeMsgPlain() {
    const ref = orderIdRef.current ? ` — Réf #${orderIdRef.current.slice(-8).toUpperCase()}` : "";
    const pay = payOp ? `\nPaiement : ${resolvePaymentMethod(payOp)}` : "";
    return `💳 RECHARGE UBA${ref}\nCarte : ${card6}••••••${card4}\nClient ID : ${clientId}\n${fullName ? `Nom : ${fullName}\n` : ""}Téléphone : +237 ${phone}\nMontant : ${numAmount.toLocaleString("fr-FR")} FCFA\nFrais : ${fee.toLocaleString("fr-FR")} FCFA\nTotal à payer : ${total.toLocaleString("fr-FR")} FCFA${pay}`;
  }

  function handleAddToCart() {
    if (!validate()) { showToast(t("err.fix"), "error"); return; }
    saveClientInfo({ name: fullName, email, phone });
    addItem({
      id: `uba-recharge-${Date.now()}`,
      cardName: "UBA Cameroun — Recharge",
      amount: `${numAmount.toLocaleString("fr-FR")} FCFA + ${fee.toLocaleString("fr-FR")} FCFA frais`,
      price: total,
      type: "buy",
      details: `Carte : ${card6}••••••${card4} | Client ID : ${clientId}${fullName ? ` | Nom : ${fullName}` : ""} | +237 ${phone}\nMontant : ${numAmount.toLocaleString("fr-FR")} FCFA | Frais : ${fee.toLocaleString("fr-FR")} FCFA`,
    });
    addEntry({
      service: "UBA Cameroun — Recharge",
      details: `${numAmount.toLocaleString("fr-FR")} FCFA + ${fee.toLocaleString("fr-FR")} FCFA frais = ${total.toLocaleString("fr-FR")} FCFA`,
      amount: total,
      currency: "FCFA",
      status: "pending",
    });
    showToast(t("u.added_recharge"), "success");
  }

  function handleRechargeBeforeOpen() {
    const ok = validate();
    if (!ok) { showToast(t("err.fix"), "error"); return false; }
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: (() => { const id = `uba-recharge-${Date.now()}`; orderIdRef.current = id; return id; })(),
        clientName: fullName || email.split("@")[0],
        clientEmail: email,
        clientPhone: phone,
        paymentMethod: resolvePaymentMethod(payOp),
        items: [{
          name: "UBA Cameroun — Recharge",
          qty: 1,
          price: total,
          amount: `${numAmount.toLocaleString("fr-FR")} FCFA + ${fee.toLocaleString("fr-FR")} FCFA frais`,
          details: `Carte : ${card6}••••••${card4} | Client ID : ${clientId}${fullName ? ` | Nom : ${fullName}` : ""} | +237 ${phone}`,
        }],
        total,
        commission: fee,
        commissionLabel: "Frais de recharge UBA",
        sourceUrl: window.location.pathname,
      }),
    }).catch(() => {});
    return true;
  }

  const inputCls  = "w-full px-4 py-3 rounded-2xl text-sm outline-none";
  const inputBase = { background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" };
  const inputErr  = { ...inputBase, borderColor: "#EF4444" };

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/services" className="hover:text-white transition-colors">{t("nav.services")}</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>{t("u.breadcrumb")}</span>
      </div>

      <h1 className="text-3xl font-black mb-1" style={{ color: "var(--text-primary)" }}>{t("p.uba.title")}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>{t("p.uba.sub")}</p>

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
            {m === "buy" ? t("u.tab_buy") : t("u.tab_recharge")}
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
                      {t("u.popular")}
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <p className="font-black text-lg" style={{ color: "var(--text-primary)" }}>{t("u.segment")} {card.segment}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{t("u.limit")} : {card.limit}</p>
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
                        {t("u.selected")}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {buyErrors.seg && <p className="text-xs font-semibold mb-4 mt-1" style={{ color: "#EF4444" }}>{buyErrors.seg}</p>}

            {/* Documentation form */}
            {selectedSeg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 mt-6"
              >
                {/* Required documents list */}
                <div className="rounded-2xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}>
                  <p className="text-sm font-black mb-3" style={{ color: "var(--gold)" }}>{t("u.docs_title")}</p>
                  <div className="flex flex-col gap-2">
                    {REQUIRED_DOCS.map((doc, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-base shrink-0 mt-0.5">{doc.icon}</span>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{doc.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] mt-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                    {t("u.docs_note")}
                  </p>
                </div>

                <Field label={t("u.name_card")} error={buyErrors.buyName}>
                  <input
                    type="text"
                    placeholder={t("u.name_ph")}
                    value={buyName}
                    onChange={e => { setBuyName(e.target.value); setBuyErrors(p => ({ ...p, buyName: "" })); }}
                    onKeyDown={e => e.key === "Enter" && refBuyPhone.current?.focus({ preventScroll: true })}
                    className={inputCls}
                    style={buyErrors.buyName ? inputErr : inputBase}
                  />
                </Field>

                <Field label="Téléphone (+237)" error={buyErrors.buyPhone}>
                  <div className="flex items-center rounded-2xl overflow-hidden" style={buyErrors.buyPhone ? inputErr : inputBase}>
                    <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                    <input
                      ref={refBuyPhone}
                      type="tel"
                      placeholder="6XXXXXXXX"
                      value={buyPhone}
                      maxLength={9}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={e => {
                        setBuyPhone(e.target.value.replace(/\D/g, "").slice(0, 9));
                        setBuyErrors(p => ({ ...p, buyPhone: "" }));
                      }}
                      className="flex-1 py-3 pr-4 bg-transparent text-sm outline-none"
                      style={{ color: "var(--text-primary)" }}
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
                    {t("u.accept")}
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
                  {t("btn.add_to_cart")}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="recharge" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col gap-5">

            {/* Card digits — chiffres uniquement + auto-avance */}
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("u.card6")} error={errors.card6}>
                <input
                  type="tel"
                  placeholder="123456"
                  value={card6}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCard6(v);
                    setErrors(p => ({ ...p, card6: "" }));
                    if (v.length === 6) refCard4.current?.focus({ preventScroll: true });
                  }}
                  className={inputCls}
                  style={errors.card6 ? inputErr : inputBase}
                />
              </Field>
              <Field label={t("u.card4")} error={errors.card4}>
                <input
                  ref={refCard4}
                  type="tel"
                  placeholder="7890"
                  value={card4}
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setCard4(v);
                    setErrors(p => ({ ...p, card4: "" }));
                    if (v.length === 4) refClientId.current?.focus({ preventScroll: true });
                  }}
                  className={inputCls}
                  style={errors.card4 ? inputErr : inputBase}
                />
              </Field>
            </div>

            <Field label={t("u.client_id")} error={errors.clientId}>
              <input
                ref={refClientId}
                type="tel"
                placeholder={t("u.client_id_ph")}
                value={clientId}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setClientId(v);
                  setErrors(p => ({ ...p, clientId: "" }));
                  if (v.length === 10) refFullName.current?.focus({ preventScroll: true });
                }}
                className={inputCls}
                style={errors.clientId ? inputErr : inputBase}
              />
            </Field>

            <Field label={t("u.name_appears")} error={errors.fullName}>
              <input
                ref={refFullName}
                type="text"
                placeholder={t("u.name_ph")}
                value={fullName}
                onChange={e => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: "" })); }}
                onKeyDown={e => e.key === "Enter" && refPhone.current?.focus({ preventScroll: true })}
                className={inputCls}
                style={errors.fullName ? inputErr : inputBase}
              />
            </Field>

            <Field label={t("u.phone")} error={errors.phone}>
              <div className="flex items-center rounded-2xl overflow-hidden" style={errors.phone ? inputErr : inputBase}>
                <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                <input
                  ref={refPhone}
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={phone}
                  maxLength={9}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 9);
                    setPhone(v);
                    setErrors(p => ({ ...p, phone: "" }));
                    if (v.length === 9) refAmount.current?.focus({ preventScroll: true });
                  }}
                  className="flex-1 py-3 pr-4 bg-transparent text-sm outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            </Field>

            <Field label={t("f.email")} error={errors.email}>
              <input
                type="email"
                placeholder={t("f.email.ph")}
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                className={inputCls}
                style={errors.email ? inputErr : inputBase}
              />
            </Field>

            <Field label={t("u.amount_recharge")} error={errors.amount}>
              <input
                ref={refAmount}
                type="tel"
                placeholder="ex: 25000"
                value={amount}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  if (parseInt(v || "0") <= 500000) {
                    setAmount(v);
                    setErrors(p => ({ ...p, amount: "" }));
                  }
                }}
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
                  <span style={{ color: "var(--text-secondary)" }}>{t("u.recharge")}</span>
                  <span className="font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>{numAmount.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "var(--text-secondary)" }}>{t("u.service_fee")}</span>
                  <span className="font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>{fee.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-base pt-2" style={{ borderTop: "1px solid #8B000033" }}>
                  <span className="font-black" style={{ color: "var(--text-primary)" }}>{t("u.total_pay")}</span>
                  <span className="font-black tabular-nums" style={{ color: "var(--gold)" }}>{total.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </motion.div>
            )}

            {/* Fee table */}
            <details className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <summary className="px-4 py-3 text-xs font-bold cursor-pointer" style={{ background: "var(--bg-card)", color: "var(--text-secondary)", listStyle: "none" }}>
                {t("u.fees_grid")}
              </summary>
              <div className="p-4" style={{ background: "var(--bg-elevated)" }}>
                {UBA_RECHARGE_FEES.map((tier, i) => (
                  <div key={i} className="flex justify-between text-xs py-1.5" style={{ borderBottom: i < UBA_RECHARGE_FEES.length - 1 ? "1px solid var(--border)" : "none", color: "var(--text-secondary)" }}>
                    <span>{tier.min.toLocaleString("fr-FR")} – {tier.max.toLocaleString("fr-FR")} FCFA</span>
                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>{tier.type === "fixed" ? `${tier.fee.toLocaleString("fr-FR")} FCFA` : `${tier.fee}%`}</span>
                  </div>
                ))}
              </div>
            </details>

            {/* Mode de paiement préféré (optionnel) */}
            <PaymentMethodSelector value={payOp} onChange={setPayOp} />

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full font-black text-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "var(--gold)" }}
            >
              🛒 Ajouter au panier
            </button>
            <USSDOrderFlow
              total={total}
              getMsg={buildRechargeMsgPlain}
              onBeforeOpen={handleRechargeBeforeOpen}
              prefillPrenom={fullName}
              className="w-full py-3 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "#25D366" }}
            >
              <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
              {t("btn.order_wa_direct")}
            </USSDOrderFlow>
          </motion.div>
        )}
      </AnimatePresence>
      <StepGuide title={t("u.guide_title")} steps={STEPS_UBA} />
      <FAQ items={PAGE_FAQ} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_FAQ_SCHEMA) }} />
      <RelatedServices current="uba" />
    </div>
  );
}
