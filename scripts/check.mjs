import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (/<style\b/i.test(html) || /<script(?:\s[^>]*)?>\s*[^<\s]/i.test(html)) {
  throw new Error('Mantenha os estilos e scripts do portal em assets/.');
}

// Garante que a navegação entre os documentos locais continua utilizável.
for (const relative of ['AGENTS.md', 'README.md', 'CONTRIBUTING.md', 'docs/codigo-em-jogo-contexto-e-branches.md']) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const reference = match[1];
    if (/^(https?:|#)/.test(reference)) continue;
    const target = path.resolve(root, path.dirname(relative), reference.split('#')[0]);
    if (!target.startsWith(root) || !fs.existsSync(target)) throw new Error(`${relative}: link local inválido: ${reference}`);
  }
}

const tests = fs.readdirSync(path.join(root, 'tests')).filter(name => name.endsWith('.test.cjs')).map(name => `tests/${name}`);
const result = spawnSync(process.execPath, ['--test', ...tests], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
if (!process.exitCode) console.log('Portal, documentação e testes verificados. Não há etapa de build.');
