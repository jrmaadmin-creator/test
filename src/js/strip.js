// Rhythm strip on standard ECG paper (25 mm/s, 10 mm/mV) with two optional
// bands under it that share the same time axis:
//   Timeline: a ladder diagram (A / AV / V tiers) showing where each impulse
//             starts, how long it spends in the AV node, and where it is blocked.
//   Pulse:    the arterial pulse each beat produces (no pulse = flat).
// Always 6 seconds. Narrow screens stack it as two 3-second rows, the way a
// printed 12-lead wraps, so the 6-second count still works in portrait.

import { leadSignal, noise1 } from './ecg.js';

const SMALL_BOX = 0.04; // seconds per mm at 25 mm/s
const SECONDS = 6;
const GAP = 0.08; // erase bar ahead of the sweep, in seconds

// Arterial pulse shape: fast upstroke, slower runoff, small dicrotic notch.
function pulseShape(x) {
  if (x < 0 || x > 0.9) return 0;
  const g = (m, s1, s2) => {
    const d = x - m;
    const s = d < 0 ? s1 : s2;
    return Math.exp(-(d * d) / (2 * s * s));
  };
  return g(0.1, 0.04, 0.15) + 0.18 * g(0.36, 0.03, 0.06) - 0.08 * g(0.3, 0.015, 0.015);
}

export class Strip {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.grid = document.createElement('canvas');
    this.caliper = null;
    this.paused = false;
    this.lead = 'II';
    this.showLadder = opts.ladder ?? true;
    this.showPulse = opts.pulse ?? true;
    this.fixedRows = opts.rows || null;
    this.compact = !!opts.compact;
    if (opts.interactive !== false) this.bindCalipers();
    new ResizeObserver(() => this.resize()).observe(canvas.parentElement);
    this.readTheme();
    this.resize();
  }

  setBands({ ladder, pulse }) {
    if (ladder != null) this.showLadder = ladder;
    if (pulse != null) this.showPulse = pulse;
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
      band: v('--band'),
      bandLine: v('--line'),
      pulse: v('--pulse'),
      impulse: v('--impulse'),
    };
    this.drawGrid();
  }

  resize() {
    const w = Math.max(this.canvas.parentElement.clientWidth, 200);
    this.rows = this.fixedRows || (w < 600 ? 2 : 1);
    this.secPerRow = SECONDS / this.rows;
    this.pps = w / this.secPerRow;
    this.mm = this.pps * SMALL_BOX;
    const ecgMax = this.compact ? 120 : 185;
    this.ecgH = Math.round(Math.max(this.compact ? 90 : 120, Math.min(ecgMax, this.mm * 26)));
    this.ladderH = this.showLadder ? (this.compact ? 42 : 48) : 0;
    this.pulseH = this.showPulse ? (this.compact ? 30 : 36) : 0;
    this.fit = null;
    this.rowGap = this.rows > 1 ? 10 : 0;
    this.rowH = this.ecgH + this.ladderH + this.pulseH;
    const h = this.rows * this.rowH + (this.rows - 1) * this.rowGap;
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
    this.onResize?.();
  }

  rowTop(r) {
    return r * (this.rowH + this.rowGap);
  }

  drawGrid() {
    if (!this.W || !this.c) return;
    const g = this.grid.getContext('2d');
    const { W, mm, dpr, ecgH } = this;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, this.H);
    for (let r = 0; r < this.rows; r++) {
      const top = this.rowTop(r);
      g.fillStyle = this.c.paper;
      g.fillRect(0, top, W, ecgH);
      const cols = Math.ceil(W / mm);
      const rowsMm = Math.ceil(ecgH / mm);
      for (const major of [false, true]) {
        g.beginPath();
        g.strokeStyle = major ? this.c.major : this.c.minor;
        g.lineWidth = major ? 1 : 0.6;
        for (let i = 0; i <= cols; i++) {
          if ((i % 5 === 0) !== major) continue;
          const x = Math.round(i * mm) + 0.5;
          g.moveTo(x, top);
          g.lineTo(x, top + ecgH);
        }
        for (let j = 0; j <= rowsMm; j++) {
          if ((j % 5 === 0) !== major) continue;
          const y = Math.round(top + ecgH - j * mm) + 0.5;
          if (y < top) continue;
          g.moveTo(0, y);
          g.lineTo(W, y);
        }
        g.stroke();
      }
      // Rhythm-strip paper carries a tick mark every 3 seconds along the top.
      g.strokeStyle = this.c.ink;
      g.lineWidth = 2;
      g.beginPath();
      for (let s = 0; s <= this.secPerRow + 1e-6; s += 3) {
        const x = Math.min(Math.max(s * this.pps, 1), W - 1);
        g.moveTo(x, top);
        g.lineTo(x, top + 8);
      }
      g.stroke();

      // Bands.
      let y = top + ecgH;
      g.font = '600 10px "Barlow Semi Condensed", "Arial Narrow", sans-serif';
      g.textBaseline = 'middle';
      if (this.ladderH) {
        g.fillStyle = this.c.band;
        g.fillRect(0, y, W, this.ladderH);
        g.strokeStyle = this.c.bandLine;
        g.lineWidth = 1;
        g.beginPath();
        for (let k = 0; k <= 3; k++) {
          const yy = Math.round(y + (k * this.ladderH) / 3) + 0.5;
          g.moveTo(0, yy);
          g.lineTo(W, yy);
        }
        g.stroke();
        g.fillStyle = this.c.muted;
        ['A', 'AV', 'V'].forEach((t, k) => g.fillText(t, 4, y + ((k + 0.5) * this.ladderH) / 3));
        y += this.ladderH;
      }
      if (this.pulseH) {
        g.fillStyle = this.c.band;
        g.fillRect(0, y, W, this.pulseH);
        g.strokeStyle = this.c.bandLine;
        g.beginPath();
        g.moveTo(0, Math.round(y) + 0.5);
        g.lineTo(W, Math.round(y) + 0.5);
        g.stroke();
        g.fillStyle = this.c.muted;
        g.fillText('PULSE', 4, y + 9);
      }
    }
  }

  bindCalipers() {
    const pos = (e) => {
      const b = this.canvas.getBoundingClientRect();
      const x = e.clientX - b.left;
      const y = e.clientY - b.top;
      const row = Math.min(this.rows - 1, Math.max(0, Math.floor(y / (this.rowH + this.rowGap))));
      return { x, row };
    };
    this.canvas.addEventListener('pointerdown', (e) => {
      if (!this.paused) return;
      this.canvas.setPointerCapture(e.pointerId);
      const p = pos(e);
      this.caliper = { row: p.row, x0: p.x, x1: p.x, dragging: true };
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (this.caliper?.dragging) this.caliper.x1 = pos(e).x;
    });
    const end = () => {
      if (this.caliper) this.caliper.dragging = false;
    };
    this.canvas.addEventListener('pointerup', end);
    this.canvas.addEventListener('pointercancel', end);
  }

  // Live sweep display.
  draw(simT, engine, rhythm, opts = {}) {
    const S = Math.floor(simT / SECONDS) * SECONDS;
    this.render(engine.between(S - SECONDS, simT + 0.1), rhythm, { ...opts, S, head: simT - S, live: true });
  }

  // Static 6-second window starting at t0 (Compare mode, quiz review).
  drawStatic(engine, rhythm, t0, opts = {}) {
    this.render(engine.between(t0 - 1, t0 + SECONDS + 0.5), rhythm, { ...opts, S: t0, head: SECONDS, live: false });
  }

  render(beats, rhythm, o) {
    const { ctx, W, pps, dpr, ecgH, secPerRow } = this;
    const { S, head } = o;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.grid, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const lead = this.lead;
    const comps = [];
    for (const b of beats) for (const c of b.comps) comps.push(c);
    const signal = leadSignal(comps, rhythm, lead);
    // Fit the trace on the paper once per rhythm and lead, the way a monitor's
    // auto-gain does: move the baseline first, reduce gain only if needed.
    const key = `${rhythm.id}|${lead}|${ecgH}`;
    if (!this.fit || this.fit.key !== key) {
      let hi = 0;
      let lo = 0;
      for (let k = 0; k <= 400; k++) {
        const v = signal(S - SECONDS + (k / 400) * (SECONDS + head));
        if (v > hi) hi = v;
        if (v < lo) lo = v;
      }
      const top = 30;
      const bottom = 6;
      const mm10 = this.mm * 10;
      const avail = ecgH - top - bottom;
      let gain = 1;
      for (const g of [1, 0.75, 0.5]) {
        gain = g;
        if ((hi - lo) * mm10 * g <= avail) break;
      }
      const minY = top + hi * mm10 * gain;
      const maxY = ecgH - bottom + lo * mm10 * gain;
      const y = Math.min(Math.max(ecgH * 0.6, minY), Math.max(maxY, minY));
      this.fit = { key, gain, yFrac: y / ecgH };
    }
    const mv = this.mm * 10 * this.fit.gain;
    const baseFrac = this.fit.yFrac;

    // Paper position (0..6 s) of a moment in time, or null if not on screen.
    const tauOf = (t) => {
      if (t >= S && t - S <= head) return t - S;
      const tau = t - S + SECONDS;
      if (o.live && t < S && tau > head + GAP && tau <= SECONDS) return tau;
      return null;
    };
    const pos = (t) => {
      const tau = tauOf(t);
      if (tau == null) return null;
      const row = Math.min(this.rows - 1, Math.floor(tau / secPerRow));
      return { row, tau, x: (tau - row * secPerRow) * pps, top: this.rowTop(row) };
    };
    const timeAt = (tau) => {
      if (tau <= head) return S + tau;
      if (o.live && tau > head + GAP) return S - SECONDS + tau;
      return null;
    };

    // Trace.
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.c.trace;
    ctx.lineWidth = Math.max(1.3, this.mm * 0.3);
    for (let r = 0; r < this.rows; r++) {
      const y0 = this.rowTop(r) + ecgH * baseFrac;
      const top = this.rowTop(r);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, top, W, ecgH);
      ctx.clip();
      ctx.beginPath();
      let pen = false;
      for (let x = 0; x <= W; x += 0.5) {
        const t = timeAt(r * secPerRow + x / pps);
        if (t == null || t < 0) {
          pen = false;
          continue;
        }
        const y = y0 - signal(t) * mv;
        if (pen) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
        pen = true;
      }
      ctx.stroke();
      // Pacemaker spikes are too narrow to sample; draw them directly.
      for (const b of beats) {
        for (const s of b.spikes) {
          const p = pos(s);
          if (!p || p.row !== r) continue;
          ctx.beginPath();
          ctx.moveTo(p.x, y0 + 0.2 * mv);
          ctx.lineTo(p.x, y0 - 1.4 * mv);
          ctx.stroke();
        }
      }
      ctx.restore();
      // Lead name, as a monitor prints it.
      ctx.fillStyle = this.c.ink;
      ctx.font = '700 12px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.textBaseline = 'bottom';
      ctx.fillText(this.fit.gain === 1 ? lead : `${lead}  gain ×${this.fit.gain}`, 6, top + ecgH - 4);
    }

    // Sweep head.
    if (o.live) {
      const p = pos(S + head);
      if (p) {
        ctx.fillStyle = this.c.label;
        ctx.fillRect(p.x - 1, p.top, 2, this.rowH);
      }
    }

    ctx.font = `600 ${Math.max(10, Math.min(12, this.mm * 2.2))}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    if (o.waveLabels) {
      for (const b of beats) {
        for (const l of b.labels) {
          const p = pos(l.t);
          if (!p) continue;
          ctx.fillStyle =
            l.kind === 'blocked' ? this.c.block : l.kind === 'ectopic' ? this.c.ectopic : l.kind === 'hidden' ? this.c.muted : this.c.label;
          ctx.fillText(l.text, p.x, p.top + (l.text === 'T' || l.text === 'δ' ? 38 : 24));
        }
      }
    }
    if (o.intervals) {
      for (const b of beats) {
        for (const iv of b.intervals) {
          const a = pos(iv.t0);
          const z = pos(iv.t1);
          if (!a || !z || a.row !== z.row || z.x < a.x) continue;
          const y = a.top + ecgH - (iv.kind === 'PR' ? 22 : 8);
          ctx.strokeStyle = iv.kind === 'PR' ? this.c.label : this.c.ectopic;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(a.x, y - 4);
          ctx.lineTo(a.x, y);
          ctx.lineTo(z.x, y);
          ctx.lineTo(z.x, y - 4);
          ctx.stroke();
          const txt = (iv.t1 - iv.t0).toFixed(2);
          if (iv.kind === 'PR') ctx.fillText(txt, (a.x + z.x) / 2, y - 5);
          else ctx.fillText(txt, z.x + 16, y + 3);
        }
      }
    }

    if (this.ladderH) this.drawLadder(beats, rhythm, pos, timeAt);
    if (this.pulseH) this.drawPulse(beats, rhythm, timeAt);
    if (this.paused && this.caliper && o.live) this.drawCaliper();
  }

  drawLadder(beats, rhythm, pos, timeAt) {
    const { ctx, ecgH, ladderH } = this;
    const tier = (p, k) => p.top + ecgH + (k * ladderH) / 3; // k: 0 A top, 1 A/AV, 2 AV/V, 3 V bottom
    const line = (t0, k0, t1, k1, color, dash) => {
      const a = pos(t0);
      const b = pos(t1);
      // Skip segments that straddle the sweep's erase bar or a row break.
      if (!a || !b || a.row !== b.row || Math.abs(b.tau - a.tau - (t1 - t0)) > 1e-6) return;
      ctx.strokeStyle = color;
      ctx.setLineDash(dash ? [3, 3] : []);
      ctx.beginPath();
      ctx.moveTo(a.x, tier(a, k0));
      ctx.lineTo(b.x, tier(b, k1));
      ctx.stroke();
      ctx.setLineDash([]);
    };
    const bar = (t, k, color) => {
      const p = pos(t);
      if (!p) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(p.x - 5, tier(p, k));
      ctx.lineTo(p.x + 5, tier(p, k));
      ctx.stroke();
      ctx.lineWidth = 1.6;
    };
    const dot = (t, y, color) => {
      const p = pos(t);
      if (!p) return;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, tier(p, y), 3, 0, Math.PI * 2);
      ctx.fill();
    };
    ctx.lineWidth = 1.6;

    for (const b of beats) {
      const retro = b.acts.some((a) => a.rev && a.seg.startsWith('int'));
      const ectopicAtrial = b.ripples.some((r) => r.at === 'pac');
      const junction = b.ripples.some((r) => r.at === 'av' && r.kind === 'ectopic');
      // Atria.
      for (const c of b.chambers) {
        if (c.ch !== 'RA') continue;
        const col = retro || ectopicAtrial || rhythm.loop?.seg === 'flutterLoop' ? this.c.ectopic : this.c.impulse;
        if (retro) line(c.d0, 1, c.d0 + 0.05, 0, col);
        else line(c.d0, 0, c.d0 + 0.05, 1, col);
        if (ectopicAtrial) dot(c.d0, 0.5, this.c.ectopic);
      }
      // AV node / His.
      for (const a of b.acts) {
        if (a.seg !== 'av' && a.seg !== 'his' && a.seg !== 'kent') continue;
        const col = a.kind === 'ectopic' ? this.c.ectopic : this.c.impulse;
        if (a.seg === 'kent') {
          line(a.t0, 1, a.t1, 2, this.c.ectopic, true);
          continue;
        }
        if (a.seg === 'his') {
          if (a.block) bar(a.t0 + (a.t1 - a.t0) * a.block.at, 2, this.c.block);
          continue;
        }
        if (junction && a.kind === 'ectopic' && a.t1 - a.t0 < 0.05) {
          dot(a.t0, 1.5, this.c.ectopic);
          line(a.t0, 1.5, a.t0 + 0.01, 1, this.c.ectopic);
          line(a.t0, 1.5, a.t0 + 0.04, 2, this.c.ectopic);
          continue;
        }
        if (a.block) {
          const tb = a.t0 + (a.t1 - a.t0) * a.block.at;
          const kb = 1 + a.block.at;
          const blockCol = a.block.kind === 'block' ? this.c.block : this.c.muted;
          line(a.t0, 1, tb, kb, a.block.kind === 'block' ? col : this.c.muted);
          bar(tb, kb, blockCol);
        } else {
          line(a.t0, 1, a.t1 + 0.045, 2, col);
        }
      }
      // Ventricles.
      if (b.qrs != null) {
        const w = b.qrsWidth || 0.09;
        if (b.wide) {
          dot(b.qrs, 3, this.c.ectopic);
          line(b.qrs, 3, b.qrs + w * 0.8, 2, this.c.ectopic);
        } else {
          line(b.qrs, 2, b.qrs + w, 3, b.acts.some((a) => a.kind === 'ectopic' && a.seg === 'his') ? this.c.ectopic : this.c.impulse);
        }
      }
    }

    // Reentry circuits and chaos, drawn from the rhythm itself.
    const loopTier = { flutterLoop: 0.5, avnrtLoop: 1.5, vtLoop: 2.5, twistLoop: 2.5 };
    const chaos = rhythm.ambient?.chaos;
    for (let r = 0; r < this.rows; r++) {
      const y = (k) => this.rowTop(r) + ecgH + (k * ladderH) / 3;
      if (chaos) {
        const k0 = chaos === 'atria' ? 0 : 2;
        ctx.strokeStyle = this.c.ectopic;
        ctx.lineWidth = 1;
        ctx.beginPath();
        let pen = false;
        for (let x = 14; x <= this.W; x += 3) {
          const t = timeAt(r * this.secPerRow + x / this.pps);
          if (t == null || t < 0) {
            pen = false;
            continue;
          }
          const yy = y(k0 + 0.5) + noise1(t * 40) * ladderH * 0.14;
          if (pen) ctx.lineTo(x, yy);
          else ctx.moveTo(x, yy);
          pen = true;
        }
        ctx.stroke();
        ctx.lineWidth = 1.6;
      }
      if (rhythm.loop && rhythm.loop.seg !== 'flutterLoop') {
        const k = loopTier[rhythm.loop.seg];
        ctx.strokeStyle = this.c.ectopic;
        for (let x = 14; x <= this.W; x += rhythm.loop.period * this.pps) {
          const t = timeAt(r * this.secPerRow + x / this.pps);
          if (t == null || t < 0) continue;
          ctx.beginPath();
          ctx.arc(x, y(k), Math.min(5, ladderH / 8), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }

  drawPulse(beats, rhythm, timeAt) {
    const { ctx, ecgH, ladderH, pulseH } = this;
    const pulses = beats.filter((b) => b.mech && b.mech.sv > 0).map((b) => [b.mech.t + 0.12, b.mech.sv]);
    ctx.strokeStyle = this.c.pulse;
    ctx.lineWidth = 1.8;
    for (let r = 0; r < this.rows; r++) {
      const base = this.rowTop(r) + ecgH + ladderH + pulseH - 5;
      const amp = pulseH - 12;
      ctx.beginPath();
      let pen = false;
      for (let x = 40; x <= this.W; x += 1) {
        const t = timeAt(r * this.secPerRow + x / this.pps);
        if (t == null || t < 0) {
          pen = false;
          continue;
        }
        let v = 0;
        for (const [tp, sv] of pulses) v += sv * pulseShape(t - tp);
        const y = base - Math.min(v, 1.15) * amp;
        if (pen) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
        pen = true;
      }
      ctx.stroke();
    }
  }

  drawCaliper() {
    const { ctx, pps } = this;
    const { x0, x1, row } = this.caliper;
    const top = this.rowTop(row);
    const H = this.ecgH;
    const dx = Math.abs(x1 - x0);
    ctx.strokeStyle = this.c.caliper;
    ctx.fillStyle = this.c.caliper;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(x0, top);
    ctx.lineTo(x0, top + this.rowH);
    ctx.moveTo(x1, top);
    ctx.lineTo(x1, top + this.rowH);
    ctx.stroke();
    ctx.setLineDash([]);
    if (dx < 4) return;
    const sec = dx / pps;
    const text = `${sec.toFixed(2)} s · ${(sec / SMALL_BOX).toFixed(0)} small boxes · ${Math.round(60 / sec)}/min`;
    ctx.font = '600 12px "JetBrains Mono", ui-monospace, monospace';
    const tw = ctx.measureText(text).width + 14;
    const bx = Math.min(Math.max((x0 + x1) / 2 - tw / 2, 4), this.W - tw - 4);
    const by = top + H / 2 - 12;
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
