import sys, json
sys.stdout.reconfigure(encoding='utf-8')

PAYLOAD = {
    "orderId": "CE2026111900042ABC",
    "clientName": "Jean Dupont",
    "clientEmail": "dikev79576@dvdee.com",
    "clientPhone": "237691234567",
    "paymentMethod": "Gimac",
    "total": 15800,
    "items": [{"name": "PSN PlayStation", "qty": 1, "price": 15800, "amount": "20e"}],
}

ref = PAYLOAD["orderId"][-8:].upper()
method = PAYLOAD["paymentMethod"]
lower = method.lower()

print("PAYLOAD EXACT (comme cart.tsx le ferait)")
print(json.dumps(PAYLOAD, indent=2, ensure_ascii=False))

print()
print("=" * 65)
print("AVANT LE FIX — showBoth=True pour GIMAC")
print("=" * 65)
isMtn = "mtn" in lower
isOrange = "orange" in lower
showBoth_avant = not isMtn and not isOrange
print(f"  paymentMethod = {repr(method)}")
print(f"  isMtn         = {isMtn}")
print(f"  isOrange      = {isOrange}")
print(f"  showBoth      = {showBoth_avant}  <--- BUG !")
print()
print("  EMAIL CLIENT affichait :")
print("  +--------------------------------------------------+")
print("  | Mode de paiement :  Gimac                        |")
print("  +--------------------------------------------------+")
print("  | PAYER VIA MTN MOBILE MONEY   <-- FAUX            |")
print("  |   +237 683 682 958                               |")
print("  |   Vernatus Mesue Etube                           |")
print("  +--------------------------------------------------+")
print("  | PAYER VIA ORANGE MONEY       <-- FAUX            |")
print("  |   Code marchand : 1052061                        |")
print("  |   USSD #150*47#                                  |")
print("  +--------------------------------------------------+")
print()
print("  TELEGRAM affichait :")
print("   [icone] Gimac   <-- icone WhatsApp (trompeur)")

print()
print("=" * 65)
print("APRES LE FIX (maintenant)")
print("=" * 65)
isKnownAlt = "gimac" in lower or "crypto" in lower or "paypal" in lower or "iwopay" in lower
showBoth_apres = not isMtn and not isOrange and not isKnownAlt
print(f"  isKnownAlt    = {isKnownAlt}  <--- GIMAC identifie")
print(f"  showBoth      = {showBoth_apres}  <--- Correct !")
print()
print("  EMAIL CLIENT affiche maintenant :")
print("  +--------------------------------------------------+")
print("  | Mode de paiement :  Gimac                        |")
print("  +--------------------------------------------------+")
print("  | PAYER VIA GIMAC (TRANSFERT CEMAC)   <-- CORRECT  |")
print("  |   Virement vers : +237 683 682 958               |")
print("  |   Titulaire : Vernatus Mesue Etube               |")
ref_line = f"  |   Reference : #{ref}"
print(ref_line.ljust(51) + "|")
print("  +--------------------------------------------------+")
print("  | [Envoyer la preuve de virement via WhatsApp]     |")
print("  +--------------------------------------------------+")
print()
total_str = f"{PAYLOAD['total']:,}".replace(",", " ")
print(f"  TOTAL A REGLER : {total_str} FCFA")
print()
print("  TELEGRAM affiche maintenant :")
print("   GIMAC   <-- icone banque 'CEMAC correct'")

print()
print("=" * 65)
print("DETAILS EMAIL CLIENT → dikev79576@dvdee.com")
print("=" * 65)
email = PAYLOAD["clientEmail"]
name  = PAYLOAD["clientName"]
print(f"  TO      : {email}")
print(f"  SUBJECT : Commande confirmee #{ref} — Chreol Empire")
print(f"  Client  : {name}")
print(f"  Methode : {PAYLOAD['paymentMethod']}")
print(f"  Total   : {total_str} FCFA")
