# ADR 0002: No patient identifiers

Status: Accepted · 2026-09-29

**Context.** A personal device holding PHI creates HIPAA exposure for the user and JRMA.

**Decision.** Record age, sex, findings, vitals, times, interventions only. Store in `localStorage` for crash recovery; erase on *End call*. No network calls.

**Consequences.**
- + A lost phone exposes no identifiable patient.
- − The report must be merged into the ePCR by hand (copy/paste).
- − Free-text Notes could still receive a name; the UI warns against it.
