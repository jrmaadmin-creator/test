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
for (const f of ['content/crew.js', 'content/scenes.js', 'content/calls.js', 'content/exams.js']) vm.runInContext(readFileSync(path.join(root, f), 'utf8'), sandbox);
const { CALLS, EXAMS, PEARLS, LEVELS, ORDER } = sandbox.window.JRMA;
const { CREW, SCENES } = sandbox.window.JRMA;
for (const k of ['chief', 'partner', 'trainer']) check(CREW[k] && CREW[k].name && CREW[k].look, `crew: missing ${k}`);
const allText = readFileSync(path.join(root, 'content/calls.js'), 'utf8') + readFileSync(path.join(root, 'content/exams.js'), 'utf8') + readFileSync(path.join(root, 'index.html'), 'utf8');
for (const m of allText.matchAll(/'[^'\n]*(?<!\$)\{([a-z]+)\}[^'\n]*'/g)) check(m[1] in CREW, `unknown role token {${m[1]}}`);
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const npcIds = new Set([...html.matchAll(/\{ id: '([a-z0-9]+)', name:/g)].map((m) => m[1]));
const ids = new Set([...CALLS.map((c) => c.id), ...Object.keys(EXAMS)]);

// Hands-on simulations: every stage must be playable and every hotspot must exist.
const NEEDS = {
  place: ['scene', 'targets'], hold: ['min', 'max', 'short', 'long', 'done'], dial: ['unit', 'min', 'max', 'step', 'ok', 'low', 'high', 'done'],
  order: ['items', 'done'], signal: ['wait', 'waiting', 'signal', 'go', 'early', 'done'], shock: ['done'], bagcpr: ['done'], pace: [],
  rhythm: [], windlass: ['halfTurns', 'secs', 'done'],
};
function checkSim(where, sim) {
  check(Array.isArray(sim.stages) && sim.stages.length, `${where}: sim has no stages`);
  sim.stages.forEach((g, i) => {
    const at = `${where} stage ${i + 1}`;
    check(g.type in NEEDS, `${at}: unknown stage type ${g.type}`);
    for (const f of NEEDS[g.type] || []) check(g[f] != null && g[f] !== '', `${at}: missing ${f}`);
    if (g.scene) check(!!SCENES[g.scene], `${at}: unknown scene ${g.scene}`);
    if (g.type === 'place') {
      for (const z of [...g.targets, ...(g.decoys || [])]) if (z !== '@prev') check(SCENES[g.scene] && SCENES[g.scene].zones[z], `${at}: unknown zone ${z}`);
      check(!g.items || g.items.length === g.targets.length, `${at}: items and targets differ in length`);
      check(!g.targets.includes('@prev') || i > 0, `${at}: @prev needs an earlier place stage`);
    }
    if (g.type === 'hold' && g.reps > 1 && g.every) check(g.fast && g.slow, `${at}: repeated hold needs fast and slow messages`);
    if (g.type === 'dial') check(g.ok[0] >= g.min && g.ok[1] <= g.max && g.ok[0] <= g.ok[1], `${at}: ok range outside the dial`);
  });
}
for (const [id, sc] of Object.entries(SCENES)) for (const [z, v] of Object.entries(sc.zones)) check(v.name && v.why && v.r > 0, `scene ${id} zone ${z}: needs name, why, r`);

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
  for (const st of c.steps.filter((x) => x.sim)) checkSim(`${where} "${st.label}"`, st.sim);
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

// Tourniquet by real gestures: drag the strap tab down, drag circles around the rod, tap the clip.
async function windlassByMouse() {
  const box = await page.locator('#tq-svg').boundingBox();
  const at = (x, y) => [box.x + (x * box.width) / 240, box.y + (y * box.height) / 200];
  await page.mouse.move(...at(84, 150)); await page.mouse.down();
  for (let y = 150; y <= 198; y += 4) await page.mouse.move(...at(84, y));
  await page.mouse.up();
  await page.mouse.move(...at(84 + 40, 100)); await page.mouse.down();
  for (let deg = 0; deg <= 540; deg += 10) { const r = (deg * Math.PI) / 180; await page.mouse.move(...at(84 + 40 * Math.cos(r), 100 + 40 * Math.sin(r))); }
  await page.mouse.up();
  await page.mouse.click(...at(49, 100));
}
async function windlassByKeys() {
  for (let k = 0; k < 4; k++) await page.keyboard.press('ArrowDown');
  for (let k = 0; k < 18; k++) await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');
}
const sim = (a, b) => page.evaluate(([x, y]) => window.__jrma.sim(x, y), [a, b]);
const simInfo = () => page.evaluate(() => window.__jrma.simInfo());
async function svgAt(x, y) {
  const box = await page.locator('#sim-svg').boundingBox();
  return [box.x + (x * box.width) / 240, box.y + (y * box.height) / 200];
}
// Real pointer input for some place stages: drag the item, or tap the spot.
async function placeByMouse(info) {
  const to = await svgAt(info.want[0].x, info.want[0].y);
  if (info.tok) {
    await page.mouse.move(...(await svgAt(info.tok.x, info.tok.y))); await page.mouse.down();
    const from = await svgAt(info.tok.x, info.tok.y);
    for (let k = 1; k <= 10; k++) await page.mouse.move(from[0] + ((to[0] - from[0]) * k) / 10, from[1] + ((to[1] - from[1]) * k) / 10);
    await page.mouse.up();
  } else await page.mouse.click(...to);
}
let mode = { windlass: 'mouse', place: 'mouse' };
const mouseCalls = new Set(['od', 'ana', 'arrest']);
const probes = new Set(['ana', 'arrest']);
async function solveSim(callId) {
  let usedMouse = false;
  for (let guard = 0; guard < 80; guard++) {
    const info = await simInfo();
    if (!info) return;
    const s = info.s;
    if (info.type === 'place') {
      if (probes.has(callId) && callId === 'ana' && info.decoys.includes('orangeTip')) {
        // A wrong spot is a fumble, not a lost heart.
        probes.delete('ana');
        const before = await page.evaluate(() => ({ h: window.__jrma.battle.hearts, s: window.__jrma.battle.slips }));
        const z = SCENES.injector.zones.orangeTip;
        await page.mouse.click(...(await svgAt(z.x, z.y)));
        const after = await page.evaluate(() => ({ h: window.__jrma.battle.hearts, s: window.__jrma.battle.slips }));
        check(after.s === before.s + 1 && after.h === before.h, 'ana: a wrong spot in a simulation should count one fumble and cost no hearts');
      }
      if (mode.place === 'mouse' && mouseCalls.has(callId) && !usedMouse) { usedMouse = true; await placeByMouse(info); }
      else if (mode.place === 'keys' && !usedMouse) { usedMouse = true; await page.focus(`#sim-zones [data-zone="${info.want[0].id}"]`); await page.keyboard.press('Space'); }
      else await sim('place', info.want[0].id);
    } else if (info.type === 'hold') {
      const reps = s.reps || 1, held = ((s.min + s.max) / 2) * 1000;
      for (let r = 0; r < reps; r++) {
        await page.evaluate((h) => { const J = window.__jrma; J.sim('press'); J.sim('skip', h); J.sim('release'); }, held);
        if (s.every && r < reps - 1) await sim('skip', ((s.every[0] + s.every[1]) / 2) * 1000 - held);
      }
    } else if (info.type === 'dial') {
      await sim('dial', s.ok[0]); await sim('confirm');
    } else if (info.type === 'order') {
      for (let i = 0; i < s.items.length; i++) await sim('order', i);
    } else if (info.type === 'signal') {
      await sim('skip', s.wait[1] * 1000 + 50); await sim('go');
    } else if (info.type === 'shock') {
      if (probes.has(callId) && callId === 'arrest') {
        // Shocking before "clear" is a harmful fumble: it costs a heart.
        probes.delete('arrest');
        const h0 = await page.evaluate(() => window.__jrma.battle.hearts);
        await sim('shock', 'shock');
        check((await page.evaluate(() => window.__jrma.battle.hearts)) === h0 - 1, 'arrest: shocking without clearing should cost a heart');
      }
      if (s.charge) await sim('shock', 'charge');
      await sim('shock', 'clear'); await sim('skip', 900); await sim('shock', 'shock');
    } else if (info.type === 'bagcpr') {
      for (let b = 0; b < (s.breaths || 3); b++) await page.evaluate(() => { const J = window.__jrma; J.sim('skip', 545 * 9.5); J.sim('press'); J.sim('skip', 800); J.sim('release'); });
    } else if (info.type === 'pace') {
      await sim('pace', 40); await sim('confirm');
      const slipped = await page.evaluate(() => window.__jrma.simInfo() && window.__jrma.simInfo().slips);
      check(slipped === 1, 'brady: confirming capture at 40 mA should be a fumble (threshold is 60-90)');
      await sim('pace', 140); await sim('confirm');
    } else if (info.type === 'rhythm') {
      await page.evaluate(() => { const J = window.__jrma; for (let k = 0; k < 12; k++) { J.sim('tap'); J.sim('skip', 540); } });
    } else if (info.type === 'windlass') {
      await (mode.windlass === 'mouse' ? windlassByMouse() : windlassByKeys());
    }
    await page.waitForTimeout(20);
  }
  check(false, `${callId}: a simulation did not finish`);
}
let simsPlayed = 0;
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
      return { idx, sim: !!B.opts[idx].sim };
    });
    if (state.done) break;
    await page.evaluate((i) => window.__jrma.choose(i), state.idx);
    if (state.sim) { simsPlayed++; await solveSim(id); }
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
  if (id === 'bleed') mode.windlass = 'keys';
  check(won, `${id}: could not be completed with the correct answers`);
  if (shots && (id === 'bleed' || id === 'trial-emt' || id === 'rollover')) await page.screenshot({ path: `${shots}/03-${id}.png` });
}
const saved = await page.evaluate(() => window.__jrma.save.done);
check(ORDER.every((id) => saved.includes(id)), 'not every objective was recorded as done');
check((await page.textContent('#hud-license')).includes('Legend'), 'HUD did not show the Legend title at the end');
check(!/\{(chief|partner|trainer)\}/.test(await page.evaluate(() => document.body.innerText)), 'a role token was shown unreplaced');

check(simsPlayed === CALLS.reduce((n, c) => n + c.steps.filter((x) => x.sim).length, 0), `played ${simsPlayed} simulations, expected one per sim step`);
check(probes.size === 0, `probe checks did not run: ${[...probes].join(', ')}`);

// Tourniquet by keyboard (replay of the first call): Tab-and-Space placement, then arrow keys.
mode = { windlass: 'keys', place: 'keys' };
check(await playCall('bleed'), 'bleed: tourniquet could not be applied with the keyboard');

// Phone width layout: no horizontal scroll.
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.__jrma.startObjective('stemi', true));
await page.click('#b-actions button');
await page.evaluate(() => { const B = window.__jrma.battle; window.__jrma.choose(B.opts.findIndex((o) => o.kind === 'step' && o.g === 0)); });
await page.evaluate(() => { const B = window.__jrma.battle; window.__jrma.choose(B.opts.findIndex((o) => o.kind === 'step' && o.sim && o.g === 1)); });
check(!!(await simInfo()), 'stemi: 12-lead simulation did not open at phone width');
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 0, `page scrolls sideways at 390px (${overflow}px)`);
if (shots) await page.screenshot({ path: `${shots}/04-phone-battle.png`, fullPage: true });

await browser.close();
failures.push(...errors);

if (failures.length) {
  console.error(`FAIL (${failures.length})\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`PASS: ${CALLS.length} calls, ${CALLS.reduce((n, c) => n + c.steps.filter((x) => x.sim).length, 0)} hands-on simulations, ${Object.keys(EXAMS).length} trials (${Object.values(EXAMS).reduce((n, e) => n + e.bank.length, 0)} questions), full playthrough, phone layout.`);
