"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COUPON_RATES, CONTACT, MOMO_OPERATORS } from "@/lib/services";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";

type CouponType = keyof typeof COUPON_RATES;

export default function CouponsPage() {
  const { addItem } = useCart();
  const { addEntry } = useHistory();
  const { showToast } = useToast();

  const [type, setType]     = useState<CouponType>("pcs");
  const [amount, setAmount] = useState("");
  const [code, setCode]     = useState("");
  const [name, setName]     = useState("");
  const [momoOp, setMomoOp] = useState("orange");
  const [phone, setPhone]   = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rate       = COUPON_RATES[type];
  const numAmt     = parseFloat(amount) || 0;
  const commission = rate.commission > 0 ? numAmt * rate.commission / 100 : 0;
  const netAmt     = numAmt - commission;
  const fcfaResult = Math.round(netAmt * rate.rate);

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || numAmt <= 0) { e.amount = "Montant requis"; }
    else if (numAmt < 20)       { e.amount = "Minimum 20€"; }
    if (!code.trim()) {
      e.code = "Code requis";
    } else if (type === "pcs" && code.trim().length !== rate.codeLength) {
      e.code = `Code PCS : exactement ${rate.codeLength} caractères`;
    } else if (type === "transcash" && !/^\d+$/.test(code.trim())) {
      e.code = "Code Transcash : chiffres uniquement";
    } else if (type === "transcash" && code.trim().length !== rate.codeLength) {
      e.code = `Code Transcash : exactement ${rate.codeLength} chiffres`;
    }
    if (!name.trim()) e.name = "Nom requis";
    if (!phone || phone.length !== 9) e.phone = "Numéro invalide (9 chiffres)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildDetails() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const typeName = type === "pcs" ? "PCS Mastercard" : "Transcash";
    return `${typeName} ${amount}€ | Code : ${code.trim()}\n${op} +237 ${phone} | Nom : ${name}`;
  }

  function buildWAMsg() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const typeName = type === "pcs" ? "PCS Mastercard" : "Transcash";
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\n🎫 ÉCHANGE COUPON\nType : ${typeName}\nValeur : ${amount}€\nCode : ${code.trim()}\nCommission : ${rate.commission}%\nÀ recevoir : ${fcfaResult.toLocaleString("fr-FR")} FCFA\n\n💰 Réception MoMo\nOpérateur : ${op}\nNuméro : +237 ${phone}\nNom : ${name}`,
    );
  }

  function handleAddToCart() {
    if (!validate()) { showToast("Corrigez les erreurs avant d'ajouter au panier", "error"); return; }
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    addItem({
      id: `coupon-${type}-${Date.now()}`,
      cardName: `Échange ${type === "pcs" ? "PCS Mastercard" : "Transcash"}`,
      amount: `${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA via ${op}`,
      price: fcfaResult,
      type: "sell",
      details: buildDetails(),
    });
    addEntry({
      service: `Coupons — ${type === "pcs" ? "PCS Mastercard" : "Transcash"}`,
      details: `${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA`,
      amount: fcfaResult,
      currency: "FCFA",
      status: "pending",
    });
    showToast("Coupon ajouté au panier !", "success");
  }

  function handleWhatsApp() {
    if (!validate()) { showToast("Corrigez les erreurs", "error"); return; }
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${buildWAMsg()}`, "_blank");
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
    <div className="max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/services" className="hover:text-white transition-colors">Services</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Échange Coupons</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">Échange Coupons</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Échangez vos coupons PCS ou Transcash contre du FCFA sur votre Mobile Money.
      </p>

      {/* Type selector */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {(Object.entries(COUPON_RATES) as [CouponType, typeof COUPON_RATES.pcs][]).map(([k, r]) => (
          <button
            key={k}
            onClick={() => { setType(k); setCode(""); setErrors({}); }}
            className="p-4 rounded-2xl text-left transition-all"
            style={{
              background: type === k ? "#1B5E20" + "44" : "var(--bg-card)",
              border: `2px solid ${type === k ? "#25D366" : "var(--border)"}`,
            }}
          >
            <p className="font-black text-white text-sm">{k === "pcs" ? "PCS Mastercard" : "Transcash"}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              {r.rate} FCFA/€ · {r.commission > 0 ? `${r.commission}% commission` : "0% commission"}
            </p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
              Code : {r.codeLength} {r.codeType === "alphanumérique" ? "chars" : "chiffres"}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <Field label="Valeur du coupon (€ — minimum 20€)" error={errors.amount}>
          <input
            type="number" min="20" placeholder="ex: 50"
            value={amount}
            onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
            className={inputCls} style={errors.amount ? inputErr : inputBase}
          />
        </Field>

        {/* Tableau de calcul */}
        {numAmt >= 20 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-4"
            style={{ background: "#1B5E20" + "22", border: "1px solid #25D36644" }}
          >
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: "#25D366" }}>
              Tableau de calcul
            </p>
            <div className="flex flex-col">
              {[
                ["Valeur du coupon", `${numAmt}€`],
                ...(rate.commission > 0
                  ? [
                    [`Commission ${type.toUpperCase()} (${rate.commission}%)`, `− ${commission.toFixed(2)}€`],
                    ["Valeur nette", `${netAmt.toFixed(2)}€`],
                  ]
                  : [["Commission", "0€ (0%)"]]),
                ["Taux d'échange", `${rate.rate} FCFA/€`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                  <span className="text-sm font-bold text-white tabular-nums">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 mt-1">
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: "#25D366" }}>Vous recevez</span>
                <span className="text-xl font-black tabular-nums" style={{ color: "var(--gold)" }}>
                  {fcfaResult.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <Field label={`Code ${type === "pcs" ? "PCS (8 caractères alphanumériques)" : "Transcash (12 chiffres)"}`} error={errors.code}>
          <div className="relative">
            <input
              type="text"
              placeholder={type === "pcs" ? "XXXXXXXX" : "123456789012"}
              value={code}
              maxLength={type === "pcs" ? 8 : 12}
              onChange={e => {
                const val = type === "transcash" ? e.target.value.replace(/\D/g, "") : e.target.value.toUpperCase();
                setCode(val);
                setErrors(p => ({ ...p, code: "" }));
              }}
              className={inputCls + " pr-24"}
              style={errors.code ? inputErr : inputBase}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: code.length === rate.codeLength ? "#25D366" : "var(--text-muted)" }}>
              {code.length}/{rate.codeLength}
            </span>
          </div>
        </Field>

        <Field label="Nom du bénéficiaire" error={errors.name}>
          <input type="text" placeholder="Votre nom complet" value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
            className={inputCls} style={errors.name ? inputErr : inputBase}
          />
        </Field>

        <Field label="Réception Mobile Money" error={errors.phone}>
          <div className="flex gap-2">
            <select value={momoOp} onChange={e => setMomoOp(e.target.value)} className="px-3 py-3 rounded-2xl text-white text-sm outline-none shrink-0" style={inputBase}>
              {MOMO_OPERATORS.slice(0, 2).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <div className="flex flex-1 items-center rounded-2xl overflow-hidden" style={errors.phone ? inputErr : inputBase}>
              <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
              <input type="tel" placeholder="6XXXXXXXX" value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setErrors(p => ({ ...p, phone: "" })); }}
                className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
              />
            </div>
          </div>
        </Field>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={handleAddToCart}
          className="w-full py-4 rounded-full font-black text-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
          style={{ background: "var(--gold)" }}
        >
          🛒 Ajouter au panier
        </button>
        <button
          onClick={handleWhatsApp}
          className="w-full py-3 rounded-full font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
          style={{ background: "#25D366" }}
        >
          💬 Démarrer directement via WhatsApp
        </button>
      </div>

      <div className="mt-8 rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <p className="font-bold text-white text-sm mb-4">Comment ça marche ?</p>
        {["Remplissez le formulaire et vérifiez le calcul", "Cliquez sur Ajouter au panier ou WhatsApp", "Notre agent vérifie votre code coupon", "Recevez vos FCFA sur Mobile Money en quelques minutes"].map((s, i) => (
          <div key={i} className="flex items-start gap-3 text-xs mb-3 last:mb-0" style={{ color: "var(--text-secondary)" }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
              {i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
