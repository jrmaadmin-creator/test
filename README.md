# GitHub split: JRMA organization and personal account

Type: reference (package index and hand-off). Status: v0.1, 2026-09-29. Owner: you.

This repo is a staging area. The JRMA Hub chat is the only writer of the hub's shared docs, so this package was prepared here and goes to the hub through the "For the hub" section below. Nothing in `jrma-ops` was changed.

| Doc | Type | Use |
|---|---|---|
| `how-to-split-work-and-personal-github.md` | how-to | The click-by-click steps (about 30 minutes) |
| `adr-001-github-organization-for-jrma.md` | decision record | Why convert to an organization, what else was considered, what changes |
| `ARD.md` | decision log | Index of this package's decisions |
| `CLAUDE.md` | reference | Notes for Claude sessions in this repo |

Visibility: this repository is public. It holds no contact data, credentials, or patient information. Make it private or delete it once the Hub chat has imported the package.

## For the hub

Status: GitHub split proposed 2026-09-29; how-to ready; nothing run yet.

New questions (draft wording, no ID):

1. For the Chief: Will you create a free GitHub account with your JRMA email and turn on two-factor authentication, so you can be the second owner of JRMA's GitHub organization? You would use it only to recover the organization or the `jrma-ops` mirror. Pairs with G-07 and HUB-L02.
2. For the Rename chat: Should the GitHub organization be renamed at the 2027 rename, and to what? A rename changes the Bay Board's GitHub Pages address, so it moves on the same day as the Yodeck URL change.

Answers received: none.

IDs needed: a home and ID for `adr-001-github-organization-for-jrma.md` (Hub chat's choice).

Proposed hub ARD row:

| Date | Decision | Status | Where |
|---|---|---|---|
| 2026-09-29 | GitHub: convert `jrmaadmin-creator` into a free organization owned by the hub owner's personal account and the Chief's account, two-factor required; personal projects live on the hub owner's personal account only. Reverses the 2026-09-24 row that dropped the GitHub org. Repository addresses do not change | Proposed; done when the how-to has run and the Chief is an owner | ADR (this package); accounts checklist |

Proposed replacement for the GitHub row in `governance/accounts-and-ownership.md`:

| Account | Exists today | Held by | Target owner and admins | Action | Rename 01/2027 |
|---|---|---|---|---|---|
| GitHub | Yes: `jrmaadmin-creator` (personal account today; becomes an organization per the how-to), private repo `jrma-ops` | Hub owner | Organization owners: the Chief and the hub owner, each on their own account, two-factor required | Run the how-to; Chief creates an account and accepts the owner invite; the Bay Board page repo lives in this organization | Organization name set by the Rename chat; update the Yodeck URL the same day |

Docs that still say "no separate org" or name the dropped org `jrma-ops` (each doc's writer updates it after the conversion):

| Doc | Line or section | Writer |
|---|---|---|
| `governance/accounts-and-ownership.md` | GitHub row | Hub chat |
| `governance/chat-openers.md` | Bay Board opener: "GitHub hosting lives under the jrmaadmin-creator account ... not a separate org" | Hub chat |
| `governance/chief-questions-log.md` | G-07, GitHub clause | Hub chat |
| `reference/agency-profile.md` | "Not yet created ... GitHub org `jrma-ops`" | Hub chat |
| `governance/hub-integration-plan-v0.2.md` | Identity row, step 1, idea 28 ("GitHub org `jrma-ops`") | Hub chat |
| `operations/bay-board/CLAUDE.md` | Key IDs: "(no separate org; hub ARD 2026-09-24)" | Hub chat (folder-level CLAUDE.md) |
| `operations/bay-board/adr-001-hosting-and-roster-feed.md`, `spec-apps-script-v0.3.md`, `plan-bay-screen-pilot-v0.1.md` | Org name `jrma-ops` becomes `jrmaadmin-creator` | Bay Board chat |

Agency facts learned (source, date):

- `jrmaadmin-creator` was created 2026-09-24 and belongs to no GitHub teams (GitHub API, 2026-09-29).
- `jrmaadmin-creator/test` exists: public, empty before this package (GitHub, 2026-09-29).
- GitHub's terms allow one free account per person or legal entity (Terms of Service B.3, 2026-09-29).
- Converting a personal account to an organization is permanent, keeps repositories and their addresses, and unlinks past commits from the account (GitHub Docs, 2026-09-29).
