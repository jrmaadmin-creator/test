# ADR-001: JRMA's GitHub becomes an organization; personal projects move to a personal account

Type: decision record. Status: superseded 2026-09-29 by `adr-002-one-github-account-for-now.md` (you chose one account for now). Kept as the reference if the organization question comes back. Owner: you. Steps: `how-to-split-work-and-personal-github.md`.

## Context

- `jrmaadmin-creator` is a GitHub personal account. The hub records it as the JRMA account (`governance/accounts-and-ownership.md`, GitHub row; hub ARD 2026-09-24).
- The hub rule for every vendor account: the Chief owns it, the Lieutenant administers it, it has two administrators, two-factor is on, and no personal email is used (hub ARD 2026-09-24; G-07).
- A GitHub personal account has one login and cannot have two owners. The only way the Chief becomes its "second owner" is by sharing its password and two-factor device, which is what the rule is meant to prevent.
- GitHub's Terms of Service, section B.3: "One person or legal entity may maintain no more than one free Account." Holding `jrmaadmin-creator` plus a personal account means one person holds two free accounts.
- You want a separate space for personal projects.
- The hub first planned a JRMA GitHub organization (Bay Board ADR-001; G-07). The Hub chat dropped it on 2026-09-24 because that session could not create repositories, not because an organization was the wrong design.
- Continuity: HUB-L02 (the agency's system of record sits in a personal account) scores Orange. The `jrma-ops` mirror is the Chief's restore path, and today the Chief cannot reach it without your login.

## Decision

1. Convert `jrmaadmin-creator` into a free GitHub organization. Repository addresses do not change.
2. Owners: your new personal GitHub account and the Chief's GitHub account, both with two-factor on.
3. Personal projects live on your personal account only. JRMA work lives in the organization only.
4. The organization keeps its name until the Rename workstream sets the 2027 name.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep everything on `jrmaadmin-creator` and add personal repos there | Mixes JRMA and personal work; anyone who recovers the account for JRMA also gets your personal work; still one login |
| Keep `jrmaadmin-creator` as a shared login and add a personal account | One person holds two free accounts, against GitHub's terms; shared password and two-factor device; no named administrators |
| Create a new organization with a new name, transfer `jrma-ops`, delete `jrmaadmin-creator` | Same end state with more steps; repository addresses change (GitHub redirects them); worth it only if you want the 2027 name now |

## Consequences

- You create a personal GitHub account first. Nobody can sign in as `jrmaadmin-creator` afterward.
- Claude's GitHub connection moves to your personal account, and the Claude GitHub App is installed on the organization.
- Commits made as `jrmaadmin-creator` no longer link to an account. The content and history are unchanged.
- Hub docs that say "no separate org" or name the dropped org `jrma-ops` need updates by their writers (list in `README.md`, For the hub).
- Conversion cannot be undone.
- Cost: $0.

## Open items

- The Chief creates a GitHub account (question drafted in `README.md`, For the hub).
- The organization's name at the 2027 rename (Rename workstream).

## Sources

- GitHub Terms of Service, B.3 Account Requirements: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service
- Converting a user into an organization: https://github.com/github/docs/blob/main/content/account-and-profile/how-tos/account-management/converting-a-user-into-an-organization.md
