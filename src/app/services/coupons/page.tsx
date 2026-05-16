"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COUPON_RATES, CONTACT, MOMO_OPERATORS } from "@/lib/services";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";

type CouponType = keyof typeof COUPON_RATES;

export default function CouponsPage() {
  const { addEntry } = useHistory();
  const { showToast } = useToast();

  const [type, setType]     = useState<CouponType>("pcs");
  const [amount, setAmount] = useState("");
  const [code, setCode]     = useState("");
  const [name, setName]     = useState("");
  const [momoOp, setMomoOp] = useState("orange");
  const [phone, setPhone]   = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rate     = COUPON_RATES[type];
  const numAmt   = parseFloat(amount) || 0;
  const netAmt   = rate.commission > 0 ? numAmt * (1 - rate.commission / 100) : numAmt;
  const fcfaResult = Math.round(netAmt * rate.rate);

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || numAmt <= 0) {
      e.amount = "Montant requis";
    } else if (numAmt < 20) {
      e.amount = "Minimum 20€";
    }
    if (!code.trim()) {
      e.code = "Code requis";
    } else if (type === "pcs" && code.trim().length !== rate.codeLength) {
      e.code = `Code PCS : exactement ${rate.codeLength} caractères alphanumériques`;
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

  function buildWAMsg() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const typeName = type === "pcs" ? "PCS Mastercard" : "Transcash";
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\n` +
      `🎫 ÉCHANGE COUPON\n` +
      `Type : ${typeName}\n` +
      `Valeur : ${amount}€\n` +
      `Code : ${code.trim()}\n` +
      `Commission : ${rate.commission}%\n` +
      `À recevoir : ${fcfaResult.toLocaleString("fr-FR")} FCFA\n\n` +
      `💰 Réception MoMo\n` +
      `Opérateur : ${op}\n` +
      `Numéro : +237 ${phone}\n` +
      `Nom : ${name}`,
    );
  }

  function handleOrder() {
    if (!validate()) { showToast("Corrigez les erreurs", "error"); return; }
    addEntry({
      service: `Coupons — Échange ${type === "pcs" ? "PCS Mastercard" : "Transcash"}`,
      details: `${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA`,
      amount: fcfaResult,
      currency: "FCFA",
      status: "pending",
      waText: buildWAMsg(),
    });
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
    <div className="max-w-xl mx-auto px-4 py-10">
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
        {/* Amount */}
        <Field label="Valeur du coupon (€ minimum 20€)" error={errors.amount}>
          <input
            type="number"
            min="20"
            placeholder="ex: 50"
            value={amount}
            onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
            className={inputCls}
            style={errors.amount ? inputErr : inputBase}
          />
        </Field>

        {/* Result */}
        {numAmt >= 20 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-4"
            style={{ background: "#1B5E20" + "22", border: "1px solid #25D36644" }}
          >
            <p className="text-xs font-bold mb-1" style={{ color: "#25D366" }}>Vous recevez</p>
            <p className="text-2xl font-black text-white">{fcfaResult.toLocaleString("fr-FR")} FCFA</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{rate.formula}</p>
          </motion.div>
        )}

        {/* Code coupon */}
        <Field label={`Code ${type === "pcs" ? "PCS (8 caractères)" : "Transcash (12 chiffres)"}`} error={errors.code}>
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
            className={inputCls}
            style={errors.code ? inputErr : inputBase}
          />
          <span className="text-xs self-end" style={{ color: "var(--text-muted)" }}>
            {code.length} / {rate.codeLength}
          </span>
        </Field>

        {/* Name */}
        <Field label="Nom du bénéficiaire" error={errors.name}>
          <input
            type="text"
            placeholder="Votre nom complet"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
            className={inputCls}
            style={errors.name ? inputErr : inputBase}
          />
        </Field>

        {/* MoMo */}
        <Field label="Réception Mobile Money" error={errors.phone}>
          <div className="flex gap-2">
            <select
              value={momoOp}
              onChange={e => setMomoOp(e.target.value)}
              className="px-3 py-3 rounded-2xl text-white text-sm outline-none shrink-0"
              style={inputBase}
            >
              {MOMO_OPERATORS.slice(0, 2).map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            <div className="flex flex-1 items-center rounded-2xl overflow-hidden" style={errors.phone ? inputErr : inputBase}>
              <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
              <input
                type="tel"
                placeholder="6XXXXXXXX"
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setErrors(p => ({ ...p, phone: "" })); }}
                className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
              />
            </div>
          </div>
        </Field>
      </div>

      <button
        onClick={handleOrder}
        className="w-full mt-8 py-4 rounded-full font-black text-white text-sm transition-opacity hover:opacity-85"
        style={{ background: "#25D366" }}
      >
        💬 Démarrer l'échange sur WhatsApp
      </button>

      {/* Steps */}
      <div className="mt-8 rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <p className="font-bold text-white text-sm mb-4">Comment ça marche ?</p>
        {["Remplissez le formulaire ci-dessus", "Cliquez sur le bouton WhatsApp", "Envoyez votre code coupon à notre agent", "Recevez vos FCFA sur Mobile Money en quelques minutes"].map((s, i) => (
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
