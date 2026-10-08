# Reference: protocol file schema

```js
export default {
  id: 'chest-pain',            // unique, kebab-case
  title: 'Chest Pain / Suspected ACS',
  category: 'Medical',         // Assessment | Medical | Trauma | Cardiac
  nh: '9.3',                   // set when built from NH text; turns on cite + level checks
  verified: false,             // true only after the owner checks it against the NH book
  source: { doc: 'NH Patient Care Protocols v9.3', section: '3.0', page: 'PDF p. 71' },
  keywords: ['chest', ...],    // matched against the chief complaint
  start: 'onset',              // first node id
  nodes: { <id>: Node, ... },
}
```

## Node types

| type | Fields | Buttons |
|---|---|---|
| `question` | `text`, `ask` (words to say), `help`, `answers[]`, optional `next` default | one per answer |
| `action` | `text`, `detail`, `dose`, `verify`, `critical`, `report` (report wording), `level`, `next` | Done / Not done / Contraindicated (or "Above my level" when `level` is above the user's) |
| `info` | `text`, `items[]`, `verify`, `next` | Continue |

Every node in an `nh` protocol has `cite`: protocol number and page, e.g. `"3.0, PDF p. 71"`.
Every action has `level`: `EMR`, `EMT`, `AEMT`, or `Paramedic`, from the NH standing-order heading it sits under.

## Answer fields

| Field | Effect |
|---|---|
| `label` | Button text |
| `next` | Next node id, or `"END"` |
| `finding` | Sentence added to the report "I" section |
| `suggest` | Field impressions this answer supports (ranked by count on the Consider list) |
| `redFlag` | Shown in red under the top bar and in the report |

## Validator checks
Missing fields, bad node type, `next` pointing nowhere, unreachable nodes, verified without citation; for `nh` protocols, a `cite` on every node and a `level` on every action.

## Vitals flags (adults 18+ only)
| Vital | Abnormal outside | Critical |
|---|---|---|
| HR | 60-100 | <50 or >130 |
| RR | 12-20 | <8 or >30 |
| SBP | 90-140 | <80 or >200 |
| SpO2 | <94 | <90 |
| BGL | 70-250 | <60 or >400 |
| GCS | <15 | ≤8 |

These are general EMT curriculum ranges, not NH-specific. Edit `vitalFlags()` in `engine.js`.
