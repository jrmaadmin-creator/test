# The Legend of JRMA

An over-the-top EMS training RPG for JRMA crews. Walk a Zelda-style overworld, take calls, and beat the condition "monsters" by choosing the right interventions in the right order. Each license level ends with a boss call and a protocol trial. Pass the trial to level up: EMT, then AEMT, then Paramedic, then Legend.

Content is checked against the **New Hampshire Patient Care Protocols v9.3** (effective 2025-11-07). Every call and trial question cites its NH section; where NH is silent, it says so and names the national source. See `docs/reference/call-content.md`. It is a training aid, not a protocol. The NH PCP and your medical director have the final word.

## Play

- **Easiest:** open `dist/legend-of-jrma.html`. It is one self-contained file: email it, text it, or put it on a USB stick. Rebuild it with `npm run bundle` after any change.
- **From the repo:** open `index.html` in any modern browser.
- **Phones:** an on-screen D-pad and A/B buttons appear on touch screens.

| Control | Keyboard | Touch |
|---|---|---|
| Move | Arrow keys or WASD | D-pad |
| Talk, open chests, read signs | Space, Enter, or Z | A |
| Pick an action in a call | Click, or keys 1-9 | Tap |
| CPR and tourniquet mini-games | Space | Tap the big button |

Progress saves in the browser on that device.

## Levels

| Level | Monsters (conditions) | Boss | Trial reward |
|---|---|---|---|
| 1. EMT | Arterial hemorrhage, opioid overdose, hypoglycemia, anaphylaxis, behavioral crisis (stage for PD) | Cardiac arrest, BLS ("The Porcelain Throne") | AEMT license |
| 2. AEMT | Severe hypoglycemia (IV dextrose), severe asthma | Rollover, multi-system trauma, helicopter to UMass Memorial ("The Polytrauma Hydra") | Paramedic license |
| 3. Paramedic | Inferior STEMI with RV involvement, symptomatic bradycardia | VF cardiac arrest, ACLS ("The Porcelain Throne, Ascended") | Legend of JRMA |

Also in the world: 8 clinical pearls hidden in chests, a goose, and a ghost who still loosens tourniquets.

## Places and people

- **Places are real Jaffrey spots:** Mount Monadnock, the Jaffrey Center Meetinghouse and Common, downtown, Route 202 north, and Route 124 (Turnpike Road) toward the airport.
- **Homes and businesses are fictional,** for example Gas-n-Go and the Hendersons. They sit on real roads so that no real household or business is tied to an overdose, a psych call, or a death.
- **Officers play the recurring roles:** the Chief, your partner/FTO, and the Training Officer who runs the trials. They are set in `content/crew.js`; see `docs/how-to/add-officers.md`. Until the roster is filled in, fictional stand-ins hold those slots.

## Project layout

```
index.html              game engine (canvas overworld, call and trial panels)
content/calls.js        levels, calls, clinical pearls
content/exams.js        protocol trial question banks
tests/smoke.mjs         content checks + full playthrough in Chromium
tools/bundle.mjs        builds the one-file version in dist/
docs/                   how-to, reference, explanation, ADRs (Diataxis)
```

## Develop

```
npm install      # Playwright for the smoke test
npm test         # validate content and play every call and trial
npm run bundle   # build dist/legend-of-jrma.html
```

See `docs/how-to/add-a-call.md` and `docs/how-to/update-for-new-nh-protocols.md`.

## Credits and notices

- Protocol content: State of New Hampshire Patient Care Protocols v9.3, NH Bureau of EMS. The protocols may be reproduced and distributed free to NH EMS providers.
- A parody of classic top-down adventure games. Not affiliated with or endorsed by Nintendo.
- All characters are fictional.
