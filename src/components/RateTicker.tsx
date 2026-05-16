"use client";

import { useEffect, useState, useRef } from "react";

interface Rate { name: string; buy?: string; sell?: string; }

const FALLBACK: Rate[] = [
  { name: "USDT",      buy: "580 FCFA/$",       sell: "700 FCFA/$" },
  { name: "USDC",      buy: "580 FCFA/$",       sell: "700 FCFA/$" },
  { name: "BTC",       buy: "58 000 000 FCFA",  sell: "70 000 000 FCFA" },
  { name: "ETH",       buy: "2 900 000 FCFA",   sell: "3 500 000 FCFA" },
  { name: "BNB",       buy: "435 000 FCFA",     sell: "525 000 FCFA" },
  { name: "SOL",       buy: "99 000 FCFA",      sell: "120 000 FCFA" },
  { name: "TRX",       buy: "151 FCFA",         sell: "182 FCFA" },
  { name: "LTC",       buy: "62 000 FCFA",      sell: "75 000 FCFA" },
  { name: "ADA",       buy: "330 FCFA",         sell: "400 FCFA" },
  { name: "PayPal",    buy: "580 FCFA/€",       sell: "700 FCFA/€" },
  { name: "PCS",       buy: "440 FCFA/€" },
  { name: "Transcash", buy: "440 FCFA/€" },
];

function buildText(rates: Rate[]) {
  return rates.map(r => {
    let s = `${r.name}  ▸`;
    if (r.buy)  s += `  Achetons à ${r.buy}`;
    if (r.buy && r.sell) s += "  •";
    if (r.sell) s += `  Vendons à ${r.sell}`;
    return s + "     ◆     ";
  }).join("");
}

export default function RateTicker() {
  const [text, setText] = useState(() => buildText(FALLBACK));
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);

  useEffect(() => {
    fetch("https://chreolempirev1.vercel.app/rates.json", { signal: AbortSignal.timeout(4000) })
      .then(r => r.json())
      .then((d: Rate[]) => { if (Array.isArray(d) && d.length) setText(buildText(d)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.scrollWidth / 2;
    animRef.current?.cancel();
    animRef.current = el.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(-${w}px)` }],
      { duration: w * 20, iterations: Infinity, easing: "linear" },
    );
    return () => animRef.current?.cancel();
  }, [text]);

  return (
    <div
      className="flex items-center overflow-hidden shrink-0"
      style={{ height: 36, background: "#0F0F0F", borderBottom: "1px solid #C9A84C22" }}
    >
      {/* LIVE badge */}
      <div className="flex items-center gap-1.5 shrink-0 px-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black tracking-widest text-emerald-500">LIVE</span>
        <span className="w-px h-4 mx-1" style={{ background: "#C9A84C55" }} />
      </div>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden">
        <div ref={ref} className="flex whitespace-nowrap">
          <span className="text-[11.5px] font-bold tracking-wide" style={{ color: "var(--gold)" }}>
            {text}
          </span>
          <span className="text-[11.5px] font-bold tracking-wide" style={{ color: "var(--gold)" }}>
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
