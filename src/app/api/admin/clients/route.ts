import { NextRequest } from "next/server";
import { getAdminSecret, verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "edge";

async function authOk(req: NextRequest) {
  const secret = getAdminSecret();
  return Boolean(secret && await verifyAdminToken(req.cookies.get("admin_token")?.value ?? "", secret));
}
function sbKey() { return process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""; }

interface OrderRow {
  client_email: string | null;
  client_name: string | null;
  client_phone: string | null;
  total: number | null;
  status: string | null;
  created_at: string | null;
}

interface Client {
  key: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  doneOrders: number;
  totalSpent: number;
  points: number;
  tier: string;
  lastOrder: string | null;
}

// 1 point par 500 FCFA dépensé (commandes traitées uniquement)
const POINTS_PER_FCFA = 500;

function tierOf(spent: number): string {
  if (spent >= 200000) return "Or";
  if (spent >= 50000)  return "Argent";
  return "Bronze";
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!(await authOk(req))) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = sbKey();
  if (!url) return Response.json({ clients: [] });

  const res = await fetch(
    `${url}/rest/v1/orders?select=client_email,client_name,client_phone,total,status,created_at&order=created_at.desc&limit=2000`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );
  const rows: OrderRow[] = await res.json();
  if (!Array.isArray(rows)) return Response.json({ clients: [] });

  const map = new Map<string, Client>();

  for (const o of rows) {
    const k = (o.client_email || o.client_phone || "").toLowerCase().trim();
    if (!k) continue;

    const existing = map.get(k) ?? {
      key: k,
      name:  o.client_name  ?? "Client",
      email: o.client_email ?? "",
      phone: o.client_phone ?? "",
      orders: 0, doneOrders: 0, totalSpent: 0, points: 0, tier: "Bronze",
      lastOrder: o.created_at,
    };

    existing.orders += 1;
    if (o.status === "done") {
      existing.doneOrders += 1;
      existing.totalSpent += o.total ?? 0;
    }
    if (!existing.email && o.client_email) existing.email = o.client_email;
    if (!existing.phone && o.client_phone) existing.phone = o.client_phone;
    if (o.created_at && (!existing.lastOrder || o.created_at > existing.lastOrder)) existing.lastOrder = o.created_at;

    map.set(k, existing);
  }

  const clients = Array.from(map.values())
    .map(c => ({ ...c, points: Math.floor(c.totalSpent / POINTS_PER_FCFA), tier: tierOf(c.totalSpent) }))
    .sort((a, b) => b.totalSpent - a.totalSpent);

  const stats = {
    totalClients:  clients.length,
    totalRevenue:  clients.reduce((s, c) => s + c.totalSpent, 0),
    avgBasket:     clients.length ? Math.round(clients.reduce((s, c) => s + c.totalSpent, 0) / Math.max(1, clients.reduce((s, c) => s + c.doneOrders, 0))) : 0,
    gold:          clients.filter(c => c.tier === "Or").length,
    silver:        clients.filter(c => c.tier === "Argent").length,
    bronze:        clients.filter(c => c.tier === "Bronze").length,
  };

  return Response.json({ clients, stats });
}
