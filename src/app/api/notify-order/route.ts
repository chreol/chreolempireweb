export const runtime = "edge";

export interface NotifyItem {
  name: string;
  qty: number;
  price: number;
  amount: string;
  details?: string;
}

export interface NotifyPayload {
  orderId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;       // digits only, with or without 237 prefix
  paymentMethod: string;     // "MTN MoMo" | "Orange Money" | "Via WhatsApp" | etc.
  items: NotifyItem[];
  total: number;             // montant final (items + commission inclus)
  commission?: number;       // frais séparés affichés en ligne dédiée
  commissionLabel?: string;  // ex: "Frais de service UBA", défaut: "Frais de service"
  sourceUrl?: string;        // page d'origine (ex: /cart, /services/uba)
  campayReference?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("237")) return digits;
  return `237${digits}`;
}

function formatDate(): string {
  return new Date().toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Africa/Douala",
  });
}

function payColor(method: string): string {
  if (method.toLowerCase().includes("mtn"))    return "#F59E0B";
  if (method.toLowerCase().includes("orange")) return "#F97316";
  return "#22C55E";
}

// ── Admin email ───────────────────────────────────────────────────────────────

function adminItemsHtml(items: NotifyItem[]): string {
  return items.map((item, i) => `
    <tr style="background:${i % 2 === 0 ? "#F9FAFB" : "#FFFFFF"}">
      <td style="padding:10px 14px;font-size:13px;color:#1F2937;border-bottom:1px solid #F3F4F6">
        <strong>${esc(item.name)}</strong>
        ${item.details ? `<br><span style="font-size:11px;color:#6B7280">${esc(item.details)}</span>` : ""}
      </td>
      <td style="padding:10px 14px;font-size:13px;color:#6B7280;text-align:center;border-bottom:1px solid #F3F4F6">${item.qty}</td>
      <td style="padding:10px 14px;font-size:13px;color:#6B7280;text-align:right;border-bottom:1px solid #F3F4F6">${esc(item.amount)}</td>
      <td style="padding:10px 14px;font-size:13px;font-weight:bold;color:#B45309;text-align:right;border-bottom:1px solid #F3F4F6">${(item.price * item.qty).toLocaleString("fr-FR")} FCFA</td>
    </tr>`).join("");
}

function buildAdminEmail(p: NotifyPayload): string {
  const ref    = p.orderId.slice(-8).toUpperCase();
  const date   = formatDate();
  const waNum  = toWaNumber(p.clientPhone);
  const waUrl  = `https://wa.me/${waNum}`;
  const pColor = payColor(p.paymentMethod);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nouvelle commande #${ref}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:620px;margin:0 auto;padding:20px 12px">

  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:linear-gradient(135deg,#78350F,#B45309);border-radius:12px 12px 0 0;padding:24px 32px">
      <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:3px;color:#FDE68A">CHREOL EMPIRE</p>
      <h1 style="margin:8px 0 0;font-size:22px;color:#FEF3C7;font-weight:900">🛍️ Nouvelle commande</h1>
    </td></tr>
  </table>

  <!-- Action banner -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#FEF3C7;padding:14px 32px;border-left:4px solid #F59E0B">
      <p style="margin:0;font-weight:900;color:#78350F;font-size:14px">⚡ TRAITEMENT REQUIS — 15 À 30 MIN</p>
      <p style="margin:4px 0 0;color:#92400E;font-size:13px">
        Contacter le client sur WhatsApp : <strong>+${waNum}</strong>
      </p>
    </td></tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#FFFFFF;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

      <!-- Ref + Date -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-bottom:2px solid #F3F4F6;padding-bottom:16px">
        <tr>
          <td>
            <p style="margin:0;font-size:10px;color:#9CA3AF;font-weight:900;letter-spacing:1.5px">RÉFÉRENCE</p>
            <p style="margin:6px 0 0;font-size:26px;font-weight:900;color:#B45309">#${ref}</p>
          </td>
          <td style="text-align:right">
            <p style="margin:0;font-size:10px;color:#9CA3AF;font-weight:900;letter-spacing:1.5px">DATE</p>
            <p style="margin:6px 0 0;font-size:14px;font-weight:700;color:#1F2937">${date}</p>
          </td>
        </tr>
      </table>

      <!-- Client info -->
      <p style="margin:0 0 10px;font-size:10px;color:#9CA3AF;font-weight:900;letter-spacing:1.5px">INFORMATIONS CLIENT</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:24px">
        <tr style="background:#F9FAFB">
          <td style="padding:10px 14px;font-size:12px;color:#6B7280;width:38%;border-bottom:1px solid #F3F4F6">Nom &amp; Prénom</td>
          <td style="padding:10px 14px;font-size:13px;font-weight:700;color:#1F2937;border-bottom:1px solid #F3F4F6">${esc(p.clientName)}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-size:12px;color:#6B7280;border-bottom:1px solid #F3F4F6">Email</td>
          <td style="padding:10px 14px;font-size:13px;color:#1F2937;border-bottom:1px solid #F3F4F6">${esc(p.clientEmail)}</td>
        </tr>
        <tr style="background:#F9FAFB">
          <td style="padding:10px 14px;font-size:12px;color:#6B7280;border-bottom:1px solid #F3F4F6">WhatsApp</td>
          <td style="padding:10px 14px;font-size:13px;font-weight:700;color:#1F2937;border-bottom:1px solid #F3F4F6">+${waNum}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-size:12px;color:#6B7280">Mode de paiement</td>
          <td style="padding:10px 14px;font-size:14px;font-weight:900;color:${pColor}">${esc(p.paymentMethod)}</td>
        </tr>
      </table>

      <!-- Items -->
      <p style="margin:0 0 10px;font-size:10px;color:#9CA3AF;font-weight:900;letter-spacing:1.5px">DÉTAIL DE LA COMMANDE</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:24px">
        <thead>
          <tr style="background:#F3F4F6">
            <th style="padding:10px 14px;font-size:11px;color:#6B7280;text-align:left;font-weight:700">ARTICLE</th>
            <th style="padding:10px 14px;font-size:11px;color:#6B7280;text-align:center;font-weight:700">QTÉ</th>
            <th style="padding:10px 14px;font-size:11px;color:#6B7280;text-align:right;font-weight:700">VALEUR</th>
            <th style="padding:10px 14px;font-size:11px;color:#6B7280;text-align:right;font-weight:700">SOUS-TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${adminItemsHtml(p.items)}
        </tbody>
      </table>

      <!-- Total avec commission optionnelle -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:2px solid #FCD34D;border-radius:10px;margin-bottom:24px">
        ${p.commission ? `
        <tr>
          <td style="padding:12px 20px;font-size:13px;color:#92400E;border-bottom:1px dashed #FCD34D">Montant articles</td>
          <td style="padding:12px 20px;font-size:13px;font-weight:700;color:#B45309;text-align:right;white-space:nowrap;border-bottom:1px dashed #FCD34D">${(p.total - p.commission).toLocaleString("fr-FR")} FCFA</td>
        </tr>
        <tr>
          <td style="padding:12px 20px;font-size:13px;color:#92400E;border-bottom:1px dashed #FCD34D">${esc(p.commissionLabel ?? "Frais de service")}</td>
          <td style="padding:12px 20px;font-size:13px;font-weight:700;color:#EF4444;text-align:right;white-space:nowrap;border-bottom:1px dashed #FCD34D">+ ${p.commission.toLocaleString("fr-FR")} FCFA</td>
        </tr>` : ""}
        <tr>
          <td style="padding:18px 20px;font-size:14px;font-weight:900;color:#78350F">
            MONTANT À PERCEVOIR DU CLIENT
          </td>
          <td style="padding:18px 20px;font-size:28px;font-weight:900;color:#B45309;text-align:right;white-space:nowrap">
            ${p.total.toLocaleString("fr-FR")} FCFA
          </td>
        </tr>
      </table>

      ${p.campayReference ? `<p style="font-size:12px;color:#9CA3AF;margin-bottom:16px">Réf. Campay : <code>${esc(p.campayReference)}</code></p>` : ""}

      <!-- Source URL -->
      ${p.sourceUrl ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
        <tr><td style="background:#F3F4F6;border-radius:8px;padding:10px 14px">
          <p style="margin:0;font-size:11px;color:#9CA3AF;font-weight:700;letter-spacing:1px">SOURCE DE LA COMMANDE</p>
          <a href="${esc(p.sourceUrl)}" style="font-size:13px;color:#B45309;text-decoration:none;font-weight:700">${esc(p.sourceUrl)}</a>
        </td></tr>
      </table>` : ""}

      <!-- WA Button -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="text-align:center">
          <a href="${waUrl}" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:16px 32px;border-radius:10px;font-weight:900;font-size:15px">
            💬 Ouvrir WhatsApp avec le client
          </a>
        </td></tr>
      </table>

    </td></tr>
  </table>

  <p style="text-align:center;font-size:11px;color:#9CA3AF;margin-top:16px">
    Chreol Empire · Douala, Cameroun · chreolempire00@gmail.com
  </p>
</div>
</body></html>`;
}

// ── Client email ──────────────────────────────────────────────────────────────

function clientItemsHtml(items: NotifyItem[]): string {
  return items.map((item, i) => `
    <tr style="background:${i % 2 === 0 ? "#F9FAFB" : "#FFFFFF"}">
      <td style="padding:10px 14px;border-bottom:1px solid #F3F4F6">
        <p style="margin:0;font-size:13px;font-weight:700;color:#1F2937">${esc(item.name)}</p>
        ${item.details ? `<p style="margin:2px 0 0;font-size:11px;color:#6B7280">${esc(item.details)}</p>` : ""}
        <p style="margin:2px 0 0;font-size:12px;color:#9CA3AF">${esc(item.amount)} × ${item.qty}</p>
      </td>
      <td style="padding:10px 14px;font-size:13px;font-weight:700;color:#B45309;text-align:right;white-space:nowrap;border-bottom:1px solid #F3F4F6">
        ${(item.price * item.qty).toLocaleString("fr-FR")} FCFA
      </td>
    </tr>`).join("");
}

function buildClientEmail(p: NotifyPayload): string {
  const ref    = p.orderId.slice(-8).toUpperCase();
  const pColor = payColor(p.paymentMethod);
  const year   = new Date().getFullYear();
  const waNum  = "237694360978";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Commande confirmée #${ref}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:620px;margin:0 auto;padding:20px 12px">

  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#0A0A0A;border-radius:12px 12px 0 0;padding:20px 32px;text-align:center">
      <p style="margin:0;font-size:24px;font-weight:900">
        <span style="color:#DAA520">Chreol</span><span style="color:#FFFFFF">Empire</span>
      </p>
      <p style="margin:4px 0 0;font-size:11px;color:#6B7280">Le monde digital, à portée de Mobile Money</p>
    </td></tr>
  </table>

  <!-- Success banner -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#D1FAE5;padding:16px 32px;border-left:4px solid #10B981">
      <p style="margin:0;font-weight:900;color:#065F46;font-size:16px">✅ Commande confirmée !</p>
      <p style="margin:4px 0 0;color:#047857;font-size:13px">
        Bonjour ${esc(p.clientName)}, votre commande a bien été enregistrée.
      </p>
    </td></tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#FFFFFF;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

      <!-- Reference -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;margin-bottom:28px">
        <tr><td style="padding:20px;text-align:center">
          <p style="margin:0;font-size:11px;color:#92400E;font-weight:900;letter-spacing:2px">VOTRE RÉFÉRENCE DE COMMANDE</p>
          <p style="margin:8px 0 0;font-size:34px;font-weight:900;color:#B45309;letter-spacing:3px">#${ref}</p>
          <p style="margin:8px 0 0;font-size:12px;color:#78350F">Conservez ce numéro pour tout suivi</p>
        </td></tr>
      </table>

      <!-- Items -->
      <p style="margin:0 0 10px;font-size:10px;color:#9CA3AF;font-weight:900;letter-spacing:1.5px">VOTRE COMMANDE</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:24px">
        <tbody>${clientItemsHtml(p.items)}</tbody>
      </table>

      <!-- Total + Payment -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:10px;margin-bottom:28px">
        <tr>
          <td style="padding:12px 20px;font-size:13px;color:#92400E;border-bottom:1px dashed #FCD34D">Mode de paiement sélectionné</td>
          <td style="padding:12px 20px;font-size:13px;font-weight:900;color:${pColor};text-align:right;border-bottom:1px dashed #FCD34D">${esc(p.paymentMethod)}</td>
        </tr>
        ${p.commission ? `
        <tr>
          <td style="padding:10px 20px;font-size:13px;color:#92400E;border-bottom:1px dashed #FCD34D">Montant articles</td>
          <td style="padding:10px 20px;font-size:13px;font-weight:700;color:#B45309;text-align:right;border-bottom:1px dashed #FCD34D">${(p.total - p.commission).toLocaleString("fr-FR")} FCFA</td>
        </tr>
        <tr>
          <td style="padding:10px 20px;font-size:13px;color:#92400E;border-bottom:1px dashed #FCD34D">${esc(p.commissionLabel ?? "Frais de service")}</td>
          <td style="padding:10px 20px;font-size:13px;font-weight:700;color:#EF4444;text-align:right;border-bottom:1px dashed #FCD34D">+ ${p.commission.toLocaleString("fr-FR")} FCFA</td>
        </tr>` : ""}
        <tr>
          <td style="padding:16px 20px;font-size:15px;font-weight:900;color:#78350F">TOTAL À RÉGLER</td>
          <td style="padding:16px 20px;font-size:26px;font-weight:900;color:#B45309;text-align:right;white-space:nowrap">${p.total.toLocaleString("fr-FR")} FCFA</td>
        </tr>
      </table>

      <!-- Steps -->
      <p style="margin:0 0 16px;font-size:10px;color:#9CA3AF;font-weight:900;letter-spacing:1.5px">COMMENT ÇA SE PASSE</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px">
        <tr>
          <td width="40" valign="top" style="padding-top:2px">
            <div style="width:32px;height:32px;border-radius:50%;background:#B45309;color:#FFFFFF;text-align:center;line-height:32px;font-weight:900;font-size:14px">1</div>
          </td>
          <td style="padding-left:14px;padding-bottom:16px">
            <p style="margin:0;font-size:14px;font-weight:700;color:#1F2937">Nous vous contactons sur WhatsApp</p>
            <p style="margin:4px 0 0;font-size:13px;color:#6B7280">Un agent Chreol Empire vous écrit sous <strong>15–30 minutes</strong> sur votre WhatsApp</p>
          </td>
        </tr>
        <tr>
          <td width="40" valign="top" style="padding-top:2px">
            <div style="width:32px;height:32px;border-radius:50%;background:#B45309;color:#FFFFFF;text-align:center;line-height:32px;font-weight:900;font-size:14px">2</div>
          </td>
          <td style="padding-left:14px;padding-bottom:16px">
            <p style="margin:0;font-size:14px;font-weight:700;color:#1F2937">Effectuez le paiement</p>
            <p style="margin:4px 0 0;font-size:13px;color:#6B7280">
              Réglez <strong>${p.total.toLocaleString("fr-FR")} FCFA</strong> via <strong>${esc(p.paymentMethod)}</strong> selon les instructions reçues
            </p>
          </td>
        </tr>
        <tr>
          <td width="40" valign="top" style="padding-top:2px">
            <div style="width:32px;height:32px;border-radius:50%;background:#10B981;color:#FFFFFF;text-align:center;line-height:32px;font-weight:900;font-size:14px">3</div>
          </td>
          <td style="padding-left:14px">
            <p style="margin:0;font-size:14px;font-weight:700;color:#1F2937">Recevez votre produit</p>
            <p style="margin:4px 0 0;font-size:13px;color:#6B7280">Livraison immédiate sur WhatsApp après confirmation du paiement ✅</p>
          </td>
        </tr>
      </table>

      <!-- Separator -->
      <hr style="border:none;border-top:1px solid #F3F4F6;margin:24px 0">

      <!-- Support -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px">
        <tr><td style="padding:16px;text-align:center">
          <p style="margin:0 0 10px;font-size:13px;color:#065F46;font-weight:700">Des questions ? Notre équipe est disponible 7j/7, 7h–23h</p>
          <a href="https://wa.me/${waNum}" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:900;font-size:14px">
            💬 Contacter le support WhatsApp
          </a>
        </td></tr>
      </table>

      <!-- Google Review -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px">
        <tr><td style="padding:16px;text-align:center">
          <p style="margin:0 0 4px;font-size:13px;font-weight:900;color:#92400E">Votre avis compte énormément pour nous 🙏</p>
          <p style="margin:0 0 12px;font-size:12px;color:#78350F">Si vous êtes satisfait, laissez-nous un avis Google — ça prend 30 secondes !</p>
          <a href="https://g.page/r/CQaaC7b5Jbg_EAE/review" style="display:inline-block;background:#EA4335;color:#FFFFFF;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:900;font-size:13px">
            ⭐ Laisser un avis Google
          </a>
        </td></tr>
      </table>

      <!-- Footer -->
      <p style="margin:24px 0 0;text-align:center;font-size:11px;color:#9CA3AF">
        © ${year} Chreol Empire · Boutiques Deido, Vallée 3, Douala, Cameroun<br>
        0% commission · Livraison express 15–30 min · chreolempire.com
      </p>
      <p style="margin:6px 0 0;text-align:center;font-size:10px;color:#D1D5DB">
        Cet email a été envoyé suite à votre commande sur chreolempire.com
      </p>

    </td></tr>
  </table>
</div>
</body></html>`;
}

// ── Telegram notification ─────────────────────────────────────────────────────

function buildTelegramMsg(p: NotifyPayload): string {
  const ref    = p.orderId.slice(-8).toUpperCase();
  const waNum  = toWaNumber(p.clientPhone);
  const pIcon  = p.paymentMethod.toLowerCase().includes("mtn")    ? "🟡"
               : p.paymentMethod.toLowerCase().includes("orange") ? "🟠"
               : "💬";

  const itemLines = p.items.map(item => {
    const sub  = (item.price * item.qty).toLocaleString("fr-FR");
    const line = `• <b>${esc(item.name)}</b> ×${item.qty} = ${sub} FCFA`;
    return item.details ? `${line}\n  <i>${esc(item.details)}</i>` : line;
  }).join("\n");

  return [
    `🛍️ <b>NOUVELLE COMMANDE #${ref}</b>`,
    ``,
    `👤 <b>${esc(p.clientName)}</b>`,
    `📧 ${esc(p.clientEmail)}`,
    `📱 +${waNum}`,
    `${pIcon} <b>${esc(p.paymentMethod)}</b>`,
    ``,
    `📦 <b>Commande :</b>`,
    itemLines,
    ``,
    `💰 <b>TOTAL : ${p.total.toLocaleString("fr-FR")} FCFA</b>`,
    p.campayReference ? `🔑 Réf. Campay : <code>${esc(p.campayReference)}</code>` : "",
    ``,
    p.sourceUrl ? `🌐 <a href="${esc(p.sourceUrl)}">Voir la page source</a>` : "",
    `<a href="https://wa.me/${waNum}">💬 Ouvrir WhatsApp client</a>`,
  ].filter(l => l !== undefined).join("\n");
}

async function sendTelegram(p: NotifyPayload): Promise<number> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return 0;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMsg(p),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(6000),
  });
  return res.status;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return Response.json({ error: "Email non configuré" }, { status: 503 });
  }

  let p: NotifyPayload;
  try {
    p = await request.json() as NotifyPayload;
  } catch {
    return Response.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (!p.orderId || !p.clientEmail || !p.total || !Array.isArray(p.items)) {
    return Response.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const senderId  = parseInt(process.env.BREVO_SENDER_ID ?? "1", 10);
  const adminMail = process.env.ADMIN_EMAIL ?? "chreolempire00@gmail.com";
  const ref       = p.orderId.slice(-8).toUpperCase();

  // Résoudre l'URL complète de la source à partir de l'origine de la requête
  if (p.sourceUrl && p.sourceUrl.startsWith("/")) {
    const origin = new URL(request.url).origin;
    p = { ...p, sourceUrl: `${origin}${p.sourceUrl}` };
  }

  const [adminResult, clientResult, telegramResult] = await Promise.allSettled([
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": brevoKey },
      body: JSON.stringify({
        sender: { id: senderId },
        to: [{ email: adminMail, name: "Chreol Empire Admin" }],
        subject: `🛍️ Commande #${ref} — ${p.total.toLocaleString("fr-FR")} FCFA via ${p.paymentMethod}`,
        htmlContent: buildAdminEmail(p),
      }),
    }),
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": brevoKey },
      body: JSON.stringify({
        sender: { id: senderId },
        to: [{ email: p.clientEmail, name: p.clientName }],
        subject: `✅ Commande confirmée #${ref} — Chreol Empire`,
        htmlContent: buildClientEmail(p),
      }),
    }),
    sendTelegram(p),
  ]);

  const adminStatus    = adminResult.status    === "fulfilled" ? adminResult.value.status    : 500;
  const clientStatus   = clientResult.status   === "fulfilled" ? clientResult.value.status   : 500;
  const telegramStatus = telegramResult.status === "fulfilled" ? telegramResult.value        : 500;

  console.log(`[notify-order] ref=${ref} admin=${adminStatus} client=${clientStatus} telegram=${telegramStatus}`);

  return Response.json({ ok: true, ref, admin: adminStatus, client: clientStatus, telegram: telegramStatus });
}
