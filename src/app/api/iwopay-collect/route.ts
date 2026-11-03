export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { createIwopayPayment, getIwopayStatus, iwopayExternalId, isIwopayConfigured, IWOPAY_OPERATORS, type IwopayOperator } from "@/lib/iwopayClient";
import { isAuthorizedInternal, clientIp, rateLimit, unauthorized } from "@/lib/internalAuth";
import { mapIwopayCustomerState } from "@/lib/iwopay";

interface CollectBody {
  amount?: number;
  phone?: string;
  operator?: string;
  motif?: string;
}

/**
 * Encaissement public : débite le numéro du client (op_type credit).
 * N'envoie jamais d'argent. Le versement sortant reste sur /api/iwopay-create.
 */
export async function POST(request: NextRequest): Promise<Response> {
  if (!isAuthorizedInternal(request)) return unauthorized();

  if (!isIwopayConfigured()) {
    return Response.json(
      { error: "Iwopay n'est pas configuré pour le moment. Choisissez Orange Money ou MTN, ou écrivez-nous sur WhatsApp." },
      { status: 503 },
    );
  }

  if (!rateLimit(`iwopay-collect:${clientIp(request)}`, 8)) {
    return Response.json({ error: "Trop de demandes — réessayez dans une minute" }, { status: 429 });
  }

  let body: CollectBody;
  try {
    body = await request.json() as CollectBody;
  } catch {
    return Response.json({ error: "Demande illisible" }, { status: 400 });
  }

  const amount = Math.round(Number(body.amount));
  if (!Number.isFinite(amount) || amount < 100 || amount > 2_000_000) {
    return Response.json({ error: "Montant invalide (100 – 2 000 000 FCFA)" }, { status: 422 });
  }

  const operator = body.operator as IwopayOperator | undefined;
  if (!operator || !IWOPAY_OPERATORS.some(o => o.id === operator)) {
    return Response.json({ error: "Choisissez Orange Money ou MTN MoMo" }, { status: 422 });
  }

  const digits = (body.phone ?? "").replace(/\D/g, "");
  const local = digits.startsWith("237") ? digits.slice(3) : digits;
  if (local.length !== 9) {
    return Response.json({ error: "Numéro invalide — 9 chiffres, sans indicatif" }, { status: 422 });
  }

  const orderId = iwopayExternalId();

  try {
    const result = await createIwopayPayment({
      operator,
      direction: "collect",
      amount,
      phone: local,
      externalId: orderId,
      motif: body.motif?.slice(0, 80) || "Paiement Chreol Empire",
    });

    if (!result.ok) {
      return Response.json(
        { ok: false, orderId, status: result.status, error: result.message ?? "Iwopay a refusé la demande de débit" },
        { status: 502 },
      );
    }

    return Response.json({
      ok: true,
      orderId,
      status: result.status,
      internalId: result.internalId,
      message: result.status === "01"
        ? "Débit confirmé"
        : "Demande envoyée — validez-la sur votre téléphone",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "iwopay_error";
    console.error(`[iwopay-collect] ${message}`);
    return Response.json({ error: "Service Iwopay indisponible. Réessayez ou payez par Orange Money / MTN." }, { status: 502 });
  }
}

/** État lisible par le client : validé, en attente, refusé ou annulé. */
export async function GET(request: NextRequest): Promise<Response> {
  if (!isAuthorizedInternal(request)) return unauthorized();

  if (!isIwopayConfigured()) {
    return Response.json({ error: "Iwopay n'est pas configuré" }, { status: 503 });
  }

  if (!rateLimit(`iwopay-collect-status:${clientIp(request)}`, 30)) {
    return Response.json({ error: "Trop de vérifications — réessayez dans une minute" }, { status: 429 });
  }

  const ref = new URL(request.url).searchParams.get("ref")?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(ref)) {
    return Response.json({ error: "Référence invalide" }, { status: 422 });
  }

  try {
    const result = await getIwopayStatus(ref);
    const view = mapIwopayCustomerState(result.status, result.message);
    return Response.json({ ok: true, ref, code: result.status, ...view });
  } catch (err) {
    const message = err instanceof Error ? err.message : "iwopay_error";
    console.error(`[iwopay-collect-status] ${message}`);
    return Response.json({ error: "Impossible de lire le statut Iwopay" }, { status: 502 });
  }
}
