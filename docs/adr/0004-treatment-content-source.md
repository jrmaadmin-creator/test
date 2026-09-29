# ADR 0004: Treatment content follows AHA ACLS until NH protocols are verified

- Status: Accepted (revisit when the NH PDF is readable)
- Date: 2026-09-29

## Context

The user asked for treatment that lines up with the New Hampshire Patient Care Protocols. The current version is v9.3 (Bulletin #96, released November 2025; clarifications only, no cardiac changes since v9.0, effective 6/1/2024). The development environment's network policy blocks the NH hosting domains (`mm.nh.gov`, `www.fstems.dos.nh.gov`, `www.nh.gov`), so the protocol text could not be read. Writing NH doses from memory risks teaching the wrong dose.

## Decision

- Treatment steps in `src/js/clinical.js` follow the AHA adult ACLS algorithms (bradycardia, tachycardia, cardiac arrest), which the user's paramedic course (AHA and NREMT) teaches.
- Each step is tagged BLS or ALS using the National EMS Scope of Practice Model, not NH Appendix 4.
- Every treatment panel shows a visible notice: "NH Patient Care Protocols v9.3: not yet checked against the NH protocol text."
- `NH_STATUS.verified` stays `false` until each step has been compared with the NH PDF and given a protocol number and page.

## Consequences

- No NH-specific dose appears in the app until it is sourced.
- To finish: allow the NH domains in the environment's network settings, or put the PDF in the repo or Google Drive, then compare and cite each step.
