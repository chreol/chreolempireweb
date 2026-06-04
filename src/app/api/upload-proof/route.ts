import { NextRequest } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED  = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function sbHeaders(serviceKey = false) {
  const key = serviceKey
    ? (process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "")
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
  return { apikey: key, Authorization: `Bearer ${key}` };
}

async function sendTelegramPhoto(photoUrl: string, caption: string, waNum: string) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: "💬 WhatsApp client", url: `https://wa.me/${waNum}` },
        ]],
      },
    }),
    signal: AbortSignal.timeout(8000),
  }).catch(() => {});
}

export async function POST(req: NextRequest): Promise<Response> {
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!sbUrl) return Response.json({ error: "Supabase non configuré" }, { status: 503 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const orderId = (formData.get("orderId") as string | null)?.trim();
  const file    = formData.get("file") as File | null;

  if (!orderId) return Response.json({ error: "orderId requis" }, { status: 400 });
  if (!file)    return Response.json({ error: "Fichier requis" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return Response.json({ error: "Format non accepté (jpeg/png/webp)" }, { status: 400 });
  if (file.size > MAX_SIZE) return Response.json({ error: "Fichier trop lourd (max 5 Mo)" }, { status: 400 });

  const ext      = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `${orderId}/${Date.now()}.${ext}`;
  const bucket   = "payment-proofs";

  // ── Upload vers Supabase Storage ────────────────────────────────────────────
  const uploadRes = await fetch(
    `${sbUrl}/storage/v1/object/${bucket}/${filename}`,
    {
      method: "POST",
      headers: {
        ...sbHeaders(true),
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: await file.arrayBuffer(),
    },
  );

  if (!uploadRes.ok) {
    const detail = await uploadRes.json().catch(() => ({}));
    console.error("[upload-proof] Storage error", uploadRes.status, detail);
    return Response.json({ error: "Erreur upload — vérifiez que le bucket payment-proofs existe", detail }, { status: 502 });
  }

  const proofUrl = `${sbUrl}/storage/v1/object/public/${bucket}/${filename}`;

  // ── PATCH commande avec proof_url ────────────────────────────────────────────
  await fetch(
    `${sbUrl}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      headers: { ...sbHeaders(true), "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ proof_url: proofUrl }),
    },
  ).catch(() => {});

  // ── Récupère infos commande pour la notif Telegram ───────────────────────────
  const orderRes  = await fetch(
    `${sbUrl}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=id,summary,total,client_name,client_phone`,
    { headers: sbHeaders(true) },
  ).catch(() => null);

  const orders = orderRes?.ok ? await orderRes.json().catch(() => []) : [];
  const order  = Array.isArray(orders) ? orders[0] : null;

  // ── Notification Telegram (sendPhoto) ───────────────────────────────────────
  if (order) {
    const ref     = orderId.slice(-8).toUpperCase();
    const waNum   = String(order.client_phone ?? "").replace(/\D/g, "");
    const waFull  = waNum.startsWith("237") ? waNum : `237${waNum}`;
    const caption = [
      `📎 <b>Preuve de paiement reçue</b>`,
      `📦 Commande <b>#${ref}</b>`,
      `👤 ${order.client_name ?? "Client"}`,
      `💰 ${Number(order.total ?? 0).toLocaleString("fr-FR")} FCFA`,
      `✅ À traiter dans votre dashboard admin`,
    ].join("\n");

    await sendTelegramPhoto(proofUrl, caption, waFull);
  }

  return Response.json({ ok: true, url: proofUrl });
}
