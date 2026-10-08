# Fleet Telemetry

Driving recorder for a dedicated in-rig iPhone: speed, hard brake/accel/corner events, trip summaries. Vanilla JS. Web stage now; native (Expo) stage later reuses `core/`.

## Commands
- `npm run check`: simulated-drive tests for `core/`. Must pass.
- `npm run build`: writes `dist/` (static site for Netlify).

## Map
- `core/`: pure logic, no browser APIs. Start here.
- `web/`: sensors, wake lock, IndexedDB, screens.
- `scripts/sim.mjs`: simulated drives used by the tests.
- Design: `docs/superpowers/specs/2026-10-08-recorder-design.md`. Decisions: `docs/adr/`.

## Rules
- No PHI. Rig mode never stores latitude, longitude, heading or altitude (ADR 0002). No free-text fields.
- Thresholds come from a cited source or are labeled as a design default. Change `core/thresholds.js` and its version together.
- No network calls after page load. No analytics.
- Never deploy to Netlify without the owner's OK for that deploy.
- Anything written for JRMA command is marked "DRAFT, pending legal review".
- Run `npm run check && npm run build` before committing.
- Docs use Diataxis folders under `docs/`. Update `docs/status.md` at the end of each work session.
