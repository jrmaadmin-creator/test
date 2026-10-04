// Waveform synthesis as a 3D cardiac vector.
//
// Every wave component is a small electrical vector (direction + size) that
// swells and fades over time. A lead only "sees" the part of that vector that
// points along its own axis: toward the positive electrode draws upward, away
// draws downward, perpendicular draws almost nothing. That single rule is how
// a real 12-lead works, so all 12 leads here come from the same heartbeat.
//
// Frame (same as the 3D model): x = patient's left, y = up, z = anterior.
// Units: seconds and millivolts. All functions are pure functions of time.

const TAU = Math.PI * 2;
const norm = (x, y, z) => {
  const m = Math.hypot(x, y, z) || 1;
  return [x / m, y / m, z / m];
};
const neg = (v) => [-v[0], -v[1], -v[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// ---- Leads ------------------------------------------------------------------

// Frontal plane (hexaxial). Angles follow ECG convention: 0° = patient's left,
// +90° = straight down.
const frontal = (deg) => {
  const r = (deg * Math.PI) / 180;
  return [Math.cos(r), -Math.sin(r), 0];
};
// Horizontal plane (chest leads). 0° = patient's left, 90° = straight anterior.
const chest = (deg) => {
  const r = (deg * Math.PI) / 180;
  return [Math.cos(r), 0, Math.sin(r)];
};

// Chest electrodes sit close to the heart, so they record larger complexes.
const CHEST_GAIN = 1.2;

export const LEADS = {
  I: { axis: frontal(0), gain: 1, deg: 0, plane: 'frontal' },
  II: { axis: frontal(60), gain: 1, deg: 60, plane: 'frontal' },
  III: { axis: frontal(120), gain: 1, deg: 120, plane: 'frontal' },
  aVR: { axis: frontal(-150), gain: 1, deg: -150, plane: 'frontal' },
  aVL: { axis: frontal(-30), gain: 1, deg: -30, plane: 'frontal' },
  aVF: { axis: frontal(90), gain: 1, deg: 90, plane: 'frontal' },
  V1: { axis: chest(115), gain: CHEST_GAIN, deg: 115, plane: 'horizontal' },
  V2: { axis: chest(94), gain: CHEST_GAIN, deg: 94, plane: 'horizontal' },
  V3: { axis: chest(75), gain: CHEST_GAIN, deg: 75, plane: 'horizontal' },
  V4: { axis: chest(58), gain: CHEST_GAIN, deg: 58, plane: 'horizontal' },
  V5: { axis: chest(32), gain: CHEST_GAIN, deg: 32, plane: 'horizontal' },
  V6: { axis: chest(0), gain: CHEST_GAIN, deg: 0, plane: 'horizontal' },
};
export const LEAD_NAMES = Object.keys(LEADS);

// ---- Vector directions --------------------------------------------------------

export const DIR = {
  // Sinus P: right atrium first (down, forward), then left atrium (left, back).
  pRA: norm(0.2, -0.8, 0.45),
  pLA: norm(0.7, -0.5, -0.35),
  // Retrograde P (junctional, AVNRT): atria depolarize bottom to top.
  pRetro: norm(-0.3, 0.95, 0.05),
  // PAC from the low lateral right atrium: spreads leftward.
  pEctopic: norm(0.85, -0.3, 0.1),
  // Normal QRS: septum left-to-right, then the big left ventricle, then the bases.
  sept: norm(-0.55, 0, 0.6),
  main: norm(0.64, -0.77, 0.05),
  basal: norm(-0.2, 0.55, -0.6),
  T: norm(0.55, -0.6, 0.35),
  // Right bundle branch block: late right-ventricle activation points mostly
  // forward (toward V1) and somewhat right; the frontal axis stays normal.
  rvLate: norm(-0.35, -0.05, 0.93),
  rbbbT: norm(0.6, -0.4, -0.6),
  // Left bundle branch block: septum fires right-to-left, then slow left ventricle.
  septL: norm(0.6, -0.2, -0.3),
  lvSlow: norm(0.72, -0.35, -0.6),
  lvNotch: norm(0.8, 0.1, -0.5),
  // Pre-excitation through a left lateral accessory pathway spreads right and down.
  delta: norm(-0.6, -0.7, 0.35),
  // Flutter waves circle the right atrium upward along the septum (typical flutter).
  flutter: norm(-0.35, 0.85, 0.4),
};

// Ventricular foci: the wavefront spreads away from where the beat starts.
export const FOCUS_DIR = {
  pvc: norm(0.3, -0.9, -0.65), // right ventricular outflow tract: spreads down, left, back
  ivr: norm(-0.63, 0.8, -0.07), // left ventricular apex: spreads up and right
  escape: norm(0.2, -0.95, 0.05), // high septum: spreads down
  vt: norm(-0.72, 0.63, -0.3), // scar near the left ventricular apex: up and right
  pacerTip: norm(0.16, 0.85, -0.5), // right ventricular apex: up and back
};

// ---- Components ----------------------------------------------------------------

// One component: an asymmetric Gaussian pulse of size a (mV) along direction v.
export const comp = (t, a, s1, s2, v) => ({ t, a, s1, s2, v });

// QT shortens as rate rises (Bazett: QT = QTc x sqrt(RR)), QTc 0.40 s.
export function qtFor(rr, wide = false) {
  const qt = 0.4 * Math.sqrt(Math.max(rr, 0.25));
  return Math.min(Math.max(qt, 0.24), 0.48) + (wide ? 0.06 : 0);
}

// P shapes take P onset; QRS shapes take QRS onset (q) and return { comps, width }.
export const SHAPES = {
  P: (t) => [comp(t + 0.035, 0.1, 0.018, 0.018, DIR.pRA), comp(t + 0.065, 0.1, 0.02, 0.02, DIR.pLA)],
  Pinv: (t) => [comp(t + 0.045, 0.13, 0.02, 0.02, DIR.pRetro)],
  Pectopic: (t) => [comp(t + 0.04, 0.12, 0.018, 0.018, DIR.pEctopic)],
  narrow: (q) => ({
    width: 0.09,
    comps: [
      comp(q + 0.012, 0.25, 0.007, 0.008, DIR.sept),
      comp(q + 0.04, 1.2, 0.011, 0.01, DIR.main),
      comp(q + 0.066, 0.36, 0.009, 0.009, DIR.basal),
    ],
  }),
  // Infranodal disease (Mobitz II): borderline-wide, slurred.
  slurred: (q) => ({
    width: 0.12,
    comps: [
      comp(q + 0.014, 0.2, 0.008, 0.009, DIR.sept),
      comp(q + 0.05, 1.05, 0.016, 0.02, DIR.main),
      comp(q + 0.1, 0.3, 0.013, 0.013, DIR.basal),
    ],
  }),
  rbbb: (q) => ({
    width: 0.13,
    comps: [
      comp(q + 0.012, 0.25, 0.007, 0.008, DIR.sept),
      comp(q + 0.04, 1.2, 0.011, 0.01, DIR.main),
      comp(q + 0.066, 0.2, 0.009, 0.009, DIR.basal),
      comp(q + 0.1, 0.65, 0.02, 0.018, DIR.rvLate),
    ],
  }),
  lbbb: (q) => ({
    width: 0.15,
    comps: [
      comp(q + 0.015, 0.2, 0.01, 0.01, DIR.septL),
      comp(q + 0.075, 1.35, 0.03, 0.034, DIR.lvSlow),
      comp(q + 0.112, 0.3, 0.015, 0.015, DIR.lvNotch),
    ],
  }),
  wpw: (q) => ({
    width: 0.12,
    comps: [
      comp(q + 0.04, 0.45, 0.03, 0.012, DIR.delta),
      comp(q + 0.045, 0.2, 0.007, 0.008, DIR.sept),
      comp(q + 0.07, 1.0, 0.011, 0.01, DIR.main),
      comp(q + 0.097, 0.3, 0.009, 0.009, DIR.basal),
    ],
  }),
  // Ventricular origin: wide, spreads muscle to muscle away from the focus.
  wide: (q, dir, amp = 1.25) => ({
    width: 0.16,
    comps: [comp(q + 0.065, amp, 0.028, 0.032, dir), comp(q + 0.125, 0.3 * amp, 0.015, 0.015, neg(dir))],
  }),
  T: (q, qt, a = 0.35, dir = DIR.T) => [comp(q + qt - 0.095, a, 0.06, 0.038, dir)],
  // After a wide QRS, repolarization runs the opposite way (discordant T).
  Twide: (q, qt, a, dir) => [comp(q + qt - 0.1, a, 0.07, 0.05, dir)],
};

export { neg, norm };

// ---- Continuous activity (returns a vector) -----------------------------------

function hash(n) {
  const h = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return (h - Math.floor(h)) * 2 - 1;
}
export function noise1(x) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i) + (hash(i + 1) - hash(i)) * u;
}

// Wander + muscle noise present on every real tracing; offset per lead so leads differ.
export const baselineNoise = (t, k = 0) =>
  0.018 * Math.sin(TAU * 0.21 * t + 0.6 + k) + 0.01 * noise1(t * 37 + k * 13.1) + 0.005 * noise1(t * 140 + k * 7.7);

// Atrial fibrillation f-waves: chaotic, different in every direction.
const fib = (t) =>
  0.045 * Math.sin(TAU * 5.3 * t + 0.3) +
  0.035 * Math.sin(TAU * 6.7 * t + 1.9 + 0.8 * Math.sin(TAU * 0.4 * t)) +
  0.03 * Math.sin(TAU * 8.1 * t + 4.2) * (0.6 + 0.4 * Math.sin(TAU * 0.37 * t)) +
  0.03 * noise1(t * 18);
export const fibVector = (t) => [0.8 * fib(t), 0.9 * fib(t + 2.31), 1.1 * fib(t + 5.17)];

// Typical flutter: sawtooth, negative in II/III/aVF, upright in V1.
// Phase 0 = start of the slow limb; the sharp limb occupies the last 30%.
export function flutterVector(t, period, phase, amp = 0.28) {
  let f = ((t - phase) / period) % 1;
  if (f < 0) f += 1;
  const s = f < 0.7 ? f / 0.7 : 1 - (f - 0.7) / 0.3;
  const m = amp * (s - 0.5);
  return [DIR.flutter[0] * m, DIR.flutter[1] * m, DIR.flutter[2] * m];
}

// Coarse ventricular fibrillation.
function vf(t) {
  const env = 0.55 + 0.3 * Math.sin(TAU * 0.23 * t + 1) + 0.15 * Math.sin(TAU * 0.61 * t + 2.3);
  const w =
    Math.sin(TAU * 4.6 * t + 1.4 * Math.sin(TAU * 0.5 * t)) +
    0.6 * Math.sin(TAU * 6.3 * t + 0.8) +
    0.35 * Math.sin(TAU * 3.1 * t + 2.2) +
    0.3 * noise1(t * 12);
  return 0.55 * env * w;
}
export const vfVector = (t) => [0.75 * vf(t), -0.8 * vf(t + 1.9), 0.7 * vf(t + 3.7)];

export const asystoleVector = (t) => [0.012 * Math.sin(TAU * 0.18 * t), -0.02 * Math.sin(TAU * 0.13 * t + 1), 0.01 * noise1(t * 30)];

// ---- Monitor artifacts (not from the heart; added per lead) -------------------

// Which leads an electrode feeds, and how strongly. Augmented leads use all
// three limb electrodes; chest leads reference the average of the limbs.
const LL_WEIGHT = { I: 0, II: 1, III: 1, aVR: 0.5, aVL: 0.5, aVF: 1, V1: 0.33, V2: 0.33, V3: 0.33, V4: 0.33, V5: 0.33, V6: 0.33 };

export const ARTIFACTS = {
  // Patient moving or CPR-like jostling: big, irregular swings in bursts.
  movement(t, lead) {
    const cyc = ((t % 6) + 6) % 6;
    const on = cyc > 1.2 && cyc < 4.0 ? Math.sin((Math.PI * (cyc - 1.2)) / 2.8) : 0;
    if (!on) return 0;
    const k = LEAD_NAMES.indexOf(lead);
    return on * (0.7 * Math.sin(TAU * 3.7 * t + k) + 0.5 * Math.sin(TAU * 5.9 * t + 2 * k) + 0.45 * noise1(t * 9 + k * 3));
  },
  // Shivering / tremor: continuous fine, fast, irregular noise.
  tremor(t, lead) {
    const k = LEAD_NAMES.indexOf(lead);
    const g = LEADS[lead].plane === 'frontal' ? 1 : 0.6;
    return g * (0.07 * noise1(t * 45 + k * 5) + 0.05 * noise1(t * 95 + k * 11) + 0.03 * Math.sin(TAU * 13 * t + k));
  },
  // 60-cycle (AC) interference: a regular 60 Hz buzz thickening the line.
  ac60(t) {
    return 0.08 * Math.sin(TAU * 60 * t);
  },
  // Left-leg electrode intermittently losing contact.
  looseLL(t, lead) {
    const w = LL_WEIGHT[lead];
    if (!w) return null;
    const cyc = ((t % 7) + 7) % 7;
    return cyc > 2.2 && cyc < 4.6 ? w : null; // null = normal; a number = signal replaced
  },
};

// ---- Evaluate ------------------------------------------------------------------

// Build a lead's voltage function from a set of components and the rhythm's
// continuous activity. Dot products are precomputed once per call.
export function leadSignal(comps, rhythm, lead) {
  const L = LEADS[lead];
  const ax = [L.axis[0] * L.gain, L.axis[1] * L.gain, L.axis[2] * L.gain];
  const k = LEAD_NAMES.indexOf(lead);
  const n = comps.length;
  const tt = new Float64Array(n);
  const aa = new Float64Array(n);
  const s1 = new Float64Array(n);
  const s2 = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const c = comps[i];
    tt[i] = c.t;
    aa[i] = c.a * dot(c.v, ax);
    s1[i] = c.s1;
    s2[i] = c.s2;
  }
  const base = rhythm.baseline;
  const art = rhythm.artifact ? ARTIFACTS[rhythm.artifact] : null;
  return (t) => {
    let v = 0;
    for (let i = 0; i < n; i++) {
      const d = t - tt[i];
      const s = d < 0 ? s1[i] : s2[i];
      if (d > 5 * s || d < -5 * s) continue;
      v += aa[i] * Math.exp(-(d * d) / (2 * s * s));
    }
    if (base) v += dot(base(t), ax);
    if (!rhythm.noNoise) v += baselineNoise(t, k);
    if (art) {
      const a = art(t, lead);
      if (rhythm.artifact === 'looseLL') {
        // Contact lost: the heart's signal drops out and the line drifts.
        if (a != null) v = v * (1 - a) + a * (0.12 * noise1(t * 1.5 + k) + 0.02 * noise1(t * 25));
      } else v += a;
    }
    return v;
  };
}

// The heart's instantaneous electrical vector (for the 3D arrow).
export function vectorAt(comps, rhythm, t) {
  const out = [0, 0, 0];
  for (const c of comps) {
    const d = t - c.t;
    const s = d < 0 ? c.s1 : c.s2;
    if (d > 5 * s || d < -5 * s) continue;
    const g = c.a * Math.exp(-(d * d) / (2 * s * s));
    out[0] += g * c.v[0];
    out[1] += g * c.v[1];
    out[2] += g * c.v[2];
  }
  if (rhythm.baseline) {
    const b = rhythm.baseline(t);
    out[0] += b[0];
    out[1] += b[1];
    out[2] += b[2];
  }
  return out;
}

// Frontal-plane QRS axis in degrees, from the net QRS area in leads I and aVF
// (the quick method taught in class, done with the full waveform).
export function qrsAxis(comps) {
  let x = 0;
  let y = 0;
  for (const c of comps) {
    if (!c.qrs) continue;
    const area = c.a * (c.s1 + c.s2);
    x += area * dot(c.v, LEADS.I.axis);
    y += area * dot(c.v, LEADS.aVF.axis);
  }
  if (Math.hypot(x, y) < 1e-6) return null;
  return (Math.atan2(y, x) * 180) / Math.PI;
}
