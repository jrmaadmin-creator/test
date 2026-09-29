# Heart Conduction Lab

3D conduction system + synced EKG strip. Vanilla JS + three.js, bundled by esbuild into one offline HTML file.

## Commands
- `npm run check`: generated rhythms vs printed criteria. Must pass.
- `npm run build`: writes `dist/heart-conduction-lab.html` (committed; users open it directly).

## Map
- `src/js/rhythms.js`: rhythm content + generators + `expect` ranges. Start here.
- `src/js/engine.js`: beat timeline builders (acts, chambers, comps). One timeline feeds both views.
- `src/js/ecg.js`: waveform shapes (pure functions of time).
- `src/js/heart3d.js`: anatomy coordinates, 3D rendering.
- `src/js/strip.js`: ECG paper, sweep, calipers.
- `src/js/main.js`: UI wiring.

## Rules
- Medical content: plain English, standard EMS/ACLS criteria, no drug doses. If you change a generator, update its `criteria` text and `expect` ranges together.
- No runtime CDN or network calls; everything ships inside the built file.
- Run `npm run check && npm run build` before committing; commit `dist/`.
- Decisions: `docs/adr/`. Docs use Diataxis folders under `docs/`.
