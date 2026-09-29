# Reference: rhythm and beat objects

## Rhythm (`src/js/rhythms.js`)

| Field | Type | Meaning |
|-------|------|---------|
| `id` | string | URL hash and storage key |
| `name`, `short` | string | Full and list names |
| `group` | string | One of `GROUPS` |
| `lead` | lead name | Default monitor lead (default II; RBBB/LBBB use V1) |
| `summary`, `mechanism`, `watch`, `significance`, `tip` | string | Panel text |
| `criteria` | `{ rate, rhythm, p, pr, qrs }` | Criteria table |
| `causes` | string[] | Causes list |
| `next(b, s)` | function | Builds one cycle; must advance `s.t` |
| `init(s)` | function | Optional extra state |
| `seed` | number | RNG seed (default 11) |
| `baseline(t)` | function → `[x, y, z]` | Continuous vector (flutter, fibrillation, VF, asystole) |
| `artifact` | `'movement'` \| `'tremor'` \| `'ac60'` \| `'looseLL'` | Monitor artifact added per lead |
| `noNoise` | boolean | Skip baseline noise |
| `noKick` | boolean | No coordinated atrial contraction (lower stroke volume) |
| `pulseless` | boolean | Electrical activity without output (PEA, VF, asystole) |
| `loop` | `{ seg, period, twist? }` | Reentry circuit pulse in 3D and on the timeline |
| `ambient` | `{ chaos, chaosRate }` | Random sparks over atria or ventricles |
| `ambientCaption` | string | Caption when no beat caption applies |
| `show` | string[] | Optional 3D structures to display |
| `expect` | `{ vRate, aRate, pr, qrs, regular }` | Ranges enforced by `npm run check` |

Clinical text lives in `src/js/clinical.js`: `TWELVE[id]` (12-lead findings), `TREATMENT_FOR[id]` → a key in `TREATMENT` (steps are `[level, text, NH protocol number or 'AHA']`), and `TREAT_Q[key]` quiz questions (`{ q, a, x: [3 distractors], cite }`). Scenarios in `src/js/scenarios.js`: `{ id, title, dispatch, patient, vitals, rhythm, steps: [{ q, o: [[text, correct, feedback]], rhythm? }] }`.

## Beat (`src/js/engine.js`)

| Field | Contents |
|-------|----------|
| `acts` | `{ seg, t0, t1, rev, block: { at, kind } \| null, kind: 'normal' \| 'ectopic' }` |
| `chambers` | `{ ch, d0, d1, r0, r1, m }` depolarize d0–d1, repolarize r0–r1; `m` = contraction strength |
| `comps` | `{ t, a, s1, s2, v, qrs? }` asymmetric Gaussian of size `a` (mV) along unit vector `v` |
| `spikes` | pacer spike times |
| `ripples` | `{ at, t0, t1, kind }` expanding wavefront at a focus |
| `labels` | `{ t, text, kind }` strip wave labels |
| `intervals` | `{ kind: 'PR'\|'QRS', t0, t1 }` |
| `captions` | `{ t, text }` narration under the 3D view |
| `p`, `qrs`, `qrsWidth`, `wide` | atrial onsets, QRS onset, width, ventricular-origin flag |
| `mech` | `{ t, sv }` stroke volume (0–1.05); `sv ≥ 0.35` counts as a palpable pulse |

## Leads (`src/js/ecg.js`)

| Lead | Axis | Lead | Axis |
|------|------|------|------|
| I | 0° | V1 | 115° (horizontal) |
| II | +60° | V2 | 94° |
| III | +120° | V3 | 75° |
| aVR | −150° | V4 | 58° |
| aVL | −30° | V5 | 32° |
| aVF | +90° | V6 | 0° |

Frontal angles use ECG convention (+90° = down). Chest angles: 0° = patient's left, 90° = anterior. Chest gain 1.2.

## 3D segment ids

`sa`, `bachmann`, `intAnt`, `intMid`, `intPost`, `av`, `his`, `rbb`, `lbb`, `laf`, `lpf`, `purkR`, `purkL`, `kent`, `pacer`, `flutterLoop`, `avnrtLoop`, `vtLoop`, `twistLoop`

## Strip scale

25 mm/s, 10 mm/mV. 1 small box = 0.04 s, 1 large box = 0.20 s. 6 seconds, split into two 3-second rows under 600 px wide. Auto-gain drops to ×0.75 or ×0.5 only when a rhythm cannot fit, and the lead label says so.

## Links

`#<rhythm-id>` (Learn), `#12lead.<rhythm-id>`, `#compare.<set>` (`avblocks`, `narrow`, `wide`, `arrest`, `origin`, `artifacts`), `#quiz`, `#scenario`.
