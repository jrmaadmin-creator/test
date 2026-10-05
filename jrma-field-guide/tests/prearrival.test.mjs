import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import * as E from '../app/js/engine.js';
import { BY_ID } from '../app/js/protocols/index.js';
import { buildPrearrival, ageText, mailtoLink } from '../app/js/prearrival.js';
import { buildPdf, wrap } from '../app/js/pdf.js';

function sampleCall() {
  const c = E.newCall(0);
  c.patient = { age: '64', ageUnit: 'yr', sex: 'M' };
  c.chiefComplaint = 'chest pressure';
  c.moi = 'sudden onset at rest';
  c.notes = 'Pt John Smith, 12 Main St';
  c.history = { sampleA: 'NKDA', sampleE: 'shoveling at 12 Main St' };
  const p = BY_ID['chest-pain'];
  E.startProtocol(c, p, 1);
  E.answer(c, p, 0, 2);
  E.addVitals(c, { sbp: 150, dbp: 90, hr: 104 }, new Date(2026, 0, 1, 14, 5).getTime());
  c.prearrival = { etaMin: '8', level: 'ALS', alerts: ['STEMI ALERT'], requests: ['Isolation room'] };
  return c;
}

test('pre-arrival never includes notes or history free text', () => {
  const r = buildPrearrival(sampleCall(), { unit: 'JRMA Medic 1' }, BY_ID, new Date(2026, 0, 1, 14, 10).getTime());
  assert.doesNotMatch(r.text, /John|Smith|Main St|NKDA/);
  assert.match(r.text, /64-year-old male/);
  assert.match(r.text, /MOI\/NOI: sudden onset at rest/);
  assert.match(r.text, /\*\*\* STEMI ALERT \*\*\*/);
  assert.match(r.text, /ETA 1418 \(8 min\)/);
  assert.match(r.text, /Isolation room/);
});

test('age 90 and over is reported as 90+', () => {
  assert.equal(ageText({ age: '93', ageUnit: 'yr' }), '90+ year-old');
  assert.equal(ageText({ age: '89', ageUnit: 'yr' }), '89-year-old');
  assert.equal(ageText({ age: '7', ageUnit: 'mo' }), '7-month-old');
});

test('mailto link addresses the fax gateway and carries the report', () => {
  const r = buildPrearrival(sampleCall(), {}, BY_ID);
  const href = mailtoLink(r, '16035550100@fax.example');
  assert.ok(href.startsWith('mailto:16035550100@fax.example?subject='));
  assert.ok(decodeURIComponent(href).includes('PRE-ARRIVAL REPORT'));
});

test('PDF is well formed: header, xref offsets point at objects, text present', () => {
  const r = buildPrearrival(sampleCall(), {}, BY_ID);
  const bytes = buildPdf(r.lines);
  const s = new TextDecoder().decode(bytes);
  assert.ok(s.startsWith('%PDF-1.4'));
  assert.ok(s.trimEnd().endsWith('%%EOF'));
  const startxref = Number(s.match(/startxref\n(\d+)/)[1]);
  assert.ok(s.slice(startxref).startsWith('xref'));
  const offsets = [...s.slice(startxref).matchAll(/^(\d{10}) 00000 n $/gm)].map(m => Number(m[1]));
  offsets.forEach((o, i) => assert.ok(s.slice(o).startsWith(`${i + 1} 0 obj`), `object ${i + 1}`));
  assert.match(s, /\(JRMA PRE-ARRIVAL REPORT\) Tj/);
});

test('PDF escapes parentheses and replaces non-ASCII', () => {
  const s = new TextDecoder().decode(buildPdf([{ text: 'SpO2 (RA) 92% – café' }]));
  assert.match(s, /\(SpO2 \\\(RA\\\) 92% \? caf\?\) Tj/);
});

test('long reports wrap and paginate', () => {
  const lines = Array.from({ length: 120 }, (_, i) => ({ text: `line ${i} ` + 'x'.repeat(150) }));
  const s = new TextDecoder().decode(buildPdf(lines));
  assert.ok(Number(s.match(/\/Count (\d+)/)[1]) >= 3);
  assert.ok(wrap('y'.repeat(200), 12).every(l => l.length <= 70));
});

test('service worker caches every top-level js file', () => {
  const sw = readFileSync(new URL('../app/sw.js', import.meta.url), 'utf8');
  for (const f of readdirSync(new URL('../app/js/', import.meta.url)).filter(f => f.endsWith('.js'))) assert.ok(sw.includes(`js/${f}`), f);
});

import { faxDigits, faxAddress } from '../app/js/prearrival.js';

test('fax numbers normalize to 10 digits and build the SRFax address', () => {
  assert.equal(faxDigits('603-532-2405'), '6035322405');
  assert.equal(faxDigits('1 (603) 532-2405'), '6035322405');
  assert.equal(faxDigits('532-2405'), null);
  assert.equal(faxAddress({ faxService: 'srfax', faxNumber: '603-532-2405' }), '16035322405@srfax.com');
  assert.equal(faxAddress({ faxService: 'srfax', faxNumber: '' }), null);
  assert.equal(faxAddress({ faxService: 'custom', faxEmail: ' x@y.example ' }), 'x@y.example');
});

test('test mode stamps the report top and bottom and the subject', () => {
  const r = buildPrearrival(sampleCall(), { testMode: true }, BY_ID);
  assert.equal(r.lines[0].text, '*** TEST - NOT A PATIENT ***');
  assert.equal(r.lines[r.lines.length - 1].text, '*** TEST - NOT A PATIENT ***');
  assert.match(r.subject, /^TEST - /);
  assert.doesNotMatch(buildPrearrival(sampleCall(), { testMode: false }, BY_ID).text, /TEST - NOT/);
});

test('default settings send to the JRMA station fax via SRFax, in test mode', async () => {
  const { DEFAULT_SETTINGS } = await import('../app/js/prearrival.js');
  assert.equal(faxAddress(DEFAULT_SETTINGS), '16035322405@srfax.com');
  assert.equal(DEFAULT_SETTINGS.testMode, true);
});
