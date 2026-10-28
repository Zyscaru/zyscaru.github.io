/* Guarda o app no aparelho para funcionar sem internet.
   Ao publicar uma atualização, aumente o número da VERSAO. */
const PREFIXO_CACHE = "voodaabelha-";
const VERSAO = `${PREFIXO_CACHE}v4`;
const ARQUIVOS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(
        nomes
          .filter((n) => n.startsWith(PREFIXO_CACHE) && n !== VERSAO)
          .map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Fontes do Google: usa a cópia guardada e atualiza em segundo plano
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open("fontes").then((c) =>
        c.match(req).then((guardada) => {
          const rede = fetch(req).then((r) => { c.put(req, r.clone()); return r; }).catch(() => guardada);
          return guardada || rede;
        })
      )
    );
    return;
  }

  // Arquivos do próprio app: primeiro a internet (para pegar atualizações), sem internet usa a cópia
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req)
        .then((r) => { const copia = r.clone(); caches.open(VERSAO).then((c) => c.put(req, copia)); return r; })
        .catch(() => caches.match(req).then((r) => r || (req.mode === "navigate" ? caches.match("index.html") : undefined)))
    );
  }
});
