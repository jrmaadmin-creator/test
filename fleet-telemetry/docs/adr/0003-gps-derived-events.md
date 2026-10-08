# ADR 0003: Events come from GPS; motion sensors record jolt only

- Status: Accepted
- Date: 2026-10-08

## Context

Hard braking, hard acceleration and hard cornering can be measured from the phone's motion sensors or from GPS. Motion-sensor axes depend on how the phone is mounted, and the mount angle varies between rigs and over time. GPS speed and heading do not depend on mounting.

## Decision

- Forward events (brake, accelerate): change in GPS speed over consecutive 1-second fixes.
- Cornering events: lateral acceleration = speed x heading change rate, only above 10 mph, where GPS heading is reliable.
- Motion sensors: store the largest jolt in each second (bumps, rough ride) for the chart. No events from motion sensors in v1.
- Thresholds start at cited published values (see the design spec) and are tuned after field tests. Each trip records the threshold set version it used.

## Consequences

- Works with any mount angle and no calibration step.
- GPS updates about once per second, so very short spikes are smoothed out. Events are hard maneuvers lasting a second or more.
- Fixes with poor accuracy or a gap longer than 5 s are not used for events.
- Motion-sensor events can be added later with a mount-calibration step.
