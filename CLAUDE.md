# Heart Conduction Lab

3D conduction system + synced EKG, 12-lead, timeline, quiz. Vanilla JS + three.js, bundled by esbuild into one offline HTML file.

## Commands
- `npm run check`: rhythm criteria + 12-lead physics/pattern checks. Must pass.
- `npm run build`: writes `dist/heart-conduction-lab.html` (committed; users open it directly).

## Map
- `src/js/rhythms.js`: rhythm content, generators, `expect` ranges. Start here.
- `src/js/clinical.js`: 12-lead findings, NH v9.3 treatment, treatment quiz questions (ADR 0004).
- `src/js/scenarios.js`: scenario cases; each answer cites an NH protocol.
- `src/js/engine.js`: beat builders (acts, chambers, comps) + mechanics (pulse per beat).
- `src/js/ecg.js`: vector model, lead axes, shapes, artifacts. All leads come from here.
- `src/js/heart3d.js`: anatomy coordinates, 3D rendering, contraction, vector arrow.
- `src/js/strip.js`: paper, sweep, ladder timeline, pulse band, calipers.
- `src/js/twelve.js`, `compare.js`, `quiz.js`, `crew.js`: modes. `main.js`: wiring.

## Rules
- Medical content: plain English, AHA/NREMT criteria. Change a generator's `criteria` text and `expect` ranges together.
- Never add NH protocol doses from memory; copy from the protocol text and cite the protocol number (ADR 0004).
- No runtime CDN or network calls; everything ships inside the built file. `crew.js` uses `window.claude` only when present.
- Run `npm run check && npm run build` before committing; commit `dist/`.
- Decisions: `docs/adr/`. Docs use Diataxis folders under `docs/`.
- Status, owner decisions and open items: `docs/status.md`. Update it at the end of each work session.
