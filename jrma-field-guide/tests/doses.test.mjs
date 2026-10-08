import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DOSES, searchDoses, doseSummary } from '../app/js/doses.js';

test('dose data excludes A3 rows and canine doses, every row cites a page', () => {
  assert.ok(DOSES.length > 400);
  for (const d of DOSES) {
    assert.notEqual(d.protocol, 'A3');
    assert.doesNotMatch(`${d.group} ${d.level}`, /canine/i);
    assert.ok(d.page && d.verbatim && d.drug, d.drug);
  }
});

test('search matches every term across drug, indication, and protocol', () => {
  const hits = searchDoses('naloxone');
  assert.ok(hits.length > 0 && hits.every(h => /naloxone/i.test(h.drug + h.indication + h.protocolTitle)));
  assert.ok(searchDoses('3.5A').every(h => h.protocol.includes('3.5A')));
});

test('EMT filter does not match AEMT-only rows', () => {
  for (const h of searchDoses('a', { level: 'EMT' })) assert.match(h.level, /(^|[^A])EMT/);
  assert.ok(searchDoses('a', { level: 'AEMT' }).length > 0);
});

test('group filter', () => {
  assert.ok(searchDoses('midazolam', { group: 'Pediatric' }).every(h => /pediatric/i.test(h.group)));
  assert.ok(searchDoses('midazolam', { group: 'Adult' }).every(h => /adult/i.test(h.group)));
});

test('dose summary never blank', () => {
  for (const d of DOSES) assert.ok(doseSummary(d).length > 0);
});

test('service worker caches dose data', () => {
  const sw = readFileSync(new URL('../app/sw.js', import.meta.url), 'utf8');
  assert.ok(sw.includes('js/data/nh-doses.js') && sw.includes('js/doses.js'));
});
