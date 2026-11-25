import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";
import { savePasswordHash, verifyAdminPassword } from "@/lib/adminPassword";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const secret = getAdminSecret();
    const token = req.cookies.get("admin_token")?.value ?? "";
    if (!secret || !(await verifyAdminToken(token, secret))) {
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const currentPassword = String(body.currentPassword ?? "");
    const newPassword = String(body.newPassword ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");

    if (newPassword.length < 8) {
      return Response.json({ error: "Le nouveau mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return Response.json({ error: "La confirmation ne correspond pas." }, { status: 400 });
    }
    if (!(await verifyAdminPassword(currentPassword))) {
      return Response.json({ error: "Ancien mot de passe incorrect." }, { status: 401 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const error = await savePasswordHash(passwordHash);
    if (error) return Response.json({ error }, { status: 503 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[admin/password]", err);
    return Response.json({ error: "Changement impossible." }, { status: 500 });
  }
}
