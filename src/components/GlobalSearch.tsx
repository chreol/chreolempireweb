"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type ResultType = "service" | "product" | "page";

interface SearchItem {
  type: ResultType;
  label: string;
  sub: string;
  href: string;
  tags: string[];
  emoji: string;
}

const SEARCH_INDEX: SearchItem[] = [
  { type: "service", emoji: "🎮", label: "Cartes Cadeaux",               sub: "PSN, iTunes, Roblox, Steam, Nintendo, Razer",      href: "/services/cartes-cadeaux", tags: ["psn","itunes","roblox","steam","nintendo","razer","carte","cadeau","jeux","gaming","playstation"] },
  { type: "service", emoji: "₿",  label: "Crypto & coins",        sub: "USDT, BTC, TRX, ETH — 0% commission",              href: "/services/crypto",          tags: ["usdt","btc","trx","eth","sol","ltc","ada","bnb","crypto","bitcoin","momo","fcfa","blockchain","hash","txid"] },
  { type: "service", emoji: "🎫", label: "Coupons Transcash / PCS",       sub: "480 FCFA/€ — échange immédiat",                    href: "/services/coupons",         tags: ["transcash","pcs","coupon","voucher","mastercard","coupons","code"] },
  { type: "service", emoji: "💳", label: "Carte UBA Cameroun",            sub: "Achat & recharge Visa prépayée",                   href: "/services/uba",             tags: ["uba","visa","carte","recharge","prépayée","bancaire","segment"] },
  { type: "service", emoji: "💸", label: "PayPal Europe",                 sub: "Achat & vente — 580 / 700 FCFA/€",                 href: "/services/paypal",          tags: ["paypal","europe","euro","france","dollars","devise"] },
  { type: "service", emoji: "🔄", label: "Paiement Factures & Échange",   sub: "Canal+, Eneo, Camwater, StarTimes — MoMo",         href: "/services/factures",        tags: ["canal","eneo","camwater","startimes","facture","momo","orange","mtn","exchange","abonnement"] },
  { type: "product", emoji: "🎮", label: "PSN 10€",       sub: "7 500 FCFA",  href: "/services/cartes-cadeaux", tags: ["psn","10","playstation","sony"] },
  { type: "product", emoji: "🎮", label: "PSN 20€",       sub: "14 500 FCFA", href: "/services/cartes-cadeaux", tags: ["psn","20","playstation"] },
  { type: "product", emoji: "🎮", label: "Steam 20€",     sub: "14 500 FCFA", href: "/services/cartes-cadeaux", tags: ["steam","20","pc","jeux"] },
  { type: "product", emoji: "👾", label: "Robux 800R",    sub: "10 500 FCFA", href: "/services/cartes-cadeaux", tags: ["robux","roblox","800","enfants"] },
  { type: "product", emoji: "₿",  label: "USDT 10$",      sub: "5 800 FCFA",  href: "/services/crypto",          tags: ["usdt","10","trc20","crypto"] },
  { type: "product", emoji: "🎵", label: "iTunes 25€",    sub: "18 000 FCFA", href: "/services/cartes-cadeaux", tags: ["itunes","25","apple","musique","ios"] },
  { type: "product", emoji: "💸", label: "PayPal 20€",    sub: "11 600 FCFA", href: "/services/paypal",          tags: ["paypal","20","euro"] },
  { type: "product", emoji: "🎮", label: "Nintendo 50€",  sub: "34 000 FCFA", href: "/services/cartes-cadeaux", tags: ["nintendo","50","switch","eshop"] },
  { type: "page",    emoji: "ℹ️", label: "À propos",               sub: "Notre histoire depuis 2012",              href: "/a-propos",   tags: ["about","propos","histoire","confiance"] },
  { type: "page",    emoji: "💰", label: "Modes de paiement",       sub: "MTN MoMo, Orange Money, WhatsApp",        href: "/paiement",   tags: ["paiement","momo","orange","mtn","comment"] },
  { type: "page",    emoji: "📋", label: "Historique des commandes", sub: "Vos transactions récentes",              href: "/historique", tags: ["historique","commandes","transactions","suivi"] },
];

const HINTS = ["PSN", "USDT", "PayPal", "UBA", "Canal+", "Transcash", "Nintendo", "Bitcoin"];

export default function GlobalSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery]     = useState("");
  const [cursor, setCursor]   = useState(-1);
  const inputRef              = useRef<HTMLInputElement>(null);
  const router                = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const results = query.trim().length < 1
    ? []
    : SEARCH_INDEX.filter(item => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q) ||
          item.tags.some(tag => tag.includes(q))
        );
      });

  const go = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  function handleInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { setCursor(c => Math.min(c + 1, results.length - 1)); e.preventDefault(); }
    else if (e.key === "ArrowUp") { setCursor(c => Math.max(c - 1, -1)); e.preventDefault(); }
    else if (e.key === "Enter" && cursor >= 0 && results[cursor]) { go(results[cursor].href); }
    else { setCursor(-1); }
  }

  const services = results.filter(r => r.type === "service");
  const products = results.filter(r => r.type === "product");
  const pages    = results.filter(r => r.type === "page");

  function ResultGroup({ title, items, startIdx }: { title: string; items: SearchItem[]; startIdx: number }) {
    if (!items.length) return null;
    return (
      <div>
        <p className="px-4 pt-3 pb-1.5 text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--gold)" }}>{title}</p>
        {items.map((r, i) => {
          const globalIdx = startIdx + i;
          const active = cursor === globalIdx;
          return (
            <button
              key={r.label}
              onClick={() => go(r.href)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
              style={{ background: active ? "rgba(201,168,76,0.12)" : "transparent" }}
            >
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: "var(--bg-elevated)" }}>
                {r.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{r.label}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{r.sub}</p>
              </div>
              {active && <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>↵</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div className="max-w-xl w-full mx-auto mt-16 sm:mt-24 px-4" onClick={e => e.stopPropagation()}>

        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-3"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
        >
          <span className="text-lg shrink-0 opacity-60">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(-1); }}
            onKeyDown={handleInputKey}
            placeholder="Rechercher : PSN, USDT, PayPal, UBA…"
            className="flex-1 bg-transparent text-white text-sm sm:text-base outline-none placeholder:text-gray-500"
          />
          <button
            onClick={onClose}
            className="text-[10px] font-black px-2 py-1 rounded-lg shrink-0"
            style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            ESC
          </button>
        </div>

        {/* Suggestions rapides */}
        {query.trim().length === 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: "var(--text-muted)" }}>
              Suggestions rapides
            </p>
            <div className="flex flex-wrap gap-2">
              {HINTS.map(hint => (
                <button
                  key={hint}
                  onClick={() => setQuery(hint)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-colors hover:opacity-80"
                  style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
            <ResultGroup title="Services" items={services} startIdx={0} />
            <ResultGroup title="Produits populaires" items={products} startIdx={services.length} />
            <ResultGroup title="Pages" items={pages} startIdx={services.length + products.length} />
            <div className="h-2" />
          </div>
        )}

        {/* No results */}
        {query.trim().length > 0 && results.length === 0 && (
          <div
            className="rounded-2xl px-4 py-8 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-sm font-bold text-white mb-1">Aucun résultat pour « {query} »</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Essayez : PSN, USDT, PayPal, Canal+, Transcash…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
