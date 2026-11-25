import bcrypt from "bcryptjs";

const ROW_ID = "shop";

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return { url, key };
}

export async function readPasswordHash(): Promise<string | null> {
  const { url, key } = supabase();
  if (!url || !key) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/admin_auth?id=eq.${ROW_ID}&select=password_hash&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) return null;
    const rows = await res.json() as Array<{ password_hash?: string }>;
    const hash = rows?.[0]?.password_hash;
    return typeof hash === "string" && hash.startsWith("$2") ? hash : null;
  } catch {
    return null;
  }
}

/** Vérifie le mot de passe admin. Hash en base s'il existe, sinon le secret d'environnement. */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const stored = await readPasswordHash();
  if (stored) return bcrypt.compare(password, stored);
  const env = process.env.ADMIN_PASSWORD?.trim() || "";
  if (!env) return false;
  const bootstrap = await bcrypt.hash(env, 10);
  return bcrypt.compare(password, bootstrap);
}

export async function savePasswordHash(passwordHash: string): Promise<string | null> {
  const { url, key } = supabase();
  if (!url || !key) {
    return "SUPABASE_SERVICE_KEY manquant : le hash ne peut pas être enregistré.";
  }
  try {
    const res = await fetch(`${url}/rest/v1/admin_auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ id: ROW_ID, password_hash: passwordHash }),
    });
    if (res.ok) return null;
    const detail = await res.text();
    console.error("[admin/password] supabase", res.status, detail.slice(0, 300));
    if (res.status === 404 || detail.includes("admin_auth")) {
      return "Table admin_auth absente. Créez-la dans Supabase (id text primary key, password_hash text not null), puis réessayez.";
    }
    return "Mise à jour du mot de passe impossible.";
  } catch {
    return "Mise à jour du mot de passe impossible.";
  }
}
