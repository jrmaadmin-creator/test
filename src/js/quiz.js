// Quiz mode: the heart and the strip, no name, no narration. Pick the rhythm.
// Rhythms you miss come back more often.

const KEY = 'hcl:quiz';

function loadStats() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 1) return s;
  } catch {
    /* storage unavailable */
  }
  return { v: 1, total: 0, correct: 0, streak: 0, best: 0, per: {} };
}
function saveStats(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable: stats last for this visit only */
  }
}

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export class Quiz {
  constructor(root, { rhythms, groups, onLoad, onStudy, onAnswer, onSettings, treatQuestion }) {
    this.treatQuestion = treatQuestion;
    this.root = root;
    this.rhythms = rhythms;
    this.groups = groups;
    this.onLoad = onLoad;
    this.onStudy = onStudy;
    this.onAnswer = onAnswer;
    this.onSettings = onSettings;
    this.stats = loadStats();
    this.settings = { hard: false, stripOnly: false, artifacts: true, treatment: true, ...(this.stats.settings || {}) };
    this.current = null;
    this.answered = false;
    this.build();
  }

  pool() {
    return this.rhythms.filter((r) => this.settings.artifacts || r.group !== 'Monitor artifacts');
  }

  pick() {
    const pool = this.pool().filter((r) => r.id !== this.current);
    const weights = pool.map((r) => {
      const p = this.stats.per[r.id] || { r: 0, w: 0 };
      return Math.min(5, Math.max(0.35, 1 + 2 * p.w - 0.5 * p.r));
    });
    let x = Math.random() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < pool.length; i++) {
      x -= weights[i];
      if (x <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  next() {
    const r = this.pick();
    this.current = r.id;
    this.answered = false;
    this.tq = null;
    this.tqPick = null;
    this.onLoad(r.id);
    const pool = this.pool().filter((x) => x.id !== r.id);
    const same = shuffle(pool.filter((x) => x.group === r.group)).slice(0, 2);
    const rest = shuffle(pool.filter((x) => !same.includes(x))).slice(0, 3 - same.length);
    this.options = shuffle([r, ...same, ...rest]);
    this.render();
  }

  answer(id) {
    if (this.answered || !this.current) return;
    this.answered = true;
    const ok = id === this.current;
    const s = this.stats;
    const p = s.per[this.current] || { r: 0, w: 0 };
    if (ok) p.r += 1;
    else p.w += 1;
    s.per[this.current] = p;
    s.total += 1;
    if (ok) {
      s.correct += 1;
      s.streak += 1;
      s.best = Math.max(s.best, s.streak);
    } else s.streak = 0;
    saveStats(s);
    this.lastPick = id;
    if (this.settings.treatment && this.treatQuestion) {
      const tq = this.treatQuestion(this.current);
      if (tq) this.tq = { ...tq, options: shuffle([tq.a, ...tq.x]) };
    }
    this.onAnswer?.(s);
    this.render();
  }

  answerTreat(text) {
    if (!this.tq || this.tqPick != null) return;
    this.tqPick = text;
    const ok = text === this.tq.a;
    const t = this.stats.treat || { r: 0, w: 0 };
    if (ok) t.r += 1;
    else t.w += 1;
    this.stats.treat = t;
    saveStats(this.stats);
    this.onAnswer?.(this.stats);
    this.render();
  }

  // ---- UI -----------------------------------------------------------------

  build() {
    this.root.innerHTML = `
      <p class="eyebrow">Quiz</p>
      <h2>Name this rhythm</h2>
      <p class="quiz-score" id="quiz-score"></p>
      <div class="quiz-options" id="quiz-options" role="group" aria-label="Answer choices"></div>
      <div class="quiz-hard" id="quiz-hard" hidden>
        <label for="quiz-select" class="sr-only">Your answer</label>
        <select id="quiz-select"></select>
        <button type="button" class="btn btn-primary" id="quiz-check">Check</button>
      </div>
      <div class="quiz-result" id="quiz-result" hidden aria-live="polite"></div>
      <details class="quiz-settings">
        <summary>Quiz settings</summary>
        <label class="toggle"><input type="checkbox" id="quiz-set-hard"> <span>Hard: choose from every rhythm</span></label>
        <label class="toggle"><input type="checkbox" id="quiz-set-strip"> <span>Strip only (hide the 3D heart)</span></label>
        <label class="toggle"><input type="checkbox" id="quiz-set-art"> <span>Include monitor artifacts</span></label>
        <label class="toggle"><input type="checkbox" id="quiz-set-treat"> <span>Ask a treatment question after each rhythm (NH v9.3)</span></label>
        <button type="button" class="btn-link" id="quiz-reset">Reset my quiz stats</button>
      </details>
      <section class="quiz-weak"><h3>Your weakest rhythms</h3><ol id="quiz-weak"></ol></section>`;
    const sel = this.root.querySelector('#quiz-select');
    for (const g of this.groups) {
      const og = document.createElement('optgroup');
      og.label = g;
      for (const r of this.rhythms.filter((x) => x.group === g)) {
        const o = document.createElement('option');
        o.value = r.id;
        o.textContent = r.name;
        og.appendChild(o);
      }
      sel.appendChild(og);
    }
    this.root.querySelector('#quiz-check').addEventListener('click', () => this.answer(sel.value));
    const bind = (id, key) => {
      const el = this.root.querySelector(id);
      el.checked = this.settings[key];
      el.addEventListener('change', () => {
        this.settings[key] = el.checked;
        this.stats.settings = this.settings;
        saveStats(this.stats);
        this.onSettings?.(this.settings);
        this.render();
      });
    };
    bind('#quiz-set-hard', 'hard');
    bind('#quiz-set-strip', 'stripOnly');
    bind('#quiz-set-art', 'artifacts');
    bind('#quiz-set-treat', 'treatment');
    this.root.querySelector('#quiz-reset').addEventListener('click', (e) => {
      const b = e.currentTarget;
      if (b.dataset.confirm !== '1') {
        b.dataset.confirm = '1';
        b.textContent = 'Press again to erase your stats';
        return;
      }
      this.stats = { v: 1, total: 0, correct: 0, streak: 0, best: 0, per: {}, settings: this.settings };
      saveStats(this.stats);
      b.dataset.confirm = '';
      b.textContent = 'Reset my quiz stats';
      this.onAnswer?.(this.stats);
      this.render();
    });
  }

  render() {
    const s = this.stats;
    const pct = s.total ? Math.round((100 * s.correct) / s.total) : 0;
    const tr = s.treat && s.treat.r + s.treat.w ? ` · treatment ${s.treat.r}/${s.treat.r + s.treat.w}` : '';
    this.root.querySelector('#quiz-score').textContent = s.total
      ? `${s.correct} of ${s.total} correct (${pct}%) · streak ${s.streak} · best ${s.best}${tr}`
      : 'Watch the heart and the strip, measure if you need to, then answer.';

    const opts = this.root.querySelector('#quiz-options');
    const hard = this.root.querySelector('#quiz-hard');
    opts.hidden = this.settings.hard;
    hard.hidden = !this.settings.hard || this.answered;
    opts.replaceChildren();
    if (!this.settings.hard) {
      (this.options || []).forEach((r, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'quiz-opt';
        b.innerHTML = `<kbd>${i + 1}</kbd><span></span>`;
        b.lastChild.textContent = r.name;
        b.disabled = this.answered;
        if (this.answered) {
          if (r.id === this.current) b.dataset.state = 'right';
          else if (r.id === this.lastPick) b.dataset.state = 'wrong';
        }
        b.addEventListener('click', () => this.answer(r.id));
        opts.appendChild(b);
      });
    }

    const res = this.root.querySelector('#quiz-result');
    res.hidden = !this.answered;
    if (this.answered) {
      const r = this.rhythms.find((x) => x.id === this.current);
      const ok = this.lastPick === this.current;
      res.dataset.state = ok ? 'right' : 'wrong';
      res.innerHTML = `<p class="quiz-verdict"></p><p class="quiz-name"></p><p class="quiz-why"></p>
        <p class="quiz-tip"></p>
        <div class="quiz-actions"><button type="button" class="btn btn-primary" id="quiz-next">Next rhythm <kbd>Enter</kbd></button>
        <button type="button" class="btn" id="quiz-study">Study this rhythm</button></div>`;
      res.querySelector('.quiz-verdict').textContent = ok ? 'Correct' : 'Not quite';
      res.querySelector('.quiz-name').textContent = r.name;
      res.querySelector('.quiz-why').textContent = r.summary;
      res.querySelector('.quiz-tip').textContent = `Tip: ${r.tip}`;
      res.querySelector('#quiz-next').addEventListener('click', () => this.next());
      res.querySelector('#quiz-study').addEventListener('click', () => this.onStudy(r.id));
      if (this.tq) {
        const box = document.createElement('div');
        box.className = 'quiz-treat';
        const h = document.createElement('p');
        h.className = 'quiz-verdict';
        h.textContent = 'Treatment question';
        const qq = document.createElement('p');
        qq.textContent = this.tq.q;
        box.append(h, qq);
        for (const text of this.tq.options) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'quiz-opt quiz-opt-small';
          b.textContent = text;
          b.disabled = this.tqPick != null;
          if (this.tqPick != null && text === this.tq.a) b.dataset.state = 'right';
          else if (this.tqPick === text) b.dataset.state = 'wrong';
          b.addEventListener('click', () => this.answerTreat(text));
          box.appendChild(b);
        }
        if (this.tqPick != null) {
          const f = document.createElement('p');
          f.className = 'quiz-tip';
          f.textContent = `${this.tqPick === this.tq.a ? 'Correct.' : `Answer: ${this.tq.a}.`} Source: ${this.tq.cite === 'AHA' ? 'AHA ACLS' : `NH Patient Care Protocols v9.3, ${this.tq.cite}`}.`;
          box.appendChild(f);
        }
        res.insertBefore(box, res.querySelector('.quiz-actions'));
      }
    }

    const weak = Object.entries(s.per)
      .filter(([, p]) => p.w > 0)
      .map(([id, p]) => [id, p.w / (p.r + p.w), p])
      .sort((a, b) => b[1] - a[1] || b[2].w - a[2].w)
      .slice(0, 5);
    const ol = this.root.querySelector('#quiz-weak');
    ol.replaceChildren();
    if (!weak.length) {
      const li = document.createElement('li');
      li.className = 'muted';
      li.textContent = 'Missed rhythms will show up here.';
      ol.appendChild(li);
    }
    for (const [id, rate, p] of weak) {
      const li = document.createElement('li');
      const name = this.rhythms.find((x) => x.id === id)?.name || id;
      li.textContent = `${name}: missed ${p.w} of ${p.r + p.w} (${Math.round(rate * 100)}%)`;
      ol.appendChild(li);
    }
  }

  key(e) {
    if (!this.answered && !this.settings.hard && /^[1-4]$/.test(e.key)) {
      const r = this.options?.[Number(e.key) - 1];
      if (r) this.answer(r.id);
      return true;
    }
    if (this.answered && e.key === 'Enter') {
      this.next();
      return true;
    }
    return false;
  }
}
