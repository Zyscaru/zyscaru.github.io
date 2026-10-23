/* Guarda só a página inicial da plataforma. Os apps das subpastas têm o próprio cache. */
const VERSAO = "portal-v3";
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon.png"];
const PROPRIOS = new Set(ARQUIVOS.map(a => new URL(a, self.registration.scope).href));
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ns => Promise.all(ns.filter(n => n.startsWith("portal-") && n !== VERSAO).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || !PROPRIOS.has(req.url.split("#")[0].split("?")[0])) return;
  e.respondWith(fetch(req).then(r => { const copia = r.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); return r; }).catch(() => caches.match(req)));
});
