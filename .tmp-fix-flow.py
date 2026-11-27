import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# ─── FIX A : Email admin (ligne ~487) ─────────────────────────────────────────
# AVANT : p.flow === "buy" ? `<p ...>Encaissement Orange Money...`
# APRÈS : p.flow === "buy" && p.paymentMethod.toLowerCase().includes("orange") ? `...`
old_a = '${p.flow === "buy" ? `<p style="font-size:13px;color:#1F2937;margin:0 0 16px">Encaissement Orange Money'
new_a = '${p.flow === "buy" && p.paymentMethod.toLowerCase().includes("orange") ? `<p style="font-size:13px;color:#1F2937;margin:0 0 16px">Encaissement Orange Money'

if old_a in content:
    content = content.replace(old_a, new_a, 1)
    print("[FIX A] Email admin - OK")
else:
    print("[FIX A] PATTERN NON TROUVE - vérifier manuellement")

# ─── FIX B : Telegram (ligne ~801) ────────────────────────────────────────────
# AVANT : p.flow === "buy" ? `🟠 Encaissement Orange Money - marchand...`
# APRÈS : p.flow === "buy" && p.paymentMethod.toLowerCase().includes("orange") ? `...`
old_b = 'p.flow === "buy" ? `'
# This pattern might be too broad; let's search for the specific telegram encaissement line
# Use a more specific pattern
import re

# Pattern for telegram line
telegram_pattern = r'(p\.flow === "buy" \? `[^`]*Encaissement Orange Money - marchand[^`]*`)'
telegram_match = re.search(telegram_pattern, content)
if telegram_match:
    old_telegram = telegram_match.group(0)
    # Replace just the condition
    new_telegram = old_telegram.replace('p.flow === "buy" ?', 'p.flow === "buy" && p.paymentMethod.toLowerCase().includes("orange") ?')
    content = content.replace(old_telegram, new_telegram, 1)
    print("[FIX B] Telegram - OK")
else:
    print("[FIX B] PATTERN NON TROUVE - vérifier manuellement")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("\nFix appliqué. Vérification des occurrences restantes :")
lines = content.split("\n")
for i, line in enumerate(lines, 1):
    if "Encaissement Orange Money" in line and "comment" not in line.lower() and i != 291:
        print(f"  L{i}: {line.strip()[:120]}")
