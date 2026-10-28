/**
 * Минимальный статический сервер для локальной проверки статического экспорта.
 * Без зависимостей: node scripts/preview.mjs [порт]
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'out');
const port = Number(process.argv[2] ?? 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  const candidates = [join(root, normalize(pathname)), join(root, normalize(pathname), 'index.html')];
  const filePath = candidates.find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  );

  if (!filePath) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('404');
    return;
  }

  response.writeHead(200, {
    'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
  console.log(`preview: http://localhost:${port}  (root: ${root})`);
});
