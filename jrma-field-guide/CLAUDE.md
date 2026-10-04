# JRMA Field Guide

Offline phone app (PWA) for JRMA crews (EMT, AEMT, Paramedic): call flow, MIST handoff, pre-arrival report to the ED.

## Rules
- Never write protocol steps, doses, or thresholds from memory. Content comes from NH Patient Care Protocols v9.3 (owner's Google Drive; see `protocols-source/README.md`), cited by protocol number and page.
- A protocol is `verified: true` only after the user checks it against the PDF. The validator enforces the citation.
- No patient identifiers (name, DOB, address) anywhere in the app. Age and sex only.
- Every intervention carries its NH license level (EMT, AEMT, Paramedic).
- Pre-arrival report: never add Notes, History, names, DOB, or addresses (ADR 0005). Tests enforce it.
- No build step, no dependencies. Plain ES modules.

## Commands
- `npm test` — engine and protocol tests
- `npm run validate` — protocol graph check
- `npm run serve` — local server on :8080

## Map
- `app/js/engine.js` — pure logic (runner, vitals flags, impressions, report). No DOM.
- `app/js/app.js` — UI
- `app/js/prearrival.js`, `app/js/pdf.js` — ED pre-arrival report and fax-ready PDF
- `app/js/protocols/` — one file per protocol (see its CLAUDE.md)
- `docs/` — Diataxis: tutorials, how-to, reference, explanation; `docs/adr/` decision records
