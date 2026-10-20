import * as E from './engine.js';
import { PROTOCOLS, BY_ID, OPQRST, SAMPLE } from './protocols/index.js';
import { ALERTS, REQUESTS, DEFAULT_SETTINGS, FAX_SERVICES, buildPrearrival, mailtoLink, gmailLink, faxAddress } from './prearrival.js';
import { buildPdf } from './pdf.js';
import { A3, BANDS, bandsForWeight, bandForLength, bandByColor, citation } from './peds.js';
import { searchDoses, doseSummary } from './doses.js';
import { ARREST, newCpr, cprLog, cycleLeft, epiLeft, milestones, mmss as cmmss } from './cpr.js';

const STORE = 'emt-call-v1';
const REASSESS_MS = { stable: 15 * 60e3, unstable: 5 * 60e3 };

const SETTINGS = 'jrma-settings-v1';

let call = load() || E.newCall();
call.moi ??= '';
call.prearrival ??= { etaMin: '', level: 'BLS', alerts: [], requests: [], sentAt: null };
let settings = loadSettings();
let pedsLookup = { kg: '', cm: '', q: '' };
let medsView = 'bands';
let assessView = 'protocols';
let reportView = 'handoff';
let doseQuery = { q: '', level: 'All', group: 'All' };
let tab = 'call';
let returnTab = 'call';
let reassessMode = 'stable';

// ---------- persistence (survives reload / app switch; wiped on End Call) ----------
function load() {
  try { return JSON.parse(localStorage.getItem(STORE)); } catch { return null; }
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(call)); } catch { /* storage blocked: call still works in memory */ }
}

// Settings (unit name, callback, fax address) survive End Call; they hold no patient data.
function loadSettings() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(SETTINGS) || '{}'); } catch { /* storage blocked */ }
  const s = { ...DEFAULT_SETTINGS, ...saved };
  if (!s.faxNumber) s.faxNumber = DEFAULT_SETTINGS.faxNumber; // phones saved before the default existed
  return s;
}
function saveSettings() {
  try { localStorage.setItem(SETTINGS, JSON.stringify(settings)); } catch { /* ignore */ }
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = sel => document.querySelector(sel);
const view = $('#view');

// ---------- icons (inline SVG, stroke style) ----------
const PATHS = {
  call: '<path d="M9 3h6v4H9z"/><path d="M15 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/>',
  assess: '<path d="M5 3v5a5 5 0 0 0 10 0V3"/><path d="M10 13v2a4.5 4.5 0 0 0 9 0v-2"/><circle cx="19" cy="11" r="2"/>',
  vitals: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  meds: '<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="M9.5 9.5l5 5"/>',
  report: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  settings: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  chev: '<path d="M9 18l6-6-6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  ask: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  fax: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  flow: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="12" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8.5 6H13a3 3 0 0 1 3 3v.5M8.5 18H13a3 3 0 0 0 3-3v-.5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  sound: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  mute: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${PATHS[n]}</svg>`;

// ---------- toast + bottom sheet (replace alert / confirm / prompt) ----------
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// sheet({ title, body, input, chips, actions: [{ label, value, cls }] }) -> Promise<{ value, text } | null>
function sheet({ title, body = '', input = null, chips = [], actions }) {
  const wrap = $('#sheet');
  wrap.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <h3>${esc(title)}</h3>
    ${body ? `<p class="muted">${body}</p>` : ''}
    ${chips.length ? `<div class="toggles" style="margin-top:10px">${chips.map(c => `<button class="toggle" type="button" data-chip="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
    ${input ? (input.multiline
      ? `<textarea id="sheetInput" style="margin-top:12px;min-height:200px" ${input.readonly ? 'readonly' : ''}>${esc(input.value || '')}</textarea>`
      : `<input id="sheetInput" style="margin-top:12px" placeholder="${esc(input.placeholder || '')}" value="${esc(input.value || '')}">`) : ''}
    <div class="acts-v">${actions.map((a, i) => `<button type="button" class="block ${a.cls || ''}" data-i="${i}">${esc(a.label)}</button>`).join('')}</div>
  </div>`;
  wrap.hidden = false;
  return new Promise(resolve => {
    const done = v => { wrap.hidden = true; wrap.innerHTML = ''; resolve(v); };
    const field = wrap.querySelector('#sheetInput');
    wrap.querySelectorAll('[data-chip]').forEach(c => c.onclick = () => { if (field) field.value = c.dataset.chip; });
    wrap.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
      const a = actions[Number(b.dataset.i)];
      done(a.value == null ? null : { value: a.value, text: field ? field.value.trim() : '' });
    });
    wrap.onclick = e => { if (e.target === wrap) done(null); };
  });
}

// ---------- app bar ----------
function mmss(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${m}:${ss}` : `${m}:${ss}`;
}
function tick() {
  const now = Date.now();
  $('#elapsed').textContent = mmss(now - (call.milestones.patientContact || call.startedAt));
  const lastV = call.vitals[call.vitals.length - 1];
  const btn = $('#reassessBtn');
  btn.hidden = !lastV;
  if (!lastV) return;
  const left = lastV.t + REASSESS_MS[reassessMode] - now;
  $('#reassessLeft').textContent = left > 0 ? mmss(left) : 'DUE';
  btn.classList.toggle('due', left <= 0);
}

const SEX_WORD = { M: 'Male', F: 'Female', X: 'Sex other/unknown' };
function renderHeader() {
  const p = call.patient;
  const age = p.age !== '' && p.age != null ? `${p.age} ${p.ageUnit === 'yr' ? 'yo' : p.ageUnit}` : '';
  const who = [age, SEX_WORD[p.sex]].filter(Boolean).join(' · ');
  $('#ptLine').textContent = who || 'New call';
  $('#ptSub').textContent = call.chiefComplaint || (who ? 'Add chief complaint' : 'Tap to add age and complaint');
  $('#levelChip').textContent = settings.myLevel;
  $('#cprBtn').classList.toggle('live', !!call.cpr && !call.cpr.rosc);
  $('#cprBtn').textContent = call.cpr ? (call.cpr.rosc ? 'ROSC' : 'CPR ON') : 'CPR';
}
$('#settingsBtn').innerHTML = icon('settings');
$('#clockIcon').innerHTML = icon('clock');
$('#reassessIcon').innerHTML = icon('heart');
$('#ptBtn').addEventListener('click', () => go('call'));
$('#reassessBtn').addEventListener('click', () => go('vitals'));
$('#cprBtn').addEventListener('click', () => { if (tab !== 'cpr') returnTab = tab; go('cpr'); });
$('#settingsBtn').addEventListener('click', () => { if (tab !== 'settings') returnTab = tab; go('settings'); });

function renderFlags() {
  const flags = E.redFlags(call);
  $('#flags').innerHTML = flags.map(f => `<div class="flag">${icon('alert')}<span>${esc(f)}</span></div>`).join('');
}

// Shared UI pieces
const seg = (name, options, cur, cls = '') => `<div class="seg ${cls}" role="group">${options.map(([v, l]) =>
  `<button type="button" data-seg="${name}" data-val="${esc(v)}" class="${String(cur) === String(v) ? 'on' : ''}" aria-pressed="${String(cur) === String(v)}">${esc(l)}</button>`).join('')}</div>`;
const head = (title, right = '') => `<div class="screen-head"><h1>${esc(title)}</h1>${right}</div>`;
const warn = text => `<div class="unverified">${icon('alert')}<span>${esc(text)}</span></div>`;
function bindSeg(name, fn) { view.querySelectorAll(`[data-seg="${name}"]`).forEach(b => b.onclick = () => fn(b.dataset.val)); }

// ---------- CALL ----------
function renderCall() {
  const p = call.patient;
  const matches = matchProtocols(call.chiefComplaint);
  const nextMs = E.MILESTONES.find(([k]) => !call.milestones[k])?.[0];
  return `
  ${head('Call')}
  <div class="card">
    <div class="steps">${E.MILESTONES.map(([k, label]) => {
      const t = call.milestones[k];
      return `<button type="button" class="step ${t ? 'set' : ''} ${k === nextMs ? 'next' : ''}" data-ms="${k}">
        <span class="dot">${t ? icon('check') : ''}</span>${esc(label)}${t ? `<small>${E.hhmm(t)}</small>` : ''}</button>`;
    }).join('')}</div>
  </div>

  <h2>Patient</h2>
  <div class="card">
    <div class="field-row">
      <div><label for="age">Age</label><input id="age" inputmode="numeric" value="${esc(p.age)}" placeholder="e.g. 67"></div>
      <div><span class="label">Unit</span>${seg('ageUnit', [['yr', 'Years'], ['mo', 'Mo'], ['day', 'Days']], p.ageUnit)}</div>
    </div>
    <span class="label">Sex</span>
    ${seg('sex', [['M', 'Male'], ['F', 'Female'], ['X', 'Other / unk']], p.sex)}
    <label for="cc">Chief complaint (patient's words)</label>
    <input id="cc" value="${esc(call.chiefComplaint)}" placeholder="e.g. chest pressure" enterkeyhint="done">
    ${matches.length ? `<div class="suggest">${matches.map(m => `<button type="button" class="list-row" data-open="${m.id}">${icon('flow')}<span class="grow">Open ${esc(m.title)}</span>${icon('chev', 'chev')}</button>`).join('')}</div>` : ''}
    <p class="hint">No names, DOB, or addresses. The app keeps age and sex only.</p>
  </div>

  <button type="button" class="primary big block" data-open="assessment">${icon('assess')}Start primary survey</button>

  <h2>Details</h2>
  <div class="card">
    <label for="dispatch" style="margin-top:0">Dispatched as</label>
    <input id="dispatch" value="${esc(call.dispatch)}" placeholder="e.g. difficulty breathing">
    <label for="moi">MOI / NOI</label>
    <input id="moi" value="${esc(call.moi)}" placeholder="e.g. fall from standing / sudden SOB">
    <p class="hint">No street names or locations.</p>
    <label for="dest">Destination</label>
    <input id="dest" value="${esc(call.destination)}" placeholder="e.g. Monadnock Community Hospital">
    <label for="notes">Notes (stay on this phone, never faxed)</label>
    <textarea id="notes">${esc(call.notes)}</textarea>
  </div>

  <button type="button" class="text-danger block" id="endCall" style="margin-top:12px">End call and erase data</button>`;
}

function matchProtocols(text) {
  const t = (text || '').toLowerCase().trim();
  if (t.length < 3) return [];
  return PROTOCOLS.filter(p => p.id !== 'assessment' && p.keywords.some(k => t.includes(k) || k.includes(t)));
}

function bindCall() {
  view.querySelectorAll('[data-ms]').forEach(b => b.onclick = async () => {
    const k = b.dataset.ms;
    if (call.milestones[k]) {
      const label = E.MILESTONES.find(m => m[0] === k)[1];
      const r = await sheet({ title: `${label} at ${E.hhmm(call.milestones[k])}`, body: 'Stamp it again with the current time?', actions: [{ label: 'Re-stamp now', value: 1, cls: 'primary' }, { label: 'Keep', value: null }] });
      if (!r) return;
    }
    E.setMilestone(call, k); commitQuiet();
  });
  const field = (id, fn) => { const el = $('#' + id); el.oninput = el.onchange = () => { fn(el.value); save(); renderHeader(); }; };
  field('age', v => call.patient.age = v);
  field('dispatch', v => call.dispatch = v);
  field('dest', v => call.destination = v);
  field('notes', v => call.notes = v);
  field('moi', v => call.moi = v);
  bindSeg('ageUnit', v => { call.patient.ageUnit = v; commitQuiet(); });
  bindSeg('sex', v => { call.patient.sex = v; commitQuiet(); });
  $('#cc').onchange = () => { call.chiefComplaint = $('#cc').value; commitQuiet(); };
  $('#endCall').onclick = async () => {
    const r = await sheet({ title: 'End this call?', body: 'All patient data is erased from this phone. Copy the handoff report first if you need it.', actions: [{ label: 'Erase and start new call', value: 1, cls: 'danger' }, { label: 'Cancel', value: null }] });
    if (!r) return;
    metronome(false);
    call = E.newCall();
    call.moi = '';
    call.prearrival = { etaMin: '', level: 'BLS', alerts: [], requests: [], sentAt: null };
    try { localStorage.removeItem(STORE); } catch { /* ignore */ }
    go('call');
    toast('Call erased');
  };
}

// ---------- ASSESS: protocols + history ----------
function renderAssess() {
  const p = call.active && BY_ID[call.active];
  if (assessView === 'protocols' && p) return renderStep(p);
  return `${head('Assess')}
  ${seg('assessView', [['protocols', 'Protocols'], ['history', 'OPQRST / SAMPLE']], assessView, 'top')}
  ${assessView === 'protocols' ? renderProtocolList() : renderHistory()}`;
}

function protoState(id) {
  const run = call.runs[id];
  return run ? (run.done ? '<span class="pill done">Done</span>' : '<span class="pill prog">In progress</span>') : '';
}

function renderProtocolList() {
  const first = PROTOCOLS.find(x => x.id === 'assessment');
  const rest = PROTOCOLS.filter(x => x.id !== 'assessment');
  const row = (x, feature = false) => `<button type="button" class="list-row ${feature ? 'feature' : ''}" data-open="${x.id}">
    <span class="lead">${icon(feature ? 'assess' : 'flow')}</span>
    <span class="grow">${esc(x.title)}<span class="sub">NH ${esc(x.source?.section || 'v9.3')}</span></span>
    ${protoState(x.id)}${icon('chev', 'chev')}</button>`;
  const imp = E.impressions(call).slice(0, 5);
  return `
  ${first ? `<div class="list">${row(first, true)}</div>` : ''}
  <h2>Complaint protocols</h2>
  <div class="list">${rest.map(x => row(x)).join('')}</div>
  ${imp.length ? considerCard(imp) : ''}`;
}

function considerCard(imp) {
  return `<div class="card consider"><h3>Consider</h3><ol>${imp.map(i => `<li>${esc(i.name)} <span class="muted small">(${i.score})</span></li>`).join('')}</ol>
    <p class="hint">Field impressions ranked by matching findings. A prompt to think, not a diagnosis.</p></div>`;
}

function renderStep(p) {
  const run = call.runs[p.id];
  const node = E.currentNode(call, p);
  const top = `<div class="flow-top">
    <button type="button" class="ghost" data-list>${icon('back')}Protocols</button>
    <span class="title">${esc(p.title)}</span></div>`;
  const banner = p.verified ? '' : warn('Unverified against NH v9.3. Follow the official protocol.');
  let body;
  if (!node) {
    const missed = E.missedActions(call, p);
    body = `<div class="card step-card">
      <div class="meta"><span class="pill done">Complete</span></div>
      <div class="node-title">${esc(p.title)}</div>
      ${missed.length
        ? `<div class="verify" style="margin-top:14px">${icon('alert')}<span>Critical steps not done</span></div><ul class="missed">${missed.map(m => `<li>${esc(m.text)} <span class="muted small">(${esc(m.status)})</span></li>`).join('')}</ul>`
        : `<div class="notice-ok">All critical steps on this path recorded.</div>`}
      <div class="acts"><button type="button" class="quiet" data-back>${icon('back')}Back a step</button><button type="button" class="primary" data-list>Protocols</button>
      <button type="button" class="quiet wide" data-goto="report">Go to report</button></div></div>`;
  } else {
    const above = node.type === 'action' && E.aboveLevel(node.level, settings.myLevel);
    const stepNo = run.history.length + 1;
    body = `<div class="card step-card">
      <div class="meta">
        <span class="pill">Step ${stepNo}</span>
        ${node.level ? `<span class="pill lvl-${esc(node.level)}">${esc(node.level)}</span>` : ''}
        ${node.cite ? `<span class="muted">NH ${esc(node.cite)}</span>` : ''}
      </div>
      <div class="node-title">${esc(node.text)}</div>
      ${above ? `<div class="verify">${icon('alert')}<span>${esc(node.level)} skill, above your level (${esc(settings.myLevel)}). Request ALS or let the ${esc(node.level)} on scene do it.</span></div>` : ''}
      ${node.ask ? `<div class="ask">${icon('ask')}<div><small>Ask</small>"${esc(node.ask)}"</div></div>` : ''}
      ${node.help ? `<p class="muted">${esc(node.help)}</p>` : ''}
      ${node.detail ? `<p>${esc(node.detail)}</p>` : ''}
      ${node.items ? `<ul class="items">${node.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      ${node.dose ? `<div class="dose">${esc(node.dose)}</div>` : ''}
      ${node.verify ? `<div class="verify">${icon('alert')}<span>Verify: ${esc(node.verify)}</span></div>` : ''}
      ${nodeButtons(node, above)}
      ${run.history.length ? `<button type="button" class="ghost block" data-back style="margin-top:8px">${icon('back')}Previous step</button>` : ''}
    </div>`;
  }
  const imp = E.impressions(call).slice(0, 5);
  return `${top}${banner}${body}${imp.length ? considerCard(imp) : ''}
    <p class="hint" style="text-align:center">Source: ${esc(p.source.doc)}${p.source.section ? `, ${esc(p.source.section)}` : ''}${p.source.page ? `, ${esc(p.source.page)}` : ''}</p>`;
}

function nodeButtons(node, above = false) {
  if (node.type === 'question') return `<div class="answers">${node.answers.map((a, i) => `<button type="button" class="answer" data-answer="${i}"><span>${esc(a.label)}</span>${icon('chev')}</button>`).join('')}</div>`;
  if (node.type === 'action' && above) return `<div class="acts">
    <button type="button" class="primary wide big" data-act="above-level">ALS requested</button>
    <button type="button" class="quiet" data-act="done">Done by ALS</button>
    <button type="button" class="quiet" data-act="not-done">Not done</button></div>`;
  if (node.type === 'action') return `<div class="acts">
    <button type="button" class="ok wide big" data-act="done">${icon('check')}Done</button>
    <button type="button" class="quiet" data-act="not-done">Not done</button>
    <button type="button" class="quiet" data-act="contraindicated">Refused / CI</button></div>`;
  return `<div class="answers"><button type="button" class="primary big" data-ack>Continue</button></div>`;
}

const REASONS = {
  'not-done': ['Not indicated', 'No time before arrival', 'Equipment not available', 'Unable to perform'],
  contraindicated: ['Patient refused', 'Contraindicated', 'Allergy', 'Already taken'],
};

function bindAssess() {
  bindSeg('assessView', v => { assessView = v; render(); });
  view.querySelectorAll('[data-list]').forEach(b => b.onclick = () => { call.active = null; commit(); });
  view.querySelectorAll('[data-goto]').forEach(b => b.onclick = () => { reportView = 'handoff'; go(b.dataset.goto); });
  if (assessView === 'history') return bindHistory();
  const p = call.active && BY_ID[call.active];
  if (!p) return;
  view.querySelectorAll('[data-answer]').forEach(b => b.onclick = () => { E.answer(call, p, Number(b.dataset.answer)); commit(); });
  view.querySelectorAll('[data-act]').forEach(b => b.onclick = async () => {
    const status = b.dataset.act;
    let note = '';
    if (status === 'not-done' || status === 'contraindicated') {
      const r = await sheet({
        title: status === 'not-done' ? 'Why not done?' : 'Refused or contraindicated',
        body: 'Optional. Shows in the handoff report.',
        chips: REASONS[status],
        input: { placeholder: 'Reason (optional)' },
        actions: [{ label: 'Save', value: 1, cls: 'primary' }, { label: 'Cancel', value: null }],
      });
      if (!r) return;
      note = r.text;
    }
    E.completeAction(call, p, status, note);
    commit();
  });
  view.querySelectorAll('[data-ack]').forEach(b => b.onclick = () => { E.acknowledge(call, p); commit(); });
  view.querySelectorAll('[data-back]').forEach(b => b.onclick = () => { E.back(call, p); commit(); });
}

function renderHistory() {
  const block = (title, rows, prefix) => `<h2>${title}</h2><div class="card">${rows.map(([k, label, ask], i) => `
    <label for="h-${prefix}${k}" ${i === 0 ? 'style="margin-top:0"' : ''}>${k} · ${label}</label>
    <div class="ask" style="margin:0 0 6px;font-size:15px;padding:8px 12px">${icon('ask', 'sm')}<span>"${esc(ask)}"</span></div>
    <input id="h-${prefix}${k}" data-h="${prefix}${k}" value="${esc(call.history[prefix + k])}">`).join('')}</div>`;
  return `${block('OPQRST', OPQRST, 'opqrst')}${block('SAMPLE', SAMPLE, 'sample')}
    <p class="hint">History stays on this phone and in the handoff text. It is never faxed.</p>`;
}
function bindHistory() {
  view.querySelectorAll('[data-h]').forEach(el => el.oninput = () => { call.history[el.dataset.h] = el.value; save(); });
}

// ---------- VITALS ----------
function renderVitals() {
  const years = E.ageInYears(call.patient);
  const last = call.vitals[call.vitals.length - 1];
  const num = (id, label, ph = '') => `<div><label for="v-${id}">${label}</label><input id="v-${id}" inputmode="numeric" placeholder="${ph}"></div>`;
  let tiles = '';
  if (last) {
    const flags = Object.fromEntries(E.vitalFlags(last, years).map(f => [f.field, f.level]));
    const gcs = [last.gcsE, last.gcsV, last.gcsM].every(x => x != null) ? last.gcsE + last.gcsV + last.gcsM : last.gcs;
    const t = (k, label, val) => `<div class="tile ${flags[k] ? 'v-' + flags[k] : ''}"><small>${label}</small><b>${val ?? '--'}</b></div>`;
    tiles = `<h2>Latest · ${E.hhmm(last.t)}</h2><div class="tiles">
      ${t('sbp', 'BP', last.sbp != null ? `${last.sbp}${last.dbp != null ? '/' + last.dbp : ''}` : null)}
      ${t('hr', 'Pulse', last.hr)}${t('rr', 'Resp', last.rr)}
      ${t('spo2', 'SpO2', last.spo2 != null ? last.spo2 + '%' : null)}${t('bgl', 'BGL', last.bgl)}${t('gcs', 'GCS', gcs)}
    </div>`;
  }
  const rows = call.vitals.slice().reverse().map(v => {
    const flags = Object.fromEntries(E.vitalFlags(v, years).map(f => [f.field, f.level]));
    const c = k => flags[k] ? `v-${flags[k]}` : '';
    return `<tr><td>${E.hhmm(v.t)}</td>
      <td class="${c('sbp')}">${v.sbp ?? ''}${v.dbp != null ? '/' + v.dbp : ''}</td>
      <td class="${c('hr')}">${v.hr ?? ''}</td><td class="${c('rr')}">${v.rr ?? ''}</td>
      <td class="${c('spo2')}">${v.spo2 ?? ''}</td><td class="${c('gcs')}">${v.gcs ?? ''}</td>
      <td class="${c('bgl')}">${v.bgl ?? ''}</td></tr>`;
  }).join('');
  return `
  ${head('Vitals', `<span class="muted small">${call.vitals.length} set${call.vitals.length === 1 ? '' : 's'}</span>`)}
  ${last ? '' : `<div class="card empty">${icon('vitals')}<p>No vitals yet. The reassess timer starts after the first set.</p></div>`}
  ${tiles}
  <h2>New set</h2>
  <div class="card">
    <div class="field-row three" style="grid-template-columns:1fr 1fr 1fr">
      ${num('sbp', 'BP sys', '120')}${num('dbp', 'BP dia', '80')}${num('hr', 'Pulse', '80')}
      ${num('rr', 'Resp', '16')}${num('spo2', 'SpO2 %', '98')}${num('bgl', 'BGL', 'mg/dL')}
    </div>
    <div class="field-row three" style="grid-template-columns:1fr 1fr 1fr">
      ${num('gcsE', 'GCS E', '1-4')}${num('gcsV', 'GCS V', '1-5')}${num('gcsM', 'GCS M', '1-6')}
    </div>
    <div class="gcs-total"><span>GCS total</span><span id="gcsTotal">--</span></div>
    <div class="field-row">
      ${num('pain', 'Pain 0-10', '0-10')}
      <div><label for="v-pupils">Pupils</label><input id="v-pupils" placeholder="PERRL"></div>
    </div>
    <label for="v-skin">Skin</label><input id="v-skin" placeholder="e.g. pale, cool, diaphoretic">
    <label for="v-lungs">Lung sounds</label><input id="v-lungs" placeholder="e.g. clear bilaterally">
    <button type="button" class="primary big block" id="saveVitals" style="margin-top:16px">${icon('plus')}Save vitals</button>
    <span class="label">Reassess timer</span>${seg('reMode', [['stable', 'Stable · 15 min'], ['unstable', 'Unstable · 5 min']], reassessMode)}
    ${years != null && years < 18 ? '<p class="hint">Pediatric patient: values are not auto-flagged. Use Meds &gt; Peds bands for normal ranges.</p>' : ''}
  </div>
  ${rows ? `<h2>Trend</h2><div class="card table-wrap"><table class="vitals"><thead><tr><th>Time</th><th>BP</th><th>HR</th><th>RR</th><th>SpO2</th><th>GCS</th><th>BGL</th></tr></thead><tbody>${rows}</tbody></table></div>` : ''}`;
}

function bindVitals() {
  const gcs = () => {
    const vals = ['gcsE', 'gcsV', 'gcsM'].map(k => Number($('#v-' + k).value));
    $('#gcsTotal').textContent = vals.every(n => n > 0) ? vals.reduce((a, b) => a + b, 0) : '--';
  };
  ['gcsE', 'gcsV', 'gcsM'].forEach(k => $('#v-' + k).oninput = gcs);
  bindSeg('reMode', v => { reassessMode = v; renderKeep(); });
  $('#saveVitals').onclick = () => {
    const input = {};
    for (const k of ['sbp', 'dbp', 'hr', 'rr', 'spo2', 'bgl', 'gcsE', 'gcsV', 'gcsM', 'pain', 'skin', 'pupils', 'lungs']) input[k] = $('#v-' + k).value.trim();
    if (!Object.values(input).some(Boolean)) { toast('Enter at least one value'); return; }
    E.addVitals(call, input);
    commit();
    toast(`Vitals saved ${E.hhmm(Date.now())}`);
  };
}

// ---------- REPORT: handoff + pre-arrival ----------
function renderReportTab() {
  return `${head('Report')}
  ${seg('reportView', [['handoff', 'RN handoff'], ['ed', 'Pre-arrival to ED']], reportView, 'top')}
  ${reportView === 'handoff' ? renderHandoff() : renderPrearrival()}`;
}
function bindReportTab() {
  bindSeg('reportView', v => { reportView = v; render(); });
  (reportView === 'handoff' ? bindHandoff : bindPrearrival)();
}

function allMissed() {
  return Object.keys(call.runs).flatMap(id => E.missedActions(call, BY_ID[id]).map(m => `${BY_ID[id].title}: ${m.text}`));
}

function renderHandoff() {
  const r = E.buildReport(call, BY_ID);
  const missed = allMissed();
  return `
  ${missed.length ? `<div class="card"><div class="verify" style="margin:0">${icon('alert')}<span>Check before handoff</span></div><ul class="missed">${missed.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
  <div class="card">
    <div class="mist">${r.sections.map(([k, label, body]) => `<div class="mist-row"><span class="k">${k}</span><div class="v"><b>${esc(label)}</b>${esc(body)}</div></div>`).join('')}</div>
    ${r.impressions.length ? `<p style="margin-top:14px"><b>Field impression:</b> ${esc(r.impressions.join(', '))}</p>` : ''}
    ${r.history ? `<p>${esc(r.history)}</p>` : ''}
    ${call.notes ? `<p><b>Notes:</b> ${esc(call.notes)}</p>` : ''}
    ${r.flags.length ? `<p class="v-critical">Red flags: ${esc(r.flags.join('; '))}</p>` : ''}
  </div>
  <button type="button" class="primary big block" id="copyReport">${icon('copy')}Copy report text</button>
  <h2>Timeline</h2>
  <div class="card">${call.events.length ? `<ul class="timeline">${call.events.map(e => `<li><time>${E.hhmm(e.t)}</time><span>${esc(e.text)}${e.value ? ': ' + esc(e.value) : ''}${e.status && e.status !== 'done' ? ` <span class="pill">${esc(e.status)}</span>` : ''}</span></li>`).join('')}</ul>` : '<p class="muted">Nothing recorded yet.</p>'}</div>`;
}
function bindHandoff() {
  $('#copyReport').onclick = async () => {
    const text = E.buildReport(call, BY_ID).text;
    try { await navigator.clipboard.writeText(text); toast('Report copied'); }
    catch { sheet({ title: 'Copy this text', body: 'Press and hold to select all, then copy.', input: { multiline: true, readonly: true, value: text }, actions: [{ label: 'Close', value: null }] }); }
  };
}

function renderPrearrival() {
  const pa = call.prearrival;
  const r = buildPrearrival(call, settings, BY_ID);
  const tog = (list, key, cls = '') => `<div class="toggles">${list.map(x => `<button type="button" class="toggle ${cls}" data-${key}="${esc(x)}" aria-pressed="${pa[key].includes(x)}">${esc(x)}</button>`).join('')}</div>`;
  const fx = pa.fax;
  const status = fx ? `<div class="fax-status ${fx.state}">${fx.state === 'pending' ? '<span class="spinner"></span>' : icon(fx.state === 'sent' ? 'check' : 'alert')}
    <div><b>${fx.state === 'sent' ? 'Fax delivered' : fx.state === 'failed' ? 'Fax failed' : 'Sending fax'}</b>${esc(fx.text)}</div></div>` : '';
  return `
  ${settings.testMode ? `<div class="test-banner">${icon('alert', 'sm')}TEST MODE · stamped "NOT A PATIENT"</div>` : ''}
  <p class="muted" style="margin:10px 4px">Send 5 to 10 min out. Age, sex, and clinical data only. Notes and history are never included.</p>
  <div class="card">
    <div class="field-row">
      <div><label for="eta">ETA (min)</label><input id="eta" inputmode="numeric" value="${esc(pa.etaMin)}" placeholder="e.g. 8"></div>
      <div><span class="label">Care level</span>${seg('lvl', [['BLS', 'BLS'], ['AEMT', 'AEMT'], ['ALS', 'ALS']], pa.level)}</div>
    </div>
    <span class="label">Alerts</span>${tog(ALERTS, 'alerts', 'alert')}
    <span class="label">Requests</span>${tog(REQUESTS, 'requests')}
  </div>
  <div class="card send-card">
    <button type="button" class="primary big block" id="faxNow" ${fx?.state === 'pending' ? 'disabled' : ''}>${icon('fax')}Fax to ${esc(settings.destination.replace(/ ED$/, ''))}</button>
    <p class="to">${esc(settings.faxNumber || 'No fax number set')}</p>
    ${status}
  </div>
  <details class="fold"><summary>${icon('report')}Preview report</summary><div class="fold-body"><pre class="preview">${esc(r.text)}</pre></div></details>
  <details class="fold"><summary>${icon('share')}Other ways to send</summary><div class="fold-body stack">
    <button type="button" class="quiet block" id="sendGmail">${icon('mail')}Send with Gmail</button>
    <button type="button" class="quiet block" id="sendFax">${icon('mail')}Send with phone Mail app</button>
    <button type="button" class="quiet block" id="sharePdf">${icon('share')}Share PDF</button>
    ${pa.sentAt ? `<p class="hint">Last handed off ${E.hhmm(pa.sentAt)}. For email sends the fax service's receipt arrives in your inbox.</p>` : ''}
  </div></details>
  <button type="button" class="ghost block" data-goto-settings>${icon('settings')}Fax settings</button>`;
}

function bindPrearrival() {
  const pa = call.prearrival;
  $('#eta').oninput = e => { pa.etaMin = e.target.value; save(); };
  $('#eta').onchange = () => renderKeep();
  bindSeg('lvl', v => { pa.level = v; commitQuiet(); });
  for (const key of ['alerts', 'requests']) {
    view.querySelectorAll(`[data-${key}]`).forEach(el => el.onclick = () => {
      const v = el.dataset[key];
      pa[key] = pa[key].includes(v) ? pa[key].filter(x => x !== v) : [...pa[key], v];
      commitQuiet();
    });
  }
  view.querySelector('[data-goto-settings]').onclick = () => { returnTab = 'report'; go('settings'); };
  const needAddress = () => { toast('Set a 10-digit fax number in Settings first'); };
  const markSent = how => {
    pa.sentAt = Date.now();
    call.events.push({ t: pa.sentAt, kind: 'note', text: `Pre-arrival report handed to ${how} for ${settings.destination}` });
    save();
  };
  $('#sendFax').onclick = () => {
    const to = faxAddress(settings);
    if (!to) return needAddress();
    const r = buildPrearrival(call, settings, BY_ID);
    markSent(settings.testMode ? 'email-to-fax, TEST' : 'email-to-fax');
    location.href = mailtoLink(r, to);
  };
  $('#faxNow').onclick = () => faxDirect();
  $('#sendGmail').onclick = () => {
    const to = faxAddress(settings);
    if (!to) return needAddress();
    const r = buildPrearrival(call, settings, BY_ID);
    markSent(settings.testMode ? 'Gmail, TEST' : 'Gmail');
    window.open(gmailLink(r, to, settings.senderEmail), '_blank');
    renderKeep();
  };
  $('#sharePdf').onclick = async () => {
    const r = buildPrearrival(call, settings, BY_ID);
    const file = new File([buildPdf(r.lines)], `prearrival-${E.hhmm(Date.now())}.pdf`, { type: 'application/pdf' });
    try {
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: r.subject }); markSent('shared PDF'); renderKeep(); return; }
    } catch (e) { if (e.name === 'AbortError') return; }
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(file), download: file.name });
    a.click();
    markSent('downloaded PDF');
    renderKeep();
  };
}

// ---------- direct fax through /api/fax (Netlify function -> SRFax API) ----------
function pdfBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

const onFaxScreen = () => tab === 'report' && reportView === 'ed';

async function faxDirect() {
  const pa = call.prearrival;
  const to = settings.faxNumber;
  if (!settings.faxPin) {
    const r = await sheet({ title: 'Fax PIN needed', body: 'Enter the crew fax PIN from your Lieutenant. It is saved on this phone.', input: { placeholder: 'PIN' }, actions: [{ label: 'Save and send', value: 1, cls: 'primary' }, { label: 'Cancel', value: null }] });
    if (!r || !r.text) return;
    settings.faxPin = r.text; saveSettings();
  }
  const r = buildPrearrival(call, settings, BY_ID);
  const setFax = (state, text) => { pa.fax = { ...(pa.fax || {}), state, text }; save(); if (onFaxScreen()) renderKeep(); };
  setFax('pending', `Sending to ${to}...`);
  try {
    const res = await fetch('api/fax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: settings.faxPin, to, subject: r.subject, pdf: pdfBase64(buildPdf(r.lines)) }),
    });
    const data = await res.json().catch(() => ({ ok: false, error: `Server error (HTTP ${res.status})` }));
    if (!data.ok) { setFax('failed', data.error); return; }
    pa.fax.id = data.faxId;
    pa.sentAt = Date.now();
    call.events.push({ t: pa.sentAt, kind: 'note', text: `Pre-arrival faxed to ${settings.destination} (${to}), SRFax #${data.faxId}${settings.testMode ? ', TEST' : ''}` });
    setFax('pending', `Queued with SRFax (#${data.faxId}). Waiting for delivery...`);
    pollFax(data.faxId, 0);
  } catch {
    setFax('failed', 'No connection. Use the radio report; try again when you have signal.');
  }
}

// SRFax statuses: In Progress, Sent, Failed, Sending Email. Poll every 10 s for up to 5 min.
async function pollFax(id, n) {
  const pa = call.prearrival;
  if (!pa.fax || pa.fax.id !== id) return;
  if (n > 30) { pa.fax.text = `Still in progress after 5 min (SRFax #${id}). Check the SRFax email receipt.`; save(); if (onFaxScreen()) renderKeep(); return; }
  await new Promise(ok => setTimeout(ok, 10000));
  try {
    const res = await fetch(`api/fax?id=${encodeURIComponent(id)}`, { headers: { 'X-Fax-Pin': settings.faxPin } });
    const d = await res.json();
    if (d.ok && d.status === 'Sent') {
      pa.fax.state = 'sent'; pa.fax.text = `${d.sent || ''}, ${d.pages || '?'} page(s). SRFax #${id}`;
      call.events.push({ t: Date.now(), kind: 'note', text: `Pre-arrival fax delivered (SRFax #${id})` });
      toast('Pre-arrival fax delivered');
    } else if (d.ok && d.status === 'Failed') {
      pa.fax.state = 'failed'; pa.fax.text = `SRFax could not deliver: ${d.error || 'unknown reason'}. Give a radio report.`;
    } else {
      pa.fax.text = `${d.ok ? d.status : d.error} (SRFax #${id})`;
      save(); if (onFaxScreen()) renderKeep();
      return pollFax(id, n + 1);
    }
    save(); if (onFaxScreen()) renderKeep();
  } catch { return pollFax(id, n + 1); }
}

// ---------- SETTINGS ----------
function renderSettings() {
  return `<div class="flow-top"><button type="button" class="ghost" data-close>${icon('back')}Back</button><span class="title"></span></div>
  ${head('Settings')}
  <p class="muted" style="margin:0 4px">Saved on this phone. No patient data.</p>
  <h2>Me</h2>
  <div class="card">
    <span class="label" style="margin-top:0">License level</span>
    ${seg('myLevel', E.LEVELS.slice(1).map(l => [l, l]), settings.myLevel, 'solid')}
    <p class="hint">Steps above your level show "ALS requested" and are not flagged as missed.</p>
    <span class="label">Reassessment interval</span>
    ${seg('reMode', [['stable', 'Stable · 15 min'], ['unstable', 'Unstable · 5 min']], reassessMode)}
  </div>
  <h2>Pre-arrival report</h2>
  <div class="card">
    <label for="s-unit" style="margin-top:0">Unit name</label><input id="s-unit" value="${esc(settings.unit)}">
    <label for="s-cb">Crew callback number</label><input id="s-cb" inputmode="tel" value="${esc(settings.callback)}">
    <label for="s-dest">Destination</label><input id="s-dest" value="${esc(settings.destination)}">
    <label for="s-reply">JRMA reply fax (printed on the report)</label><input id="s-reply" inputmode="tel" value="${esc(settings.replyFax)}">
    <label class="field-switch">Test mode: stamp "TEST - NOT A PATIENT"<input type="checkbox" id="s-test" ${settings.testMode ? 'checked' : ''}></label>
  </div>
  <h2>Fax</h2>
  <div class="card">
    <label for="s-faxnum" style="margin-top:0">Destination fax number</label><input id="s-faxnum" inputmode="tel" value="${esc(settings.faxNumber)}" placeholder="603-555-0100">
    <label for="s-pin">Fax PIN (from your Lieutenant)</label><input id="s-pin" inputmode="numeric" autocomplete="off" value="${esc(settings.faxPin)}">
    <details class="inline" style="margin-top:10px"><summary>Email-to-fax backup</summary>
      <label for="s-svc">Fax service</label>
      <select id="s-svc">${Object.entries(FAX_SERVICES).map(([k, v]) => `<option value="${k}" ${settings.faxService === k ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}</select>
      ${settings.faxService === 'custom' ? `<label for="s-fax">Full email-to-fax address</label><input id="s-fax" inputmode="email" value="${esc(settings.faxEmail)}">` : ''}
      <label for="s-from">Send from (Gmail registered in SRFax)</label><input id="s-from" inputmode="email" value="${esc(settings.senderEmail)}" placeholder="you@jaffreyrindgeambulance.com">
      <p class="hint">Email goes to <b>${esc(faxAddress(settings) || 'not set')}</b>. The sender must be an SRFax authorized sender with a signed BAA.</p>
    </details>
  </div>
  <p class="hint" style="text-align:center;margin-top:20px">JRMA Field Guide · NH Patient Care Protocols v9.3 · Unverified content is marked</p>`;
}
function bindSettings() {
  view.querySelector('[data-close]').onclick = () => go(returnTab === 'settings' ? 'call' : returnTab);
  bindSeg('myLevel', v => { settings.myLevel = v; saveSettings(); renderKeep(); });
  bindSeg('reMode', v => { reassessMode = v; renderKeep(); });
  const setting = (id, key, rerender = false) => { const el = $('#' + id); if (!el) return; el.onchange = e => { settings[key] = e.target.value.trim(); saveSettings(); if (rerender) renderKeep(); else toast('Saved'); }; };
  setting('s-unit', 'unit'); setting('s-cb', 'callback'); setting('s-dest', 'destination'); setting('s-reply', 'replyFax');
  setting('s-faxnum', 'faxNumber'); setting('s-pin', 'faxPin'); setting('s-from', 'senderEmail', true); setting('s-svc', 'faxService', true); setting('s-fax', 'faxEmail', true);
  $('#s-test').onchange = e => { settings.testMode = e.target.checked; saveSettings(); toast(settings.testMode ? 'Test mode on' : 'Test mode off'); };
}

// ---------- CPR timer (NH 3.2A / 3.2P / 3.6) ----------
let metro = null;
function metronome(on) {
  if (metro) { clearInterval(metro.timer); metro.ctx.close(); metro = null; }
  if (!on) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const beep = () => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 880; g.gain.value = 0.3; o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.05); };
  metro = { ctx, timer: setInterval(beep, 60000 / ARREST.metronome.bpm) };
}

const CPR_BUTTONS = [
  ['check', 'Rhythm / pulse check', 'Restarts the 2-min cycle', 'primary'],
  ['shock', 'Shock delivered', '', ''],
  ['epi', 'Epinephrine given', '', ''],
  ['airway', 'Airway placed', 'BVM / SGA / ETI', ''],
  ['access', 'IV / IO established', '', ''],
  ['rosc', 'ROSC', '', 'ok'],
];
const CPR_TEXT = { check: 'Rhythm/pulse check', shock: 'Defibrillation', epi: 'Epinephrine', airway: 'Advanced airway', access: 'IV/IO access', rosc: 'ROSC', start: 'CPR started', resume: 'CPR resumed (loss of ROSC)' };

function renderCpr() {
  const c = call.cpr;
  const ref = g => ARREST[g];
  const top = `<div class="flow-top"><button type="button" class="ghost" data-close>${icon('back')}Back</button><span class="title">Cardiac arrest</span></div>`;
  if (!c) {
    return `${top}${head('Start CPR timer')}
      ${warn('Unverified extraction of NH v9.3 3.2A / 3.2P / 3.6. Follow the protocol book.')}
      <div class="stack" style="margin-top:12px"><button type="button" class="danger big block" data-cpr-start="adult">Adult</button>
      <button type="button" class="quiet big block" data-cpr-start="pediatric">Pediatric</button></div>
      <p class="hint">Compressions first. ${ARREST.cycleSeconds / 60}-minute cycles; metronome at ${ARREST.metronome.bpm}/min (NH range: ${esc(ARREST.metronome.range.value)}, ${esc(ARREST.metronome.range.cite)}).</p>`;
  }
  const now = Date.now();
  const left = cycleLeft(c, now);
  const epi = epiLeft(c, now);
  const g = ref(c.group);
  const band = call.pedsBand ? bandByColor(call.pedsBand) : null;
  const bandEpi = band && c.group === 'pediatric' ? band.drugs.find(d => /Epinephrine 1:10,000/.test(d.drug)) : null;
  return `${top}
  <div class="cpr-clock ${left <= 0 ? 'due' : left <= 15 ? 'soon' : ''}">
    <div><small>Arrest</small><b id="cprTotal">${cmmss(Math.round((now - c.startedAt) / 1000))}</b></div>
    <div class="main"><small id="cprCycleLabel">${left <= 0 ? 'Analyze now' : 'Next check'}</small><b id="cprCycle">${cmmss(left)}</b></div>
    <div><small>Epi ${epi == null ? '' : epi <= 0 ? 'due' : 'in'}</small><b id="cprEpi">${epi == null ? '--' : epi <= 0 ? 'NOW' : cmmss(epi)}</b></div>
  </div>
  <div class="cpr-stats"><span>${c.group === 'adult' ? 'Adult' : 'Pediatric'}</span><span>Cycles ${c.cycles}</span><span>Shocks ${c.shocks}</span><span>Epi ${c.epiCount}</span></div>
  ${c.rosc ? `<div class="notice-ok">ROSC ${E.hhmm(c.rosc)}: follow 3.4 Post Resuscitative Care</div>` : ''}
  ${milestones(c, now).map(m => `<div class="verify">${icon('alert')}<span>${esc(m.text)} (NH ${esc(m.cite)})</span></div>`).join('')}
  <div class="cpr-btns">${CPR_BUTTONS.map(([k, label, sub, cls]) => k === 'rosc' && c.rosc
    ? `<button type="button" class="danger" data-cpr="resume">Loss of ROSC<small>Resume CPR</small></button>`
    : `<button type="button" class="${cls || 'quiet'}" data-cpr="${k}">${label}${sub ? `<small>${sub}</small>` : ''}</button>`).join('')}</div>
  <button type="button" class="quiet block" id="metro" style="margin-top:10px">${icon(metro ? 'sound' : 'mute')}${metro ? `Metronome on · ${ARREST.metronome.bpm}/min` : 'Metronome off'}</button>
  <details class="fold"><summary>NH reference (${c.group})</summary><div class="fold-body">
    <ul class="items">
      <li><b>Ventilation:</b> ${esc(g.ventilation.value)} <span class="muted small">${esc(g.ventilation.cite)}</span></li>
      ${g.advancedAirway ? `<li><b>Advanced airway:</b> ${esc(g.advancedAirway.value)} <span class="muted small">${esc(g.advancedAirway.cite)}</span></li>` : ''}
      <li><b>Epinephrine (${esc(g.epi.level)}):</b> ${esc(g.epi.src.value)} <span class="muted small">${esc(g.epi.src.cite)}</span></li>
      ${g.epi.src2 ? `<li>${esc(g.epi.src2.value)} <span class="muted small">${esc(g.epi.src2.cite)}</span></li>` : ''}
      ${bandEpi ? `<li><b>${esc(band.color)} band (A3):</b> ${esc(bandEpi.drug)} ${esc(bandEpi.dose)}; defib ${esc(band.energies.defibrillation)}</li>` : ''}
      <li><b>Defibrillation:</b> ${esc(g.defib.value)} <span class="muted small">${esc(g.defib.cite)}</span></li>
      <li><b>Anti-dysrhythmic:</b> ${esc(g.antidysrhythmic.value)} <span class="muted small">${esc(g.antidysrhythmic.cite)}</span></li>
      <li><b>Compressor rotation:</b> ${ARREST.rotation.map(r => `${esc(r.value)} <span class="muted small">(${esc(r.cite)})</span>`).join('; ')}. NH states both.</li>
      <li><b>ETCO2:</b> ${esc(ARREST.etco2.value)} <span class="muted small">${esc(ARREST.etco2.cite)}</span></li>
      <li><b>Reversible causes:</b> ${g.causes.map(x => esc(x.value)).join('; ')}</li>
      <li><b>Mechanical CPR:</b> ${esc(g.mechanical.value)} <span class="muted small">${esc(g.mechanical.cite)}</span></li>
      <li><b>TOR:</b> ${esc(ARREST.torMinimum.value)} <span class="muted small">${esc(ARREST.torMinimum.cite)}</span>. ${esc(ARREST.torExtended.value)}</li>
    </ul></div>
  </details>
  <h2>Arrest log</h2>
  <div class="card"><ul class="timeline">${c.events.slice().reverse().map(e => `<li><time>${E.hhmm(e.t)}</time><span>${esc(e.text)}</span></li>`).join('')}</ul></div>
  <button type="button" class="text-danger block" id="cprEnd">Close CPR timer (log stays in report)</button>`;
}

function cprEvent(kind) {
  const now = Date.now();
  const text = CPR_TEXT[kind];
  cprLog(call.cpr, kind, text, now);
  if (kind === 'resume') call.cpr.rosc = null;
  if (kind !== 'check') call.events.push({ t: now, kind: 'action', protocolId: 'cpr', text, status: 'done', note: '' });
  else call.events.push({ t: now, kind: 'note', text: `Rhythm/pulse check (cycle ${call.cpr.cycles})` });
  save(); renderKeep();
  toast(`${text} · ${E.hhmm(now)}`);
}

function bindCpr() {
  view.querySelector('[data-close]').onclick = () => go(returnTab === 'cpr' ? 'call' : returnTab);
  view.querySelectorAll('[data-cpr-start]').forEach(b => b.onclick = () => {
    call.cpr = newCpr(Date.now(), b.dataset.cprStart);
    cprLog(call.cpr, 'start', `CPR started (${b.dataset.cprStart})`);
    call.events.push({ t: Date.now(), kind: 'action', protocolId: 'cpr', text: 'CPR started', status: 'done', note: '' });
    metronome(true); save(); render();
  });
  view.querySelectorAll('[data-cpr]').forEach(b => b.onclick = () => cprEvent(b.dataset.cpr));
  const m = $('#metro'); if (m) m.onclick = () => { metronome(!metro); renderKeep(); };
  const end = $('#cprEnd'); if (end) end.onclick = async () => {
    const r = await sheet({ title: 'Close the CPR timer?', body: 'The arrest log stays in the handoff report.', actions: [{ label: 'Close timer', value: 1, cls: 'danger' }, { label: 'Keep running', value: null }] });
    if (!r) return;
    metronome(false); call.cpr = null; save(); reportView = 'handoff'; go('report');
  };
}

// Live clock updates without re-rendering the buttons.
function tickCpr() {
  if (tab !== 'cpr' || !call.cpr) return;
  const c = call.cpr, now = Date.now(), left = cycleLeft(c, now), epi = epiLeft(c, now);
  // Re-render when a prompt or label changes; otherwise only update the numbers.
  const state = `${left <= 0}|${left <= 15}|${epi != null && epi <= 0}|${milestones(c, now).length}`;
  if (state !== tickCpr.last) { tickCpr.last = state; renderKeep(); return; }
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('cprTotal', cmmss(Math.round((now - c.startedAt) / 1000)));
  set('cprCycle', cmmss(left));
  set('cprEpi', epi == null ? '--' : epi <= 0 ? 'NOW' : cmmss(epi));
}

// ---------- MEDS: peds bands + dose lookup (NH v9.3 A3 / protocols) ----------
const SWATCH = { Gray: '#9ca3af', Pink: '#f9a8d4', Red: '#ef4444', Purple: '#a855f7', Yellow: '#facc15', White: '#ffffff', Blue: '#3b82f6', Orange: '#f97316', Green: '#22c55e' };
const DARK_TEXT = new Set(['Gray', 'Pink', 'Yellow', 'White', 'Orange', 'Green']);

function renderMeds() {
  return `${head('Meds')}
  ${seg('mv', [['bands', 'Peds color bands'], ['lookup', 'Dose lookup']], medsView, 'top')}
  ${medsView === 'bands' ? renderPeds() : renderDoseLookup()}`;
}
function bindMeds() {
  bindSeg('mv', v => { medsView = v; render(); });
  (medsView === 'bands' ? bindPeds : bindDoseLookup)();
}

function renderDoseLookup() {
  const { q, level, group } = doseQuery;
  const hits = q.trim().length >= 2 ? searchDoses(q, { level, group }) : [];
  return `
  ${warn('Unverified extraction of NH v9.3 protocols and Appendix A2. Values as printed. Give only within your license level.')}
  <div class="card">
    <div class="search">${icon('search')}<input id="d-q" type="search" value="${esc(q)}" placeholder="Drug, indication, or protocol (3.5A)" aria-label="Search doses"></div>
    <span class="label">Level stated</span>${seg('d-level', ['All', 'EMT', 'AEMT', 'Paramedic'].map(x => [x, x === 'Paramedic' ? 'Medic' : x]), level)}
    <span class="label">Patient</span>${seg('d-group', ['All', 'Adult', 'Pediatric'].map(x => [x, x]), group)}
    <p class="hint">${q.trim().length >= 2 ? `${hits.length} statement${hits.length === 1 ? '' : 's'}` : 'Type at least 2 letters. Pediatric weight-band doses are under Peds color bands.'}</p>
  </div>
  ${hits.slice(0, 60).map(d => `
  <div class="card dose-card">
    <div class="meta">${d.level ? `<span class="pill lvl-${esc(d.level)}">${esc(d.level)}</span>` : '<span class="pill">Level not stated</span>'}<span class="muted">${esc(d.protocol)} · ${esc(d.page)}</span></div>
    <h3>${esc(d.drug)}</h3>
    <div class="muted">${esc(d.indication)} · ${esc(d.group)}</div>
    <div class="dose">${esc(doseSummary(d))}${d.route ? ` <span class="muted">${esc(d.route)}</span>` : ''}</div>
    <div class="facts">
      ${d.maxSingle ? `<div>Max single: <b>${esc(d.maxSingle)}</b></div>` : ''}
      ${d.maxTotal ? `<div>Max total: <b>${esc(d.maxTotal)}</b></div>` : ''}
      ${d.repeat ? `<div>Repeat: ${esc(d.repeat)}</div>` : ''}
      ${d.concentration ? `<div>Concentration stated: ${esc(d.concentration)}</div>` : ''}
    </div>
    ${d.cautions ? `<div class="verify">${icon('alert')}<span>${esc(d.cautions)}</span></div>` : ''}
    <details class="inline"><summary>Protocol text · ${esc(d.protocolTitle)}</summary><p class="muted">${esc(d.verbatim)}</p></details>
  </div>`).join('')}
  ${hits.length > 60 ? '<p class="hint">Showing first 60. Narrow the search.</p>' : ''}`;
}
function bindDoseLookup() {
  const q = $('#d-q');
  q.oninput = () => { doseQuery.q = q.value; const pos = q.selectionStart; renderKeep(); const n = $('#d-q'); n.focus(); n.setSelectionRange(pos, pos); };
  bindSeg('d-level', v => { doseQuery.level = v; renderKeep(); });
  bindSeg('d-group', v => { doseQuery.group = v; renderKeep(); });
}

function renderPeds() {
  const { kg, cm, q } = pedsLookup;
  const lookup = kg ? bandsForWeight(kg) : cm ? bandForLength(cm) : { bands: [], note: '' };
  const chosen = call.pedsBand ? bandByColor(call.pedsBand) : null;
  const band = chosen || (lookup.bands.length === 1 ? lookup.bands[0] : null);
  const swatch = b => `background:${SWATCH[b.color]};color:${DARK_TEXT.has(b.color) ? '#111' : '#fff'}`;
  const ql = q.trim().toLowerCase();
  const drugs = band ? band.drugs.filter(d => !ql || d.drug.toLowerCase().includes(ql)) : [];
  const kv = (label, val) => `<div><small>${label}</small><b>${esc(val)}</b></div>`;
  return `
  ${warn('Unverified transcription of NH v9.3 Appendix A3. Check the printed page before relying on a value.')}
  <div class="card">
    <div class="field-row">
      <div><label for="p-kg">Weight (kg)</label><input id="p-kg" inputmode="decimal" value="${esc(kg)}"></div>
      <div><label for="p-cm">Length (cm)</label><input id="p-cm" inputmode="decimal" value="${esc(cm)}"></div>
    </div>
    ${lookup.note ? `<div class="verify">${icon('alert')}<span>${esc(lookup.note)}</span></div>` : ''}
    <span class="label">Or tap the tape color</span>
    <div class="swatches">${BANDS.map(b => `<button type="button" class="swatch ${band === b ? 'on' : ''} ${lookup.bands.includes(b) ? 'hint' : ''}" style="${swatch(b)}" data-band="${b.color}">${b.color}</button>`).join('')}</div>
  </div>
  ${band ? `
  <div class="card band">
    <div class="band-head" style="${swatch(band)}">${esc(band.color)} band<small>${esc(band.weightKg)} · ${esc(band.length)} · ${esc(band.ageLabel)}</small></div>
    <div class="band-body">
      <div class="kv">
        ${kv('Heart rate', band.vitals.heartRate)}${kv('Resp', band.vitals.respirations)}
        ${kv('SBP', band.vitals.bpSystolic)}${kv('NS bolus', band.fluids.normalSaline)}
        ${kv('ET tube', band.equipment.etTube)}${kv('Blade', band.equipment.bladeSize)}
        ${kv('Defib', band.energies.defibrillation)}${kv('Cardiovert', band.energies.cardioversion)}
      </div>
      <p class="hint">A3 prints no OPA, NPA, SGA, BVM, suction, IV/IO, or gastric tube sizes: use the length-based tape.</p>
      <div class="search" style="margin-top:12px">${icon('search')}<input id="p-q" type="search" value="${esc(q)}" placeholder="Find drug (epi, midazolam)" aria-label="Find drug"></div>
      ${drugs.map(d => `<div class="drug"><div class="name">${esc(d.drug)}${d.route ? ` <span class="muted small">${esc(d.route)}</span>` : ''}</div>
        <div class="amt">${esc(d.dose)}</div>${d.mL ? `<div class="muted">${esc(d.mL)}</div>` : ''}
        ${d.note ? `<div class="verify">${icon('alert')}<span>Check source: ${esc(d.note)}</span></div>` : ''}</div>`).join('')}
      <p class="hint">${esc(citation(band))}. mL volumes are not printed in A3 except D10, racemic epi, and NS.</p>
    </div>
  </div>` : ''}
  <p class="hint">${esc(A3.pediatricDefinition.verbatim)} (NH 1.0)</p>`;
}

function bindPeds() {
  const kg = $('#p-kg'), cm = $('#p-cm');
  kg.onchange = () => { pedsLookup = { ...pedsLookup, kg: kg.value.trim(), cm: '' }; call.pedsBand = null; renderKeep(); };
  cm.onchange = () => { pedsLookup = { ...pedsLookup, cm: cm.value.trim(), kg: '' }; call.pedsBand = null; renderKeep(); };
  view.querySelectorAll('[data-band]').forEach(b => b.onclick = () => {
    call.pedsBand = b.dataset.band;
    call.events.push({ t: Date.now(), kind: 'note', text: `Pediatric band: ${call.pedsBand}` });
    save(); renderKeep();
  });
  const q = $('#p-q');
  if (q) q.oninput = () => { pedsLookup.q = q.value; const pos = q.selectionStart; renderKeep(); const n = $('#p-q'); n.focus(); n.setSelectionRange(pos, pos); };
}

// ---------- router ----------
const NAV = [['call', 'Call'], ['assess', 'Assess'], ['vitals', 'Vitals'], ['meds', 'Meds'], ['report', 'Report']];
const TABS = {
  call: [renderCall, bindCall],
  assess: [renderAssess, bindAssess],
  vitals: [renderVitals, bindVitals],
  meds: [renderMeds, bindMeds],
  report: [renderReportTab, bindReportTab],
  cpr: [renderCpr, bindCpr],
  settings: [renderSettings, bindSettings],
};

const nav = $('.tabs');
function renderNav() {
  const missed = allMissed().length;
  nav.innerHTML = NAV.map(([k, label]) => `<button type="button" data-tab="${k}" aria-current="${tab === k ? 'page' : 'false'}">${icon(k)}${label}${k === 'report' && missed ? `<span class="badge">${missed}</span>` : ''}</button>`).join('');
  nav.querySelectorAll('button').forEach(b => b.onclick = () => {
    // Tapping Assess while already there returns to the protocol list.
    if (b.dataset.tab === 'assess' && tab === 'assess' && call.active) { call.active = null; save(); }
    go(b.dataset.tab);
  });
}

function go(next) { tab = next; render(); window.scrollTo(0, 0); }

function render() {
  const [r, b] = TABS[tab];
  view.innerHTML = r();
  b();
  view.querySelectorAll('[data-open]').forEach(btn => btn.onclick = () => {
    E.startProtocol(call, BY_ID[btn.dataset.open]);
    assessView = 'protocols';
    tab = 'assess';
    commit();
  });
  renderNav();
  renderHeader();
  renderFlags();
  tick();
}
function commit() { save(); render(); window.scrollTo(0, 0); }
function renderKeep() { const y = window.scrollY; render(); window.scrollTo(0, y); }
// Re-render without jumping to the top.
function commitQuiet() { save(); renderKeep(); }

setInterval(() => { tick(); tickCpr(); }, 1000);
render();

if ('serviceWorker' in navigator) {
  // When an updated service worker takes over, reload once so the page runs the new code.
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !reloaded) { reloaded = true; location.reload(); }
  });
  navigator.serviceWorker.register('sw.js').then(r => r.update()).catch(() => {});
}
