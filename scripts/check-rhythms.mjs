// Verifies each generated rhythm against the criteria it claims (rhythm.expect):
// ventricular rate, atrial rate, PR range, QRS width, regularity.
// Run: npm run check
import { RHYTHMS } from '../src/js/rhythms.js';
import { Engine } from '../src/js/engine.js';

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
process.exit(failures ? 1 : 0);
