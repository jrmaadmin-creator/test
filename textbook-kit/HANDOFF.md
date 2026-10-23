# Handoff: put the Heart Conduction Lab inline in a digital textbook

For: Codex (or any coding agent). From: the Heart Conduction Lab project, 2026-10-20.
Goal: place the lab in the owner's digital textbook, as inline figures beside the relevant text and as the complete app. You decide how to embed it for the textbook's platform.

## What the app is

An interactive EKG study tool for paramedic students (AHA/NREMT), with treatment from the New Hampshire Patient Care Protocols v9.3.

- A 3D heart shows the conduction system firing in sync with a live rhythm strip.
- 29 rhythms, any of 12 leads, 12-lead view, ladder-diagram timeline, pulse/PEA band.
- Compare sets, quiz, 9 graded scenarios (7 adult, 2 pediatric).
- Vanilla JS + three.js 0.170.0, bundled by esbuild into one self-contained HTML file (about 720 KB). It needs no server and makes no network calls, except an optional Google Fonts stylesheet that falls back to system fonts.

## Files in this kit

| Path | What it is |
|------|------------|
| `heart-conduction-lab.html` | The complete app, built. Open it directly, link to it, or iframe it. This is the only file a reader needs |
| `HANDOFF.md` | This file |
| `example.html` | Working demo page: one iframe of each embed view plus the full app. Serve the folder over http to view it |
| `embed-resize.js` | 20-line host-side script that sizes embed iframes to their content (see below) |
| `app-source/` | Full source: `src/`, `scripts/`, `package.json`, lockfile, docs, ADRs. Rebuild with `npm ci && npm run build` (Node 18+); output goes to `dist/heart-conduction-lab.html` |
| `THIRD_PARTY_LICENSES.txt` | three.js MIT license (bundled inside the HTML) |

## What already exists for embedding (optional to use)

The built file supports a query-string embed mode, added and tested in Chromium on 2026-10-20.

**What it does:**
- No params gives the normal full app.
- `?embed=<view>` shows a single figure, stacked vertically and sized by its own content.
- Figures keep no preferences, never change the URL, and stop animating when scrolled out of view.
- Each figure posts `{type: 'hcl:resize', id, height}` to its parent window. `embed-resize.js` applies that height to iframes marked `data-hcl`.

**Views:**

| View | Shows | Main params |
|------|-------|-------------|
| `embed=heart` | 3D heart, conduction pathway bar, live strip, readouts | `rhythm`, `lead` |
| `embed=strip` | Strip only (no WebGL; cheap, use many per page) | `rhythm`, `lead` |
| `embed=twelve` | 10-second 12-lead printout | `rhythm` |
| `embed=compare` | Several rhythms stacked with timelines | `set`, `note=0` |
| `embed=quiz` | Heart + strip quiz; NH treatment question after each | `rhythms=id,id,...` (limits what is asked), `treat=0` |
| `embed=scenario` | Graded case with live monitor and vitals | `case`, `timed=1` |
| `embed=full` | The whole app inline; `#links` and saved preferences work | `height` (wide screens, default 860), plus a hash such as `#12lead.rbbb` |

**Shared params:**
- `controls=0` gives a bare figure.
- `autoplay=0` starts paused, which gives a deterministic frame for print screenshots.
- `speed=0.1|0.25|0.5|1`.
- `theme=light|dark`.
- Toggles, each `0` or `1`: `labels`, `vector`, `waves`, `intervals`, `ladder`, `pulse`.
- `id` (echoed in resize messages).

**Example:** `heart-conduction-lab.html?embed=strip&rhythm=avb2-1&intervals=1`

**Tested:**
- Every view at 1000px and 390px widths, light and dark.
- No console errors and no horizontal overflow.
- Iframe height matched content, and the quiz `rhythms=` limit worked.
- Scenario `case=` started the case, and an offscreen figure's clock stopped.

**Not fully verified:** one run at 390px showed an on-screen figure animating slowly while several WebGL iframes were loaded. That was probably test-machine (software GL) load, but it was not re-checked.

**Limits to plan around:**
- Each `heart`, `quiz`, `scenario` and `full` embed uses its own WebGL context. Browsers cap these at about 16 per page, so keep 3D embeds to about 4 per page and use `strip` or `twelve` elsewhere.
- Use `loading="lazy"` on iframes.
- Give every iframe a descriptive `title` for screen readers.
- `sandbox="allow-scripts"` works, but quiz and scenario progress will not persist under it.

## IDs

**Rhythms** (`rhythm=`; default lead is II unless noted):

| Group | IDs |
|-------|-----|
| Sinus | `nsr`, `sinus-brady`, `sinus-tach`, `sinus-arrhythmia` |
| Atrial & supraventricular | `pac`, `aflutter`, `afib`, `svt` |
| Junctional | `junctional` |
| AV blocks | `avb1`, `avb2-1` (Wenckebach), `avb2-2` (Mobitz II), `avb3` |
| Ventricular | `pvc`, `ivr`, `vt`, `torsades` |
| Cardiac arrest | `vf`, `asystole`, `pea`, `pea-wide` |
| Bundle branch & pre-excitation | `rbbb` (V1), `lbbb` (V1), `wpw` |
| Paced | `paced` |
| Monitor artifacts | `art-movement`, `art-tremor`, `art-60`, `art-loose` |

**Leads** (`lead=`, any case): `I`, `II`, `III`, `aVR`, `aVL`, `aVF`, `V1`–`V6`.

**Compare sets** (`set=`):

| ID | Rhythms |
|----|---------|
| `avblocks` | nsr, avb1, avb2-1, avb2-2, avb3 |
| `narrow` | sinus-tach, svt, aflutter, afib |
| `wide` | pvc, ivr, vt, paced, lbbb, wpw |
| `arrest` | vf, pea, asystole, torsades |
| `origin` | nsr, pac, junctional, pvc |
| `artifacts` | vf, art-movement, afib, art-tremor, asystole, art-loose |

**Scenarios** (`case=`):

| ID | Title in app | Topic | Patient |
|----|--------------|-------|---------|
| `brady-inferior` | Dizzy after chores | Complete heart block | Adult |
| `svt-gym` | Palpitations at the gym | SVT | Adult |
| `vf-rink` | Collapse at the rink | VF arrest to ROSC | Adult |
| `pea-bleed` | The bleeding ulcer | Narrow PEA | Adult |
| `pea-dialysis` | Missed dialysis | Wide PEA / hyperkalemia | Adult |
| `vt-stable` | Wide and fast, still talking | Stable to unstable VT | Adult |
| `torsades-methadone` | Fainting spells | Torsades | Adult |
| `peds-brady-infant` | Floppy infant with RSV | Hypoxic infant bradycardia | Pediatric |
| `peds-vf-baseball` | Line drive to the chest | Commotio cordis VF | Pediatric |

## Suggested placements

Match these to the textbook's actual headings; the owner has not supplied the chapter list.

| Textbook topic | Embed |
|----------------|-------|
| Conduction system, normal beat | `heart&rhythm=nsr` |
| Reading a strip / intervals | `strip&rhythm=nsr&intervals=1` |
| Sinus rhythms | `strip` for each sinus ID |
| Atrial rhythms, SVT | `heart&rhythm=svt`; `compare&set=narrow` |
| AV blocks | `compare&set=avblocks`; `strip&rhythm=avb2-1&intervals=1`; quiz `rhythms=avb1,avb2-1,avb2-2,avb3` |
| Ventricular rhythms | `heart&rhythm=vt`; `compare&set=wide` |
| Cardiac arrest, PEA | `compare&set=arrest`; `heart&rhythm=pea` (pulse band shows no pulse) |
| 12-lead basics, axis | `twelve&rhythm=nsr`, `twelve&rhythm=rbbb`, `twelve&rhythm=lbbb` |
| Artifact vs real rhythm | `compare&set=artifacts` |
| Chapter review | `quiz` limited to that chapter's IDs |
| Case studies | `scenario&case=<id>` |
| Appendix or "Lab" page | Full app: link to the standalone file, or `embed=full` |

## Rules that must survive integration

1. **Medical content:** do not edit doses, energies or treatment steps. They are copied from NH Patient Care Protocols v9.3, and each one cites its protocol number (ADR 0004 in `app-source/docs/adr/`). Never add or change a dose from memory. If a change is needed, flag it to the owner, who has the protocol text.
2. **No runtime network dependencies.** Keep the app a single offline file. If the textbook has a strict CSP, or is EPUB (epubcheck flags remote resources), it is safe to delete the three Google Fonts `<link>` tags in the `<head>`.
3. **Run checks after any source change:** `npm run check` (rhythm criteria, 12-lead physics, treatment citations) must pass before rebuilding.
4. **Plain-English teaching text** and AHA/NREMT terminology.

## Unknowns to resolve in the textbook repo

- **Platform:** web book (Quarto, mdBook, Docusaurus, Jupyter Book), LMS page, Pressbooks, or EPUB3. EPUB readers often disable scripts (Kindle does; Apple Books allows them), so give every embed a static fallback: a screenshot taken with `autoplay=0`, plus a link to the full app.
- Where static assets live, and whether iframes are allowed.
- Which chapters and headings exist. Use the placement table above as the starting map.

## Done looks like

- [ ] App file copied into the textbook's static assets, unmodified (or rebuilt from `app-source/`).
- [ ] Inline figures at the matching sections, each with a title, lazy loading and a fallback.
- [ ] Full app reachable (link and/or `embed=full`).
- [ ] Pages checked at phone and desktop widths with no horizontal scroll, no console errors, and no more than about 4 3D embeds per page.
- [ ] No treatment text changed.
