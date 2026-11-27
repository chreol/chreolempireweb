import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Version LF (sans \r)
bad = (
    '  if (!p.paymentMethod || typeof p.paymentMethod !== "string" || !p.paymentMethod.trim()) {\n'
    '\n'
    '    return Response.json({ error: "Mode de paiement manquant ou invalide" }, { status: 400 });\n'
    '\n'
    '  }, { status: 400 });\n'
    '  }\n'
)
good = (
    '  if (!p.paymentMethod || typeof p.paymentMethod !== "string" || !p.paymentMethod.trim()) {\n'
    '    return Response.json({ error: "Mode de paiement manquant ou invalide" }, { status: 400 });\n'
    '  }\n'
)

if bad in c:
    c = c.replace(bad, good, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    print("OK - nettoyage LF r\u00e9ussi")
else:
    print("Pattern LF introuvable - debug:")
    idx = c.find('}, { status: 400 });\n  }')
    if idx >= 0:
        print(repr(c[max(0,idx-200):idx+50]))
    else:
        print("Ligne parasite introuvable")
