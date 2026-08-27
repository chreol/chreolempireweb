const TOKEN_TTL_SECONDS = 24 * 60 * 60;

function encode(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return encode(String.fromCharCode(...new Uint8Array(signature)));
}

export async function createAdminToken(secret: string): Promise<string> {
  const payload = encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS }));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifyAdminToken(token: string, secret: string): Promise<boolean> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    const data = JSON.parse(decode(payload)) as { exp?: number };
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return false;
    const expected = await sign(payload, secret);
    return expected === signature;
  } catch {
    return false;
  }
}

export function getAdminSecret(): string | null {
  return process.env.ADMIN_PASSWORD?.trim() || null;
}
