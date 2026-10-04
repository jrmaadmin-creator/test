# ADR-0002: Hands-on interventions as staged simulations described in content

- Status: Accepted
- Date: 2026-09-29
- Deciders: project owner (JRMA EMT), Claude Code

## Context

The project owner asked that every intervention a player performs work like the real skill, the way the tourniquet does (pull the strap, twist the rod, lock the clip), instead of one click. The game has 12 calls with about 45 hands-on steps: pulse checks, airway adjuncts, BVM, naloxone, glucometer, injections, IV and IO access, 12-lead placement, drug math, defibrillation, pacing, and scene tasks such as staging and the helicopter approach. Writing a custom mini-game for each would add thousands of lines to `index.html` and put medical details back into engine code, against ADR-0001.

## Decision

1. A call step can carry a `sim` field in `content/calls.js`: a title plus a list of `stages` that run in order. The step counts only when every stage is done.
2. The engine in `index.html` provides a small set of stage types. Each type is a real motion or judgment, not a quiz:

   | Type | Player does | Used for |
   |---|---|---|
   | `place` | Drags an item onto the right spot (or taps the spot) | Landmarks: pulse points, pads, leads, injection and IV sites, sharps, staging, LZ, approach path |
   | `hold` | Presses and holds, lets go inside a time window; can repeat on a rhythm | Pulse check 5-10 s, auto-injector hold, BVM breaths |
   | `dial` | Sets a number and confirms | Oxygen flow, drug volume, bolus size, needle angle, pacing rate |
   | `order` | Taps actions in sequence | Multi-step procedures, MIST report |
   | `signal` | Waits for a cue, then acts | PD "scene secure", flight crew wave-in |
   | `shock` | Charge, call clear, look, shock | AED and manual defibrillation |
   | `bagcpr` | Squeezes the bag on every 10th compression | NH arrest ventilation |
   | `pace` | Raises mA until the strip shows capture | Transcutaneous pacing |
   | `rhythm` | Taps compressions at 100-120/min | CPR |
   | `windlass` | Pulls, twists, and locks a CAT-style tourniquet | Hemorrhage control |

3. Scene art and hotspot coordinates live in `content/scenes.js`. Each hotspot has a default "why" message for wrong drops; a stage can override it.
4. Mistakes inside a simulation are "fumbles": feedback on the spot, no heart lost, three fumbles end the attempt. A stage can mark a wrong spot as harmful (`sev`), which costs hearts like a wrong choice (for example, shocking with hands on the chest, walking behind the tail rotor).
5. After two fumbles on one stage, the partner highlights the right spot, so a stuck player learns instead of guessing.
6. Assessments and decisions (reading a rhythm, choosing transport) stay as multiple choice.

## Options considered

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Staged simulations from shared stage types (chosen) | One engine, ~45 skills written as data; reviewers edit sites, doses, and timings in content files | Less custom feel than a bespoke game per skill | Best fit: consistent controls, easy to review |
| A bespoke mini-game per skill | Most realistic per skill | Thousands of lines; medical details buried in code | Rejected |
| Video or photo-based skill checks | Real images | Licensing, file size, no feedback on motion | Rejected |

## Consequences

- Good: adding a skill to a call is mostly writing data. `npm test` checks every stage and plays every simulation.
- Good: every simulation works with mouse, touch, and keyboard (Tab to a spot, Space to act; number keys for buttons).
- Bad: a screen cannot train depth, force, or feel. The simulations train landmarks, sequence, timing, and math. Pair them with manikins and skills labs.
- Bad: `index.html` is about 2,700 lines, near the ADR-0001 revisit trigger of 3,000.
- Some technique details come from manufacturer training or national standards, not NH PCP (for example the CAT tourniquet steps, EpiPen hold time, nebulizer flow). `docs/reference/call-content.md` lists them.
