export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("ref");

  if (!reference || !/^[\w-]+$/.test(reference)) {
    return Response.json({ error: "ref invalide" }, { status: 400 });
  }

  const token = process.env.CAMPAY_API_TOKEN;
  if (!token) {
    return Response.json({ error: "non configuré" }, { status: 503 });
  }

  const baseUrl = process.env.CAMPAY_BASE_URL ?? "https://campay.net";

  try {
    const res = await fetch(`${baseUrl}/api/transaction/${reference}/`, {
      headers: { Authorization: `Token ${token}` },
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: "Erreur réseau Campay" }, { status: 502 });
  }
}
