"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface Rate { name: string; buy?: string; sell?: string; }

const FALLBACK: Rate[] = [
  { name: "USDT",      buy: "580 FCFA/$",      sell: "700 FCFA/$" },
  { name: "USDC",      buy: "580 FCFA/$",      sell: "700 FCFA/$" },
  { name: "BTC",       buy: "58 000 000 FCFA", sell: "70 000 000 FCFA" },
  { name: "ETH",       buy: "2 900 000 FCFA",  sell: "3 500 000 FCFA" },
  { name: "BNB",       buy: "435 000 FCFA",    sell: "525 000 FCFA" },
  { name: "SOL",       buy: "99 000 FCFA",     sell: "120 000 FCFA" },
  { name: "TRX",       buy: "151 FCFA",        sell: "182 FCFA" },
  { name: "LTC",       buy: "62 000 FCFA",     sell: "75 000 FCFA" },
  { name: "ADA",       buy: "330 FCFA",        sell: "400 FCFA" },
  { name: "PayPal",    buy: "580 FCFA/€",      sell: "700 FCFA/€" },
  { name: "PCS",       buy: "480 FCFA/€" },
  { name: "Transcash", buy: "450 FCFA/€" },
];

function buildItems(rates: Rate[]) {
  return rates.map(r => {
    let s = r.name + " ▸";
    if (r.buy)          s += " Achetons " + r.buy;
    if (r.buy && r.sell) s += " · ";
    if (r.sell)         s += "Vendons " + r.sell;
    return s;
  });
}

export default function RateTicker() {
  const [items, setItems] = useState<string[]>(() => buildItems(FALLBACK));
  const trackRef  = useRef<HTMLDivElement>(null);
  const animRef   = useRef<Animation | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_RATES_URL;
    if (!url) return;
    fetch(url, { signal: AbortSignal.timeout(4000) })
      .then(r => r.json())
      .then((d: Rate[]) => { if (Array.isArray(d) && d.length) setItems(buildItems(d)); })
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

  const text = items.join("     ◆     ");

  return (
    <div
      className="flex items-center overflow-hidden select-none"
      style={{ height: 26, background: "#0A0A0A", borderBottom: "1px solid #C9A84C1A" }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* TARIF badge */}
      <div className="flex items-center gap-1.5 shrink-0 px-3 border-r" style={{ borderColor: "#C9A84C22", height: "100%" }}>
        <span className="text-[9px] font-black tracking-widest whitespace-nowrap" style={{ color: "var(--gold)" }}>TARIF</span>
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden">
        <div ref={trackRef} className="inline-flex whitespace-nowrap gap-0">
          {/* Two identical spans — required for seamless CSS loop (translateX -50%) */}
          <span className="text-[10.5px] font-semibold tracking-wide tabular-nums px-6" style={{ color: "var(--gold)", opacity: 0.9 }}>
            {text}
          </span>
          <span aria-hidden="true" className="text-[10.5px] font-semibold tracking-wide tabular-nums px-6" style={{ color: "var(--gold)", opacity: 0.9 }}>
            {text}
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
