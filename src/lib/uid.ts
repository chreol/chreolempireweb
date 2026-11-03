// ── Identifiants uniques ──────────────────────────────────────────────────────
// Générés hors du rendu React (les appels impurs comme Date.now / randomUUID
// sont interdits pendant le rendu par react-hooks/purity).

export function makeId(prefix?: string): string {
  const rand = typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  const base = `${Date.now()}-${rand}`;
  return prefix ? `${prefix}-${base}` : base;
}
