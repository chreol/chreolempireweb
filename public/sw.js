const CACHE_NAME = "chreol-public-v1";
const OFFLINE_URL = "/offline.html";
const PUBLIC_PAGES = ["/", "/services", "/services/cartes-cadeaux", "/services/crypto", "/services/transfert", "/blog", "/paiement", OFFLINE_URL];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PUBLIC_PAGES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin") || url.pathname.startsWith("/cart") || url.pathname.startsWith("/checkout") || url.pathname.startsWith("/confirmer-paiement")) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok && (request.mode === "navigate" || url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/assets/"))) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then(cached => cached || (request.mode === "navigate" ? caches.match(OFFLINE_URL) : Response.error()))),
  );
});
