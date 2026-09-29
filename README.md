# Heart Conduction Lab

An interactive 3D heart that shows the electrical conduction system firing in sync with a live EKG. Built as a study tool for EMT and paramedic students (AHA and NREMT).

Pick a rhythm. Watch the impulse leave the SA node, get held in the AV node, and race down the bundle branches while the strip draws the matching P wave, PR segment, QRS and T wave. Abnormal rhythms show what breaks: a block (red ×), an impulse from the wrong place (violet), chaos, or a heart that fires but does not pump.

## Open it

Double-click `dist/heart-conduction-lab.html`. It is one self-contained file and works offline. Fonts fall back to system fonts without internet.

## Modes

| Mode | What it does |
|------|--------------|
| Learn | 3D heart + live strip. Pathway bar, narration, rhythm facts, 12-lead findings, treatment, anatomy, strip-reading method |
| 12-lead | A 10-second 12-lead with calibration pulses and a lead II rhythm strip; frontal and horizontal axis diagrams with the measured QRS axis; how a 12-lead works. Click a lead to put it on the monitor |
| Compare | Rhythms stacked on the same time scale with timelines: AV blocks, fast and narrow, wide complexes, cardiac arrest, where the beat starts, real vs artifact |
| Quiz | Heart and strip only. Multiple choice or hard mode (all rhythms), strip-only option, misses come back more often. Crew progress table in the shared online version |

## Contents

| Area | Contents |
|------|----------|
| 28 rhythms | Sinus (NSR, brady, tach, arrhythmia), PACs, flutter, A-fib, SVT, junctional, 1st/2nd type I/2nd type II/3rd-degree AV block, PVCs, idioventricular, VT, torsades, VF, asystole, PEA, RBBB, LBBB, WPW, ventricular paced, and 4 monitor artifacts (movement, tremor, 60-cycle, loose lead) |
| 3D heart | Glass chambers that contract, great vessels, full conduction system, rhythm-specific structures (flutter circuit, AVNRT loop, VT scar circuit, accessory pathway, pacing lead). Optional live electrical-vector arrow and lead axis |
| Strip | Any of the 12 leads. Standard paper (25 mm/s, 10 mm/mV), always 6 seconds (two 3-second rows on phones). Wave labels, PR/QRS brackets, calipers, auto-gain |
| Timeline | Ladder diagram (A / AV / V tiers) under the strip: where each impulse starts, how long it takes, where it is blocked |
| Pulse | Arterial pulse per beat from filling time, atrial kick and coordination. Shows pulse deficit, PEA and arrest |
| Treatment | AHA ACLS algorithms, BLS/ALS tagged. NH protocol alignment pending (see ADR 0004) |

Controls: Space plays/pauses, left/right arrows change rhythm, 1–4 answer quiz questions, Enter goes to the next one. Links: `#avb2-1` (learn), `#12lead.rbbb`, `#compare.avblocks`, `#quiz`.

## Develop

Requires Node 18+.

```bash
npm install
npm run check   # rhythm criteria + 12-lead physics checks
npm run build   # write dist/heart-conduction-lab.html
npm run dev     # rebuild on change
```

Docs follow [Diataxis](https://diataxis.fr/):

- Tutorial: [docs/tutorials/study-a-rhythm.md](docs/tutorials/study-a-rhythm.md)
- How-to: [docs/how-to/add-a-rhythm.md](docs/how-to/add-a-rhythm.md)
- Reference: [docs/reference/rhythm-schema.md](docs/reference/rhythm-schema.md)
- Explanation: [docs/explanation/timing-model.md](docs/explanation/timing-model.md)
- Decisions: [docs/adr/](docs/adr/)

## Accuracy

Criteria follow standard EMS and ACLS teaching; conduction speeds follow Guyton and Hall. Waveforms are synthesized, not recorded, so they are idealized. `npm run check` enforces that each rhythm's rate, PR, QRS width and regularity match what the app prints, and that the 12 leads show textbook patterns and axes. Treatment follows the AHA ACLS algorithms and has not yet been checked against the NH Patient Care Protocols v9.3; your protocols and medical control govern care.
