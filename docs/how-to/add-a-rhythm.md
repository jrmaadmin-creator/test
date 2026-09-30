# How to add a rhythm

1. Open `src/js/rhythms.js` and copy the entry closest to the new rhythm.
2. Give it a unique `id` (used in the URL hash) and a `group` from `GROUPS`.
3. Write the content fields in plain English: `summary`, `criteria`, `mechanism`, `watch`, `causes`, `significance`, `tip`.
4. Write `next(b, s)`. It builds one cycle into beat `b` and must advance `s.t` to the next cycle. Use the builders in `src/js/engine.js`:
   - `sinusBeat(b, t, pr, opts)` for a fully conducted sinus beat
   - `sinusAtria`, `avNode`, `ventricles` to assemble a beat piece by piece (blocks: `{ block: { at, kind: 'block' | 'filter' } }`)
   - `ventricularFocus` for PVCs, escapes, VT and paced beats
   - `ectopicAtria`, `junctionalFire` for other origins
5. For continuous activity, add `baseline(t)` returning an `[x, y, z]` vector (see `src/js/ecg.js`), `loop` (reentry circuit), or `ambient: { chaos: 'atria' | 'ventricles' }`. Set `noKick` if the atria do not contract before the ventricles, and `pulseless` for arrest rhythms.
   - New QRS shapes are vectors: give each component a direction in `DIR` or `FOCUS_DIR`, not a per-lead shape. Every lead then follows automatically.
6. Set `expect` to the ranges your criteria text promises (`vRate`, `aRate`, `pr`, `qrs`, `regular`).
7. Add the 12-lead findings to `TWELVE` and a treatment mapping to `TREATMENT_FOR` in `src/js/clinical.js`.
8. Run `npm run check`. Fix the generator or the text until it passes. If the rhythm has a textbook 12-lead pattern, add a check for it in `scripts/check-rhythms.mjs`.
9. Run `npm run build` and open the built file. Watch the rhythm at 0.1× and confirm the 3D view, strip, timeline and 12-lead agree.
10. Add a new 3D structure only if needed: coordinates live in `PATHS`, `LOOPS` and `FOCI` in `src/js/heart3d.js`; list optional ones in `OPTIONAL` and in the rhythm's `show`.
