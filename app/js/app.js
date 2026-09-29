import * as E from './engine.js';
import { PROTOCOLS, BY_ID, OPQRST, SAMPLE } from './protocols/index.js';

const STORE = 'emt-call-v1';
const REASSESS_MS = { stable: 15 * 60e3, unstable: 5 * 60e3 };

let call = load() || E.newCall();
let tab = 'call';
let reassessMode = 'stable';

// ---------- persistence (survives reload / app switch; wiped on End Call) ----------
function load() {
  try { return JSON.parse(localStorage.getItem(STORE)); } catch { return null; }
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(call)); } catch { /* storage blocked: call still works in memory */ }
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = sel => document.querySelector(sel);
const view = $('#view');

// ---------- top bar ----------
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
  if (!lastV) { btn.classList.remove('due'); $('#reassessLeft').textContent = ''; return; }
  const left = lastV.t + REASSESS_MS[reassessMode] - now;
  $('#reassessLeft').textContent = left > 0 ? mmss(left) : 'DUE';
  btn.classList.toggle('due', left <= 0);
}
$('#reassessBtn').addEventListener('click', () => { tab = 'vitals'; render(); });

function renderFlags() {
  const flags = E.redFlags(call);
  $('#flags').innerHTML = flags.map(f => `<div class="flag">${esc(f)}</div>`).join('');
}

// ---------- CALL tab ----------
function renderCall() {
  const p = call.patient;
  const matches = matchProtocols(call.chiefComplaint);
  return `
  <h2>Call</h2>
  <div class="card">
    <div class="grid2">
      ${E.MILESTONES.map(([k, label]) => `
        <button class="milestone ${call.milestones[k] ? 'set' : ''}" data-ms="${k}">
          ${label}<small>${call.milestones[k] ? E.hhmm(call.milestones[k]) : 'tap to stamp'}</small>
        </button>`).join('')}
    </div>
  </div>
  <div class="card">
    <p class="muted">No names, DOB, or addresses. This app stores age and sex only.</p>
    <div class="grid3">
      <div><label for="age">Age</label><input id="age" inputmode="numeric" value="${esc(p.age)}"></div>
      <div><label for="ageUnit">Unit</label>
        <select id="ageUnit">${['yr', 'mo', 'day'].map(u => `<option ${p.ageUnit === u ? 'selected' : ''}>${u}</option>`).join('')}</select></div>
      <div><label for="sex">Sex</label>
        <select id="sex">${[['', '-'], ['M', 'Male'], ['F', 'Female'], ['X', 'Other/unk']].map(([v, l]) => `<option value="${v}" ${p.sex === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
    </div>
    <label for="dispatch">Dispatched as</label>
    <input id="dispatch" value="${esc(call.dispatch)}" placeholder="e.g. difficulty breathing">
    <label for="cc">Chief complaint (patient's words)</label>
    <input id="cc" value="${esc(call.chiefComplaint)}" placeholder="e.g. chest pressure">
    ${matches.length ? `<div class="stack" style="margin-top:8px">${matches.map(m => `<button data-open="${m.id}">Open: ${esc(m.title)}</button>`).join('')}</div>` : ''}
    <label for="dest">Destination</label>
    <input id="dest" value="${esc(call.destination)}" placeholder="e.g. Monadnock Community Hospital">
    <label for="notes">Notes (no identifiers)</label>
    <textarea id="notes">${esc(call.notes)}</textarea>
  </div>
  <div class="card row">
    <button class="primary" data-open="assessment">Start primary survey</button>
  </div>
  <div class="card">
    <label for="reMode">Reassessment interval</label>
    <select id="reMode">
      <option value="stable" ${reassessMode === 'stable' ? 'selected' : ''}>Stable: every 15 min</option>
      <option value="unstable" ${reassessMode === 'unstable' ? 'selected' : ''}>Unstable: every 5 min</option>
    </select>
  </div>
  <button class="danger" id="endCall" style="width:100%">End call and erase data</button>`;
}

function matchProtocols(text) {
  const t = (text || '').toLowerCase().trim();
  if (t.length < 3) return [];
  return PROTOCOLS.filter(p => p.id !== 'assessment' && p.keywords.some(k => t.includes(k) || k.includes(t)));
}

function bindCall() {
  view.querySelectorAll('[data-ms]').forEach(b => b.onclick = () => { E.setMilestone(call, b.dataset.ms); commit(); });
  const field = (id, fn) => { const el = $('#' + id); el.oninput = el.onchange = () => { fn(el.value); save(); }; };
  field('age', v => call.patient.age = v);
  field('ageUnit', v => call.patient.ageUnit = v);
  field('sex', v => call.patient.sex = v);
  field('dispatch', v => call.dispatch = v);
  field('dest', v => call.destination = v);
  field('notes', v => call.notes = v);
  $('#cc').onchange = () => { call.chiefComplaint = $('#cc').value; commit(); };
  $('#reMode').onchange = e => { reassessMode = e.target.value; tick(); };
  $('#endCall').onclick = () => {
    if (!confirm('Erase this call from the phone? Copy the report first if you need it.')) return;
    call = E.newCall();
    try { localStorage.removeItem(STORE); } catch { /* ignore */ }
    tab = 'call';
    render();
  };
}

// ---------- PROTOCOL tab ----------
function renderProtocol() {
  const p = call.active && BY_ID[call.active];
  const list = `
    <h2>Protocols</h2>
    <div class="stack">${PROTOCOLS.map(x => {
      const run = call.runs[x.id];
      const state = run ? (run.done ? '<span class="pill done">done</span>' : '<span class="pill">in progress</span>') : '';
      return `<button data-open="${x.id}">${esc(x.title)} ${state}</button>`;
    }).join('')}</div>`;
  if (!p) return list;

  const run = call.runs[p.id];
  const node = E.currentNode(call, p);
  const banner = p.verified ? '' : `<div class="unverified">UNVERIFIED: not yet checked against NH Patient Care Protocols v9.2. Follow the official protocol.</div>`;
  const src = `<p class="muted">Source: ${esc(p.source.doc)}${p.source.section ? `, ${esc(p.source.section)}` : ''}${p.source.page ? `, p. ${esc(p.source.page)}` : ''}</p>`;
  let body;
  if (!node) {
    const missed = E.missedActions(call, p);
    body = `<div class="card"><div class="node-title">${esc(p.title)} complete</div>
      ${missed.length ? `<h3>Critical steps not done</h3><ul class="missed">${missed.map(m => `<li>${esc(m.text)} (${esc(m.status)})</li>`).join('')}</ul>` : '<p>All critical steps on this path recorded.</p>'}
      <div class="row"><button data-back>Back one step</button><button data-list>Other protocols</button></div></div>`;
  } else {
    body = `<div class="card">
      <div class="node-title">${esc(node.text)}</div>
      ${node.ask ? `<div class="ask">"${esc(node.ask)}"</div>` : ''}
      ${node.help ? `<p class="muted">${esc(node.help)}</p>` : ''}
      ${node.detail ? `<p>${esc(node.detail)}</p>` : ''}
      ${node.items ? `<ul class="items">${node.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      ${node.dose ? `<div class="dose">${esc(node.dose)}</div>` : ''}
      ${node.verify ? `<div class="verify">VERIFY: ${esc(node.verify)}</div>` : ''}
      <div class="stack" style="margin-top:12px">${nodeButtons(node)}</div>
      ${run.history.length ? '<button data-back style="margin-top:12px">Back</button>' : ''}
    </div>`;
  }
  const imp = E.impressions(call).slice(0, 5);
  const consider = imp.length ? `<div class="card"><h3>Consider</h3><ol class="impr">${imp.map(i => `<li>${esc(i.name)} <span class="muted">(${i.score})</span></li>`).join('')}</ol>
    <p class="muted">Field impressions ranked by matching findings. A prompt to think, not a diagnosis.</p></div>` : '';
  return `<h2>${esc(p.title)}</h2>${banner}${src}${body}${consider}<button data-list style="width:100%">All protocols</button>`;
}

function nodeButtons(node) {
  if (node.type === 'question') return node.answers.map((a, i) => `<button data-answer="${i}">${esc(a.label)}</button>`).join('');
  if (node.type === 'action') return `
    <button class="primary" data-act="done">Done</button>
    <button data-act="not-done">Not done</button>
    <button data-act="contraindicated">Contraindicated / refused</button>`;
  return '<button class="primary" data-ack>Continue</button>';
}

function bindProtocol() {
  const p = call.active && BY_ID[call.active];
  view.querySelectorAll('[data-answer]').forEach(b => b.onclick = () => { E.answer(call, p, Number(b.dataset.answer)); commit(); });
  view.querySelectorAll('[data-act]').forEach(b => b.onclick = () => {
    const status = b.dataset.act;
    const note = status === 'done' ? '' : (prompt('Reason (optional):') || '');
    E.completeAction(call, p, status, note);
    commit();
  });
  view.querySelectorAll('[data-ack]').forEach(b => b.onclick = () => { E.acknowledge(call, p); commit(); });
  view.querySelectorAll('[data-back]').forEach(b => b.onclick = () => { E.back(call, p); commit(); });
  view.querySelectorAll('[data-list]').forEach(b => b.onclick = () => { call.active = null; commit(); });
}

// ---------- VITALS tab ----------
function renderVitals() {
  const years = E.ageInYears(call.patient);
  const num = (id, label, attrs = '') => `<div><label for="v-${id}">${label}</label><input id="v-${id}" inputmode="numeric" ${attrs}></div>`;
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
  <h2>Vitals</h2>
  <div class="card">
    <div class="grid3">
      ${num('sbp', 'BP sys')}${num('dbp', 'BP dia')}${num('hr', 'Pulse')}
      ${num('rr', 'Resp')}${num('spo2', 'SpO2 %')}${num('bgl', 'BGL mg/dL')}
      ${num('gcsE', 'GCS E (1-4)')}${num('gcsV', 'GCS V (1-5)')}${num('gcsM', 'GCS M (1-6)')}
      ${num('pain', 'Pain 0-10')}
    </div>
    <label for="v-skin">Skin</label><input id="v-skin" placeholder="e.g. pale, cool, diaphoretic">
    <div class="grid2">
      <div><label for="v-pupils">Pupils</label><input id="v-pupils" placeholder="PERRL"></div>
      <div><label for="v-lungs">Lung sounds</label><input id="v-lungs" placeholder="clear bilat"></div>
    </div>
    <button class="primary" id="saveVitals" style="width:100%;margin-top:12px">Save vitals (time-stamped)</button>
    ${years != null && years < 18 ? '<p class="muted">Pediatric patient: abnormal values are not auto-flagged. Use the NH pediatric reference.</p>' : ''}
  </div>
  ${rows ? `<div class="card"><table class="vitals"><thead><tr><th>Time</th><th>BP</th><th>HR</th><th>RR</th><th>SpO2</th><th>GCS</th><th>BGL</th></tr></thead><tbody>${rows}</tbody></table></div>` : ''}`;
}

function bindVitals() {
  $('#saveVitals').onclick = () => {
    const input = {};
    for (const k of ['sbp', 'dbp', 'hr', 'rr', 'spo2', 'bgl', 'gcsE', 'gcsV', 'gcsM', 'pain', 'skin', 'pupils', 'lungs']) input[k] = $('#v-' + k).value.trim();
    E.addVitals(call, input);
    commit();
  };
}

// ---------- HISTORY tab ----------
function renderHistory() {
  const block = (title, rows, prefix) => `<div class="card"><h3>${title}</h3>${rows.map(([k, label, ask]) => `
    <label for="h-${prefix}${k}"><b>${k}</b> ${label}</label>
    <div class="ask">"${esc(ask)}"</div>
    <input id="h-${prefix}${k}" data-h="${prefix}${k}" value="${esc(call.history[prefix + k])}">`).join('')}</div>`;
  return `<h2>History</h2>${block('OPQRST', OPQRST, 'opqrst')}${block('SAMPLE', SAMPLE, 'sample')}`;
}
function bindHistory() {
  view.querySelectorAll('[data-h]').forEach(el => el.oninput = () => { call.history[el.dataset.h] = el.value; save(); });
}

// ---------- REPORT tab ----------
function renderReport() {
  const r = E.buildReport(call, BY_ID);
  const missed = Object.keys(call.runs).flatMap(id => E.missedActions(call, BY_ID[id]).map(m => `${BY_ID[id].title}: ${m.text}`));
  return `
  <h2>RN Handoff (MIST)</h2>
  ${missed.length ? `<div class="card"><h3>Check before handoff</h3><ul class="missed">${missed.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
  <div class="card report">
    ${r.sections.map(([k, label, body]) => `<p><span class="k">${k}</span><b>${label}:</b> ${esc(body)}</p>`).join('')}
    ${r.impressions.length ? `<p><b>Field impression:</b> ${esc(r.impressions.join(', '))}</p>` : ''}
    ${r.history ? `<p>${esc(r.history)}</p>` : ''}
    ${call.notes ? `<p><b>Notes:</b> ${esc(call.notes)}</p>` : ''}
    ${r.flags.length ? `<p class="v-critical">RED FLAGS: ${esc(r.flags.join('; '))}</p>` : ''}
  </div>
  <button class="primary" id="copyReport" style="width:100%">Copy report text</button>
  <div class="card"><h3>Timeline</h3><ul class="items">${call.events.map(e => `<li>${E.hhmm(e.t)} ${esc(e.text)}${e.value ? ': ' + esc(e.value) : ''}${e.status && e.status !== 'done' ? ` [${esc(e.status)}]` : ''}</li>`).join('')}</ul></div>`;
}
function bindReport() {
  $('#copyReport').onclick = async () => {
    const text = E.buildReport(call, BY_ID).text;
    try { await navigator.clipboard.writeText(text); alert('Copied'); } catch { prompt('Copy this text:', text); }
  };
}

// ---------- router ----------
const TABS = {
  call: [renderCall, bindCall],
  protocol: [renderProtocol, bindProtocol],
  vitals: [renderVitals, bindVitals],
  history: [renderHistory, bindHistory],
  report: [renderReport, bindReport],
};

function render() {
  const [r, b] = TABS[tab];
  view.innerHTML = r();
  b();
  view.querySelectorAll('[data-open]').forEach(btn => btn.onclick = () => {
    E.startProtocol(call, BY_ID[btn.dataset.open]);
    tab = 'protocol';
    commit();
  });
  document.querySelectorAll('.tabs button').forEach(btn => btn.setAttribute('aria-current', btn.dataset.tab === tab ? 'page' : 'false'));
  renderFlags();
  tick();
}
function commit() { save(); render(); window.scrollTo(0, 0); }

document.querySelectorAll('.tabs button').forEach(btn => btn.onclick = () => { tab = btn.dataset.tab; render(); window.scrollTo(0, 0); });
setInterval(tick, 1000);
render();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
