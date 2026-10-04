// Bundles the app into ONE self-contained HTML file (three.js included), so it
// opens offline by double-clicking: dist/heart-conduction-lab.html
//
//   npm run build                 build once
//   npm run dev                   rebuild on every change
//   node scripts/build.mjs --fragment out.html
//                                 also write a body-only copy for hosts that
//                                 supply their own <html>/<head> wrapper
import * as esbuild from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'dist/heart-conduction-lab.html');
const args = process.argv.slice(2);
const fragmentPath = args.includes('--fragment') ? resolve(args[args.indexOf('--fragment') + 1]) : null;

// Keep inline script from closing its own <script> tag early.
const safeScript = (js) => js.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');

async function assemble(js) {
  const [html, css] = await Promise.all([
    readFile(resolve(root, 'src/index.html'), 'utf8'),
    readFile(resolve(root, 'src/css/styles.css'), 'utf8'),
  ]);
  const page = html
    .replace('<!-- @styles -->', () => `<style>\n${css}</style>`)
    .replace('<!-- @script -->', () => `<script>${safeScript(js)}</script>`);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, page);
  if (fragmentPath) {
    const head = page.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta (charset|name="viewport")[^>]*>\n?/g, '');
    const body = page.match(/<body>([\s\S]*)<\/body>/)[1];
    await writeFile(fragmentPath, `${head.trim()}\n${body.trim()}\n`);
  }
  console.log(`built ${out} (${(page.length / 1024).toFixed(0)} KB)`);
}

const options = {
  entryPoints: [resolve(root, 'src/js/main.js')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  write: false,
  legalComments: 'none',
};

if (args.includes('--watch')) {
  const ctx = await esbuild.context({
    ...options,
    plugins: [
      {
        name: 'inline-html',
        setup(build) {
          build.onEnd(async (r) => {
            if (!r.errors.length) await assemble(r.outputFiles[0].text);
          });
        },
      },
    ],
  });
  await ctx.watch();
  console.log('watching src/ ... (CSS and HTML changes: touch a .js file or rerun)');
} else {
  const r = await esbuild.build(options);
  await assemble(r.outputFiles[0].text);
}
