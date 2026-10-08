# ADR 0002: Rig mode stores no location

- Status: Accepted
- Date: 2026-10-08

## Context

A GPS track of an ambulance trip shows where a patient was picked up and taken, with a date and time. That is protected health information (PHI). Trimming a distance around each stop is weak in rural towns (few homes near any one road), and a stored speed-plus-heading series can be used to rebuild a route from a known start point such as the station.

## Decision

Two modes:

| Mode | Stored | Never stored |
|---|---|---|
| Rig (default) | Speed per second, motion jolt per second, events (type, time, peak, speed), trip summary | Latitude, longitude, heading, altitude |
| Personal (opt-in, personal vehicle only) | Rig fields plus position, with 0.25 mi removed at the trip start, the trip end and every stop of 60 s or longer | Nothing extra |

The privacy filter in `core/privacy.js` runs before anything is written to storage. In rig mode it drops location fields from each fix; it does not trim them later.

## Consequences

- Rig trips have no route map and no GPX export.
- Distance in rig mode comes from integrating speed over time, not from positions.
- A test asserts that a stored rig-mode record has no location keys.
- Open question for legal review: whether time-stamped speed records with no location are PHI or discoverable records, and how long to keep them.
