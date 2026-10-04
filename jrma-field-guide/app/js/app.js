import * as E from './engine.js';
import { PROTOCOLS, BY_ID, OPQRST, SAMPLE } from './protocols/index.js';
import { ALERTS, REQUESTS, DEFAULT_SETTINGS, buildPrearrival, mailtoLink } from './prearrival.js';
import { buildPdf } from './pdf.js';
import { A3, BANDS, bandsForWeight, bandForLength, bandByColor, citation } from './peds.js';
import { searchDoses, doseSummary } from './doses.js';

const STORE = 'emt-call-v1';
const REASSESS_MS = { stable: 15 * 60e3, unstable: 5 * 60e3 };

const SETTINGS = 'jrma-settings-v1';

let call = load() || E.newCall();
call.moi ??= '';
call.prearrival ??= { etaMin: '', level: 'BLS', alerts: [], requests: [], sentAt: null };
let settings = loadSettings();
let pedsLookup = { kg: '', cm: '', q: '' };
let medsView = 'bands';
let doseQuery = { q: '', level: 'All', group: 'All' };
let tab = 'call';
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
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS) || '{}') }; } catch { return { ...DEFAULT_SETTINGS }; }
}
function saveSettings() {
  try { localStorage.setItem(SETTINGS, JSON.stringify(settings)); } catch { /* ignore */ }
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
    <label for="moi">MOI / NOI (no street names or locations)</label>
    <input id="moi" value="${esc(call.moi)}" placeholder="e.g. MVC rollover, restrained driver / sudden SOB">
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
  field('moi', v => call.moi = v);
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
  const banner = p.verified ? '' : `<div class="unverified">UNVERIFIED: not yet checked against NH Patient Care Protocols v9.3. Follow the official protocol.</div>`;
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

// ---------- PEDS tab (NH v9.3 Appendix A3) ----------
const SWATCH = { Gray: '#9ca3af', Pink: '#f9a8d4', Red: '#ef4444', Purple: '#a855f7', Yellow: '#facc15', White: '#ffffff', Blue: '#3b82f6', Orange: '#f97316', Green: '#22c55e' };
const DARK_TEXT = new Set(['Gray', 'Pink', 'Yellow', 'White', 'Orange', 'Green']);

function renderMeds() {
  const sw = `<div class="seg"><button data-mv="bands" class="${medsView === 'bands' ? 'on' : ''}">Peds color bands</button><button data-mv="lookup" class="${medsView === 'lookup' ? 'on' : ''}">Dose lookup</button></div>`;
  return sw + (medsView === 'bands' ? renderPeds() : renderDoseLookup());
}
function bindMeds() {
  view.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => { medsView = b.dataset.mv; render(); });
  (medsView === 'bands' ? bindPeds : bindDoseLookup)();
}

function renderDoseLookup() {
  const { q, level, group } = doseQuery;
  const hits = q.trim().length >= 2 ? searchDoses(q, { level, group }) : [];
  const opt = (id, list, cur) => `<select id="${id}">${list.map(x => `<option ${x === cur ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
  return `
  <div class="unverified">UNVERIFIED extraction of NH v9.3 protocols and Appendix A2. Values as printed. Confirm against the protocol book; give only within your license level.</div>
  <div class="card">
    <label for="d-q">Drug, indication, or protocol number</label>
    <input id="d-q" value="${esc(q)}" placeholder="e.g. ketamine pain, 3.5A, naloxone">
    <div class="grid2">
      <div><label for="d-level">Level stated</label>${opt('d-level', ['All', 'EMT', 'AEMT', 'Paramedic'], level)}</div>
      <div><label for="d-group">Patient</label>${opt('d-group', ['All', 'Adult', 'Pediatric'], group)}</div>
    </div>
    ${q.trim().length >= 2 ? `<p class="muted">${hits.length} statement${hits.length === 1 ? '' : 's'}</p>` : '<p class="muted">Type at least 2 letters. Pediatric weight-band doses are under Peds color bands.</p>'}
  </div>
  ${hits.slice(0, 60).map(d => `
  <div class="card dose">
    <div class="node-title">${esc(d.drug)}</div>
    <div class="muted">${esc(d.indication)} · ${esc(d.group)}</div>
    <div class="dose">${esc(doseSummary(d))}${d.route ? ` <span class="muted">${esc(d.route)}</span>` : ''}</div>
    ${d.maxSingle ? `<div>Max single: <b>${esc(d.maxSingle)}</b></div>` : ''}
    ${d.maxTotal ? `<div>Max total: <b>${esc(d.maxTotal)}</b></div>` : ''}
    ${d.repeat ? `<div>Repeat: ${esc(d.repeat)}</div>` : ''}
    ${d.concentration ? `<div>Concentration stated: ${esc(d.concentration)}</div>` : ''}
    ${d.cautions ? `<div class="verify">${esc(d.cautions)}</div>` : ''}
    <div class="muted">Level: ${esc(d.level || 'not stated')} · ${esc(d.protocol)} ${esc(d.protocolTitle)} · ${esc(d.page)}</div>
    <details><summary>Protocol text</summary><p>${esc(d.verbatim)}</p></details>
  </div>`).join('')}
  ${hits.length > 60 ? '<p class="muted">Showing first 60. Narrow the search.</p>' : ''}`;
}
function bindDoseLookup() {
  const q = $('#d-q');
  q.oninput = () => { doseQuery.q = q.value; const pos = q.selectionStart; renderKeep(); const n = $('#d-q'); n.focus(); n.setSelectionRange(pos, pos); };
  $('#d-level').onchange = e => { doseQuery.level = e.target.value; renderKeep(); };
  $('#d-group').onchange = e => { doseQuery.group = e.target.value; renderKeep(); };
}

function renderPeds() {
  const { kg, cm, q } = pedsLookup;
  const lookup = kg ? bandsForWeight(kg) : cm ? bandForLength(cm) : { bands: [], note: '' };
  const chosen = call.pedsBand ? bandByColor(call.pedsBand) : null;
  const band = chosen || (lookup.bands.length === 1 ? lookup.bands[0] : null);
  const swatch = b => `background:${SWATCH[b.color]};color:${DARK_TEXT.has(b.color) ? '#111' : '#fff'}`;
  const ql = q.trim().toLowerCase();
  const drugs = band ? band.drugs.filter(d => !ql || d.drug.toLowerCase().includes(ql)) : [];
  return `
  <h2>Pediatric reference</h2>
  <div class="unverified">UNVERIFIED transcription of NH v9.3 Appendix A3. Check the printed page before relying on a value. Give only drugs within your license level and the NH protocol.</div>
  <div class="card">
    <div class="grid2">
      <div><label for="p-kg">Weight (kg)</label><input id="p-kg" inputmode="decimal" value="${esc(kg)}"></div>
      <div><label for="p-cm">Length (cm)</label><input id="p-cm" inputmode="decimal" value="${esc(cm)}"></div>
    </div>
    ${lookup.note ? `<p class="verify">${esc(lookup.note)}</p>` : ''}
    <label>Or tap the tape color</label>
    <div class="swatches">${BANDS.map(b => `<button class="swatch ${band === b ? 'on' : ''} ${lookup.bands.includes(b) ? 'hint' : ''}" style="${swatch(b)}" data-band="${b.color}">${b.color}</button>`).join('')}</div>
  </div>
  ${band ? `
  <div class="card band">
    <div class="band-head" style="${swatch(band)}">${esc(band.color)} · ${esc(band.weightKg)} · ${esc(band.length)} · ${esc(band.ageLabel)}</div>
    <table class="kv">
      <tr><th>HR</th><td>${esc(band.vitals.heartRate)}</td><th>RR</th><td>${esc(band.vitals.respirations)}</td></tr>
      <tr><th>SBP</th><td>${esc(band.vitals.bpSystolic)}</td><th>NS bolus</th><td>${esc(band.fluids.normalSaline)}</td></tr>
      <tr><th>ET tube</th><td>${esc(band.equipment.etTube)}</td><th>Blade</th><td>${esc(band.equipment.bladeSize)}</td></tr>
      <tr><th>Defib</th><td>${esc(band.energies.defibrillation)}</td><th>Cardiovert</th><td>${esc(band.energies.cardioversion)}</td></tr>
    </table>
    <p class="muted">A3 prints no OPA, NPA, SGA, BVM, suction, IV/IO, or gastric tube sizes: use the length-based tape.</p>
    <label for="p-q">Find drug</label><input id="p-q" value="${esc(q)}" placeholder="e.g. epi, midazolam">
    <table class="drugs"><thead><tr><th>Drug</th><th>Dose (as printed)</th></tr></thead><tbody>
      ${drugs.map(d => `<tr><td>${esc(d.drug)}${d.route ? ` <span class="muted">${esc(d.route)}</span>` : ''}</td>
        <td><b>${esc(d.dose)}</b>${d.mL ? `<br>${esc(d.mL)}` : ''}${d.note ? `<div class="verify">CHECK SOURCE: ${esc(d.note)}</div>` : ''}</td></tr>`).join('')}
    </tbody></table>
    <p class="muted">${esc(citation(band))}. mL volumes are not printed in A3 except D10, racemic epi, and NS.</p>
  </div>` : ''}
  <div class="card"><p class="muted">${esc(A3.pediatricDefinition.verbatim)} (NH 1.0)</p></div>`;
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

function renderKeep() { const y = window.scrollY; render(); window.scrollTo(0, y); }

// ---------- PRE-ARRIVAL tab ----------
function renderPrearrival() {
  const pa = call.prearrival;
  const r = buildPrearrival(call, settings, BY_ID);
  const chk = (list, key) => list.map(x => `<label class="chk"><input type="checkbox" data-${key}="${esc(x)}" ${pa[key].includes(x) ? 'checked' : ''}> ${esc(x)}</label>`).join('');
  return `
  <h2>Pre-arrival to ${esc(settings.destination)}</h2>
  <p class="muted">Send 5-10 min out. Age, sex, and clinical data only. Notes and History are never included.</p>
  <div class="card">
    <div class="grid2">
      <div><label for="eta">ETA (minutes)</label><input id="eta" inputmode="numeric" value="${esc(pa.etaMin)}"></div>
      <div><label for="lvl">Care level</label><select id="lvl">${['BLS', 'AEMT', 'ALS'].map(l => `<option ${pa.level === l ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
    </div>
    <h3>Alerts</h3>${chk(ALERTS, 'alerts')}
    <h3>Requests</h3>${chk(REQUESTS, 'requests')}
  </div>
  <div class="stack">
    <button class="primary" id="sendFax">Email to ${esc(settings.destination)} fax</button>
    <button id="sharePdf">Share PDF</button>
  </div>
  ${pa.sentAt ? `<p class="muted">Last sent ${E.hhmm(pa.sentAt)}.</p>` : ''}
  <div class="card"><pre class="preview">${esc(r.text)}</pre></div>
  <details class="card"><summary>Settings (saved on this phone)</summary>
    <label for="s-unit">Unit name</label><input id="s-unit" value="${esc(settings.unit)}">
    <label for="s-cb">Crew callback number</label><input id="s-cb" inputmode="tel" value="${esc(settings.callback)}">
    <label for="s-dest">Destination</label><input id="s-dest" value="${esc(settings.destination)}">
    <label for="s-fax">ED email-to-fax address</label><input id="s-fax" inputmode="email" value="${esc(settings.faxEmail)}" placeholder="from your fax service, e.g. 1XXXXXXXXXX@...">
    <p class="muted">The fax service must have a signed BAA with JRMA. Its delivery receipt arrives in the sending mailbox.</p>
  </details>`;
}

function bindPrearrival() {
  const pa = call.prearrival;
  $('#eta').oninput = e => { pa.etaMin = e.target.value; save(); };
  $('#eta').onchange = () => render();
  $('#lvl').onchange = e => { pa.level = e.target.value; commitQuiet(); };
  for (const key of ['alerts', 'requests']) {
    view.querySelectorAll(`[data-${key}]`).forEach(el => el.onchange = () => {
      const v = el.dataset[key];
      pa[key] = el.checked ? [...pa[key], v] : pa[key].filter(x => x !== v);
      commitQuiet();
    });
  }
  const setting = (id, key) => { $('#' + id).onchange = e => { settings[key] = e.target.value.trim(); saveSettings(); render(); }; };
  setting('s-unit', 'unit'); setting('s-cb', 'callback'); setting('s-dest', 'destination'); setting('s-fax', 'faxEmail');
  const markSent = how => {
    pa.sentAt = Date.now();
    call.events.push({ t: pa.sentAt, kind: 'note', text: `Pre-arrival report sent to ${settings.destination} (${how})` });
    save();
  };
  $('#sendFax').onclick = () => {
    if (!settings.faxEmail) { alert('Add the ED email-to-fax address in Settings first.'); return; }
    const r = buildPrearrival(call, settings, BY_ID);
    markSent('email-to-fax');
    location.href = mailtoLink(r, settings.faxEmail);
  };
  $('#sharePdf').onclick = async () => {
    const r = buildPrearrival(call, settings, BY_ID);
    const file = new File([buildPdf(r.lines)], `prearrival-${E.hhmm(Date.now())}.pdf`, { type: 'application/pdf' });
    try {
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: r.subject }); markSent('shared PDF'); render(); return; }
    } catch (e) { if (e.name === 'AbortError') return; }
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(file), download: file.name });
    a.click();
    markSent('downloaded PDF');
    render();
  };
}

// Re-render without jumping to the top (checkbox lists).
function commitQuiet() { const y = window.scrollY; save(); render(); window.scrollTo(0, y); }

// ---------- router ----------
const TABS = {
  call: [renderCall, bindCall],
  protocol: [renderProtocol, bindProtocol],
  vitals: [renderVitals, bindVitals],
  history: [renderHistory, bindHistory],
  report: [renderReport, bindReport],
  peds: [renderMeds, bindMeds],
  prearrival: [renderPrearrival, bindPrearrival],
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
