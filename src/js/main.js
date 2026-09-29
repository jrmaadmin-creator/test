// UI wiring: modes (Learn, 12-lead, Compare, Quiz), rhythm selection,
// playback clock, panels and live readouts.
import { RHYTHMS, GROUPS, byId, ANATOMY, SPEEDS } from './rhythms.js';
import { Engine } from './engine.js';
import { Strip } from './strip.js';
import { HeartView, STRUCTURE_SEGS } from './heart3d.js';
import { LEADS, LEAD_NAMES, vectorAt } from './ecg.js';
import { TwelveLead, drawAxes, axisWords } from './twelve.js';
import { TREATMENT, TREATMENT_FOR, TWELVE, TWELVE_BASICS, NH_STATUS, SOURCES } from './clinical.js';
import { CompareView, SETS } from './compare.js';
import { Quiz } from './quiz.js';
import { initCrew } from './crew.js';

const $ = (s) => document.querySelector(s);
const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(`hcl:${k}`);
      return v == null ? d : JSON.parse(v);
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(`hcl:${k}`, JSON.stringify(v));
    } catch {
      /* storage unavailable: preferences just won't persist */
    }
  },
};

const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const START_T = 6.05; // start with one full sweep already on the strip

const state = {
  mode: 'learn',
  rhythm: null,
  lead: 'II',
  playing: !reduceMotion,
  speed: store.get('speed', 0.25),
  simT: START_T,
  labels: store.get('labels', true),
  vector: store.get('vector', false),
  waveLabels: store.get('waveLabels', true),
  intervals: store.get('intervals', false),
  ladder: store.get('ladder', true),
  pulse: store.get('pulse', true),
  compareSet: store.get('compareSet', 'avblocks'),
  tabs: store.get('tabs', {}),
};

const engine = new Engine();
const strip = new Strip($('#strip'), { ladder: state.ladder, pulse: state.pulse });
let heart = null;
try {
  heart = new HeartView($('#viewport'), $('#labels'), { onSelect: selectStructure });
} catch (err) {
  const msg = document.createElement('p');
  msg.className = 'webgl-fallback';
  msg.textContent = 'The 3D heart needs WebGL, which this browser has turned off. The rhythm strip and explanations still work.';
  $('#viewport').appendChild(msg);
  console.error(err);
}
const twelve = new TwelveLead($('#twelve'), { onSelect: (l) => setLead(l) });
const compare = new CompareView($('#compare-rows'), byId);
let crew = null;
const quiz = new Quiz($('#panel-quiz'), {
  rhythms: RHYTHMS,
  groups: GROUPS,
  onLoad: (id) => loadRhythm(id, { quiz: true }),
  onStudy: (id) => {
    setMode('learn');
    loadRhythm(id);
  },
  onAnswer: (stats) => {
    crew?.save(stats);
    $('#strip-name').textContent = quiz.answered ? byId[quiz.current].name : 'Unknown rhythm';
  },
  onSettings: () => applyModeLayout(),
});

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

// ---------- Rhythm pickers ----------

function buildPickers() {
  const list = $('#rhythm-list');
  const select = $('#rhythm-select');
  for (const g of GROUPS) {
    const items = RHYTHMS.filter((r) => r.group === g);
    const h = el('h2', null, g);
    const ul = el('ul');
    const og = document.createElement('optgroup');
    og.label = g;
    for (const r of items) {
      const li = el('li');
      const b = el('button');
      b.type = 'button';
      b.dataset.id = r.id;
      b.append(el('span', null, r.short), el('small', null, r.lead === 'V1' ? 'V1' : ''));
      b.title = r.name;
      b.addEventListener('click', () => loadRhythm(r.id));
      li.appendChild(b);
      ul.appendChild(li);
      const o = el('option', null, r.name);
      o.value = r.id;
      og.appendChild(o);
    }
    list.append(h, ul);
    select.appendChild(og);
  }
  select.addEventListener('change', () => loadRhythm(select.value));

  const leadSel = $('#lead-select');
  for (const l of LEAD_NAMES) {
    const o = el('option', null, l);
    o.value = l;
    leadSel.appendChild(o);
  }
  leadSel.addEventListener('change', () => setLead(leadSel.value));
}

function setLead(l) {
  state.lead = l;
  strip.lead = l;
  $('#lead-select').value = l;
  twelve.selected = l;
  twelve.draw();
  heart?.setVectorMode(state.vector && state.mode === 'learn', l, LEADS[l].axis);
  if (state.mode === 'twelve') renderTwelvePanel();
}

function loadRhythm(id, o = {}) {
  const r = byId[id] || RHYTHMS[0];
  state.rhythm = r;
  engine.load(r);
  state.simT = START_T;
  engine.ensure(state.simT + 3);
  heart?.setRhythm(r);
  strip.caliper = null;
  setLead(r.lead || 'II');
  lastCaption = '';
  lastReadout = 0;
  if (o.quiz) {
    $('#strip-name').textContent = 'Unknown rhythm';
    return;
  }
  for (const b of document.querySelectorAll('#rhythm-list button')) b.setAttribute('aria-current', String(b.dataset.id === r.id));
  $('#rhythm-select').value = r.id;
  $('#strip-name').textContent = r.name;
  renderRhythmPanel(r);
  renderTreatmentPanel(r);
  if (state.mode === 'twelve') {
    twelve.set(r);
    renderTwelvePanel();
  }
  store.set('rhythm', r.id);
  writeHash();
}

function writeHash() {
  if (!state.rhythm) return;
  const h =
    state.mode === 'quiz'
      ? 'quiz'
      : state.mode === 'compare'
        ? `compare.${state.compareSet}`
        : state.mode === 'twelve'
          ? `12lead.${state.rhythm.id}`
          : state.rhythm.id;
  try {
    history.replaceState(null, '', `#${h}`);
  } catch {
    /* sandboxed frames may refuse history changes */
  }
}

// ---------- Modes ----------

function setMode(mode) {
  const prev = state.mode;
  state.mode = mode;
  for (const b of document.querySelectorAll('#modes button')) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
  applyModeLayout();
  if (mode === 'quiz' && prev !== 'quiz') quiz.next();
  if (prev === 'quiz' && mode !== 'quiz') loadRhythm(quiz.current || state.rhythm.id);
  if (mode === 'twelve') {
    twelve.set(state.rhythm);
    renderTwelvePanel();
  }
  if (mode === 'compare') renderComparePanel();
  const first = [...document.querySelectorAll('#tabs button')].find((b) => b.dataset.modes === mode);
  const saved = state.tabs[mode];
  const valid = saved && $(`#tab-${saved}`)?.dataset.modes === mode;
  selectTab(valid ? saved : first.id.replace('tab-', ''));
  writeHash();
}

function applyModeLayout() {
  const m = state.mode;
  const app = $('#app');
  app.className = `app mode-${m}${m === 'quiz' && quiz.settings.stripOnly ? ' strip-only' : ''}`;
  $('#monitor').hidden = !(m === 'learn' || (m === 'quiz' && !quiz.settings.stripOnly));
  $('#pathway').hidden = m !== 'learn';
  $('#twelve-view').hidden = m !== 'twelve';
  $('#compare-view').hidden = m !== 'compare';
  for (const b of document.querySelectorAll('#tabs button')) b.hidden = b.dataset.modes !== m;
  heart?.setVectorMode(state.vector && m === 'learn', state.lead, LEADS[state.lead].axis);
  $('#caption').hidden = m === 'quiz';
  $('#opt-labels').closest('label').hidden = m === 'quiz';
  $('#opt-vector').closest('label').hidden = m === 'quiz';
  // The timeline, labels and readouts would give quiz answers away.
  strip.setBands({ ladder: m === 'quiz' ? false : state.ladder, pulse: state.pulse });
  $('#readouts').hidden = m === 'quiz';
  for (const id of ['#opt-waves', '#opt-intervals', '#opt-ladder']) $(id).closest('label').hidden = m === 'quiz';
}

function selectTab(id) {
  for (const b of document.querySelectorAll('#tabs button')) {
    const on = b.id === `tab-${id}`;
    b.setAttribute('aria-selected', String(on));
    $(`#${b.getAttribute('aria-controls')}`).hidden = !on;
  }
  state.tabs[state.mode] = id;
  store.set('tabs', state.tabs);
}

// ---------- Panels ----------

function renderRhythmPanel(r) {
  const p = $('#panel-rhythm');
  p.replaceChildren();
  p.append(el('p', 'eyebrow', `${r.group} · Lead ${r.lead || 'II'}`), el('h2', null, r.name), el('p', 'summary', r.summary));
  const dl = el('dl', 'criteria');
  for (const [k, v] of [
    ['Rate', r.criteria.rate],
    ['Rhythm', r.criteria.rhythm],
    ['P waves', r.criteria.p],
    ['PR', r.criteria.pr],
    ['QRS', r.criteria.qrs],
  ]) {
    const d = el('div');
    d.append(el('dt', null, k), el('dd', null, v));
    dl.appendChild(d);
  }
  p.appendChild(dl);
  const section = (title, body, cls) => {
    const s = el('section', cls);
    s.appendChild(el('h3', null, title));
    if (Array.isArray(body)) {
      const ul = el('ul');
      for (const item of body) ul.appendChild(el('li', null, item));
      s.appendChild(ul);
    } else s.appendChild(el('p', null, body));
    p.appendChild(s);
  };
  section('What the conduction system is doing', r.mechanism);
  section('Watch the 3D heart', r.watch, 'watch');
  if (TWELVE[r.id]) section('On a 12-lead', TWELVE[r.id]);
  section('Common causes', r.causes);
  section('Why it matters', r.significance);
  const tip = el('p', 'tip');
  tip.append(el('b', null, 'Recognition tip'), document.createTextNode(r.tip));
  p.appendChild(tip);
  p.appendChild(pager(r));
  p.scrollTop = 0;
}

function pager(r) {
  const i = RHYTHMS.indexOf(r);
  const div = el('div', 'pager');
  const prev = RHYTHMS[i - 1];
  const next = RHYTHMS[i + 1];
  if (prev) {
    const b = el('button', null, `← ${prev.short}`);
    b.type = 'button';
    b.addEventListener('click', () => loadRhythm(prev.id));
    div.appendChild(b);
  }
  if (next) {
    const b = el('button', null, `${next.short} →`);
    b.type = 'button';
    b.addEventListener('click', () => loadRhythm(next.id));
    div.appendChild(b);
  }
  return div;
}

function renderTreatmentPanel(r) {
  const p = $('#panel-treat');
  p.replaceChildren();
  const t = TREATMENT[TREATMENT_FOR[r.id]] || TREATMENT.none;
  p.append(el('p', 'eyebrow', 'Treatment'), el('h2', null, r.name), el('p', 'summary', t.title));
  const warn = el('div', 'protocol-note');
  warn.append(el('b', null, NH_STATUS.version), el('span', null, NH_STATUS.note));
  p.appendChild(warn);
  const ol = el('ol', 'treat-steps');
  for (const [lvl, text] of t.steps) {
    const li = el('li');
    li.append(el('span', `lvl lvl-${lvl.toLowerCase()}`, lvl), el('span', null, text));
    ol.appendChild(li);
  }
  p.appendChild(ol);
  if (t.note) {
    const n = el('p', 'tip');
    n.append(el('b', null, 'Key point'), document.createTextNode(t.note));
    p.appendChild(n);
  }
  p.append(el('p', 'source', `Source: ${SOURCES.aha}.`), el('p', 'source', SOURCES.scope));
  p.scrollTop = 0;
}

const LEAD_VIEW = {
  I: 'high lateral wall',
  aVL: 'high lateral wall',
  II: 'inferior wall',
  III: 'inferior wall',
  aVF: 'inferior wall',
  aVR: 'heart from the right shoulder, looking into the cavity (normally all negative)',
  V1: 'septum and right ventricle',
  V2: 'septum',
  V3: 'anterior wall',
  V4: 'anterior wall',
  V5: 'lateral wall',
  V6: 'lateral wall',
};

function renderTwelvePanel() {
  const r = state.rhythm;
  const p = $('#panel-twelve');
  p.replaceChildren();
  $('#twelve-name').textContent = `12-lead: ${r.name}`;
  p.append(el('p', 'eyebrow', '12-lead ECG'), el('h2', null, r.name));
  const wrap = el('div', 'axes-wrap');
  const cv = document.createElement('canvas');
  cv.className = 'axes';
  cv.setAttribute('aria-label', 'Lead axes with the QRS direction');
  wrap.appendChild(cv);
  p.appendChild(wrap);
  const ax = twelve.data?.axis;
  p.appendChild(el('p', 'axis-line', `QRS axis ${axisWords(ax)}. The amber arrow is the average direction of ventricular depolarization.`));
  const L = LEADS[state.lead];
  const sel = el('section', 'watch');
  sel.append(
    el('h3', null, `Lead ${state.lead}`),
    el(
      'p',
      null,
      `${L.plane === 'frontal' ? 'Limb lead' : 'Chest lead'} at ${L.deg > 0 ? '+' : ''}${L.deg}°. Looks at the ${LEAD_VIEW[state.lead]}. Waves point up when the impulse travels toward this lead's positive pole and down when it travels away.`,
    ),
  );
  p.appendChild(sel);
  if (TWELVE[r.id]) {
    const s = el('section');
    s.append(el('h3', null, 'This rhythm on a 12-lead'), el('p', null, TWELVE[r.id]));
    p.appendChild(s);
  }
  const how = el('section');
  how.appendChild(el('h3', null, 'How a 12-lead works'));
  const dl = el('dl', 'basics');
  for (const [k, v] of TWELVE_BASICS) {
    const d = el('div');
    d.append(el('dt', null, k), el('dd', null, v));
    dl.appendChild(d);
  }
  how.appendChild(dl);
  p.appendChild(how);
  requestAnimationFrame(() => drawAxes(cv, twelve.data, state.lead));
}

function renderComparePanel() {
  const p = $('#panel-compare');
  p.replaceChildren();
  p.append(el('p', 'eyebrow', 'Compare'), el('h2', null, 'Side by side'));
  const label = el('label', 'set-pick');
  label.htmlFor = 'compare-set';
  label.appendChild(el('span', null, 'Set'));
  const sel = el('select');
  sel.id = 'compare-set';
  for (const [k, s] of Object.entries(SETS)) {
    const o = el('option', null, s.name);
    o.value = k;
    sel.appendChild(o);
  }
  sel.value = state.compareSet;
  label.appendChild(sel);
  p.appendChild(label);
  const note = el('p', 'summary');
  p.appendChild(note);
  const legend = el('section');
  legend.append(
    el('h3', null, 'Reading the timeline'),
    el(
      'p',
      null,
      'The band under each strip is a ladder diagram, the tool cardiologists use to explain rhythms. The A tier is the atria, AV is the AV node and His bundle, V is the ventricles. A slanted line is an impulse crossing that tier; the more it slants, the longer it takes. A dot marks where a beat started outside the SA node. A bar is a block. Circles are reentry loops; a scribble is chaos.',
    ),
  );
  p.appendChild(legend);
  const show = () => {
    state.compareSet = sel.value;
    store.set('compareSet', sel.value);
    const set = compare.show(sel.value);
    note.textContent = set.note;
    writeHash();
  };
  sel.addEventListener('change', show);
  show();
}

function renderAnatomyPanel() {
  const p = $('#panel-anatomy');
  p.append(
    el('p', 'eyebrow', 'The conduction system'),
    el('h2', null, 'One impulse, seven stops'),
    el(
      'p',
      null,
      'Every normal beat follows the same route. Select a structure to highlight it in the 3D heart. Each site can pace the heart if everything above it fails, but lower sites fire slower. The fastest active pacemaker always wins.',
    ),
  );
  const ul = el('ul', 'struct-list');
  for (const a of ANATOMY) {
    const li = el('li');
    const b = el('button', 'struct');
    b.type = 'button';
    b.dataset.id = a.id;
    b.setAttribute('aria-pressed', 'false');
    const title = el('strong', null, a.name);
    title.appendChild(el('small', null, a.rate));
    b.append(title, el('span', null, a.where), el('p', null, a.does));
    b.addEventListener('click', () => selectStructure(a.id));
    li.appendChild(b);
    ul.appendChild(li);
  }
  p.appendChild(ul);
  p.append(
    el('h3', null, 'Pacemaker hierarchy'),
    table(['Site', 'Built-in rate'], [
      ['SA node', '60–100/min'],
      ['AV junction', '40–60/min'],
      ['Ventricles (Purkinje, muscle)', '20–40/min'],
    ]),
    el('h3', null, 'Conduction speed'),
    table(['Tissue', 'Speed'], SPEEDS),
    el(
      'p',
      null,
      'The AV node is the slowest tissue on purpose: its delay gives the atria time to finish filling the ventricles. The His-Purkinje system is the fastest, which is why a normally conducted QRS is narrow and anything that bypasses it is wide.',
    ),
  );
}

function renderReadingPanel() {
  const p = $('#panel-reading');
  p.append(el('p', 'eyebrow', 'Systematic approach'), el('h2', null, 'Five questions, every strip'));
  const ol = el('ol', 'steps');
  for (const [k, v] of [
    ['Rate', 'Count the QRS complexes in 6 seconds and multiply by 10 (works for any rhythm). For regular rhythms, 300 ÷ large boxes between R waves, or 1500 ÷ small boxes.'],
    ['Rhythm', 'Are the R-R intervals the same? Regular, regularly irregular (a pattern), or irregularly irregular (no pattern).'],
    ['P waves', 'Present? Upright in II? One before every QRS? All the same shape? More P waves than QRS complexes?'],
    ['PR interval', 'Start of P to start of QRS. Normal 0.12–0.20 s (3–5 small boxes). Is it constant, lengthening, or random?'],
    ['QRS width', 'Narrow is under 0.12 s (3 small boxes): the impulse used the His-Purkinje system. Wide means it did not.'],
  ]) {
    const li = el('li');
    li.append(el('b', null, k), el('p', null, v));
    ol.appendChild(li);
  }
  p.appendChild(ol);
  p.append(
    el('h3', null, 'Then: is there a pulse?'),
    el('p', null, 'The monitor shows electricity, not blood flow. The pulse band under the strip shows which beats produce a pulse. An organized rhythm without a pulse is PEA.'),
    el('h3', null, 'The paper'),
    table(['Measure', 'Value'], [
      ['1 small box (1 mm)', '0.04 s'],
      ['1 large box (5 mm)', '0.20 s'],
      ['5 large boxes', '1 s'],
      ['Tick marks on top', 'every 3 s'],
      ['Height: 10 mm (2 large boxes)', '1 mV'],
    ]),
    el('h3', null, 'Waves'),
    table(['Wave', 'What it shows'], [
      ['P', 'Atria depolarize'],
      ['PR segment', 'Impulse held in the AV node'],
      ['QRS', 'Ventricles depolarize (atrial repolarization is hidden here)'],
      ['ST segment', 'Ventricles fully depolarized'],
      ['T', 'Ventricles repolarize'],
    ]),
    el('h3', null, 'Measure it yourself'),
    el('p', null, 'Pause the strip, then drag across it to place calipers. The readout gives the distance in seconds and small boxes, and the rate that R-R distance would produce. Turn on Intervals to see each PR and QRS measured for you.'),
  );
}

function table(head, rows) {
  const t = el('table', 'facts');
  const thead = el('thead');
  const tr = el('tr');
  for (const h of head) tr.appendChild(el('th', null, h));
  thead.appendChild(tr);
  const tb = el('tbody');
  for (const r of rows) {
    const row = el('tr');
    for (const c of r) row.appendChild(el('td', null, c));
    tb.appendChild(row);
  }
  t.append(thead, tb);
  return t;
}

function selectStructure(id) {
  if (!STRUCTURE_SEGS[id] || state.mode !== 'learn') return;
  selectTab('anatomy');
  heart?.setHighlight(id);
  for (const b of document.querySelectorAll('.struct')) b.setAttribute('aria-pressed', String(b.dataset.id === id));
  document.querySelector(`.struct[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
}

// ---------- Live readouts ----------

const STEP_OF = {
  sa: 0, bachmann: 1, intAnt: 1, intMid: 1, intPost: 1, kent: 1, flutterLoop: 1,
  av: 2, avnrtLoop: 2, his: 3, rbb: 4, lbb: 4, laf: 4, lpf: 4, purkR: 5, purkL: 5,
  pacer: 6, vtLoop: 6, twistLoop: 6,
};
const RIPPLE_STEP = { sa: 0, pac: 1, av: 2 };
const steps = [...document.querySelectorAll('#pathway li')];
let lastCaption = '';
let lastReadout = 0;

function updatePathway(t, beats) {
  const st = new Array(7).fill('idle');
  const rank = { idle: 0, active: 1, ectopic: 2, blocked: 3 };
  const set = (i, s) => {
    if (rank[s] > rank[st[i]]) st[i] = s;
  };
  for (const b of beats) {
    for (const a of b.acts) {
      if (t < a.t0) continue;
      const i = STEP_OF[a.seg];
      if (i == null) continue;
      if (a.block) {
        const tb = a.t0 + (a.t1 - a.t0) * a.block.at;
        if (t >= tb) {
          if (a.block.kind === 'block' && t - tb < 0.45) set(i, 'blocked');
          continue;
        }
      }
      if (t <= a.t1 + 0.03) set(i, a.kind === 'ectopic' ? 'ectopic' : 'active');
    }
    for (const c of b.chambers) if (t >= c.d0 && t <= c.d1 + 0.03) set(c.ch === 'RA' || c.ch === 'LA' ? 1 : 6, 'active');
    for (const r of b.ripples) if (r.kind === 'ectopic' && t >= r.t0 && t <= r.t0 + 0.08) set(RIPPLE_STEP[r.at] ?? 6, 'ectopic');
  }
  const r = state.rhythm;
  if (r.ambient?.chaos === 'atria') set(1, 'ectopic');
  if (r.ambient?.chaos === 'ventricles') set(6, 'ectopic');
  if (r.loop) set(STEP_OF[r.loop.seg], 'ectopic');
  steps.forEach((li, i) => {
    if (li.dataset.state !== st[i]) li.dataset.state = st[i];
  });
}

function updateCaption(t, beats) {
  let best = null;
  for (const b of beats) for (const c of b.captions) if (c.t <= t && t - c.t < 1.1 && (!best || c.t > best.t)) best = c;
  const text = best ? best.text : state.rhythm.ambientCaption || state.rhythm.summary;
  if (text !== lastCaption) {
    $('#caption').textContent = text;
    lastCaption = text;
  }
}

function meanRate(times) {
  if (times.length < 2) return null;
  return 60 / ((times[times.length - 1] - times[0]) / (times.length - 1));
}

function updateReadouts(t) {
  const now = performance.now();
  if (now - lastReadout < 250) return;
  lastReadout = now;
  const beats = engine.between(t - 6, t);
  const inWin = (x) => x != null && x <= t && x > t - 6;
  const q = beats.map((b) => b.qrs).filter(inWin).sort((a, b) => a - b);
  const p = beats.flatMap((b) => b.p).filter(inWin).sort((a, b) => a - b);
  const pulses = beats.filter((b) => b.mech && b.mech.sv >= 0.35 && inWin(b.mech.t)).map((b) => b.mech.t).sort((a, b) => a - b);
  let lastPR = null;
  let lastQRS = null;
  for (const b of beats) {
    for (const iv of b.intervals) {
      if (iv.t1 > t) continue;
      if (iv.kind === 'PR' && (!lastPR || iv.t1 > lastPR.t1)) lastPR = iv;
      if (iv.kind === 'QRS' && (!lastQRS || iv.t1 > lastQRS.t1)) lastQRS = iv;
    }
  }
  const chaos = state.rhythm.id === 'vf' || state.rhythm.id === 'asystole';
  const vRate = chaos ? null : meanRate(q);
  $('#ro-rate').textContent = vRate ? `${Math.round(vRate)}/min` : '—';
  $('#ro-count').textContent = chaos ? '—' : `${q.length} × 10 = ${q.length * 10}`;
  const aRate = meanRate(p);
  const showA = !chaos && aRate && vRate && Math.abs(aRate - vRate) > 10;
  $('#ro-atrial-wrap').hidden = !showA;
  $('#ro-atrial').textContent = aRate ? `${Math.round(aRate)}/min` : '—';
  $('#ro-pr').textContent = lastPR ? `${(lastPR.t1 - lastPR.t0).toFixed(2)} s` : '—';
  $('#ro-qrs').textContent = lastQRS ? `${(lastQRS.t1 - lastQRS.t0).toFixed(2)} s` : '—';
  const pr = meanRate(pulses);
  const ro = $('#ro-pulse');
  if (!pulses.length) {
    ro.textContent = 'None';
    ro.dataset.state = 'none';
  } else if (pr && vRate && vRate - pr >= 10) {
    ro.textContent = `${Math.round(pr)}/min · deficit`;
    ro.dataset.state = 'deficit';
  } else {
    ro.textContent = pr ? `${Math.round(pr)}/min` : 'Present';
    ro.dataset.state = '';
  }
}

// ---------- Controls ----------

function setPlaying(on) {
  state.playing = on;
  strip.paused = !on;
  if (on) strip.caliper = null;
  const b = $('#play');
  b.textContent = on ? 'Pause' : 'Play';
  b.setAttribute('aria-pressed', String(on));
  $('#strip-hint').textContent = on ? 'Pause, then drag across the strip to measure with calipers.' : 'Drag across the strip to measure. Press Play to continue.';
}

function setSpeed(v) {
  state.speed = v;
  store.set('speed', v);
  for (const b of document.querySelectorAll('#speed button')) b.setAttribute('aria-pressed', String(Number(b.dataset.speed) === v));
}

function bindControls() {
  $('#play').addEventListener('click', () => setPlaying(!state.playing));
  for (const b of document.querySelectorAll('#speed button')) b.addEventListener('click', () => setSpeed(Number(b.dataset.speed)));
  for (const b of document.querySelectorAll('#modes button')) b.addEventListener('click', () => setMode(b.dataset.mode));
  const toggles = [
    ['#opt-labels', 'labels'],
    ['#opt-vector', 'vector', () => heart?.setVectorMode(state.vector && state.mode === 'learn', state.lead, LEADS[state.lead].axis)],
    ['#opt-waves', 'waveLabels'],
    ['#opt-intervals', 'intervals'],
    ['#opt-ladder', 'ladder', () => strip.setBands({ ladder: state.ladder })],
    ['#opt-pulse', 'pulse', () => strip.setBands({ pulse: state.pulse })],
  ];
  for (const [sel, key, after] of toggles) {
    const i = $(sel);
    i.checked = state[key];
    i.addEventListener('change', () => {
      state[key] = i.checked;
      store.set(key, i.checked);
      after?.();
    });
  }
  $('#reset-view').addEventListener('click', () => heart?.resetView());
  $('#twelve-recapture').addEventListener('click', () => {
    twelve.set(state.rhythm);
    renderTwelvePanel();
  });
  for (const b of document.querySelectorAll('#tabs button')) b.addEventListener('click', () => selectTab(b.id.replace('tab-', '')));

  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (state.mode === 'quiz' && quiz.key(e)) {
      e.preventDefault();
      return;
    }
    if (e.key === ' ' && tag !== 'BUTTON') {
      e.preventDefault();
      setPlaying(!state.playing);
    } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && (state.mode === 'learn' || state.mode === 'twelve')) {
      const i = RHYTHMS.indexOf(state.rhythm) + (e.key === 'ArrowRight' ? 1 : -1);
      if (RHYTHMS[i]) loadRhythm(RHYTHMS[i].id);
    }
  });

  const retheme = () => {
    strip.readTheme();
    twelve.readTheme();
    twelve.draw();
    compare.retheme();
    if (state.mode === 'twelve') renderTwelvePanel();
  };
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', retheme);
  new MutationObserver(retheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  window.addEventListener('hashchange', () => routeHash());
}

function routeHash() {
  const [a, b] = location.hash.slice(1).split('.');
  if (a === 'quiz') return setMode('quiz');
  if (a === 'compare') {
    if (SETS[b]) state.compareSet = b;
    return setMode('compare');
  }
  if (a === '12lead') {
    if (byId[b]) loadRhythm(b);
    return setMode('twelve');
  }
  if (byId[a]) {
    if (state.mode !== 'learn') setMode('learn');
    if (state.rhythm?.id !== a) loadRhythm(a);
  }
}

// ---------- Clock ----------

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  const live = state.mode !== 'compare';
  const dtSim = state.playing && live ? dt * state.speed : 0;
  state.simT += dtSim;
  engine.ensure(state.simT + 3);
  engine.prune(state.simT - 14);
  const near = engine.between(state.simT - 1.2, state.simT + 0.05);
  if (heart && !$('#monitor').hidden) {
    const vec = state.vector && state.mode === 'learn' ? vectorAt(near.flatMap((b) => b.comps), state.rhythm, state.simT) : null;
    heart.update(state.simT, near, dtSim, vec);
    heart.render(state.labels && state.mode === 'learn');
  }
  if (live) {
    strip.draw(state.simT, engine, state.rhythm, {
      waveLabels: state.waveLabels && state.mode !== 'quiz',
      intervals: state.intervals && state.mode !== 'quiz',
    });
    updateReadouts(state.simT);
  }
  if (state.mode === 'learn') {
    updatePathway(state.simT, near);
    updateCaption(state.simT, near);
  }
  requestAnimationFrame(frame);
}

const initialHash = location.hash;
buildPickers();
renderAnatomyPanel();
renderReadingPanel();
bindControls();
setSpeed([0.1, 0.25, 0.5, 1].includes(state.speed) ? state.speed : 0.25);
setPlaying(state.playing);
loadRhythm(store.get('rhythm', 'nsr'));
setMode('learn');
if (initialHash.length > 1) {
  try {
    history.replaceState(null, '', initialHash);
  } catch {
    /* ignore */
  }
  routeHash();
}
initCrew($('#panel-crew'), RHYTHMS).then((c) => {
  crew = c;
});
requestAnimationFrame(frame);

// Test hook: lets automated checks drive the app deterministically.
window.__hcl = { state, engine, loadRhythm, setPlaying, setMode, setLead, quiz };
