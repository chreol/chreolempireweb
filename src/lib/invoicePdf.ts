import { readFile } from "fs/promises";
import { readFileSync } from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { COMPANY } from "@/lib/companyInfo";

export interface InvoiceLine {
  name: string;
  qty: number;
  price: number;
}

export interface InvoiceData {
  id: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  lines: InvoiceLine[];
  commission: number;
  commissionLabel: string;
  total: number;
}

const GOLD = rgb(0.788, 0.659, 0.298);
const BLACK = rgb(0.04, 0.04, 0.04);
const MUTED = rgb(0.35, 0.35, 0.35);
const BLUE = rgb(0.12, 0.35, 0.72);
const WHITE = rgb(1, 1, 1);

function money(n: number): string {
  const safe = Math.round(Number.isFinite(n) ? n : 0);
  const grouped = Math.abs(safe).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${safe < 0 ? "-" : ""}${grouped} FCFA`;
}

/** Helvetica (WinAnsi) refuse les accents et l'espace fine de toLocaleString("fr-FR"). */
function clip(text: string, max: number): string {
  const clean = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > max ? `${clean.slice(0, Math.max(0, max - 3))}...` : clean;
}

function drawSeal(page: PDFPage, font: PDFFont, bold: PDFFont, x: number, y: number) {
  page.drawEllipse({ x, y, xScale: 54, yScale: 54, borderColor: BLUE, borderWidth: 2 });
  page.drawEllipse({ x, y, xScale: 46, yScale: 46, borderColor: BLUE, borderWidth: 0.8 });
  page.drawText("CHREOL EMPIRE", { x: x - 40, y: y + 6, size: 8, font: bold, color: BLUE });
  page.drawText("SARL", { x: x - 10, y: y - 8, size: 8, font: bold, color: BLUE });
  page.drawText("YAOUNDE", { x: x - 22, y: y - 22, size: 7, font, color: BLUE });
}

export async function buildInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 0, y: height - 118, width, height: 118, color: BLACK });
  page.drawRectangle({ x: 0, y: height - 122, width, height: 4, color: GOLD });

  try {
    const logo = await readFile(path.join(process.cwd(), "public", "assets", "Logo_Chreol_Empire_revue-removebg-preview.png"));
    const image = await doc.embedPng(logo);
    page.drawImage(image, { x: 36, y: height - 100, width: 64, height: 64 });
  } catch {
    page.drawText("CE", { x: 48, y: height - 78, size: 22, font: bold, color: GOLD });
  }

  page.drawText(COMPANY.name, { x: 116, y: height - 48, size: 16, font: bold, color: GOLD });
  page.drawText(clip(COMPANY.headquarters, 70), { x: 116, y: height - 66, size: 9, font, color: WHITE });
  page.drawText(`RCCM ${COMPANY.rccm}  |  NIU ${COMPANY.niu}`, { x: 116, y: height - 80, size: 8, font, color: WHITE });
  page.drawText(`Tel ${COMPANY.phone}  |  WhatsApp ${COMPANY.whatsapp}`, { x: 116, y: height - 94, size: 8, font, color: WHITE });
  page.drawText(`${COMPANY.email}  |  ${COMPANY.website}`, { x: 116, y: height - 108, size: 8, font, color: WHITE });

  const issued = new Date(data.createdAt);
  const dateLabel = Number.isNaN(issued.getTime())
    ? ""
    : issued.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  page.drawText("FACTURE", { x: 36, y: height - 160, size: 22, font: bold, color: BLACK });
  page.drawText(clip(`N° ${data.id}`, 42), { x: 150, y: height - 158, size: 12, font: bold, color: GOLD });
  page.drawText(clip(dateLabel, 40), { x: 360, y: height - 156, size: 10, font, color: MUTED });

  page.drawText("CLIENT", { x: 36, y: height - 196, size: 9, font: bold, color: GOLD });
  page.drawText(clip(data.clientName || "Client", 48), { x: 36, y: height - 214, size: 12, font: bold, color: BLACK });
  page.drawText(clip(data.clientEmail || "—", 48), { x: 36, y: height - 230, size: 10, font, color: MUTED });
  page.drawText(clip(data.clientPhone || "—", 32), { x: 36, y: height - 246, size: 10, font, color: MUTED });

  const tableTop = height - 286;
  page.drawRectangle({ x: 36, y: tableTop - 22, width: 523, height: 22, color: BLACK });
  page.drawText("Designation", { x: 46, y: tableTop - 15, size: 9, font: bold, color: GOLD });
  page.drawText("Qte", { x: 340, y: tableTop - 15, size: 9, font: bold, color: GOLD });
  page.drawText("Prix", { x: 400, y: tableTop - 15, size: 9, font: bold, color: GOLD });
  page.drawText("Montant", { x: 470, y: tableTop - 15, size: 9, font: bold, color: GOLD });

  const lines = data.lines.length > 0 ? data.lines.slice(0, 12) : [{ name: "Commande", qty: 1, price: data.total }];
  let y = tableTop - 42;
  lines.forEach((line, index) => {
    const qty = Number.isFinite(line.qty) && line.qty > 0 ? line.qty : 1;
    const unit = Number.isFinite(line.price) ? line.price : 0;
    if (index % 2 === 0) {
      page.drawRectangle({ x: 36, y: y - 6, width: 523, height: 20, color: rgb(0.97, 0.96, 0.93) });
    }
    page.drawText(clip(line.name || "Article", 42), { x: 46, y, size: 9, font, color: BLACK });
    page.drawText(String(qty), { x: 346, y, size: 9, font, color: BLACK });
    page.drawText(money(unit), { x: 390, y, size: 9, font, color: BLACK });
    page.drawText(money(unit * qty), { x: 460, y, size: 9, font, color: BLACK });
    y -= 22;
  });

  const goods = lines.reduce((sum, line) => sum + (line.price || 0) * (line.qty || 1), 0);
  const fee = data.commission > 0 ? data.commission : Math.max(0, data.total - goods);
  const base = fee > 0 ? data.total - fee : goods || data.total;

  y -= 10;
  page.drawText("Prix de base", { x: 340, y, size: 10, font, color: MUTED });
  page.drawText(money(base), { x: 450, y, size: 10, font, color: BLACK });
  y -= 16;
  if (fee > 0) {
    page.drawText(clip(data.commissionLabel || "Frais", 22), { x: 340, y, size: 10, font, color: MUTED });
    page.drawText(money(fee), { x: 450, y, size: 10, font, color: BLACK });
    y -= 18;
  }
  page.drawRectangle({ x: 330, y: y - 8, width: 229, height: 24, color: BLACK });
  page.drawText("TOTAL", { x: 342, y: y, size: 11, font: bold, color: GOLD });
  page.drawText(money(data.total), { x: 430, y: y, size: 11, font: bold, color: WHITE });

  let stamped = false;
  try {
    const seal = readFileSync(path.join(process.cwd(), "public", "Cachet", "Cachet CHREOL EMPIRE SARL.png"));
    const image = await doc.embedPng(seal);
    page.drawImage(image, { x: 36, y: 46, width: 132, height: 132 });
    stamped = true;
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : "";
    if (code !== "ENOENT") {
      console.error("[invoice-pdf] cachet non charge, facture sans cachet", err);
    }
  }
  if (!stamped) drawSeal(page, font, bold, 110, 118);
  page.drawText("Merci de votre confiance", { x: 190, y: 108, size: 12, font: bold, color: BLACK });
  page.drawText(COMPANY.name, { x: 190, y: 90, size: 8, font, color: MUTED });

  return doc.save();
}
