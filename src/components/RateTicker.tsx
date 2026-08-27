"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { IMAGES, UBA_RECHARGE_FEES } from "@/lib/services";

interface Rate { name: string; buy?: string; sell?: string; display?: string; }

const FALLBACK: Rate[] = [{ name: "USDT", buy: "580 FCFA/$", sell: "700 FCFA/$" }];
const OTHER_SERVICES: Rate[] = [
  { name: "PayPal", buy: "580 FCFA/€", sell: "700 FCFA/€" },
  { name: "Coupons", buy: "450 FCFA/€" },
  { name: "Cartes cadeaux", display: "Roblox · Robux · iTunes/Apple · PSN · EU/USA · 10€: 8 500 F · 20€: 15 800 F · 50€: 35 800 F" },
  { name: "Recharge UBA", display: UBA_RECHARGE_FEES.map(fee => {
    const range = `${fee.min.toLocaleString("fr-FR")}-${fee.max.toLocaleString("fr-FR")} F`;
    const value = fee.type === "fixed" ? `${fee.fee.toLocaleString("fr-FR")} F` : `${fee.fee}%`;
    return `${value} (${range})`;
  }).join(" · ") },
  { name: "Transfert", buy: "frais dès 2 500 FCFA" },
];

function buildItems(rates: Rate[]) {
  return rates.map(r => {
    if (r.display) return `${r.name} ▸ ${r.display}`;
    let s = r.name + " ▸";
    if (r.buy)          s += " Achat " + r.buy;
    if (r.buy && r.sell) s += " · ";
    if (r.sell)         s += " Vente " + r.sell;
    return s;
  });
}

export default function RateTicker() {
  const [items, setItems] = useState<string[]>(() => buildItems([...FALLBACK, ...OTHER_SERVICES]));
  const trackRef  = useRef<HTMLDivElement>(null);
  const animRef   = useRef<Animation | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_RATES_URL;
    if (!url) return;
    fetch(url, { signal: AbortSignal.timeout(4000) })
      .then(r => r.json())
      .then((d: Rate[]) => {
        const usdt = Array.isArray(d) ? d.find(rate => rate.name.toUpperCase() === "USDT") : null;
        if (usdt) setItems(buildItems([usdt, ...OTHER_SERVICES]));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.scrollWidth / 2;
    animRef.current?.cancel();
    animRef.current = el.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(-${w}px)` }],
      { duration: w * 28, iterations: Infinity, easing: "linear" },
    );
    if (pausedRef.current) animRef.current.pause();
    return () => animRef.current?.cancel();
  }, [items]);

  const pause   = useCallback(() => { pausedRef.current = true;  animRef.current?.pause(); }, []);
  const resume  = useCallback(() => { pausedRef.current = false; animRef.current?.play();  }, []);

  function renderItems() {
    return items.map((item, index) => (
      <span key={`${item}-${index}`} className="inline-flex items-center">
        <span>{item}</span>
        {index < items.length - 1 && (
          <span aria-hidden="true" className="px-4 font-black" style={{ color: "#FFFFFF" }}>|</span>
        )}
      </span>
    ));
  }

  return (
    <div
      className="flex items-center overflow-hidden select-none"
      style={{ height: 26, background: "#0A0A0A", borderBottom: "1px solid #C9A84C1A" }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* TARIF badge */}
      <div className="flex items-center gap-1.5 shrink-0 px-2 border-r" style={{ borderColor: "#C9A84C22", height: "100%" }}>
        <span className="chreol-logo-wrap w-[18px] h-[18px]">
          <span className="chreol-logo-stars" aria-hidden="true"><span>✦</span><span>✦</span></span>
          <Image src={IMAGES.logo} alt="Chreol Empire" width={18} height={18} className="chreol-logo-spin object-contain" unoptimized />
        </span>
        <span className="text-[9px] font-black tracking-widest whitespace-nowrap" style={{ color: "var(--gold)" }}>TARIFS</span>
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden">
        <div ref={trackRef} className="inline-flex whitespace-nowrap gap-0">
          {/* Two identical spans — required for seamless CSS loop (translateX -50%) */}
          <span className="text-[10.5px] font-semibold tracking-wide tabular-nums px-2" style={{ color: "var(--gold)", opacity: 0.9 }}>
            {renderItems()}
          </span>
          <span aria-hidden="true" className="text-[10.5px] font-semibold tracking-wide tabular-nums px-2" style={{ color: "var(--gold)", opacity: 0.9 }}>
            {renderItems()}
          </span>
        </div>
      </div>

      {/* Pause hint on hover */}
      <div className="shrink-0 px-2 text-[8px] font-bold opacity-0 hover:opacity-100 transition-opacity"
        style={{ color: "var(--text-muted)" }}>
        ⏸
      </div>
    </div>
  );
}
