export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { createIwopayPayment, getIwopayConfig, isIwopayConfigured, IWOPAY_OPERATORS, type IwopayOperator } from "@/lib/iwopayClient";
import { getInternalSecret, clientIp, rateLimit, unauthorized } from "@/lib/internalAuth";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

interface CreateBody {
  amount?: number;
  phone?: string;
  operator?: string;
  orderId?: string;
  motif?: string;
  email?: string;
  name?: string;
}

const REF_RE = /^[A-Za-z0-9_-]{4,64}$/;

/**
 * ⚠️ direction "payout" → op_type "debit" : ENVOIE de l'argent sur le wallet.
 * Réservé à l'admin. L'encaissement client passe par /api/iwopay-collect (credit).
 */
async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value ?? "";
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(token, secret));
}

function hasInternalSecret(req: NextRequest): boolean {
  const secret = getInternalSecret();
  return Boolean(secret && req.headers.get("x-internal-secret") === secret);
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!hasInternalSecret(request) && !(await isAdmin(request))) {
    return unauthorized();
  }

  if (!isIwopayConfigured()) {
    return Response.json(
      { error: "Iwopay non configuré", configured: false },
      { status: 503 },
    );
  }

  if (!rateLimit(`iwopay-create:${clientIp(request)}`, 5)) {
    return Response.json({ error: "Trop de demandes — réessayez dans une minute" }, { status: 429 });
  }

  let body: CreateBody;
  try {
    body = await request.json() as CreateBody;
  } catch {
    return Response.json({ error: "JSON invalide" }, { status: 400 });
  }

  const amount = Math.round(Number(body.amount));
  if (!Number.isFinite(amount) || amount < 100 || amount > 2_000_000) {
    return Response.json({ error: "Montant invalide (100 – 2 000 000 FCFA)" }, { status: 422 });
  }

  const operator = body.operator as IwopayOperator | undefined;
  if (!operator || !IWOPAY_OPERATORS.some(o => o.id === operator)) {
    return Response.json({ error: "Opérateur invalide (om | momo)" }, { status: 422 });
  }

  const digits = (body.phone ?? "").replace(/\D/g, "");
  const local = digits.startsWith("237") ? digits.slice(3) : digits;
  if (local.length !== 9) {
    return Response.json({ error: "Numéro invalide — 9 chiffres" }, { status: 422 });
  }

  const orderId = body.orderId && REF_RE.test(body.orderId)
    ? body.orderId
    : `IWO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const cfg = getIwopayConfig();
  if (!cfg) return Response.json({ error: "Iwopay non configuré" }, { status: 503 });

  try {
    const result = await createIwopayPayment({
      operator,
      direction: "payout",
      amount,
      phone: local,
      externalId: orderId,
      motif: body.motif?.slice(0, 80) || "Paiement Chreol Empire",
      clientName: body.name,
      clientEmail: body.email,
    }, cfg);

    if (!result.ok) {
      return Response.json(
        { ok: false, orderId, status: result.status, error: result.message ?? "Demande refusée par Iwopay" },
        { status: 502 },
      );
    }

    return Response.json({
      ok: true,
      orderId,
      status: result.status,
      internalId: result.internalId,
      message: result.message ?? "Payout envoyé",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "iwopay_error";
    console.error(`[iwopay-create] ${message}`);
    return Response.json({ error: "Service Iwopay indisponible", detail: message }, { status: 502 });
  }
}

// Indique simplement si les clés Iwopay sont configurées (aucune donnée sensible).
export async function GET(): Promise<Response> {
  return Response.json({ configured: isIwopayConfigured() });
}
