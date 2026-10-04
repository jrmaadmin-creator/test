# ADR 0006: Pediatric reference shows NH Appendix A3 as printed; no mL math yet

Status: Accepted · 2026-10-04

**Context.** The goal is Handtevy-style pediatric dosing. NH v9.3 already publishes precalculated doses per length-tape color band (Appendix A3, PDF pp. 253-255). JRMA's stocked concentrations are not documented anywhere readable (truck check lists names; epinephrine only as ratios; no controlled-substance list).

**Decision.**
- The Peds tab shows A3 values exactly as printed, per band, with the page citation. Lookup by weight, length, or tape color. Weights in the gaps between bands show both neighbors and tell the crew to use the tape.
- Probable source typos are kept as printed and shown with a CHECK SOURCE note. Nobody "fixes" a State table in code.
- mL volumes are shown only where A3 prints them (D10, racemic epi, NS). Concentration-based mL math waits until JRMA confirms its stock in writing, because one wrong concentration makes every volume wrong.
- The whole table stays `verified: false` until the owner checks each band against the page (`docs/reference/peds-a3.md`).

**Consequences.**
- + No calculation errors possible: the app is a faster way to read the State's own table.
- − Less than Handtevy: no mL for most drugs, no equipment beyond ETT and blade (A3 prints none).
- Next: a stock file (drug, concentration, source) approved by the medical director, then mL = printed mg ÷ concentration, tested against a hand-calculated table.
