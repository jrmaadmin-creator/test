import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ARREST, newCpr, cprLog, cycleLeft, epiLeft, milestones, mmss } from '../app/js/cpr.js';

test('timing values match the NH verbatim they claim to come from', () => {
  assert.equal(ARREST.cycleSeconds, 120);
  assert.match(ARREST.cycleCite.verbatim + ARREST.cycleCite.value, /2[- ]min/i);
  assert.ok(ARREST.metronome.bpm >= 100 && ARREST.metronome.bpm < 120);
  assert.match(ARREST.adult.epi.src.value, /every other cycle/i);
  assert.equal(ARREST.adult.epi.intervalSeconds, 2 * ARREST.cycleSeconds);
  assert.match(ARREST.torMinimum.value, /20 min/);
  for (const k of ['ventilation', 'defib', 'antidysrhythmic', 'mechanical']) {
    assert.match(ARREST.adult[k].cite, /PDF p\. \d+/, k);
    assert.match(ARREST.pediatric[k].cite, /PDF p\. \d+/, k);
  }
});

test('cycle countdown resets on rhythm check', () => {
  const c = newCpr(0);
  assert.equal(cycleLeft(c, 30000), 90);
  assert.equal(cycleLeft(c, 125000), -5);
  cprLog(c, 'check', 'x', 125000);
  assert.equal(c.cycles, 1);
  assert.equal(cycleLeft(c, 125000), 120);
});

test('adult epi: due after first cycle, then every other cycle', () => {
  const c = newCpr(0, 'adult');
  assert.equal(epiLeft(c, 60000), null);
  cprLog(c, 'check', 'x', 120000);
  assert.equal(epiLeft(c, 120000), 0);
  cprLog(c, 'epi', 'x', 130000);
  assert.equal(epiLeft(c, 130000), 240);
  assert.equal(c.epiCount, 1);
});

test('pediatric epi has no automatic first-dose time', () => {
  const c = newCpr(0, 'pediatric');
  cprLog(c, 'check', 'x', 120000);
  assert.equal(epiLeft(c, 120000), null);
});

test('8-minute airway and 20-minute TOR prompts', () => {
  const c = newCpr(0, 'adult');
  assert.deepEqual(milestones(c, 7 * 60e3), []);
  assert.deepEqual(milestones(c, 8 * 60e3).map(m => m.key), ['airway']);
  assert.deepEqual(milestones(c, 20 * 60e3).map(m => m.key), ['airway', 'tor']);
  assert.equal(mmss(-5), '-0:05');
});
