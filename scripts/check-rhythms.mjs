// Verifies each generated rhythm against the criteria it claims (rhythm.expect):
// ventricular rate, atrial rate, PR range, QRS width, regularity.
// Run: npm run check
import { RHYTHMS } from '../src/js/rhythms.js';
import { Engine } from '../src/js/engine.js';
import { leadSignal, qrsAxis, LEADS } from '../src/js/ecg.js';
import { TREATMENT, TREATMENT_FOR, TREAT_Q } from '../src/js/clinical.js';
import { SCENARIOS } from '../src/js/scenarios.js';

const SECONDS = 60;
let failures = 0;

const rate = (times) => {
  if (times.length < 2) return 0;
  return ((times.length - 1) / (times[times.length - 1] - times[0])) * 60;
};

for (const r of RHYTHMS) {
  const e = new Engine();
  e.load(r);
  e.ensure(SECONDS);
  const beats = e.beats.filter((b) => b.tStart < SECONDS);
  const qrs = beats.map((b) => b.qrs).filter((q) => q != null).sort((a, b) => a - b);
  const pOn = beats.flatMap((b) => b.p).sort((a, b) => a - b);
  const prs = beats.flatMap((b) => b.intervals.filter((i) => i.kind === 'PR').map((i) => i.t1 - i.t0));
  const widths = beats.flatMap((b) => b.intervals.filter((i) => i.kind === 'QRS').map((i) => i.t1 - i.t0));
  const rrs = qrs.slice(1).map((q, i) => q - qrs[i]);
  const mean = rrs.reduce((a, b) => a + b, 0) / (rrs.length || 1);
  const cv = rrs.length ? Math.sqrt(rrs.reduce((a, b) => a + (b - mean) ** 2, 0) / rrs.length) / mean : 0;

  const x = r.expect || {};
  const errs = [];
  const vr = rate(qrs);
  if (x.vRate && (vr < x.vRate[0] - 0.5 || vr > x.vRate[1] + 0.5)) errs.push(`ventricular rate ${vr.toFixed(1)} not in ${x.vRate}`);
  const ar = rate(pOn);
  if (x.aRate && (ar < x.aRate[0] || ar > x.aRate[1])) errs.push(`atrial rate ${ar.toFixed(1)} not in ${x.aRate}`);
  if (x.pr) for (const p of prs) if (p < x.pr[0] - 1e-9 || p > x.pr[1] + 1e-9) { errs.push(`PR ${p.toFixed(3)} not in ${x.pr}`); break; }
  if (x.qrs) for (const w of widths) if (w < x.qrs[0] - 1e-9 || w > x.qrs[1] + 1e-9) { errs.push(`QRS ${w.toFixed(3)} not in ${x.qrs}`); break; }
  if (x.regular === true && cv > 0.03) errs.push(`expected regular, R-R variation ${(cv * 100).toFixed(1)}%`);
  if (x.regular === false && cv < 0.05) errs.push(`expected irregular, R-R variation ${(cv * 100).toFixed(1)}%`);
  for (const b of beats) for (const c of b.comps) if (!Number.isFinite(c.t + c.a + c.s1 + c.s2)) errs.push('non-finite wave component');
  for (const key of ['name', 'group', 'summary', 'mechanism', 'watch', 'significance', 'tip']) if (!r[key]) errs.push(`missing ${key}`);

  const line = `${r.id.padEnd(18)} V ${vr.toFixed(0).padStart(3)}  A ${ar.toFixed(0).padStart(3)}  PR ${prs.length ? Math.min(...prs).toFixed(2) + '–' + Math.max(...prs).toFixed(2) : '   —    '}  QRS ${widths.length ? Math.max(...widths).toFixed(2) : ' — '}  RR-CV ${(cv * 100).toFixed(1)}%`;
  if (errs.length) {
    failures++;
    console.log(`FAIL ${line}\n     ${errs.join('\n     ')}`);
  } else {
    console.log(`ok   ${line}`);
  }
}

console.log(failures ? `\n${failures} rhythm(s) failed` : `\nAll ${RHYTHMS.length} rhythms match their criteria`);

// ---- 12-lead physics: each rhythm's leads must show its textbook pattern ----
const byId = Object.fromEntries(RHYTHMS.map((r) => [r.id, r]));
function probe(id, pick = (b) => b.qrs != null) {
  const r = byId[id];
  const e = new Engine();
  e.load(r);
  e.ensure(20);
  const beat = e.beats.find((b) => b.tStart > 8 && pick(b));
  const clean = { ...r, noNoise: true, baseline: undefined, artifact: undefined };
  const comps = e.beats.flatMap((b) => b.comps);
  const sig = (lead) => leadSignal(comps, clean, lead);
  const area = (lead, t0, t1) => {
    const f = sig(lead);
    let a = 0;
    for (let t = t0; t <= t1; t += 0.001) a += f(t) * 0.001;
    return a;
  };
  return { beat, comps, sig, area, q: beat?.qrs, w: beat?.qrsWidth };
}
const leadFails = [];
const expectTrue = (name, ok) => {
  if (!ok) leadFails.push(name);
};
{
  const n = probe('nsr');
  const qa = (L) => n.area(L, n.q, n.q + n.w);
  expectTrue('NSR: QRS up in I, II, aVF, V6', qa('I') > 0 && qa('II') > 0 && qa('aVF') > 0 && qa('V6') > 0);
  expectTrue('NSR: QRS down in aVR and V1', qa('aVR') < 0 && qa('V1') < 0);
  expectTrue('NSR: R wave progression V1 < V3 < V5', qa('V1') < qa('V3') && qa('V3') < qa('V5'));
  const pOn = n.beat.p[0];
  expectTrue('NSR: P up in II, down in aVR', n.area('II', pOn, pOn + 0.1) > 0 && n.area('aVR', pOn, pOn + 0.1) < 0);
  const ax = qrsAxis(n.beat.comps);
  expectTrue(`NSR: normal axis (${ax?.toFixed(0)}°)`, ax > -30 && ax < 90);
  const [I, II, III] = ['I', 'II', 'III'].map(n.sig);
  let worst = 0;
  for (let t = n.q - 0.3; t < n.q + 0.5; t += 0.013) worst = Math.max(worst, Math.abs(II(t) - I(t) - III(t)));
  expectTrue(`Einthoven II = I + III (max error ${worst.toExponential(1)})`, worst < 1e-9);
}
{
  const n = probe('rbbb');
  expectTrue('RBBB: terminal R prime up in V1', n.sig('V1')(n.q + 0.1) > 0.3);
  expectTrue('RBBB: terminal S in I and V6', n.sig('I')(n.q + 0.1) < 0 && n.sig('V6')(n.q + 0.1) < 0);
  const ax = qrsAxis(n.beat.comps);
  expectTrue(`RBBB: axis stays normal (${ax?.toFixed(0)}°)`, ax > -30 && ax < 90);
}
{
  const n = probe('lbbb');
  expectTrue('LBBB: QRS down in V1, up in V6 and I', n.area('V1', n.q, n.q + n.w) < 0 && n.area('V6', n.q, n.q + n.w) > 0 && n.area('I', n.q, n.q + n.w) > 0);
  const ax = qrsAxis(n.beat.comps);
  expectTrue(`LBBB: axis normal or left (${ax?.toFixed(0)}°)`, ax > -90 && ax < 90);
}
{
  const n = probe('vt');
  const ax = qrsAxis(n.beat.comps);
  expectTrue(`VT: northwest axis (${ax?.toFixed(0)}°)`, ax < -90 && ax > -180);
}
{
  const n = probe('paced');
  const ax = qrsAxis(n.beat.comps);
  expectTrue(`Paced: superior axis (${ax?.toFixed(0)}°)`, ax < 0);
  expectTrue('Paced: LBBB-like, down in V1', n.area('V1', n.q, n.q + n.w) < 0);
}
{
  const n = probe('pvc', (b) => b.wide);
  expectTrue('PVC (RVOT): up in II and aVF, down in V1', n.area('II', n.q, n.q + n.w) > 0 && n.area('aVF', n.q, n.q + n.w) > 0 && n.area('V1', n.q, n.q + n.w) < 0);
}
{
  const n = probe('wpw');
  expectTrue('WPW (left lateral): delta negative in I, positive in V1 and II', n.sig('I')(n.q + 0.03) < 0 && n.sig('V1')(n.q + 0.03) > 0 && n.sig('II')(n.q + 0.03) > 0);
}
{
  const n = probe('junctional');
  const pOn = n.beat.p[0];
  expectTrue('Junctional: retrograde P down in II, up in aVR', n.area('II', pOn, pOn + 0.09) < 0 && n.area('aVR', pOn, pOn + 0.09) > 0);
}
{
  const f = byId.aflutter.baseline;
  const val = (L, t) => { const v = f(t); const a = LEADS[L].axis; return v[0] * a[0] + v[1] * a[1] + v[2] * a[2]; };
  let c = 0;
  for (let t = 0; t < 1; t += 0.005) c += val('II', t) * val('V1', t);
  expectTrue('Flutter: F waves inverted in II, upright in V1', c < 0);
}
for (const id of ['nsr', 'rbbb', 'lbbb', 'pvc', 'vt', 'paced', 'avb3', 'wpw', 'ivr']) {
  const n = probe(id, (b) => b.qrs != null && (id !== 'pvc' || b.wide));
  process.stdout.write(`${id} ${qrsAxis(n.beat.comps)?.toFixed(0)}°  `);
}
console.log('(QRS axes)');
// ---- Clinical content integrity ----
for (const r of RHYTHMS) expectTrue(`treatment mapped for ${r.id}`, TREATMENT[TREATMENT_FOR[r.id]]);
for (const [k, t] of Object.entries(TREATMENT)) for (const st of t.steps) expectTrue(`treatment ${k} step has level, text and citation`, st.length === 3 && st[0] && st[1] && st[2]);
for (const [k, list] of Object.entries(TREAT_Q)) {
  expectTrue(`treatment question key ${k} exists`, TREATMENT[k]);
  for (const q of list) expectTrue(`question "${q.q.slice(0, 40)}" has 3 distinct distractors`, q.x.length === 3 && !q.x.includes(q.a) && new Set(q.x).size === 3);
}
for (const sc of SCENARIOS) {
  expectTrue(`scenario ${sc.id} rhythm exists`, byId[sc.rhythm]);
  for (const st of sc.steps) {
    expectTrue(`scenario ${sc.id}: one correct answer in "${st.q.slice(0, 30)}"`, st.o.filter((o) => o[1]).length === 1);
    if (st.rhythm) expectTrue(`scenario ${sc.id} step rhythm ${st.rhythm} exists`, byId[st.rhythm]);
  }
}
for (const f of leadFails) console.log(`FAIL 12-lead: ${f}`);
if (!leadFails.length) console.log(`12-lead patterns, treatment (${Object.keys(TREATMENT).length} protocols) and ${SCENARIOS.length} scenarios: all checks pass`);
process.exit(failures || leadFails.length ? 1 : 0);
