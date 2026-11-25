"use client";

import { useEffect } from "react";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-black text-white" style={{ textWrap: "balance" }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-full font-bold active:scale-[0.96]"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)", transition: "scale 150ms" }}
          >
            Fermer
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
