// ── Protection des routes internes ───────────────────────────────────────────
// INTERNAL_API_SECRET (optionnel) verrouille les endpoints appelés en interne :
//   • appels serveur → header  x-internal-secret: <secret>
//   • appels navigateur de même origine (Origin / Referer) → autorisés
// Si le secret n'est pas configuré, le comportement reste inchangé (ouvert).

export function getInternalSecret(): string | null {
  return process.env.INTERNAL_API_SECRET?.trim() || null;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function hostOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

/** Vérifie qu'une requête peut appeler un endpoint interne. */
export function isAuthorizedInternal(req: Request): boolean {
  const secret = getInternalSecret();
  if (!secret) return true;

  const provided = req.headers.get("x-internal-secret");
  if (provided && safeEqual(provided, secret)) return true;

  const requestHost = req.headers.get("host") ?? hostOf(req.url);
  const originHost = hostOf(req.headers.get("origin"));
  if (requestHost && originHost && originHost === requestHost) return true;

  const refererHost = hostOf(req.headers.get("referer"));
  if (requestHost && refererHost && refererHost === requestHost) return true;

  return false;
}

/** Réponse 401 standardisée. */
export function unauthorized(): Response {
  return Response.json({ error: "Non autorisé" }, { status: 401 });
}

/** Rate limit mémoire simple (par instance) — protège les endpoints publics. */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
}
