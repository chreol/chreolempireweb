export const runtime = "edge";

async function hmac32(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function buildDeliveryEmail(name: string, ref: string): string {
  const year = new Date().getFullYear();
  const reviewUrl = "https://g.page/r/CQaaC7b5Jbg_EAE/review";
  const displayName = name || "cher client";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Commande livrée #${ref}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto;padding:20px 12px">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#0A0A0A;border-radius:12px 12px 0 0;padding:20px 32px;text-align:center">
      <p style="margin:0;font-size:24px;font-weight:900">
        <span style="color:#DAA520">Chreol</span><span style="color:#FFFFFF">Empire</span>
      </p>
      <p style="margin:4px 0 0;font-size:11px;color:#6B7280">Le monde digital, à portée de Mobile Money</p>
    </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#D1FAE5;padding:16px 32px;border-left:4px solid #10B981">
      <p style="margin:0;font-weight:900;color:#065F46;font-size:16px">✅ Votre commande a été livrée !</p>
      <p style="margin:4px 0 0;color:#047857;font-size:13px">
        Bonjour ${displayName}, votre commande <strong>#${ref}</strong> a bien été traitée.
      </p>
    </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#FFFFFF;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

      <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;text-align:center">
        Vos articles ont été transmis sur WhatsApp.<br>
        Si vous n'avez pas encore reçu votre commande, contactez-nous immédiatement.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;margin-bottom:24px">
        <tr><td style="padding:16px;text-align:center">
          <p style="margin:0 0 4px;font-size:13px;font-weight:900;color:#92400E">Votre avis nous aide énormément 🙏</p>
          <p style="margin:0 0 12px;font-size:12px;color:#78350F">30 secondes pour aider d'autres Camerounais à nous faire confiance.</p>
          <a href="${reviewUrl}" style="display:inline-block;background:#EA4335;color:#FFFFFF;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:900;font-size:13px">
            ⭐ Laisser un avis Google
          </a>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px">
        <tr><td style="padding:14px;text-align:center">
          <p style="margin:0 0 8px;font-size:12px;color:#065F46;font-weight:700">Un problème ? Notre équipe est disponible 7j/7</p>
          <a href="https://wa.me/237697657734" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:900;font-size:13px">
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

const SUCCESS_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Commande traitée</title>
<style>body{margin:0;background:#F0FDF4;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
.card{background:#fff;border-radius:16px;padding:40px 32px;max-width:380px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.08)}
.icon{font-size:56px;margin-bottom:16px}.title{font-size:20px;font-weight:900;color:#065F46;margin:0 0 8px}
.sub{font-size:14px;color:#6B7280;line-height:1.6;margin:0}</style></head>
<body><div class="card">
  <div class="icon">✅</div>
  <p class="title">Commande marquée comme traitée</p>
  <p class="sub">L'email de confirmation de livraison a été envoyé au client.</p>
</div></body></html>`;

const ERROR_HTML = (msg: string) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Erreur</title>
<style>body{margin:0;background:#FEF2F2;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
.card{background:#fff;border-radius:16px;padding:40px 32px;max-width:380px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.08)}
.icon{font-size:56px;margin-bottom:16px}.title{font-size:18px;font-weight:900;color:#991B1B;margin:0 0 8px}
.sub{font-size:13px;color:#6B7280;margin:0}</style></head>
<body><div class="card">
  <div class="icon">❌</div>
  <p class="title">Lien invalide ou expiré</p>
  <p class="sub">${msg}</p>
</div></body></html>`;

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("id")  ?? "";
  const email   = searchParams.get("to") ?? "";
  const name    = searchParams.get("n")  ?? "";
  const sig     = searchParams.get("sig") ?? "";

  if (!orderId || !email || !sig) {
    return new Response(ERROR_HTML("Paramètres manquants."), { status: 400, headers: { "Content-Type": "text/html" } });
  }

  const secret   = process.env.MARK_DONE_SECRET ?? process.env.BREVO_API_KEY ?? "chreolempire";
  const expected = await hmac32(secret, `${orderId}:${email}`);
  if (sig !== expected) {
    return new Response(ERROR_HTML("Token de sécurité invalide."), { status: 403, headers: { "Content-Type": "text/html" } });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return new Response(ERROR_HTML("Service email non configuré."), { status: 503, headers: { "Content-Type": "text/html" } });
  }

  const senderId = parseInt(process.env.BREVO_SENDER_ID ?? "1", 10);
  const ref      = orderId.slice(-8).toUpperCase();

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": brevoKey },
    body: JSON.stringify({
      sender: { id: senderId },
      to: [{ email, name: name || "Client" }],
      subject: `✅ Votre commande #${ref} a été livrée — Chreol Empire`,
      htmlContent: buildDeliveryEmail(name, ref),
    }),
  });

  if (!res.ok) {
    console.error(`[mark-done] Brevo ${res.status} for ${email}`);
    return new Response(ERROR_HTML("Échec d'envoi de l'email client."), { status: 502, headers: { "Content-Type": "text/html" } });
  }

  console.log(`[mark-done] delivery email sent → ${email} (order ${ref})`);
  return new Response(SUCCESS_HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
