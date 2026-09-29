# Content reference: calls, trials, and NH sources

- **Source:** State of New Hampshire Patient Care Protocols v9.3, effective 2025-11-07 (NH Bureau of EMS).
- **Checked:** 2026-09-29, line by line, against the v9.3 document supplied by the project owner. Three reviews: EMT, AEMT, and Paramedic content.
- **Rule:** every call cites at least one NH section in `nh`. Every trial question has `verified: true` and cites a section, or says "Not in NH PCP" and names the national source. `npm test` enforces both.

## Calls

| Level | Call | Condition (monster) | NH sections | Not in NH PCP (national source) |
|---|---|---|---|---|
| EMT | Chainsaw vs. Leg | Arterial hemorrhage | 4.4, 4.6, 1.0, 8.17 | Elevation and pressure-point myths |
| EMT | Unresponsive in the Restroom | Opioid overdose | 2.17A, 5.1A, 1.0, 8.14 | 10-second pulse check (AHA), OPA sizing |
| EMT | Acting Drunk at the Potluck | Hypoglycemia | 2.11A, 8.14 | none |
| EMT | Bee Beard Gone Wrong | Anaphylaxis | 2.2A, 2.2P, 5.0 | Legs-up positioning, biphasic reactions, stinger removal |
| EMT | Stage for PD | Behavioral crisis, unsecured scene | 2.4, 6.5, 8.14, 8.13 | "Exit behind you" tactics |
| EMT boss | Unresponsive in the Bathroom | Cardiac arrest, BLS | 3.2A, 3.6, 5.1A | Agonal breathing rule (AHA), survival figure |
| AEMT | Double-Dosed Insulin | Severe hypoglycemia | 2.11A, 1.0, 5.1A | IV infiltration, NPA vs. OPA with gag reflex |
| AEMT | Lost in the Hay Maze | Severe asthma | 2.3A, 5.0, 5.4 | Paper-bag myth |
| AEMT boss | Rollover: Fly Him to UMass | Multi-system trauma, hemorrhagic shock | 8.17, 8.0, 4.6, 4.7, 4.5 | LZ size, tail-rotor approach, MIST handoff (air service standards) |
| Paramedic | Chest Pain in the Corner Office | Inferior STEMI with RV involvement | 3.0, 6.0, 2.22 | RV infarct as a nitro caution (ACLS) |
| Paramedic | Fainted at the Scratch Tickets | Symptomatic bradycardia | 3.1A, 6.0, 8.14 | Pacing rate and femoral capture check (ACLS) |
| Paramedic boss | The Throne Returns | VF cardiac arrest | 3.2A, 3.6, 6.1, 6.2, 5.12, 3.4 | Amiodarone doses (NH defers to ACLS) |

## NH-specific facts the game teaches

These are the places where NH differs from what many providers assume, or from older national teaching.

| Topic | NH v9.3 | Section |
|---|---|---|
| Adult arrest ventilation, no advanced airway | 1 breath every 10 compressions, no pause (not 30:2) | 3.2A, 3.6 |
| First crew member into an arrest | Goes in with gloves only and starts compressions | 3.6 |
| Advanced airway in arrest | Consider after 4 cycles (8 minutes), without stopping compressions | 3.2A |
| Epinephrine in adult arrest | 1 mg after the first 2-minute cycle, then every other cycle | 3.2A |
| Refractory VF | Double sequential defib if a second monitor is present; otherwise anterior-posterior pads | 3.2A, 6.2 |
| CPR quality by capnography | ETCO2 at least 20 mmHg | 6.1 |
| Post-ROSC | SpO2 94-98%, SBP over 90 or MAP at least 65, 12-lead at least 8 min after ROSC | 3.4 |
| Oxygen in ACS | Only for SpO2 under 94%, dyspnea, or heart failure | 3.0 |
| Aspirin | 324 mg chewed, unless 324 mg taken in the last 30 minutes | 3.0 |
| Nitroglycerin | SBP must stay over 100; never after a PDE-5 inhibitor; AEMT needs an IV first | 3.0 |
| Hypoglycemic emergency | Glucose under 60 with altered mental status | 2.11A |
| Oral glucose | 15-30 g, only if able to swallow and protect the airway | 2.11A |
| Glucagon | EMT: intranasal or auto-injector. AEMT: 1 mg IM if no IV | 2.11A |
| Dextrose | D10 only, premixed bag preferred, until baseline and glucose over 60 | 2.11A |
| Epinephrine auto-injector | 0.15 mg under 25 kg, 0.3 mg at 25 kg and up; repeat in 5 min | 2.2P |
| Nebulizers and CPAP | Albuterol, DuoNeb, and CPAP are EMT orders | 2.3A |
| Severe asthma not responding | AEMT: epinephrine 0.3 mg IM | 2.3A |
| Tourniquet | On bare skin, 2-3 in above the wound; high and over clothing only on an unsafe scene | 4.4 |
| Hemorrhagic shock fluids | 250 mL boluses to a radial pulse or clear mentation, max 2 L | 4.6 |
| Head injury blood pressure | SBP over 110 | 4.9 |
| Suicidal patient refusing | May not refuse care | 2.4 |
| Restraint position | Lateral, semi-recumbent, or supine; prone only briefly; never hog-tie | 6.5 |
| Pacing sedation | Before or during pacing when feasible (midazolam, lorazepam, diazepam, or ketamine) | 3.1A |

## Hands-on simulations

Every intervention the player performs is a simulation (`sim` in `content/calls.js`). Assessments and decisions stay as choices.

| Call | Simulations |
|---|---|
| Chainsaw vs. Leg | Tourniquet site on the leg; CAT-style windlass (pull, twist, lock) |
| Unresponsive in the Restroom | Sharps into the container; carotid pulse check 5-10 s; head-tilt chin-lift and OPA sizing; BVM breaths 1 s, every 5-6 s; naloxone 1 mg each nostril |
| Acting Drunk at the Potluck | Glucometer (lance the side of the fingertip, strip to the drop); oral glucose between cheek and gum |
| Bee Beard Gone Wrong | Auto-injector: safety off, outer thigh, hold 3 s; non-rebreather at 8 L/min or more, fill the reservoir first |
| Stage for PD | Staging spot out of sight with an exit; wait for "scene secure" on the radio; stand with the door behind you |
| Unresponsive in the Bathroom | Pulse check; drag to the hallway floor; hand position and compressions; AED pads; clear and shock; resume CPR; bag 1 breath every 10 compressions |
| Double-Dosed Insulin | NPA sizing and insertion; glucometer; IV start (band, site, 10-30 degree angle, finish in order); hang D10 |
| Lost in the Hay Maze | Nebulizer setup and oxygen flow; second neb; draw up 0.3 mL of 1 mg/mL epinephrine and inject the outer thigh |
| Rollover: Fly Him to UMass | Landing zone site; IV and a 250 mL bolus; wait for the wave-in and approach from the front; MIST handoff |
| Chest Pain in the Corner Office | Chest leads V1-V6; aspirin 4 x 81 mg; V4R; IV avoiding the right wrist and a 250 mL bolus |
| Fainted at the Scratch Tickets | IV start; atropine 1 mg = 10 mL of 0.1 mg/mL; pacing rate, mA to capture, femoral pulse |
| The Throne Returns | Take over compressions and place pads; charge, clear, shock; resume CPR; tibial IO; shock plus epinephrine 1 mg = 10 mL; shock plus amiodarone 300 mg = 6 mL of 50 mg/mL; supraglottic airway, capnography, and bagging; pulse check at the ETCO2 jump |

### Technique details not in NH PCP

| Detail | Source |
|---|---|
| CAT tourniquet steps (pull strap, twist until bleeding stops, lock in clip; usually 3 half turns or fewer) | Manufacturer training (North American Rescue) |
| Pulse check at least 5 and no more than 10 seconds | AHA BLS |
| OPA sized from the corner of the mouth to the earlobe or jaw angle; NPA from the tip of the nose to the earlobe | National EMT curriculum |
| BVM breath over about 1 second, just to chest rise | AHA |
| Lance the side of the fingertip | Glucometer manufacturer instructions and national EMT curriculum |
| Auto-injector: blue safety release off, outer thigh, hold 3 seconds | EpiPen manufacturer instructions (other devices differ) |
| Fill the non-rebreather reservoir before applying | National EMT curriculum |
| Nebulizer oxygen flow 6-8 L/min | Typical manufacturer range; check the device |
| IV angle 10-30 degrees; release the tourniquet before flushing | National AEMT curriculum |
| Chest lead positions V1-V6 and V4R | AHA/ACC/HRS electrocardiography standard |
| Pacing: raise mA to capture, confirm with a femoral pulse | ACLS |
| IO needle: through skin to bone, drill to the pop, remove the stylet, flush | EZ-IO manufacturer training |
| Helicopter approach only when waved in, from the front | Air service standards |
| Staging out of sight with an exit route; door behind you inside | EMS scene-safety practice |

## Trial question banks

| Trial | Grants | Questions in bank | Drawn per attempt | Misses allowed | NH-silent questions |
|---|---|---|---|---|---|
| EMT Trial | AEMT license | 19 | 8 | 2 | Pulse unclear after 10 s (AHA); OPA sizing |
| AEMT Trial | Paramedic license | 15 | 8 | 2 | IV infiltration |
| Paramedic Trial | Legend of JRMA title | 19 | 10 | 2 | Pacing capture check (ACLS) |

## Known gaps to close

1. The first page of adult Anaphylaxis (2.2A) did not come through in the text extraction (it is probably an image). Adult epinephrine figures come from 2.2P and the Appendix 2 formulary. Confirm against the printed protocol.
2. Part of the Trauma Triage (8.17) criteria graphic did not extract. The "Trauma triage red flags" pearl uses only the readable items.
3. Landing zone size and aircraft approach are air service standards, not NH PCP. Ask the air service JRMA uses for its LZ specification and update the rollover call to match.
4. The document's table of contents header reads "Version 9.2" while the cover reads 9.3. The game cites 9.3.
