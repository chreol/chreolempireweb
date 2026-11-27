import sys, re
sys.stdout.reconfigure(encoding='utf-8')

path = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Chercher la ligne exacte de validation
old = re.search(r'  if \(!p\.orderId \|\| !p\.clientEmail \|\| !p\.total \|\| !Array\.isArray\(p\.items\)\) \{[^\}]+\}', c)
if old:
    print("[DEBUG found]:", repr(old.group(0)[:120]))
    target = old.group(0)
    replacement = target + (
        '\r\n  // R\u00e8gle absolue : paymentMethod doit \u00eatre fourni explicitement.\r\n'
        '  // Pas de fallback silencieux \u2014 une commande sans paymentMethod est invalide.\r\n'
        '  if (!p.paymentMethod || typeof p.paymentMethod !== "string" || !p.paymentMethod.trim()) {\r\n'
        '    return Response.json({ error: "Mode de paiement manquant ou invalide" }, { status: 400 });\r\n'
        '  }'
    )
    c = c.replace(target, replacement, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    print("[FIX 1] paymentMethod validation - OK")
else:
    print("[FIX 1] Pattern regex introuvable - cherchons autrement")
    idx = c.find("Champs requis manquants")
    if idx >= 0:
        print(repr(c[max(0, idx-120):idx+120]))
