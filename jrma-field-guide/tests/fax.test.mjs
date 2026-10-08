import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readConfig, checkSend, queueFaxParams, statusParams, callSrfax, digits10 } from '../netlify/lib/srfax.mjs';
import { buildPdf } from '../app/js/pdf.js';

const ENV = {
  SRFAX_ACCESS_ID: '12345', SRFAX_ACCESS_PWD: 'secret', SRFAX_CALLER_ID: '(603) 386-6611',
  SRFAX_SENDER_EMAIL: 'crew@example.org', FAX_PIN: '2468', FAX_ALLOWED_NUMBERS: '603-532-2405, 6035551234',
};
const cfg = readConfig(k => ENV[k]);
const pdf = Buffer.from(buildPdf([{ text: 'TEST' }])).toString('base64');
const good = { pin: '2468', to: '603-532-2405', pdf, subject: 'TEST - JRMA pre-arrival' };

test('config reads env and reports missing keys', () => {
  assert.deepEqual(cfg.missing, []);
  assert.equal(cfg.callerId, '6033866611');
  assert.deepEqual(cfg.allowed, ['6035322405', '6035551234']);
  assert.equal(cfg.requireTest, true);
  assert.deepEqual(readConfig(() => '').missing.length, 6);
  assert.equal(digits10('1-603-532-2405'), '6035322405');
});

test('send is refused without the PIN, to unapproved numbers, or without TEST while test-only', () => {
  assert.equal(checkSend({ ...good, pin: 'x' }, cfg).status, 403);
  assert.match(checkSend({ ...good, to: '603-555-0000' }, cfg).error, /not on the approved list/);
  assert.match(checkSend({ ...good, subject: 'JRMA pre-arrival' }, cfg).error, /Test mode only/);
  assert.match(checkSend({ ...good, pdf: Buffer.from('hello').toString('base64') }, cfg).error, /Not a PDF/);
  assert.match(checkSend({ ...good, pdf: 'not base64!' }, cfg).error, /base64/);
  assert.deepEqual(Object.keys(checkSend(good, cfg)), ['to', 'pdf', 'subject']);
  assert.ok(!('error' in checkSend({ ...good, subject: 'Live' }, { ...cfg, requireTest: false })));
});

test('Queue_Fax parameters follow the SRFax API', () => {
  const p = queueFaxParams(cfg, checkSend(good, cfg));
  assert.equal(p.get('action'), 'Queue_Fax');
  assert.equal(p.get('sCallerID'), '6033866611');
  assert.equal(p.get('sToFaxNumber'), '16035322405');
  assert.equal(p.get('sFaxType'), 'SINGLE');
  assert.equal(p.get('sFileName_1'), 'prearrival.pdf');
  assert.equal(p.get('sFileContent_1'), pdf);
  assert.equal(p.get('sCoverPage'), null); // no cover page: the PDF is the whole fax
  assert.equal(statusParams(cfg, 99).get('sFaxDetailsID'), '99');
});

test('SRFax responses are parsed; non-JSON becomes a failure', async () => {
  const ok = await callSrfax(new URLSearchParams(), async (url, init) => {
    assert.equal(url, 'https://secure.srfax.com/SRF_SecWebSvc.php');
    assert.equal(init.method, 'POST');
    return new Response('{"Status":"Success","Result":"555"}');
  });
  assert.deepEqual(ok, { Status: 'Success', Result: '555' });
  const bad = await callSrfax(new URLSearchParams(), async () => new Response('<html>', { status: 500 }));
  assert.equal(bad.Status, 'Failed');
});
