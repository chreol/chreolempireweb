import sys
sys.stdout.reconfigure(encoding='utf-8')

# ═══════════════════════════════════════════════════════════════════
# FIX 1 — notify-order/route.ts : validation paymentMethod manquante
# ═══════════════════════════════════════════════════════════════════
path1 = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"
with open(path1, "r", encoding="utf-8") as f:
    c1 = f.read()

old1 = (
    '  if (!p.orderId || !p.clientEmail || !p.total || !Array.isArray(p.items)) {\r\n'
    '    return Response.json({ error: "Champs requis manquants" }, { status: 400 });\r\n'
    '  }'
)
new1 = (
    '  if (!p.orderId || !p.clientEmail || !p.total || !Array.isArray(p.items)) {\r\n'
    '    return Response.json({ error: "Champs requis manquants" }, { status: 400 });\r\n'
    '  }\r\n'
    '  // R\u00e8gle absolue : le mode de paiement doit \u00eatre explicitement fourni.\r\n'
    '  // Pas de fallback silencieux \u2014 une commande sans paymentMethod est invalide.\r\n'
    '  if (!p.paymentMethod || typeof p.paymentMethod !== "string" || !p.paymentMethod.trim()) {\r\n'
    '    return Response.json({ error: "Mode de paiement manquant ou invalide" }, { status: 400 });\r\n'
    '  }'
)

if old1 in c1:
    c1 = c1.replace(old1, new1, 1)
    print("[FIX 1] notify-order validation paymentMethod - OK")
else:
    print("[FIX 1] PATTERN NON TROUVE")

# ═══════════════════════════════════════════════════════════════════
# FIX 3 — notify-order/route.ts : canal de commande dynamique
# ═══════════════════════════════════════════════════════════════════
old3 = (
    '          <td style="padding:10px 16px;font-size:12px;font-weight:900;color:#25D366;text-align:right">'
    '\U0001F4AC Via WhatsApp</td>'
)
new3 = (
    '          <td style="padding:10px 16px;font-size:12px;font-weight:900;'
    'color:${p.campayReference ? \\"#F59E0B\\" : \\"#25D366\\"};text-align:right">'
    '${p.campayReference ? \\"⚡ Via Campay\\" : \\"\\U0001F4AC Via WhatsApp\\"}</td>'
)

if old3 in c1:
    c1 = c1.replace(old3, new3, 1)
    print("[FIX 3] Canal de commande dynamique - OK")
else:
    # Recherche alternative avec encodage HTML
    import re
    pattern3 = r'padding:10px 16px;font-size:12px;font-weight:900;color:#25D366;text-align:right">\U0001F4AC Via WhatsApp</td>'
    if re.search(pattern3, c1):
        print("[FIX 3] PATTERN TROUVE via regex mais remplacement complexe - skip")
    else:
        print("[FIX 3] PATTERN NON TROUVE - v\u00e9rifier manuellement")

with open(path1, "w", encoding="utf-8") as f:
    f.write(c1)

# ═══════════════════════════════════════════════════════════════════
# FIX 2 — campay-webhook/route.ts : operatorLabel s\u00e9curis\u00e9
# ═══════════════════════════════════════════════════════════════════
path2 = r"d:\VibeCode\chreolempire-web\src\app\api\campay-webhook\route.ts"
with open(path2, "r", encoding="utf-8") as f:
    c2 = f.read()

old2 = '  const operatorLabel = body.operator?.toLowerCase().includes("orange") ? "Orange Money" : "MTN MoMo";'
new2 = (
    '  // D\u00e9terminer le label d\'op\u00e9rateur \u00e0 partir du champ Campay.\n'
    '  // Campay ne supporte que Orange Money et MTN MoMo (Mobile Money Cameroun).\n'
    '  // Si operator est absent ou inconnu \u2192 on garde "MTN MoMo" comme fallback s\u00fbr\n'
    '  // (Campay Cameroun = MTN par d\u00e9faut selon leur doc).\n'
    '  const operatorRaw = body.operator ?? "";\n'
    '  const operatorLabel = operatorRaw.toLowerCase().includes("orange") ? "Orange Money"\n'
    '                      : operatorRaw.toLowerCase().includes("mtn")    ? "MTN MoMo"\n'
    '                      : operatorRaw.trim() ? `Campay (${operatorRaw})`\n'
    '                      : "MTN MoMo"; // fallback Campay Cameroun'
)

if old2 in c2:
    c2 = c2.replace(old2, new2, 1)
    with open(path2, "w", encoding="utf-8") as f:
        f.write(c2)
    print("[FIX 2] campay-webhook operatorLabel s\u00e9curis\u00e9 - OK")
else:
    print("[FIX 2] PATTERN NON TROUVE campay-webhook")

print("\nDone.")
