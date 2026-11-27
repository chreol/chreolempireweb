import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Supprimer la ligne parasite "  }, { status: 400 });\r\n  }\r\n" après le bloc de validation
bad = (
    '  if (!p.paymentMethod || typeof p.paymentMethod !== "string" || !p.paymentMethod.trim()) {\r\n'
    '\r\n'
    '    return Response.json({ error: "Mode de paiement manquant ou invalide" }, { status: 400 });\r\n'
    '\r\n'
    '  }, { status: 400 });\r\n'
    '  }\r\n'
)
good = (
    '  if (!p.paymentMethod || typeof p.paymentMethod !== "string" || !p.paymentMethod.trim()) {\r\n'
    '    return Response.json({ error: "Mode de paiement manquant ou invalide" }, { status: 400 });\r\n'
    '  }\r\n'
)

if bad in c:
    c = c.replace(bad, good, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    print("OK - ligne parasite supprim\u00e9e")
else:
    # Debug : afficher les lignes 905-920
    lines = c.split('\n')
    for i, line in enumerate(lines[903:920], 904):
        print(f"L{i}: {repr(line)}")
