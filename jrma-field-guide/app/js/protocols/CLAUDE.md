# Protocol files

- Schema: `docs/reference/protocol-schema.md`. Run `npm run validate` after every edit.
- New file: import it in `index.js` AND add it to `FILES` in `app/sw.js`, then bump `VERSION` in `sw.js`. `npm test` fails if the SW list is missing a file.
- Any dose or threshold not copied from the NH PDF gets a `verify:` string.
- Setting `verified: true` requires `source.section` and `source.page`.
- Flows built from NH text set `nh: '9.3'`: every node needs `cite`, every action needs `level` (ADR 0007). Open questions go in `docs/reference/protocol-open-items.md`.
