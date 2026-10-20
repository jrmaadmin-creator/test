# Reference: NH v9.3 Appendix A3 in the app

Data: `app/js/data/nh-a3.js`. Logic: `app/js/peds.js`. Source: NH Patient Care Protocols v9.3, Appendix A3 "Pediatric Color Coded Appendix", printed Appendix 3 pp. 1-3, PDF pages 253-255. Transcribed from the 200-dpi page images on 2026-10-04.

| Band | Weight | Length | Age |
|---|---|---|---|
| Gray | 3-5 kg | < 59.5 cm | 0-3 months |
| Pink | 6-7 kg | 59.5-66.5 cm | 3-6 months |
| Red | 8-9 kg | 66.5-74 cm | 7-10 months |
| Purple | 10-11 kg | 74-84.5 cm | 11-18 months |
| Yellow | 12-14 kg | 84.5-97.5 cm | 19-35 months |
| White | 15-18 kg | 97.5-110 cm | 3-4 yrs |
| Blue | 19-22 kg | 110-122 cm | 5-6 yrs |
| Orange | 24-30 kg | 122-137 cm | 7-9 yrs |
| Green | 32-40 kg | 137-150 cm | 10-12 yrs |

Per band: HR, RR, SBP, ET tube, blade, two defibrillation and two cardioversion energies, NS bolus range, 47 drug rows.

## Verification checklist (owner)
Open each page image beside the Peds tab and check every value. Then set `meta.verified` to `true`.

Rows the transcription flagged as probable source typos (shown in the app as CHECK SOURCE):

| Band | Row | As printed | Why flagged |
|---|---|---|---|
| Red | Diphenhydramine (1 mg/kg) | 8.5 kg | Unit printed as kg |
| Purple | Midazolam (0.05 mg/kg) | 0.53 | No unit |
| Yellow | Hydromorphone | 0.13 - 26 mg | Pattern suggests 0.13 - 0.26 |
| Yellow | Midazolam (0.05 mg/kg) | 0.65 | No unit |
| White | Hydromorphone | 0.17 – 0.33 | No unit |
| White | Methylprednisolone (2 mg/kg) | 32 mg | 2 × 16.5 = 33 |
| White | Midazolam (0.2 mg/kg) | 3.3 mg mg | Duplicated unit |
| Blue | Amiodarone | 103.5 mg | 5 × 20.75 = 103.75 |
| Blue / Orange / Green | Hydromorphone | ranges without unit | No unit |

Also: the Green band (to 40 kg / 150 cm) runs past the NH 1.0 pediatric limit (36 kg / 145 cm). The app warns above that limit.

Consider reporting confirmed typos to the NH Bureau of EMS.
