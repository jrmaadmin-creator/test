# Sober Dating App: Product Brief

Status: Draft. Open questions below must be answered before any build work starts.

## Recommendation

Validate demand before building the full app. Dating apps fail without local user density. Start with a landing page, a waitlist, and a clickable prototype. Build once one region has a few hundred signups.

## Key risks

| Risk | Why it matters for sober dating | Mitigation |
|---|---|---|
| Cold start / density | App is useless below a local user threshold | Launch in one region first (e.g., Greater Boston + southern NH) |
| Predatory behavior | "13th stepping" (targeting newcomers in recovery) is a known problem | Minimum sobriety-time filters, option to hide sobriety date, fast block/report |
| Privacy of recovery status | Recovery status is health-adjacent data; some states regulate it (e.g., Washington My Health My Data Act) | Collect minimum data, encrypt sensitive fields, legal review before launch |
| Competition | Loosid offers sober social + dating; Hinge and Bumble offer drinking-habit filters | Pick a differentiated angle |
| Trust and safety | Scams, harassment, catfishing | Photo verification, reporting, moderation plan from day one |
| App store review | Apple and Google apply stricter rules to dating and user-generated content | Blocking, reporting, and published terms are required |

## Possible differentiators

- Alcohol-free date ideas built in (coffee, hikes, dive shops instead of bars).
- Recovery-aware matching: recovery path (12-step, SMART, secular, sober-curious) and sobriety length, with user-controlled visibility.
- Niche-first launch: sober first responders and healthcare workers, then expand.

## Suggested stack (after validation)

| Layer | Choice | Reason |
|---|---|---|
| Mobile app | React Native + Expo | One codebase for iOS and Android |
| Backend | Supabase (Postgres, auth, storage, realtime chat) | Low ops burden; row-level security for sensitive data |
| Photo verification | Third-party service | Building in-house is slow and risky |
| Docs | ADR per major decision, Diataxis structure, lean nested CLAUDE.md | Matches owner's preferred setup |

## Open questions

1. Goal: business, community side project, or learning to code?
2. First target user: all sober people, 12-step, sober-curious, or a niche like first responders?
3. Owner's technical background and weekly hours available?
4. Budget for legal review, hosting, and verification tools?
5. Should this live in its own repository instead of `test`?

## Perspectives to consider

1. Would a sober social app (friends, events) with dating added later reach density faster than dating-only?
2. Could treatment centers, sober living homes, or recovery groups act as acquisition partners?
3. How will the founder protect their own recovery while handling moderation and relapse-related content?
