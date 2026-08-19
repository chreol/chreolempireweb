const crypto = require('crypto');

function computeFee(amountValue) {
  if (!amountValue || isNaN(amountValue)) return 0;
  if (amountValue <= 25000) return 2500;
  if (amountValue <= 50000) return 3500;
  if (amountValue <= 100000) return 5000;
  if (amountValue <= 200000) return 8000;
  if (amountValue <= 300000) return 10000;
  if (amountValue <= 500000) return Math.round(amountValue * 0.03);
  if (amountValue <= 1000000) return Math.round(amountValue * 0.028);
  return null;
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
    notes: 'Test simulation',
    sourceUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.chreolempire.com'
  };

  const amount = Number(payload.amount);
  const fee = computeFee(amount);
  const total = fee === null ? null : amount + fee;

  const ref = `TRF-${Date.now().toString(36).slice(-6).toUpperCase()}`;
  const secret = process.env.MARK_DONE_SECRET || process.env.BREVO_API_KEY || 'chreolempire';
  const ts = Math.floor(Date.now() / 1000).toString();
  const token = crypto.createHmac('sha256', secret).update(`${ref}:${payload.email}:${ts}`).digest('hex').slice(0,32);
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.chreolempire.com';
  const markDoneUrl = `${base}/api/mark-done?${new URLSearchParams({ id: ref, to: payload.email, n: payload.name, ts, sig: token, act: 'done', src: payload.sourceUrl })}`;
  const markCancelUrl = `${base}/api/mark-done?${new URLSearchParams({ id: ref, to: payload.email, n: payload.name, ts, sig: token, act: 'cancel', src: payload.sourceUrl })}`;

  const waClientNum = String(payload.phone).replace(/\D/g, '');
  const waClientLink = `https://wa.me/${waClientNum}`;

  const tgHtml = `<b>Nouvelle demande de transfert (${ref})</b>\n` +
    `<b>Nom:</b> ${payload.name}\n<b>Email:</b> ${payload.email}\n<b>Téléphone:</b> <a href="${waClientLink}">${payload.phone}</a>\n` +
    `<b>Bénéficiaire:</b> ${payload.beneficiaryName} — ${payload.beneficiaryNetwork} / ${payload.beneficiaryCountry} / ${payload.beneficiaryNumber}\n` +
    `<b>Montant:</b> ${payload.amount} FCFA\n<b>Frais:</b> ${fee === null ? 'Contactez-nous' : fee + ' FCFA'}\n<b>Total à payer:</b> ${total === null ? 'Contactez-nous' : total + ' FCFA'}\n` +
    `<b>Destination:</b> ${payload.destination}\n<b>Moyen:</b> ${payload.payment}\n` +
    `<b>Source:</b> ${payload.sourceUrl}\n` +
    `<b>Marquer traitée:</b> ${markDoneUrl}\n<b>Annuler:</b> ${markCancelUrl}`;

  const emailHtml = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111;background:#f7f7f7;padding:18px"><div style="max-width:680px;margin:0 auto;background:#fff;padding:18px;border-radius:10px">` +
    `<h2>Nouvelle demande de transfert — ${ref}</h2>` +
    `<p><strong>Client</strong>: ${payload.name} — <a href="${waClientLink}">${payload.phone}</a></p>` +
    `<p><strong>Bénéficiaire</strong>: ${payload.beneficiaryName} — ${payload.beneficiaryNetwork} / ${payload.beneficiaryCountry} / ${payload.beneficiaryNumber}</p>` +
    `<p><strong>Montant</strong>: ${payload.amount} FCFA</p>` +
    `<p><strong>Frais</strong>: ${fee === null ? 'Contactez-nous' : fee + ' FCFA'}</p>` +
    `<p><strong>Total à payer</strong>: ${total === null ? 'Contactez-nous' : total + ' FCFA'}</p>` +
    `<p>Source: <a href="${payload.sourceUrl}">${payload.sourceUrl}</a></p>` +
    `<p><a href="${markDoneUrl}" style="display:inline-block;padding:8px 12px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;margin-right:8px">Marquer traitée</a>` +
    `<a href="${markCancelUrl}" style="display:inline-block;padding:8px 12px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none">Annuler</a></p>` +
    `</div></body></html>`;

  console.log('--- SIMULATION: payload to /api/transfert-request ---');
  console.log(JSON.stringify(payload, null, 2));
  console.log('\n--- Computed values ---');
  console.log('fee:', fee, 'total:', total);
  console.log('\n--- Telegram (admin) ---\n');
  console.log(tgHtml);
  console.log('\n--- Email (admin + client) HTML ---\n');
  console.log(emailHtml);
  console.log('\n--- markDoneUrl ---\n', markDoneUrl);
  console.log('\n--- markCancelUrl ---\n', markCancelUrl);
})();
