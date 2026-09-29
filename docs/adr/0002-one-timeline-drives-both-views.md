# ADR 0002: One beat timeline drives the 3D heart and the strip

- Status: Accepted
- Date: 2026-09-29

## Context

The teaching value is the link between what the conduction system does and what the strip shows. If the 3D animation and the waveform were built separately, they would drift and teach the wrong timing (for example a QRS drawn before the impulse leaves the His bundle).

## Decision

Each rhythm generator emits beats. A beat records, on one clock:

- `acts`: which conduction segments fire, when, in which direction, and whether they are blocked
- `chambers`: when each chamber depolarizes and repolarizes
- `comps`: the ECG wave components that activity produces
- `labels`, `intervals`, `captions`: teaching overlays

The 3D view and the strip both read the same beats at the same simulation time. Slow motion scales that one clock.

A script (`npm run check`) generates 60 seconds of every rhythm and fails if rate, atrial rate, PR, QRS width or regularity fall outside the rhythm's `expect` ranges, which mirror its printed criteria.

## Consequences

- Timing is correct by construction: a PR interval in the strip is the same number as the AV node delay in 3D.
- New rhythms are added in one place (`src/js/rhythms.js`).
- Waveforms are synthesized from Gaussian components, so they are idealized rather than recorded.

## Alternatives considered

- Recorded ECG samples (e.g. PhysioNet): realistic but cannot be synchronized to a 3D model or slowed down per event, and licensing varies per database.
- An imported anatomical heart mesh: better anatomy, but large, licensing-dependent, and it hides the conduction system. The procedural glass heart keeps the pathway visible. Revisit if anatomical realism becomes the priority.
