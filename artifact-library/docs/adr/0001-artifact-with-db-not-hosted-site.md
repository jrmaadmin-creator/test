# ADR 0001: Library is a claude.ai artifact with a database

- Status: Accepted
- Date: 2026-09-29

## Context

Clifton has 45+ Claude artifacts, including several earlier hub pages and duplicates. He wants one place to find them. The links are private claude.ai artifacts. This GitHub repo is public.

## Decision

Build one claude.ai artifact page with the `db` capability. Each artifact is one document in collection `items`. Tiles link out in a new tab; claude.ai does not allow embedding one artifact in another.

Rejected: a static site on GitHub Pages (public, would expose titles such as payroll and contract reviews, needs a redeploy per new artifact); the built-in gallery alone (no areas, notes or archive).

## Consequences

- No hosting or cost. Private by default. Works on phone.
- Claude adds new artifacts with ArtifactData without republishing the page.
- The repo keeps only the page source; the list lives in the artifact database.
- Existing hub pages stay and are listed as tiles; duplicates are flagged in notes, not deleted.
