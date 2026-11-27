import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"d:\VibeCode\chreolempire-web\src\app\api\notify-order\route.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = "${MTN_MONEY.name}"
new = "${MTN_MONEY.accountName}"

if old in content:
    content = content.replace(old, new, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("OK - MTN_MONEY.name → MTN_MONEY.accountName")
else:
    print("Pattern non trouvé")
