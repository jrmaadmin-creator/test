# ADR 0003: Protocols as data files with page citations

Status: Accepted · 2026-09-29

**Context.** Protocol content changes (v9.0 → v9.2) and errors are patient-safety risks. The NH PDF could not be downloaded in the build environment.

**Decision.** Each protocol is a data file of question/action/info nodes. `verified` flag plus `source.section`/`source.page`. Unverified content shows a banner; unverified doses show VERIFY boxes. A validator checks graph integrity and citations.

**Consequences.**
- + Content updates do not touch app code.
- + Every verified step traces to a page.
- − All shipped content starts unverified; the app is a trainer until verification is done.
