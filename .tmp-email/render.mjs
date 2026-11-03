import fs from "node:fs";
import { buildClientEmail, buildAdminEmail, buildTelegramMsg } from "./out/route.js";

const base = {
  orderId: "paypal-buy-1793713313014-ba573e9b",
  clientName: "audit.achat",
  clientEmail: "audit.achat@example.com",
  clientPhone: "237690000000",
  paymentMethod: "Orange Money",
  items: [
    {
      name: "Achat PayPal Europe",
      qty: 1,
      price: 10100,
      amount: "10 000 FCFA → 14.29€",
      details:
        "PayPal (Email) : audit.achat@example.com | 10 000 FCFA → 14.29€\nFrais Orange Money (1 %) : 100 FCFA\nTotal à payer : 10 100 FCFA\nOrange Money +237 690000000",
    },
  ],
  total: 10100,
  commission: 100,
  commissionLabel: "Frais Orange Money (1 %)",
  sourceUrl: "http://localhost:3100/services/paypal",
  flow: "buy",
  paypalId: "audit.achat@example.com",
  paypalIdFormat: "email",
  eurAmount: 14.29,
  payoutTarget: "Orange Money · +237 690000000",
};

const sell = {
  ...base,
  flow: "sell",
  total: 5200,
  commission: undefined,
  commissionLabel: undefined,
  eurAmount: 10,
  paypalId: "client.paypal@example.com",
  items: [
    {
      name: "Vente PayPal Europe",
      qty: 1,
      price: 5200,
      amount: "10.00€ → 5 200 FCFA",
      details: "PayPal (Email) : client.paypal@example.com | 10.00€ → 5 200 FCFA\nOrange Money +237 690000000",
    },
  ],
};

fs.writeFileSync(".tmp-email/preview-buy.html", buildClientEmail(base));
fs.writeFileSync(".tmp-email/preview-sell.html", buildClientEmail(sell));
fs.writeFileSync(".tmp-email/preview-admin.html", buildAdminEmail(base, "#done", "#cancel"));
fs.writeFileSync(".tmp-email/preview-telegram-buy.txt", buildTelegramMsg(base));
fs.writeFileSync(".tmp-email/preview-telegram-sell.txt", buildTelegramMsg(sell));
console.log("previews written");
