# Project status and handoff

Last updated 2026-10-08. Read this first when resuming in a new session.

## Where things are

| Item | Location |
|---|---|
| Code and docs | `jrmaadmin-creator/test`, folder `fleet-telemetry/` (branch `claude/gps-driving-telemetry-app-0ukxik`) |
| Design spec | `docs/superpowers/specs/2026-10-08-recorder-design.md` |
| Decisions | `docs/adr/0001` to `0004` |
| Liability log entry | Owner's "JRMA Work Record and Liability Log", Risks table, 10/08/2026 (rig test) |

## Done

- Design approved in chat (scope, privacy, events, hosting). Written spec and ADRs drafted.

## Owner decisions

| Question | Decision |
|---|---|
| End goal | JRMA fleet and crew monitoring, built in pieces |
| Phone | iPhone, one dedicated agency phone per rig |
| Build approach | Shared core, web recorder first, native (Expo) later (ADR 0001) |
| Rig privacy | Rig mode stores no location (ADR 0002) |
| Events | GPS-derived; motion sensors record jolt only (ADR 0003) |
| Hosting | Netlify, Home Screen install, deploy only with owner OK (ADR 0004) |
| First test | In a JRMA rig, after the Chief's OK. Command has not been asked about crew monitoring |
| Mac | None |
| Repo | Owner wanted a separate repo. The Claude GitHub connection cannot create repos (403, 10/08/2026), so the project lives in `fleet-telemetry/` of the `test` repo for now. Move it with `git subtree split` once the owner creates `fleet-telemetry` |

## Open

- Owner review of the written spec.
- Chief question (DRAFT, pending legal review), for the weekly Chief list:
  > May I mount a dedicated iPhone in [rig] to test a driving recorder on my own driving only? It records speed and hard-brake, hard-acceleration and hard-cornering events. It stores no location, so no call addresses. Data stays on the phone. I will share results with you before any wider use, and nothing about other crew members is recorded.
- Legal review: whether time-stamped speed records without location are PHI or discoverable; retention period.
- Rig chassis details (native stage, OBD-II).

## Resume in a new session

1. Open a Claude Code session on `jrmaadmin-creator/test`.
2. Tell Claude: "Read `fleet-telemetry/docs/status.md` and `fleet-telemetry/CLAUDE.md`, then continue."
