import { GIFT_CARDS } from "@/lib/services";

export const runtime = "edge";
export const revalidate = 3600;

const BASE = "https://shop.chreolempire.com";

const REGIONS = ["EU", "FR", "BE", "IT", "DE", "ES", "UK", "US", "CA", "AU", "GLOBAL"];
const REGION_LABELS: Record<string, string> = {
  EU: "Europe", FR: "France", BE: "Belgique", IT: "Italie",
  DE: "Allemagne", ES: "Espagne", UK: "UK", US: "USA",
  CA: "Canada", AU: "Australie", GLOBAL: "Global",
};

export async function GET(): Promise<Response> {
  const items: string[] = [];

  for (const card of GIFT_CARDS) {
    for (const region of REGIONS) {
      const regionLabel = REGION_LABELS[region];
      const lowestAmount = card.amounts[0];
      if (!lowestAmount) continue;

      const id = `${card.id}-${region.toLowerCase()}`;
      const title = `${card.name} ${regionLabel} — Cameroun FCFA`;
      const description = `Carte cadeau ${card.name} région ${regionLabel}. Livraison WhatsApp 15-30 min à Douala. Paiement MTN MoMo / Orange Money.`;
      const link = `${BASE}/services/cartes-cadeaux/${card.id}-${regionLabel.toLowerCase().replace(/ /g, "")}`;
      const price = (lowestAmount.price / 655.957).toFixed(2); // XAF → EUR approx

      items.push(`
  <item>
    <g:id>${id}</g:id>
    <g:title><![CDATA[${title}]]></g:title>
    <g:description><![CDATA[${description}]]></g:description>
    <g:link>${link}</g:link>
    <g:image_link>${BASE}/assets/chreolempire%20logo%20avec%20contact%20m.webp</g:image_link>
    <g:condition>new</g:condition>
    <g:availability>in stock</g:availability>
    <g:price>${lowestAmount.price} XAF</g:price>
    <g:brand>${card.name}</g:brand>
    <g:google_product_category>5032</g:google_product_category>
    <g:product_type>Cartes Cadeaux &gt; ${card.name}</g:product_type>
    <g:identifier_exists>no</g:identifier_exists>
    <g:shipping>
      <g:country>CM</g:country>
      <g:service>WhatsApp Express</g:service>
      <g:price>0 XAF</g:price>
    </g:shipping>
  </item>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Chreol Empire — Cartes Cadeaux Gaming Cameroun</title>
    <link>${BASE}</link>
    <description>Cartes cadeaux PSN, Roblox, Steam, Nintendo livrées par WhatsApp à Douala</description>
    ${items.join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
