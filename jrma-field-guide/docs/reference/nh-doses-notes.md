# Reference: NH v9.3 dosing extraction notes

Copied from the extraction run on 2026-10-04. Use as the verification checklist for `app/js/data/nh-doses.js`.


Output: `nh-doses.json` (930 records). 498 are dosing statements from the protocols and the A2 formulary. 432 are A3 weight-band values (9 color bands x 48 lines).

## Sources and what each covered

| Source | What was readable | Used for |
|---|---|---|
| PDF `1OJ9VIJc4XhBRKuXfrx40RltnMUAwFkjV` via `read_file_content` | **Truncated at PDF page 133** (ends in 5.13; the full book is 261 pages) | Protocols 1.0 to 5.4 (PDF p.13 to 120) |
| Word `1RV7-GUgghhmVyOZh2hkgWcRMUO_sMyDS` via `read_file_content` | **Also truncated**: ends in 8.7 (DNR). No appendices | 6.4 IO, 6.5 Restraints, 7.5 Operational K9, 7.8 RSI. Also checked for doses in 5.14 to 7.4 and found none other |
| Page JPGs `..._Page_230` to `_Page_255` in the same Drive folder (read visually) | Appendix 1 (Approved Medication by Provider Level), Appendix 2 (EMS Adult Formulary, p.232 to 252), Appendix 3 (Pediatric Color-Coded, p.253 to 255) | A1 levels, all A2 entries, all A3 band values |
| `_Page_025.jpg` | 2.2A page image | Confirmed the EMT/AEMT/Paramedic boxes for adult anaphylaxis |

Both full files are over the 10 MB download limit, so I could not parse the PDF locally.

## Page field
- **Protocol records:** the page field is the protocol number, which is also the printed page label, plus the PDF page index. Example: `2.2A (PDF p.25)`.
- **Records from the Word file (6.4, 6.5, 7.5, 7.8):** the PDF page range comes from the table of contents, because the Word text has no page markers.
- **Formulary records:** `Appendix 2 (PDF p.N)`.
- **A3 records:** `Appendix 3 (Page n of 3) (PDF p.N)`.

## Level field
- Taken from the standing-order header the statement sits under (EMT / ADVANCED EMT / PARAMEDIC / EXTENDED CARE).
- In the text extraction the headers are often clipped, for example "RAMEDIC" or "MT STANDING ORDERS". Where the layout was ambiguous, the level field says so.
- For A2 formulary rows, the level comes from Appendix 1 and is marked "(per A1)".

## Not found / gaps
- **Adult cardiac arrest anti-dysrhythmic (3.2A):** no amiodarone or lidocaine dose is printed. It says only "Administer anti-dysrhythmic, per ACLS algorithms". There is no adult arrest dose in A2 either.
- **No dosing found anywhere for:** olanzapine, D50/D25 (only dextrose 10% appears), and lactated Ringer's as a separate bolus regimen. LR is named only as an alternative IV fluid in 1.0, and as preferred for K9.
- **Hydroxocobalamin:** no mg dose in the protocol or the formulary ("via use of Cyanokit"). Pediatric dosing is "per A3" (280 mg to 2520 mg by band).
- **Hospice (8.8):** the Word text ends before it. Only the A2 formulary hospice entries are captured (lorazepam 0.25 to 2 mg PO/SL; midazolam 2.5 mg IN, max 6 mg; morphine "per Pain Protocol").
- **Sections 8.8 to 9.2** (including 9.0 Hazmat and 9.2 Radiation) were not readable in either text source. They are probably not dose-bearing, but this is unverified.
- **2.18P EMT acetaminophen/ibuprofen weight-volume chart:** garbled in the text. Only the per-kg rule was captured (15 mg/kg and 10 mg/kg; ibuprofen at 100 mg/5 mL).
- **2.14A/2.14P auto-injector tables:** partly garbled. The yellow-tag row reads "1 atropine/pralidoxime auto-injector AND ..."; the second item is missing. The 2.14P pralidoxime maintenance infusion rate is cut off.
- **2.4 adult "anxiety management" (PDF p.32):** recorded with the same benzodiazepine doses that are printed there.

## Conflicts and source typos to verify before marking anything `verified: true`
1. **Oral glucose units:** protocol 2.11A says "15 - 30 grams"; formulary A2 prints "15 – 30 mg".
2. **Nifedipine:** the A2 formulary still says "30 mg PO". The 9.3 amendment in 2.16 says 10 mg PO, then 20 mg after 20 min, max 30 mg total.
3. **DuoDote maintenance:** the A2 formulary says "every 3 hours". The 2.14A table says "every hour for 3 hours".
4. **K9 atropine:** the A2 formulary says 0.4 mg/kg. The 7.5 protocol and its chart say 0.04 mg/kg. Canine only.
5. **Ketamine for pain:** 2.18A says 25 to 50 mg "IM/IN"; A2 says "IM" only.
6. **Sodium bicarbonate crush infusion:** 4.1A says D5W only; A2 says "0.9 % NaCl or D5W".
7. **A3 typos in the source:**
   - Red band diphenhydramine is printed "8.5 kg".
   - Yellow band hydromorphone is printed "0.13 - 26 mg" (likely 0.26).
   - Several values have no units printed, e.g. midazolam 0.05 mg/kg "0.53" and "0.65", and hydromorphone in the White/Blue/Orange/Green bands.
   - White band midazolam is printed "3.3 mg mg".
   - Tetracaine is printed "Tretracaine".
8. **Missing "/kg":**
   - 2.10 pediatric midazolam IM/IN is printed "0.1 mg" without /kg.
   - 2.14P midazolam IM/IN is printed "0.2 mg" without /kg.
9. **Missing unit:** 2.18A/A2 naloxone IM is printed "0.4 – 2.0 IM" with no unit in A2. Protocol 2.17A has "mg".
10. **Missing route:**
    - 7.8 and 5.2 lorazepam post-intubation: no route printed.
    - 7.8 succinylcholine: "maximum 150" with no unit.
11. **OCR artifacts in weight thresholds:**
    - Epinephrine weight cut-offs in 2.2P/2.3P read "If 2: 25 kg" / "If~ 25 kg". I recorded these as >= 25 kg; the autoinjector line says "> 25 kg".
    - Ondansetron ODT "~ 16 kg" was recorded as >= 16 kg.
12. **Labetalol (2.16):** the text places it under an "ADVANCED EMT STANDING ORDERS" header, but the layout is garbled and A1 lists labetalol as Paramedic. Check the page image.
13. **2.22 infusions:** after the pediatric "contact Medical Control" line, norepinephrine/epinephrine infusions appear with adult doses. This is probably the cardiogenic-shock column. Recorded with group "unclear".
14. **Formulary header:** the A2 header says "reference for the NH Patient Care Protocols, Version 9.0" and the pages are footed 2024. The formulary may not be fully updated to 9.3.

## Scope notes for the EMT-B app
- **EMT-level dosing in the book:**
  - Epinephrine 1 mg/mL IM: 0.3 mg adult; 0.15 mg if < 25 kg.
  - Albuterol: 2.5 mg neb, or 4 to 6 puffs MDI.
  - DuoNeb.
  - Aspirin 324 mg.
  - Patient's own NTG, up to 3 doses.
  - Naloxone IN: 2 mg adult; 1 mg infant/toddler; or 4 mg spray.
  - Oral glucose 15 to 30 g.
  - Glucagon IN or auto-injector (dose not stated).
  - Acetaminophen and ibuprofen PO.
  - Activated charcoal 25 to 50 g (on Poison Control/Medical Control advice).
  - DuoDote / nerve agent auto-injectors.
  - Isopropyl alcohol inhalation.
  - Diphenhydramine PO (Extended Care).
  - Assisting with the patient's own Diastat or Nayzilam.
- **Operational K9 records** (group "canine") are animal doses and must be excluded from human calculators.
