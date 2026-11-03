// ── Client serveur Iwopay (Iwomipay prod v1) ─────────────────────────────────
// Les clés sont lues uniquement côté serveur (variables d'environnement) :
//   IWOPAY_BASE_URL     — défaut : https://www.pay.iwomitechnologies.com/api/iwomipay_prodv1
//   IWOPAY_USERNAME     — identifiant marchand Iwopay
//   IWOPAY_PASSWORD     — mot de passe marchand Iwopay
//   IWOPAY_KEY_OM / IWOPAY_SECRET_OM       — paire de clés Orange Money
//   IWOPAY_KEY_MOMO / IWOPAY_SECRET_MOMO   — paire de clés MTN MoMo
//   IWOPAY_CALLBACK_URL — URL appelée par Iwopay après paiement
//                         (défaut : <NEXT_PUBLIC_SITE_URL>/api/iwopay-webhook)

export type IwopayOperator = "om" | "momo";

export const IWOPAY_OPERATORS: ReadonlyArray<{ id: IwopayOperator; label: string }> = [
  { id: "om",   label: "Orange Money" },
  { id: "momo", label: "MTN MoMo" },
];

export interface IwopayConfig {
  baseUrl: string;
  username: string;
  password: string;
  accounts: Record<IwopayOperator, { key: string; secret: string }>;
  callbackUrl: string;
}

const DEFAULT_BASE_URL = "https://www.pay.iwomitechnologies.com/api/iwomipay_prodv1";

export function getIwopayConfig(): IwopayConfig | null {
  const username = process.env.IWOPAY_USERNAME?.trim();
  const password = process.env.IWOPAY_PASSWORD?.trim();
  const keyOm = process.env.IWOPAY_KEY_OM?.trim();
  const secretOm = process.env.IWOPAY_SECRET_OM?.trim();
  const keyMomo = process.env.IWOPAY_KEY_MOMO?.trim();
  const secretMomo = process.env.IWOPAY_SECRET_MOMO?.trim();

  if (!username || !password || !keyOm || !secretOm || !keyMomo || !secretMomo) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shop.chreolempire.com";

  return {
    baseUrl: (process.env.IWOPAY_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, ""),
    username,
    password,
    accounts: {
      om:   { key: keyOm,   secret: secretOm },
      momo: { key: keyMomo, secret: secretMomo },
    },
    callbackUrl: process.env.IWOPAY_CALLBACK_URL?.trim() || `${siteUrl.replace(/\/+$/, "")}/api/iwopay-webhook`,
  };
}

export function isIwopayConfigured(): boolean {
  return getIwopayConfig() !== null;
}

// ── Token (JWT ~1 h) ─────────────────────────────────────────────────────────

let tokenCache: { value: string; expiresAt: number } | null = null;

export function resetIwopayToken(): void {
  tokenCache = null;
}

function jwtExpiry(token: string): number | null {
  const part = token.split(".")[1];
  if (!part) return null;
  try {
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export async function getIwopayToken(cfg: IwopayConfig = getIwopayConfig() as IwopayConfig): Promise<string> {
  if (!cfg) throw new Error("iwopay_not_configured");
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.value;

  const res = await fetch(`${cfg.baseUrl}/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: cfg.username, password: cfg.password }),
    signal: AbortSignal.timeout(20_000),
  });

  const data = await res.json().catch(() => ({})) as { token?: string; message?: string };
  if (!res.ok || !data.token) {
    throw new Error(`iwopay_auth_failed_${res.status}`);
  }

  const exp = jwtExpiry(data.token) ?? Date.now() + 30 * 60 * 1000;
  tokenCache = { value: data.token, expiresAt: exp };
  return data.token;
}

// ── Création d'une demande de paiement ───────────────────────────────────────

export interface CreateIwopayPaymentParams {
  operator: IwopayOperator;
  /** Montant en FCFA (entier) */
  amount: number;
  /** Numéro Mobile Money : 9 chiffres (sans indicatif) ou avec 237 */
  phone: string;
  /** Référence unique côté marchand */
  externalId: string;
  motif?: string;
  clientName?: string;
  clientEmail?: string;
  callbackUrl?: string;
}

export interface IwopayPaymentResult {
  ok: boolean;
  /** Statut brut renvoyé par Iwopay — "1000" = demande acceptée */
  status: string;
  internalId?: string;
  message?: string;
}

function accountKey(cfg: IwopayConfig, operator: IwopayOperator): string {
  const acc = cfg.accounts[operator];
  return btoa(`${acc.key}:${acc.secret}`);
}

export async function createIwopayPayment(
  params: CreateIwopayPaymentParams,
  cfg: IwopayConfig = getIwopayConfig() as IwopayConfig,
): Promise<IwopayPaymentResult> {
  if (!cfg) throw new Error("iwopay_not_configured");

  const digits = params.phone.replace(/\D/g, "");
  const local = digits.startsWith("237") ? digits.slice(3) : digits;
  if (local.length !== 9) throw new Error("iwopay_invalid_phone");

  const token = await getIwopayToken(cfg);

  const body = {
    op_type: "credit",
    type: params.operator,
    amount: String(Math.round(params.amount)),
    external_id: params.externalId,
    motif: params.motif ?? "Paiement Chreol Empire",
    tel: `237${local}`,
    country: "cm",
    currency: "xaf",
    callback_url: params.callbackUrl ?? cfg.callbackUrl,
  };

  const res = await fetch(`${cfg.baseUrl}/iwomipay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      AccountKey: accountKey(cfg, params.operator),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });

  const data = await res.json().catch(() => ({})) as {
    status?: string; internal_id?: string; message?: string;
  };

  return {
    ok: res.ok && data.status === "1000",
    status: data.status ?? String(res.status),
    internalId: data.internal_id,
    message: data.message,
  };
}

// ── Statut d'une transaction ─────────────────────────────────────────────────

export interface IwopayStatusResult {
  status: string;
  /** true si Iwopay considère le paiement comme abouti (statuts 100 / 01) */
  paid: boolean;
  raw?: unknown;
}

export async function getIwopayStatus(
  externalId: string,
  cfg: IwopayConfig = getIwopayConfig() as IwopayConfig,
): Promise<IwopayStatusResult> {
  if (!cfg) throw new Error("iwopay_not_configured");

  const token = await getIwopayToken(cfg);
  const res = await fetch(`${cfg.baseUrl}/iwomipayStatus/${encodeURIComponent(externalId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(20_000),
  });

  const data = await res.json().catch(() => ({})) as { status?: string };
  const status = data.status ?? String(res.status);
  return { status, paid: status === "100" || status === "01", raw: data };
}
