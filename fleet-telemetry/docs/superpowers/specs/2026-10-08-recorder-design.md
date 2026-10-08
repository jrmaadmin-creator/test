# Fleet Telemetry Recorder: design (web stage)

- Date: 2026-10-08
- Status: design approved in chat 10/08/2026 (sections 1 to 4); written spec with sourced thresholds awaits owner review
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
| GPS speed and motion sensors while the app is open and on screen | Screen-off recording (native stage) |
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
| Trip | `id` (random), `vehicle` (picked from a short list set in Settings, e.g. "Rig 1"), `vehicleClass` (`class3`, `class4`, `class5`, `car`; selects the threshold set), `mode` (`rig` or `personal`), `startedAt`, `endedAt`, `endReason` (`stopped`, `manual`, `interrupted`), `appVersion`, `thresholdsVersion`, `summary` |
| Sample (one per second of trip time; the latest GPS fix in that second) | `t`, `speedMph`, `accuracyFt`, `joltG`; personal mode adds `lat`, `lon` |
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
| Arming | "Start shift" (one tap before driving) grants motion access, keeps the screen awake and starts GPS. Trips then start and end on their own. "End shift" stops watching |
| Manual override | "End trip" closes the current trip early (`endReason: manual`), for testing |

These are design choices, not published standards.

## 7. Event detection

- **Forward acceleration** = (speed now - speed at the previous fix) / time between the two fixes. Negative = braking. The phone sets the GPS update rate (the web standard leaves it to the device), so the math uses the actual time between fixes and the field test measures the rate.
- **Lateral acceleration** = speed x heading change rate (radians per second). Only computed at or above 10 mph.
- An event starts when a value crosses its threshold and ends when it drops back. It is stored once, with its peak and duration. A new event of the same type needs 3 s of gap.
- Fixes are skipped for event detection when horizontal accuracy is worse than 65 ft (20 m), when the gap from the previous fix is over 5 s, or when the computed value is above 1.0 g (treated as a GPS glitch). These limits are design choices; 1.0 g sits above every published threshold and research trigger in the tables below.
- **Motion sensors:** `joltG` = the largest change in acceleration magnitude within each second, from `devicemotion`. Shown on the chart only.

### Starting thresholds (threshold set v1)

Recommendation: use GPS Insight's published starting points by gross vehicle weight rating (GVWR) class. It is the only published set keyed to vehicle weight, and GPS Insight calls the values "a starting point". The rig's class is picked once in Settings from the GVWR on the driver's door label. Personal mode uses Geotab's Car default.

| Vehicle class (Settings) | Brake | Accelerate | Corner | Source |
|---|---|---|---|---|
| Class 3 (10,001 to 14,000 lb GVWR) | 0.34 g (7.46 mph/s) | 0.33 g (7.24 mph/s) | 0.33 g (7.24 mph/s) | [GPS Insight][gpsi] |
| Class 4 (14,001 to 16,000 lb) | 0.31 g (6.80 mph/s) | 0.30 g (6.58 mph/s) | 0.30 g (6.58 mph/s) | [GPS Insight][gpsi] |
| Class 5 (16,001 to 19,500 lb) | 0.29 g (6.36 mph/s) | 0.28 g (6.14 mph/s) | 0.28 g (6.14 mph/s) | [GPS Insight][gpsi] |
| Car (personal mode) | 0.61 g (13.38 mph/s) | 0.43 g (9.43 mph/s) | 0.47 g (10.31 mph/s) | [Geotab][geotab] |

1 g = 21.94 mph/s.

**Other published values, for comparison (not used):**

| Source | Brake | Accelerate | Corner | Note |
|---|---|---|---|---|
| [Motive][motive] Medium Duty default | 0.38 g | 0.41 g | 0.42 g | One class for all medium-duty trucks |
| [Geotab][geotab] Truck/Cube Van default | 0.54 g | 0.34 g | 0.40 g | |
| [SHRP2 study][shrp2] event triggers | 0.65 g | 0.50 g | 0.75 g | Near-crash research triggers in passenger vehicles, not harsh-driving alerts |
| [100-Car study][car100] event triggers | 0.6 g | 0.6 g | 0.7 g | Same |

**Limits of these sources:**

- No published ambulance or patient-compartment threshold was found (ZOLL RescueNet Road Safety, NHTSA and EMS.gov checked). One ambulance study ([Kurz 2012][kurz]) reports a critical acceleration threshold exceeded 60% of transport time, but the value is not in the abstract.
- Vendor values are set for their own in-vehicle hardware. A speed change measured between GPS fixes averages over the time between fixes, so the same threshold may flag fewer events here. This is reasoning, not a measured result; the field test checks it.
- Tuned values become threshold set v2 and are recorded on each trip.

## 8. Screens

| Screen | Contents |
|---|---|
| Record (home) | Status in large type: "Waiting for movement", "Recording 00:12:34" or "Saving trip". Current speed. GPS accuracy (good, fair, poor). Event count this trip. "Start shift" / "End shift" and "End trip" buttons. Mode and vehicle shown at the top |
| Trips | Newest first: date, start time, duration, distance, event counts |
| Trip detail | Summary tiles. Speed-over-time line chart with event markers (color and letter per type) and a jolt band under it. Export button. Personal mode adds a route sketch (no map tiles) |
| Settings | Vehicle, vehicle class (from the door-label GVWR), mode (switching to personal needs a confirmation naming the risk), "minutes over" speed, thresholds shown with sources (read-only), storage used, export all, delete all trips (named confirmation) |

The Record screen is built to be read at a glance and needs no touches while driving.

## 9. Error handling

| Situation | Behavior |
|---|---|
| Location permission denied | Record screen explains how to allow it in iPhone Settings |
| Motion permission denied | Recording continues; jolt band empty; one-line notice |
| Poor GPS accuracy | Accuracy indicator shows "poor"; those fixes are not used for events |
| GPS gap over 5 s | No acceleration computed across the gap; distance uses the last known speed for at most 5 s |
| Wake lock not available (iOS older than 18.4 in a Home Screen app) | Banner: "Screen may lock. Recording stops if it does." |
| Page hidden (screen locked, another app opened) | GPS updates stop. The wake lock is requested again when the page is visible. A gap over 5 s is handled as a GPS gap; hidden for 3 min or more ends the trip with `endReason: interrupted` |
| Page reload or crash mid-trip | Data saved every 10 s. On reopen, the open trip is closed with `endReason: interrupted` |
| Storage | Calls `navigator.storage.persist()`. Reminds the user to export after 7 days without an export |

## 10. Security and privacy

- No network requests after the page loads. No analytics. A content security policy in the page blocks outside requests.
- Data leaves the phone only through a user-started export.
- Rig mode drops location before storage (ADR 0002). A test enforces it.
- No notes or free-text fields, so no patient details can be typed in.

## 11. Hosting, install and platform limits

Netlify static site (ADR 0004). Each deploy needs the owner's OK. Install: open the URL in Safari, Share > Add to Home Screen. Open the app at shift start and tap "Start shift" once, before driving (section 6).

| Platform fact | Design response | Source |
|---|---|---|
| Screen wake lock works in Home Screen web apps from iOS 18.4 | The rig phone must run iOS 18.4 or later | [WebKit 18.4][wk184] |
| A wake lock is released when the page is hidden | Request it again on every return to visible | [MDN Wake Lock][mdnwake] |
| Location updates go only to visible pages | Screen stays on; Guided Access keeps the app in front | [W3C Geolocation][w3cgeo] |
| Location needs https | Netlify hosting | [MDN watchPosition][mdnwatch] |
| Motion access must be requested from a tap | Requested on the "Start shift" tap | [MDN requestPermission][mdnmotion] |
| Motion events arrive about 60 times per second | `joltG` is the largest change within each second's samples | [WebKit source][wkmotion] |
| Home Screen web apps are not expected to lose data under the 7-day rule | Install to the Home Screen; weekly export reminder anyway | [WebKit 2020][wk7day] |
| Storage up to 60% of disk per site (iOS 17+) | Years of trips fit | [WebKit 2023][wkquota] |
| Sharing a file needs a tap; support for files arrived behind a flag in iOS 14 | Export uses the share sheet; falls back to a download link | [MDN share][mdnshare], [WebKit bug 217091][wkshare] |
| Phone GPS is accurate to about 16 ft under open sky | Fixes worse than 65 ft are not used for events | [GPS.gov][gpsgov] |
| Heading is empty when stationary and unreliable at very low speed | Cornering checked only at or above 10 mph (design choice) | [W3C Geolocation][w3cgeo] |

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
| GVWR from each rig's door label (picks the threshold set) | Owner |
| Rig chassis make, model, year | Owner (needed for the native stage) |
| iOS version on the dedicated phone (must be 18.4 or later) | Owner |
| Netlify account to use | Owner |

## Sources

All opened 10/08/2026.

[gpsi]: https://help.gpsinsight.com/best-practice/defining-thresholds-for-your-fleet/
[geotab]: https://support.geotab.com/help/mygeotab/reports/safety-reports/aggressive-driving-report
[motive]: https://helpcenter.gomotive.com/hc/en-us/articles/14972995725213
[shrp2]: https://vtechworks.lib.vt.edu/handle/10919/70850
[car100]: https://rosap.ntl.bts.gov/view/dot/37370/dot_37370_DS1.pdf
[kurz]: https://pubmed.ncbi.nlm.nih.gov/22306258/
[wk184]: https://webkit.org/blog/16574/webkit-features-in-safari-18-4/
[mdnwake]: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
[w3cgeo]: https://www.w3.org/TR/geolocation/
[mdnwatch]: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
[mdnmotion]: https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/requestPermission_static
[wkmotion]: https://github.com/WebKit/WebKit/blob/main/Source/WebCore/platform/ios/WebCoreMotionManager.h
[wk7day]: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
[wkquota]: https://webkit.org/blog/14403/updates-to-storage-policy/
[mdnshare]: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
[wkshare]: https://bugs.webkit.org/show_bug.cgi?id=217091
[gpsgov]: https://www.gps.gov/gps-accuracy

| Ref | Title |
|---|---|
| [GPS Insight][gpsi] | Defining Thresholds for Your Fleet |
| [Geotab][geotab] | Aggressive Driving report |
| [Motive][motive] | Motive Help Center, harsh event thresholds |
| [SHRP2][shrp2] | Hankey et al. 2016, SHRP2 naturalistic driving study, Table 2.1 |
| [100-Car][car100] | DOT HS 810 593 (2006), Table 2.3 |
| [Kurz 2012][kurz] | Resuscitation, ambulance acceleration during transport |
| [GPS.gov][gpsgov] | GPS accuracy |
