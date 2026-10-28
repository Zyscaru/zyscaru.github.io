const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://zyscaru.github.io";
const APPS = [
  { folder: "", prefix: "portal-", name: "portal" },
  { folder: "caderno-javascript", prefix: "cadernojs-" },
  { folder: "voo-da-abelha", prefix: "voodaabelha-" },
  { folder: "ferrovia-do-futuro", prefix: "ferrovia-" },
  { folder: "estacao-kepler", prefix: "kepler-" },
  { folder: "caderno-sql", prefix: "cadernosql-" },
  { folder: "misterio-no-museu", prefix: "museu-" },
  { folder: "aeroporto-horizonte", prefix: "aeroporto-" },
  { folder: "base-amazonia", prefix: "amazonia-" },
];

// O armazenamento é compartilhado por todos os workers da mesma origem.
// As URLs relativas são resolvidas no contexto do worker que usa a API.
function createWorker(app, storage) {
  const baseURL = `${ORIGIN}/${app.folder ? `${app.folder}/` : ""}`;
  const handlers = new Map();
  let claimed = false;
  const requestURL = (request) => new URL(
    typeof request === "string" ? request : request.url,
    baseURL,
  ).href;
  const cacheAPI = {
    async open(name) {
      if (!storage.has(name)) storage.set(name, new Map());
      const entries = storage.get(name);
      return {
        async addAll(urls) {
          for (const url of urls) {
            const absoluteURL = requestURL(url);
            entries.set(absoluteURL, new Response(`precache:${absoluteURL}`));
          }
        },
        async put(request, response) {
          entries.set(requestURL(request), response.clone());
        },
        async match(request) {
          return entries.get(requestURL(request))?.clone();
        },
      };
    },
    async keys() {
      return [...storage.keys()];
    },
    async delete(name) {
      return storage.delete(name);
    },
    async match(request) {
      for (const entries of storage.values()) {
        const response = entries.get(requestURL(request));
        if (response) return response.clone();
      }
    },
  };
  const context = vm.createContext({
    URL,
    caches: cacheAPI,
    // A instalação é simulada por addAll; as requisições seguintes estão offline.
    fetch: async () => { throw new Error("Sem rede"); },
    self: {
      location: { origin: ORIGIN },
      registration: { scope: baseURL },
      addEventListener(type, handler) { handlers.set(type, handler); },
      skipWaiting: async () => {},
      clients: { claim: async () => { claimed = true; } },
    },
  });
  const filename = path.join(ROOT, app.folder, "sw.js");
  vm.runInContext(readFileSync(filename, "utf8"), context, { filename });

  return {
    async lifecycle(type) {
      let completion;
      handlers.get(type)({ waitUntil(promise) { completion = promise; } });
      assert.ok(completion, `${type} deve aguardar a operação de cache`);
      await completion;
    },
    async offlinePage() {
      let response;
      handlers.get("fetch")({
        request: { method: "GET", url: `${baseURL}index.html`, mode: "navigate" },
        respondWith(promise) { response = promise; },
      });
      assert.ok(response, "o worker deve responder à navegação offline");
      const result = await response;
      assert.ok(result, `a página de ${app.name || app.folder} deve continuar no cache`);
      assert.equal(await result.text(), `precache:${baseURL}index.html`);
    },
    get claimed() { return claimed; },
  };
}

for (const target of APPS) {
  test(`${target.name || target.folder}: limpa versões antigas e preserva os demais caches`, async () => {
    const storage = new Map();
    const workers = new Map();
    for (const app of APPS) {
      storage.set(`${app.prefix}v0`, new Map());
      storage.set(`${app.prefix}v1`, new Map());
      const worker = createWorker(app, storage);
      workers.set(app, worker);
      await worker.lifecycle("install");
    }
    storage.set("fontes", new Map());
    storage.set("outra-aplicacao-v1", new Map());
    // Um nome parecido, mas fora do prefixo delimitado do app, também é alheio.
    storage.set(`${target.prefix.slice(0, -1)}backup-v1`, new Map());
    const expected = [...storage.keys()].filter(
      (name) => name !== `${target.prefix}v0` && name !== `${target.prefix}v1`,
    ).sort();

    const worker = workers.get(target);
    await worker.lifecycle("activate");

    assert.deepEqual([...storage.keys()].sort(), expected);
    assert.equal(worker.claimed, true, "o worker deve assumir os clientes após a limpeza");
    for (const installed of workers.values()) await installed.offlinePage();
  });
}

for (const [name, apps] of [["normal", APPS], ["inversa", [...APPS].reverse()]]) {
  test(`ativação em ordem ${name}: todos os apps instalados continuam disponíveis offline`, async () => {
    const storage = new Map([["fontes", new Map()], ["outra-aplicacao-v1", new Map()]]);
    const installed = [];

    for (const app of apps) {
      const worker = createWorker(app, storage);
      await worker.lifecycle("install");
      await worker.lifecycle("activate");
      installed.push(worker);
      for (const previous of installed) await previous.offlinePage();
    }

    assert.ok(storage.has("fontes"));
    assert.ok(storage.has("outra-aplicacao-v1"));
  });
}
