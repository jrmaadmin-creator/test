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
5. **Write 4 to 6 wrong options.** `sev: 1` costs one heart, `sev: 2` is a critical error, `sev: 0` is the harmless joke. Every one needs a `why` that corrects the myth.
6. **Fill `numbers`** (3 to 5 facts to memorize) and `nh` (protocol sections).
7. **Add it to a level** in `window.JRMA.LEVELS` at the top of `content/calls.js`.
8. **Place the NPC.** If the `npc` is new, add it to `NPC_DEFS` in `index.html` on a walkable tile.
9. **Update `docs/reference/call-content.md`.**
10. **Run `npm test`.** It checks the structure and plays the call start to finish.
