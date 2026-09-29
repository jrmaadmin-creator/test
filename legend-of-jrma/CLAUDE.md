# Legend of JRMA

EMS training RPG for JRMA crews. Levels: EMT, AEMT, Paramedic. Each level: a few condition "monsters", one boss call, then a protocol trial that advances the license.

## Layout
- `index.html`: engine (canvas overworld, call and trial panels, sprites, sound).
- `content/`: all medical content. See `content/CLAUDE.md` before editing.
- `content/crew.js`: which JRMA officer plays each role. Text uses `{chief}`, `{partner}`, `{trainer}` tokens, never names.
- `docs/`: Diataxis docs. ADRs in `docs/adr/`.
- `tests/smoke.mjs`: content validation plus a full playthrough in Chromium.

## Commands
- Test: `npm test` (set `SHOTS_DIR=/some/dir` for screenshots)
- One-file build: `npm run bundle` -> `dist/legend-of-jrma.html`
- Play locally: open `index.html` in a browser

## Rules
- Medical facts must match NH Patient Care Protocols v9.3. Cite the section in the item's `nh` field.
- Humor targets situations, myths, and conditions. Never patients, substance use, or mental illness.
- Real officers only with their OK. Real places only for public landmarks and roads; homes and businesses stay fictional.
- No em dashes in player-facing text.
- Run `npm test && npm run bundle` before every commit, and commit `dist/` (people open it directly).
