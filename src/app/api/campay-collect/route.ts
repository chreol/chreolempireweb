export const runtime = "edge";

const VALID_OPERATORS = new Set(["orange", "mtn"]);
const AMOUNT_MIN = 100;
const AMOUNT_MAX = 500_000;
// Préfixes opérateurs camerounais valides (9 chiffres, sans indicatif)
const ORANGE_PREFIXES = ["69", "655", "656", "657", "658", "659"];
const MTN_PREFIXES    = ["67", "68", "650", "651", "652", "653", "654"];

interface CollectPayload {
  phone: string;
  operator: "orange" | "mtn";
  amount: number;
  label: string;
  externalReference: string;
}

function isValidPhone(phone: string): boolean {
  return /^\d{9}$/.test(phone);
}

function isOperatorConsistent(phone: string, operator: string): boolean {
  if (operator === "orange") return ORANGE_PREFIXES.some(p => phone.startsWith(p));
  if (operator === "mtn")    return MTN_PREFIXES.some(p => phone.startsWith(p));
  return false;
}

export async function POST(request: Request): Promise<Response> {
  let body: CollectPayload;
  try {
    body = (await request.json()) as CollectPayload;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { phone, operator, amount, label, externalReference } = body;

  // Validation stricte des champs
  if (!phone || !operator || !amount || !externalReference) {
    return Response.json({ error: "Champs requis manquants" }, { status: 422 });
  }
  if (!VALID_OPERATORS.has(operator)) {
    return Response.json({ error: "Opérateur invalide" }, { status: 422 });
  }
  if (!isValidPhone(phone)) {
    return Response.json({ error: "Numéro invalide — 9 chiffres sans indicatif" }, { status: 422 });
  }
  if (!isOperatorConsistent(phone, operator)) {
    return Response.json({ error: `Ce numéro n'appartient pas à ${operator === "orange" ? "Orange" : "MTN"}` }, { status: 422 });
  }
  if (!Number.isFinite(amount) || amount < AMOUNT_MIN || amount > AMOUNT_MAX) {
    return Response.json({ error: `Montant invalide (min ${AMOUNT_MIN} XAF, max ${AMOUNT_MAX.toLocaleString()} XAF)` }, { status: 422 });
  }
  if (label.length > 150) {
    return Response.json({ error: "Description trop longue" }, { status: 422 });
  }

  const token = process.env.CAMPAY_API_TOKEN;
  if (!token) {
    console.error("[campay-collect] CAMPAY_API_TOKEN manquant");
    return Response.json({ error: "Paiement automatique non configuré" }, { status: 503 });
  }

  const baseUrl = process.env.CAMPAY_BASE_URL ?? "https://campay.net";
  const fullPhone = phone.startsWith("237") ? phone : `237${phone}`;

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
        from: fullPhone,
        description: label.trim(),
        external_reference: externalReference,
      }),
    });

    const data = await campayRes.json();
    console.log(`[campay-collect] ${campayRes.status} — ${operator} ${fullPhone} | ${amount} XAF | ref=${externalReference}`);
    return Response.json(data, { status: campayRes.status });
  } catch (err) {
    console.error("[campay-collect] Erreur réseau:", err);
    return Response.json({ error: "Erreur connexion Campay" }, { status: 502 });
  }
}
