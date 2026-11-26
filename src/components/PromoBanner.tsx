"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PROMOS } from "@/lib/promos";
import { PROMO_END_DATE, isPromoActive } from "@/config/promoConfig";

const DISMISS_KEY = "promo_banner_dismissed";

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState("");

  const promo = PROMOS.find(p => {
    const expired = p.expiresAt ? new Date(p.expiresAt).getTime() < Date.now() : false;
    const soldOut = p.remaining !== null && p.remaining === 0;
    return !expired && !soldOut;
  }) ?? PROMOS[0] ?? null;

  const calcCountdown = useCallback(() => {
    const diff = PROMO_END_DATE.getTime() - Date.now();
    if (diff <= 0) {
      setVisible(false);
      return "";
    }
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    const clock = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return d > 0 ? `${d}j ${clock}` : clock;
  }, []);

  useEffect(() => {
    if (!isPromoActive()) return;
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed === "campaign") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- affichage différé après lecture de sessionStorage
    setVisible(true);
    setCountdown(calcCountdown());
    const id = setInterval(() => setCountdown(calcCountdown()), 1000);
    return () => clearInterval(id);
  }, [calcCountdown]);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "campaign");
    setVisible(false);
  }

  if (!visible || !promo || !isPromoActive()) return null;

  return (
    <div
      role="banner"
      className="flex items-center justify-between gap-2 px-4 py-2 text-xs font-bold select-none"
      style={{ background: promo.badgeColor, color: "#000" }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-center flex-wrap">
        <span>{promo.badge}</span>
        <span className="truncate">{promo.title} — {promo.promoPrice.toLocaleString("fr-FR")} {promo.currency}</span>
        {countdown && (
          <span className="font-black tabular-nums px-2 py-0.5 rounded-full text-[10px]"
            style={{ background: "rgba(0,0,0,0.18)" }}>
            ⏱ {countdown}
          </span>
        )}
        <Link href="/promo"
          className="shrink-0 rounded-full px-3 py-1 text-[11px] font-black whitespace-nowrap transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
          style={{ background: "#0A0A0A", color: "#FFFFFF" }}>
          Voir la promo
        </Link>
      </div>
      <button
        onClick={dismiss}
        aria-label="Fermer la bannière"
        className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
        style={{ background: "rgba(0,0,0,0.15)" }}>
        ×
      </button>
    </div>
  );
}
