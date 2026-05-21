"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { CONTACT, IMAGES } from "@/lib/services";

interface WAPopoverProps {
  prefill?: string;
  prefillPrenom?: string;
  getMsg?: () => string;
  onBeforeOpen?: () => boolean;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  /** @deprecated no-op */
  align?: "left" | "right" | "center";
  /** @deprecated no-op */
  dropDown?: boolean;
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
  align: _align,
  dropDown: _dropDown,
}: WAPopoverProps) {
  const [open, setOpen]       = useState(false);
  const [prenom, setPrenom]   = useState(prefillPrenom ?? "");
  const [requete, setRequete] = useState(prefill ?? "");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank", "noopener,noreferrer");
    setOpen(false);
    setPrenom(prefillPrenom ?? "");
    setRequete(prefill ?? "");
  }

  function handleClose() {
    setOpen(false);
    setPrenom(prefillPrenom ?? "");
    setRequete(prefill ?? "");
  }

  const wrapperCls = className?.includes("w-full")
    ? "w-full"
    : className?.includes("flex-1")
    ? "flex-1"
    : "inline-block";

  return (
    <div className={`relative ${wrapperCls}`}>
      <button type="button" onClick={handleTrigger} className={className} style={style}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-sm flex flex-col gap-4 rounded-3xl p-6"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-opacity hover:opacity-70"
              style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}
              aria-label="Fermer"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pr-8">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#25D36620" }}>
                <Image src={IMAGES.whatsapp} alt="" width={22} height={22} unoptimized />
              </div>
              <div>
                <p className="font-black text-white text-base leading-tight">{title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Réponse en moins de 15 min</p>
              </div>
            </div>

            <div className="h-px" style={{ background: "var(--border)" }} />

            {/* Prénom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Votre prénom *
              </label>
              <input
                type="text"
                placeholder="Jean-Paul, Aminata…"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                autoFocus
                maxLength={50}
                className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              />
            </div>

            {/* Requête */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Votre demande *
              </label>
              <textarea
                placeholder="Décrivez votre commande…"
                value={requete}
                onChange={e => setRequete(e.target.value)}
                rows={prefill || getMsg ? 5 : 3}
                className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none resize-none"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", fontSize: "13px", lineHeight: "1.5" }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-2xl text-sm font-bold transition-opacity hover:opacity-70"
                style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={!prenom.trim() || !requete.trim()}
                className="flex-2 px-6 py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity hover:opacity-85"
                style={{ background: "#25D366", flex: 2 }}
              >
                <Image src={IMAGES.whatsapp} alt="" width={16} height={16} unoptimized className="shrink-0" />
                Envoyer →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
