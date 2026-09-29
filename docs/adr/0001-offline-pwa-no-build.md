# ADR 0001: Offline PWA, plain JavaScript, no build step

Status: Accepted · 2026-09-29

**Context.** Used on a phone during calls in areas with no cell signal. Maintained by one person who is learning to code.

**Decision.** Progressive Web App with a cache-first service worker. Plain HTML/CSS/ES modules. No framework, no npm dependencies.

**Consequences.**
- + Works offline after first load; installs from a URL, no app store.
- + Nothing to compile; any file is readable and editable.
- − Every new file must be added to `sw.js` (a test enforces it).
- − iOS may evict PWA storage after weeks of non-use; only affects an in-progress call, which is short-lived anyway.
