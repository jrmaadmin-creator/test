# ADR-0001: Single-page HTML canvas game, medical content in separate files

- Status: Accepted
- Date: 2026-09-29
- Deciders: project owner (JRMA EMT), Claude Code

## Context

JRMA wants a training game any crew member can open on a phone or station computer, with no installs, logins, or IT tickets. The medical content must track the New Hampshire Patient Care Protocols (v9.3 now), which the state revises about every two years. The people most able to check that content are EMS providers, not programmers.

## Decision

1. Build the game as one static HTML page with vanilla JavaScript and a `<canvas>` for the overworld. No framework, no build step to play.
2. Keep all medical content (calls, trial questions, pearls) in `content/*.js` as plain data, separate from the engine in `index.html`.
3. Ship a one-file bundle (`npm run bundle` makes `dist/legend-of-jrma.html`) for sharing by email, text, or USB.
4. Save progress in the browser's `localStorage` (per device). No server.
5. Guard it with one Playwright smoke test that validates the content structure and plays every call and trial to completion.

## Options considered

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Vanilla JS single page (chosen) | Opens anywhere, zero install, easy to host free, small | Engine code grows by hand; no editor for maps | Best fit for a prototype crews can use today |
| Phaser 3 | Real game engine: tilemaps, physics, scenes | Library to learn; more code to review for a mostly menu-driven game | Revisit at trigger 1 or 2 |
| Godot 4 (web export) | Visual editor, strong 2D tools | Larger downloads, slower on old phones, content locked in the editor | Overkill for now |
| LMS/SCORM module (Articulate, etc.) | Tracks completions for CE credit | Paid tools, dull format, loses the game feel | Consider only as a wrapper later |
| Twine/ink text game | Easy branching writing | No overworld, weak for "Zelda-like" | Rejected |

## Consequences

- Good: a reviewer can fix a dose in `content/calls.js` without touching game code. Diffs show exactly what medical text changed.
- Good: runs offline once loaded; works on phones with the on-screen pad.
- Bad: progress is per device and per browser. There is no crew-wide scoreboard or completion record.
- Bad: sprites and maps are drawn in code, so art changes need a developer.

## Revisit when any of these happens

1. `index.html` passes about 3,000 lines, or a second developer joins.
2. More than about 25 calls, or a need for a visual map editor.
3. JRMA wants completion tracking for CE credit or a leaderboard (needs a backend or an LMS).
4. NH releases protocol version 10 (re-verify all content; see `docs/how-to/update-for-new-nh-protocols.md`).
