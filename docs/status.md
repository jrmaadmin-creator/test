# Project status and handoff

Last updated 2026-10-20. Read this first when resuming in a new session.

## Where things live

| Item | Location |
|------|----------|
| Code | `main` (PR https://github.com/jrmaadmin-creator/test/pull/1 merged 2026-09-30) |
| Offline app | `dist/heart-conduction-lab.html` (open directly; no network needed) |
| Shared online version | https://claude.ai/artifact/XStqD5VpYNmgcCw4JA8Mjr (crew progress database; `db` + `user` capabilities) |
| Textbook handoff | `textbook-kit/HANDOFF.md` (for Codex: embed views, IDs, placements, rules). Zip = built app + handoff + example + embed-resize.js + `app-source/` |
| Kit on owner's PC | `C:\Users\clift\Documents\Heart Lab Textbook Kit` (downloaded 2026-10-20; app and HANDOFF.md hashes matched GitHub) |
| Open PR | https://github.com/jrmaadmin-creator/test/pull/5 (embed mode + kit), draft, not merged; monitoring stopped at owner's request |
| NH protocol source | NH Patient Care Protocols v9.3 (Nov 2025), uploaded by the owner as .docx. Not committed (ADR 0004). Re-upload it to any new session that edits treatment content |

## Done

- 29 rhythms, 3D conduction + contraction, vector ECG model, 12-lead mode, ladder timeline, pulse/PEA, Compare, monitor artifacts, 6-second strip on phones.
- Quiz (heart + strip only, NH treatment question after each rhythm).
- Scenarios: 9 calls (7 adult, 2 pediatric), graded against NH v9.3, optional timed mode (20 s per decision).
- Treatment: NH v9.3 adult (1.0, 3.0, 3.1A, 3.2A, 3.4, 3.5A, 3.6) and pediatric (3.1P, 3.2P, 3.5P), Adult/Pediatric switch.
- Crew table: quiz accuracy, mastered rhythms, scenario calls.
- Embed mode for textbooks: `?embed=heart|strip|twelve|compare|quiz|scenario|full` (2026-10-20). Narrow-screen overflow fixed down to 320 px.

## Owner decisions

| Question | Decision |
|----------|----------|
| Course standard | Paramedic course, AHA and NREMT |
| Treatment source | NH v9.3 only; doses copied from protocol text, never from memory |
| Crew sharing | Invited by email. Viewers need Editor access to save results |
| STEMI module | Not wanted |
| Scenario mode, treatment quiz, timed mode, pediatric protocols, crew call tracking | Yes |
| Scenarios as a skills sign-off record | Probably not |
| Anti-protocol (wrong-answer-is-protocol-deviation) scenarios | No |

## Open

- Textbook integration handed to Codex (platform and chapter list unknown to this repo).
- Owner questions not yet answered: merge PR #5 now or after Codex tries the kit; make the repo private (it is public, and its default branch is the work branch, not `main`); textbook platform.
- Embed timing under heavy WebGL load at 390 px not re-verified (one slow run; likely test-machine load).
- Not tested: a second crew member saving results to the shared database.
- Offered, not yet answered:
  - Weight-based pediatric dose calculator (NH v9.3 doses only).
  - More pediatric scenarios (for example infant SVT above 220, which needs a faster SVT rhythm).

## Resume in a new session

1. Open a Claude Code session on `jrmaadmin-creator/test`, branch `main`.
2. Tell Claude: "Read `docs/status.md` and `CLAUDE.md`, then continue."
3. If the work touches treatment or scenarios, upload the NH protocol file.
4. To update the shared artifact, give Claude its URL (above) so it republishes to the same link and keeps the crew data.
