# How to add a call

1. **Pick the condition and level.** The condition is the monster. The level (EMT, AEMT, Paramedic) must match NH scope for every action the player needs.
2. **Find the NH protocol sections** that cover it in NH PCP v9.3. Write them down with section numbers.
3. **Copy an existing call** in `content/calls.js` at the same level and change:
   - `id` (short, lowercase), `tier` (0 EMT, 1 AEMT, 2 Paramedic), `npc` (who starts the call)
   - `dispatch`, `scene`, `urgent`, `after`, `outro`
   - `monster.cond` (the real condition name), `monster.name` (the joke name), `monster.draw` (a sprite in `MON` inside `index.html`)
   - `patient.look` (a key in `LOOKS` in `index.html`) and `pose` (`sit`, `stand`, or `lie`)
   - `vitals` at the start of the call
4. **Write the steps.** Each step needs `g` (priority group), `label`, `why`, `hint`, and `early` (shown if picked too soon). Steps that can happen in any order share a `g`. Groups start at 0 with no gaps. Optional `vitals` changes the vitals when the step is done.
5. **Make hands-on steps into simulations.** If the player performs the step (not just decides it), give it a `sim`. See "Add a hands-on simulation" below.
6. **Write 4 to 6 wrong options.** `sev: 1` costs one heart, `sev: 2` is a critical error, `sev: 0` is the harmless joke. Every one needs a `why` that corrects the myth.
7. **Fill `numbers`** (3 to 5 facts to memorize) and `nh` (protocol sections).
8. **Add it to a level** in `window.JRMA.LEVELS` at the top of `content/calls.js`.
9. **Place the NPC.** If the `npc` is new, add it to `NPC_DEFS` in `index.html` on a walkable tile.
10. **Update `docs/reference/call-content.md`.**
11. **Run `npm test`.** It checks the structure and plays the call start to finish, including every simulation.

## Add a hands-on simulation

A step with a `sim` opens a hands-on panel when the player picks it at the right time. The step counts only after every stage is done. Why this design: `docs/adr/0002-hands-on-simulations-as-staged-data.md`.

```js
{ g: 2, label: 'Naloxone IN: 2 mg (1 mg each nostril)', hint: '...', why: '...', early: '...',
  sim: { title: 'Naloxone, intranasal', stages: [
    { type: 'place', scene: 'face', prompt: 'Atomizer on. 1 mg into each nostril.', item: 'Atomizer, 1 mg',
      targets: ['nareR', 'nareL'], decoys: ['mouth'],
      why: { mouth: 'Intranasal means the nose.' }, done: '1 mg in each nostril, 2 mg total.' },
  ] } },
```

Every stage takes `type`, and optionally `prompt` (the instruction), `chip` (short label in the stage list), `status` (first status line), and `done` (feedback when the stage is finished; the last stage's `done` joins the step's "Correct!" message).

| Type | Player does | Fields |
|---|---|---|
| `place` | Drags the item onto a spot, or taps the spot | `scene`; `targets` (right spots); `decoys` (tempting wrong spots); `item` (label), or `items` to place one per target in order; `need` (how many targets, for "either side"); `why` and `sev` maps by spot; `show` (hidden art to reveal); `mark` (`dot`, `pad`, `lead`, `drop`, `band`, `strap`, `hands`, `none`). A target of `'@prev'` means the spot hit in the previous place stage. |
| `hold` | Holds a button, lets go between `min` and `max` seconds | `min`, `max`, `short`, `long`, `button`, `scene`; for repeats `reps`, `every: [lo, hi]` seconds start to start, `fast`, `slow` |
| `dial` | Sets a number, then confirms | `label`, `unit`, `min`, `max`, `step`, `start`, `ok: [lo, hi]`, `low`, `high`; `look` (`flow`, `syringe`, `angle`, `tablets`); `maxLabel`; `key` saves the value for a later stage |
| `order` | Taps actions in the right order | `items` (in the correct order; shown shuffled), optional `why` by index |
| `signal` | Waits for a cue, then presses | `wait: [lo, hi]` seconds, `waiting`, `chatter` (decoy lines), `signal`, `go`, `early`, `sev` |
| `shock` | Charge (manual), call clear, look, shock | `charge: true` for a manual monitor |
| `bagcpr` | Squeezes the bag on every 10th compression | `breaths` (default 3) |
| `pace` | Raises mA until every spike captures | uses the rate from a `dial` stage with `key: 'rate'` |
| `rhythm` | Taps compressions at 100-120/min | `taps` (default 12) |
| `windlass` | Pulls, twists, and locks a tourniquet | `halfTurns`, `secs` |

Shared builders at the top of `content/calls.js` cover repeated skills: `simKit.pulse(done)`, `simKit.glucose(reading)`, `simKit.iv({ why, done })`, `simKit.bolus({...})`, `simKit.pads(prompt, done)`, `simKit.outerThigh(item, prompt, done)`, `simKit.draw({...})`.

### Scenes and spots

Scenes live in `content/scenes.js`: SVG art on a 240 x 200 grid plus named spots (`zones`) with `x`, `y`, radius `r`, a `name` (read by screen readers and keyboard users), and a default `why` for wrong drops. The patient's right side is on the viewer's left. To add a spot, add a zone, then name it in a stage's `targets` or `decoys`. `npm test` fails if a stage names a scene or spot that does not exist.

### Fumbles

- A wrong spot, a bad number, or a mistimed press is a fumble: the player sees why, and nothing else happens.
- A `sev` on a wrong spot also costs patient hearts, like a harmful choice. Use it for moves that hurt someone.
- Three fumbles end the attempt; the player picks the step again.
- After two fumbles on one stage, the partner highlights the right spot.
