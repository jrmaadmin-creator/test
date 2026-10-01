# ADR 0001: Validate demand before building the full app

- Status: Proposed
- Date: 2026-10-01

## Context

Dating apps depend on local user density. A new app with few profiles per area loses users on first open. The full app (matching, chat, verification, moderation) is expensive to build and operate.

## Decision

Before building the full app, ship a landing page with a waitlist and a clickable prototype. Target one region. Proceed to an MVP build once the waitlist reaches a few hundred signups in that region.

## Consequences

- Pro: Low cost test of demand and messaging; waitlist becomes the launch user base.
- Pro: Prototype feedback shapes features before code is written.
- Con: Delays a working product.
- Con: Waitlist signups overstate real usage; conversion will be lower.
