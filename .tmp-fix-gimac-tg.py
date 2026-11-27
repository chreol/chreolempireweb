import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# La ligne cible à trouver (Orange Money — ligne 801)
old_line = (
    'p.flow === "buy" && p.paymentMethod.toLowerCase().includes("orange") ? '
    '`\U0001F7E0 Encaissement Orange Money \u2014 marchand <code>${ORANGE_MONEY_COMMERCE.merchantCode}</code> '
    '(${ORANGE_MONEY_COMMERCE.merchantName})` : "",'
)

# Nouvelle version : même ligne Orange + nouvelle ligne GIMAC juste après
new_lines = (
    'p.flow === "buy" && p.paymentMethod.toLowerCase().includes("orange") ? '
    '`\U0001F7E0 Encaissement Orange Money \u2014 marchand <code>${ORANGE_MONEY_COMMERCE.merchantCode}</code> '
    '(${ORANGE_MONEY_COMMERCE.merchantName})` : "",\n'
    '    p.flow === "buy" && p.paymentMethod.toLowerCase().includes("gimac") ? '
    '`\U0001F3E6 <b>GIMAC \u2014 Transfert CEMAC vers le Cameroun</b>\\n'
    'Destinataire : <code>${MTN_MONEY.phoneDisplay}</code> \u2014 ${MTN_MONEY.name}\\n'
    '${p.total.toLocaleString("fr-FR")} FCFA\\n'
    'Pas de commission boutique. Les frais op\u00e9rateur GIMAC restent \u00e0 votre charge.` : "",'
)

if old_line in content:
    content = content.replace(old_line, new_lines, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[FIX GIMAC Telegram] OK - ligne insérée après Orange Money")
else:
    print("[ERREUR] Pattern introuvable. Debug repr:")
    idx = content.find("Encaissement Orange Money")
    if idx >= 0:
        print(repr(content[max(0,idx-150):idx+200]))
    else:
        print("'Encaissement Orange Money' pas trouvé du tout!")
