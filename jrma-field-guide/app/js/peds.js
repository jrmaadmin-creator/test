// Pediatric band lookup over NH v9.3 Appendix A3. Pure functions, no DOM.
import A3 from './data/nh-a3.js';

export { A3 };
export const BANDS = A3.bands;

// NH 1.0: pediatric = fits a length-based tape up to 36 kg or 145 cm.
export const PEDS_MAX_KG = 36;
export const PEDS_MAX_CM = 145;

export function parseRange(s) {
  const nums = String(s).match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
  const avg = /avg/i.test(s) ? nums[nums.length - 1] : null;
  if (/^\s*</.test(s)) return { lo: 0, hi: nums[0], avg };
  return { lo: nums[0], hi: nums[1], avg };
}

const W = BANDS.map(b => ({ band: b, ...parseRange(b.weightKg) }));
const L = BANDS.map(b => ({ band: b, ...parseRange(b.length) }));

// Weight ranges have gaps (e.g. 5-6 kg, 22-24 kg). A weight in a gap returns both neighbors.
export function bandsForWeight(kg) {
  const n = Number(kg);
  if (!Number.isFinite(n) || n <= 0) return { bands: [], note: '' };
  const hit = W.find(w => n >= w.lo && n <= w.hi);
  if (hit) return { bands: [hit.band], note: overNote(n, null) };
  if (n < W[0].lo) return { bands: [W[0].band], note: `Below the smallest band (${W[0].band.weightKg}).` };
  if (n > W[W.length - 1].hi) return { bands: [], note: `Above ${W[W.length - 1].hi} kg: not on the A3 table. Use adult protocols.` };
  const i = W.findIndex(w => w.lo > n);
  return { bands: [W[i - 1].band, W[i].band], note: `${n} kg falls between two bands. Measure with the length-based tape.` };
}

// Length ranges share boundaries (59.5 ends Gray and starts Pink); a boundary value goes to the larger band.
export function bandForLength(cm) {
  const n = Number(cm);
  if (!Number.isFinite(n) || n <= 0) return { bands: [], note: '' };
  const last = L[L.length - 1];
  if (n > last.hi) return { bands: [], note: `Longer than ${last.hi} cm: not on the A3 table. Use adult protocols.` };
  const hit = L.find((l, i) => n >= l.lo && (n < l.hi || (i === L.length - 1 && n <= l.hi)));
  return { bands: hit ? [hit.band] : [], note: overNote(null, n) };
}

function overNote(kg, cm) {
  if ((kg != null && kg > PEDS_MAX_KG) || (cm != null && cm > PEDS_MAX_CM)) {
    return `Over the NH pediatric limit (${PEDS_MAX_KG} kg / ${PEDS_MAX_CM} cm, protocol 1.0): adult protocols apply.`;
  }
  return '';
}

export function bandByColor(color) {
  return BANDS.find(b => b.color.toLowerCase() === String(color).toLowerCase()) || null;
}

export function citation(band) {
  const s = band.source;
  return `NH PCP v9.3, ${s.section}, ${s.printedPageLabel} (PDF p. ${s.pdfPageIndex})`;
}
