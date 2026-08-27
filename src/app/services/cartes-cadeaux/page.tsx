"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { useCart } from "@/contexts/CartContext";
import { GIFT_CARDS, IMAGES } from "@/lib/services";
import USSDOrderFlow from "@/components/USSDOrderFlow";
import PaymentMethodSelector, { resolvePaymentMethod } from "@/components/PaymentMethodSelector";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/Toast";
import FAQ from "@/components/FAQ";
import StepGuide from "@/components/StepGuide";
import RelatedServices from "@/components/RelatedServices";
import GoogleReviewPrompt from "@/components/GoogleReviewPrompt";

// FAQ en français pour le JSON-LD SEO
const FAQ_FR = [
  { q: "Où acheter des cartes cadeaux PSN en FCFA à Douala ?", a: "Chreol Empire est votre boutique locale à Douala (Vallée 3, Deido). Commandez vos cartes PSN, Steam, Nintendo, Roblox ou iTunes directement via WhatsApp — livraison du code en 15 minutes, paiement MTN MoMo ou Orange Money." },
  { q: "Peut-on payer une carte Steam avec MTN MoMo au Cameroun ?", a: "Oui, tous nos modes de paiement Mobile Money sont acceptés : MTN MoMo, Orange Money, Express Union et Yoomee Money. Aucune carte bancaire requise. Commande et livraison 100% via WhatsApp." },
  { q: "Combien coûte une carte PSN 20€ en FCFA ?", a: "15 800 FCFA selon la grille actuelle. Le prix exact est confirmé au moment de la commande selon la région et le taux du jour." },
  { q: "Les codes vendus par Chreol Empire sont-ils originaux ?", a: "Oui, absolument. Tous nos codes proviennent de sources officielles et vérifiées. En cas de code invalide à l'activation, nous le remplaçons ou remboursons intégralement, sans discussion." },
];

const PAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_FR.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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
  useEffect(() => { track("service_view", { service: "cartes-cadeaux" }); }, []);
  const { addItem } = useCart();
  const { t: tl } = useLanguage();
  const { showToast } = useToast();
  const [tab, setTab] = useState<TabKey>("standard");
  const [cardId, setCardId] = useState<string | null>(null);
  const orderIdRef = useRef("");
  const [amountLabel, setAmountLabel] = useState<string | null>(null);
  const [region, setRegion] = useState("EU");
  const [customVal, setCustomVal] = useState("");
  const [added, setAdded] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [payOp, setPayOp] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTab = params.get("tab") as TabKey | null;
    const requestedCard = params.get("card");
    const requestedAmount = params.get("amount");
    const requestedRegion = params.get("region");
    if (requestedTab && TABS.some(item => item.key === requestedTab)) setTab(requestedTab);
    if (requestedCard && GIFT_CARDS.some(item => item.id === requestedCard)) setCardId(requestedCard);
    if (requestedRegion && REGIONS.some(item => item.code === requestedRegion)) setRegion(requestedRegion);
    if (requestedAmount) setAmountLabel(requestedAmount);
  }, []);

  const STEPS_CADEAUX = [
    { icon: "🎮", title: tl("gc.step1.t"), description: tl("gc.step1.d"), tip: tl("gc.step1.tip") },
    { icon: "📧", title: tl("gc.step2.t"), description: tl("gc.step2.d"), tip: tl("gc.step2.tip") },
    { icon: "💬", title: tl("gc.step3.t"), description: tl("gc.step3.d") },
    { icon: "💰", title: tl("gc.step4.t"), description: tl("gc.step4.d") },
    { icon: "✅", title: tl("gc.step5.t"), description: tl("gc.step5.d"), tip: tl("gc.step5.tip") },
  ];
  const PAGE_FAQ = [
    { q: tl("gc.faq1.q"), a: tl("gc.faq1.a") },
    { q: tl("gc.faq2.q"), a: tl("gc.faq2.a") },
    { q: tl("gc.faq3.q"), a: tl("gc.faq3.a") },
    { q: tl("gc.faq4.q"), a: tl("gc.faq4.a") },
  ];

  const cards = GIFT_CARDS.filter(c => c.tier === tab);
  const card = GIFT_CARDS.find(c => c.id === cardId);
  const displayAmounts = card ? (region === "US" && (card as any).usAmounts ? (card as any).usAmounts : card.amounts) : [];
  const amount = displayAmounts.find((a: any) => a.label === amountLabel);
  const customNum = parseFloat(customVal.replace(",", "."));
  const customPrice = !isNaN(customNum) && customNum > 0 ? Math.round(customNum * CUSTOM_RATE) : null;
  const canAdd = card && (amount || customPrice);

  function handleTabChange(t: TabKey) {
    setTab(t); setCardId(null); setAmountLabel(null); setCustomVal(""); setEmail(""); setEmailError("");
  }

  function validateEmail() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(tl("gc.email_required"));
      return false;
    }
    setEmailError("");
    return true;
  }

  function sendNotification() {
    if (!card) return;
    const finalPrice = customPrice ?? amount?.price ?? 0;
    const finalLabel = customPrice ? `${customVal}€ (personnalisé)` : amountLabel ?? "";
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: (() => { const id = `carte-${card.id}-${Date.now()}`; orderIdRef.current = id; return id; })(),
        clientName: email.split("@")[0],
        clientEmail: email,
        clientPhone: "",
        paymentMethod: resolvePaymentMethod(payOp),
        items: [{ name: `${card.name} [${region}]`, qty: 1, price: finalPrice, amount: `${finalLabel} — ${finalPrice.toLocaleString("fr-FR")} FCFA` }],
        total: finalPrice,
        sourceUrl: window.location.pathname,
      }),
    }).catch(() => {});
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
    const ref = orderIdRef.current ? ` — Réf #${orderIdRef.current.slice(-8).toUpperCase()}` : "";
    const pay = payOp ? `\nPaiement : ${resolvePaymentMethod(payOp)}` : "";
    return `Je veux commander ${card.name} ${finalLabel} [${region}] — ${finalPrice} FCFA${ref}${pay}`;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
          <Link href="/services" className="hover:text-white">{tl("nav.services")}</Link>
          <span>›</span>
          <span className="text-white">{tl("gc.breadcrumb")}</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-1">{tl("p.giftcards.title")}</h1>
        <p style={{ color: "var(--text-secondary)" }}>{tl("p.giftcards.sub")}</p>
        <div className="mt-4 rounded-2xl p-4" style={{ background: "#1B5E2022", border: "1px solid #25D36633" }}>
          <p className="text-sm font-black" style={{ color: "#25D366" }}>🔥 HOT DEAL · Nouveaux tarifs EUR/USD · Plus que 3 cartes à ces conditions</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Codes authentiques · Livraison WhatsApp 15–30 min · Paiement MTN MoMo / Orange Money</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Cartes européennes et américaines : livraison rapide — idéal pour achats internationaux. Les prix sont mis à jour en temps réel.</p>
        </div>
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
          {tab === "robux" && (
            <div className="rounded-2xl p-4 mb-4" style={{ background: "#E8232A12", border: "1px solid #E8232A44" }}>
              <p className="text-sm font-black text-white">🎮 Tarifs Roblox et Robux</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                Choisissez une carte cadeau Roblox ou un montant de Robux pour afficher son tarif en FCFA.
              </p>
            </div>
          )}
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            {tl("gc.choose_card")}
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
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>{tl("gc.region")}</p>
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
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>{tl("gc.amount")}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {displayAmounts.map((a: any) => (
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
                    {a.previousPrice && a.previousPrice !== a.price && (
                      <p className="text-[9px] mt-0.5 line-through" style={{ color: amountLabel === a.label ? "#0A0A0A99" : "var(--text-muted)" }}>
                        {a.previousPrice.toLocaleString("fr-FR")} F
                      </p>
                    )}
                    <p className="text-[10px] font-black" style={{ color: amountLabel === a.label ? "#0A0A0A" : "#25D366" }}>
                      {a.previousPrice && a.previousPrice > a.price ? "🔥" : "🚀"} {a.price.toLocaleString("fr-FR")} F
                    </p>
                  </button>
                ))}
              </div>

              {/* Custom amount (not for Robux) */}
              {tab !== "robux" && (
                <div className="mt-3">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>{tl("gc.custom")}</p>
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
                {customPrice ? `${customVal}€ ${tl("gc.custom_suffix")}` : amountLabel}
              </p>
              <p className="text-2xl font-black mb-4" style={{ color: "var(--gold)" }}>
                {(customPrice ?? amount?.price ?? 0).toLocaleString("fr-FR")} FCFA
              </p>

              <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
                <strong>Note :</strong> Le client prend en charge les frais de retrait liés à ces transactions.
              </p>
              <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                Cartes européennes et américaines — livraison rapide (généralement 15–30 minutes).
              </p>

              {/* Email */}
              <div className="mb-1">
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-muted)" }}>
                  {tl("gc.email_label")}
                </label>
                <input
                  type="email"
                  placeholder={tl("f.email.ph")}
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (e.target.value) setEmailError(""); }}
                  className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-card)", border: `1px solid ${emailError ? "#EF4444" : "var(--border)"}` }}
                />
                {emailError && <p className="text-xs mt-1 px-1" style={{ color: "#EF4444" }}>{emailError}</p>}
              </div>

              {/* Mode de paiement préféré (optionnel) */}
              <div className="mb-3 mt-1">
                <PaymentMethodSelector value={payOp} onChange={setPayOp} />
              </div>

              <div className="flex flex-col gap-2">
                <USSDOrderFlow
                  total={customPrice ?? amount?.price ?? 0}
                  getMsg={buildMsgPlain}
                  onBeforeOpen={() => {
                    if (!validateEmail()) { showToast(tl("gc.enter_email"), "error"); return false; }
                    sendNotification();
                    return true;
                  }}
                  className="w-full py-3 rounded-full font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-85"
                  style={{ background: "#25D366" }}
                >
                  <Image src={IMAGES.whatsapp} alt="" width={18} height={18} unoptimized className="shrink-0" />
                  {tl("btn.order_wa")}
                </USSDOrderFlow>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 rounded-full font-black text-xs transition-all"
                  style={{ background: added ? "#10B981" : "var(--bg-elevated)", color: added ? "white" : "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  {added ? tl("gc.added") : tl("gc.cart")}
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
              <p className="font-bold text-white mb-1">{tl("gc.select_card")}</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{tl("gc.then_choose")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: "✅", label: tl("gc.trust_1") },
          { icon: "⚡", label: tl("gc.trust_2") },
          { icon: "🌍", label: tl("gc.trust_3") },
          { icon: "💬", label: tl("gc.trust_4") },
        ].map(b => (
          <div key={b.label} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "var(--bg-card)" }}>
            <span className="text-xl">{b.icon}</span>
            <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{b.label}</span>
          </div>
        ))}
      </div>
      <StepGuide title={tl("gc.guide_title")} steps={STEPS_CADEAUX} />
      <FAQ items={PAGE_FAQ} />
      <GoogleReviewPrompt productName="vos cartes cadeaux" />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_FAQ_SCHEMA) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Cartes Cadeaux - Chreol Empire",
        itemListElement: GIFT_CARDS.slice(0, 10).map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: c.name,
            image: c.image,
            url: `https://shop.chreolempire.com/services/cartes-cadeaux/${c.id}`,
            offers: c.amounts.slice(0, 5).map(a => ({
              "@type": "Offer",
              price: a.price,
              priceCurrency: "XAF",
              availability: "https://schema.org/InStock",
              priceSpecification: { "@type": "UnitPriceSpecification", price: a.price, priceCurrency: "XAF" }
            })),
          }
        }))
      }) }} />
      <RelatedServices current="cartes-cadeaux" />
    </div>
  );
}
