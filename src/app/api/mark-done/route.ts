export const runtime = "edge";

interface OrderSummary {
  it: { n: string; t: number; q: number }[];
  tot: number;
  pm: string;
}

function decodeSummary(s: string): OrderSummary | null {
  try {
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch { return null; }
}

function orderRecapHtml(summary: OrderSummary | null): string {
  if (!summary) return "";
  const rows = summary.it.map(i =>
    `<tr>
      <td style="padding:9px 14px;font-size:13px;color:#1F2937;border-bottom:1px solid #F3F4F6">${i.n}${i.q > 1 ? ` ×${i.q}` : ""}</td>
      <td style="padding:9px 14px;font-size:13px;font-weight:700;color:#B45309;text-align:right;border-bottom:1px solid #F3F4F6;white-space:nowrap">${i.t.toLocaleString("fr-FR")} FCFA</td>
    </tr>`
  ).join("");
  return `
  <p style="margin:0 0 8px;font-size:10px;color:#9CA3AF;font-weight:900;letter-spacing:1.5px">RÉCAPITULATIF</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:16px">
    <tbody>${rows}</tbody>
    <tfoot>
      <tr style="background:#FFFBEB">
        <td style="padding:11px 14px;font-size:13px;font-weight:900;color:#78350F">TOTAL</td>
        <td style="padding:11px 14px;font-size:15px;font-weight:900;color:#B45309;text-align:right;white-space:nowrap">${summary.tot.toLocaleString("fr-FR")} FCFA</td>
      </tr>
    </tfoot>
  </table>`;
}

function reorderUrl(summary: OrderSummary | null, ref: string): string {
  const items = summary?.it.map(i => `- ${i.n}${i.q > 1 ? ` ×${i.q}` : ""}`).join("%0A") ?? "";
  const total = summary ? `${summary.tot.toLocaleString("fr-FR")} FCFA` : "";
  const msg = `Bonjour%20Chreol%20Empire%20%F0%9F%91%8B%0AJe%20souhaite%20repasser%20ma%20commande%20%23${ref}%20:%0A${items}%0A%0ATotal%20:%20${encodeURIComponent(total)}%0AMerci%20!`;
  return `https://wa.me/237697657734?text=${msg}`;
}

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

function buildCancelEmail(name: string, ref: string, summary: OrderSummary | null): string {
  const year = new Date().getFullYear();
  const displayName = name || "cher client";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Commande #${ref} — Un souci est survenu</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto;padding:20px 12px">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#0A0A0A;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center">
      <p style="margin:0;font-size:26px;font-weight:900">
        <span style="color:#DAA520">Chreol</span><span style="color:#FFFFFF">Empire</span>
      </p>
      <p style="margin:4px 0 0;font-size:11px;color:#6B7280">Le monde digital, à portée de Mobile Money</p>
    </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:linear-gradient(135deg,#7F1D1D,#991B1B);padding:24px 32px;text-align:center">
      <p style="margin:0;font-size:36px">😔</p>
      <p style="margin:8px 0 4px;font-weight:900;color:#FFFFFF;font-size:18px">Un souci est survenu</p>
      <p style="margin:0;color:#FCA5A5;font-size:13px">Bonjour <strong>${displayName}</strong>, votre commande <strong>#${ref}</strong> n'a pas pu être traitée.</p>
      <p style="margin:12px 0 0;display:inline-block;background:rgba(239,68,68,0.3);border:1px solid rgba(239,68,68,0.5);color:#FECACA;font-size:11px;font-weight:900;padding:5px 16px;border-radius:20px;letter-spacing:1px">
        ❌ STATUT : ANNULÉE
      </p>
    </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#FFFFFF;padding:28px 32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

      <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;text-align:center">
        Nous sommes vraiment désolés pour ce désagrément.<br>
        Votre satisfaction est notre priorité — <strong>repasser commande prend moins de 2 minutes</strong>.
      </p>

      ${orderRecapHtml(summary)}

      <!-- Reorder CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;margin-bottom:16px">
        <tr><td style="padding:20px;text-align:center">
          <p style="margin:0 0 4px;font-size:14px;font-weight:900;color:#92400E">Repasser la même commande en 1 clic</p>
          <p style="margin:0 0 14px;font-size:12px;color:#78350F">Votre commande est pré-remplie — il suffit d'envoyer le message.</p>
          <a href="${reorderUrl(summary, ref)}" target="_blank" rel="noopener noreferrer"
            style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:13px 28px;border-radius:8px;font-weight:900;font-size:14px">
            🔄 Repasser ma commande via WhatsApp
          </a>
        </td></tr>
      </table>

      <!-- Refund notice -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;margin-bottom:16px">
        <tr><td style="padding:14px 16px">
          <p style="margin:0;font-size:13px;font-weight:900;color:#991B1B">💳 Vous avez effectué un paiement ?</p>
          <p style="margin:6px 0 0;font-size:12px;color:#B91C1C;line-height:1.5">
            Contactez-nous immédiatement sur WhatsApp avec votre référence <strong>#${ref}</strong>. Nous vous rembourserons intégralement dans les plus brefs délais.
          </p>
        </td></tr>
      </table>

      <!-- Support -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px">
        <tr><td style="padding:14px;text-align:center">
          <p style="margin:0 0 8px;font-size:12px;color:#065F46;font-weight:700">Notre équipe est disponible 7j/7 — 7h à 23h</p>
          <a href="https://wa.me/237697657734" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:900;font-size:13px">
            💬 Contacter le support WhatsApp
          </a>
        </td></tr>
      </table>

      <p style="margin:24px 0 0;text-align:center;font-size:11px;color:#9CA3AF">
        © ${year} Chreol Empire · Boutiques Deido, Vallée 3, Douala, Cameroun<br>
        <a href="https://shop.chreolempire.com" target="_blank" rel="noopener noreferrer" style="color:#B45309;text-decoration:none;">chreolempire.com</a>
      </p>

    </td></tr>
  </table>
</div>
</body></html>`;
}

function buildDeliveryEmail(name: string, ref: string, summary: OrderSummary | null): string {
  const year = new Date().getFullYear();
  const reviewUrl = "https://g.page/r/CQaaC7b5Jbg_EAE/review";
  const displayName = name || "cher client";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Commande livrée ✅ #${ref}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto;padding:20px 12px">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#0A0A0A;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center">
      <p style="margin:0;font-size:26px;font-weight:900">
        <span style="color:#DAA520">Chreol</span><span style="color:#FFFFFF">Empire</span>
      </p>
      <p style="margin:4px 0 0;font-size:11px;color:#6B7280">Le monde digital, à portée de Mobile Money</p>
    </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:linear-gradient(135deg,#065F46,#047857);padding:24px 32px;text-align:center">
      <p style="margin:0;font-size:40px">🎉</p>
      <p style="margin:8px 0 4px;font-weight:900;color:#FFFFFF;font-size:20px">Votre commande a été livrée !</p>
      <p style="margin:0;color:#A7F3D0;font-size:13px">Bonjour <strong>${displayName}</strong>, tout est en ordre.</p>
      <p style="margin:12px 0 0;display:inline-block;background:#10B981;color:#FFFFFF;font-size:11px;font-weight:900;padding:5px 16px;border-radius:20px;letter-spacing:1px">
        ✅ STATUT : LIVRÉ
      </p>
    </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#FFFFFF;padding:28px 32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

      <!-- Ref + status -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:16px;margin-bottom:20px">
        <tr>
          <td style="text-align:center">
            <p style="margin:0;font-size:10px;color:#065F46;font-weight:900;letter-spacing:2px">RÉFÉRENCE COMMANDE</p>
            <p style="margin:6px 0 0;font-size:26px;font-weight:900;color:#047857;letter-spacing:3px">#${ref}</p>
          </td>
          <td style="text-align:center;border-left:1px solid #BBF7D0;padding-left:16px">
            <p style="margin:0;font-size:28px">✅</p>
            <p style="margin:4px 0 0;font-size:12px;font-weight:900;color:#065F46">Livrée</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;text-align:center">
        Vos articles ont bien été transmis sur WhatsApp.<br>
        <strong>Merci de votre confiance</strong> — nous espérons vous revoir très bientôt ! 🙏
      </p>

      ${orderRecapHtml(summary)}

      <!-- Reorder -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
        <tr><td style="text-align:center">
          <a href="${reorderUrl(summary, ref)}" target="_blank" rel="noopener noreferrer"
            style="display:inline-block;background:#0A0A0A;color:#DAA520;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:900;font-size:13px;border:2px solid #DAA520">
            🔄 Repasser la même commande
          </a>
          <p style="margin:6px 0 0;font-size:11px;color:#9CA3AF">Ouvre WhatsApp avec votre commande pré-remplie</p>
        </td></tr>
      </table>

      <!-- Guarantee badges -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
        <tr>
          <td style="padding:10px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;text-align:center">
            <p style="margin:0;font-size:16px">✅</p>
            <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:#92400E">Code authentique</p>
          </td>
          <td width="8"></td>
          <td style="padding:10px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;text-align:center">
            <p style="margin:0;font-size:16px">🔒</p>
            <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:#92400E">Paiement sécurisé</p>
          </td>
          <td width="8"></td>
          <td style="padding:10px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;text-align:center">
            <p style="margin:0;font-size:16px">⭐</p>
            <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:#92400E">4.9/5 · 127 avis</p>
          </td>
        </tr>
      </table>

      <!-- Review CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;margin-bottom:16px">
        <tr><td style="padding:16px;text-align:center">
          <p style="margin:0 0 4px;font-size:13px;font-weight:900;color:#92400E">Votre avis aide des milliers de Camerounais 🙏</p>
          <p style="margin:0 0 12px;font-size:12px;color:#78350F">30 secondes pour nous soutenir — et ça compte vraiment.</p>
          <a href="${reviewUrl}" style="display:inline-block;background:#EA4335;color:#FFFFFF;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:900;font-size:13px">
            ⭐ Laisser un avis Google
          </a>
        </td></tr>
      </table>

      <!-- Support -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px">
        <tr><td style="padding:14px;text-align:center">
          <p style="margin:0 0 8px;font-size:12px;color:#065F46;font-weight:700">Un problème avec votre commande ? On est là 7j/7</p>
          <a href="https://wa.me/237697657734" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:900;font-size:13px">
            💬 Contacter le support WhatsApp
          </a>
        </td></tr>
      </table>

      <p style="margin:24px 0 0;text-align:center;font-size:11px;color:#9CA3AF">
        © ${year} Chreol Empire · Boutiques Deido, Vallée 3, Douala, Cameroun<br>
        <a href="https://shop.chreolempire.com" target="_blank" rel="noopener noreferrer" style="color:#B45309;text-decoration:none;">chreolempire.com</a>
      </p>

    </td></tr>
  </table>
</div>
</body></html>`;
}

const SUCCESS_DONE_HTML = `<!DOCTYPE html>
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

const SUCCESS_CANCEL_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Commande annulée</title>
<style>body{margin:0;background:#FEF2F2;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
.card{background:#fff;border-radius:16px;padding:40px 32px;max-width:380px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.08)}
.icon{font-size:56px;margin-bottom:16px}.title{font-size:20px;font-weight:900;color:#991B1B;margin:0 0 8px}
.sub{font-size:14px;color:#6B7280;line-height:1.6;margin:0}</style></head>
<body><div class="card">
  <div class="icon">❌</div>
  <p class="title">Commande annulée</p>
  <p class="sub">L'email d'annulation a été envoyé au client.</p>
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

const CANCEL_TTL_S = 60 * 60; // 60 minutes

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("id")   ?? "";
  const email   = searchParams.get("to")   ?? "";
  const name    = searchParams.get("n")    ?? "";
  const ts      = searchParams.get("ts")   ?? "";
  const sig     = searchParams.get("sig")  ?? "";
  const action  = searchParams.get("act")  ?? "done";
  const sRaw    = searchParams.get("s")    ?? "";
  const summary = sRaw ? decodeSummary(sRaw) : null;

  if (!orderId || !email || !sig) {
    return new Response(ERROR_HTML("Paramètres manquants."), { status: 400, headers: { "Content-Type": "text/html" } });
  }

  // Vérification du token (compatible ancien format sans ts et nouveau avec ts)
  const secrets = [
    process.env.MARK_DONE_SECRET,
    process.env.BREVO_API_KEY,
    "chreolempire",
  ].filter(Boolean) as string[];
  const candidates = [
    ts ? `${orderId}:${email}:${ts}` : null,
    `${orderId}:${email}`,
  ].filter(Boolean) as string[];
  const hashes = await Promise.all(
    secrets.flatMap(s => candidates.map(d => hmac32(s, d)))
  );
  if (!hashes.some(h => h === sig)) {
    return new Response(ERROR_HTML("Token de sécurité invalide."), { status: 403, headers: { "Content-Type": "text/html" } });
  }

  // Vérification expiration 60 min pour l'annulation
  if (action === "cancel" && ts) {
    const age = Math.floor(Date.now() / 1000) - parseInt(ts, 10);
    if (age > CANCEL_TTL_S) {
      return new Response(
        ERROR_HTML("Le délai d'annulation de 60 minutes est dépassé. Contactez le support WhatsApp."),
        { status: 410, headers: { "Content-Type": "text/html" } },
      );
    }
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return new Response(ERROR_HTML("Service email non configuré."), { status: 503, headers: { "Content-Type": "text/html" } });
  }

  const ref = orderId.slice(-8).toUpperCase();
  const senderIdRaw = process.env.BREVO_SENDER_ID;
  const sender = senderIdRaw
    ? { id: parseInt(senderIdRaw, 10) }
    : { name: "Chreol Empire", email: process.env.BREVO_SENDER_EMAIL ?? "contact@chreolempire.com" };

  const isCancel = action === "cancel";
  const subject  = isCancel
    ? `❌ Votre commande #${ref} a été annulée — Chreol Empire`
    : `✅ Votre commande #${ref} a été livrée — Chreol Empire`;
  const html = isCancel ? buildCancelEmail(name, ref, summary) : buildDeliveryEmail(name, ref, summary);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": brevoKey },
    body: JSON.stringify({ sender, to: [{ email, name: name || "Client" }], subject, htmlContent: html }),
  });

  if (!res.ok) {
    console.error(`[mark-done] Brevo ${res.status} for ${email} action=${action}`);
    return new Response(ERROR_HTML("Échec d'envoi de l'email client."), { status: 502, headers: { "Content-Type": "text/html" } });
  }

  console.log(`[mark-done] action=${action} → ${email} (order ${ref})`);
  return new Response(
    isCancel ? SUCCESS_CANCEL_HTML : SUCCESS_DONE_HTML,
    { status: 200, headers: { "Content-Type": "text/html" } },
  );
}
