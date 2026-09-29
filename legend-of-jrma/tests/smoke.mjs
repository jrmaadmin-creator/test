// Smoke test: validates content, then plays every call and trial in Chromium.
// Run: npm test   (screenshots go to $SHOTS_DIR if set)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shots = process.env.SHOTS_DIR;
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

/* ---------- 1. Static content checks ---------- */
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ['content/calls.js', 'content/exams.js']) vm.runInContext(readFileSync(path.join(root, f), 'utf8'), sandbox);
const { CALLS, EXAMS, PEARLS, LEVELS, ORDER } = sandbox.window.JRMA;
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const npcIds = new Set([...html.matchAll(/\{ id: '([a-z0-9]+)', name:/g)].map((m) => m[1]));
const ids = new Set([...CALLS.map((c) => c.id), ...Object.keys(EXAMS)]);

check(LEVELS.length === 3, 'expected 3 levels');
for (const id of ORDER) check(ids.has(id), `ORDER references unknown id ${id}`);
for (const c of CALLS) {
  const where = `call ${c.id}`;
  for (const f of ['npc', 'loc', 'dir', 'title', 'domain', 'dispatch', 'scene', 'urgent', 'after', 'outro']) check(typeof c[f] === 'string' && c[f], `${where}: missing ${f}`);
  check(npcIds.has(c.npc), `${where}: npc ${c.npc} not defined in index.html`);
  check([0, 1, 2].includes(c.tier), `${where}: bad tier`);
  const groups = [...new Set(c.steps.map((s) => s.g))].sort((a, b) => a - b);
  check(groups.every((g, i) => g === i), `${where}: step groups must run 0..n with no gaps`);
  for (const s of c.steps) {
    check(s.label && s.why && s.hint, `${where}: step missing label/why/hint (${s.label})`);
    if (s.g > 0) check(!!s.early, `${where}: step "${s.label}" needs an "early" message`);
  }
  for (const w of c.wrong) check([0, 1, 2].includes(w.sev) && w.why, `${where}: bad wrong option (${w.label})`);
  check(Array.isArray(c.nh) && c.nh.length, `${where}: missing nh topics`);
  check(c.nh.some((x) => /\(\d+\.\d+[AP]?\)/.test(x)), `${where}: nh must cite at least one NH PCP section number`);
  check(!/—/.test(JSON.stringify(c)), `${where}: contains an em dash`);
}
for (const e of Object.values(EXAMS)) {
  check(npcIds.has(e.npc), `exam ${e.id}: npc missing`);
  check(e.bank.length >= e.count, `exam ${e.id}: bank smaller than count`);
  e.bank.forEach((q, i) => {
    check(Number.isInteger(q.a) && q.a >= 0 && q.a < q.c.length, `exam ${e.id} q${i + 1}: answer index out of range`);
    check(q.why && q.nh, `exam ${e.id} q${i + 1}: missing why/nh`);
    check(new Set(q.c).size === q.c.length, `exam ${e.id} q${i + 1}: duplicate choices`);
    check(q.verified === true, `exam ${e.id} q${i + 1}: not verified against NH PCP`);
    check(/\(\d+\.\d+[AP]?\)|Not in NH PCP|Not detailed in NH PCP|Appendix/.test(q.nh), `exam ${e.id} q${i + 1}: nh must cite a section or say it is not in NH PCP`);
  });
}
check(Object.keys(PEARLS).length === 8, 'expected 8 pearls');

/* ---------- 2. Play the game ---------- */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() !== 'error') return;
  if (/fonts\.(googleapis|gstatic)\.com/.test(m.location().url || '')) return; // fonts may be offline in CI
  errors.push(`console: ${m.text()}`);
});
await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
await page.waitForFunction(() => window.__jrma && window.__jrma.mode === 'title');
if (shots) await page.screenshot({ path: `${shots}/01-title.png` });

await page.click('#btn-new');
for (let i = 0; i < 12 && (await page.evaluate(() => window.__jrma.mode)) === 'dialog'; i++) { await page.keyboard.press('Space'); await page.waitForTimeout(40); await page.keyboard.press('Space'); await page.waitForTimeout(40); }
check((await page.evaluate(() => window.__jrma.mode)) === 'world', 'intro dialog did not return to the world');
if (shots) await page.screenshot({ path: `${shots}/02-world.png` });

// Walk a few steps to exercise movement and collision.
await page.keyboard.down('ArrowRight'); await page.waitForTimeout(300); await page.keyboard.up('ArrowRight');

// A wrong answer must cost hearts.
await page.evaluate(() => window.__jrma.startObjective('bleed'));
await page.click('#b-actions button');
const heartsLost = await page.evaluate(() => {
  const B = window.__jrma.battle, before = B.hearts;
  const idx = B.opts.findIndex((o) => o.kind === 'wrong' && o.sev > 0);
  window.__jrma.choose(idx);
  return before - window.__jrma.battle.hearts;
});
check(heartsLost >= 1, 'a harmful choice did not cost a heart');

async function playCall(id) {
  await page.evaluate((x) => window.__jrma.startObjective(x), id);
  await page.click('#b-actions button');
  for (let guard = 0; guard < 40; guard++) {
    const state = await page.evaluate(() => {
      const B = window.__jrma.battle;
      if (B.won) return { done: true };
      const left = B.call.steps.map((s, i) => ({ s, i })).filter((x) => !B.used.has(x.i));
      const g = Math.min(...left.map((x) => x.s.g));
      const idx = B.opts.findIndex((o) => o.kind === 'step' && !B.used.has(o.i) && o.g === g);
      return { idx, mini: B.opts[idx].mini ? B.opts[idx].mini.type : null, need: B.opts[idx].mini ? B.opts[idx].mini.need : 0 };
    });
    if (state.done) break;
    await page.evaluate((i) => window.__jrma.choose(i), state.idx);
    if (state.mini === 'mash') for (let k = 0; k < state.need; k++) await page.evaluate(() => window.__jrma.miniTap());
    if (state.mini === 'rhythm') for (let k = 0; k < 12; k++) { await page.evaluate(() => window.__jrma.miniTap()); await page.waitForTimeout(540); }
  }
  return page.evaluate(() => window.__jrma.battle.won);
}
async function playExam(id) {
  await page.evaluate((x) => window.__jrma.startObjective(x), id);
  await page.click('#b-actions button');
  for (let guard = 0; guard < 20; guard++) {
    const done = await page.evaluate(() => {
      const B = window.__jrma.battle;
      if (B.qi >= B.qs.length) return true;
      window.__jrma.answer(B.qs[B.qi].ch.findIndex((c) => c.ok));
      return false;
    });
    if (done) break;
    await page.click('#b-actions button');
  }
  return page.evaluate(() => window.__jrma.battle.won);
}

for (const id of ORDER) {
  const isExam = !!EXAMS[id];
  const won = isExam ? await playExam(id) : await playCall(id);
  check(won, `${id}: could not be completed with the correct answers`);
  if (shots && (id === 'bleed' || id === 'trial-emt' || id === 'rollover')) await page.screenshot({ path: `${shots}/03-${id}.png` });
}
const saved = await page.evaluate(() => window.__jrma.save.done);
check(ORDER.every((id) => saved.includes(id)), 'not every objective was recorded as done');
check((await page.textContent('#hud-license')).includes('Legend'), 'HUD did not show the Legend title at the end');

// Phone width layout: no horizontal scroll.
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.__jrma.startObjective('stemi', true));
await page.click('#b-actions button');
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 0, `page scrolls sideways at 390px (${overflow}px)`);
if (shots) await page.screenshot({ path: `${shots}/04-phone-battle.png`, fullPage: true });

await browser.close();
failures.push(...errors);

if (failures.length) {
  console.error(`FAIL (${failures.length})\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`PASS: ${CALLS.length} calls, ${Object.keys(EXAMS).length} trials (${Object.values(EXAMS).reduce((n, e) => n + e.bank.length, 0)} questions), full playthrough, phone layout.`);
