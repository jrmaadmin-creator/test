// Pre-arrival report for the receiving ED (sent ~5-10 min out).
// Privacy rules (ADR 0005): no name, DOB, address, or free-text notes/history.
// Age 90 and over is reported as "90+" (HIPAA Safe Harbor treats exact ages over 89 as identifying).
import { hhmm, formatVitals, impressions, redFlags } from './engine.js';

export const ALERTS = ['STROKE ALERT', 'STEMI ALERT', 'TRAUMA ALERT', 'SEPSIS ALERT', 'CARDIAC ARREST / ROSC', 'CRITICAL PEDIATRIC'];
export const REQUESTS = ['Isolation room', 'Bariatric', 'Behavioral / security', 'Respiratory therapy on arrival', 'Lift assist'];

export const DEFAULT_SETTINGS = {
  unit: 'JRMA',
  callback: '',
  destination: 'Monadnock Community Hospital ED',
  faxEmail: '',  // fax vendor email-to-fax address for the ED fax, e.g. 1XXXXXXXXXX@vendor-domain
};

export function ageText(patient) {
  if (patient.age === '' || patient.age == null) return 'Age unknown';
  const n = Number(patient.age);
  const unit = patient.ageUnit || 'yr';
  if (unit === 'yr' && n >= 90) return '90+ year-old';
  return `${patient.age}-${{ yr: 'year', mo: 'month', day: 'day' }[unit]}-old`;
}

export function buildPrearrival(call, settings, protocolsById, now = Date.now()) {
  const pa = call.prearrival || {};
  const s = { ...DEFAULT_SETTINGS, ...settings };
  const sex = { M: 'male', F: 'female', X: 'patient' }[call.patient.sex] || 'patient';
  const eta = Number(pa.etaMin);
  const etaLine = Number.isFinite(eta) && eta > 0 ? `ETA ${hhmm(now + eta * 60e3)} (${eta} min)` : 'ETA not set';
  const findings = call.events.filter(e => e.kind === 'answer' && e.finding).map(e => e.finding);
  const treatments = call.events.filter(e => e.kind === 'action' && e.status === 'done');
  const first = call.vitals[0];
  const last = call.vitals[call.vitals.length - 1];
  const imp = impressions(call).slice(0, 3).map(i => i.name);
  const flags = redFlags(call);

  const lines = [
    { style: 'title', text: `${s.unit} PRE-ARRIVAL REPORT` },
    { text: `To: ${s.destination}` },
    { text: `Sent ${hhmm(now)}  |  ${etaLine}  |  ${pa.level || 'BLS'}${s.callback ? `  |  Callback ${s.callback}` : ''}` },
  ];
  for (const a of pa.alerts || []) lines.push({ style: 'alert', text: `*** ${a} ***` });
  lines.push(
    { style: 'head', text: 'PATIENT' },
    { text: `${ageText(call.patient)} ${sex}` },
    { text: `Chief complaint: ${call.chiefComplaint || 'not recorded'}` },
    { text: `MOI/NOI: ${call.moi || 'not recorded'}` },
  );
  if (imp.length) lines.push({ text: `Field impression: ${imp.join(', ')}` });
  if (findings.length) lines.push({ style: 'head', text: 'KEY FINDINGS' }, { text: findings.slice(0, 8).join('; ') });
  lines.push({ style: 'head', text: 'VITALS' });
  if (!last) lines.push({ text: 'None recorded' });
  else {
    lines.push({ text: `Latest ${hhmm(last.t)}: ${formatVitals(last)}` });
    if (first !== last) lines.push({ text: `Initial ${hhmm(first.t)}: ${formatVitals(first)}` });
  }
  lines.push({ style: 'head', text: 'TREATMENT' }, {
    text: treatments.length ? treatments.map(e => `${hhmm(e.t)} ${e.text}`).join('; ') : 'None recorded',
  });
  if (flags.length) lines.push({ style: 'head', text: 'RED FLAGS' }, { text: flags.join('; ') });
  const req = pa.requests || [];
  if (req.length) lines.push({ style: 'head', text: 'REQUESTS' }, { text: req.join('; ') });
  lines.push(
    { text: '' },
    { text: 'Contains no patient name, DOB, or address by design. Verbal report on arrival; full PCR to follow in NHESR.' },
  );
  const text = lines.map(l => l.text).join('\n');
  return { lines, text, subject: `${s.unit} pre-arrival: ${ageText(call.patient)} ${sex}, ${call.chiefComplaint || 'no CC'}, ${etaLine}` };
}

// mailto: link that opens the phone's mail app addressed to the email-to-fax gateway.
export function mailtoLink(report, faxEmail) {
  const href = `mailto:${encodeURIComponent(faxEmail).replace(/%40/g, '@')}?subject=${encodeURIComponent(report.subject)}&body=${encodeURIComponent(report.text)}`;
  return href;
}
