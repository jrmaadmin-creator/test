// UI wiring: rhythm selection, playback clock, info panels, readouts.
import { RHYTHMS, GROUPS, byId, ANATOMY, SPEEDS } from './rhythms.js';
import { Engine } from './engine.js';
import { Strip } from './strip.js';
import { HeartView, STRUCTURE_SEGS } from './heart3d.js';

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
  rhythm: null,
  playing: !reduceMotion,
  speed: store.get('speed', 0.25),
  simT: START_T,
  labels: store.get('labels', true),
  waveLabels: store.get('waveLabels', true),
  intervals: store.get('intervals', false),
  structure: null,
};

const engine = new Engine();
const strip = new Strip($('#strip'));
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

// ---------- Rhythm pickers ----------

function buildPickers() {
  const list = $('#rhythm-list');
  const select = $('#rhythm-select');
  for (const g of GROUPS) {
    const items = RHYTHMS.filter((r) => r.group === g);
    const h = document.createElement('h2');
    h.textContent = g;
    const ul = document.createElement('ul');
    const og = document.createElement('optgroup');
    og.label = g;
    for (const r of items) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.id = r.id;
      b.innerHTML = `<span></span><small></small>`;
      b.firstChild.textContent = r.short;
      b.lastChild.textContent = r.lead === 'V1' ? 'V1' : '';
      b.title = r.name;
      b.addEventListener('click', () => loadRhythm(r.id));
      li.appendChild(b);
      ul.appendChild(li);
      const o = document.createElement('option');
      o.value = r.id;
      o.textContent = r.name;
      og.appendChild(o);
    }
    list.append(h, ul);
    select.appendChild(og);
  }
  select.addEventListener('change', () => loadRhythm(select.value));
}

function loadRhythm(id) {
  const r = byId[id] || RHYTHMS[0];
  state.rhythm = r;
  engine.load(r);
  state.simT = START_T;
  engine.ensure(state.simT + 3);
  heart?.setRhythm(r);
  strip.caliper = null;
  for (const b of document.querySelectorAll('#rhythm-list button')) b.setAttribute('aria-current', String(b.dataset.id === r.id));
  $('#rhythm-select').value = r.id;
  $('#strip-name').textContent = r.name;
  renderRhythmPanel(r);
  store.set('rhythm', r.id);
  try {
    history.replaceState(null, '', `#${r.id}`);
  } catch {
    /* sandboxed frames may refuse history changes */
  }
  lastCaption = '';
  lastReadout = 0;
  strip.resize();
}

// ---------- Panels ----------

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

function renderRhythmPanel(r) {
  const p = $('#panel-rhythm');
  p.replaceChildren();
  p.append(el('p', 'eyebrow', `${r.group} · Lead ${r.lead || 'II'}`), el('h2', null, r.name), el('p', 'summary', r.summary));

  const dl = el('dl', 'criteria');
  const rows = [
    ['Rate', r.criteria.rate],
    ['Rhythm', r.criteria.rhythm],
    ['P waves', r.criteria.p],
    ['PR', r.criteria.pr],
    ['QRS', r.criteria.qrs],
  ];
  for (const [k, v] of rows) {
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
  section('Common causes', r.causes);
  section('Why it matters', r.significance);
  const tip = el('p', 'tip');
  tip.append(el('b', null, 'Recognition tip'), document.createTextNode(r.tip));
  p.appendChild(tip);

  const i = RHYTHMS.indexOf(r);
  const pager = el('div', 'pager');
  const prev = RHYTHMS[i - 1];
  const next = RHYTHMS[i + 1];
  if (prev) {
    const b = el('button', null, `← ${prev.short}`);
    b.type = 'button';
    b.addEventListener('click', () => loadRhythm(prev.id));
    pager.appendChild(b);
  }
  if (next) {
    const b = el('button', null, `${next.short} →`);
    b.type = 'button';
    b.addEventListener('click', () => loadRhythm(next.id));
    pager.appendChild(b);
  }
  p.appendChild(pager);
  p.scrollTop = 0;
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

  const h = el('h3', null, 'Pacemaker hierarchy');
  const t1 = table(['Site', 'Built-in rate'], [
    ['SA node', '60–100/min'],
    ['AV junction', '40–60/min'],
    ['Ventricles (Purkinje, muscle)', '20–40/min'],
  ]);
  const h2 = el('h3', null, 'Conduction speed');
  const t2 = table(['Tissue', 'Speed'], SPEEDS);
  const note = el(
    'p',
    null,
    'The AV node is the slowest tissue on purpose: its delay gives the atria time to finish filling the ventricles. The His-Purkinje system is the fastest, which is why a normally conducted QRS is narrow and anything that bypasses it is wide.',
  );
  p.append(h, t1, h2, t2, note);
}

function renderReadingPanel() {
  const p = $('#panel-reading');
  p.append(el('p', 'eyebrow', 'Systematic approach'), el('h2', null, 'Five questions, every strip'));
  const ol = el('ol', 'steps');
  const steps = [
    ['Rate', 'Count the QRS complexes in 6 seconds and multiply by 10 (works for any rhythm). For regular rhythms, 300 ÷ large boxes between R waves, or 1500 ÷ small boxes.'],
    ['Rhythm', 'Are the R-R intervals the same? Regular, regularly irregular (a pattern), or irregularly irregular (no pattern).'],
    ['P waves', 'Present? Upright in II? One before every QRS? All the same shape? More P waves than QRS complexes?'],
    ['PR interval', 'Start of P to start of QRS. Normal 0.12–0.20 s (3–5 small boxes). Is it constant, lengthening, or random?'],
    ['QRS width', 'Narrow is under 0.12 s (3 small boxes): the impulse used the His-Purkinje system. Wide means it did not.'],
  ];
  for (const [k, v] of steps) {
    const li = el('li');
    li.append(el('b', null, k), el('p', null, v));
    ol.appendChild(li);
  }
  p.appendChild(ol);
  p.append(
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
    el(
      'p',
      null,
      'Pause the strip, then drag across it to place calipers. The readout gives the distance in seconds and small boxes, and the rate that R-R distance would produce. Turn on Intervals to see each PR and QRS measured for you.',
    ),
  );
}

function table(head, rows) {
  const t = el('table', 'facts');
  const tr = el('tr');
  for (const h of head) tr.appendChild(el('th', null, h));
  const thead = el('thead');
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

function selectTab(id) {
  for (const b of document.querySelectorAll('.tabs button')) {
    const on = b.id === `tab-${id}`;
    b.setAttribute('aria-selected', String(on));
    $(`#${b.getAttribute('aria-controls')}`).hidden = !on;
  }
  store.set('tab', id);
}

function selectStructure(id) {
  if (!STRUCTURE_SEGS[id]) return;
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
    for (const c of b.chambers) {
      if (t >= c.d0 && t <= c.d1 + 0.03) set(c.ch === 'RA' || c.ch === 'LA' ? 1 : 6, 'active');
    }
    for (const r of b.ripples) {
      if (r.kind === 'ectopic' && t >= r.t0 && t <= r.t0 + 0.08) set(RIPPLE_STEP[r.at] ?? 6, 'ectopic');
    }
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

function updateReadouts(t) {
  const now = performance.now();
  if (now - lastReadout < 250) return;
  lastReadout = now;
  const beats = engine.between(t - 6, t);
  const q = beats.map((b) => b.qrs).filter((x) => x != null && x <= t && x > t - 6);
  const p = beats.flatMap((b) => b.p).filter((x) => x <= t && x > t - 6);
  let lastPR = null;
  let lastQRS = null;
  for (const b of beats) {
    for (const iv of b.intervals) {
      if (iv.t1 > t) continue;
      if (iv.kind === 'PR' && (!lastPR || iv.t1 > lastPR.t1)) lastPR = iv;
      if (iv.kind === 'QRS' && (!lastQRS || iv.t1 > lastQRS.t1)) lastQRS = iv;
    }
  }
  const noOutput = state.rhythm.id === 'vf' || state.rhythm.id === 'asystole';
  q.sort((a, b) => a - b);
  const meanRR = q.length > 1 ? (q[q.length - 1] - q[0]) / (q.length - 1) : null;
  $('#ro-rate').textContent = noOutput || !meanRR ? '—' : `${Math.round(60 / meanRR)}/min`;
  $('#ro-count').textContent = noOutput ? '—' : `${q.length} × 10 = ${q.length * 10}`;
  p.sort((a, b) => a - b);
  const aRate = p.length > 1 ? Math.round(60 / ((p[p.length - 1] - p[0]) / (p.length - 1))) : 0;
  const vRate = meanRR ? 60 / meanRR : 0;
  const showA = !noOutput && p.length > 1 && Math.abs(aRate - vRate) > 10;
  $('#ro-atrial-wrap').hidden = !showA;
  $('#ro-atrial').textContent = `${aRate}/min`;
  $('#ro-pr').textContent = lastPR ? `${(lastPR.t1 - lastPR.t0).toFixed(2)} s` : '—';
  $('#ro-qrs').textContent = lastQRS ? `${(lastQRS.t1 - lastQRS.t0).toFixed(2)} s` : '—';
  $('#strip-spec').textContent = `Lead ${state.rhythm.lead || 'II'} · 25 mm/s · 10 mm/mV · ${strip.seconds}-second view`;
}

// ---------- Controls ----------

function setPlaying(on) {
  state.playing = on;
  strip.paused = !on;
  if (on) strip.caliper = null;
  const b = $('#play');
  b.textContent = on ? 'Pause' : 'Play';
  b.setAttribute('aria-pressed', String(on));
  $('#strip-hint').textContent = on
    ? 'Pause, then drag across the strip to measure with calipers.'
    : 'Drag across the strip to measure. Press Play to continue.';
}

function setSpeed(v) {
  state.speed = v;
  store.set('speed', v);
  for (const b of document.querySelectorAll('#speed button')) b.setAttribute('aria-pressed', String(Number(b.dataset.speed) === v));
}

function bindControls() {
  $('#play').addEventListener('click', () => setPlaying(!state.playing));
  for (const b of document.querySelectorAll('#speed button')) b.addEventListener('click', () => setSpeed(Number(b.dataset.speed)));
  const toggles = [
    ['#opt-labels', 'labels'],
    ['#opt-waves', 'waveLabels'],
    ['#opt-intervals', 'intervals'],
  ];
  for (const [sel, key] of toggles) {
    const i = $(sel);
    i.checked = state[key];
    i.addEventListener('change', () => {
      state[key] = i.checked;
      store.set(key, i.checked);
    });
  }
  $('#reset-view').addEventListener('click', () => heart?.resetView());
  for (const b of document.querySelectorAll('.tabs button')) b.addEventListener('click', () => selectTab(b.id.replace('tab-', '')));

  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === ' ' && tag !== 'BUTTON') {
      e.preventDefault();
      setPlaying(!state.playing);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const i = RHYTHMS.indexOf(state.rhythm) + (e.key === 'ArrowRight' ? 1 : -1);
      if (RHYTHMS[i]) loadRhythm(RHYTHMS[i].id);
    }
  });

  const retheme = () => strip.readTheme();
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', retheme);
  new MutationObserver(retheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (byId[id] && id !== state.rhythm.id) loadRhythm(id);
  });
}

// ---------- Clock ----------

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  const dtSim = state.playing ? dt * state.speed : 0;
  state.simT += dtSim;
  engine.ensure(state.simT + 3);
  engine.prune(state.simT - 14);
  const near = engine.between(state.simT - 1.2, state.simT + 0.05);
  if (heart) {
    heart.update(state.simT, near, dtSim);
    heart.render(state.labels);
  }
  strip.draw(state.simT, engine, state.rhythm, { waveLabels: state.waveLabels, intervals: state.intervals });
  updatePathway(state.simT, near);
  updateCaption(state.simT, near);
  updateReadouts(state.simT);
  requestAnimationFrame(frame);
}

buildPickers();
renderAnatomyPanel();
renderReadingPanel();
bindControls();
setSpeed([0.1, 0.25, 0.5, 1].includes(state.speed) ? state.speed : 0.25);
setPlaying(state.playing);
const fromHash = location.hash.slice(1);
loadRhythm(byId[fromHash] ? fromHash : store.get('rhythm', 'nsr'));
selectTab(store.get('tab', 'rhythm'));
requestAnimationFrame(frame);

// Test hook: lets automated checks step the clock deterministically.
window.__hcl = { state, engine, loadRhythm, setPlaying };
