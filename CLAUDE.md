# EMT Call Guide

Offline phone app (PWA) that walks an NH EMT-B through a call and builds a MIST handoff report.

## Rules
- Never write protocol steps, doses, or thresholds from memory. Content comes from the NH Patient Care Protocols PDF in `protocols-source/`, cited by section and page.
- A protocol is `verified: true` only after the user checks it against the PDF. The validator enforces the citation.
- No patient identifiers (name, DOB, address) anywhere in the app. Age and sex only.
- EMT-B scope only. Do not add ALS interventions as actions; list them as "request ALS".
- No build step, no dependencies. Plain ES modules.

## Commands
- `npm test` — engine and protocol tests
- `npm run validate` — protocol graph check
- `npm run serve` — local server on :8080

## Map
- `app/js/engine.js` — pure logic (runner, vitals flags, impressions, report). No DOM.
- `app/js/app.js` — UI
- `app/js/protocols/` — one file per protocol (see its CLAUDE.md)
- `docs/` — Diataxis: tutorials, how-to, reference, explanation; `docs/adr/` decision records
