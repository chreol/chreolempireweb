export interface ClientInfo {
  name:     string;
  email:    string;
  phone:    string;
  dialCode: string;
}

const INFO_KEY        = "chreol_client_info";
const LAST_ORDER_KEY  = "chreol_last_order";
const DEDUP_WINDOW_MS = 30 * 60 * 1000; // 30 min

export function saveClientInfo(partial: Partial<ClientInfo>): void {
  try {
    const existing: Partial<ClientInfo> = loadClientInfo() ?? {};
    const merged: Partial<ClientInfo> = { ...existing };
    // Ne remplace que les champs non vides fournis
    for (const [k, v] of Object.entries(partial)) {
      if (v && String(v).trim()) merged[k as keyof ClientInfo] = String(v).trim();
    }
    localStorage.setItem(INFO_KEY, JSON.stringify(merged));
  } catch { /* SSR / private browsing */ }
}

export function loadClientInfo(): ClientInfo | null {
  try {
    const raw = localStorage.getItem(INFO_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<ClientInfo>;
    if (!p.email) return null;
    return {
      name:     p.name     ?? "",
      email:    p.email    ?? "",
      phone:    p.phone    ?? "",
      dialCode: p.dialCode ?? "+237",
    };
  } catch { return null; }
}

export function clearClientInfo(): void {
  try { localStorage.removeItem(INFO_KEY); } catch { /* ignore */ }
}

// ── Dernière commande (anti-doublon côté client) ───────────────────────────

export interface LastOrder {
  orderId:   string;
  email:     string;
  total:     number;
  timestamp: number;
}

export function saveLastOrder(orderId: string, email: string, total: number): void {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ orderId, email, total, timestamp: Date.now() }));
  } catch { /* ignore */ }
}

export function loadRecentOrder(email: string): LastOrder | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as LastOrder;
    if (o.email !== email) return null;
    if (Date.now() - o.timestamp > DEDUP_WINDOW_MS) return null;
    return o;
  } catch { return null; }
}
