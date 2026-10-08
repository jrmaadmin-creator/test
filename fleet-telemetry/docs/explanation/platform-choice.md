# Platform choice: iPhone web app or native Android app

Recommendation (10/08/2026, not yet decided by the owner): switch to a native Android app built with Expo and skip the web stage. Android removes the three iPhone limits that shaped ADR 0001 and ADR 0004: screen-off recording, Bluetooth OBD-II, and Mac/TestFlight overhead.

## Cost

| Item | Cost | Notes |
|---|---|---|
| Tools (Android Studio, Expo, Node) | $0 | Builds on any computer; no Mac |
| Expo cloud builds | $0 for 15 Android builds/month | Low-priority queue, waits of 90+ min at peak; Starter plan $19/mo ([Expo pricing][expo]) |
| Install on up to 20 specific phones (Limited Distribution account) | $0, no government ID | ([Android verification FAQ][faq]) |
| Full Distribution account | $25 once + ID verification | ([Android verification FAQ][faq]) |
| Google Play Store | $25 once | Personal accounts made after 11/13/2023 must run a 12-tester, 14-day closed test first ([third-party summary][play]) |
| Apple, for comparison | $99/yr | Plus a Mac or Expo cloud; TestFlight builds expire after 90 days |

Verification enforcement began 9/30/2026 only for participating stores in select regions; sideloaded apps are not affected until the global rollout in 2027; ADB installs and managed-device installs are exempt ([FAQ][faq]).

## What Android changes

| Limit | iPhone | Android |
|---|---|---|
| Screen-off recording | Native app only, $99/yr | Native app, foreground service with a notification, $0 |
| OBD-II engine data | BLE adapters only, native app | BLE or classic Bluetooth adapters |
| App updates | TestFlight, 90-day expiry | Install a new APK; no expiry |
| Build without a Mac | Expo cloud only | Any computer |

**Downsides:** some brands close background apps to save battery (turn battery optimization off for the app; test the model first). GPS and sensor quality vary by model (buy one model for all rigs). Installing outside the Play Store needs "install unknown apps" turned on once. Verification rules tighten in 2027.

## If the owner picks Android

| Item | Change |
|---|---|
| `core/`, thresholds, rig-mode privacy, GPS events (ADR 0002, 0003) | Unchanged |
| ADR 0001 (web first) and ADR 0004 (Netlify) | Superseded by a new ADR: native Android app (Expo), APK install |
| Spec sections 3 and 11 | Rewritten: screen-off recording in v1, iOS 18.4 requirement dropped |
| Engine data | Can move into v2 |

[faq]: https://developer.android.com/developer-verification/guides/faq
[expo]: https://expo.dev/pricing
[play]: https://afkarsoftware.com/en/blog-detail/google-play-closed-testing-12-testers-14-days-2026/
