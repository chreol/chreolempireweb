import fs from "node:fs";
import path from "node:path";

const src = fs.readFileSync("src/app/api/notify-order/route.ts", "utf8");
const stripped = src
  .replace(/^export const runtime = .*$/m, "")
  .replace(/^import .*from "@\/lib\/internalAuth";$/m, "const isAuthorizedInternal = (..._a: unknown[]) => true;\nconst unauthorized = (..._a: unknown[]) => new Response('no', { status: 401 });")
  .replace(/^import .*from "@\/lib\/services";$/m, 'const CONTACT = { paypalEmail: "LARAMBAMBO@GMAIL.COM" };\nconst ORANGE_MONEY_COMMERCE = { merchantCode: "1052061", merchantName: "CHREOL EMPIRE", qrCode: "0015757444", ussd: "#150*47#", image: "/assets/orange-money-qr-code.png", poster: "", feeRate: 0.01 };');

fs.mkdirSync(".tmp-email", { recursive: true });
fs.writeFileSync(
  path.join(".tmp-email", "route.ts"),
  `${stripped}\nexport { buildClientEmail, buildAdminEmail, buildTelegramMsg };\n`,
);
console.log("temp route written");
