export const runtime = "edge";

interface CollectPayload {
  phone: string;
  operator: "orange" | "mtn";
  amount: number;
  label: string;
  externalReference: string;
}

export async function POST(request: Request): Promise<Response> {
  let body: CollectPayload;
  try {
    body = (await request.json()) as CollectPayload;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { phone, operator, amount, label, externalReference } = body;

  if (!phone || !operator || !amount || !externalReference) {
    return Response.json({ error: "Champs requis manquants" }, { status: 422 });
  }

  const token = process.env.CAMPAY_API_TOKEN;
  if (!token) {
    console.error("[campay-collect] CAMPAY_API_TOKEN manquant");
    return Response.json({ error: "Paiement automatique non configuré" }, { status: 503 });
  }

  const baseUrl = process.env.CAMPAY_BASE_URL ?? "https://campay.net";

  try {
    const campayRes = await fetch(`${baseUrl}/api/collect/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        amount: String(amount),
        currency: "XAF",
        from: phone,
        description: label,
        external_reference: externalReference,
      }),
    });

    const data = await campayRes.json();
    console.log(`[campay-collect] ${campayRes.status} — ${operator} ${phone} | ${amount} XAF | ref=${externalReference}`, data);
    return Response.json(data, { status: campayRes.status });
  } catch (err) {
    console.error("[campay-collect] Erreur réseau Campay:", err);
    return Response.json({ error: "Erreur connexion Campay" }, { status: 502 });
  }
}
