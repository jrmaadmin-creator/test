# Fleet Telemetry Recorder: design (web stage)

- Date: 2026-10-08
- Status: design approved in chat 10/08/2026 (sections 1 to 4); this written spec awaits owner review
- Decisions: `docs/adr/0001` to `0004`

## 1. Intent

| | |
|---|---|
| End goal (owner) | JRMA fleet and crew driving monitoring |
| This spec | Piece 1 only: an in-rig recorder on one dedicated iPhone, tested on the owner's own driving |
| Phone | iPhone, one dedicated agency phone per rig, mounted and plugged in |
| Owner constraints | No Mac. Separate repo. No PHI anywhere. Anything for command marked "DRAFT, pending legal review" |
| Test vehicle | A JRMA rig, only after the Chief's written OK (logged in the owner's liability log 10/08/2026) |

**Assumptions (not stated by the owner):** the owner is the only driver recorded in this stage; no crew data is collected until command approves a policy; one phone serves one rig.

**Success criteria for this stage:**

1. A trip starts and ends with no touches during a drive.
2. Each hard maneuver the driver felt during a test drive shows as an event, and a calm drive shows none or close to none.
3. Trip distance is within 5% of the rig's odometer for the same trip.
4. A rig-mode export contains no location data.
5. The app survives a page reload mid-trip without losing more than 10 s of data.

## 2. The whole project and where this spec fits

| # | Piece | Status |
|---|---|---|
| 0 | Approval packet for the Chief (purpose, data kept, who sees it, retention, crew notice, build vs buy) | Not started |
| 1 | In-rig recorder | **This spec (web stage)** |
| 2 | Engine data over Bluetooth OBD-II | Native stage; needs rig chassis details |
| 3 | Upload and fleet dashboard | Needs a server, logins, security review |

## 3. Scope

| In v1 | Not in v1 |
|---|---|
| GPS speed (about once per second) and motion sensors while the app is open | Screen-off recording (native stage) |
| Automatic trip start and end | Engine data (native stage) |
| Hard brake, hard acceleration, hard cornering events | Upload, fleet dashboard (piece 3) |
| Trip list, trip detail (speed chart with event markers), summary | Posted speed limits, map backgrounds (need internet) |
| CSV export through the iPhone share sheet | Lights-and-siren status (needs wiring) |
| Screen kept awake; no touches needed while driving | Driver logins (the rig is the identity) |
| Rig mode (no location) and personal mode (trimmed track) | Notes or any free-text field |

## 4. Architecture

```
fleet-telemetry/
  core/       pure logic, no browser APIs; reused by the native app
    units.js      mph, m/s, g, mph/s, miles conversions
    privacy.js    sanitize(fix, mode): drops location in rig mode
    trip.js       TripDetector: idle -> moving -> stopping -> ended
    events.js     EventDetector: brake, accel, corner from GPS fixes
    summary.js    trip summary from samples and events
    export.js     CSV text for trips, samples, events
    thresholds.js threshold set with version and sources
  web/        phone shell
    sensors.js    watchPosition, devicemotion, permission prompts
    wakelock.js   screen wake lock with fallback warning
    store.js      IndexedDB: trips, samples, events; persist() request
    app.js        screens and wiring
  scripts/    build.mjs, check.mjs (runs all tests), sim.mjs (simulated drives)
  docs/       adr/, status.md, how-to/, reference/, explanation/, tutorials/
  dist/       built site: index.html, manifest, service worker, icon
```

**Data flow:** sensors -> `privacy.sanitize` -> `TripDetector` and `EventDetector` -> `store` (every 10 s) -> screens and `export`.

`core/` takes plain objects in and returns plain objects out. It never reads the clock, storage or sensors itself, so the simulated drives in `scripts/sim.mjs` exercise exactly the code that runs in the rig.

## 5. Data model

All times are milliseconds since the trip start, except `startedAt` and `endedAt` (ISO 8601 local time).

| Record | Fields |
|---|---|
| Trip | `id` (random), `vehicle` (picked from a short list set in Settings, e.g. "Rig 1"), `mode` (`rig` or `personal`), `startedAt`, `endedAt`, `endReason` (`stopped`, `manual`, `interrupted`), `appVersion`, `thresholdsVersion`, `summary` |
| Sample (1 per second) | `t`, `speedMph`, `accuracyFt`, `joltG`; personal mode adds `lat`, `lon` |
| Event | `t`, `type` (`brake`, `accel`, `corner`), `peakG`, `durationS`, `speedMph` |
| Summary | `distanceMi`, `durationMin`, `movingMin`, `idleMin`, `topSpeedMph`, `minutesOverMph` (setting, default 65), `events` (count per type), `maxJoltG` |

Size estimate: about 30 bytes per sample, about 110 KB per hour of driving. A year of daily 2-hour use is about 80 MB, which fits iPhone browser storage. That is an estimate, not a measured figure; storage use is shown in Settings.

## 6. Trip detection (design defaults, tuned in field tests)

| Rule | Value |
|---|---|
| Moving | GPS speed at or above 5 mph |
| Stopped | GPS speed below 2 mph (GPS reports small speeds when parked) |
| Trip starts | Moving for 10 s in a row; the trip start is set back to the first moving fix |
| Trip ends | Stopped for 3 min in a row; the trip end is set back to the first stopped fix |
| Idle time | Stopped time inside a trip |
| Manual override | Start and Stop buttons, for testing and for the end of a shift |

These are design choices, not published standards.

## 7. Event detection

- **Forward acceleration** = (speed now - speed 1 s ago) / time between fixes. Negative = braking.
- **Lateral acceleration** = speed x heading change rate (radians per second). Only computed at or above 10 mph.
- An event starts when a value crosses its threshold and ends when it drops back. It is stored once, with its peak and duration. A new event of the same type needs 3 s of gap.
- Fixes are skipped for event detection when horizontal accuracy is worse than 65 ft (20 m), when the gap from the previous fix is over 5 s, or when the computed value is above 1.0 g (treated as a GPS glitch, since a loaded ambulance cannot brake that hard). These limits are design choices.
- **Motion sensors:** `joltG` = the largest change in acceleration magnitude within each second, from `devicemotion`. Shown on the chart only.

### Starting thresholds

PENDING SOURCED VALUES. Filled from the research report before this spec is committed. Each value will name its source and link.

## 8. Screens

| Screen | Contents |
|---|---|
| Record (home) | Status in large type: "Waiting for movement", "Recording 00:12:34" or "Saving trip". Current speed. GPS accuracy (good, fair, poor). Event count this trip. Start and Stop buttons. Mode and vehicle shown at the top |
| Trips | Newest first: date, start time, duration, distance, event counts |
| Trip detail | Summary tiles. Speed-over-time line chart with event markers (color and letter per type) and a jolt band under it. Export button. Personal mode adds a route sketch (no map tiles) |
| Settings | Vehicle, mode (switching to personal needs a confirmation naming the risk), "minutes over" speed, thresholds shown with sources (read-only), storage used, export all, delete all trips (named confirmation) |

The Record screen is built to be read at a glance and needs no touches while driving.

## 9. Error handling

| Situation | Behavior |
|---|---|
| Location permission denied | Record screen explains how to allow it in iPhone Settings |
| Motion permission denied | Recording continues; jolt band empty; one-line notice |
| Poor GPS accuracy | Accuracy indicator shows "poor"; those fixes are not used for events |
| GPS gap over 5 s | No acceleration computed across the gap; distance uses the last known speed for at most 5 s |
| Wake lock not available | Banner: "Screen may lock. Recording stops if it does." |
| Page reload or crash mid-trip | Data saved every 10 s. On reopen, the open trip is closed with `endReason: interrupted` |
| Storage | Calls `navigator.storage.persist()`. Reminds the user to export after 7 days without an export |

## 10. Security and privacy

- No network requests after the page loads. No analytics. A content security policy in the page blocks outside requests.
- Data leaves the phone only through a user-started export.
- Rig mode drops location before storage (ADR 0002). A test enforces it.
- No notes or free-text fields, so no patient details can be typed in.

## 11. Hosting and install

Netlify static site (ADR 0004). Each deploy needs the owner's OK. Install: open the URL in Safari, Share > Add to Home Screen, allow location and motion on first Start.

## 12. Testing

1. **Automated (`npm run check`):** simulated drives from `scripts/sim.mjs` (pull out, cruise, hard brake, sharp turn, red light under 3 min, park over 3 min, GPS gap, GPS glitch). Assertions: trip start and end times, event count and type per scenario, distance within 1% of the simulated distance, no location keys in rig-mode records, CSV columns.
2. **Browser:** Playwright in the cloud session feeds a simulated drive through geolocation overrides and checks the screens and the export.
3. **Field:** `docs/how-to/field-test.md` checklist: mount out of direct sun, plugged in, Guided Access on, compare distance with the odometer, note each hard maneuver for comparison.

## 13. Native stage (outline only, separate spec later)

Expo app reusing `core/`. Background location for screen-off recording. Bluetooth Low Energy OBD-II adapter for RPM, idle with engine on, and fault codes, if the rig chassis exposes them. Needs the $99/yr Apple developer account and TestFlight.

## 14. Open questions

| Question | For |
|---|---|
| May a dedicated iPhone be mounted in a rig to test the recorder on the owner's own driving? | Chief (drafted, see `docs/status.md`) |
| Are time-stamped speed and event records with no location PHI, or records that must be kept or produced after a crash? Retention period? | Legal review |
| Rig chassis make, model, year, weight class | Owner (needed for the native stage) |
| Netlify account to use | Owner |
