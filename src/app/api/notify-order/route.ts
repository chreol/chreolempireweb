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

async function buildMarkDoneUrl(
  p: NotifyPayload,
  action: "done" | "cancel",
): Promise<string> {
  const secret  = process.env.MARK_DONE_SECRET ?? process.env.BREVO_API_KEY ?? "chreolempire";
  const ts      = Math.floor(Date.now() / 1000).toString();
  const token   = await hmac32(secret, `${p.orderId}:${p.clientEmail}:${ts}`);
  const base    = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shop.chreolempire.com";

  // Compact summary for order recap in delivery/cancel emails
  const summary = JSON.stringify({
    it: p.items.map(i => ({ n: i.name.slice(0, 50), t: i.price * i.qty, q: i.qty, d: i.details?.slice(0, 80) ?? "" })),
    tot: p.total,
    pm: p.paymentMethod,
    ph: p.clientPhone,
  });
  const s = btoa(Array.from(new TextEncoder().encode(summary)).map(b => String.fromCharCode(b)).join(""));

  const params  = new URLSearchParams({
    id:  p.orderId,
    to:  p.clientEmail,
    n:   p.clientName,
    ts,
    sig: token,
    act: action,
    s,
    src: p.sourceUrl ?? "",
  });
  return `${base}/api/mark-done?${params}`;
}

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

function getMomoPaymentBlock(method: string, total: number): string {
  const lower = method.toLowerCase();
  type MomoInfo = { icon: string; name: string; merchant: string; merchantName: string; ussd: string; color: string };
  let info: MomoInfo | null = null;
  if (lower.includes("mtn")) info = {
    icon: "🟡", name: "MTN Mobile Money", merchant: "672416141",
    merchantName: "ETS Content", color: "#F59E0B",
    ussd: `*126*14*672416141*${total}#`,
  };
  else if (lower.includes("orange")) info = {
    icon: "🟠", name: "Orange Money", merchant: "692251299",
    merchantName: "Ets Tagny", color: "#FF6600",
    ussd: `#150*14*518554*692251299*${total}#`,
  };
  if (!info) return "";
  const waProof = `https://wa.me/237697657734?text=${encodeURIComponent(`Bonjour, voici ma preuve de paiement — Montant : ${total.toLocaleString("fr-FR")} FCFA`)}`;
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;border:2px solid ${info.color};border-radius:12px;margin-bottom:20px">
    <tr><td style="padding:16px 20px">
      <p style="margin:0 0 12px;font-size:10px;font-weight:900;letter-spacing:2px;color:${info.color}">💳 PROCÉDER AU PAIEMENT</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
        <tr>
          <td style="background:rgba(255,255,255,0.06);border-radius:8px;padding:10px 14px;width:48%">
            <p style="margin:0;font-size:10px;color:#9CA3AF">Opérateur</p>
            <p style="margin:4px 0 0;font-size:14px;font-weight:900;color:#FFFFFF">${info.icon} ${info.name}</p>
          </td>
          <td width="8"></td>
          <td style="background:rgba(255,255,255,0.06);border-radius:8px;padding:10px 14px;width:48%">
            <p style="margin:0;font-size:10px;color:#9CA3AF">Code Marchand</p>
            <p style="margin:4px 0 0;font-size:18px;font-weight:900;color:${info.color};letter-spacing:2px">${info.merchant}</p>
            <p style="margin:2px 0 0;font-size:10px;color:#6B7280">${info.merchantName}</p>
          </td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;margin-bottom:12px">
        <tr><td style="padding:12px 14px">
          <p style="margin:0;font-size:10px;color:#9CA3AF;letter-spacing:1px">CODE USSD À COMPOSER</p>
          <p style="margin:6px 0 4px;font-size:20px;font-weight:900;color:#FFFFFF;font-family:monospace;letter-spacing:1px">${info.ussd}</p>
          <p style="margin:0;font-size:11px;color:#6B7280">Remplacez <strong style="color:#9CA3AF">${total}</strong> par le montant exact si différent</p>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:${info.color};border-radius:8px;padding:10px 14px;text-align:center;font-size:16px;font-weight:900;color:#0A0A0A">
            Montant à régler : ${total.toLocaleString("fr-FR")} FCFA
          </td>
        </tr>
      </table>
      <p style="margin:12px 0 8px;font-size:11px;font-weight:700;color:#D1D5DB;text-align:center">Après paiement, envoyez la preuve ici :</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="text-align:center">
          <a href="${waProof}" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:900;font-size:13px">
            📱 Envoyer la preuve via WhatsApp
          </a>
        </td></tr>
      </table>
    </td></tr>
  </table>`;
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

function buildAdminEmail(p: NotifyPayload, markDoneUrl: string, markCancelUrl: string): string {
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
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
        <tr><td style="text-align:center">
          <a href="${waUrl}" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:16px 32px;border-radius:10px;font-weight:900;font-size:15px">
            💬 Ouvrir WhatsApp avec le client
          </a>
        </td></tr>
      </table>

      <!-- Mark Done / Cancel Buttons -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:6px;text-align:center">
            <a href="${markDoneUrl}" style="display:inline-block;background:#059669;color:#FFFFFF;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:900;font-size:13px;width:100%;box-sizing:border-box">
              ✅ Commande traitée
            </a>
          </td>
          <td style="padding-left:6px;text-align:center">
            <a href="${markCancelUrl}" style="display:inline-block;background:#DC2626;color:#FFFFFF;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:900;font-size:13px;width:100%;box-sizing:border-box">
              ❌ Annuler (60 min)
            </a>
          </td>
        </tr>
        <tr><td colspan="2" style="text-align:center;padding-top:6px">
          <p style="margin:0;font-size:11px;color:#9CA3AF">Le bouton Annuler expire 60 min après réception de cet email</p>
        </td></tr>
      </table>

    </td></tr>
  </table>

  <p style="text-align:center;font-size:11px;color:#9CA3AF;margin-top:16px">
    Chreol Empire · Douala, Cameroun · contact@chreolempire.com
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
      <img src="https://shop.chreolempire.com/assets/chreolempire%20logo%20avec%20contact%20m.webp"
        alt="Chreol Empire" width="52" height="52"
        style="border-radius:12px;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto" />
      <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:-0.5px">
        <span style="color:#DAA520">Chreol</span><span style="color:#FFFFFF">Empire</span>
      </p>
      <p style="margin:4px 0 0;font-size:11px;color:#6B7280;letter-spacing:0.5px">Le monde digital, à portée de Mobile Money</p>
    </td></tr>
  </table>

  <!-- Status banner -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:linear-gradient(135deg,#065F46,#047857);padding:20px 32px;text-align:center">
      <p style="margin:0;font-size:28px">✅</p>
      <p style="margin:6px 0 0;font-weight:900;color:#FFFFFF;font-size:18px">Commande enregistrée !</p>
      <p style="margin:6px 0 0;color:#A7F3D0;font-size:13px">
        Bonjour <strong>${esc(p.clientName)}</strong>, nous avons bien reçu votre commande.
      </p>
      <p style="margin:12px 0 0;display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#FFFFFF;font-size:11px;font-weight:900;padding:4px 14px;border-radius:20px;letter-spacing:1px">
        ⏳ EN COURS DE TRAITEMENT
      </p>
    </td></tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#FFFFFF;padding:28px 32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

      <!-- Ref + status row -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
        <tr>
          <td style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:16px 20px;text-align:center">
            <p style="margin:0;font-size:10px;color:#92400E;font-weight:900;letter-spacing:2px">RÉFÉRENCE COMMANDE</p>
            <p style="margin:6px 0;font-size:30px;font-weight:900;color:#B45309;letter-spacing:4px">#${ref}</p>
            <p style="margin:0;font-size:11px;color:#78350F">Mentionnez cette référence pour tout suivi</p>
          </td>
          <td width="12"></td>
          <td style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:16px 20px;text-align:center">
            <p style="margin:0;font-size:10px;color:#065F46;font-weight:900;letter-spacing:2px">STATUT</p>
            <p style="margin:8px 0 4px;font-size:22px">⏳</p>
            <p style="margin:0;font-size:12px;font-weight:900;color:#047857">En traitement</p>
            <p style="margin:4px 0 0;font-size:10px;color:#6B7280">Réponse sous 15–30 min</p>
          </td>
        </tr>
      </table>

      <!-- Items -->
      <p style="margin:0 0 10px;font-size:10px;color:#9CA3AF;font-weight:900;letter-spacing:1.5px">RÉCAPITULATIF DE LA COMMANDE</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;margin-bottom:20px">
        <thead>
          <tr style="background:#F9FAFB">
            <th style="padding:10px 14px;font-size:10px;color:#6B7280;font-weight:900;letter-spacing:1px;text-align:left">ARTICLE</th>
            <th style="padding:10px 14px;font-size:10px;color:#6B7280;font-weight:900;letter-spacing:1px;text-align:right">MONTANT</th>
          </tr>
        </thead>
        <tbody>${clientItemsHtml(p.items)}</tbody>
      </table>

      <!-- Total + Payment -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:2px solid #FCD34D;border-radius:10px;margin-bottom:24px">
        <tr>
          <td style="padding:11px 20px;font-size:13px;color:#92400E;border-bottom:1px dashed #FDE68A">Mode de paiement</td>
          <td style="padding:11px 20px;font-size:13px;font-weight:900;color:${pColor};text-align:right;border-bottom:1px dashed #FDE68A">${esc(p.paymentMethod)}</td>
        </tr>
        ${p.commission ? `
        <tr>
          <td style="padding:10px 20px;font-size:12px;color:#92400E;border-bottom:1px dashed #FDE68A">Montant articles</td>
          <td style="padding:10px 20px;font-size:12px;font-weight:700;color:#B45309;text-align:right;border-bottom:1px dashed #FDE68A">${(p.total - p.commission).toLocaleString("fr-FR")} FCFA</td>
        </tr>
        <tr>
          <td style="padding:10px 20px;font-size:12px;color:#92400E;border-bottom:1px dashed #FDE68A">${esc(p.commissionLabel ?? "Frais de service")}</td>
          <td style="padding:10px 20px;font-size:12px;font-weight:700;color:#EF4444;text-align:right;border-bottom:1px dashed #FDE68A">+ ${p.commission.toLocaleString("fr-FR")} FCFA</td>
        </tr>` : ""}
        <tr>
          <td style="padding:14px 20px;font-size:14px;font-weight:900;color:#78350F">TOTAL À RÉGLER</td>
          <td style="padding:14px 20px;font-size:24px;font-weight:900;color:#B45309;text-align:right;white-space:nowrap">${p.total.toLocaleString("fr-FR")} FCFA</td>
        </tr>
      </table>

      <!-- Payment instructions (MTN/Orange only) -->
      ${getMomoPaymentBlock(p.paymentMethod, p.total)}

      <!-- Canal de commande -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;margin-bottom:16px">
        <tr>
          <td style="padding:10px 16px;font-size:12px;color:#64748B">Canal de commande</td>
          <td style="padding:10px 16px;font-size:12px;font-weight:900;color:#25D366;text-align:right">💬 Via WhatsApp</td>
        </tr>
      </table>

      <!-- Steps -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin-bottom:20px">
        <tr><td>
          <p style="margin:0 0 16px;font-size:10px;color:#64748B;font-weight:900;letter-spacing:1.5px">CE QUI SE PASSE MAINTENANT</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="36" valign="top">
                <div style="width:28px;height:28px;border-radius:50%;background:#10B981;color:#FFFFFF;text-align:center;line-height:28px;font-weight:900;font-size:12px">✓</div>
              </td>
              <td style="padding-left:12px;padding-bottom:14px">
                <p style="margin:0;font-size:13px;font-weight:700;color:#1F2937">Commande reçue</p>
                <p style="margin:2px 0 0;font-size:12px;color:#6B7280">Votre commande #${ref} est enregistrée</p>
              </td>
            </tr>
            <tr>
              <td width="36" valign="top">
                <div style="width:28px;height:28px;border-radius:50%;background:#F59E0B;color:#FFFFFF;text-align:center;line-height:28px;font-weight:900;font-size:12px">2</div>
              </td>
              <td style="padding-left:12px;padding-bottom:14px">
                <p style="margin:0;font-size:13px;font-weight:700;color:#1F2937">Contact WhatsApp sous 15–30 min ⏳</p>
                <p style="margin:2px 0 0;font-size:12px;color:#6B7280">Un agent vous écrit pour confirmer le paiement</p>
              </td>
            </tr>
            <tr>
              <td width="36" valign="top">
                <div style="width:28px;height:28px;border-radius:50%;background:#94A3B8;color:#FFFFFF;text-align:center;line-height:28px;font-weight:900;font-size:12px">3</div>
              </td>
              <td style="padding-left:12px">
                <p style="margin:0;font-size:13px;font-weight:700;color:#94A3B8">Livraison instantanée après paiement</p>
                <p style="margin:2px 0 0;font-size:12px;color:#CBD5E1">Vous recevrez un email de confirmation de livraison</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <!-- Guarantees -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
        <tr>
          <td style="padding:8px 12px;background:#FFF7ED;border-radius:8px;text-align:center;width:32%">
            <p style="margin:0;font-size:18px">✅</p>
            <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:#92400E">Codes authentiques</p>
          </td>
          <td width="8"></td>
          <td style="padding:8px 12px;background:#FFF7ED;border-radius:8px;text-align:center;width:32%">
            <p style="margin:0;font-size:18px">⚡</p>
            <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:#92400E">15–30 min</p>
          </td>
          <td width="8"></td>
          <td style="padding:8px 12px;background:#FFF7ED;border-radius:8px;text-align:center;width:32%">
            <p style="margin:0;font-size:18px">🔒</p>
            <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:#92400E">0% commission</p>
          </td>
        </tr>
      </table>

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
        0% commission · Livraison express 15–30 min ·
        <a href="https://shop.chreolempire.com" target="_blank" rel="noopener noreferrer" style="color:#B45309;text-decoration:none;">chreolempire.com</a>
      </p>
      <p style="margin:6px 0 0;text-align:center;font-size:10px;color:#D1D5DB">
        Cet email a été envoyé suite à votre commande sur
        <a href="https://shop.chreolempire.com" target="_blank" rel="noopener noreferrer" style="color:#9CA3AF;">chreolempire.com</a>
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

async function sendTelegram(p: NotifyPayload, markDoneUrl: string, markCancelUrl: string): Promise<number> {
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
      reply_markup: {
        inline_keyboard: [
          [
            { text: "💬 WhatsApp client", url: `https://wa.me/${toWaNumber(p.clientPhone)}` },
            { text: "✅ Traité", url: markDoneUrl },
          ],
          [
            { text: "❌ Annuler (60 min)", url: markCancelUrl },
          ],
        ],
      },
    }),
    signal: AbortSignal.timeout(6000),
  });
  return res.status;
}

// ── Supabase order save ───────────────────────────────────────────────────────

async function saveOrderToSupabase(p: NotifyPayload): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;

  const summary = p.items.map(i => `${i.name} ×${i.qty}`).join(", ");
  const service = p.sourceUrl?.split("/").filter(Boolean).pop() ?? "whatsapp";

  await fetch(`${url}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      id:             p.orderId,
      type:           "achat",
      summary,
      total:          p.total,
      payment_method: p.paymentMethod,
      item_count:     p.items.length,
      client_name:    p.clientName,
      client_email:   p.clientEmail,
      client_phone:   p.clientPhone,
      client_city:    "Douala",
      status:         "pending",
      payment_status: "manual",
      payment_auto:   false,
      details: {
        service,
        sourceUrl: p.sourceUrl ?? null,
        items: p.items,
        commission: p.commission ?? 0,
      },
    }),
  }).catch(() => {});
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

  const senderIdRaw = process.env.BREVO_SENDER_ID;
  const sender = senderIdRaw
    ? { id: parseInt(senderIdRaw, 10) }
    : { name: "Chreol Empire", email: process.env.BREVO_SENDER_EMAIL ?? "contact@chreolempire.com" };
  const adminMail = process.env.ADMIN_EMAIL ?? "contact@chreolempire.com";
  const ref       = p.orderId.slice(-8).toUpperCase();

  // Résoudre l'URL complète de la source à partir de l'origine de la requête
  if (p.sourceUrl && p.sourceUrl.startsWith("/")) {
    const origin = new URL(request.url).origin;
    p = { ...p, sourceUrl: `${origin}${p.sourceUrl}` };
  }

  const [markDoneUrl, markCancelUrl] = await Promise.all([
    buildMarkDoneUrl(p, "done"),
    buildMarkDoneUrl(p, "cancel"),
  ]);

  // Save to Supabase (fire & forget — n'affecte pas la réponse)
  saveOrderToSupabase(p);

  const [adminResult, clientResult, telegramResult] = await Promise.allSettled([
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": brevoKey },
      body: JSON.stringify({
        sender,
        to: [{ email: adminMail, name: "Chreol Empire Admin" }],
        subject: `🛍️ Commande #${ref} — ${p.total.toLocaleString("fr-FR")} FCFA via ${p.paymentMethod}`,
        htmlContent: buildAdminEmail(p, markDoneUrl, markCancelUrl),
      }),
    }),
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": brevoKey },
      body: JSON.stringify({
        sender,
        to: [{ email: p.clientEmail, name: p.clientName }],
        subject: `✅ Commande confirmée #${ref} — Chreol Empire`,
        htmlContent: buildClientEmail(p),
      }),
    }),
    sendTelegram(p, markDoneUrl, markCancelUrl),
  ]);

  const adminStatus    = adminResult.status    === "fulfilled" ? adminResult.value.status    : 500;
  const clientStatus   = clientResult.status   === "fulfilled" ? clientResult.value.status   : 500;
  const telegramStatus = telegramResult.status === "fulfilled" ? telegramResult.value        : 500;

  console.log(`[notify-order] ref=${ref} admin=${adminStatus} client=${clientStatus} telegram=${telegramStatus}`);

  return Response.json({ ok: true, ref, admin: adminStatus, client: clientStatus, telegram: telegramStatus });
}
