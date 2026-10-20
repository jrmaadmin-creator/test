// POST /api/fax          { pin, to, pdf (base64), subject }  -> { ok, faxId } | { ok: false, error }
// GET  /api/fax?id=<id>  header X-Fax-Pin                    -> { ok, status, error, pages, sent }
// Secrets live in Netlify environment variables (see docs/how-to/set-up-direct-fax.md).
import { readConfig, checkSend, queueFaxParams, statusParams, callSrfax } from '../lib/srfax.mjs';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export default async (req: Request) => {
  const cfg = readConfig((k: string) => Netlify.env.get(k));
  if (cfg.missing.length) return json({ ok: false, error: `Server not set up: missing ${cfg.missing.join(', ')}` }, 503);

  if (req.method === 'POST') {
    let body: unknown;
    try { body = await req.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }
    const checked = checkSend(body, cfg);
    if ('error' in checked) return json({ ok: false, error: checked.error }, checked.status || 400);
    const r = await callSrfax(queueFaxParams(cfg, checked));
    console.log(`fax queue: ${r.Status}`);
    if (r.Status !== 'Success') return json({ ok: false, error: `SRFax: ${r.Result}` }, 502);
    return json({ ok: true, faxId: String(r.Result) });
  }

  if (req.method === 'GET') {
    if (req.headers.get('X-Fax-Pin') !== cfg.pin) return json({ ok: false, error: 'Wrong fax PIN' }, 403);
    const id = new URL(req.url).searchParams.get('id') || '';
    if (!/^\d+$/.test(id)) return json({ ok: false, error: 'Bad fax id' }, 400);
    const r = await callSrfax(statusParams(cfg, id));
    if (r.Status !== 'Success') return json({ ok: false, error: `SRFax: ${r.Result}` }, 502);
    const f = r.Result || {};
    return json({ ok: true, status: f.SentStatus, error: f.ErrorCode || '', pages: f.Pages, sent: f.DateSent || '' });
  }

  return json({ ok: false, error: 'Method not allowed' }, 405);
};

export const config = { path: '/api/fax' };
