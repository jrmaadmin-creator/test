# ADR 0004: Treatment content follows NH Patient Care Protocols v9.3

- Status: Accepted (revised 2026-09-29)
- Date: 2026-09-29

## Context

The user asked for treatment that lines up with the New Hampshire Patient Care Protocols. The current version is v9.3 (Bulletin #96, November 2025; no cardiac changes since v9.0, effective 6/1/2024). The development environment's network policy blocks the NH hosting domains, so the first version used AHA ACLS content with a "not yet verified" notice. The user then supplied the v9.3 protocol document directly.

## Decision

- Adult treatment steps in `src/js/clinical.js` come from NH protocols 1.0 Routine Patient Care, 3.0 Acute Coronary Syndrome, 3.1A Bradycardia, 3.2A Cardiac Arrest, 3.4 Post Resuscitative Care, 3.5A Tachycardia and 3.6 Team Focused CPR; pediatric steps from 3.1P, 3.2P and 3.5P (with the NH definition of a pediatric patient: fits a length-based tape up to 36 kg or 145 cm). Doses and energies are copied from the protocol text.
- Every step carries its protocol number. Page numbers are not cited because the source was a Word document without fixed pagination; the protocol number is the stable reference.
- Levels follow the NH standing-order headings (EMR/EMT, AEMT, Paramedic; "All" for Routine Patient Care).
- Where NH says "follow applicable AHA ACLS guidelines" without detail (for example the arrest anti-dysrhythmic dose), the step is tagged AHA.
- Quiz treatment questions and scenarios use the same content and citations. `npm run check` verifies every rhythm maps to a treatment, every step has a citation, and every question and scenario step has exactly one correct answer.

## Consequences

- When NH publishes a new version, update `clinical.js` and `scenarios.js` from the new text and bump `NH_STATUS.version`.
- Sedation options and full pearls are summarized, not reproduced; the panel points to the protocol book.
- The original PDF/Word file is not committed (large, and owned by the State).
