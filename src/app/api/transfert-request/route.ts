import { NextResponse } from 'next/server';
import { CONTACT } from '@/lib/services';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  beneficiaryName?: string;
  beneficiaryNetwork?: string;
  beneficiaryCountry?: string;
  beneficiaryNumber?: string;
  amount?: string;
  destination?: string;
  payment?: string;
  notes?: string;
  sourceUrl?: string;
};

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return 0;
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML' }) });
    const j = await res.json();
    return j.ok ? 1 : 0;
  } catch (e) { return 0; }
}

async function sendBrevo(subject: string, html: string, toEmail?: string) {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) return 0;
  const sender = process.env.BREVO_SENDER_ID ? { id: parseInt(process.env.BREVO_SENDER_ID, 10) } : { name: 'Chreol Empire', email: process.env.BREVO_SENDER_EMAIL ?? 'contact@chreolempire.com' };
  const recipients = [{ email: process.env.BREVO_ADMIN_EMAIL ?? CONTACT.email, name: 'Chreol Empire' }];
  if (toEmail) recipients.push({ email: toEmail, name: 'Client' });
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'Content-Type': 'application/json', 'api-key': brevoKey }, body: JSON.stringify({ sender, to: recipients, subject, htmlContent: html }) });
    return res.ok ? 1 : 0;
  } catch (e) { return 0; }
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const { name, email, phone, beneficiaryName, beneficiaryNetwork, beneficiaryCountry, beneficiaryNumber, amount, destination, payment, notes, sourceUrl } = body;
  const errors: Record<string, string> = {};
  if (!phone || !/^\+?\d{7,15}$/.test(phone)) errors.phone = 'Téléphone invalide (format international attendu, ex: +2376...)';
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errors.amount = 'Montant invalide';
  if (!destination) errors.destination = 'Destination requise';
  if (!beneficiaryNumber || !/\d{6,15}/.test(beneficiaryNumber)) errors.beneficiaryNumber = 'Numéro du bénéficiaire invalide';
  if (Object.keys(errors).length) return NextResponse.json({ error: 'Validation', details: errors }, { status: 400 });

  const ref = `TRF-${Date.now().toString(36).slice(-6).toUpperCase()}`;

  const text = `Nouvelle demande de transfert (${ref})\nNom: ${name || '-'}\nEmail: ${email || '-'}\nTéléphone: ${phone}\nBénéficiaire: ${beneficiaryName || '-'}\nRéseau: ${beneficiaryNetwork || '-'}\nPays (bénéf): ${beneficiaryCountry || '-'}\nNuméro (bénéf): ${beneficiaryNumber || '-'}\nNom sur compte (bénéf): ${beneficiaryName || '-'}\nMontant: ${amount} FCFA\nDestination: ${destination}\nMoyen de paiement: ${payment || '-'}\nNotes: ${notes || '-'}\nSource: ${sourceUrl || (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shop.chreolempire.com')}`;

  // build mark-done / cancel links
  const secret = process.env.MARK_DONE_SECRET ?? process.env.BREVO_API_KEY ?? 'chreolempire';
  const ts = Math.floor(Date.now() / 1000).toString();
  const token = crypto.createHmac('sha256', secret).update(`${ref}:${email}:${ts}`).digest('hex').slice(0, 32);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shop.chreolempire.com';
  const markDoneUrl = `${base}/api/mark-done?${new URLSearchParams({ id: ref, to: email ?? '', n: name ?? '', ts, sig: token, act: 'done', src: sourceUrl ?? '' })}`;
  const markCancelUrl = `${base}/api/mark-done?${new URLSearchParams({ id: ref, to: email ?? '', n: name ?? '', ts, sig: token, act: 'cancel', src: sourceUrl ?? '' })}`;

  // persist to Supabase (if configured)
  let supaOk = 0;
  try {
    const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (SUPA_URL && SUPA_KEY) {
      const sb = createClient(SUPA_URL, SUPA_KEY, { auth: { persistSession: false } });
      const { error } = await sb.from('transfers').insert([{ ref, name, email, phone, beneficiary_name: beneficiaryName, beneficiary_network: beneficiaryNetwork, beneficiary_country: beneficiaryCountry, beneficiary_number: beneficiaryNumber, amount: Number(amount), destination, payment, notes, source_url: sourceUrl, status: 'pending', created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 60*60*1000).toISOString() }]);
      if (!error) supaOk = 1;
    }
  } catch (e) {
    // ignore persistence errors
  }

  // send Telegram (admin) with source link and clickable WA for client
  const waClientNum = String(phone).replace(/\D/g, '');
  const waClientLink = `https://wa.me/${waClientNum}`;
  const phoneStr = phone ?? '-';
  const tgHtml = `<b>Nouvelle demande de transfert (${ref})</b>\n` +
    `<b>Nom:</b> ${name || '-'}\n<b>Email:</b> ${email || '-'}\n<b>Téléphone:</b> <a href="${waClientLink}">${phoneStr}</a>\n` +
    `<b>Bénéficiaire:</b> ${beneficiaryName || '-'} — ${beneficiaryNetwork || '-'} / ${beneficiaryCountry || '-'} / ${beneficiaryNumber || '-'}\n` +
    `<b>Montant:</b> ${amount} FCFA\n<b>Destination:</b> ${destination}\n<b>Moyen:</b> ${payment || '-'}\n` +
    `<b>Source:</b> ${sourceUrl || base}\n` +
    `<b>Marquer traitée:</b> ${markDoneUrl}\n<b>Annuler:</b> ${markCancelUrl}` +
    `\n\n📣 Nos services: ` +
    `<a href="${base}/services/cartes-cadeaux">Cartes cadeaux</a> · ` +
    `<a href="${base}/services/paiement">Paiement</a> · ` +
    `<a href="${base}/services/crypto">Crypto</a> · ` +
    `<a href="${base}/services/coupons">Coupons</a>`;
  const tg = await sendTelegram(tgHtml);

  // send Brevo email to admin and optionally to client with action buttons
  const emailHtml = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111;background:#f7f7f7;padding:18px"><div style="max-width:680px;margin:0 auto;background:#fff;padding:18px;border-radius:10px">` +
    `<h2 style="margin:0 0 8px">Nouvelle demande de transfert — ${ref}</h2>` +
    `<p style="margin:6px 0;padding:8px;background:#F3F4F6;border-radius:8px"><strong>Source:</strong> <a href="${sourceUrl || base}">${sourceUrl || base}</a></p>` +
    `<table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Client</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${name || '-'} — <a href="${waClientLink}">${phoneStr}</a></td></tr>` +
    `<tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Bénéficiaire</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${beneficiaryName || '-'} — ${beneficiaryNetwork || '-'} / ${beneficiaryCountry || '-'} / ${beneficiaryNumber || '-'}</td></tr>` +
    `<tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Montant</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${amount} FCFA</td></tr>` +
    `<tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Destination</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${destination}</td></tr></table>` +
    `<h3 style="margin-top:14px">📣 Nos services</h3>` +
    `<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0">` +
    `<a href="${base}/services/cartes-cadeaux" style="flex:1 1 45%;background:#111;color:#fff;padding:10px;border-radius:8px;text-decoration:none;text-align:center">Cartes cadeaux<br/><small style=\"color:#bbbbbb\">Offres instantanées</small></a>` +
    `<a href="${base}/services/paiement" style="flex:1 1 45%;background:#0f172a;color:#fff;padding:10px;border-radius:8px;text-decoration:none;text-align:center">Paiement & Factures<br/><small style=\"color:#bbbbbb\">Paiement sécurisé</small></a>` +
    `<a href="${base}/services/crypto" style="flex:1 1 45%;background:#052e21;color:#fff;padding:10px;border-radius:8px;text-decoration:none;text-align:center">Crypto<br/><small style=\"color:#bbbbbb\">USDT, BTC, SOL...</small></a>` +
    `<a href="${base}/services/coupons" style="flex:1 1 45%;background:#2b0f3a;color:#fff;padding:10px;border-radius:8px;text-decoration:none;text-align:center">Coupons & PCS<br/><small style=\"color:#bbbbbb\">Offres promo</small></a>` +
    `</div>` +
    `<p style=\"margin:6px 0;font-size:13px\">Partagez cette offre :</p>` +
    `<div style=\"display:flex;gap:8px;align-items:center\">` +
    `<a href=\"https://twitter.com/intent/tweet?text=${encodeURIComponent('Découvrez Chreol Empire — services rapides et fiables')}&url=${encodeURIComponent(base)}\" style=\"padding:8px 10px;background:#1DA1F2;color:#fff;border-radius:6px;text-decoration:none\">Partager sur X</a>` +
    `<a href=\"https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(base)}\" style=\"padding:8px 10px;background:#1877F2;color:#fff;border-radius:6px;text-decoration:none\">Partager sur Facebook</a>` +
    `<a href=\"https://wa.me/?text=${encodeURIComponent(base + ' — Découvrez Chreol Empire, services rapides et fiables') }\" style=\"padding:8px 10px;background:#25D366;color:#fff;border-radius:6px;text-decoration:none\">Partager sur WhatsApp</a>` +
    `</div>` +
    `<p style="margin:14px 0">` +
    `<a href="${markDoneUrl}" style="display:inline-block;padding:10px 14px;background:#16a34a;color:#fff;border-radius:8px;margin-right:8px;text-decoration:none">Marquer traitée</a>` +
    `<a href="${markCancelUrl}" style="display:inline-block;padding:10px 14px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none">Annuler</a>` +
    `</p>` +
    `<p style="font-size:12px;color:#6B7280">Statut enregistré: pending. Annulation automatique après 60 minutes si non traitée.</p></div></body></html>`;

  const br = await sendBrevo(`Nouvelle demande de transfert ${ref}`, emailHtml, email);

  // build WhatsApp link to contact admin with same message
  const waNumber = CONTACT.whatsapp.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

  return NextResponse.json({ ok: true, telegram: tg, brevo: br, waLink, markDoneUrl, markCancelUrl, ref, persisted: supaOk }, { status: 200 });
}
