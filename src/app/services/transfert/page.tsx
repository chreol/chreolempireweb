"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CONTACT } from '@/lib/services';
import { useToast } from "@/components/Toast";
import TransferRatesModal from '@/components/TransferRatesModal';
import { useLanguage } from "@/contexts/LanguageContext";
import faq from '@/data/transfert-faq.json';

export default function TransfertPage() {
  const { showToast } = useToast();
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <TransferRatesModal />
      <section className="relative isolate overflow-hidden rounded-2xl mb-6 min-h-[300px] flex items-end">
        <Image
          src="/assets/Chreol%20Empire%20Transfert.png"
          alt="Chreol Empire Transfer : envoi d'argent du Cameroun vers l'Afrique"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
        <div className="relative z-10 p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-3 text-white">CHREOL EMPIRE TRANSFER : Votre argent, notre priorité !</h1>
          <p className="text-base sm:text-lg text-white/90">Envoyez de l'argent du Cameroun vers toute l'Afrique rapidement et en toute sécurité.</p>
        </div>
      </section>
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
        </div>

        {/* Formulaire placé directement sous NOS TARIFS */}
        <div id="formulaire" className="mt-6">
          <h3 className="text-lg font-bold mb-3">Formulaire de demande</h3>
          <TransferForm />
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
        <h2 className="text-2xl font-bold mb-3">👉 COMMENT INITIER UN TRANSFERT D'ARGENT</h2>
        <ol className="list-decimal list-inside text-sm space-y-2">
          <li>Choisissez la destination et le montant dans notre formulaire.</li>
          <li>Vérifiez les frais estimés affichés sous le champ montant.</li>
          <li>Fournissez les coordonnées complètes du bénéficiaire (numéro, nom, réseau).</li>
          <li>Choisissez le mode de paiement (MTN/Orange/Crypto/Virement).</li>
          <li>Validez la demande — vous recevrez une confirmation et un message pour finaliser le paiement.</li>
          <li>Après confirmation du paiement, nous traitons le transfert et le bénéficiaire reçoit les fonds.</li>
        </ol>
      </section>

      <section className="rounded-2xl p-6 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-2xl font-bold mb-3">❓ FAQ — Transfert d'argent</h2>
        <div className="space-y-3 text-sm">
          {faq.map((q: any, i: number) => (
            <div key={i}>
              <p className="font-bold">{q.question}</p>
              <p>{q.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl p-6 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-2xl font-bold mb-3">🔁 Autres services disponibles</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/services/cartes-cadeaux" className="px-3 py-2 rounded-full bg-black/10 text-sm">🎮 Cartes Cadeaux</a>
          <a href="/services/crypto" className="px-3 py-2 rounded-full bg-black/10 text-sm">₿ Crypto &amp; MoMo</a>
          <a href="/services/coupons" className="px-3 py-2 rounded-full bg-black/10 text-sm">🎫 Coupons PCS / Transcash</a>
          <a href="/services/uba" className="px-3 py-2 rounded-full bg-black/10 text-sm">💳 UBA Cameroun</a>
          <a href="/services/paypal" className="px-3 py-2 rounded-full bg-black/10 text-sm">💸 PayPal Europe</a>
          <a href="/services/factures" className="px-3 py-2 rounded-full bg-black/10 text-sm">🔄 Paiement Factures</a>
        </div>
      </section>

      
    </div>
  );
}

function TransferForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const emptyForm = { name: "", email: "", phone: "", senderCountry: "Cameroun", paymentNetwork: "Crypto USDT", beneficiaryName: "", beneficiaryNetwork: "MTN", beneficiaryNumber: "", amount: "", destination: "Cameroun", payment: "Crypto USDT", notes: "", sourceUrl: typeof window !== 'undefined' ? window.location.href : '' };
  const [form, setForm] = useState(emptyForm);
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
    if (!cur.name || !cur.name.trim()) errs.name = 'Nom requis';
    if (cur.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cur.email)) errs.email = 'Email invalide';
    if (!cur.phone || !/^\+?\d{7,15}$/.test(cur.phone)) errs.phone = 'Téléphone invalide (ex: +2376...)';
    if (!cur.amount || isNaN(Number(cur.amount)) || Number(cur.amount) <= 0) errs.amount = 'Montant invalide';
    if (!cur.senderCountry) errs.senderCountry = 'Pays de l’expéditeur requis';
    if (!cur.paymentNetwork) errs.paymentNetwork = 'Réseau de paiement requis';
    if (!cur.destination) errs.destination = 'Pays du bénéficiaire requis';
    if (!cur.beneficiaryNumber || !/\d{6,15}/.test(cur.beneficiaryNumber)) errs.beneficiaryNumber = 'Numéro du bénéficiaire invalide';
    if (!cur.beneficiaryName || !cur.beneficiaryName.trim()) errs.beneficiaryName = 'Nom du bénéficiaire requis';
    if (!cur.beneficiaryNetwork) errs.beneficiaryNetwork = 'Réseau du bénéficiaire requis';
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
      const msg = `Demande de transfert:\nExpéditeur : ${form.name || '-'}, ${form.phone || '-'}, ${form.amount || '-'} FCFA, du ${form.senderCountry || '-'}, paiement par ${form.paymentNetwork || '-'}\nBénéficiaire : ${form.destination || '-'}, ${form.beneficiaryNetwork || '-'}, ${form.beneficiaryNumber || '-'}, ${form.beneficiaryName || '-'}\nInformations : ${form.notes || '-'}`;
      const waLink = `https://wa.me/${waAdmin}?text=${encodeURIComponent(msg)}`;
      // open WhatsApp first (user gesture)
      window.open(waLink, '_blank');

      // Submit request to server
      const res = await fetch('/api/transfert-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Erreur serveur');
      showToast('Demande envoyée — nous vous contacterons bientôt', 'success');
      setForm(emptyForm);
    } catch (err) {
      showToast((err as any)?.message || 'Erreur envoi demande', 'error');
    } finally { setLoading(false); }
  }

  const amountNum = Number(form.amount || 0);
  const fee = computeFee(amountNum);
  const total = fee === null ? null : amountNum + (fee || 0);
  const isValid = Object.keys(validateForm()).length === 0;
  // country -> networks mapping (used to populate beneficiary network options)
  const networkMap: Record<string, string[]> = {
    'Cameroun': ['MTN', 'Orange', 'ExpressUnion'],
    "Côte d'Ivoire": ['Wave', 'Orange', 'MTN'],
    'Gabon': ['MTN', 'Orange', 'GIMAC', 'ExpressUnion'],
    'Congo Brazzaville': ['MTN', 'Orange', 'ExpressUnion'],
    'RDC Kinshasa': ['Vodacom', 'Airtel', 'Orange'],
    'Nigeria': ['MTN', 'Airtel', 'Glo', '9Mobile'],
    'Sénégal': ['Orange', 'Free', 'Tigo'],
    'Bénin': ['MTN', 'Moov', 'Flooz'],
    'Togo': ['Moov', 'TogoCell'],
    'Burkina Faso': ['Orange', 'Telecel'],
    'Rwanda': ['MTN', 'Airtel'],
    'Kenya': ['M-Pesa', 'Airtel'],
    'Ghana': ['MTN', 'Vodafone'],
    'Mali': ['Orange', 'Orange Money'],
    'Tanzanie': ['Vodacom', 'Airtel'],
    'Ouganda': ['MTN', 'Airtel'],
    'Tunisie': ['Orange', 'Ooredoo'],
    'Liberia': ['Lonestar', 'MTN']
  };
  const networks = networkMap[form.destination] ?? ['MTN', 'Orange', 'GIMAC', 'ExpressUnion'];
  const senderPaymentNetworks = ['MTN Mobile Money', 'Orange Money', 'Crypto USDT', 'Crypto BTC', 'Crypto SOL', 'Express Union', 'Yoomee Money', 'Virement bancaire'];
  function inputClass(name: string) {
    const base = 'p-3 rounded-lg border';
    const showError = Boolean(errors[name] && (touched[name] || submitAttempted));
    return showError ? `${base} border-red-500` : base;
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 text-sm">
      <fieldset className="rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
        <legend className="px-2 text-sm font-black" style={{ color: 'var(--gold)' }}>1. Informations de l’expéditeur</legend>
        <div>
          <input name="name" value={form.name} onChange={onChange} onBlur={() => onBlurField('name')} placeholder="Nom ou prénom (ex: Chreol Empire)" className={inputClass('name')} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }} />
          {errors.name && (touched.name || submitAttempted) ? <p className="text-xs text-red-500 mt-1">{errors.name}</p> : null}
        </div>
        <div>
          <input name="phone" value={form.phone} onChange={onChange} onBlur={() => onBlurField('phone')} placeholder="Numéro WhatsApp (ex: +237 697 657 734)" className={inputClass('phone')} />
          {errors.phone && (touched.phone || submitAttempted) ? <p className="text-xs text-red-500 mt-1">{errors.phone}</p> : null}
        </div>
        <div>
          <select name="senderCountry" value={form.senderCountry} onChange={onChange} onBlur={() => onBlurField('senderCountry')} className={inputClass('senderCountry')} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
            {Object.keys(networkMap).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.senderCountry && (touched.senderCountry || submitAttempted) ? <p className="text-xs text-red-500 mt-1">{errors.senderCountry}</p> : null}
        </div>
        <div>
          <input name="amount" value={form.amount} onChange={onChange} onBlur={() => onBlurField('amount')} placeholder="Montant à envoyer (FCFA) — ex: 50000" className={inputClass('amount')} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }} />
          {errors.amount && (touched.amount || submitAttempted) ? <p className="text-xs text-red-500 mt-1">{errors.amount}</p> : null}
        </div>
        <div>
          <select name="paymentNetwork" value={form.paymentNetwork} onChange={e => { onChange(e); setForm(prev => ({ ...prev, payment: e.target.value })); }} onBlur={() => onBlurField('paymentNetwork')} className={inputClass('paymentNetwork')} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
            {senderPaymentNetworks.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          {errors.paymentNetwork && (touched.paymentNetwork || submitAttempted) ? <p className="text-xs text-red-500 mt-1">{errors.paymentNetwork}</p> : null}
        </div>
        <input name="email" value={form.email} onChange={onChange} onBlur={() => onBlurField('email')} placeholder="Email (optionnel)" className={inputClass('email')} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }} />
      </fieldset>
      {form.amount ? (
        <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
          <p className="text-sm">Frais estimés: {fee === null ? (<span className="font-semibold">Contactez-nous pour les montants supérieurs à 1 000 000 FCFA</span>) : (<span className="font-semibold">{fee.toLocaleString()} FCFA</span>)}</p>
          <p className="text-sm">Montant à payer à CHREOL EMPIRE: {total === null ? (<span className="font-semibold">Contactez-nous</span>) : (<span className="font-semibold">{total.toLocaleString()} FCFA</span>)}</p>
        </div>
      ) : null}
      <fieldset className="rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
        <legend className="px-2 text-sm font-black" style={{ color: 'var(--gold)' }}>2. Informations du bénéficiaire</legend>
        <select name="destination" value={form.destination} onChange={e => { onChange(e); setForm(prev => ({ ...prev, beneficiaryNetwork: networkMap[e.target.value]?.[0] ?? 'MTN' })); }} className={inputClass('destination')} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
          {Object.keys(networkMap).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="beneficiaryNetwork" value={form.beneficiaryNetwork} onChange={onChange} onBlur={() => onBlurField('beneficiaryNetwork')} className={inputClass('beneficiaryNetwork')} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
          {networks.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <input name="beneficiaryNumber" value={form.beneficiaryNumber} onChange={onChange} onBlur={() => onBlurField('beneficiaryNumber')} placeholder="Numéro du bénéficiaire (ex: +225...)" className={inputClass('beneficiaryNumber')} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }} />
        {(errors.beneficiaryNumber && (touched.beneficiaryNumber || submitAttempted)) ? <p className="text-xs text-red-500 mt-1">{errors.beneficiaryNumber}</p> : null}
        <input name="beneficiaryName" value={form.beneficiaryName} onChange={onChange} onBlur={() => onBlurField('beneficiaryName')} placeholder="Nom affiché sur le compte" className={inputClass('beneficiaryName')} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border)' }} />
        {(errors.beneficiaryName && (touched.beneficiaryName || submitAttempted)) ? <p className="text-xs text-red-500 mt-1">{errors.beneficiaryName}</p> : null}
        <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Information supplémentaire (optionnel)" className="p-3 rounded-lg bg-black text-white/90 border sm:col-span-2" />
      </fieldset>
      <div className="flex gap-3">
        <button type="submit" className="px-4 py-3 rounded-2xl font-black bg-var text-white" disabled={!isValid || loading}>{loading ? 'Envoi…' : 'Envoyer la demande'}</button>
        <button type="button" className="px-4 py-3 rounded-2xl font-black border" onClick={() => { setForm(emptyForm); showToast('Formulaire réinitialisé', 'info'); }}>Réinitialiser</button>
      </div>
    </form>
  );
}
