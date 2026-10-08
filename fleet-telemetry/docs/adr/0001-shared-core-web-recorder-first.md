# ADR 0001: Shared core, web recorder first, native app later

- Status: Accepted
- Date: 2026-10-08

## Context

The end goal is fleet driving monitoring for JRMA on one dedicated iPhone per rig, with screen-off recording and engine (OBD-II) data. The owner has no Mac. A native iPhone app without a Mac means cloud builds (Expo) and TestFlight installs for every change, a $99/yr Apple developer account, and builds that expire after 90 days. Nobody has yet confirmed the data is useful.

## Decision

Split the code into `core/` (pure logic: trip detection, event detection, privacy filter, summaries, export) and `web/` (sensors, storage, screens). Build the web recorder first. The native stage (Expo) reuses `core/` unchanged and adds screen-off recording and OBD-II.

## Consequences

- $0 until the native stage. A change reaches the phone on reload.
- The web stage needs the app open and the screen on. A plugged-in, mounted, dedicated phone makes that acceptable.
- No engine data until the native stage.
- `core/` must stay free of browser APIs so it runs in Node tests and in React Native.
- The web screens are throwaway once the native app exists.
