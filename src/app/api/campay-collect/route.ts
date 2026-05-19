export const runtime = "edge";

import { isValidPhone, isOperatorConsistent } from "@/lib/phone";

const VALID_OPERATORS = new Set(["orange", "mtn"]);
const AMOUNT_MIN = 100;
const AMOUNT_MAX = 500_000;

// In-memory rate limit: max 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

interface CollectPayload {
  phone: string;
  operator: "orange" | "mtn";
  amount: number;
  label: string;
  externalReference: string;
}

export async function POST(request: Request): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return Response.json({ error: "Trop de requêtes — réessayez dans une minute" }, { status: 429 });
  }

  let body: CollectPayload;
  try {
    body = (await request.json()) as CollectPayload;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { phone, operator, amount, label, externalReference } = body;

  // Validation stricte des champs
  if (!phone || !operator || !amount || !externalReference) {
    return Response.json({ error: "Champs requis manquants" }, { status: 422 });
  }
  if (!VALID_OPERATORS.has(operator)) {
    return Response.json({ error: "Opérateur invalide" }, { status: 422 });
  }
  if (!isValidPhone(phone)) {
    return Response.json({ error: "Numéro invalide — 9 chiffres sans indicatif" }, { status: 422 });
  }
  if (!isOperatorConsistent(phone, operator)) {
    return Response.json({ error: `Ce numéro n'appartient pas à ${operator === "orange" ? "Orange" : "MTN"}` }, { status: 422 });
  }
  if (!Number.isFinite(amount) || amount < AMOUNT_MIN || amount > AMOUNT_MAX) {
    return Response.json({ error: `Montant invalide (min ${AMOUNT_MIN} XAF, max ${AMOUNT_MAX.toLocaleString()} XAF)` }, { status: 422 });
  }
  if (label.length > 150) {
    return Response.json({ error: "Description trop longue" }, { status: 422 });
  }

  const token = process.env.CAMPAY_API_TOKEN;
  if (!token) {
    console.error("[campay-collect] CAMPAY_API_TOKEN manquant");
    return Response.json({ error: "Paiement automatique non configuré" }, { status: 503 });
  }

  const baseUrl = process.env.CAMPAY_BASE_URL ?? "https://campay.net";
  const fullPhone = phone.startsWith("237") ? phone : `237${phone}`;

  try {
    const campayRes = await fetch(`${baseUrl}/api/collect/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        amount: String(amount),
        currency: "XAF",
        from: fullPhone,
        description: label.trim(),
        external_reference: externalReference,
      }),
    });

    const data = await campayRes.json();
    console.log(`[campay-collect] ${campayRes.status} — ${operator} ${fullPhone} | ${amount} XAF | ref=${externalReference}`);
    return Response.json(data, { status: campayRes.status });
  } catch (err) {
    console.error("[campay-collect] Erreur réseau:", err);
    return Response.json({ error: "Erreur connexion Campay" }, { status: 502 });
  }
}
