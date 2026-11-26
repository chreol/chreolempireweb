import { authoritativeUnitPrice, catalogGiftPrice } from "@/config/promoConfig";

export const runtime = "edge";

interface IntakeItem {
  name?: unknown;
  qty?: unknown;
  price?: unknown;
  amount?: unknown;
  details?: unknown;
  isPromo?: unknown;
  productId?: unknown;
  promoPrice?: unknown;
}

/** Recalcule chaque ligne. Le promoPrice du navigateur n'est jamais utilisé. */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as { items?: IntakeItem[] };
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return Response.json({ error: "Panier vide." }, { status: 400 });
    }

    const items = body.items.map((raw) => {
      const amount = typeof raw.amount === "string" ? raw.amount : "";
      const productId = typeof raw.productId === "string" ? raw.productId : undefined;
      const isPromo = raw.isPromo === true;
      const posted = Math.round(Number(raw.price) || 0);
      const price = authoritativeUnitPrice({ price: posted, amount, productId, isPromo });
      const catalog = catalogGiftPrice(productId, amount);
      return {
        name: typeof raw.name === "string" ? raw.name : "",
        qty: Math.max(1, Math.round(Number(raw.qty) || 1)),
        price,
        amount,
        details: typeof raw.details === "string" ? raw.details : undefined,
        isPromo: isPromo && catalog != null && price < catalog,
        productId,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return Response.json({ items, subtotal });
  } catch {
    return Response.json({ error: "Impossible de valider le panier." }, { status: 400 });
  }
}
