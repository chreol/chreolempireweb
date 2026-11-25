"use client"

import { DIAL_OPTIONS, localBounds } from "@/lib/cmPhone"

export default function PhoneFields({
  dial,
  local,
  onDial,
  onLocal,
  error,
  variant = "card",
}: {
  dial: string
  local: string
  onDial: (value: string) => void
  onLocal: (value: string) => void
  error?: string
  variant?: "card" | "checkout"
}) {
  const max = localBounds(dial).max
  const radius = variant === "checkout" ? "rounded-xl" : "rounded-2xl"
  const background = variant === "checkout" ? "var(--bg-elevated)" : "var(--bg-card)"
  const labelColor = variant === "checkout" ? "var(--text-secondary)" : "var(--text-muted)"
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: labelColor }}>
        Téléphone <span style={{ color: "#EF4444" }}>*</span>
      </label>
      <div className="flex gap-2">
        <select
          aria-label="Indicatif pays"
          value={dial}
          onChange={e => onDial(e.target.value)}
          className={`w-[46%] max-w-[11.5rem] shrink-0 px-2 py-3 ${radius} text-xs outline-none`}
          style={{ background, border: `1px solid ${error ? "#EF4444" : "var(--border)"}`, color: "var(--text-primary)" }}
        >
          {DIAL_OPTIONS.map(option => (
            <option key={option.dial} value={option.dial}>{option.dial} {option.country}</option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          pattern={dial === "+237" ? "[0-9]{9}" : "[0-9]{7,12}"}
          maxLength={max}
          placeholder={dial === "+237" ? "683682958" : "612345678"}
          aria-label="Numéro local"
          value={local}
          onChange={e => onLocal(e.target.value.replace(/\D/g, "").slice(0, max))}
          className={`flex-1 px-4 py-3 ${radius} text-sm outline-none`}
          style={{ background, border: `1px solid ${error ? "#EF4444" : "var(--border)"}`, color: "var(--text-primary)" }}
        />
      </div>
      {error ? <p className="text-xs mt-1 px-1" style={{ color: "#EF4444" }}>{error}</p> : null}
    </div>
  )
}
