import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import * as E from '../app/js/engine.js';
import { PROTOCOLS, BY_ID } from '../app/js/protocols/index.js';

test('every protocol passes validation', () => {
  for (const p of PROTOCOLS) assert.deepEqual(E.validateProtocol(p), [], p.id);
});

test('validator catches a broken link and an unreachable node', () => {
  const p = { id: 'x', title: 'X', category: 'M', verified: false, source: { doc: 'd' }, start: 'a',
    nodes: { a: { type: 'info', text: 'A', next: 'zzz' }, b: { type: 'info', text: 'B', next: 'END' } } };
  const errs = E.validateProtocol(p);
  assert.ok(errs.some(e => e.includes('"zzz" does not exist')));
  assert.ok(errs.some(e => e.includes('x.b: unreachable')));
});

test('verified protocol must cite section and page', () => {
  const p = { ...BY_ID['stroke'], verified: true, source: { doc: 'NH Patient Care Protocols v9.3' } };
  assert.ok(E.validateProtocol(p).some(e => e.includes('needs source.section')));
});

test('walk chest pain: answers record findings, impressions rank ACS first', () => {
  const c = E.newCall(0);
  const p = BY_ID['chest-pain'];
  E.startProtocol(c, p, 1);
  E.answer(c, p, 0, 2); // sudden at rest
  E.answer(c, p, 0, 3); // pressure
  E.answer(c, p, 0, 4); // arm/jaw
  E.answer(c, p, 0, 5); // diaphoresis
  assert.equal(E.impressions(c)[0].name, 'ACS');
  assert.equal(E.currentNode(c, p).text, 'Cardiac history');
});

test('back() removes the recorded answer', () => {
  const c = E.newCall(0);
  const p = BY_ID['chest-pain'];
  E.startProtocol(c, p);
  E.answer(c, p, 0);
  const n = c.events.length;
  E.back(c, p);
  assert.equal(c.events.length, n - 1);
  assert.equal(c.runs['chest-pain'].current, 'onset');
});

test('skipping aspirin shows as a missed critical action', () => {
  const c = E.newCall(0);
  const p = BY_ID['chest-pain'];
  E.startProtocol(c, p);
  for (let i = 0; i < 5; i++) E.answer(c, p, 0);   // onset..history
  E.completeAction(c, p, 'done');                  // oxygen
  E.completeAction(c, p, 'done');                  // als
  E.answer(c, p, 0);                               // no ASA contraindications
  E.completeAction(c, p, 'not-done', 'forgot');    // aspirin
  const missed = E.missedActions(c, p).map(m => m.id);
  assert.ok(missed.includes('asa'));
});

test('contraindicated aspirin is not flagged as missed', () => {
  const c = E.newCall(0);
  const p = BY_ID['chest-pain'];
  E.startProtocol(c, p);
  for (let i = 0; i < 5; i++) E.answer(c, p, 0);
  E.completeAction(c, p, 'done');
  E.completeAction(c, p, 'done');
  E.answer(c, p, 1); // allergy -> skips asa node
  assert.ok(!E.missedActions(c, p).some(m => m.id === 'asa'));
});

test('adult vitals flags; pediatric not flagged', () => {
  const v = { hr: 140, sbp: 76, rr: 16, spo2: 92, bgl: 110, gcs: 15 };
  const f = E.vitalFlags(v, 50);
  assert.deepEqual(f.map(x => `${x.field}:${x.level}`).sort(), ['hr:critical', 'sbp:critical', 'spo2:abnormal']);
  assert.deepEqual(E.vitalFlags(v, 4), []);
});

test('report has MIST sections, vitals trend, treatments with times', () => {
  const c = E.newCall(0);
  c.patient = { age: '64', ageUnit: 'yr', sex: 'M' };
  c.chiefComplaint = 'chest pressure';
  const t = new Date(2026, 0, 1, 14, 5).getTime();
  E.addVitals(c, { sbp: 150, dbp: 90, hr: 104 }, t);
  E.addVitals(c, { sbp: 138, dbp: 84, hr: 92 }, t + 10 * 60e3);
  const r = E.buildReport(c, BY_ID);
  assert.deepEqual(r.sections.map(s => s[0]), ['M', 'I', 'S', 'T']);
  assert.match(r.text, /64-year-old male/);
  assert.match(r.text, /Initial 1405: BP 150\/90/);
  assert.match(r.text, /Most recent 1415: BP 138\/84/);
});

test('service worker caches every app file', () => {
  const sw = readFileSync(new URL('../app/sw.js', import.meta.url), 'utf8');
  const protoFiles = readdirSync(new URL('../app/js/protocols/', import.meta.url)).filter(f => f.endsWith('.js'));
  for (const f of protoFiles) assert.ok(sw.includes(`js/protocols/${f}`), `sw.js missing ${f}`);
  for (const f of ['js/app.js', 'js/engine.js', 'css/app.css', 'index.html']) assert.ok(sw.includes(f), f);
});

test('level ordering and above-level actions are not flagged as missed', () => {
  assert.equal(E.aboveLevel('Paramedic', 'EMT'), true);
  assert.equal(E.aboveLevel('EMT', 'AEMT'), false);
  assert.equal(E.aboveLevel(undefined, 'EMT'), false);
  const p = { id: 't', title: 'T', category: 'M', verified: false, source: { doc: 'd' }, start: 'a',
    nodes: { a: { type: 'action', text: 'Give drug', critical: true, level: 'Paramedic', next: 'END' } } };
  const c = E.newCall(0);
  E.startProtocol(c, p);
  E.completeAction(c, p, 'above-level');
  assert.deepEqual(E.missedActions(c, p), []);
});

test('nh protocols must cite every node and level every action', () => {
  const p = { id: 'n', nh: '9.3', title: 'N', category: 'M', verified: false, source: { doc: 'd' }, start: 'a',
    nodes: { a: { type: 'action', text: 'X', next: 'END' } } };
  const errs = E.validateProtocol(p);
  assert.ok(errs.some(e => e.includes('missing cite')));
  assert.ok(errs.some(e => e.includes('action needs level')));
});
