// SRFax API helpers for the fax function. Pure logic + one fetch wrapper; no logging of report content.
// API reference (2026-10-05): https://www.srfax.com/developers/internet-fax-api/queue_fax/
//                             https://www.srfax.com/developers/internet-fax-api/get_faxstatus/
export const SRFAX_URL = 'https://secure.srfax.com/SRF_SecWebSvc.php';
export const MAX_PDF_BYTES = 500 * 1024;

export function digits10(input) {
  let d = String(input || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  return d.length === 10 ? d : null;
}

export function readConfig(env) {
  const need = ['SRFAX_ACCESS_ID', 'SRFAX_ACCESS_PWD', 'SRFAX_CALLER_ID', 'SRFAX_SENDER_EMAIL', 'FAX_PIN', 'FAX_ALLOWED_NUMBERS'];
  const missing = need.filter(k => !env(k));
  return {
    missing,
    accessId: env('SRFAX_ACCESS_ID'),
    accessPwd: env('SRFAX_ACCESS_PWD'),
    callerId: digits10(env('SRFAX_CALLER_ID')),
    senderEmail: env('SRFAX_SENDER_EMAIL'),
    pin: env('FAX_PIN'),
    allowed: String(env('FAX_ALLOWED_NUMBERS') || '').split(',').map(digits10).filter(Boolean),
    // Until a HIPAA-covered host is in place, only reports stamped TEST may be sent.
    requireTest: env('FAX_REQUIRE_TEST') !== 'false',
  };
}

// Validate an incoming send request. Returns { error } or { to, pdf, subject }.
export function checkSend(body, cfg) {
  if (!body || typeof body !== 'object') return { error: 'Bad request' };
  if (!cfg.pin || body.pin !== cfg.pin) return { error: 'Wrong fax PIN', status: 403 };
  const to = digits10(body.to);
  if (!to) return { error: 'Fax number must be 10 digits' };
  if (!cfg.allowed.includes(to)) return { error: `Fax number ${to} is not on the approved list`, status: 403 };
  const pdf = String(body.pdf || '');
  if (!/^[A-Za-z0-9+/]+=*$/.test(pdf)) return { error: 'PDF missing or not base64' };
  if (pdf.length * 0.75 > MAX_PDF_BYTES) return { error: 'PDF too large' };
  if (!Buffer.from(pdf, 'base64').subarray(0, 5).toString('latin1').startsWith('%PDF-')) return { error: 'Not a PDF' };
  const subject = String(body.subject || '').replace(/[\r\n]/g, ' ').slice(0, 120);
  if (cfg.requireTest && !subject.startsWith('TEST')) return { error: 'Test mode only: turn on Test mode in Settings', status: 403 };
  return { to, pdf, subject };
}

export function queueFaxParams(cfg, { to, pdf, subject }) {
  return new URLSearchParams({
    action: 'Queue_Fax',
    access_id: cfg.accessId,
    access_pwd: cfg.accessPwd,
    sCallerID: cfg.callerId,
    sSenderEmail: cfg.senderEmail,
    sFaxType: 'SINGLE',
    sToFaxNumber: `1${to}`,
    sRetries: '3',
    sAccountCode: 'JRMA-APP',
    sCPSubject: subject,
    sFileName_1: 'prearrival.pdf',
    sFileContent_1: pdf,
  });
}

export function statusParams(cfg, faxId) {
  return new URLSearchParams({
    action: 'Get_FaxStatus',
    access_id: cfg.accessId,
    access_pwd: cfg.accessPwd,
    sFaxDetailsID: String(faxId),
  });
}

export async function callSrfax(params, fetchImpl = fetch) {
  const res = await fetchImpl(SRFAX_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { Status: 'Failed', Result: `Unexpected SRFax response (HTTP ${res.status})` }; }
}
