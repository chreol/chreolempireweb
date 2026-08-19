import { NextResponse } from 'next/server';
import { CONTACT } from '@/lib/services';
import { createClient } from '@supabase/supabase-js';

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

async function sendBrevo(subject: string, html: string) {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) return 0;
  const sender = process.env.BREVO_SENDER_ID ? { id: parseInt(process.env.BREVO_SENDER_ID, 10) } : { name: 'Chreol Empire', email: process.env.BREVO_SENDER_EMAIL ?? 'contact@chreolempire.com' };
  const recipients = [{ email: process.env.BREVO_ADMIN_EMAIL ?? CONTACT.email, name: 'Chreol Empire' }];
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'Content-Type': 'application/json', 'api-key': brevoKey }, body: JSON.stringify({ sender, to: recipients, subject, htmlContent: html }) });
    return res.ok ? 1 : 0;
  } catch (e) { return 0; }
}

export async function GET() {
  const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ADMIN_KEY;
  if (!SUPA_URL || !SUPA_KEY) return NextResponse.json({ ok: false, error: 'Supabase service key missing' }, { status: 400 });
  const sb = createClient(SUPA_URL, SUPA_KEY as string);

  const now = new Date().toISOString();
  const { data, error } = await sb.from('transfers').select('*').eq('status', 'pending').lte('expires_at', now);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ ok: true, cancelled: 0 });

  let cancelled = 0;
  for (const row of data) {
    try {
      const { error: up } = await sb.from('transfers').update({ status: 'cancelled', updated_at: new Date().toISOString(), cancelled_by: 'system' }).eq('ref', row.ref);
      if (up) continue;
      cancelled++;

      // notify admin
      const ref = row.ref;
      const text = `<b>Demande expirée — ${ref}</b>\nClient: ${row.name || '-'} — ${row.phone || '-'}\nMontant: ${row.amount || '-'} FCFA\nDestination: ${row.destination || '-'}\nSource: ${row.source_url || (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shop.chreolempire.com')}`;
      await sendTelegram(text);
      const emailHtml = `<!doctype html><html><body><div style="font-family:Arial,Helvetica,sans-serif"><h3>Demande expirée: ${ref}</h3><p>${text}</p></div></body></html>`;
      await sendBrevo(`Demande expirée ${ref}`, emailHtml);
    } catch (e) {
      // continue
    }
  }

  return NextResponse.json({ ok: true, cancelled }, { status: 200 });
}
