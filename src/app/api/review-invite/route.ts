const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

function buildReviewEmail(name: string): string {
  const year = new Date().getFullYear();
  const reviewUrl = "https://g.page/r/CQaaC7b5Jbg_EAE/review";
  const displayName = name || "cher client";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Votre avis compte pour nous</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto;padding:20px 12px">

  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#0A0A0A;border-radius:12px 12px 0 0;padding:20px 32px;text-align:center">
      <p style="margin:0;font-size:24px;font-weight:900">
        <span style="color:#DAA520">Chreol</span><span style="color:#FFFFFF">Empire</span>
      </p>
      <p style="margin:4px 0 0;font-size:11px;color:#6B7280">Le monde digital, à portée de Mobile Money</p>
    </td></tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#FFFFFF;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

      <!-- Stars -->
      <p style="margin:0 0 16px;text-align:center;font-size:36px">⭐⭐⭐⭐⭐</p>

      <p style="margin:0 0 12px;font-size:16px;font-weight:900;color:#1F2937;text-align:center">
        Bonjour ${displayName} 👋
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:#6B7280;text-align:center;line-height:1.6">
        Merci de nous avoir fait confiance pour votre commande sur <strong>Chreol Empire</strong>.<br>
        Votre satisfaction est notre priorité — et votre avis compte énormément pour nous.
      </p>

      <!-- CTA -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="text-align:center;padding:8px 0 24px">
          <a href="${reviewUrl}"
            style="display:inline-block;background:#EA4335;color:#FFFFFF;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:900;font-size:15px;letter-spacing:0.3px">
            ⭐ Laisser mon avis Google
          </a>
          <p style="margin:10px 0 0;font-size:11px;color:#9CA3AF">Ça prend 30 secondes — et ça aide vraiment !</p>
        </td></tr>
      </table>

      <hr style="border:none;border-top:1px solid #F3F4F6;margin:8px 0 24px">

      <!-- Why it matters -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;margin-bottom:24px">
        <tr><td style="padding:16px 20px">
          <p style="margin:0 0 8px;font-size:12px;font-weight:900;color:#92400E;letter-spacing:1px">POURQUOI VOTRE AVIS EST IMPORTANT</p>
          <p style="margin:0;font-size:13px;color:#78350F;line-height:1.6">
            Chaque avis Google aide d'autres Camerounais à nous découvrir et à commander en toute confiance.
            Vous êtes l'ambassadeur de la communauté Chreol Empire 🇨🇲
          </p>
        </td></tr>
      </table>

      <!-- Support -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px">
        <tr><td style="padding:14px;text-align:center">
          <p style="margin:0 0 8px;font-size:12px;color:#065F46;font-weight:700">Un problème avec votre commande ? On est là 7j/7</p>
          <a href="https://wa.me/237697657734"
            style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:900;font-size:13px">
            💬 Contacter le support WhatsApp
          </a>
        </td></tr>
      </table>

      <p style="margin:24px 0 0;text-align:center;font-size:11px;color:#9CA3AF">
        © ${year} Chreol Empire · Boutiques Deido, Vallée 3, Douala, Cameroun<br>
        chreolempire.com
      </p>

    </td></tr>
  </table>
</div>
</body></html>`;
}

export async function POST(request: Request): Promise<Response> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return Response.json({ error: "Email non configuré" }, { status: 503, headers: CORS });
  }

  let body: { email?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON invalide" }, { status: 400, headers: CORS });
  }

  const email = body.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Email invalide" }, { status: 400, headers: CORS });
  }

  const name = body.name?.trim() || "";
  const senderId = parseInt(process.env.BREVO_SENDER_ID ?? "1", 10);
  const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": brevoKey },
    body: JSON.stringify({
      sender: { id: senderId },
      to: [{ email, name: name || "Client" }],
      subject: "⭐ Votre avis compte pour Chreol Empire 🙏",
      htmlContent: buildReviewEmail(name),
      scheduledAt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[review-invite] Brevo error ${res.status}: ${err}`);
    return Response.json({ error: "Échec envoi" }, { status: 502, headers: CORS });
  }

  console.log(`[review-invite] scheduled for ${email} at ${scheduledAt}`);
  return Response.json({ ok: true, scheduledAt }, { headers: CORS });
}
