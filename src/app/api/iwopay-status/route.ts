export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getIwopayStatus, isIwopayConfigured } from "@/lib/iwopayClient";
import { getInternalSecret, clientIp, rateLimit, unauthorized } from "@/lib/internalAuth";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value ?? "";
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(token, secret));
}

function hasInternalSecret(req: NextRequest): boolean {
  const secret = getInternalSecret();
  return Boolean(secret && req.headers.get("x-internal-secret") === secret);
}

export async function GET(request: NextRequest): Promise<Response> {
  // Statut de transaction : réservé aux appels serveur et à l'administration.
  if (!hasInternalSecret(request) && !(await isAdmin(request))) {
    return unauthorized();
  }

  if (!isIwopayConfigured()) {
    return Response.json({ error: "Iwopay non configuré", configured: false }, { status: 503 });
  }

  if (!rateLimit(`iwopay-status:${clientIp(request)}`, 40)) {
    return Response.json({ error: "Trop de requêtes — réessayez dans une minute" }, { status: 429 });
  }

  const ref = new URL(request.url).searchParams.get("ref")?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(ref)) {
    return Response.json({ error: "Référence invalide" }, { status: 422 });
  }

  try {
    const result = await getIwopayStatus(ref);
    return Response.json({
      ok: true,
      ref,
      status: result.status,
      paid: result.paid,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "iwopay_error";
    console.error(`[iwopay-status] ${message}`);
    return Response.json({ error: "Service Iwopay indisponible", detail: message }, { status: 502 });
  }
}
