# JRMA Field Guide: status and handoff

Updated 2026-10-20. Read this first, then `../CLAUDE.md`.

## What it is
Offline phone app (PWA) for JRMA crews (EMT, AEMT, Paramedic) on NH Patient Care Protocols v9.3:
- Call flow and protocol prompts.
- Vitals with flags.
- CPR timer.
- Pediatric color bands and dose lookup.
- MIST handoff for the RN.
- One-tap pre-arrival fax to the ED.

Owner: Clifton Gill (JRMA EMT-B). Stage: personal test build, not approved for patient care.

## Where things are
| Item | Location |
|---|---|
| Code | `jrmaadmin-creator/test`, branch `claude/amazing-thompson-b19cqs`, folder `jrma-field-guide/`. All commits pushed. |
| PR | https://github.com/jrmaadmin-creator/test/pull/3 (open; description predates direct fax and the redesign) |
| Live site | https://jrma-field-guide.netlify.app (public, no login) |
| Netlify site ID | `c0ca4a6f-104d-4e98-8941-73d8de82c545` |
| Protocol source | NH PCP v9.3 PDF and page images in the owner's Google Drive (`protocols-source/README.md`) |
| Fax server | `netlify/functions/fax.mts` at `/api/fax`; logic in `netlify/lib/srfax.mjs` |
| Secrets | Netlify environment variables only (names in `how-to/set-up-direct-fax.md`). Never in code or chat. |

## How to work on it
- Tests: `npm test` (46 passing on 2026-10-20). Protocol check: `npm run validate`.
- Local server: `python3 -m http.server 8080 --directory app`.
- Bump `VERSION` in `app/sw.js` whenever any app file changes (now `v15`). Phones keep the old copy otherwise.
- Deploy:
  1. Run the Netlify MCP `deploy-site` with the site ID above.
  2. Run the returned `npx @netlify/mcp ... --proxy-path` command from `jrma-field-guide/`.
- Environment variable changes need a redeploy.
- Phone screenshots: use Playwright with an iPhone 13 profile. The live site needs the proxy CA SPKI pin flag in a cloud container.

## Current state
| Area | State |
|---|---|
| UI | Redesigned 2026-10-08. Five tabs: Call, Assess, Vitals, Meds, Report. Settings and CPR open from the app bar. In-app sheets replace browser dialogs. Dark mode. Preview: `images/redesign-preview.png`. |
| Protocols | 7 flows, all `verified: false`: Routine Patient Care, ACS, Respiratory, Stroke, Diabetic, Allergic, Opioid. Each step cites NH section and page. |
| Meds | A3 pediatric bands and 485 dose statements as printed, all unverified. No mL math: JRMA stock concentrations are not documented. |
| CPR | 2-min cycles, epi every 4 min, 110/min metronome, 8-min airway and 20-min TOR prompts (ADR 0007). |
| Direct fax | Works. SRFax account 447294, caller ID 603-386-6611. First test: SRFax #1758142057 to 603-532-2405, Sent 2026-10-05 6:15 PM. Server enforces PIN, an allowed-number list (only 6035322405) and TEST-only reports. |
| Privacy | Age and sex only. The pre-arrival report never includes notes or history (tests enforce this). |

## Blockers before real patient use
1. **No HIPAA BAA** with Netlify, and none recorded with SRFax. Keep `FAX_REQUIRE_TEST` unset until both exist or the server moves to a covered host.
2. **Protocol content unverified.** The owner checks each flow against the book (`how-to/verify-a-protocol.md`). Open conflicts: `reference/protocol-open-items.md`.
3. **MCH ED fax number and agreement** not obtained. When ready:
   1. Add the number to `FAX_ALLOWED_NUMBERS` and redeploy.
   2. Set it in the app's Settings.
4. **JRMA approval.** No medical director or agency sign-off yet.

## Owner to-do
- Change the SRFax password, because it was typed in a chat. Then update `SRFAX_ACCESS_PWD` in Netlify and redeploy.
- Change `FAX_PIN`, because it was also typed in a chat. Then redeploy.
- Check SRFax settings for retention and auto-delete, and turn off fax copies attached to confirmation emails.
- Provide JRMA drug stock concentrations if mL dose math is wanted.

## Decisions (see `adr/`)
- 0001 offline PWA, no build step.
- 0002 no patient identifiers.
- 0003 protocols as data with citations.
- 0004 MIST handoff.
- 0005 pre-arrival email-to-fax (backup).
- 0006 peds values as printed.
- 0007 flows and CPR from NH text only.
- 0008 direct fax through a Netlify function.

## Sharing the fax service with other apps
A nursing home app session asked to reuse SRFax. The recommendation given:
- Run its own server (for example a Cloudflare Worker with `nodejs_compat`).
- Copy `netlify/lib/srfax.mjs` into it.
- Give it its own PIN, allowed list and `sAccountCode` (for example `NH-APP`).
- Do not call this app's `/api/fax`: it accepts same-origin requests only and has its own allowed list.

## Next steps, in order
1. Owner field-tests in test mode for 1 to 2 shifts and lists friction points.
2. Owner verifies the ACS flow against the book, then flip `verified: true`.
3. Update the PR #3 description (direct fax, redesign, blockers).
4. Resolve the BAA question before removing the TEST gate.
