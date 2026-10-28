/* Guarda só a página inicial da plataforma. Os apps das subpastas têm o próprio cache. */
const VERSAO = "portal-v5";
const ARQUIVOS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/apple-touch-icon.png",
  "icons/favicon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "assets/css/base.css",
  "assets/css/portal.css",
  "dados/apps.js",
  "assets/js/main.js",
  "assets/js/portal.js",
  "assets/js/progresso.js",
  "assets/js/pwa.js",
  "assets/js/storage.js",
  "assets/images/apps/aeroporto-horizonte.png",
  "assets/images/apps/base-amazonia.png",
  "assets/images/apps/caderno-java.png",
  "assets/images/apps/caderno-javascript.png",
  "assets/images/apps/caderno-python.png",
  "assets/images/apps/caderno-sql.png",
  "assets/images/apps/estacao-kepler.png",
  "assets/images/apps/expedicao-abissal.png",
  "assets/images/apps/ferrovia-do-futuro.png",
  "assets/images/apps/forja-real.png",
  "assets/images/apps/missao-europa.png",
  "assets/images/apps/misterio-no-museu.png",
  "assets/images/apps/protocolo-neon.png",
  "assets/images/apps/robo-py.png",
  "assets/images/apps/rover-marte.png",
  "assets/images/apps/voo-da-abelha.png"
];
const PROPRIOS = new Set(ARQUIVOS.map(arquivo => new URL(arquivo, self.registration.scope).href));

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(VERSAO)
      .then(cache => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(
        nomes.filter(nome => nome.startsWith("portal-") && nome !== VERSAO)
          .map(nome => caches.delete(nome))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", evento => {
  const pedido = evento.request;
  const url = pedido.url.split("#")[0].split("?")[0];
  if (pedido.method !== "GET" || !PROPRIOS.has(url)) return;

  evento.respondWith(
    fetch(pedido)
      .then(resposta => {
        const copia = resposta.clone();
        caches.open(VERSAO).then(cache => cache.put(pedido, copia));
        return resposta;
      })
      .catch(() => caches.match(pedido))
  );
});
