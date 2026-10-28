import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.md': 'text/plain; charset=utf-8',
};

export function criarServidor(root = ROOT) {
  return http.createServer((request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405).end();
      return;
    }
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const candidate = path.resolve(root, '.' + pathname);
      const relative = path.relative(root, candidate);
      if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(part => part.startsWith('.'))) {
        response.writeHead(403).end();
        return;
      }
      let file = candidate;
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.statSync(file).isFile()) throw new Error('Arquivo ausente');
      response.writeHead(200, {
        'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      if (request.method === 'HEAD') response.end();
      else fs.createReadStream(file).pipe(response);
    } catch {
      response.writeHead(404).end('Arquivo não encontrado.');
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  criarServidor().listen(4173, '127.0.0.1', () => {
    console.log('Prévia: http://127.0.0.1:4173 — encerre com Ctrl+C.');
  });
}
