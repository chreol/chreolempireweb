import { NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Champs requis invalides." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      if (error.message?.toLowerCase().includes("already registered") || error.message?.toLowerCase().includes("already")) {
        return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
      }
      console.error("[auth/register] échec création utilisateur :", error.message);
      return NextResponse.json({ error: error.message ?? "Création du compte impossible." }, { status: 500 });
    }

    // Notification admin (email Brevo + Telegram) — non bloquante pour le client.
    try {
      const adminEmail = process.env.ADMIN_EMAIL ?? "contact@chreolempire.com";
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": process.env.BREVO_API_KEY ?? "" },
        body: JSON.stringify({
          sender: { name: "Chreol Empire", email: process.env.BREVO_SENDER_EMAIL ?? "chreolempire00@gmail.com" },
          to: [{ email: adminEmail, name: "Chreol Empire Admin" }],
          subject: `🆕 [CHREOL EMPIRE] Nouvelle inscription : ${name}`,
          htmlContent: `<p>Un nouvel utilisateur s'est inscrit : <strong>${email}</strong> (Nom : ${name}).</p>`,
        }),
      });
    } catch (e) {
      console.error("[auth/register] notification admin email échouée :", e);
    }

    try {
      const tgToken = process.env.TELEGRAM_BOT_TOKEN;
      const tgChatId = process.env.TELEGRAM_CHAT_ID;
      if (tgToken && tgChatId) {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: `🆕 Nouvelle inscription : ${name} — ${email}`,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        });
      }
    } catch (e) {
      console.error("[auth/register] notification telegram échouée :", e);
    }

    return NextResponse.json({ ok: true, user: { id: data?.user?.id ?? null, email: data?.user?.email ?? email } });
  } catch (e) {
    console.error("[auth/register] erreur :", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
