// Beat model. One timeline drives both the 3D heart and the rhythm strip:
// every beat records which conduction segments fire and when (acts), which
// chambers depolarize (chambers), and the ECG wave components it produces
// (comps). Because both views read the same record, they cannot drift apart.

import { SHAPES, qtFor } from './ecg.js';

// Seeded RNG so a rhythm always generates the same strip.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function newBeat() {
  return {
    tStart: Infinity,
    tEnd: -Infinity,
    comps: [],
    spikes: [],
    acts: [],
    chambers: [],
    ripples: [],
    labels: [],
    intervals: [],
    captions: [],
    p: [],
    qrs: null,
  };
}

const span = (b, t0, t1) => {
  if (t0 < b.tStart) b.tStart = t0;
  if (t1 > b.tEnd) b.tEnd = t1;
};

// kind: 'normal' (SA-driven, amber), 'ectopic' (other origin, violet)
// block: { at: 0..1, kind: 'block' (pathologic, red x) | 'filter' (physiologic, fades) }
export function act(b, seg, t0, t1, o = {}) {
  b.acts.push({ seg, t0, t1, rev: !!o.rev, block: o.block || null, kind: o.kind || 'normal' });
  span(b, t0, t1 + 0.4);
}
export function chamber(b, ch, d0, d1, r0, r1) {
  b.chambers.push({ ch, d0, d1, r0, r1 });
  span(b, d0, r1);
}
export function ripple(b, at, t0, t1, kind = 'normal') {
  b.ripples.push({ at, t0, t1, kind });
  span(b, t0, t1);
}
export function label(b, t, text, kind = 'normal') {
  b.labels.push({ t, text, kind });
}
export function interval(b, kind, t0, t1) {
  b.intervals.push({ kind, t0, t1 });
}
export function caption(b, t, text) {
  b.captions.push({ t, text });
}
export function addComps(b, comps) {
  for (const c of comps) {
    b.comps.push(c);
    span(b, c.t - 5 * c.s1, c.t + 5 * c.s2);
  }
}
export function spike(b, t) {
  b.spikes.push(t);
  span(b, t - 0.01, t + 0.01);
}

// ---- Building blocks -------------------------------------------------------

// SA node fires at t; impulse crosses the atria. Returns arrival time at the AV node.
export function sinusAtria(b, t, o = {}) {
  const lead = o.lead || 'II';
  act(b, 'sa', t, t + 0.025);
  act(b, 'bachmann', t + 0.01, t + 0.07);
  act(b, 'intAnt', t + 0.01, t + 0.045);
  act(b, 'intMid', t + 0.01, t + 0.048);
  act(b, 'intPost', t + 0.01, t + 0.052);
  chamber(b, 'RA', t, t + 0.07, t + 0.2, t + 0.32);
  chamber(b, 'LA', t + 0.03, t + 0.1, t + 0.23, t + 0.35);
  ripple(b, 'sa', t, t + 0.14);
  addComps(b, SHAPES[lead].P(t));
  label(b, t + 0.05, 'P', o.pKind || 'normal');
  if (o.caption !== false) {
    caption(b, t, o.caption || 'SA node fires. The impulse spreads across both atria, drawing the P wave.');
  }
  b.p.push(t);
  return t + 0.05;
}

// Early beat from an irritable atrial cell (PAC). Different P shape, violet impulse.
export function ectopicAtria(b, t, o = {}) {
  ripple(b, 'pac', t, t + 0.16, 'ectopic');
  chamber(b, 'RA', t, t + 0.08, t + 0.2, t + 0.32);
  chamber(b, 'LA', t + 0.035, t + 0.11, t + 0.23, t + 0.35);
  act(b, 'intPost', t + 0.02, t + 0.06, { kind: 'ectopic' });
  addComps(b, SHAPES.II.Pectopic(t));
  label(b, t + 0.045, "P'", 'ectopic');
  caption(b, t, o.caption || 'An irritable atrial cell fires before the SA node. Its P wave looks different.');
  b.p.push(t);
  return t + 0.055;
}

// Junctional origin: fires at the AV junction, travels down (QRS) and back up (inverted P).
export function junctionalFire(b, t) {
  ripple(b, 'av', t, t + 0.14, 'ectopic');
  act(b, 'av', t, t + 0.03, { kind: 'ectopic' });
  for (const s of ['intAnt', 'intMid', 'intPost']) act(b, s, t + 0.005, t + 0.05, { rev: true, kind: 'ectopic' });
  chamber(b, 'RA', t + 0.01, t + 0.08, t + 0.22, t + 0.34);
  chamber(b, 'LA', t + 0.03, t + 0.1, t + 0.24, t + 0.36);
  addComps(b, SHAPES.II.Pinv(t));
  label(b, t + 0.045, 'P', 'ectopic');
  caption(b, t, 'The AV junction fires on its own. The impulse travels backward into the atria, so the P wave is inverted.');
  b.p.push(t);
}

// AV node conduction from tIn to tOut, optionally blocked partway.
export function avNode(b, tIn, tOut, o = {}) {
  act(b, 'av', tIn, tOut, { block: o.block, kind: o.kind });
  if (o.block) {
    const tb = tIn + (tOut - tIn) * o.block.at;
    if (o.block.kind === 'block') {
      caption(b, tb, o.blockCaption || 'Impulse blocked in the AV node. This P wave gets no QRS.');
    }
  } else if (o.caption !== false) {
    caption(b, tIn + 0.005, o.caption || 'The AV node holds the impulse so the atria can finish filling the ventricles (PR segment).');
  }
}

// His bundle -> bundle branches -> Purkinje -> ventricles, QRS onset at q.
export function ventricles(b, q, o = {}) {
  const lead = o.lead || 'II';
  const kind = o.kind || 'normal';
  const rr = o.rr || 0.8;
  const shape = SHAPES[lead][o.shape || 'narrow'](q);
  const qt = qtFor(rr, shape.width > 0.11);

  if (o.hisBlock) {
    act(b, 'his', q - 0.045, q - 0.02, { block: o.hisBlock, kind });
    caption(b, q - 0.035, o.blockCaption || 'Impulse blocked below the AV node, in the His bundle. No QRS.');
    return;
  }
  act(b, 'his', q - 0.045, q - 0.02, { kind });
  caption(b, q - 0.045, 'Impulse leaves the AV node and enters the bundle of His.');

  if (o.rbbb) {
    act(b, 'rbb', q - 0.02, q + 0.01, { block: { at: 0.3, kind: 'block' }, kind });
    act(b, 'lbb', q - 0.02, q - 0.005, { kind });
    act(b, 'laf', q - 0.005, q + 0.015, { kind });
    act(b, 'lpf', q - 0.005, q + 0.015, { kind });
    act(b, 'purkL', q, q + 0.03, { kind });
    act(b, 'purkR', q + 0.05, q + 0.1, { kind });
    ripple(b, 'septumR', q + 0.035, q + 0.11, 'ectopic');
    chamber(b, 'LV', q, q + 0.08, q + qt - 0.2, q + qt);
    chamber(b, 'RV', q + 0.045, q + 0.13, q + qt - 0.18, q + qt + 0.02);
    caption(b, q, 'Right bundle is blocked. The left ventricle fires first; the right ventricle is reached late, muscle to muscle (R prime).');
  } else if (o.lbbb) {
    act(b, 'rbb', q - 0.02, q + 0.01, { kind });
    act(b, 'lbb', q - 0.02, q - 0.005, { block: { at: 0.35, kind: 'block' }, kind });
    act(b, 'laf', q + 0.06, q + 0.1, { kind });
    act(b, 'lpf', q + 0.06, q + 0.1, { kind });
    act(b, 'purkR', q + 0.005, q + 0.035, { kind });
    act(b, 'purkL', q + 0.07, q + 0.13, { kind });
    ripple(b, 'septumL', q + 0.02, q + 0.12, 'ectopic');
    chamber(b, 'RV', q + 0.005, q + 0.085, q + qt - 0.2, q + qt);
    chamber(b, 'LV', q + 0.03, q + 0.15, q + qt - 0.18, q + qt + 0.02);
    caption(b, q, 'Left bundle is blocked. The right ventricle fires first; the large left ventricle is reached slowly, muscle to muscle.');
  } else {
    act(b, 'rbb', q - 0.02, q + 0.01, { kind });
    act(b, 'lbb', q - 0.02, q - 0.005, { kind });
    act(b, 'laf', q - 0.005, q + 0.015, { kind });
    act(b, 'lpf', q - 0.005, q + 0.015, { kind });
    act(b, 'purkR', q + 0.005, q + 0.035, { kind });
    act(b, 'purkL', q, q + 0.03, { kind });
    chamber(b, 'LV', q, q + 0.08, q + qt - 0.2, q + qt);
    chamber(b, 'RV', q + 0.005, q + 0.085, q + qt - 0.2, q + qt);
    if (!o.quiet) {
      caption(b, q, o.qrsCaption || 'Bundle branches and Purkinje fibers fire both ventricles together: narrow QRS.');
    }
  }

  addComps(b, shape.comps);
  const tComps = SHAPES[lead].T(q, qt, o.tAmp);
  addComps(b, tComps);
  label(b, q + shape.width / 2, 'QRS', kind);
  label(b, tComps[0].t, 'T', 'normal');
  interval(b, 'QRS', q, q + shape.width);
  if (!o.quiet) caption(b, tComps[0].t - 0.08, 'T wave: the ventricles repolarize (reset) before the next beat.');
  b.qrs = q;
  b.qrsWidth = shape.width;
}

// Ventricular origin (PVC, escape, VT, paced). Spreads muscle to muscle: wide QRS.
export function ventricularFocus(b, q, o = {}) {
  const at = o.at || 'pvc';
  const rr = o.rr || 1;
  const shape = o.shape === 'paced' ? SHAPES.II.paced(q) : SHAPES.II.wide(q, o.amp);
  const qt = qtFor(rr, true);
  ripple(b, at, q, q + 0.2, 'ectopic');
  const first = o.first || 'RV';
  const other = first === 'RV' ? 'LV' : 'RV';
  chamber(b, first, q, q + 0.12, q + qt - 0.2, q + qt);
  chamber(b, other, q + 0.035, q + 0.16, q + qt - 0.18, q + qt + 0.02);
  if (o.shape === 'paced') {
    spike(b, q - 0.004);
    act(b, 'pacer', q - 0.03, q - 0.004, { kind: 'ectopic' });
  }
  addComps(b, shape.comps);
  const tComps = SHAPES.II.Twide(q, qt, o.tAmp ?? -0.45 * Math.sign(o.amp ?? 1));
  addComps(b, tComps);
  label(b, q + shape.width / 2, o.label || 'QRS', 'ectopic');
  label(b, tComps[0].t, 'T', 'normal');
  interval(b, 'QRS', q, q + shape.width);
  if (o.caption !== false) {
    caption(b, q, o.caption || 'A ventricular cell fires on its own. The impulse misses the fast Purkinje network and crawls through muscle: wide QRS.');
  }
  b.qrs = q;
  b.qrsWidth = shape.width;
}

// Convenience: one fully conducted sinus beat.
export function sinusBeat(b, t, pr, o = {}) {
  const avIn = sinusAtria(b, t, o);
  const q = t + pr;
  avNode(b, avIn, q - 0.045, { caption: o.avCaption });
  ventricles(b, q, o);
  interval(b, 'PR', t, q);
  return q;
}

// ---- Engine ----------------------------------------------------------------

export class Engine {
  load(rhythm) {
    this.rhythm = rhythm;
    this.state = { t: 0.35, n: 0, rng: mulberry32(rhythm.seed || 11) };
    rhythm.init?.(this.state);
    this.beats = [];
  }

  ensure(tUntil) {
    let guard = 0;
    while (this.state.t < tUntil && guard++ < 500) {
      const b = newBeat();
      this.rhythm.next(b, this.state);
      this.state.n += 1;
      if (b.tStart === Infinity) {
        b.tStart = b.tEnd = this.state.t;
      }
      this.beats.push(b);
    }
  }

  prune(tBefore) {
    if (this.beats.length > 400 || (this.beats[0] && this.beats[0].tEnd < tBefore - 2)) {
      this.beats = this.beats.filter((b) => b.tEnd >= tBefore);
    }
  }

  // Beats whose window overlaps [t0, t1].
  between(t0, t1) {
    const out = [];
    for (const b of this.beats) if (b.tEnd >= t0 && b.tStart <= t1) out.push(b);
    return out;
  }
}
