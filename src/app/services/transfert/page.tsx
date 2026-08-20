"use client";

import React, { useState } from "react";
import { CONTACT } from '@/lib/services';
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TransfertPage() {
  const { showToast } = useToast();
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black mb-4">CHREOL EMPIRE TRANSFER : Votre argent, notre priorité !</h1>
      <p className="text-lg mb-6" style={{ color: "var(--text-secondary)" }}>Besoin d'envoyer de l'argent en Afrique ? Nous couvrons désormais <strong>16 destinations</strong> avec des frais transparents et une rapidité exemplaire.</p>

      <section className="rounded-2xl p-6 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-2xl font-bold mb-3">📊 NOS TARIFS (Frais par transaction)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <ul className="space-y-2">
              <li>5 000 – 25 000 FCFA : <strong>2 500 FCFA</strong></li>
              <li>25 001 – 50 000 FCFA : <strong>3 500 FCFA</strong></li>
              <li>50 001 – 100 000 FCFA : <strong>5 000 FCFA</strong></li>
              <li>100 001 – 200 000 FCFA : <strong>8 000 FCFA</strong></li>
              <li>200 001 – 300 000 FCFA : <strong>10 000 FCFA</strong></li>
              <li>300 001 – 500 000 FCFA : <strong>3 %</strong></li>
              <li>500 001 – 1 000 000 FCFA : <strong>2,8 %</strong></li>
              <li>Plus de 1 000 000 FCFA : <strong>Tarif personnalisé</strong></li>
            </ul>
          </div>
          <div>
            <p className="mb-2">✅ <strong>Zéro surprise</strong> : Les frais sont affichés avant la validation.</p>
            <p className="mb-2">✅ <strong>Fiabilité</strong> : Votre transfert est traité en priorité.</p>
            <p className="mb-2">Nous couvrons les destinations suivantes :</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Gabon 🇬🇦','Congo Brazzaville 🇨🇬','RDC Kinshasa 🇨🇩','Nigeria 🇳🇬','Sénégal 🇸🇳','Bénin 🇧🇯','Togo 🇹🇬','Burkina Faso 🇧🇫','Rwanda 🇷🇼','Kenya 🇰🇪','Ghana 🇬🇭','Mali 🇲🇱','Tanzanie 🇹🇿','Ouganda 🇺🇬','Tunisie 🇹🇳','Liberia 🇱🇷'
              ].map(d => (
                <span key={d} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl p-6 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-2xl font-bold mb-3">💳 NOS MODES DE PAIEMENT</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-bold">🔹 OPTION A – Traitement rapide (Recommandé)</h3>
            <p>Donnez votre numéro <strong>MTN</strong> ou <strong>Orange Money</strong>, nous initions le retrait et vous validez de votre côté.</p>
          </div>

          <div>
            <h3 className="font-bold">🔹 OPTION B – Paiement par code USSD</h3>
            <p><strong>MTN (Flotte)</strong> : composez <code>*126*14*672416141*montant#</code> (Nom : ETS Content)</p>
            <p><strong>ORANGE (Transfert UV)</strong> : composez <code>#150*14*518554*692251299*montant#</code> (Nom : Ets Tagny)</p>
          </div>

          <div>
            <h3 className="font-bold">🔹 OPTION C – Cryptomonnaies</h3>
            <p>Nous acceptons : <strong>USDT, BTC, SOL, TRX, BNB</strong>, et d'autres sur demande.</p>
          </div>

          <div>
            <h3 className="font-bold">🔹 OPTION D – Virement bancaire</h3>
            <p>Disponible sur demande uniquement.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl p-6 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-2xl font-bold mb-3">👉 CONTACTEZ-NOUS</h2>
        <div className="space-y-2 text-sm">
          <p>🟢 <strong>WhatsApp</strong> : +237 697 657 734</p>
          <p>🔵 <strong>Telegram</strong> : @chreolempire0</p>
          <p>🔵 <strong>Canal Telegram</strong> : @camerbizventes</p>
          <p>🔵 <strong>Facebook</strong> : @chreolempire</p>
          <p>Envoyez <strong>"TRANSFER"</strong> en message privé.</p>
          <p>Visitez notre boutique : <a href="https://shop.chreolempire.com" target="_blank" rel="noreferrer" className="font-bold text-var">shop.chreolempire.com</a></p>
        </div>

        <div className="mt-4">
          <button
            className="px-4 py-3 rounded-2xl font-black bg-var text-white"
            onClick={() => {
              try {
                navigator.clipboard.writeText('TRANSFER');
                showToast('Texte copié — envoyez TRANSFER en message privé', 'success');
              } catch (e) {
                showToast('Copie impossible — envoyez TRANSFER manuellement', 'error');
              }
            }}
          >Envoyer "TRANSFER" en message privé</button>
        </div>
      </section>

      <section className="rounded-2xl p-6 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-2xl font-bold mb-3">📥 Demande de transfert — Formulaire</h2>
        <TransferForm />
      </section>
    </div>
  );
}

function TransferForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", beneficiaryName: "", beneficiaryNetwork: "MTN", beneficiaryCountry: "Gabon", beneficiaryNumber: "", amount: "", destination: "Gabon", payment: "MTN", notes: "", sourceUrl: typeof window !== 'undefined' ? window.location.href : '' });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [touched, setTouched] = useState<Record<string,boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  function computeFee(amountValue: number): number | null {
    if (!amountValue || isNaN(amountValue)) return 0;
    if (amountValue <= 25000) return 2500;
    if (amountValue <= 50000) return 3500;
    if (amountValue <= 100000) return 5000;
    if (amountValue <= 200000) return 8000;
    if (amountValue <= 300000) return 10000;
    if (amountValue <= 500000) return Math.round(amountValue * 0.03);
    if (amountValue <= 1000000) return Math.round(amountValue * 0.028);
    return null; // ask to contact for large amounts
  }

  function validateForm(f?: typeof form) {
    const cur = f ?? form;
    const errs: Record<string, string> = {};
    if (!cur.phone || !/^\+?\d{7,15}$/.test(cur.phone)) errs.phone = 'Téléphone invalide (ex: +2376...)';
    if (!cur.amount || isNaN(Number(cur.amount)) || Number(cur.amount) <= 0) errs.amount = 'Montant invalide';
    if (!cur.destination) errs.destination = 'Destination requise';
    if (!cur.beneficiaryNumber || !/\d{6,15}/.test(cur.beneficiaryNumber)) errs.beneficiaryNumber = 'Numéro du bénéficiaire invalide';
    return errs;
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = e.target.name === 'amount' ? e.target.value.replace(/[^0-9]/g, '') : e.target.value;
    const newForm = { ...form, [e.target.name]: value };
    setForm(newForm);
    setErrors(validateForm(newForm));
  }

  function onBlurField(name: string) {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validateForm());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      setSubmitAttempted(true);
      const curErrors = validateForm();
      setErrors(curErrors);
      if (Object.keys(curErrors).length) {
        const first = Object.values(curErrors)[0];
        showToast(first, 'error');
        setLoading(false);
        return;
      }

      // Build WhatsApp message and open it (user gesture) while submitting request in background
      const waAdmin = CONTACT.whatsapp.replace(/\D/g, '');
      const msg = `Demande de transfert:\nNom: ${form.name || '-'}\nTel: ${form.phone || '-'}\nMontant: ${form.amount || '-'} FCFA\nDestination: ${form.destination || '-'}\nBénéficiaire: ${form.beneficiaryName || '-'} (${form.beneficiaryNetwork || '-'}) - ${form.beneficiaryNumber || '-'}\nNotes: ${form.notes || '-'}`;
      const waLink = `https://wa.me/${waAdmin}?text=${encodeURIComponent(msg)}`;
      // open WhatsApp first (user gesture)
      window.open(waLink, '_blank');

      // Submit request to server
      const res = await fetch('/api/transfert-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Erreur serveur');
      showToast('Demande envoyée — nous vous contacterons bientôt', 'success');
      setForm({ name: "", email: "", phone: "", beneficiaryName: "", beneficiaryNetwork: "MTN", beneficiaryCountry: "Gabon", beneficiaryNumber: "", amount: "", destination: "Gabon", payment: "MTN", notes: "", sourceUrl: typeof window !== 'undefined' ? window.location.href : '' });
    } catch (err) {
      showToast((err as any)?.message || 'Erreur envoi demande', 'error');
    } finally { setLoading(false); }
  }

  const amountNum = Number(form.amount || 0);
  const fee = computeFee(amountNum);
  const total = fee === null ? null : amountNum + (fee || 0);
  const isValid = Object.keys(validateForm()).length === 0;
  function inputClass(name: string) {
    const base = 'p-3 rounded-lg bg-black text-white/90 border';
    const showError = Boolean(errors[name] && (touched[name] || submitAttempted));
    return showError ? `${base} border-red-500` : base;
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="name" value={form.name} onChange={onChange} placeholder="Votre nom" className="p-3 rounded-lg bg-black text-white/90 border" />
          <input name="email" value={form.email} onChange={onChange} placeholder="Email (optionnel)" className="p-3 rounded-lg bg-black text-white/90 border" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input name="phone" value={form.phone} onChange={onChange} onBlur={() => onBlurField('phone')} placeholder="Téléphone (ex: +2376...)" className={inputClass('phone')} />
        {(errors.phone && (touched.phone || submitAttempted)) ? <p className="text-xs text-red-500 mt-1">{errors.phone}</p> : null}
        <input name="beneficiaryName" value={form.beneficiaryName} onChange={onChange} placeholder="Nom du bénéficiaire" className="p-3 rounded-lg bg-black text-white/90 border" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input name="amount" value={form.amount} onChange={onChange} onBlur={() => onBlurField('amount')} placeholder="Montant (FCFA)" className={inputClass('amount')} />
        {(errors.amount && (touched.amount || submitAttempted)) ? <p className="text-xs text-red-500 mt-1">{errors.amount}</p> : null}
        <select name="destination" value={form.destination} onChange={onChange} className="p-3 rounded-lg bg-black text-white/90 border">
          {['Gabon','Congo Brazzaville','RDC Kinshasa','Nigeria','Sénégal','Bénin','Togo','Burkina Faso','Rwanda','Kenya','Ghana','Mali','Tanzanie','Ouganda','Tunisie','Liberia'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="payment" value={form.payment} onChange={onChange} className="p-3 rounded-lg bg-black text-white/90 border">
          <option value="MTN">MTN MoMo</option>
          <option value="Orange">Orange Money</option>
          <option value="Crypto">Cryptomonnaie</option>
          <option value="Bank">Virement bancaire</option>
        </select>
      </div>
      {form.amount ? (
        <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
          <p className="text-sm">Frais estimés: {fee === null ? (<span className="font-semibold">Contactez-nous pour les montants supérieurs à 1 000 000 FCFA</span>) : (<span className="font-semibold">{fee.toLocaleString()} FCFA</span>)}</p>
          <p className="text-sm">Montant à payer à CHREOL EMPIRE: {total === null ? (<span className="font-semibold">Contactez-nous</span>) : (<span className="font-semibold">{total.toLocaleString()} FCFA</span>)}</p>
        </div>
      ) : null}
      <h3 className="font-bold">Informations du bénéficiaire</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select name="beneficiaryNetwork" value={form.beneficiaryNetwork} onChange={onChange} className="p-3 rounded-lg bg-black text-white/90 border">
          <option value="MTN">MTN</option>
          <option value="Orange">Orange</option>
          <option value="Gimac">GIMAC</option>
          <option value="ExpressUnion">Express Union</option>
        </select>
        <select name="beneficiaryCountry" value={form.beneficiaryCountry} onChange={onChange} className="p-3 rounded-lg bg-black text-white/90 border">
          {['Gabon','Congo Brazzaville','RDC Kinshasa','Nigeria','Sénégal','Bénin','Togo','Burkina Faso','Rwanda','Kenya','Ghana','Mali','Tanzanie','Ouganda','Tunisie','Liberia'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <input name="beneficiaryNumber" value={form.beneficiaryNumber} onChange={onChange} onBlur={() => onBlurField('beneficiaryNumber')} placeholder="Numéro mobile du bénéficiaire" className={inputClass('beneficiaryNumber')} />
        {(errors.beneficiaryNumber && (touched.beneficiaryNumber || submitAttempted)) ? <p className="text-xs text-red-500 mt-1">{errors.beneficiaryNumber}</p> : null}
        <input name="beneficiaryName" value={form.beneficiaryName} onChange={onChange} placeholder="Nom sur le compte mobile" className="p-3 rounded-lg bg-black text-white/90 border" />
      </div>
      <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Informations supplémentaires (optionnel)" className="p-3 rounded-lg bg-black text-white/90 border" />
      <div className="flex gap-3">
        <button type="submit" className="px-4 py-3 rounded-2xl font-black bg-var text-white" disabled={!isValid || loading}>{loading ? 'Envoi…' : 'Envoyer la demande'}</button>
        <button type="button" className="px-4 py-3 rounded-2xl font-black border" onClick={() => { setForm({ name: "", email: "", phone: "", beneficiaryName: "", beneficiaryNetwork: "MTN", beneficiaryCountry: "Gabon", beneficiaryNumber: "", amount: "", destination: "Gabon", payment: "MTN", notes: "", sourceUrl: typeof window !== 'undefined' ? window.location.href : '' }); showToast('Formulaire réinitialisé', 'info'); }}>Réinitialiser</button>
      </div>
    </form>
  );
}
