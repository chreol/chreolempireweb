const KEY = "chreol-iwopay-receipts";

export interface IwopayReceipt {
  ref: string;
  /** Identifiant Iwopay, utilisé pour interroger le statut. */
  internalId?: string;
  amount: number;
  motif?: string;
  at: string;
}

export function loadIwopayReceipts(): IwopayReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) as IwopayReceipt[] : [];
    return Array.isArray(list) ? list.slice(0, 8) : [];
  } catch {
    return [];
  }
}

export function saveIwopayReceipt(receipt: IwopayReceipt): void {
  const next = [receipt, ...loadIwopayReceipts().filter(r => r.ref !== receipt.ref)].slice(0, 8);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}
