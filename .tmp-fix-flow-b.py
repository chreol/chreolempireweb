import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# FIX B — Telegram ligne 801 : em-dash dans la chaîne
old_b = 'p.flow === "buy" ? `\U0001F7E0 Encaissement Orange Money \u2014 marchand'
new_b = 'p.flow === "buy" && p.paymentMethod.toLowerCase().includes("orange") ? `\U0001F7E0 Encaissement Orange Money \u2014 marchand'

if old_b in content:
    content = content.replace(old_b, new_b, 1)
    print("[FIX B] Telegram - OK")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fichier sauvegardé.")
else:
    # Diagnostic
    idx = content.find("Encaissement Orange Money")
    if idx >= 0:
        print(f"[DEBUG] Trouvé à index {idx}: repr=")
        print(repr(content[max(0,idx-80):idx+80]))
    else:
        print("[DEBUG] 'Encaissement Orange Money' introuvable dans le fichier!")
