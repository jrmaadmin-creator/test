// Standard 12-lead printout: 3 rows x 4 columns of 2.5 s each (I II III /
// aVR aVL aVF / V1 V2 V3 / V4 V5 V6) plus a 10-second lead II rhythm strip,
// on 25 mm/s, 10 mm/mV paper, with 1 mV calibration pulses. Plus the two
// axis diagrams that explain it: the frontal hexaxial wheel and the chest
// leads' horizontal plane.

import { Engine } from './engine.js';
import { LEADS, leadSignal, qrsAxis } from './ecg.js';

const LAYOUT = [
  ['I', 'aVR', 'V1', 'V4'],
  ['II', 'aVL', 'V2', 'V5'],
  ['III', 'aVF', 'V3', 'V6'],
];
const SECONDS = 10;
const CAL_MM = 7; // left margin that holds the calibration pulse

export function capture(rhythm) {
  const e = new Engine();
  e.load(rhythm);
  e.ensure(15);
  const t0 = 2;
  const beats = e.between(t0 - 1, t0 + SECONDS + 1);
  const comps = beats.flatMap((b) => b.comps);
  const sigs = Object.fromEntries(Object.keys(LEADS).map((l) => [l, leadSignal(comps, rhythm, l)]));
  // A representative beat for the axis: the first QRS in the window.
  const beat = beats.find((b) => b.qrs != null && b.qrs > t0 + 0.5);
  const axis = beat ? qrsAxis(beat.comps) : null;
  let horiz = null;
  if (beat) {
    let x = 0;
    let z = 0;
    for (const c of beat.comps) {
      if (!c.qrs) continue;
      const a = c.a * (c.s1 + c.s2);
      x += a * c.v[0];
      z += a * c.v[2];
    }
    if (Math.hypot(x, z) > 1e-6) horiz = (Math.atan2(z, x) * 180) / Math.PI;
  }
  return { t0, sigs, beats, axis, horiz, spikes: beats.flatMap((b) => b.spikes) };
}

export class TwelveLead {
  constructor(canvas, { onSelect } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onSelect = onSelect;
    this.selected = 'II';
    this.hover = null;
    canvas.addEventListener('pointermove', (e) => {
      const l = this.hit(e);
      if (l !== this.hover) {
        this.hover = l;
        canvas.style.cursor = l ? 'pointer' : 'default';
        this.draw();
      }
    });
    canvas.addEventListener('pointerleave', () => {
      this.hover = null;
      this.draw();
    });
    canvas.addEventListener('click', (e) => {
      const l = this.hit(e);
      if (l) {
        this.selected = l;
        this.onSelect?.(l);
        this.draw();
      }
    });
    new ResizeObserver(() => this.resize()).observe(canvas.parentElement);
  }

  readTheme() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    this.c = {
      paper: v('--paper'),
      minor: v('--grid-minor'),
      major: v('--grid-major'),
      trace: v('--trace'),
      ink: v('--ink'),
      accent: v('--accent'),
    };
  }

  set(rhythm) {
    this.rhythm = rhythm;
    this.data = capture(rhythm);
    this.resize();
  }

  resize() {
    const parent = this.canvas.parentElement;
    // Keep the paper readable: scroll sideways on narrow screens.
    const w = Math.max(parent.clientWidth, 760);
    this.mm = w / (SECONDS / 0.04 + CAL_MM);
    this.pps = this.mm / 0.04;
    this.rowH = this.mm * 26;
    this.W = w;
    this.H = Math.round(this.rowH * 4 + this.mm * 2);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(this.H * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${this.H}px`;
    this.readTheme();
    this.draw();
  }

  hit(e) {
    const r = this.canvas.getBoundingClientRect();
    const x = e.clientX - r.left - CAL_MM * this.mm;
    const y = e.clientY - r.top;
    const row = Math.floor(y / this.rowH);
    if (x < 0 || row < 0) return null;
    if (row === 3) return 'II';
    const col = Math.floor(x / (2.5 * this.pps));
    return LAYOUT[row]?.[col] || null;
  }

  draw() {
    if (!this.data || !this.W) return;
    const { ctx, W, H, mm, pps, dpr, rowH } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = this.c.paper;
    ctx.fillRect(0, 0, W, H);
    for (const major of [false, true]) {
      ctx.beginPath();
      ctx.strokeStyle = major ? this.c.major : this.c.minor;
      ctx.lineWidth = major ? 1 : 0.55;
      for (let i = 0; i <= W / mm; i++) {
        if ((i % 5 === 0) !== major) continue;
        const x = Math.round(i * mm) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let j = 0; j <= H / mm; j++) {
        if ((j % 5 === 0) !== major) continue;
        const y = Math.round(j * mm) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();
    }

    const x0 = CAL_MM * mm;
    const mv = mm * 10;
    const { sigs, t0, spikes } = this.data;
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(1.1, mm * 0.28);

    const trace = (lead, tStart, tEnd, xStart, yBase) => {
      const f = sigs[lead];
      ctx.strokeStyle = this.c.trace;
      ctx.beginPath();
      for (let x = 0; x <= (tEnd - tStart) * pps; x += 0.5) {
        const y = yBase - f(tStart + x / pps) * mv;
        if (x === 0) ctx.moveTo(xStart + x, y);
        else ctx.lineTo(xStart + x, y);
      }
      ctx.stroke();
      for (const s of spikes) {
        if (s < tStart || s > tEnd) continue;
        const x = xStart + (s - tStart) * pps;
        ctx.beginPath();
        ctx.moveTo(x, yBase + 0.2 * mv);
        ctx.lineTo(x, yBase - 1.2 * mv);
        ctx.stroke();
      }
    };

    for (let r = 0; r < 4; r++) {
      const yBase = r * rowH + rowH * 0.58;
      // 1 mV, 0.2 s calibration pulse.
      ctx.strokeStyle = this.c.trace;
      ctx.beginPath();
      ctx.moveTo(mm, yBase);
      ctx.lineTo(2 * mm, yBase);
      ctx.lineTo(2 * mm, yBase - mv);
      ctx.lineTo(7 * mm - 0.5 * mm, yBase - mv);
      ctx.lineTo(7 * mm - 0.5 * mm, yBase);
      ctx.lineTo(7 * mm, yBase);
      ctx.stroke();
      if (r === 3) {
        trace('II', t0, t0 + SECONDS, x0, yBase);
        this.label('II  rhythm', x0 + 4, r * rowH + 4, this.selected === 'II' || this.hover === 'II');
        continue;
      }
      for (let c = 0; c < 4; c++) {
        const lead = LAYOUT[r][c];
        const ts = t0 + c * 2.5;
        const xs = x0 + c * 2.5 * pps;
        trace(lead, ts, ts + 2.5, xs, yBase);
        if (c > 0) {
          ctx.strokeStyle = this.c.ink;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(xs, yBase - 0.35 * mv);
          ctx.lineTo(xs, yBase + 0.35 * mv);
          ctx.stroke();
          ctx.lineWidth = Math.max(1.1, mm * 0.28);
        }
        this.label(lead, xs + 4, r * rowH + 4, this.selected === lead || this.hover === lead);
        if (this.selected === lead || this.hover === lead) {
          ctx.strokeStyle = this.c.accent;
          ctx.lineWidth = this.selected === lead ? 2 : 1;
          ctx.strokeRect(xs + 1, r * rowH + 1, 2.5 * pps - 2, rowH - 2);
          ctx.lineWidth = Math.max(1.1, mm * 0.28);
        }
      }
    }
  }

  label(text, x, y, on) {
    const { ctx } = this;
    ctx.font = '700 12px "JetBrains Mono", ui-monospace, monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    const w = ctx.measureText(text).width + 8;
    ctx.fillStyle = on ? this.c.accent : this.c.paper;
    ctx.globalAlpha = on ? 1 : 0.85;
    ctx.fillRect(x - 3, y - 1, w, 16);
    ctx.globalAlpha = 1;
    ctx.fillStyle = on ? this.c.paper : this.c.ink;
    ctx.fillText(text, x + 1, y + 1);
  }
}

// Frontal (hexaxial) and horizontal plane diagrams, with the QRS direction.
export function drawAxes(canvas, data, selected) {
  const ctx = canvas.getContext('2d');
  const cs = getComputedStyle(document.documentElement);
  const col = (n) => cs.getPropertyValue(n).trim();
  const w = canvas.parentElement.clientWidth || 300;
  const size = Math.min(w / 2 - 6, 190);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round((size + 34) * dpr);
  canvas.style.height = `${size + 34}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, size + 34);

  const wheel = (cx, title, leads, angleOf, qrsDeg, flipY) => {
    const cy = 16 + size / 2;
    const R = size / 2 - 22;
    ctx.fillStyle = col('--muted');
    ctx.font = '600 11px "Barlow Semi Condensed", "Arial Narrow", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(title, cx, 0);
    ctx.strokeStyle = col('--line');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    for (const l of leads) {
      const a = (angleOf(l) * Math.PI) / 180;
      const dx = Math.cos(a);
      const dy = flipY ? -Math.sin(a) : Math.sin(a);
      const on = l === selected;
      ctx.strokeStyle = on ? col('--accent') : col('--muted');
      ctx.lineWidth = on ? 2.5 : 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + dx * R, cy + dy * R);
      ctx.stroke();
      ctx.fillStyle = on ? col('--accent') : col('--ink');
      ctx.font = `${on ? 700 : 600} 11px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'middle';
      ctx.fillText(l, cx + dx * (R + 13), cy + dy * (R + 10));
    }
    if (qrsDeg != null) {
      const a = (qrsDeg * Math.PI) / 180;
      const dx = Math.cos(a);
      const dy = flipY ? -Math.sin(a) : Math.sin(a);
      ctx.strokeStyle = col('--impulse');
      ctx.fillStyle = col('--impulse');
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + dx * R * 0.8, cy + dy * R * 0.8);
      ctx.stroke();
      const hx = cx + dx * R * 0.8;
      const hy = cy + dy * R * 0.8;
      ctx.beginPath();
      ctx.moveTo(hx + dx * 8, hy + dy * 8);
      ctx.lineTo(hx - dy * 5, hy + dx * 5);
      ctx.lineTo(hx + dy * 5, hy - dx * 5);
      ctx.fill();
    }
  };

  // Frontal: ECG angles grow clockwise (+90 = down), matching screen y.
  wheel(w * 0.25, 'FRONTAL (limb leads)', ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'], (l) => LEADS[l].deg, data?.axis, false);
  // Horizontal, viewed from above with the patient's front at the bottom.
  wheel(w * 0.75, 'HORIZONTAL (chest leads)', ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'], (l) => LEADS[l].deg, data?.horiz, false);
}

export function axisWords(deg) {
  if (deg == null) return 'No measurable QRS axis';
  const d = Math.round(deg);
  let zone = 'normal';
  if (d > 90 && d <= 180) zone = 'right axis deviation';
  else if (d < -30 && d >= -90) zone = 'left axis deviation';
  else if (d < -90) zone = 'extreme (northwest) axis';
  return `${d > 0 ? '+' : ''}${d}°: ${zone}`;
}
