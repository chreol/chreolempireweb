"""
Simule exactement ce que le shop envoie à /api/notify-order
quand un client choisit GIMAC dans /cart
et affiche le message Telegram + l'email HTML
"""
import sys, json, re, urllib.parse
sys.stdout.reconfigure(encoding='utf-8')

# ── Payload exact envoyé par cart/page.tsx handleConfirmOrder() ──────────────
# opLabel = opConfig?.label = "Gimac" (depuis OPERATORS array)
# payTotal = total + fee = 15800 + 0 = 15800 (GIMAC : pas de commission)

PAYLOAD = {
    "orderId": "CE2026111900042ABC",          # makeId() simulé
    "clientName": "Jean Dupont",
    "clientEmail": "jeandupont@gmail.com",
    "clientPhone": "237691234567",
    "paymentMethod": "Gimac",                  # ← C'est exactement ça qui est envoyé
    "sourceUrl": "https://shop.chreolempire.com/cart",
    "items": [
        {
            "name": "PSN PlayStation",
            "qty": 1,
            "price": 15800,
            "amount": "20€",
            "details": None
        }
    ],
    "total": 15800,
    "commission": None,
    "commissionLabel": None
}

ref = PAYLOAD["orderId"][-8:].upper()
method = PAYLOAD["paymentMethod"]
lower = method.lower()

print("=" * 70)
print("PAYLOAD ENVOYÉ PAR LE SHOP → /api/notify-order")
print("=" * 70)
print(json.dumps(PAYLOAD, indent=2, ensure_ascii=False))

# ── Simulation de la logique AVANT le fix ────────────────────────────────────
print()
print("=" * 70)
print("❌ AVANT LE FIX — getMomoPaymentRows() avec showBoth")
print("=" * 70)

is_mtn    = "mtn" in lower
is_orange = "orange" in lower
show_both_AVANT = not is_mtn and not is_orange  # BUG: GIMAC tombe ici

print(f"  paymentMethod  = '{method}'")
print(f"  lower          = '{lower}'")
print(f"  isMtn          = {is_mtn}")
print(f"  isOrange       = {is_orange}")
print(f"  showBoth       = {show_both_AVANT}  ← PROBLÈME : True pour GIMAC !")
print()
print("  Résultat dans l'email : Orange Money + MTN Mobile Money affichés")
print("  → Client voit 'PAYER VIA ORANGE MONEY' alors qu'il a choisi GIMAC !")

# ── Simulation de la logique APRÈS le fix ────────────────────────────────────
print()
print("=" * 70)
print("✅ APRÈS LE FIX — getMomoPaymentRows() avec isKnownAlt")
print("=" * 70)

is_known_alt = ("gimac" in lower or "crypto" in lower
                or "paypal" in lower or "iwopay" in lower)
show_both_APRES = not is_mtn and not is_orange and not is_known_alt

print(f"  paymentMethod  = '{method}'")
print(f"  isKnownAlt     = {is_known_alt}  ← GIMAC reconnu")
print(f"  showBoth       = {show_both_APRES}  ← Correct : ne force pas Orange/MTN")
print()

# Dispatch FIX #3
is_gimac = "gimac" in lower
print(f"  Dispatch buildClientEmail :")
if is_gimac:
    print(f"  → getGimacPaymentRows() appelé ✅")
else:
    print(f"  → getMomoPaymentRows() appelé")

# ── Message Telegram AVANT ───────────────────────────────────────────────────
print()
print("=" * 70)
print("📱 MESSAGE TELEGRAM — AVANT LE FIX")
print("=" * 70)
p_icon_avant = ("🟡" if "mtn" in lower
                else "🟠" if "orange" in lower
                else "💬")  # GIMAC → 💬 (icône WhatsApp, trompeur)

tg_avant = f"""🛍️ <b>NOUVELLE COMMANDE #{ref}</b>

👤 <b>{PAYLOAD['clientName']}</b>
📧 {PAYLOAD['clientEmail']}
📱 +{PAYLOAD['clientPhone']}
{p_icon_avant} <b>{PAYLOAD['paymentMethod']}</b>

📦 <b>Commande :</b>
• <b>PSN PlayStation</b> ×1 = 15 800 FCFA

💰 <b>TOTAL : 15 800 FCFA</b>

💬 Ouvrir WhatsApp client"""

print(tg_avant)
print()
print(f"  ⚠️  Icône : {p_icon_avant} (trompeur — ressemble à WhatsApp)")

# ── Message Telegram APRÈS ───────────────────────────────────────────────────
print()
print("=" * 70)
print("📱 MESSAGE TELEGRAM — APRÈS LE FIX ✅")
print("=" * 70)
p_icon_apres = ("🟡" if "mtn" in lower
                else "🟠" if "orange" in lower
                else "🏦" if "gimac" in lower     # FIX #4
                else "₿"  if "crypto" in lower
                else "💳" if "paypal" in lower
                else "💬")

tg_apres = f"""🛍️ <b>NOUVELLE COMMANDE #{ref}</b>

👤 <b>{PAYLOAD['clientName']}</b>
📧 {PAYLOAD['clientEmail']}
📱 +{PAYLOAD['clientPhone']}
{p_icon_apres} <b>{PAYLOAD['paymentMethod']}</b>

📦 <b>Commande :</b>
• <b>PSN PlayStation</b> ×1 = 15 800 FCFA

💰 <b>TOTAL : 15 800 FCFA</b>

🌐 Voir la page source
💬 Ouvrir WhatsApp client"""

print(tg_apres)
print()
print(f"  ✅ Icône : {p_icon_apres} (clair — banque/virement CEMAC)")

# ── Section email AVANT (instructons Orange+MTN) ────────────────────────────
print()
print("=" * 70)
print("📧 EMAIL CLIENT — SECTION PAIEMENT — AVANT LE FIX (HTML simplifié)")
print("=" * 70)
print("""
  Mode de paiement : [Gimac]           ← correct dans le label

  ┌─────────────────────────────────────────────────────┐
  │ 🟡 PAYER VIA MTN MOBILE MONEY                       │  ← FAUX !
  │  Code marchand : +237 683 682 958                   │
  │  Dépôt majoré de 1,5 %                              │
  └─────────────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────────┐
  │ 🟠 PAYER VIA ORANGE MONEY                           │  ← FAUX !
  │  Code marchand : 1052061                            │
  │  USSD : #150*47#                                    │
  └─────────────────────────────────────────────────────┘

  → Client complètement perdu !
  → Paie en Orange alors qu'il voulait faire un virement CEMAC
""")

# ── Section email APRÈS ───────────────────────────────────────────────────────
print()
print("=" * 70)
print("📧 EMAIL CLIENT — SECTION PAIEMENT — APRÈS LE FIX ✅ (HTML simplifié)")
print("=" * 70)
print(f"""
  Mode de paiement : [Gimac]           ← correct dans le label

  ┌─────────────────────────────────────────────────────┐
  │ 🏦 PAYER VIA GIMAC (TRANSFERT CEMAC)                │  ← CORRECT !
  │  Effectuez un virement interbancaire CEMAC via     │
  │  votre banque :                                     │
  │  Destinataire : +237 683 682 958                    │
  │  Titulaire : Vernatus Mesue Etube                   │
  │  Référence : #{ref}                        │
  └─────────────────────────────────────────────────────┘
  [ 📱 Envoyer la preuve de virement via WhatsApp ]

  TOTAL À RÉGLER : 15 800 FCFA
""")

print("=" * 70)
print("RÉSUMÉ DES CORRECTIONS")
print("=" * 70)
print("""
  FRONTEND (cart/page.tsx)   : ✅ Envoyait déjà "Gimac" correctement
  BACKEND (notify-order)     : ✅ Reçoit et stocke "Gimac" tel quel
  DATABASE (Supabase)        : ✅ payment_method = "Gimac" correct
  EMAIL admin                : ✅ Affiche "Gimac" (pColor vert générique)
  EMAIL client section paymt : ✅ FIX → bloc GIMAC au lieu de Orange+MTN
  TELEGRAM icône             : ✅ FIX → 🏦 au lieu de 💬
  TELEGRAM texte paymentMethod: ✅ Affichait déjà "Gimac" correctement
""")
