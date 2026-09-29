# Heart Conduction Lab

An interactive 3D heart that shows the electrical conduction system firing in sync with a live EKG rhythm strip. Built as a study tool for EMT and paramedic students.

Pick a rhythm. Watch the impulse leave the SA node, get held in the AV node, and race down the bundle branches while the strip draws the matching P wave, PR segment, QRS and T wave. Abnormal rhythms show what breaks: a block (red ×), an impulse from the wrong place (violet), or chaos.

## Open it

Double-click `dist/heart-conduction-lab.html`. It is one self-contained file and works offline. Fonts fall back to system fonts without internet.

## What is in it

| Area | Contents |
|------|----------|
| 23 rhythms | Sinus (NSR, brady, tach, arrhythmia), PACs, flutter, A-fib, SVT, junctional, 1st/2nd type I/2nd type II/3rd-degree AV block, PVCs, idioventricular, VT, torsades, VF, asystole, RBBB, LBBB, WPW, ventricular paced |
| 3D heart | Glass chambers and great vessels, SA node, internodal pathways, Bachmann's bundle, AV node, His bundle, bundle branches, fascicles, Purkinje fibers, plus rhythm-specific structures (flutter circuit, AVNRT loop, VT scar circuit, accessory pathway, pacing lead) |
| Rhythm strip | Standard paper: 25 mm/s, 10 mm/mV, 6-second view with 3-second tick marks. Wave labels, PR/QRS interval brackets, pause-and-drag calipers |
| Per rhythm | Criteria (rate, rhythm, P, PR, QRS), mechanism, what to watch in 3D, causes, clinical significance, recognition tip |
| Reference tabs | Conduction pathway with intrinsic rates and conduction speeds; five-step strip reading method |

Controls: Space plays/pauses, left/right arrows change rhythm, `#rhythm-id` in the URL deep-links (for example `#avb2-1`).

## Develop

Requires Node 18+.

```bash
npm install
npm run check   # verify every generated strip matches its printed criteria
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

Criteria follow standard EMS and ACLS teaching; conduction speeds follow Guyton and Hall. Waveforms are synthesized, not recorded, so they are idealized. `npm run check` enforces that each generated rhythm's rate, PR, QRS width and regularity fall inside the ranges the app prints. This is a learning tool, not a clinical reference: follow your agency's protocols.
