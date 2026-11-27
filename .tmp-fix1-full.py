import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# La ligne 903-904 est cassée : il manque "}, { status: 400 });\n  }"
# On cherche le fragment tronqué
bad = (
    '  if (!p.orderId || !p.clientEmail || !p.total || !Array.isArray(p.items)) {\n'
    '    return Response.json({ error: "Champs requis manquants" }\n'
    '\n'
    '  // R\u00e8gle absolue : paymentMethod doit \u00eatre fourni explicitement.\n'
    '\n'
    '  // Pas de fallback silencieux \u2014 une commande sans paymentMethod est invalide.\n'
    '\n'
    '  if (!p.paymentMethod || typeof p.paymentMethod !== "string" || !p.paymentMethod.trim()) {\n'
    '    return Response.json({ error: "Mode de paiement manquant ou invalide" }, { status: 400 });\n'
    '  }\n'
)
good = (
    '  if (!p.orderId || !p.clientEmail || !p.total || !Array.isArray(p.items)) {\n'
    '    return Response.json({ error: "Champs requis manquants" }, { status: 400 });\n'
    '  }\n'
    '  // R\u00e8gle absolue : paymentMethod doit \u00eatre fourni explicitement.\n'
    '  // Pas de fallback silencieux \u2014 une commande sans paymentMethod est invalide.\n'
    '  if (!p.paymentMethod || typeof p.paymentMethod !== "string" || !p.paymentMethod.trim()) {\n'
    '    return Response.json({ error: "Mode de paiement manquant ou invalide" }, { status: 400 });\n'
    '  }\n'
)

if bad in c:
    c = c.replace(bad, good, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    print("OK - bloc validation r\u00e9par\u00e9 complet")
else:
    print("Pattern introuvable - repr:")
    idx = c.find('Champs requis manquants')
    if idx >= 0:
        print(repr(c[max(0,idx-50):idx+200]))
