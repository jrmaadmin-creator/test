// Compare mode: several rhythms stacked on the same time scale, each with its
// ladder-diagram timeline, so differences in timing are visible at a glance.

import { Engine } from './engine.js';
import { Strip } from './strip.js';

export const SETS = {
  avblocks: {
    name: 'AV blocks',
    ids: ['nsr', 'avb1', 'avb2-1', 'avb2-2', 'avb3'],
    note: 'Read the AV tier. Normal: every impulse crosses in about 0.16 s. First-degree: every crossing is slow. Type I: each crossing is slower until one stops (red bar). Type II: crossings stay the same, then one stops below the node. Third-degree: nothing crosses; the V tier starts its own beats.',
  },
  narrow: {
    name: 'Fast and narrow',
    ids: ['sinus-tach', 'svt', 'aflutter', 'afib'],
    note: 'Where does each beat come from? Sinus tach: the A tier starts every beat. SVT: a loop in the AV tier. Flutter: a regular atrial loop, only some crossing. A-fib: chaos in the A tier, random crossings.',
  },
  wide: {
    name: 'Wide complexes',
    ids: ['pvc', 'ivr', 'vt', 'paced', 'lbbb', 'wpw'],
    note: 'A dot at the bottom of the V tier means the beat started in the ventricles (or at a pacemaker lead). Bundle branch block and WPW still start in the SA node; they are wide because of how the ventricles are reached.',
  },
  arrest: {
    name: 'Cardiac arrest',
    ids: ['vf', 'pea', 'asystole', 'torsades'],
    note: 'Look at the pulse band. PEA has an organized strip and a normal-looking ladder but no pulse. VF and torsades have no coordinated contraction. Asystole has nothing at all.',
  },
  origin: {
    name: 'Where the beat starts',
    ids: ['nsr', 'pac', 'junctional', 'pvc'],
    note: 'Follow the dots. Sinus beats start at the top of the A tier. A PAC starts elsewhere in the atria. A junctional beat starts in the AV tier and runs both up and down. A PVC starts at the bottom of the V tier.',
  },
  artifacts: {
    name: 'Real or artifact?',
    ids: ['vf', 'art-movement', 'afib', 'art-tremor', 'asystole', 'art-loose'],
    note: 'In each artifact row the ladder and pulse stay normal: the heart is fine and only the recording is disturbed. That is why you check the patient before treating the monitor.',
  },
};

export class CompareView {
  constructor(root, byId) {
    this.root = root;
    this.byId = byId;
    this.strips = [];
  }

  show(setKey, lead) {
    const set = SETS[setKey] || SETS.avblocks;
    this.root.replaceChildren();
    this.strips = [];
    for (const id of set.ids) {
      const r = this.byId[id];
      if (!r) continue;
      const row = document.createElement('section');
      row.className = 'cmp-row';
      const head = document.createElement('div');
      head.className = 'cmp-head';
      const h = document.createElement('h3');
      h.textContent = r.name;
      const facts = document.createElement('span');
      facts.textContent = `${r.criteria.rate.split('(')[0].trim()} · PR ${r.criteria.pr.split(',')[0]} · QRS ${r.criteria.qrs.split(',')[0].split(';')[0]}`;
      head.append(h, facts);
      const wrap = document.createElement('div');
      wrap.className = 'cmp-canvas';
      const canvas = document.createElement('canvas');
      wrap.appendChild(canvas);
      row.append(head, wrap);
      this.root.appendChild(row);

      const e = new Engine();
      e.load(r);
      e.ensure(14);
      const s = new Strip(canvas, { interactive: false, compact: true, ladder: true, pulse: true });
      s.lead = lead || r.lead || 'II';
      const paint = () => s.drawStatic(e, r, 4, { waveLabels: true });
      s.onResize = paint;
      paint();
      this.strips.push({ s, paint });
    }
    return set;
  }

  retheme() {
    for (const { s, paint } of this.strips) {
      s.readTheme();
      paint();
    }
  }
}
