"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT, FACTURE_BILLERS, FACTURE_COMMISSION, MOMO_OPERATORS, IMAGES } from "@/lib/services";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";

type Tab = "factures" | "momo";
type IdType = "phone" | "decoder";

export default function FacturesPage() {
  const { addEntry } = useHistory();
  const { showToast } = useToast();

  const [tab, setTab]       = useState<Tab>("factures");

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
    if (!biller) e.biller = "Choisissez un fournisseur";
    if (idType === "phone" && identifier.length !== 9) e.identifier = "Numéro invalide (9 chiffres)";
    if (idType === "decoder" && identifier.length !== 14) e.identifier = "Numéro décodeur invalide (14 chiffres)";
    if (!amount || numFacAmt < 500) e.amount = "Montant minimum 500 FCFA";
    setFacErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildFactureMsg() {
    const billerName = FACTURE_BILLERS.find(b => b.id === biller)?.name ?? biller;
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\n` +
      `📋 PAIEMENT FACTURE\n` +
      `Fournisseur : ${billerName}\n` +
      `Identifiant : ${identifier} (${idType === "phone" ? "téléphone" : "décodeur"})\n` +
      `Montant facture : ${numFacAmt.toLocaleString("fr-FR")} FCFA\n` +
      `Commission : ${FACTURE_COMMISSION} FCFA\n` +
      `Total à payer : ${totalFacture.toLocaleString("fr-FR")} FCFA`,
    );
  }

  function handleFacture() {
    if (!validateFacture()) { showToast("Corrigez les erreurs", "error"); return; }
    addEntry({
      service: `Facture — ${FACTURE_BILLERS.find(b => b.id === biller)?.name}`,
      details: `${numFacAmt.toLocaleString("fr-FR")} FCFA + ${FACTURE_COMMISSION} FCFA commission`,
      amount: totalFacture,
      currency: "FCFA",
      status: "pending",
      waText: buildFactureMsg(),
    });
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${buildFactureMsg()}`, "_blank");
  }

  /* === MoMo exchange logic === */
  const numMomoAmt = parseInt(momoAmt) || 0;

  function validateMomo() {
    const e: Record<string, string> = {};
    if (srcOp === dstOp) e.dstOp = "L'opérateur source et destination doivent être différents";
    if (!srcPhone || srcPhone.length !== 9) e.srcPhone = "Numéro source invalide (9 chiffres)";
    if (!dstPhone || dstPhone.length !== 9) e.dstPhone = "Numéro destination invalide (9 chiffres)";
    if (!momoAmt || numMomoAmt < 1000 || numMomoAmt > 500000) e.momoAmt = "Montant entre 1 000 et 500 000 FCFA";
    setMomoErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildMomoMsg() {
    const src = MOMO_OPERATORS.find(o => o.id === srcOp)?.name ?? srcOp;
    const dst = MOMO_OPERATORS.find(o => o.id === dstOp)?.name ?? dstOp;
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\n` +
      `🔄 ÉCHANGE MOBILE MONEY\n` +
      `De : ${src} — +237 ${srcPhone}\n` +
      `Vers : ${dst} — +237 ${dstPhone}\n` +
      `Montant : ${numMomoAmt.toLocaleString("fr-FR")} FCFA\n` +
      `À recevoir : ${numMomoAmt.toLocaleString("fr-FR")} FCFA\n` +
      `Commission : 0%`,
    );
  }

  function handleMomo() {
    if (!validateMomo()) { showToast("Corrigez les erreurs", "error"); return; }
    addEntry({
      service: "Échange MoMo",
      details: `${MOMO_OPERATORS.find(o => o.id === srcOp)?.name} → ${MOMO_OPERATORS.find(o => o.id === dstOp)?.name}`,
      amount: numMomoAmt,
      currency: "FCFA",
      status: "pending",
      waText: buildMomoMsg(),
    });
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${buildMomoMsg()}`, "_blank");
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
        <span style={{ color: "var(--gold)" }}>Factures & Échange MoMo</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">Factures & Échange MoMo</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Payez vos factures camerounaises ou échangez de l'argent entre opérateurs Mobile Money.
      </p>

      {/* Tab toggle */}
      <div className="flex rounded-2xl p-1 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {([["factures", "📋 Paiement Factures"], ["momo", "🔄 Échange MoMo"]] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => { setTab(t); }}
            className="flex-1 py-3 rounded-xl font-black text-sm transition-all"
            style={{
              background: tab === t ? "var(--gold)" : "transparent",
              color: tab === t ? "#0A0A0A" : "var(--text-secondary)",
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
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Fournisseur</p>
              {facErrors.biller && <p className="text-xs font-semibold mb-2" style={{ color: "#EF4444" }}>{facErrors.biller}</p>}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FACTURE_BILLERS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setBiller(b.id); setFacErrors(p => ({ ...p, biller: "" })); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                    style={{
                      background: biller === b.id ? b.color + "22" : "var(--bg-card)",
                      border: `2px solid ${biller === b.id ? b.color : "var(--border)"}`,
                    }}
                  >
                    <span className="text-3xl">{b.emoji}</span>
                    <p className="text-xs font-black text-white">{b.name}</p>
                    <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>{b.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Identifier type */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Type d'identifiant</p>
              <div className="flex gap-2">
                {([["phone", "Numéro téléphone (9 chiffres)"], ["decoder", "Numéro décodeur (14 chiffres)"]] as [IdType, string][]).map(([t, label]) => (
                  <button
                    key={t}
                    onClick={() => { setIdType(t); setIdentifier(""); setFacErrors(p => ({ ...p, identifier: "" })); }}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: idType === t ? "var(--gold)" : "var(--bg-card)",
                      color: idType === t ? "#0A0A0A" : "var(--text-secondary)",
                      border: `1px solid ${idType === t ? "var(--gold)" : "var(--border)"}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Identifier input */}
            <Field label="Identifiant" error={facErrors.identifier}>
              <div className="flex items-center rounded-2xl overflow-hidden" style={facErrors.identifier ? inputErr : inputBase}>
                {idType === "phone" && (
                  <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                )}
                <input
                  type="tel"
                  placeholder={idType === "phone" ? "6XXXXXXXX" : "12345678901234"}
                  value={identifier}
                  maxLength={idType === "phone" ? 9 : 14}
                  onChange={e => { setIdentifier(e.target.value.replace(/\D/g, "").slice(0, idType === "phone" ? 9 : 14)); setFacErrors(p => ({ ...p, identifier: "" })); }}
                  className="flex-1 px-4 py-3 bg-transparent text-white text-sm outline-none"
                  style={idType === "phone" ? { paddingLeft: 0 } : {}}
                />
              </div>
            </Field>

            {/* Amount */}
            <Field label="Montant de la facture (min 500 FCFA)" error={facErrors.amount}>
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

            {/* Summary */}
            {numFacAmt >= 500 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-4"
                style={{ background: "#FF6B00" + "18", border: "1px solid #FF6B0044" }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "var(--text-secondary)" }}>Facture</span>
                  <span className="text-white font-bold tabular-nums">{numFacAmt.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "var(--text-secondary)" }}>Commission fixe</span>
                  <span className="text-white font-bold tabular-nums">{FACTURE_COMMISSION} FCFA</span>
                </div>
                <div className="flex justify-between text-base pt-2" style={{ borderTop: "1px solid #FF6B0033" }}>
                  <span className="font-black text-white">Total</span>
                  <span className="font-black tabular-nums" style={{ color: "var(--gold)" }}>{totalFacture.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </motion.div>
            )}

            <button
              onClick={handleFacture}
              className="w-full py-4 rounded-full font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "#25D366" }}
            >
              <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
              Envoyer la demande de paiement
            </button>
          </motion.div>
        ) : (
          <motion.div key="momo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col gap-5">

            {/* Info banner */}
            <div className="rounded-2xl p-4 text-xs font-semibold" style={{ background: "#1A1500", border: "1px solid var(--gold)" + "44", color: "var(--gold)" }}>
              🔄 Échange 1:1 — 0% commission · Taux appliqué : 1 FCFA = 1 FCFA
            </div>

            {/* Source */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Opérateur source (vous envoyez)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {MOMO_OPERATORS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setSrcOp(o.id)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: srcOp === o.id ? o.color + "22" : "var(--bg-card)",
                      border: `2px solid ${srcOp === o.id ? o.color : "var(--border)"}`,
                      color: srcOp === o.id ? o.color : "var(--text-secondary)",
                    }}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
              <Field label="Numéro source (+237)" error={momoErrors.srcPhone}>
                <div className="flex items-center rounded-2xl overflow-hidden" style={momoErrors.srcPhone ? inputErr : inputBase}>
                  <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                  <input
                    type="tel"
                    placeholder="6XXXXXXXX"
                    value={srcPhone}
                    onChange={e => { setSrcPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setMomoErrors(p => ({ ...p, srcPhone: "" })); }}
                    className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                  />
                </div>
              </Field>
            </div>

            {/* Arrow */}
            <div className="text-center text-2xl" style={{ color: "var(--gold)" }}>↓</div>

            {/* Destination */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Opérateur destination (vous recevez)</p>
              {momoErrors.dstOp && <p className="text-xs font-semibold mb-2" style={{ color: "#EF4444" }}>{momoErrors.dstOp}</p>}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {MOMO_OPERATORS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => { setDstOp(o.id); setMomoErrors(p => ({ ...p, dstOp: "" })); }}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: dstOp === o.id ? o.color + "22" : "var(--bg-card)",
                      border: `2px solid ${dstOp === o.id ? o.color : "var(--border)"}`,
                      color: dstOp === o.id ? o.color : "var(--text-secondary)",
                    }}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
              <Field label="Numéro destination (+237)" error={momoErrors.dstPhone}>
                <div className="flex items-center rounded-2xl overflow-hidden" style={momoErrors.dstPhone ? inputErr : inputBase}>
                  <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                  <input
                    type="tel"
                    placeholder="6XXXXXXXX"
                    value={dstPhone}
                    onChange={e => { setDstPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setMomoErrors(p => ({ ...p, dstPhone: "" })); }}
                    className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                  />
                </div>
              </Field>
            </div>

            {/* Amount */}
            <Field label="Montant (1 000 – 500 000 FCFA)" error={momoErrors.momoAmt}>
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

            {/* Result */}
            {numMomoAmt >= 1000 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-4 flex justify-between items-center"
                style={{ background: "var(--gold)" + "15", border: `1px solid var(--gold)` + "44" }}
              >
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: "var(--gold)" }}>Vous recevez (0% commission)</p>
                  <p className="text-2xl font-black text-white tabular-nums">{numMomoAmt.toLocaleString("fr-FR")} FCFA</p>
                </div>
                <span className="text-3xl">✓</span>
              </motion.div>
            )}

            <button
              onClick={handleMomo}
              className="w-full py-4 rounded-full font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
              style={{ background: "#25D366" }}
            >
              <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
              Initier l'échange via WhatsApp
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
