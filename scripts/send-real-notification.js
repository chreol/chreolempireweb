const crypto = require('crypto');

async function sendTelegramHtml(botToken, chatId, html) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: 'HTML' }) });
  return res.json();
}

async function sendBrevo(brevoKey, sender, recipients, subject, html) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'Content-Type': 'application/json', 'api-key': brevoKey }, body: JSON.stringify({ sender, to: recipients, subject, htmlContent: html }) });
  return res.json();
}

(async function(){
  const payload = {
    name: 'Jean Dupont',
    email: 'chreoltri+test@gmail.com',
    phone: '+237697657734',
    beneficiaryName: 'Pierre',
    beneficiaryNetwork: 'MTN',
    beneficiaryCountry: 'Gabon',
    beneficiaryNumber: '0654321098',
    amount: '75000',
    destination: 'Gabon',
    payment: 'MTN',
    notes: 'Test envoi réel',
    sourceUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.chreolempire.com'
  };

  const amount = Number(payload.amount);
  function computeFee(a){ if (!a || isNaN(a)) return 0; if (a<=25000) return 2500; if (a<=50000) return 3500; if (a<=100000) return 5000; if (a<=200000) return 8000; if (a<=300000) return 10000; if (a<=500000) return Math.round(a*0.03); if (a<=1000000) return Math.round(a*0.028); return null; }
  const fee = computeFee(amount);
  const total = fee===null ? null : amount+fee;
  const ref = `TRF-${Date.now().toString(36).slice(-6).toUpperCase()}`;
  const secret = process.env.MARK_DONE_SECRET || process.env.BREVO_API_KEY || 'chreolempire';
  const ts = Math.floor(Date.now()/1000).toString();
  const token = crypto.createHmac('sha256', secret).update(`${ref}:${payload.email}:${ts}`).digest('hex').slice(0,32);
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.chreolempire.com';
  const markDoneUrl = `${base}/api/mark-done?${new URLSearchParams({ id: ref, to: payload.email, n: payload.name, ts, sig: token, act: 'done', src: payload.sourceUrl })}`;
  const markCancelUrl = `${base}/api/mark-done?${new URLSearchParams({ id: ref, to: payload.email, n: payload.name, ts, sig: token, act: 'cancel', src: payload.sourceUrl })}`;

  const waClientNum = String(payload.phone).replace(/\D/g,'');
  const waClientLink = `https://wa.me/${waClientNum}`;

  const tgHtml = `<b>Nouvelle demande de transfert (${ref})</b>\n` +
    `<b>Nom:</b> ${payload.name}\n<b>Email:</b> ${payload.email}\n<b>Téléphone:</b> <a href="${waClientLink}">${payload.phone}</a>\n` +
    `<b>Bénéficiaire:</b> ${payload.beneficiaryName} — ${payload.beneficiaryNetwork} / ${payload.beneficiaryCountry} / ${payload.beneficiaryNumber}\n` +
    `<b>Montant:</b> ${payload.amount} FCFA\n<b>Frais:</b> ${fee===null ? 'Contactez-nous' : fee + ' FCFA'}\n<b>Total à payer:</b> ${total===null ? 'Contactez-nous' : total + ' FCFA'}\n` +
    `<b>Destination:</b> ${payload.destination}\n<b>Moyen:</b> ${payload.payment}\n` +
    `<b>Source:</b> ${payload.sourceUrl}\n` +
    `<b>Marquer traitée:</b> ${markDoneUrl}\n<b>Annuler:</b> ${markCancelUrl}` +
    `\n\n📣 Nos services: ` +
    `<a href="${base}/services/cartes-cadeaux">Cartes cadeaux</a> · ` +
    `<a href="${base}/services/paiement">Paiement</a> · ` +
    `<a href="${base}/services/crypto">Crypto</a> · ` +
    `<a href="${base}/services/coupons">Coupons</a>`;

  const emailHtml = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111;background:#f7f7f7;padding:18px"><div style="max-width:680px;margin:0 auto;background:#fff;padding:18px;border-radius:10px">` +
    `<h2>Nouvelle demande de transfert — ${ref}</h2>` +
    `<p><strong>Client</strong>: ${payload.name} — <a href="${waClientLink}">${payload.phone}</a></p>` +
    `<p><strong>Bénéficiaire</strong>: ${payload.beneficiaryName} — ${payload.beneficiaryNetwork} / ${payload.beneficiaryCountry} / ${payload.beneficiaryNumber}</p>` +
    `<p><strong>Montant</strong>: ${payload.amount} FCFA</p>` +
    `<p><strong>Frais</strong>: ${fee===null ? 'Contactez-nous' : fee + ' FCFA'}</p>` +
    `<p><strong>Total à payer</strong>: ${total===null ? 'Contactez-nous' : total + ' FCFA'}</p>` +
    `<p>Source: <a href="${payload.sourceUrl}">${payload.sourceUrl}</a></p>` +
    `<h3>📣 Nos services</h3><p><a href="${base}/services/cartes-cadeaux">Cartes cadeaux</a> · <a href="${base}/services/paiement">Paiement</a> · <a href="${base}/services/crypto">Crypto</a> · <a href="${base}/services/coupons">Coupons</a> · <a href="${base}/services/transfert">Transferts</a></p>` +
    `<p><a href="${markDoneUrl}" style="display:inline-block;padding:8px 12px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;margin-right:8px">Marquer traitée</a>` +
    `<a href="${markCancelUrl}" style="display:inline-block;padding:8px 12px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none">Annuler</a></p>` +
    `</div></body></html>`;

  // send Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
  else {
    const t = await sendTelegramHtml(botToken, chatId, tgHtml);
    console.log('Telegram response:', t);
  }

  // send Brevo
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) return console.error('Missing BREVO_API_KEY');
  const sender = process.env.BREVO_SENDER_ID ? { id: parseInt(process.env.BREVO_SENDER_ID,10) } : { name: 'Chreol Empire', email: process.env.BREVO_SENDER_EMAIL || 'contact@chreolempire.com' };
  const recipients = [{ email: process.env.BREVO_ADMIN_EMAIL || 'contact@chreolempire.com', name: 'Chreol Empire' }, { email: payload.email, name: payload.name }];
  const br = await sendBrevo(brevoKey, sender, recipients, `Nouvelle demande de transfert ${ref}`, emailHtml);
  console.log('Brevo response:', br);

})();
