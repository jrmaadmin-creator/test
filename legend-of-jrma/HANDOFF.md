# Handoff: Legend of JRMA

Read this first when picking the project back up in a new session. It holds the current state, the decisions and their reasons, and what is still open.

- **Last updated:** 2026-09-29
- **Branch:** `claude/gallant-hamilton-qtdj8v` (repo `jrmaadmin-creator/test`, folder `legend-of-jrma/`)
- **Pull request:** https://github.com/jrmaadmin-creator/test/pull/2 (draft, base `main`)
- **Shared link (private claude.ai artifact):** https://claude.ai/artifact/U5yupqvm5dxLVMcgfGudsp. Share it from the page's Share menu.

## Resume in a new session

```bash
cd legend-of-jrma
npm install
npm test                      # content checks + full playthrough in Chromium
npm run bundle                # rebuilds dist/legend-of-jrma.html (commit it)
npm run bundle -- --artifact /tmp/legend-of-jrma.html   # page for the shared link
```

To update the shared link from a new session, publish the `--artifact` file with the Artifact tool and pass `url: https://claude.ai/artifact/U5yupqvm5dxLVMcgfGudsp`. Read the artifact first. A new URL means the old link stops getting updates.

## What exists

- **Game:** Zelda-style overworld of Jaffrey (8 areas). Calls are turn-based battles where the condition is the monster.
- **Levels:** 3 levels (EMT, AEMT, Paramedic). Each has a few monster calls, a boss call, then a Protocol Trial that advances the license (EMT → AEMT → Paramedic → "Legend of JRMA" title).
- **Hands-on simulations:** 46 of them, one on every step where the player performs a skill (see "Simulations" below). Assessments and decisions stay as choices.
- **Content:** 12 calls and 53 trial questions, all checked against NH PCP v9.3. See `docs/reference/call-content.md`.
- **Characters:**
  - Chief Adam (gloves, station advice)
  - Capt. Joshua, Training Officer (runs the trials)
  - The partner/FTO is still the fictional "Sully"
  - All three are set in `content/crew.js`

## Decisions and why

| Decision | Why |
|---|---|
| Game lives in `legend-of-jrma/`, not the repo root | `main` already holds the Heart Conduction Lab at the root |
| Medical content in `content/*.js`, engine in `index.html` | Reviewers can fix a dose without touching code (ADR-0001) |
| NH PCP v9.3 is the source of truth; every item cites a section | The user supplied the protocol file. Three line-by-line reviews found and fixed about 70 differences from national teaching. |
| Each level: monsters, then boss, then Protocol Trial | The user asked for a few monsters per level, based on scope, and one boss that advances the license |
| The trial tests the level just finished | Mastery check before moving up; retrieval practice on what was just played |
| No Lieutenant content | The user wants the game for anyone at JRMA |
| Real places for landmarks and roads only; homes and businesses fictional | Keeps real households and businesses off overdose, psych, and death calls |
| Officers are set in `crew.js`; text uses `{chief}` `{partner}` `{trainer}` | Names can change without editing any call text |
| Training Officer runs the trials instead of a medical director | The user wanted officers only |
| Public officer listings were not used | They are out of date after the 2026 leadership change; names come from the user |
| Every performed intervention is a staged simulation written as data (ADR-0002) | The user asked for real-world simulations like the tourniquet for every intervention; shared stage types keep it reviewable |
| Shared link is a private claude.ai artifact | The user asked for a weblink for officers; it carries JRMA's name, so it stays private until the user shares it |

## Open items

1. **Play-test the simulations with a crew member** on a phone and a station computer. Timing windows (BVM rhythm, bag every 10th compression, pulse check) are set from standards but not yet tried by real users.
2. **Partner/FTO:** needs an officer's name, or keep Sully.
3. **Officer appearance** (hair, skin, beard, glasses) for Chief Adam and Capt. Joshua. Consent from both is not yet confirmed in writing.
4. **Adult anaphylaxis (2.2A)** first page did not extract from the docx. Confirm the adult epi figures against the printed protocol.
5. **Landing zone spec** from the air service JRMA uses.
6. **Ideas raised, not requested:** a Rindge area (Cathedral of the Pines, Route 119); a capacity-intact refusal call; officers each signing off on one level; completion tracking for CE (needs a backend).

## NH protocol source

- **File:** State of New Hampshire Patient Care Protocols v9.3, effective 2025-11-07. The user uploaded it as a .docx. It is not stored in the repo.
- **Official page:** https://www.fstems.dos.nh.gov/ems-systems/patient-care-protocols
- **Access from a cloud session:** fstems.dos.nh.gov, nhfa-ems.com and mm.nh.gov are blocked by this environment's network policy. Ask the user to re-upload the file, or to allow those hosts in the environment settings.

## Simulations

Status: done 2026-09-29. Every intervention the player performs is a hands-on simulation; assessments and decisions stay as choices.

- **Engine:** `index.html`, section "Hands-on simulations". Ten stage types: place, hold, dial, order, signal, shock, bagcpr, pace, rhythm, windlass.
- **Content:** each step's `sim` field in `content/calls.js`. Shared builders (`simKit`) at the top of that file cover pulse checks, glucometer, IV start, boluses, pads, thigh injections, and drug draw-up.
- **Art and spots:** `content/scenes.js` (face, hand, legs, chest, arm, floor, bathroom, LZ map, helicopter, staging map, apartment, nebulizer, auto-injector).
- **Rules:** a wrong spot or mistimed press is a fumble (feedback only); `sev` on a spot costs hearts (shocking with hands on, walking behind the tail rotor, parking in view on a weapon call). Three fumbles end the attempt. After two on one stage, the partner highlights the spot.
- **How to add one:** `docs/how-to/add-a-call.md`, "Add a hands-on simulation". Why this design: `docs/adr/0002-hands-on-simulations-as-staged-data.md`.
- **Sources outside NH PCP** (CAT steps, EpiPen hold time, nebulizer flow, lead placement): `docs/reference/call-content.md`, "Technique details not in NH PCP".
- **Tests:** `npm test` validates every stage and plays all 46 simulations. The overdose sharps drag, the anaphylaxis safety-cap tap, and the first arrest pulse check use real mouse input; the bleed replay uses Tab and Space; the windlass runs by mouse and by keys. Probes check that a wrong spot costs no hearts and that shocking without "clear" costs one.
- **Size watch:** `index.html` is about 2,700 lines. ADR-0001 says to revisit the single-file engine at about 3,000.
