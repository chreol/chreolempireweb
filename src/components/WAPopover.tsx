"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { CONTACT, IMAGES } from "@/lib/services";

interface WAPopoverProps {
  prefill?: string;             // Static plain-text prefill for Requête
  prefillPrenom?: string;       // Pre-fill Prénom field
  getMsg?: () => string;        // Dynamic message getter — called on open, overrides prefill
  onBeforeOpen?: () => boolean; // Validation callback — return false to cancel
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  dropDown?: boolean;           // popover below button (default: above)
}

export default function WAPopover({
  prefill,
  prefillPrenom,
  getMsg,
  onBeforeOpen,
  title = "Commander via WhatsApp",
  className,
  style,
  children,
  align = "center",
  dropDown = false,
}: WAPopoverProps) {
  const [open, setOpen]       = useState(false);
  const [prenom, setPrenom]   = useState(prefillPrenom ?? "");
  const [requete, setRequete] = useState(prefill ?? "");

  function handleTrigger() {
    if (onBeforeOpen && !onBeforeOpen()) return;
    setPrenom(prefillPrenom ?? "");
    setRequete(getMsg ? getMsg() : (prefill ?? ""));
    setOpen(true);
  }

  function handleSend() {
    const p = prenom.trim();
    const r = requete.trim();
    if (!p || !r) return;
    track("whatsapp_open", { context: title });
    const msg = encodeURIComponent(`Bonjour Chreol Empire, je m'appelle ${p}.\n\n${r}`);
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank");
    setOpen(false);
    setPrenom(prefillPrenom ?? "");
    setRequete(prefill ?? "");
  }

  const alignCls = align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
  const posCls   = dropDown ? "top-full mt-3" : "bottom-full mb-3";
  const isBlock  = className?.includes("w-full");

  return (
    <div className={`relative ${isBlock ? "w-full" : "inline-block"}`}>
      <button type="button" onClick={handleTrigger} className={className} style={style}>
        {children}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute ${posCls} ${alignCls} z-50 flex flex-col gap-3 rounded-2xl p-4`}
            style={{
              width: "min(288px, calc(100vw - 2rem))",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            }}
          >
            <div className="flex items-center gap-2">
              <Image src={IMAGES.whatsapp} alt="" width={14} height={14} unoptimized className="shrink-0 opacity-80" />
              <p className="font-black text-white text-sm leading-tight">{title}</p>
            </div>
            <input
              type="text"
              placeholder="Votre prénom *"
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
              autoFocus
              maxLength={50}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            />
            <textarea
              placeholder="Votre requête… *"
              value={requete}
              onChange={e => setRequete(e.target.value)}
              rows={prefill || getMsg ? 5 : 3}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", fontSize: "12px" }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-70"
                style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={!prenom.trim() || !requete.trim()}
                className="flex-1 py-2 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1 disabled:opacity-40 transition-opacity hover:opacity-85"
                style={{ background: "#25D366" }}
              >
                Envoyer →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
