# ADR 0007: Call flows and CPR timer built from NH v9.3 text, with license levels

Status: Accepted · 2026-10-04

**Context.** The first call flows were drafts from general EMT-B practice. The owner supplied NH v9.3 (Google Drive) and wants the app for EMT, AEMT, and Paramedic crews.

**Decision.**
- Each flow file sets `nh: '9.3'`. The validator then requires a `cite` (protocol number and PDF page) on every node and a `level` on every action. Doses are copied verbatim into `dose`.
- A "My license level" setting (Call tab) changes action cards above the user's level to "Above my level: ALS requested / Done by ALS on scene / Not done". Above-level steps are not flagged as missed; the report shows them as ABOVE-LEVEL.
- The CPR timer reads every timing value from `data/nh-arrest.js`, which keeps the NH verbatim text and cite beside each number. Derived numbers (240 s = "every other" 2-min cycle; metronome 110 inside NH's 100-120) are commented in that file and tested against the verbatim.
- Where NH is silent or contradicts itself, the app shows both or a VERIFY note; it never picks a value.

**Consequences.**
- + Every screen traces to a page.
- − Still `verified: false` until the owner checks each flow (`docs/reference/protocol-open-items.md`).
