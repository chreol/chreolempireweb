import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export function Field({ label, error, optional, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
        {optional && (
          <span className="text-[10px] font-semibold normal-case tracking-normal px-1.5 py-0.5 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
            optionnel
          </span>
        )}
      </label>
      {children}
      {error && <span className="text-xs font-semibold" style={{ color: "#EF4444" }}>{error}</span>}
    </div>
  );
}

interface CalcRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function CalcRow({ label, value, highlight }: CalcRowProps) {
  return (
    <div className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span
        className={`text-sm font-bold tabular-nums ${highlight ? "" : "text-white"}`}
        style={highlight ? { color: "var(--gold)" } : {}}
      >
        {value}
      </span>
    </div>
  );
}
