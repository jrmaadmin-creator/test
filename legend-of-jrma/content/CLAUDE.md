# content/

Medical content only. The engine reads `window.JRMA.{LEVELS, ORDER, CALLS, EXAMS, PEARLS}`.

- Source of truth: NH Patient Care Protocols v9.3 (effective 2025-11-07). Section numbers go in `nh` (for example `Hypoglycemia - Adult (2.11A)`).
- A trial question gets `verified: true` only after a line-by-line check against the NH PCP.
- If NH does not address a fact, say "national guideline" in `nh` and name the source.
- Keep doses with units and routes. When a number varies by agency, say "per protocol" instead of guessing.
- Update `docs/reference/call-content.md` in the same commit as any content change.
- `npm test` enforces structure (groups, early messages, answer indexes, no em dashes).
