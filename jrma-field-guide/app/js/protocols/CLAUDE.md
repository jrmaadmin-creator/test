# Protocol files

- Schema: `docs/reference/protocol-schema.md`. Run `npm run validate` after every edit.
- New file: import it in `index.js` AND add it to `FILES` in `app/sw.js`, then bump `VERSION` in `sw.js`. `npm test` fails if the SW list is missing a file.
- Any dose or threshold not copied from the NH PDF gets a `verify:` string.
- Setting `verified: true` requires `source.section` and `source.page`.
