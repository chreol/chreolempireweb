export const runtime = "edge";

interface CollectPayload {
  phone: string;
  operator: "orange" | "mtn";
  amount: number;
  label: string;
  externalReference: string;
}

async function getCampayToken(baseUrl: string): Promise<string> {
  const username = process.env.CAMPAY_USERNAME;
  const password = process.env.CAMPAY_PASSWORD;

  const res = await fetch(`${baseUrl}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Campay auth failed (${res.status}): ${err}`);
  }

  const data = await res.json() as { token: string };
  return data.token;
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

  if (!process.env.CAMPAY_USERNAME || !process.env.CAMPAY_PASSWORD) {
    console.error("[campay-collect] Credentials Campay manquants");
    return Response.json({ error: "Paiement automatique non configuré" }, { status: 503 });
  }

  const baseUrl = process.env.CAMPAY_BASE_URL ?? "https://campay.net";
  // Campay attend le numéro au format international sans le +
  const fullPhone = phone.startsWith("237") ? phone : `237${phone}`;

  try {
    const token = await getCampayToken(baseUrl);

    const campayRes = await fetch(`${baseUrl}/api/collect/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        amount: String(amount),
        currency: "XAF",
        from: fullPhone,
        description: label,
        external_reference: externalReference,
      }),
    });

    const data = await campayRes.json();
    console.log(`[campay-collect] ${campayRes.status} — ${operator} ${fullPhone} | ${amount} XAF | ref=${externalReference}`, data);
    return Response.json(data, { status: campayRes.status });
  } catch (err) {
    console.error("[campay-collect] Erreur:", err);
    return Response.json({ error: "Erreur connexion Campay" }, { status: 502 });
  }
}
