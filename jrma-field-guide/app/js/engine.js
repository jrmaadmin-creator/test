// Pure call logic. No DOM access, so it runs in the browser and under `node --test`.

export const MILESTONES = [
  ['dispatched', 'Dispatched'],
  ['onScene', 'On scene'],
  ['patientContact', 'Patient contact'],
  ['transport', 'Transport'],
  ['arrived', 'At hospital'],
];

export function newCall(now = Date.now()) {
  return {
    version: 1,
    startedAt: now,
    patient: { age: '', ageUnit: 'yr', sex: '' },
    dispatch: '',
    chiefComplaint: '',
    moi: '',
    prearrival: { etaMin: '', level: 'BLS', alerts: [], requests: [], sentAt: null },
    destination: '',
    milestones: { dispatched: now },
    events: [],
    vitals: [],
    runs: {},
    active: null,
    history: {},
    notes: '',
  };
}

export function setMilestone(call, key, now = Date.now()) {
  call.milestones[key] = now;
  log(call, now, { kind: 'milestone', text: MILESTONES.find(m => m[0] === key)?.[1] || key });
}

function log(call, t, e) {
  call.events.push({ t, ...e });
}

// ---------- protocol runner ----------

export function startProtocol(call, protocol, now = Date.now()) {
  if (!call.runs[protocol.id]) {
    call.runs[protocol.id] = { current: protocol.start, history: [], startedAt: now, done: false };
    log(call, now, { kind: 'protocol', protocolId: protocol.id, text: `Started: ${protocol.title}` });
  }
  call.active = protocol.id;
  return call.runs[protocol.id];
}

export function currentNode(call, protocol) {
  const run = call.runs[protocol.id];
  if (!run) return null;
  return protocol.nodes[run.current] || null;
}

function advance(call, protocol, next) {
  const run = call.runs[protocol.id];
  run.history.push(run.current);
  if (!next || next === 'END') {
    run.done = true;
    run.current = null;
  } else {
    run.current = next;
  }
}

// Question node: patient/assessment question with fixed answers.
export function answer(call, protocol, index, now = Date.now()) {
  const node = currentNode(call, protocol);
  if (!node || node.type !== 'question') throw new Error('Current node is not a question');
  const a = node.answers[index];
  if (!a) throw new Error(`No answer ${index}`);
  log(call, now, {
    kind: 'answer',
    protocolId: protocol.id,
    nodeId: call.runs[protocol.id].current,
    text: node.text,
    value: a.label,
    finding: a.finding || null,
    suggest: a.suggest || [],
    redFlag: a.redFlag || null,
  });
  advance(call, protocol, a.next ?? node.next);
}

// Action node: an intervention. status = done | not-done | contraindicated
export function completeAction(call, protocol, status, note = '', now = Date.now()) {
  const node = currentNode(call, protocol);
  if (!node || node.type !== 'action') throw new Error('Current node is not an action');
  log(call, now, {
    kind: 'action',
    protocolId: protocol.id,
    nodeId: call.runs[protocol.id].current,
    text: node.report || node.text,
    status,
    note,
  });
  advance(call, protocol, node.next);
}

// Info node: read-and-continue (checklists, reminders).
export function acknowledge(call, protocol, now = Date.now()) {
  const node = currentNode(call, protocol);
  if (!node || node.type !== 'info') throw new Error('Current node is not info');
  advance(call, protocol, node.next);
}

export function back(call, protocol) {
  const run = call.runs[protocol.id];
  if (!run || run.history.length === 0) return;
  const prev = run.history.pop();
  // Drop the event recorded at the node we are returning to.
  for (let i = call.events.length - 1; i >= 0; i--) {
    const e = call.events[i];
    if (e.protocolId === protocol.id && e.nodeId === prev && (e.kind === 'answer' || e.kind === 'action')) {
      call.events.splice(i, 1);
      break;
    }
  }
  run.current = prev;
  run.done = false;
}

// ---------- vitals ----------

const VITAL_FIELDS = ['hr', 'sbp', 'dbp', 'rr', 'spo2', 'bgl', 'gcsE', 'gcsV', 'gcsM', 'pain'];

export function addVitals(call, input, now = Date.now()) {
  const v = { t: now };
  for (const k of VITAL_FIELDS) {
    const n = input[k] === '' || input[k] == null ? null : Number(input[k]);
    v[k] = Number.isFinite(n) ? n : null;
  }
  v.skin = input.skin || '';
  v.pupils = input.pupils || '';
  v.lungs = input.lungs || '';
  v.gcs = v.gcsE != null && v.gcsV != null && v.gcsM != null ? v.gcsE + v.gcsV + v.gcsM : null;
  call.vitals.push(v);
  log(call, now, { kind: 'vitals', text: formatVitals(v) });
  return v;
}

export function ageInYears(patient) {
  const n = Number(patient.age);
  if (!Number.isFinite(n) || patient.age === '') return null;
  if (patient.ageUnit === 'mo') return n / 12;
  if (patient.ageUnit === 'day') return n / 365;
  return n;
}

// Adult reference ranges from standard EMT-B curriculum. Pediatric patients are not flagged:
// pediatric ranges vary by age band and must come from the NH protocol appendix.
export function vitalFlags(v, years) {
  if (years == null || years < 18) return [];
  const f = [];
  const chk = (val, lo, hi, name, critLo, critHi) => {
    if (val == null) return;
    if ((critLo != null && val < critLo) || (critHi != null && val > critHi)) f.push({ field: name, level: 'critical', val });
    else if (val < lo || val > hi) f.push({ field: name, level: 'abnormal', val });
  };
  chk(v.hr, 60, 100, 'hr', 50, 130);
  chk(v.rr, 12, 20, 'rr', 8, 30);
  chk(v.sbp, 90, 140, 'sbp', 80, 200);
  chk(v.spo2, 94, 100, 'spo2', 90, null);
  chk(v.bgl, 70, 250, 'bgl', 60, 400);
  if (v.gcs != null) {
    if (v.gcs <= 8) f.push({ field: 'gcs', level: 'critical', val: v.gcs });
    else if (v.gcs < 15) f.push({ field: 'gcs', level: 'abnormal', val: v.gcs });
  }
  return f;
}

export function formatVitals(v) {
  const parts = [];
  if (v.sbp != null) parts.push(`BP ${v.sbp}/${v.dbp ?? '?'}`);
  if (v.hr != null) parts.push(`HR ${v.hr}`);
  if (v.rr != null) parts.push(`RR ${v.rr}`);
  if (v.spo2 != null) parts.push(`SpO2 ${v.spo2}%`);
  if (v.gcs != null) parts.push(`GCS ${v.gcs} (E${v.gcsE}V${v.gcsV}M${v.gcsM})`);
  if (v.bgl != null) parts.push(`BGL ${v.bgl}`);
  if (v.pain != null) parts.push(`Pain ${v.pain}/10`);
  if (v.skin) parts.push(`Skin ${v.skin}`);
  if (v.pupils) parts.push(`Pupils ${v.pupils}`);
  if (v.lungs) parts.push(`Lungs ${v.lungs}`);
  return parts.join(', ') || '(no values)';
}

// ---------- decision support ----------

// Field impressions ranked by how many recorded findings point at them.
export function impressions(call) {
  const counts = new Map();
  for (const e of call.events) {
    for (const s of e.suggest || []) counts.set(s, (counts.get(s) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, score]) => ({ name, score }));
}

export function redFlags(call) {
  const years = ageInYears(call.patient);
  const out = [];
  for (const e of call.events) if (e.redFlag) out.push(e.redFlag);
  const last = call.vitals[call.vitals.length - 1];
  if (last) for (const f of vitalFlags(last, years)) if (f.level === 'critical') out.push(`Critical ${f.field.toUpperCase()}: ${f.val}`);
  return [...new Set(out)];
}

// Critical actions on the path actually taken that were not completed.
// Branches the patient's answers ruled out (e.g. aspirin allergy) are never flagged.
export function missedActions(call, protocol) {
  const run = call.runs[protocol.id];
  if (!run) return [];
  const recorded = new Map();
  for (const e of call.events) if (e.kind === 'action' && e.protocolId === protocol.id) recorded.set(e.nodeId, e.status);
  const path = run.current ? run.history.concat(run.current) : run.history;
  return [...new Set(path)]
    .filter(id => protocol.nodes[id]?.type === 'action' && protocol.nodes[id].critical)
    .filter(id => !['done', 'contraindicated'].includes(recorded.get(id)))
    .map(id => ({ id, text: protocol.nodes[id].text, status: recorded.get(id) || 'not reached' }));
}

// ---------- report (MIST) ----------

export function hhmm(t) {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
}

export function buildReport(call, protocolsById) {
  const p = call.patient;
  const sexWord = { M: 'male', F: 'female', X: 'patient' }[p.sex] || 'patient';
  const ageStr = p.age === '' ? 'unknown-age' : `${p.age}${p.ageUnit === 'yr' ? '-year-old' : p.ageUnit === 'mo' ? '-month-old' : '-day-old'}`;
  const who = `${ageStr} ${sexWord}`;
  const findings = call.events.filter(e => e.kind === 'answer' && e.finding).map(e => e.finding);
  const treatments = call.events.filter(e => e.kind === 'action');
  const imp = impressions(call).slice(0, 3).map(i => i.name);
  const flags = redFlags(call);
  const first = call.vitals[0];
  const last = call.vitals[call.vitals.length - 1];

  const M = `${who}. Chief complaint: ${call.chiefComplaint || 'not recorded'}.` +
    (call.dispatch ? ` Dispatched as: ${call.dispatch}.` : '') +
    (call.milestones.patientContact ? ` Patient contact ${hhmm(call.milestones.patientContact)}.` : '');
  const I = findings.length ? findings.join('; ') + '.' : 'No findings recorded.';
  const S = !first ? 'No vitals recorded.'
    : first === last ? `${hhmm(first.t)}: ${formatVitals(first)}.`
      : `Initial ${hhmm(first.t)}: ${formatVitals(first)}. Most recent ${hhmm(last.t)}: ${formatVitals(last)}. ${call.vitals.length} sets total.`;
  const T = treatments.length
    ? treatments.map(e => `${hhmm(e.t)} ${e.text}${e.status === 'done' ? '' : ` [${e.status.toUpperCase()}${e.note ? `: ${e.note}` : ''}]`}`).join('; ') + '.'
    : 'No interventions recorded.';

  const protocolsUsed = Object.keys(call.runs).map(id => protocolsById[id]?.title || id);
  const sections = [
    ['M', 'Medical complaint', M],
    ['I', 'Illness / findings', I],
    ['S', 'Signs (vitals)', S],
    ['T', 'Treatment', T],
  ];
  const lines = [
    `HANDOFF REPORT  ${hhmm(Date.now())}`,
    ...sections.map(([k, label, body]) => `${k} - ${label}: ${body}`),
    imp.length ? `Field impression: ${imp.join(', ')}.` : '',
    flags.length ? `RED FLAGS: ${flags.join('; ')}.` : '',
    protocolsUsed.length ? `Protocols: ${protocolsUsed.join(', ')}.` : '',
    historyLine(call.history),
    call.notes ? `Notes: ${call.notes}` : '',
  ].filter(Boolean);
  return { sections, impressions: imp, flags, protocolsUsed, history: historyLine(call.history), text: lines.join('\n') };
}

function historyLine(h = {}) {
  const keys = [['sampleA', 'Allergies'], ['sampleM', 'Meds'], ['sampleP', 'PMH'], ['sampleL', 'Last intake'], ['sampleE', 'Events'], ['opqrstO', 'Onset'], ['opqrstS', 'Severity']];
  const parts = keys.filter(([k]) => h[k]).map(([k, label]) => `${label}: ${h[k]}`);
  return parts.length ? `History: ${parts.join('; ')}.` : '';
}

// ---------- protocol validation (used by tools/validate-protocols.mjs and tests) ----------

export function validateProtocol(p) {
  const errs = [];
  const need = ['id', 'title', 'category', 'start', 'nodes', 'source'];
  for (const k of need) if (p[k] == null) errs.push(`${p.id || '?'}: missing ${k}`);
  if (errs.length) return errs;
  if (typeof p.verified !== 'boolean') errs.push(`${p.id}: verified must be true or false`);
  if (p.verified && (!p.source.section || !p.source.page)) errs.push(`${p.id}: verified protocol needs source.section and source.page`);
  if (!p.nodes[p.start]) errs.push(`${p.id}: start node "${p.start}" missing`);
  const ids = new Set(Object.keys(p.nodes));
  const targets = new Set([p.start]);
  for (const [id, n] of Object.entries(p.nodes)) {
    if (!['question', 'action', 'info'].includes(n.type)) errs.push(`${p.id}.${id}: bad type ${n.type}`);
    if (!n.text) errs.push(`${p.id}.${id}: missing text`);
    const nexts = n.type === 'question' ? (n.answers || []).map(a => a.next ?? n.next) : [n.next];
    if (n.type === 'question' && !(n.answers && n.answers.length)) errs.push(`${p.id}.${id}: question has no answers`);
    for (const x of nexts) {
      if (x === undefined) errs.push(`${p.id}.${id}: missing next (use "END" to finish)`);
      else if (x !== 'END' && !ids.has(x)) errs.push(`${p.id}.${id}: next "${x}" does not exist`);
      else targets.add(x);
    }
  }
  for (const id of ids) if (!targets.has(id)) errs.push(`${p.id}.${id}: unreachable node`);
  return errs;
}
