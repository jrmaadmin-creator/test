# Reference: protocol file schema

```js
export default {
  id: 'chest-pain',            // unique, kebab-case
  title: 'Chest Pain / Suspected ACS',
  category: 'Medical',         // Assessment | Medical | Trauma | ...
  verified: false,             // true only after checking against the NH PDF
  source: { doc, section, page },  // section + page required when verified
  keywords: ['chest', ...],    // matched against the chief complaint
  start: 'onset',              // first node id
  nodes: { <id>: Node, ... },
}
```

## Node types

| type | Fields | Buttons |
|---|---|---|
| `question` | `text`, `ask` (words to say), `help`, `answers[]`, optional `next` default | one per answer |
| `action` | `text`, `detail`, `dose`, `verify`, `critical`, `report` (report wording), `next` | Done / Not done / Contraindicated |
| `info` | `text`, `items[]`, `verify`, `next` | Continue |

## Answer fields

| Field | Effect |
|---|---|
| `label` | Button text |
| `next` | Next node id, or `"END"` |
| `finding` | Sentence added to the report "I" section |
| `suggest` | Field impressions this answer supports (ranked by count on the Consider list) |
| `redFlag` | Shown in red under the top bar and in the report |

## Validator checks
Missing fields, bad node type, `next` pointing nowhere, unreachable nodes, verified without citation.

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
