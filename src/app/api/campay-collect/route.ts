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

  // TODO: call the real Campay collect endpoint
  // const campayRes = await fetch("https://demo.campay.net/api/collect/", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Token ${process.env.CAMPAY_API_TOKEN}`,
  //   },
  //   body: JSON.stringify({
  //     amount: String(amount),
  //     currency: "XAF",
  //     from: phone,
  //     description: label,
  //     external_reference: externalReference,
  //   }),
  // });
  // const data = await campayRes.json();
  // return Response.json(data, { status: campayRes.status });

  // ── Mock response (remove once CAMPAY_API_TOKEN is set) ──────────────────
  console.log(`[campay-collect] MOCK — ${operator} ${phone} | ${amount} XAF | ${label} | ref=${externalReference}`);
  return Response.json({
    reference: `MOCK-${Date.now()}`,
    status: "PENDING",
    message: "Demande de paiement envoyée",
    ussd_code: operator === "orange" ? "#150*50#" : "*126*1#",
  });
}
