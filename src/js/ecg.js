// Waveform synthesis. Every function here is a pure function of time, so the
// strip can redraw any moment identically (sweep display, pause, calipers).
// Units: seconds and millivolts. Lead II unless a shape says otherwise.

const TAU = Math.PI * 2;

// One wave component: an asymmetric Gaussian (s1 = rising side, s2 = falling side).
export const comp = (t, a, s1, s2 = s1) => ({ t, a, s1, s2 });

export function evalComps(comps, t) {
  let v = 0;
  for (const c of comps) {
    const d = t - c.t;
    const s = d < 0 ? c.s1 : c.s2;
    if (d > 5 * s || d < -5 * s) continue;
    v += c.a * Math.exp(-(d * d) / (2 * s * s));
  }
  return v;
}

// QT shortens as rate rises (Bazett: QT = QTc * sqrt(RR)), QTc 0.40 s.
export function qtFor(rr, wide = false) {
  const qt = 0.4 * Math.sqrt(Math.max(rr, 0.25));
  return Math.min(Math.max(qt, 0.24), 0.48) + (wide ? 0.06 : 0);
}

// Shape library. P shapes take P onset; QRS shapes take QRS onset (q) and
// return { comps, width }. T shapes take q and QT.
export const SHAPES = {
  II: {
    P: (t) => [comp(t + 0.05, 0.15, 0.021)],
    Pinv: (t) => [comp(t + 0.045, -0.12, 0.02)],
    Pectopic: (t) => [comp(t + 0.035, 0.1, 0.016), comp(t + 0.07, -0.035, 0.014)],
    narrow: (q) => ({
      width: 0.09,
      comps: [comp(q + 0.012, -0.08, 0.007), comp(q + 0.04, 1.2, 0.011, 0.01), comp(q + 0.068, -0.25, 0.009)],
    }),
    // Infranodal disease (Mobitz II): borderline-wide, slurred.
    slurred: (q) => ({
      width: 0.12,
      comps: [comp(q + 0.05, 1.0, 0.016, 0.02), comp(q + 0.1, -0.22, 0.013)],
    }),
    // Ventricular origin: wide, bizarre, spreads muscle to muscle.
    wide: (q, amp = 1.25) => ({
      width: 0.16,
      comps: [comp(q + 0.065, amp, 0.028, 0.032), comp(q + 0.125, -0.3 * amp, 0.015)],
    }),
    // Right-ventricular apical pacing: superior axis, so negative in II.
    paced: (q) => ({
      width: 0.16,
      comps: [comp(q + 0.03, 0.12, 0.012), comp(q + 0.09, -1.05, 0.03, 0.034)],
    }),
    // Pre-excitation: slurred delta wave, then the normal AV-node impulse fuses in.
    wpw: (q) => ({
      width: 0.12,
      comps: [comp(q + 0.04, 0.32, 0.03, 0.012), comp(q + 0.07, 0.95, 0.011, 0.01), comp(q + 0.097, -0.2, 0.009)],
    }),
    T: (q, qt, a = 0.3) => [comp(q + qt - 0.095, a, 0.06, 0.038)],
    Twide: (q, qt, a = -0.45) => [comp(q + qt - 0.1, a, 0.07, 0.05)],
  },
  V1: {
    P: (t) => [comp(t + 0.035, 0.07, 0.016), comp(t + 0.078, -0.06, 0.016)],
    // RBBB: rSR' ("rabbit ears"), late R' from slow right-ventricle activation.
    rbbb: (q) => ({
      width: 0.13,
      comps: [comp(q + 0.018, 0.28, 0.009), comp(q + 0.05, -0.38, 0.011), comp(q + 0.098, 0.95, 0.018, 0.017)],
    }),
    // LBBB: tiny r then a deep, broad S (QS pattern).
    lbbb: (q) => ({
      width: 0.15,
      comps: [comp(q + 0.012, 0.08, 0.007), comp(q + 0.078, -1.45, 0.03, 0.034)],
    }),
    T: (q, qt, a = -0.2) => [comp(q + qt - 0.095, a, 0.06, 0.04)],
  },
};

// Deterministic value noise, so baseline texture redraws identically.
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

// Small wander + muscle noise present on every real strip.
export const baselineNoise = (t) =>
  0.018 * Math.sin(TAU * 0.21 * t + 0.6) + 0.01 * noise1(t * 37) + 0.005 * noise1(t * 140);

// Atrial fibrillation: fine, chaotic, non-repeating f-waves (no true P waves).
export const fibWaves = (t) =>
  0.045 * Math.sin(TAU * 5.3 * t + 0.3) +
  0.035 * Math.sin(TAU * 6.7 * t + 1.9 + 0.8 * Math.sin(TAU * 0.4 * t)) +
  0.03 * Math.sin(TAU * 8.1 * t + 4.2) * (0.6 + 0.4 * Math.sin(TAU * 0.37 * t)) +
  0.03 * noise1(t * 18);

// Typical atrial flutter in II: negative sawtooth, slow downslope, quick upstroke.
// Phase 0 = start of the downslope; the trough is at 0.7 of the cycle.
export function flutterWave(t, period, phase, amp = 0.22) {
  let f = ((t - phase) / period) % 1;
  if (f < 0) f += 1;
  const v = f < 0.7 ? -(f / 0.7) : -(1 - (f - 0.7) / 0.3);
  return amp * (v + 0.5);
}

// Coarse ventricular fibrillation: irregular amplitude and frequency, no complexes.
export function vfWave(t) {
  const env = 0.55 + 0.3 * Math.sin(TAU * 0.23 * t + 1) + 0.15 * Math.sin(TAU * 0.61 * t + 2.3);
  const w =
    Math.sin(TAU * 4.6 * t + 1.4 * Math.sin(TAU * 0.5 * t)) +
    0.6 * Math.sin(TAU * 6.3 * t + 0.8) +
    0.35 * Math.sin(TAU * 3.1 * t + 2.2) +
    0.3 * noise1(t * 12);
  return 0.55 * env * w;
}

// Asystole still shows a little wander; a perfectly flat line suggests a lead problem.
export const asystoleLine = (t) => 0.022 * Math.sin(TAU * 0.18 * t) + 0.007 * noise1(t * 30);
