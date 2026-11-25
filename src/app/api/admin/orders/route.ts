import { NextRequest } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";
import { patchForWorkflow, type OrderWorkflow } from "@/lib/orderWorkflow";

export const runtime = "edge";

async function authOk(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value ?? "";
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(token, secret));
}

// Service key bypasse les RLS — obligatoire pour SELECT admin
function sbHeaders(write = false) {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const anonKey    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const key = (write || !serviceKey) ? anonKey : serviceKey;
  return {
    "Content-Type": "application/json",
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit  = parseInt(searchParams.get("limit") ?? "100", 10);

  let endpoint = `${url}/rest/v1/orders?select=*&order=created_at.desc&limit=${limit}`;
  if (status && status !== "all") endpoint += `&status=eq.${status}`;

  const res  = await fetch(endpoint, { headers: sbHeaders(false) });
  const data = await res.json();

  if (!res.ok) {
    console.error("[admin/orders GET]", res.status, data);
    return Response.json({ error: "Erreur Supabase — vérifiez SUPABASE_SERVICE_KEY", detail: data }, { status: 502 });
  }
  return Response.json(data);
}

export async function PATCH(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  const body = await req.json();
  const { id, status, workflow, internalNote } = body as {
    id?: string;
    status?: string;
    workflow?: string;
    internalNote?: string;
  };
  if (!id) return Response.json({ error: "id requis" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  const allowedStatus = new Set(["pending", "done", "cancelled"]);
  if (workflow) {
    const known = ["PENDING", "PAID", "DELIVERED", "CANCELLED"];
    if (!known.includes(workflow)) return Response.json({ error: "Statut inconnu" }, { status: 400 });
    Object.assign(patch, patchForWorkflow(workflow as OrderWorkflow));
  } else if (status) {
    if (!allowedStatus.has(status)) return Response.json({ error: "Statut inconnu" }, { status: 400 });
    patch.status = status;
  }

  if (typeof internalNote === "string") {
    const current = await fetch(
      `${url}/rest/v1/orders?id=eq.${encodeURIComponent(id)}&select=details&limit=1`,
      { headers: sbHeaders(false), cache: "no-store" },
    );
    if (!current.ok) return Response.json({ error: "Note non enregistrée" }, { status: 502 });
    const rows = await current.json();
    if (!Array.isArray(rows) || !rows[0]) return Response.json({ error: "Commande introuvable" }, { status: 404 });
    let details: Record<string, unknown> = {};
    const raw = Array.isArray(rows) ? rows[0]?.details : undefined;
    if (typeof raw === "string") {
      try { details = JSON.parse(raw) as Record<string, unknown>; } catch { details = {}; }
    } else if (raw && typeof raw === "object") {
      details = raw as Record<string, unknown>;
    }
    patch.details = { ...details, internalNote: internalNote.slice(0, 2000) };
  }

  if (Object.keys(patch).length === 0) {
    return Response.json({ error: "Aucune modification" }, { status: 400 });
  }

  const res = await fetch(`${url}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...sbHeaders(true), Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });

  return new Response(null, { status: res.ok ? 204 : 502 });
}
