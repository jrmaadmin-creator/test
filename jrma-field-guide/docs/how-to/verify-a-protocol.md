# How to verify a protocol against the NH PDF

1. Add the PDF to `protocols-source/` (see its README).
2. Open the protocol file, e.g. `app/js/protocols/chest-pain.js`, beside the matching NH protocol section.
3. For each node: fix wording, doses, and thresholds to match the PDF exactly. Remove each `verify:` string once its item matches.
4. Add steps the NH protocol has that the draft lacks. Mark time-critical interventions `critical: true`.
5. Set `source.section` (e.g. "2.1") and `source.page`, then `verified: true`.
6. `npm run validate && npm test`.
7. Bump `VERSION` in `app/sw.js` so phones download the new content.

With Claude: "Verify chest-pain.js against protocols-source/nh-pcp-v9.2.pdf section X" does steps 2-6; you check the diff.
