import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Annuler le fix 3 corrompu et remettre la version propre
# La ligne corrompue contient des \" qui ne sont pas valides dans un template literal HTML
bad_line = (
    '          <td style="padding:10px 16px;font-size:12px;font-weight:900;'
    'color:${p.campayReference ? \\"#F59E0B\\" : \\"#25D366\\"};text-align:right">'
    '${p.campayReference ? \\"\\u26a1 Via Campay\\" : \\"\\U0001f4ac Via WhatsApp\\"}</td>'
)

# Chercher la ligne corrompue par son début unique
import re
# La ligne contient "campayReference ? \\"
corrupt_pattern = r'<td style="padding:10px 16px;font-size:12px;font-weight:900;color:\$\{p\.campayReference.*?</td>'
match = re.search(corrupt_pattern, c, re.DOTALL)
if match:
    old_bad = match.group(0)
    print("[FOUND corrupt]:", repr(old_bad[:100]))
    
    # Remplacement propre : template literal avec vraies backtick expressions
    # Dans un template literal HTML, les guillemets doubles DANS le HTML doivent être échappés
    # La couleur doit être dans le style inline — on utilise une condition ternaire JS valide
    new_good = (
        '<td style="padding:10px 16px;font-size:12px;font-weight:900;'
        "color:${p.campayReference ? '#F59E0B' : '#25D366'};text-align:right\">"
        "${p.campayReference ? '\u26a1 Via Campay (Mobile Money)' : '\U0001F4AC Via WhatsApp'}</td>"
    )
    c = c.replace(old_bad, new_good, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    print("[FIX 3] Canal de commande - CORRIGE")
else:
    print("[FIX 3] Pattern corrompu introuvable - v\u00e9rification manuelle")
    # Debug: chercher la ligne 668
    lines = c.split('\n')
    for i, line in enumerate(lines[662:670], 663):
        print(f"L{i}: {repr(line[:120])}")
