import { NextRequest } from "next/server";

export const runtime = "edge";

function authOk(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value ?? "";
  const secret = process.env.ADMIN_PASSWORD ?? "chreolempire-admin";
  return token === secret;
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!authOk(req)) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const apiToken = process.env.VERCEL_API_TOKEN;
  const teamId   = process.env.VERCEL_TEAM_ID ?? "team_mwfMQ1xddxicx5gsbfL3MP7G";
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!apiToken) {
    return Response.json({ error: "VERCEL_API_TOKEN non configuré", configured: false }, { status: 200 });
  }

  const now  = new Date();
  const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 derniers jours

  try {
    const headers = { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" };

    const [pagesRes, eventsRes] = await Promise.allSettled([
      fetch(`https://vercel.com/api/web-analytics/timeseries?teamId=${teamId}${projectId ? `&projectId=${projectId}` : ""}&from=${from.toISOString()}&to=${now.toISOString()}&granularity=day`, { headers }),
      fetch(`https://vercel.com/api/web-analytics/events?teamId=${teamId}${projectId ? `&projectId=${projectId}` : ""}&from=${from.toISOString()}&to=${now.toISOString()}&limit=10`, { headers }),
    ]);

    const pages  = pagesRes.status  === "fulfilled" && pagesRes.value.ok  ? await pagesRes.value.json()  : null;
    const events = eventsRes.status === "fulfilled" && eventsRes.value.ok ? await eventsRes.value.json() : null;

    return Response.json({ configured: true, pages, events });
  } catch {
    return Response.json({ configured: true, error: "Erreur Vercel API" }, { status: 502 });
  }
}
