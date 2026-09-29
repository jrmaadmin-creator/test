# Reference: rhythm and beat objects

## Rhythm (`src/js/rhythms.js`)

| Field | Type | Meaning |
|-------|------|---------|
| `id` | string | URL hash and storage key |
| `name`, `short` | string | Full and list names |
| `group` | string | One of `GROUPS` |
| `lead` | `'II'` \| `'V1'` | Lead drawn on the strip (default II) |
| `summary`, `mechanism`, `watch`, `significance`, `tip` | string | Panel text |
| `criteria` | `{ rate, rhythm, p, pr, qrs }` | Criteria table |
| `causes` | string[] | Causes list |
| `next(b, s)` | function | Builds one cycle; must advance `s.t` |
| `init(s)` | function | Optional extra state |
| `seed` | number | RNG seed (default 11) |
| `baseline(t)` | function | Continuous signal in mV (flutter, fibrillation) |
| `noNoise` | boolean | Skip baseline noise |
| `loop` | `{ seg, period, twist? }` | Reentry circuit pulse in 3D |
| `ambient` | `{ chaos, chaosRate }` | Random sparks over atria or ventricles |
| `ambientCaption` | string | Caption when no beat caption applies |
| `show` | string[] | Optional 3D structures to display |
| `expect` | `{ vRate, aRate, pr, qrs, regular }` | Ranges enforced by `npm run check` |

## Beat (`src/js/engine.js`)

| Field | Contents |
|-------|----------|
| `acts` | `{ seg, t0, t1, rev, block: { at, kind } \| null, kind: 'normal' \| 'ectopic' }` |
| `chambers` | `{ ch: 'RA'\|'LA'\|'RV'\|'LV', d0, d1, r0, r1 }` depolarize d0 to d1, repolarize r0 to r1 |
| `comps` | `{ t, a, s1, s2 }` asymmetric Gaussian wave components (s, mV) |
| `spikes` | pacer spike times |
| `ripples` | `{ at, t0, t1, kind }` expanding wavefront at a focus |
| `labels` | `{ t, text, kind }` strip wave labels |
| `intervals` | `{ kind: 'PR'\|'QRS', t0, t1 }` |
| `captions` | `{ t, text }` narration under the 3D view |
| `p`, `qrs` | atrial onset times, QRS onset time (for rate readouts and checks) |

## 3D segment ids

`sa`, `bachmann`, `intAnt`, `intMid`, `intPost`, `av`, `his`, `rbb`, `lbb`, `laf`, `lpf`, `purkR`, `purkL`, `kent`, `pacer`, `flutterLoop`, `avnrtLoop`, `vtLoop`, `twistLoop`

## Strip scale

25 mm/s, 10 mm/mV. 1 small box = 0.04 s, 1 large box = 0.20 s. 6-second view (3-second under 560 px wide).
