# Artifact Library

One claude.ai artifact page that lists Clifton's Claude artifacts by life area. Live: https://claude.ai/artifact/53JnMS56PgSQmNvCXPrhzn

## Map
- `artifact-library.html`: the whole page (CSS + JS). Publish with the Artifact tool, `capabilities: {db: {}}`, to the URL above.
- `docs/adr/`: decisions.

## Rules
- Records live in the artifact's `db`, collection `items`, doc id = artifact id from the URL. Add rows with ArtifactData, never in the HTML.
- Item fields: `title, url, area (ops|lead|medic|career|daily|hist), note, pinned, status (active|archive), updated, added`.
- This repo is public. Do not commit the item list (titles of private artifacts).
- Redeploy to the same URL; never publish a new library.
