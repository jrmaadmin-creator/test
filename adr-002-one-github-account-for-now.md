# ADR-002: One GitHub account for work and personal, for now

Type: decision record. Status: decided by you 2026-09-29. Supersedes ADR-001. Owner: you.

## Context

- `jrmaadmin-creator` is a personal-type GitHub account that signs in with the JRMA `jrmaadmin@` address (you, 2026-09-29). The JRMA hub records it as the JRMA account and decided on 2026-09-24 not to create a GitHub organization.
- You want space for personal projects and don't want a second account yet.
- GitHub's terms allow one free account per person, so one account is within the terms.

## Decision

1. Work and personal repos share `jrmaadmin-creator` until you create a personal GitHub account.
2. The account stays a personal account. No organization now.
3. The repository is the line between the two spaces. JRMA work goes in `jrma-ops`. Personal work goes in this repo (renamed and made private) or in its own repos. Personal folders never go inside `jrma-ops`, and JRMA documents never go here.

## Alternatives considered

| Option | Why not now |
|---|---|
| Convert `jrmaadmin-creator` into an organization (ADR-001) | Needs a personal account first and is permanent; you chose to wait |
| Create a personal account now | You chose to wait |
| Personal folders inside `jrma-ops` | Mixes personal files into the hub's single-writer mirror; can't be moved later without editing the hub |

## Consequences

- Access: anyone who controls the `jrmaadmin@` mailbox can start a GitHub password reset. Anyone given this login under the hub's accounts rule (G-07) sees every private repo in it. Two-factor authentication on the GitHub account means email access alone isn't enough to take it over. Until the move, keep out anything you wouldn't want a JRMA administrator to read.
- The later move is one transfer per personal repo (`how-to-move-personal-repos-to-a-personal-account.md`). Old addresses redirect.
- If the Chief is about to get this login under G-07, move the personal repos first.
- The hub's 2026-09-24 "no separate org" decision stands. The hub only needs two facts: the account's email and the temporary personal repos.

## Revisit when

- You create a personal GitHub account (run the how-to).
- The Chief is about to get access to `jrmaadmin-creator` (G-07).
- A personal project needs to hold something you wouldn't want JRMA administrators to see.
