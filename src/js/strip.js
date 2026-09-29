// Rhythm strip on standard ECG paper: 25 mm/s, 10 mm/mV, 1 mm small boxes,
// 5 mm large boxes. Monitor-style sweep: new trace overwrites the old one.

import { evalComps, baselineNoise } from './ecg.js';

const SMALL_BOX = 0.04; // seconds per mm at 25 mm/s

export class Strip {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.grid = document.createElement('canvas');
    this.caliper = null;
    this.paused = false;
    this.bindCalipers();
    new ResizeObserver(() => this.resize()).observe(canvas.parentElement);
    this.readTheme();
    this.resize();
  }

  readTheme() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    this.c = {
      paper: v('--paper'),
      minor: v('--grid-minor'),
      major: v('--grid-major'),
      trace: v('--trace'),
      label: v('--accent'),
      ectopic: v('--ectopic'),
      block: v('--block'),
      muted: v('--muted'),
      caliper: v('--caliper'),
      ink: v('--ink'),
    };
    this.drawGrid();
  }

  resize() {
    const w = Math.max(this.canvas.parentElement.clientWidth, 200);
    this.seconds = w < 560 ? 3 : 6;
    this.mm = w / (this.seconds / SMALL_BOX);
    this.pps = w / this.seconds;
    const h = Math.round(Math.max(160, Math.min(224, this.mm * 28)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = w;
    this.H = h;
    this.dpr = dpr;
    for (const cv of [this.canvas, this.grid]) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }
    this.canvas.style.height = `${h}px`;
    this.drawGrid();
  }

  drawGrid() {
    if (!this.W || !this.c) return;
    const g = this.grid.getContext('2d');
    const { W, H, mm, dpr } = this;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = this.c.paper;
    g.fillRect(0, 0, W, H);
    const cols = Math.ceil(W / mm);
    const rows = Math.ceil(H / mm);
    for (const major of [false, true]) {
      g.beginPath();
      g.strokeStyle = major ? this.c.major : this.c.minor;
      g.lineWidth = major ? 1 : 0.6;
      for (let i = 0; i <= cols; i++) {
        if ((i % 5 === 0) !== major) continue;
        const x = Math.round(i * mm) + 0.5;
        g.moveTo(x, 0);
        g.lineTo(x, H);
      }
      for (let j = 0; j <= rows; j++) {
        if ((j % 5 === 0) !== major) continue;
        const y = Math.round(H - j * mm) + 0.5;
        g.moveTo(0, y);
        g.lineTo(W, y);
      }
      g.stroke();
    }
    // Rhythm-strip paper carries a tick mark every 3 seconds along the top edge.
    g.strokeStyle = this.c.ink;
    g.lineWidth = 2;
    g.beginPath();
    for (let s = 0; s <= this.seconds; s += 3) {
      const x = Math.min(Math.max(s * this.pps, 1), W - 1);
      g.moveTo(x, 0);
      g.lineTo(x, 9);
    }
    g.stroke();
  }

  bindCalipers() {
    const x = (e) => e.clientX - this.canvas.getBoundingClientRect().left;
    this.canvas.addEventListener('pointerdown', (e) => {
      if (!this.paused) return;
      this.canvas.setPointerCapture(e.pointerId);
      this.caliper = { x0: x(e), x1: x(e), dragging: true };
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (this.caliper?.dragging) this.caliper.x1 = x(e);
    });
    const end = () => {
      if (this.caliper) this.caliper.dragging = false;
    };
    this.canvas.addEventListener('pointerup', end);
    this.canvas.addEventListener('pointercancel', end);
  }

  draw(simT, engine, rhythm, opts = {}) {
    const { ctx, W, H, pps, dpr, seconds } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.grid, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const lead = rhythm.lead || 'II';
    const y0 = H * (lead === 'V1' ? 0.42 : 0.6);
    const mv = this.mm * 10;
    const sweepStart = Math.floor(simT / seconds) * seconds;
    const head = (simT - sweepStart) * pps;
    const gap = 16;

    const beats = engine.between(sweepStart - seconds, simT + 0.1);
    const comps = [];
    for (const b of beats) for (const c of b.comps) comps.push(c);
    const base = rhythm.baseline;
    const signal = (t) => evalComps(comps, t) + (base ? base(t) : 0) + (rhythm.noNoise ? 0 : baselineNoise(t));

    // Time -> x on the current screen, or null if that moment is not displayed.
    const tx = (t) => {
      if (t >= sweepStart && t <= simT) return (t - sweepStart) * pps;
      const x = (t - sweepStart + seconds) * pps;
      if (t < sweepStart && x > head + gap && x <= W) return x;
      return null;
    };

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.c.trace;
    ctx.lineWidth = Math.max(1.4, this.mm * 0.32);
    const stroke = (xa, xb, t0) => {
      if (xb <= xa) return;
      ctx.beginPath();
      for (let x = xa; x <= xb; x += 0.5) {
        const y = y0 - signal(t0 + x / pps) * mv;
        if (x === xa) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    stroke(0, head, sweepStart);
    stroke(Math.ceil((head + gap) * 2) / 2, W, sweepStart - seconds);

    // Pacemaker spikes are too narrow to sample; draw them directly.
    for (const b of beats) {
      for (const s of b.spikes) {
        const x = tx(s);
        if (x == null) continue;
        ctx.beginPath();
        ctx.moveTo(x, y0 + 0.2 * mv);
        ctx.lineTo(x, y0 - 1.5 * mv);
        ctx.stroke();
      }
    }

    // Sweep head.
    ctx.fillStyle = this.c.label;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(head - 1, 0, 2, H);
    ctx.globalAlpha = 1;

    const font = `600 ${Math.max(10, Math.min(13, this.mm * 2.2))}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    if (opts.waveLabels) {
      for (const b of beats) {
        for (const l of b.labels) {
          const x = tx(l.t);
          if (x == null) continue;
          ctx.fillStyle =
            l.kind === 'blocked' ? this.c.block : l.kind === 'ectopic' ? this.c.ectopic : l.kind === 'hidden' ? this.c.muted : this.c.label;
          const y = l.text === 'T' || l.text === 'δ' ? 38 : 24;
          ctx.fillText(l.text, x, y);
        }
      }
    }

    if (opts.intervals) {
      const yPR = H - 26;
      const yQ = H - 10;
      for (const b of beats) {
        for (const iv of b.intervals) {
          const xa = tx(iv.t0);
          const xb = tx(iv.t1);
          if (xa == null || xb == null || xb < xa) continue;
          const y = iv.kind === 'PR' ? yPR : yQ;
          ctx.strokeStyle = iv.kind === 'PR' ? this.c.label : this.c.ectopic;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(xa, y - 4);
          ctx.lineTo(xa, y);
          ctx.lineTo(xb, y);
          ctx.lineTo(xb, y - 4);
          ctx.stroke();
          const txt = (iv.t1 - iv.t0).toFixed(2);
          if (iv.kind === 'PR') ctx.fillText(txt, (xa + xb) / 2, y - 5);
          else ctx.fillText(txt, xb + 16, y + 3);
        }
      }
    }

    if (this.paused && this.caliper) this.drawCaliper();
  }

  drawCaliper() {
    const { ctx, H, pps } = this;
    const { x0, x1 } = this.caliper;
    const dx = Math.abs(x1 - x0);
    ctx.strokeStyle = this.c.caliper;
    ctx.fillStyle = this.c.caliper;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, H);
    ctx.moveTo(x1, 0);
    ctx.lineTo(x1, H);
    ctx.stroke();
    ctx.setLineDash([]);
    if (dx < 4) return;
    const sec = dx / pps;
    const boxes = sec / SMALL_BOX;
    const text = `${sec.toFixed(2)} s · ${boxes.toFixed(0)} small boxes · ${Math.round(60 / sec)}/min`;
    ctx.font = '600 12px "JetBrains Mono", ui-monospace, monospace';
    const tw = ctx.measureText(text).width + 14;
    const mid = (x0 + x1) / 2;
    const bx = Math.min(Math.max(mid - tw / 2, 4), this.W - tw - 4);
    const by = H / 2 - 12;
    ctx.fillStyle = this.c.paper;
    ctx.globalAlpha = 0.92;
    ctx.fillRect(bx, by, tw, 24);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = this.c.caliper;
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 0.5, by + 0.5, tw - 1, 23);
    ctx.fillStyle = this.c.caliper;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bx + 7, by + 12.5);
  }
}
