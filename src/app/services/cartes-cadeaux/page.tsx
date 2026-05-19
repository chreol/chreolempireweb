"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { GIFT_CARDS, IMAGES } from "@/lib/services";
import USSDOrderFlow from "@/components/USSDOrderFlow";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import FAQ from "@/components/FAQ";

const PAGE_FAQ = [
  { q: "Où acheter des cartes cadeaux PSN en FCFA à Douala ?", a: "Chreol Empire est votre boutique locale à Douala (Vallée 3, Deido). Commandez vos cartes PSN, Steam, Nintendo, Roblox ou iTunes directement via WhatsApp — livraison du code en 15 minutes, paiement MTN MoMo ou Orange Money." },
  { q: "Peut-on payer une carte Steam avec MTN MoMo au Cameroun ?", a: "Oui, tous nos modes de paiement Mobile Money sont acceptés : MTN MoMo, Orange Money, Express Union et Yoomee Money. Aucune carte bancaire requise. Commande et livraison 100% via WhatsApp." },
  { q: "Combien coûte une carte PSN 20€ en FCFA ?", a: "Environ 14 500 FCFA au taux actuel. Le prix exact est fixé au moment de la commande selon le taux du jour. Consultez notre ticker de taux en haut de page pour les cours en temps réel." },
  { q: "Les codes vendus par Chreol Empire sont-ils originaux ?", a: "Oui, absolument. Tous nos codes proviennent de sources officielles et vérifiées. En cas de code invalide à l'activation, nous le remplaçons ou remboursons intégralement, sans discussion." },
];

const PAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAGE_FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const TABS = [
  { key: "standard", label: "Standard" },
  { key: "itunes",   label: "iTunes / Google Play" },
  { key: "robux",    label: "Robux" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const REGIONS = [
  { code: "EU", flag: "🇪🇺", label: "Europe" },
  { code: "FR", flag: "🇫🇷", label: "France" },
  { code: "BE", flag: "🇧🇪", label: "Belgique" },
  { code: "IT", flag: "🇮🇹", label: "Italie" },
  { code: "DE", flag: "🇩🇪", label: "Allemagne" },
  { code: "ES", flag: "🇪🇸", label: "Espagne" },
  { code: "UK", flag: "🇬🇧", label: "UK" },
  { code: "US", flag: "🇺🇸", label: "USA" },
  { code: "CA", flag: "🇨🇦", label: "Canada" },
  { code: "AU", flag: "🇦🇺", label: "Australie" },
  { code: "GLOBAL", flag: "🌐", label: "Global" },
];

const CUSTOM_RATE = 750;

export default function CartesCadeauxPage() {
  const { addItem } = useCart();
  const { t: tl } = useLanguage();
  const [tab, setTab] = useState<TabKey>("standard");
  const [cardId, setCardId] = useState<string | null>(null);
  const [amountLabel, setAmountLabel] = useState<string | null>(null);
  const [region, setRegion] = useState("EU");
  const [customVal, setCustomVal] = useState("");
  const [added, setAdded] = useState(false);

  const cards = GIFT_CARDS.filter(c => c.tier === tab);
  const card = GIFT_CARDS.find(c => c.id === cardId);
  const amount = card?.amounts.find(a => a.label === amountLabel);
  const customNum = parseFloat(customVal.replace(",", "."));
  const customPrice = !isNaN(customNum) && customNum > 0 ? Math.round(customNum * CUSTOM_RATE) : null;
  const canAdd = card && (amount || customPrice);

  function handleTabChange(t: TabKey) {
    setTab(t); setCardId(null); setAmountLabel(null); setCustomVal("");
  }

  function handleAddToCart() {
    if (!card) return;
    const finalPrice = customPrice ?? amount?.price;
    const finalLabel = customPrice ? `${customVal}€ (personnalisé)` : amountLabel!;
    if (!finalPrice) return;
    addItem({ id: `${card.id}-${finalLabel}-${region}`, cardName: `${card.name} [${region}]`, amount: finalLabel, price: finalPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function buildMsgPlain() {
    if (!card) return "";
    const finalLabel = customPrice ? `${customVal}€ (personnalisé)` : amountLabel ?? "";
    const finalPrice = (customPrice ?? amount?.price ?? 0).toLocaleString("fr-FR");
    return `Je veux commander ${card.name} ${finalLabel} [${region}] — ${finalPrice} FCFA`;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
          <Link href="/services" className="hover:text-white">Services</Link>
          <span>›</span>
          <span className="text-white">Cartes Cadeaux</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-1">{tl("p.giftcards.title")}</h1>
        <p style={{ color: "var(--text-secondary)" }}>{tl("p.giftcards.sub")}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors"
            style={{
              background: tab === t.key ? "var(--gold)" : "var(--bg-card)",
              color: tab === t.key ? "#0A0A0A" : "var(--text-secondary)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card selector */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            Choisissez une carte
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cards.map(c => (
              <button
                key={c.id}
                onClick={() => { setCardId(c.id); setAmountLabel(null); setCustomVal(""); }}
                className="rounded-2xl overflow-hidden text-left transition-all"
                style={{
                  border: `2px solid ${cardId === c.id ? c.color : "var(--border)"}`,
                  background: "var(--bg-card)",
                }}
              >
                <div className="relative h-20 w-full">
                  <Image src={c.image} alt={c.name} fill style={{ objectFit: "cover" }} unoptimized />
                  <div className="absolute inset-0" style={{ background: cardId === c.id ? `${c.color}33` : "rgba(0,0,0,0.3)" }} />
                </div>
                <div className="p-2">
                  <p className="text-xs font-bold text-white leading-tight">{c.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Config panel */}
        <div className="space-y-5">
          {/* Region */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Région</p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(r => (
                <button
                  key={r.code}
                  onClick={() => setRegion(r.code)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  style={{
                    background: region === r.code ? "var(--gold)" : "var(--bg-card)",
                    color: region === r.code ? "#0A0A0A" : "var(--text-secondary)",
                    border: `1px solid ${region === r.code ? "var(--gold)" : "var(--border)"}`,
                  }}
                >
                  {r.flag} {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amounts */}
          {card && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Montant</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {card.amounts.map(a => (
                  <button
                    key={a.label}
                    onClick={() => { setAmountLabel(a.label); setCustomVal(""); }}
                    className="py-2 px-1 rounded-xl text-center transition-all"
                    style={{
                      background: amountLabel === a.label ? "var(--gold)" : "var(--bg-card)",
                      border: `1px solid ${amountLabel === a.label ? "var(--gold)" : "var(--border)"}`,
                    }}
                  >
                    <p className="text-xs font-black" style={{ color: amountLabel === a.label ? "#0A0A0A" : "white" }}>{a.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: amountLabel === a.label ? "#0A0A0A99" : "var(--text-muted)" }}>
                      {a.price.toLocaleString("fr-FR")} F
                    </p>
                  </button>
                ))}
              </div>

              {/* Custom amount (not for Robux) */}
              {tab !== "robux" && (
                <div className="mt-3">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Ou montant personnalisé (€)</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="ex: 25"
                      value={customVal}
                      onChange={e => { setCustomVal(e.target.value); setAmountLabel(null); }}
                      className="flex-1 px-3 py-2 rounded-xl text-sm text-white outline-none"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                    />
                    {customPrice && (
                      <span className="text-sm font-bold" style={{ color: "var(--gold)" }}>
                        ≈ {customPrice.toLocaleString("fr-FR")} F
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary + actions */}
          {canAdd && (
            <div
              className="rounded-2xl p-4"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-strong)" }}
            >
              <p className="text-sm font-bold text-white mb-0.5">{card?.name} [{region}]</p>
              <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                {customPrice ? `${customVal}€ personnalisé` : amountLabel}
              </p>
              <p className="text-2xl font-black mb-4" style={{ color: "var(--gold)" }}>
                {(customPrice ?? amount?.price ?? 0).toLocaleString("fr-FR")} FCFA
              </p>

              <div className="flex flex-col gap-2">
                <USSDOrderFlow
                  total={customPrice ?? amount?.price ?? 0}
                  getMsg={buildMsgPlain}
                  className="w-full py-3 rounded-full font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-85"
                  style={{ background: "#25D366" }}
                >
                  <Image src={IMAGES.whatsapp} alt="" width={18} height={18} unoptimized className="shrink-0" />
                  Commander via WhatsApp
                </USSDOrderFlow>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 rounded-full font-black text-xs transition-all"
                  style={{ background: added ? "#10B981" : "var(--bg-elevated)", color: added ? "white" : "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  {added ? "✅ Ajouté !" : "🛒 Panier"}
                </button>
              </div>
            </div>
          )}

          {!card && (
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <p className="text-4xl mb-2">👆</p>
              <p className="font-bold text-white mb-1">Sélectionnez une carte</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Puis choisissez le montant et la région</p>
            </div>
          )}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: "✅", label: "Codes authentiques" },
          { icon: "⚡", label: "Livraison 15–30 min" },
          { icon: "🌍", label: "Toutes les régions" },
          { icon: "💬", label: "Support WhatsApp 7j/7" },
        ].map(b => (
          <div key={b.label} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "var(--bg-card)" }}>
            <span className="text-xl">{b.icon}</span>
            <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{b.label}</span>
          </div>
        ))}
      </div>
      <FAQ items={PAGE_FAQ} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_FAQ_SCHEMA) }} />
      <div className="mt-8 rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Voir aussi</p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/services/crypto",   label: "₿ Crypto & MoMo" },
            { href: "/services/paypal",   label: "💸 PayPal Europe" },
            { href: "/services/coupons",  label: "🎫 Coupons PCS / Transcash" },
          ].map(l => (
            <a key={l.href} href={l.href}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
              style={{ background: "var(--bg-elevated)", color: "var(--gold)", border: "1px solid var(--border)" }}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
