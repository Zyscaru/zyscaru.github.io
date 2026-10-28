const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const vm = require('node:vm');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const importar = relative => import(pathToFileURL(path.join(ROOT, relative)));

function storage(values = {}) {
  globalThis.localStorage = {
    getItem(key) { return Object.hasOwn(values, key) ? JSON.stringify(values[key]) : null; },
    setItem(key, value) { values[key] = JSON.parse(value); },
  };
  return values;
}

test('portal calcula o progresso salvo sem alterar os dados dos alunos', async () => {
  const values = storage({ 'csql:done': ['select', 'where'], 'va:stars': { a: 3, b: 2, c: 0 } });
  const before = JSON.stringify(values);
  const { progresso } = await importar('assets/js/progresso.js');
  assert.deepEqual(progresso({ prefixo: 'csql:', modo: 'licoes', total: 4 }), { feitas: 2, estrelas: 0, pct: 50 });
  assert.deepEqual(progresso({ prefixo: 'va:', modo: 'estrelas', total: 4 }), { feitas: 2, estrelas: 5, pct: 50 });
  assert.equal(JSON.stringify(values), before);
});

test('progresso respeita o total do catálogo e trata ausência de dados', async () => {
  storage({ 'csql:done': ['a', 'b', 'c'] });
  const { progresso } = await importar('assets/js/progresso.js');
  assert.deepEqual(progresso({ prefixo: 'csql:', modo: 'licoes', total: 2 }), { feitas: 2, estrelas: 0, pct: 100 });
  assert.deepEqual(progresso({ prefixo: 'ff:', modo: 'estrelas', total: 18 }), { feitas: 0, estrelas: 0, pct: 0 });
});

test('preferências do portal não sobrescrevem o progresso dos apps', async () => {
  const values = storage({ 'csql:done': ['select'] });
  const { ler, gravar } = await importar('assets/js/storage.js');
  gravar('cg:aba', 'sql');
  assert.equal(ler('cg:aba', null), 'sql');
  assert.deepEqual(values['csql:done'], ['select']);
});

test('portal tolera armazenamento bloqueado ou JSON inválido', async () => {
  const { ler, gravar } = await importar('assets/js/storage.js');
  globalThis.localStorage = { getItem() { return '{'; }, setItem() { throw new Error('Bloqueado'); } };
  assert.deepEqual(ler('cjs:done', []), []);
  assert.doesNotThrow(() => gravar('cg:aba', 'sql'));
  globalThis.localStorage.getItem = () => { throw new Error('Bloqueado'); };
  assert.equal(ler('cg:aba', 'python'), 'python');
});

test('todos os recursos locais do portal estão disponíveis no cache offline', async () => {
  const context = vm.createContext({ URL, self: { registration: { scope: 'https://zyscaru.github.io/' }, addEventListener() {} } });
  vm.runInContext(readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), context);
  const cached = new Set(vm.runInContext('ARQUIVOS', context));
  for (const resource of cached) {
    assert.ok(existsSync(path.join(ROOT, resource)), `Recurso inexistente: ${resource}`);
  }
  const html = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const resources = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  for (const resource of resources.filter(value => !/^(https?:|#)/.test(value))) {
    assert.ok(cached.has(resource), `Recurso do HTML fora do cache: ${resource}`);
  }
  for (const relative of ['assets/js/main.js', 'assets/js/portal.js', 'assets/js/pwa.js', 'assets/js/progresso.js', 'assets/js/storage.js', 'dados/apps.js']) {
    const source = readFileSync(path.join(ROOT, relative), 'utf8');
    assert.ok(cached.has(relative), `Módulo fora do cache: ${relative}`);
    for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const imported = path.posix.normalize(path.posix.join(path.posix.dirname(relative), match[1]));
      assert.ok(cached.has(imported), `Importação fora do cache: ${imported}`);
    }
  }
  const { APPS, ICONES } = await importar('dados/apps.js');
  assert.equal(new Set(APPS.map(app => app.id)).size, APPS.length);
  assert.equal(new Set(APPS.map(app => app.prefixo)).size, APPS.length);
  for (const app of APPS) {
    assert.ok(cached.has(ICONES[app.id]), `Ícone fora do cache: ${app.id}`);
    const png = readFileSync(path.join(ROOT, ICONES[app.id]));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
  }
});
