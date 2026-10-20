// CPR timer logic. Pure functions over a cpr state object; timing values come from
// data/nh-arrest.js (NH v9.3 3.2A / 3.2P / 3.6), never from constants written here.
import ARREST from './data/nh-arrest.js';

export { ARREST };

export function newCpr(now = Date.now(), group = 'adult') {
  return { startedAt: now, group, cycleStart: now, cycles: 0, events: [], lastEpi: null, epiCount: 0, shocks: 0, rosc: null };
}

export function cprLog(cpr, kind, text, now = Date.now()) {
  cpr.events.push({ t: now, kind, text });
  if (kind === 'epi') { cpr.lastEpi = now; cpr.epiCount += 1; }
  if (kind === 'shock') cpr.shocks += 1;
  if (kind === 'check') { cpr.cycles += 1; cpr.cycleStart = now; }
  if (kind === 'rosc') cpr.rosc = now;
}

// Seconds until the next rhythm/pulse check; negative = overdue.
export function cycleLeft(cpr, now = Date.now()) {
  return Math.round((cpr.cycleStart + ARREST.cycleSeconds * 1000 - now) / 1000);
}

// Seconds until epinephrine is next due. Adult: due once the first cycle ends, then every other cycle.
// Pediatric first-dose timing depends on rhythm (3.2P), so it is null until the first dose is logged.
export function epiLeft(cpr, now = Date.now()) {
  const e = ARREST[cpr.group].epi;
  if (cpr.lastEpi != null) return Math.round((cpr.lastEpi + e.intervalSeconds * 1000 - now) / 1000);
  if (e.firstAfterCycle != null && cpr.cycles >= e.firstAfterCycle) return 0;
  return null;
}

// Elapsed-time prompts from NH (8 min advanced airway, 20 min TOR consideration).
export function milestones(cpr, now = Date.now()) {
  const sec = (now - cpr.startedAt) / 1000;
  const out = [];
  if (cpr.group === 'adult' && sec >= 4 * ARREST.cycleSeconds) out.push({ key: 'airway', text: '8 min / 4 cycles: switch to BVM, consider SGA; Paramedic ETI', cite: ARREST.adult.airwayAfter.cite });
  if (sec >= ARREST.torMinimumSeconds) out.push({ key: 'tor', text: '20 min reached: TOR may be considered (8.15 factors)', cite: ARREST.torMinimum.cite });
  return out;
}

export function mmss(sec) {
  const neg = sec < 0;
  const s = Math.abs(sec);
  return `${neg ? '-' : ''}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
