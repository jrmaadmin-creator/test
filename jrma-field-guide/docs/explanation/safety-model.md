# Explanation: how the app stays safe to use

**The app is a checklist and scribe, not a decision-maker.** Aviation and surgery use checklists because skilled people under stress skip steps. The app's job is to make skipped steps visible and to write the report, not to replace protocol knowledge.

## Design choices
- **Unverified banner on every protocol** until each is checked against the NH PDF with a page citation. The validator refuses `verified: true` without one.
- **VERIFY boxes** on every dose or threshold not copied from the NH text.
- **"Consider" list is a tally, not a diagnosis.** It counts which answers point at which conditions. It has no probabilities and no hidden logic, so you can see why it says what it says.
- **Missed-step check follows your path.** If the patient is allergic to aspirin, aspirin is not flagged as missed.
- **No identifiers.** Age and sex only. Data stays on the phone and is erased with *End call*. A lost phone exposes no names.
- **Offline first.** Service worker caches every file; rural NH coverage gaps do not break it.
- **Cardiac arrest is not a flow.** During CPR the phone goes down. The app sends you to the NH arrest protocol.

## Limits
- Pediatric vitals are not flagged (age-band ranges not loaded).
- Agency approval: check JRMA policy on personal devices during patient care, and consider showing your medical director.
