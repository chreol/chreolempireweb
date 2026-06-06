"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { FACTURE_BILLERS, FACTURE_COMMISSION, MOMO_OPERATORS, IMAGES } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import USSDOrderFlow from "@/components/USSDOrderFlow";
import PaymentMethodSelector, { resolvePaymentMethod } from "@/components/PaymentMethodSelector";
import RelatedServices from "@/components/RelatedServices";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import FAQ from "@/components/FAQ";
import StepGuide from "@/components/StepGuide";
import { Field } from "@/components/FormField";

// FAQ en français pour le JSON-LD SEO
const FAQ_FR = [
  { q: "Comment payer sa facture Eneo sans se déplacer à Douala ?", a: "Envoyez le montant + 200 FCFA de commission via MTN MoMo ou Orange Money, puis transmettez votre numéro de compteur sur WhatsApp. Nous réglons votre facture Eneo sous 15 minutes et vous envoyons la confirmation de paiement." },
  { q: "Peut-on payer Canal+ avec MTN MoMo via Chreol Empire ?", a: "Oui, nous prenons en charge Canal+, Eneo, Camwater et StarTimes. Commission unique de 200 FCFA par facture, quel que soit le montant. Paiement accepté par MTN MoMo, Orange Money ou Express Union." },
  { q: "Quel est le coût du service de paiement de factures ?", a: "200 FCFA fixe par facture, quel que soit le montant. Pas de pourcentage, pas de frais cachés. Pour 5 000 FCFA de facture, vous payez 5 200 FCFA au total. Service disponible 7j/7 de 7h à 23h." },
  { q: "Comment transférer de l'Orange Money vers MTN MoMo au Cameroun ?", a: "Via notre service d'échange MoMo gratuit : indiquez votre numéro Orange Money source et votre numéro MTN MoMo destination. Nous effectuons l'échange au taux 1:1, sans frais. Minimum 1 000 FCFA, maximum 500 000 FCFA." },
];

const PAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_FR.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

type Tab = "factures" | "momo";
type IdType = "phone" | "decoder";

export default function FacturesPage() {
  useEffect(() => { track("service_view", { service: "factures" }); }, []);
  const { addEntry } = useHistory();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const { addItem } = useCart();

  const STEPS_FACTURES = [
    { icon: "📋", title: t("fa.step1.t"), description: t("fa.step1.d") },
    { icon: "🔢", title: t("fa.step2.t"), description: t("fa.step2.d"), tip: t("fa.step2.tip") },
    { icon: "📧", title: t("fa.step3.t"), description: t("fa.step3.d") },
    { icon: "💬", title: t("fa.step4.t"), description: t("fa.step4.d") },
    { icon: "✅", title: t("fa.step5.t"), description: t("fa.step5.d"), tip: t("fa.step5.tip") },
  ];
  const PAGE_FAQ = [
    { q: t("fa.faq1.q"), a: t("fa.faq1.a") },
    { q: t("fa.faq2.q"), a: t("fa.faq2.a") },
    { q: t("fa.faq3.q"), a: t("fa.faq3.a") },
    { q: t("fa.faq4.q"), a: t("fa.faq4.a") },
  ];

  const orderIdRef = useRef("");
  const [tab, setTab]       = useState<Tab>("factures");
  const [cartDialog, setCartDialog] = useState(false);
  const [payOp, setPayOp]   = useState<string | null>(null);

  /* --- Shared --- */
  const [email, setEmail]     = useState("");

  /* --- Factures form --- */
  const [biller, setBiller]   = useState<string | null>(null);
  const [idType, setIdType]   = useState<IdType>("phone");
  const [identifier, setIdentifier] = useState("");
  const [amount, setAmount]   = useState("");
  const [facErrors, setFacErrors] = useState<Record<string, string>>({});

  /* --- MoMo exchange form --- */
  const [srcOp, setSrcOp]     = useState("orange");
  const [srcPhone, setSrcPhone] = useState("");
  const [dstOp, setDstOp]     = useState("mtn");
  const [dstPhone, setDstPhone] = useState("");
  const [momoAmt, setMomoAmt] = useState("");
  const [momoErrors, setMomoErrors] = useState<Record<string, string>>({});

  /* === Factures logic === */
  const numFacAmt = parseInt(amount) || 0;
  const totalFacture = numFacAmt + FACTURE_COMMISSION;

  function validateFacture() {
    const e: Record<string, string> = {};
    if (!biller) e.biller = t("fa.choose_biller");
    const idD = identifier.replace(/\D/g, "").replace(/^237/, "");
    if (idType === "phone" && idD.length < 9) e.identifier = t("fa.id_phone_err");
    if (idType === "decoder" && idD.length < 14) e.identifier = t("fa.id_decoder_err");
    if (!amount || numFacAmt < 500) e.amount = t("fa.amount_min500");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t("err.email_valid");
    setFacErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildFactureMsgPlain() {
    const billerName = FACTURE_BILLERS.find(b => b.id === biller)?.name ?? biller;
    const ref = orderIdRef.current ? ` — Réf #${orderIdRef.current.slice(-8).toUpperCase()}` : "";
    const pay = payOp ? `\nPaiement : ${resolvePaymentMethod(payOp)}` : "";
    return `📋 PAIEMENT FACTURE${ref}\nFournisseur : ${billerName}\nIdentifiant : ${identifier} (${idType === "phone" ? "téléphone" : "décodeur"})\nMontant facture : ${numFacAmt.toLocaleString("fr-FR")} FCFA\nCommission : ${FACTURE_COMMISSION} FCFA\nTotal à payer : ${totalFacture.toLocaleString("fr-FR")} FCFA${pay}`;
  }

  function handleFactureBeforeOpen() {
    const ok = validateFacture();
    if (!ok) { showToast(t("err.fix"), "error"); return false; }
    const billerName = FACTURE_BILLERS.find(b => b.id === biller)?.name ?? "";
    addEntry({
      service: `Facture — ${billerName}`,
      details: `${numFacAmt.toLocaleString("fr-FR")} FCFA + ${FACTURE_COMMISSION} FCFA commission`,
      amount: totalFacture,
      currency: "FCFA",
      status: "pending",
    });
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: (() => { const id = `facture-${biller}-${Date.now()}`; orderIdRef.current = id; return id; })(),
        clientName: email.split("@")[0],
        clientEmail: email,
        clientPhone: idType === "phone" ? identifier : "",
        paymentMethod: resolvePaymentMethod(payOp),
        items: [{
          name: `Facture ${billerName}`,
          qty: 1,
          price: totalFacture,
          amount: `${numFacAmt.toLocaleString("fr-FR")} FCFA`,
          details: `Identifiant : ${identifier} (${idType === "phone" ? "téléphone" : "décodeur"})`,
        }],
        total: totalFacture,
        commission: FACTURE_COMMISSION,
        commissionLabel: "Commission service",
        sourceUrl: window.location.pathname,
      }),
    }).catch(() => {});
    return true;
  }

  /* === MoMo exchange logic === */
  const numMomoAmt = parseInt(momoAmt) || 0;

  function validateMomo() {
    const e: Record<string, string> = {};
    if (srcOp === dstOp) e.dstOp = t("fa.momo_diff_op");
    const spD = srcPhone.replace(/\D/g, "").replace(/^237/, "");
    const dpD = dstPhone.replace(/\D/g, "").replace(/^237/, "");
    if (spD.length < 9) e.srcPhone = t("fa.momo_src_err");
    if (dpD.length < 9) e.dstPhone = t("fa.momo_dst_err");
    if (!momoAmt || numMomoAmt < 1000 || numMomoAmt > 500000) e.momoAmt = t("fa.momo_min");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t("err.email_valid");
    setMomoErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildMomoMsgPlain() {
    const src = MOMO_OPERATORS.find(o => o.id === srcOp)?.name ?? srcOp;
    const dst = MOMO_OPERATORS.find(o => o.id === dstOp)?.name ?? dstOp;
    const ref = orderIdRef.current ? ` — Réf #${orderIdRef.current.slice(-8).toUpperCase()}` : "";
    return `🔄 ÉCHANGE MOBILE MONEY${ref}\nDe : ${src} — +237 ${srcPhone}\nVers : ${dst} — +237 ${dstPhone}\nMontant : ${numMomoAmt.toLocaleString("fr-FR")} FCFA\nÀ recevoir : ${numMomoAmt.toLocaleString("fr-FR")} FCFA\nCommission : 0%`;
  }

  function handleMomoBeforeOpen() {
    const ok = validateMomo();
    if (!ok) { showToast(t("err.fix"), "error"); return false; }
    const srcName = MOMO_OPERATORS.find(o => o.id === srcOp)?.name ?? srcOp;
    const dstName = MOMO_OPERATORS.find(o => o.id === dstOp)?.name ?? dstOp;
    addEntry({
      service: "Échange MoMo",
      details: `${srcName} → ${dstName}`,
      amount: numMomoAmt,
      currency: "FCFA",
      status: "pending",
    });
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: (() => { const id = `momo-${srcOp}-${dstOp}-${Date.now()}`; orderIdRef.current = id; return id; })(),
        clientName: email.split("@")[0],
        clientEmail: email,
        clientPhone: srcPhone,
        paymentMethod: srcName,
        items: [{
          name: `Échange MoMo ${srcName} → ${dstName}`,
          qty: 1,
          price: numMomoAmt,
          amount: `${numMomoAmt.toLocaleString("fr-FR")} FCFA`,
          details: `De : +237 ${srcPhone} (${srcName})\nVers : +237 ${dstPhone} (${dstName})`,
        }],
        total: numMomoAmt,
        sourceUrl: window.location.pathname,
      }),
    }).catch(() => {});
    return true;
  }

  const inputCls  = "w-full px-4 py-3 rounded-2xl text-white text-sm outline-none";
  const inputBase = { background: "var(--bg-elevated)", border: "1px solid var(--border)" };
  const inputErr  = { ...inputBase, borderColor: "#EF4444" };

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/services" className="hover:text-white transition-colors">{t("nav.services")}</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>{t("fa.breadcrumb")}</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">{t("p.factures.title")}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        {t("p.factures.sub")}
      </p>

      {/* Tab toggle */}
      <div className="flex rounded-2xl p-1 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {([["factures", t("fa.tab_bills")], ["momo", t("fa.tab_momo")]] as [Tab, string][]).map(([tk, label]) => (
          <button
            key={tk}
            onClick={() => { setTab(tk); }}
            className="flex-1 py-3 rounded-xl font-black text-sm transition-all"
            style={{
              background: tab === tk ? "var(--gold)" : "transparent",
              color: tab === tk ? "#0A0A0A" : "var(--text-secondary)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {tab === "factures" ? (
          <motion.div key="factures" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col gap-5">

            {/* Biller selection */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>{t("fa.choose_biller")}</p>
              {facErrors.biller && <p className="text-xs font-semibold mb-2" style={{ color: "#EF4444" }}>{facErrors.biller}</p>}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FACTURE_BILLERS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setBiller(b.id); setFacErrors(p => ({ ...p, biller: "" })); }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all hover:-translate-y-0.5"
                    style={{
                      background: biller === b.id ? b.color + "22" : "var(--bg-card)",
                      border: `2px solid ${biller === b.id ? b.color : "var(--border)"}`,
                    }}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center"
                      style={{ background: b.color + "15" }}>
                      <Image src={b.image} alt={b.name} fill style={{ objectFit: "contain" }} unoptimized className="p-1" />
                    </div>
                    <p className="text-xs font-black" style={{ color: "var(--text-primary)" }}>{b.name}</p>
                    <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>{b.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Identifier type */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>{t("fa.identifier")}</p>
              <div className="flex gap-2">
                {([["phone", t("fa.id_phone")], ["decoder", t("fa.id_decoder")]] as [IdType, string][]).map(([idt, label]) => (
                  <button
                    key={idt}
                    onClick={() => { setIdType(idt); setIdentifier(""); setFacErrors(p => ({ ...p, identifier: "" })); }}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: idType === idt ? "var(--gold)" : "var(--bg-card)",
                      color: idType === idt ? "#0A0A0A" : "var(--text-secondary)",
                      border: `1px solid ${idType === idt ? "var(--gold)" : "var(--border)"}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Identifier input */}
            <Field label={t("fa.identifier")} error={facErrors.identifier}>
              <div className="flex items-center rounded-2xl overflow-hidden" style={facErrors.identifier ? inputErr : inputBase}>
                {idType === "phone" && (
                  <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                )}
                <input
                  type="tel"
                  placeholder={idType === "phone" ? "6XXXXXXXX" : "12345678901234"}
                  value={identifier}
                  maxLength={idType === "phone" ? 9 : 14}
                  onChange={e => { setIdentifier(e.target.value); setFacErrors(p => ({ ...p, identifier: "" })); }}
                  className="flex-1 px-4 py-3 bg-transparent text-white text-sm outline-none"
                  style={idType === "phone" ? { paddingLeft: 0 } : {}}
                />
              </div>
            </Field>

            {/* Amount */}
            <Field label={t("fa.bill_amount")} error={facErrors.amount}>
              <input
                type="number"
                min="500"
                placeholder="ex: 10 000"
                value={amount}
                onChange={e => { setAmount(e.target.value); setFacErrors(p => ({ ...p, amount: "" })); }}
                className={inputCls}
                style={facErrors.amount ? inputErr : inputBase}
              />
            </Field>

            <Field label={t("f.email")} error={facErrors.email}>
              <input
                type="email"
                placeholder={t("f.email.ph")}
                value={email}
                onChange={e => { setEmail(e.target.value); setFacErrors(p => ({ ...p, email: "" })); }}
                className={inputCls}
                style={facErrors.email ? inputErr : inputBase}
              />
            </Field>

            {/* Summary */}
            {numFacAmt >= 500 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-4"
                style={{ background: "#FF6B00" + "18", border: "1px solid #FF6B0044" }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "var(--text-secondary)" }}>{t("fa.bill_word")}</span>
                  <span className="text-white font-bold tabular-nums">{numFacAmt.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "var(--text-secondary)" }}>{t("fa.commission_fixed")}</span>
                  <span className="text-white font-bold tabular-nums">{FACTURE_COMMISSION} FCFA</span>
                </div>
                <div className="flex justify-between text-base pt-2" style={{ borderTop: "1px solid #FF6B0033" }}>
                  <span className="font-black text-white">{t("cart.total")}</span>
                  <span className="font-black tabular-nums" style={{ color: "var(--gold)" }}>{totalFacture.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </motion.div>
            )}

            {/* Mode de paiement préféré (optionnel) */}
            <PaymentMethodSelector value={payOp} onChange={setPayOp} />

            <div className="flex gap-2 items-stretch">
              {/* Cart button → mini dialog */}
              <div className="relative flex-1">
                <button
                  onClick={() => {
                    if (!validateFacture()) { showToast(t("err.fix"), "error"); return; }
                    setCartDialog(true);
                  }}
                  className="w-full h-full py-4 rounded-full font-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  {t("fa.cart")}
                </button>

                {/* Mini confirmation dialog */}
                {cartDialog && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setCartDialog(false)} />
                    <div className="absolute bottom-full mb-3 left-0 right-0 z-50 rounded-2xl p-4 flex flex-col gap-3"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", minWidth: 220 }}>
                      <p className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--gold)" }}>{t("fa.add_to_cart")}</p>
                      <div className="text-xs flex flex-col gap-1" style={{ color: "var(--text-secondary)" }}>
                        <p><span style={{ color: "var(--text-primary)" }} className="font-bold">{FACTURE_BILLERS.find(b => b.id === biller)?.name}</span></p>
                        <p>{t("fa.identifier")} : {identifier}</p>
                        <p className="font-black" style={{ color: "var(--gold)" }}>{totalFacture.toLocaleString("fr-FR")} FCFA</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setCartDialog(false)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold"
                          style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
                          {t("fa.cancel")}
                        </button>
                        <button
                          onClick={() => {
                            const billerName = FACTURE_BILLERS.find(b => b.id === biller)?.name ?? "";
                            addItem({
                              id: `facture-${biller}-${identifier}`,
                              cardName: `Facture ${billerName}`,
                              amount: `${numFacAmt.toLocaleString("fr-FR")} FCFA`,
                              price: totalFacture,
                              details: `Identifiant: ${identifier}`,
                              type: "buy",
                            });
                            setCartDialog(false);
                            showToast(t("toast.added_cart"), "success");
                          }}
                          className="flex-1 py-2 rounded-xl text-xs font-black text-white"
                          style={{ background: "var(--gold)", color: "#0A0A0A" }}>
                          {t("fa.confirm")}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <USSDOrderFlow
                total={totalFacture}
                getMsg={buildFactureMsgPlain}
                onBeforeOpen={handleFactureBeforeOpen}
                className="flex-1 py-4 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
                style={{ background: "#25D366" }}
              >
                <Image src={IMAGES.whatsapp} alt="" width={18} height={18} unoptimized className="shrink-0" />
                {t("fa.order")}
              </USSDOrderFlow>
            </div>
          </motion.div>
        ) : (
          <motion.div key="momo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col gap-5">

            {/* Info banner */}
            <div className="rounded-2xl p-4 text-xs font-semibold" style={{ background: "#1A1500", border: "1px solid var(--gold)" + "44", color: "var(--gold)" }}>
              {t("fa.momo_info")}
            </div>

            {/* Source */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>{t("fa.src_op")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {MOMO_OPERATORS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setSrcOp(o.id)}
                    className="flex flex-col items-center gap-1.5 py-2 px-2 rounded-xl text-[10px] font-bold transition-all"
                    style={{
                      background: srcOp === o.id ? o.color + "22" : "var(--bg-card)",
                      border: `2px solid ${srcOp === o.id ? o.color : "var(--border)"}`,
                      color: srcOp === o.id ? o.color : "var(--text-secondary)",
                    }}
                  >
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                      <Image src={o.image} alt={o.name} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                    <span className="leading-tight text-center">{o.name}</span>
                  </button>
                ))}
              </div>
              <Field label={t("fa.src_num")} error={momoErrors.srcPhone}>
                <div className="flex items-center rounded-2xl overflow-hidden" style={momoErrors.srcPhone ? inputErr : inputBase}>
                  <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                  <input
                    type="tel"
                    placeholder="6XXXXXXXX"
                    value={srcPhone}
                    maxLength={9}
                    onChange={e => { setSrcPhone(e.target.value); setMomoErrors(p => ({ ...p, srcPhone: "" })); }}
                    className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                  />
                </div>
              </Field>
            </div>

            {/* Arrow */}
            <div className="text-center text-2xl" style={{ color: "var(--gold)" }}>↓</div>

            {/* Destination */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>{t("fa.dst_op")}</p>
              {momoErrors.dstOp && <p className="text-xs font-semibold mb-2" style={{ color: "#EF4444" }}>{momoErrors.dstOp}</p>}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {MOMO_OPERATORS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => { setDstOp(o.id); setMomoErrors(p => ({ ...p, dstOp: "" })); }}
                    className="flex flex-col items-center gap-1.5 py-2 px-2 rounded-xl text-[10px] font-bold transition-all"
                    style={{
                      background: dstOp === o.id ? o.color + "22" : "var(--bg-card)",
                      border: `2px solid ${dstOp === o.id ? o.color : "var(--border)"}`,
                      color: dstOp === o.id ? o.color : "var(--text-secondary)",
                    }}
                  >
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                      <Image src={o.image} alt={o.name} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                    <span className="leading-tight text-center">{o.name}</span>
                  </button>
                ))}
              </div>
              <Field label={t("fa.dst_num")} error={momoErrors.dstPhone}>
                <div className="flex items-center rounded-2xl overflow-hidden" style={momoErrors.dstPhone ? inputErr : inputBase}>
                  <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                  <input
                    type="tel"
                    placeholder="6XXXXXXXX"
                    value={dstPhone}
                    maxLength={9}
                    onChange={e => { setDstPhone(e.target.value); setMomoErrors(p => ({ ...p, dstPhone: "" })); }}
                    className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                  />
                </div>
              </Field>
            </div>

            {/* Amount */}
            <Field label={t("fa.momo_amount_lbl")} error={momoErrors.momoAmt}>
              <input
                type="number"
                min="1000"
                max="500000"
                placeholder="ex: 20 000"
                value={momoAmt}
                onChange={e => { setMomoAmt(e.target.value); setMomoErrors(p => ({ ...p, momoAmt: "" })); }}
                className={inputCls}
                style={momoErrors.momoAmt ? inputErr : inputBase}
              />
            </Field>

            <Field label={t("f.email")} error={momoErrors.email}>
              <input
                type="email"
                placeholder={t("f.email.ph")}
                value={email}
                onChange={e => { setEmail(e.target.value); setMomoErrors(p => ({ ...p, email: "" })); }}
                className={inputCls}
                style={momoErrors.email ? inputErr : inputBase}
              />
            </Field>

            {/* Result */}
            {numMomoAmt >= 1000 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-4 flex justify-between items-center"
                style={{ background: "var(--gold)" + "15", border: `1px solid var(--gold)` + "44" }}
              >
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: "var(--gold)" }}>{t("fa.you_receive_0")}</p>
                  <p className="text-2xl font-black text-white tabular-nums">{numMomoAmt.toLocaleString("fr-FR")} FCFA</p>
                </div>
                <span className="text-3xl">✓</span>
              </motion.div>
            )}

            <USSDOrderFlow
              total={numMomoAmt}
              getMsg={buildMomoMsgPlain}
              onBeforeOpen={handleMomoBeforeOpen}
              className="w-full py-4 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "#25D366" }}
            >
              <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
              {t("fa.exchange_wa")}
            </USSDOrderFlow>
          </motion.div>
        )}
      </AnimatePresence>
      <StepGuide title={t("fa.guide_title")} steps={STEPS_FACTURES} />
      <FAQ items={PAGE_FAQ} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_FAQ_SCHEMA) }} />
      <RelatedServices current="factures" />
    </div>
  );
}
