"use client";

import { useState } from "react";

export interface FAQItem { q: string; a: string }

export default function FAQ({ items, title = "Questions fréquentes" }: { items: FAQItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mt-12 mb-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <h2 className="text-lg font-black shrink-0" style={{ color: "var(--text-primary)" }}>{title}</h2>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-150"
              style={{ border: `1px solid ${isOpen ? "var(--border-strong)" : "var(--border)"}` }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150"
                style={{ background: isOpen ? "var(--gold-dim)" : "var(--bg-card)" }}
              >
                <span className="text-sm font-bold leading-snug" style={{ color: isOpen ? "var(--gold)" : "var(--text-primary)" }}>
                  {item.q}
                </span>
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-base font-black transition-transform duration-200"
                  style={{
                    background: isOpen ? "var(--gold)" : "var(--bg-elevated)",
                    color: isOpen ? "#0A0A0A" : "var(--text-muted)",
                    transform: isOpen ? "rotate(45deg)" : "none",
                  }}
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div
                  className="px-5 py-4"
                  style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border)" }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
