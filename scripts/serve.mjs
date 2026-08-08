import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'docs');
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function safePath(url) {
  const clean = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const requested = clean === '/' ? '/index.html' : clean;
  const filePath = normalize(join(root, requested));
  return filePath.startsWith(root) ? filePath : null;
}

createServer((req, res) => {
  const filePath = safePath(req.url || '/');
  if (!filePath || !existsSync(filePath)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found. The Snorlax ate it.');
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
}).listen(port, () => {
  console.log(`PokeChamPrep running at http://localhost:${port}`);
});
