import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { A3, BANDS, parseRange, bandsForWeight, bandForLength, bandByColor, citation } from '../app/js/peds.js';

test('A3 has 9 bands in tape order, each with source page and drug rows', () => {
  assert.deepEqual(BANDS.map(b => b.color), ['Gray', 'Pink', 'Red', 'Purple', 'Yellow', 'White', 'Blue', 'Orange', 'Green']);
  for (const b of BANDS) {
    assert.match(b.source.section, /Appendix A3/);
    assert.ok([253, 254, 255].includes(b.source.pdfPageIndex), b.color);
    assert.ok(b.drugs.length >= 40, b.color);
    for (const d of b.drugs) assert.ok(d.drug && d.dose, `${b.color} ${d.drug}`);
  }
  assert.equal(A3.meta.verified, false);
});

test('range parsing', () => {
  assert.deepEqual(parseRange('3-5 Kg (Avg 4.0 Kg)'), { lo: 3, hi: 5, avg: 4 });
  assert.deepEqual(parseRange('< 59.5 cm'), { lo: 0, hi: 59.5, avg: null });
  assert.deepEqual(parseRange('137-150 cm'), { lo: 137, hi: 150, avg: null });
});

test('weight lookup: in band, in a gap, over the table', () => {
  assert.equal(bandsForWeight(13).bands[0].color, 'Yellow');
  const gap = bandsForWeight(23);
  assert.deepEqual(gap.bands.map(b => b.color), ['Blue', 'Orange']);
  assert.match(gap.note, /between two bands/);
  assert.equal(bandsForWeight(55).bands.length, 0);
  assert.match(bandsForWeight(38).note, /adult protocols apply/);
});

test('length lookup: shared boundary goes to the larger band', () => {
  assert.equal(bandForLength(50).bands[0].color, 'Gray');
  assert.equal(bandForLength(59.5).bands[0].color, 'Pink');
  assert.equal(bandForLength(150).bands[0].color, 'Green');
  assert.match(bandForLength(146).note, /145 cm/);
  assert.equal(bandForLength(151).bands.length, 0);
});

test('probable source typos stay as printed and carry a note', () => {
  const hm = bandByColor('Yellow').drugs.find(d => d.drug === 'Hydromorphone');
  assert.equal(hm.dose, '0.13 - 26 mg');
  assert.ok(hm.note);
  assert.match(citation(bandByColor('Yellow')), /PDF p\. 25[345]/);
});

test('service worker caches the A3 data file', () => {
  const sw = readFileSync(new URL('../app/sw.js', import.meta.url), 'utf8');
  assert.ok(sw.includes('js/data/nh-a3.js'));
});
