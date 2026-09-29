// Builds dist/legend-of-jrma.html: one self-contained file (content scripts inlined)
// that can be emailed, texted, or opened on a phone with no server.
// Run: npm run bundle
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let html = readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/<script src="(content\/[a-z-]+\.js)"><\/script>/g, (_, src) => {
  const js = readFileSync(path.join(root, src), 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script>\n/* inlined from ${src} */\n${js}</script>`;
});
if (/<script src="content\//.test(html)) throw new Error('A content script was not inlined.');
mkdirSync(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist', 'legend-of-jrma.html');
writeFileSync(out, html);
console.log(`Wrote ${path.relative(root, out)} (${(html.length / 1024).toFixed(0)} KB)`);
