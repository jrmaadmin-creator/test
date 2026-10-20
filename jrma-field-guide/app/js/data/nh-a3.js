// NH Patient Care Protocols v9.3, Appendix A3 "Pediatric Color Coded Appendix" (PDF pages 253-255).
// Transcribed verbatim from the page images on 2026-10-04. NOT YET VERIFIED line by line (meta.verified).
// Values are copied as printed, including probable source typos; those rows carry a `note`.
// Do not edit values by hand without checking the source page. See docs/reference/peds-a3.md.
export default {
 "meta": {
  "document": "New Hampshire Patient Care Protocols v9.3 (effective 2025-11-07)",
  "verified": false,
  "transcription": "Appendix A3 transcribed by visual reading of the uploaded 200-dpi page images (pages 253-255); Drive OCR of those images was scrambled and used only as a cross-check.",
  "routeField": "Route is only filled where the row label itself names a route (IV, IN, IM, IO, ODT, Nebulized, Oral). The table gives no route for other rows; null means 'not printed'.",
  "mLField": "The table prints doses in mg/mcg/mEq/drops/tube; mL is printed only for Dextrose 10%, Epinephrine Racemic 2.25% and Normal Saline. No concentration-based mL volumes exist in the table.",
  "scopeWarning": "Appendix lists ALS medications. EMT-B app must not present these as EMT actions."
 },
 "pediatricDefinition": {
  "verbatim": "Determine if pediatric protocols apply. \"Pediatric Patient\" is defined as a child who fits on a length-based resuscitation tape up to 36 kg (79 lbs) or 145 cm (57 in).",
  "sources": [
   {
    "protocol": "Routine Patient Care 1.0",
    "section": "Patient Approach",
    "pdfPageIndex": 13,
    "printedPageLabel": "Protocol 1.0 (no printed page number)"
   },
   {
    "protocol": "EMR Routine Patient Care (TOC lists as 1.1; page header prints 1.0)",
    "section": "Patient Approach",
    "pdfPageIndex": 16
   }
  ],
  "lengthBasedTape": [
   {
    "verbatim": "Any child who fits on a length-based resuscitation tape must be properly restrained in a safety seat or harness.",
    "source": {
     "protocol": "Pediatric Transportation Policy 8.12",
     "pdfPageIndex": 210
    }
   },
   {
    "verbatim": "Salem sump gastric tube of appropriate size; for pediatric size refer to the length based tape.",
    "source": {
     "protocol": "Gastric Tube Insertion 6.3 (from Word export; PDF text extraction stops at PDF p.133)",
     "pdfPageIndex": "139 per TOC anchor (not verified against page image)"
    }
   },
   {
    "verbatim": "No pediatric patients, see definition of pediatric patient in Routine Patient Care.",
    "source": {
     "protocol": "Interfacility Transfer 7.3 (non-complex vent settings; from Word export)",
     "pdfPageIndex": "153-157 (not pinned)"
    }
   }
  ],
  "note": "Appendix A3 Green band runs to 137-150 cm / 32-40 kg, which extends past the 145 cm / 36 kg definition limit. Both are as printed."
 },
 "bands": [
  {
   "color": "Gray",
   "ageLabel": "0-3 months",
   "weightKg": "3-5 Kg (Avg 4.0 Kg)",
   "length": "< 59.5 cm",
   "vitals": {
    "heartRate": "120-150",
    "respirations": "24-48",
    "bpSystolic": "70 (+/-25)"
   },
   "drugs": [
    {
     "drug": "Albuterol",
     "dose": "2.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Albuterol 2.5 mg"
    },
    {
     "drug": "Amiodarone",
     "dose": "20 mg",
     "mL": null,
     "route": null,
     "verbatim": "Amiodarone 20 mg"
    },
    {
     "drug": "Atropine- Bradycardia",
     "dose": "0.08 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine- Bradycardia 0.08 mg"
    },
    {
     "drug": "Atropine - Organophosphate Poison",
     "dose": "0.2 – 0.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine - Organophosphate Poison 0.2 – 0.4 mg"
    },
    {
     "drug": "Calcium Chloride",
     "dose": "80 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Chloride 80 mg"
    },
    {
     "drug": "Calcium Gluconate",
     "dose": "400 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Gluconate 400 mg"
    },
    {
     "drug": "Dexamethasone",
     "dose": "2.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Dexamethasone 2.4 mg"
    },
    {
     "drug": "Dextrose 10%",
     "dose": "20 mL",
     "mL": "20 mL",
     "route": null,
     "verbatim": "Dextrose 10% 20 mL"
    },
    {
     "drug": "Diazepam (0.1 mg/kg)",
     "dose": "0.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.1 mg/kg) 0.4 mg"
    },
    {
     "drug": "Diazepam (0.2 mg/kg)",
     "dose": "0.8 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.2 mg/kg) 0.8 mg"
    },
    {
     "drug": "Diphenhydramine (1 mg/kg)",
     "dose": "4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diphenhydramine (1 mg/kg) 4 mg"
    },
    {
     "drug": "Epinephrine 1:10,000",
     "dose": "0.04 mg",
     "mL": null,
     "route": null,
     "verbatim": "Epinephrine 1:10,000 0.04 mg"
    },
    {
     "drug": "Epinephrine 1:1000 Nebulized",
     "dose": "3 mg",
     "mL": null,
     "route": "Nebulized",
     "verbatim": "Epinephrine 1:1000 Nebulized 3 mg"
    },
    {
     "drug": "Epinephrine 1:1000 IM",
     "dose": "0.15 mg",
     "mL": null,
     "route": "IM",
     "verbatim": "Epinephrine 1:1000 IM 0.15 mg"
    },
    {
     "drug": "Epinephrine Racemic 2.25%",
     "dose": "0.5 mL",
     "mL": "0.5 mL",
     "route": null,
     "verbatim": "Epinephrine Racemic 2.25% 0.5 mL"
    },
    {
     "drug": "Fentanyl",
     "dose": "2 – 4 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Fentanyl 2 – 4 mcg"
    },
    {
     "drug": "Glucagon",
     "dose": "0.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Glucagon 0.5 mg"
    },
    {
     "drug": "Glucose Oral",
     "dose": "1 tube",
     "mL": null,
     "route": "Oral",
     "verbatim": "Glucose Oral 1 tube"
    },
    {
     "drug": "Hydrocortisone",
     "dose": "8 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydrocortisone 8 mg"
    },
    {
     "drug": "Hydromorphone",
     "dose": "0.04 – 0.08 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydromorphone 0.04 – 0.08 mg"
    },
    {
     "drug": "Hydroxocobalamin",
     "dose": "280 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydroxocobalamin 280 mg"
    },
    {
     "drug": "Ibuprofen",
     "dose": "HOLD",
     "mL": null,
     "route": null,
     "verbatim": "Ibuprofen HOLD"
    },
    {
     "drug": "Ipratropium w/ albuterol",
     "dose": "500 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Ipratropium w/ albuterol 500 mcg"
    },
    {
     "drug": "Ketamine 0.1 – 0.25 mg/kg IV",
     "dose": "0.4 - 1 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ketamine 0.1 – 0.25 mg/kg IV 0.4 - 1 mg"
    },
    {
     "drug": "Ketamine 0.5 – 1.0 mg/kg IN",
     "dose": "2 - 4 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Ketamine 0.5 – 1.0 mg/kg IN 2 - 4 mg"
    },
    {
     "drug": "Lidocaine - Cardiac Arrest",
     "dose": "4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lidocaine - Cardiac Arrest 4 mg"
    },
    {
     "drug": "Lidocaine - Intraosseous",
     "dose": "2 mg",
     "mL": null,
     "route": "IO",
     "verbatim": "Lidocaine - Intraosseous 2 mg"
    },
    {
     "drug": "Lorazepam (0.05 mg/kg)",
     "dose": "0.2 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.05 mg/kg) 0.2 mg"
    },
    {
     "drug": "Lorazepam (0.1 mg/kg)",
     "dose": "0.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.1 mg/kg) 0.4 mg"
    },
    {
     "drug": "Magnesium Sulfate - Asthma (40 mg/kg)",
     "dose": "160 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Asthma (40 mg/kg) 160 mg"
    },
    {
     "drug": "Magnesium Sulfate - Torsades (25 – 50 mg/kg)",
     "dose": "100 - 200 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Torsades (25 – 50 mg/kg) 100 - 200 mg"
    },
    {
     "drug": "Methylprednisolone (1 mg/kg)",
     "dose": "4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (1 mg/kg) 4 mg"
    },
    {
     "drug": "Methylprednisolone (2 mg/kg)",
     "dose": "8 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (2 mg/kg) 8 mg"
    },
    {
     "drug": "Midazolam (0.05 mg/kg)",
     "dose": "0.2 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.05 mg/kg) 0.2 mg"
    },
    {
     "drug": "Midazolam (0.1 mg/kg)",
     "dose": "0.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.1 mg/kg) 0.4 mg"
    },
    {
     "drug": "Midazolam (0.2 mg/kg)",
     "dose": "0.8 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.2 mg/kg) 0.8 mg"
    },
    {
     "drug": "Morphine Sulfate",
     "dose": "0.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Morphine Sulfate 0.4 mg"
    },
    {
     "drug": "Naloxone – IN",
     "dose": "1 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Naloxone – IN 1 mg"
    },
    {
     "drug": "Ondansetron – IV",
     "dose": "0.4 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ondansetron – IV 0.4 mg"
    },
    {
     "drug": "Ondansetron - ODT",
     "dose": "2 mg",
     "mL": null,
     "route": "ODT",
     "verbatim": "Ondansetron - ODT 2 mg"
    },
    {
     "drug": "Pralidoxime IV",
     "dose": "80 - 200 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Pralidoxime IV 80 - 200 mg"
    },
    {
     "drug": "Proparacaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Proparacaine 2 drops"
    },
    {
     "drug": "Sodium Bicarbonate",
     "dose": "4 mEq",
     "mL": null,
     "route": null,
     "verbatim": "Sodium Bicarbonate 4 mEq"
    },
    {
     "drug": "Tretracaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Tretracaine 2 drops"
    },
    {
     "drug": "Acetaminophen",
     "dose": "60 mg",
     "mL": null,
     "route": null,
     "verbatim": "Acetaminophen 60 mg"
    },
    {
     "drug": "Adenosine: 1st Dose",
     "dose": "0.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: 1st Dose- 0.4 mg"
    },
    {
     "drug": "Adenosine: Repeat Dose",
     "dose": "0.8 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: Repeat Dose- 0.8 mg"
    }
   ],
   "fluids": {
    "normalSaline": "40-80 ml"
   },
   "equipment": {
    "etTube": "2.5 - 3.5",
    "bladeSize": "0 - 1",
    "notPrinted": [
     "SGA/i-gel",
     "OPA",
     "NPA",
     "BVM",
     "suction catheter",
     "IV/IO",
     "NG/OG"
    ]
   },
   "energies": {
    "defibrillation": "8 J, 15 J",
    "cardioversion": "2 J, 4 J"
   },
   "source": {
    "document": "NH Patient Care Protocols v9.3 (effective 2025-11-07)",
    "section": "Appendix A3 – Pediatric Color Coded Appendix",
    "printedPageLabel": "Appendix 3 (Page 1 of 3)",
    "pdfPageIndex": 253,
    "driveImage": "NH Patient Care Protocols v9.3 (effective 2025-11-07)_Page_253.jpg",
    "footerYear": "2024"
   }
  },
  {
   "color": "Pink",
   "ageLabel": "3-6 Months",
   "weightKg": "6-7 Kg (Avg 6.5 Kg)",
   "length": "59.5-66.5 cm",
   "vitals": {
    "heartRate": "120-125",
    "respirations": "24-48",
    "bpSystolic": "85 (+/-25)"
   },
   "drugs": [
    {
     "drug": "Albuterol",
     "dose": "2.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Albuterol 2.5 mg"
    },
    {
     "drug": "Amiodarone",
     "dose": "32.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Amiodarone 32.5 mg"
    },
    {
     "drug": "Atropine- Bradycardia",
     "dose": "0.13 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine- Bradycardia 0.13 mg"
    },
    {
     "drug": "Atropine - Organophosphate Poison",
     "dose": "0.33 – 0.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine - Organophosphate Poison 0.33 – 0.65 mg"
    },
    {
     "drug": "Calcium Chloride",
     "dose": "130 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Chloride 130 mg"
    },
    {
     "drug": "Calcium Gluconate",
     "dose": "650 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Gluconate 650 mg"
    },
    {
     "drug": "Dexamethasone",
     "dose": "3.9 mg",
     "mL": null,
     "route": null,
     "verbatim": "Dexamethasone 3.9 mg"
    },
    {
     "drug": "Dextrose 10%",
     "dose": "32.5 mL",
     "mL": "32.5 mL",
     "route": null,
     "verbatim": "Dextrose 10% 32.5 mL"
    },
    {
     "drug": "Diazepam (0.1 mg/kg)",
     "dose": "0.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.1 mg/kg) 0.65 mg"
    },
    {
     "drug": "Diazepam (0.2 mg/kg)",
     "dose": "1.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.2 mg/kg) 1.3 mg"
    },
    {
     "drug": "Diphenhydramine (1 mg/kg)",
     "dose": "6.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diphenhydramine (1 mg/kg) 6.5 mg"
    },
    {
     "drug": "Epinephrine 1:10,000",
     "dose": "0.07 mg",
     "mL": null,
     "route": null,
     "verbatim": "Epinephrine 1:10,000 0.07 mg"
    },
    {
     "drug": "Epinephrine 1:1000 Nebulized",
     "dose": "3 mg",
     "mL": null,
     "route": "Nebulized",
     "verbatim": "Epinephrine 1:1000 Nebulized 3 mg"
    },
    {
     "drug": "Epinephrine 1:1000 IM",
     "dose": "0.15 mg",
     "mL": null,
     "route": "IM",
     "verbatim": "Epinephrine 1:1000 IM 0.15 mg"
    },
    {
     "drug": "Epinephrine Racemic 2.25%",
     "dose": "0.5 mL",
     "mL": "0.5 mL",
     "route": null,
     "verbatim": "Epinephrine Racemic 2.25% 0.5 mL"
    },
    {
     "drug": "Fentanyl",
     "dose": "3.25 – 6.5 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Fentanyl 3.25 – 6.5 mcg"
    },
    {
     "drug": "Glucagon",
     "dose": "0.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Glucagon 0.5 mg"
    },
    {
     "drug": "Glucose Oral",
     "dose": "1 tube",
     "mL": null,
     "route": "Oral",
     "verbatim": "Glucose Oral 1 tube"
    },
    {
     "drug": "Hydrocortisone",
     "dose": "13 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydrocortisone 13 mg"
    },
    {
     "drug": "Hydromorphone",
     "dose": "0.07 – 0.13 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydromorphone 0.07 – 0.13 mg"
    },
    {
     "drug": "Hydroxocobalamin",
     "dose": "455 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydroxocobalamin 455 mg"
    },
    {
     "drug": "Ibuprofen",
     "dose": "HOLD",
     "mL": null,
     "route": null,
     "verbatim": "Ibuprofen HOLD"
    },
    {
     "drug": "Ipratropium w/ albuterol",
     "dose": "500 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Ipratropium w/ albuterol 500 mcg"
    },
    {
     "drug": "Ketamine 0.1 – 0.25 mg/kg IV",
     "dose": "0.65 – 1.63 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ketamine 0.1 – 0.25 mg/kg IV 0.65 – 1.63 mg"
    },
    {
     "drug": "Ketamine 0.5 – 1.0 mg/kg IN",
     "dose": "3.25 – 6.5 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Ketamine 0.5 – 1.0 mg/kg IN 3.25 – 6.5 mg"
    },
    {
     "drug": "Lidocaine - Cardiac Arrest",
     "dose": "6.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lidocaine - Cardiac Arrest 6.5 mg"
    },
    {
     "drug": "Lidocaine - Intraosseous",
     "dose": "3.25 mg",
     "mL": null,
     "route": "IO",
     "verbatim": "Lidocaine - Intraosseous 3.25 mg"
    },
    {
     "drug": "Lorazepam (0.05 mg/kg)",
     "dose": "0.33 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.05 mg/kg) 0.33 mg"
    },
    {
     "drug": "Lorazepam (0.1 mg/kg)",
     "dose": "0.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.1 mg/kg) 0.65 mg"
    },
    {
     "drug": "Magnesium Sulfate - Asthma (40 mg/kg)",
     "dose": "260 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Asthma (40 mg/kg) 260 mg"
    },
    {
     "drug": "Magnesium Sulfate - Torsades (25 – 50 mg/kg)",
     "dose": "162.5 - 325 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Torsades (25 – 50 mg/kg) 162.5 - 325 mg"
    },
    {
     "drug": "Methylprednisolone (1 mg/kg)",
     "dose": "6.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (1 mg/kg) 6.5 mg"
    },
    {
     "drug": "Methylprednisolone (2 mg/kg)",
     "dose": "13 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (2 mg/kg) 13 mg"
    },
    {
     "drug": "Midazolam (0.05 mg/kg)",
     "dose": "0.33 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.05 mg/kg) 0.33 mg"
    },
    {
     "drug": "Midazolam (0.1 mg/kg)",
     "dose": "0.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.1 mg/kg) 0.65 mg"
    },
    {
     "drug": "Midazolam (0.2 mg/kg)",
     "dose": "1.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.2 mg/kg) 1.3 mg"
    },
    {
     "drug": "Morphine Sulfate",
     "dose": "0.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Morphine Sulfate 0.65 mg"
    },
    {
     "drug": "Naloxone – IN",
     "dose": "1 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Naloxone – IN 1 mg"
    },
    {
     "drug": "Ondansetron – IV",
     "dose": "0.65 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ondansetron – IV 0.65 mg"
    },
    {
     "drug": "Ondansetron - ODT",
     "dose": "2 mg",
     "mL": null,
     "route": "ODT",
     "verbatim": "Ondansetron - ODT 2 mg"
    },
    {
     "drug": "Pralidoxime IV",
     "dose": "130 - 325 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Pralidoxime IV 130 - 325 mg"
    },
    {
     "drug": "Proparacaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Proparacaine 2 drops"
    },
    {
     "drug": "Sodium Bicarbonate",
     "dose": "6.5 mEq",
     "mL": null,
     "route": null,
     "verbatim": "Sodium Bicarbonate 6.5 mEq"
    },
    {
     "drug": "Tretracaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Tretracaine 2 drops"
    },
    {
     "drug": "Acetaminophen",
     "dose": "97.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Acetaminophen 97.5 mg"
    },
    {
     "drug": "Adenosine: 1st Dose",
     "dose": "0.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: 1st Dose- 0.65 mg"
    },
    {
     "drug": "Adenosine: Repeat Dose",
     "dose": "1.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: Repeat Dose- 1.3 mg"
    }
   ],
   "fluids": {
    "normalSaline": "65-130 ml"
   },
   "equipment": {
    "etTube": "3.5",
    "bladeSize": "1",
    "notPrinted": [
     "SGA/i-gel",
     "OPA",
     "NPA",
     "BVM",
     "suction catheter",
     "IV/IO",
     "NG/OG"
    ]
   },
   "energies": {
    "defibrillation": "10 J, 20 J",
    "cardioversion": "2 J, 5 J"
   },
   "source": {
    "document": "NH Patient Care Protocols v9.3 (effective 2025-11-07)",
    "section": "Appendix A3 – Pediatric Color Coded Appendix",
    "printedPageLabel": "Appendix 3 (Page 1 of 3)",
    "pdfPageIndex": 253,
    "driveImage": "NH Patient Care Protocols v9.3 (effective 2025-11-07)_Page_253.jpg",
    "footerYear": "2024"
   }
  },
  {
   "color": "Red",
   "ageLabel": "7-10 Months",
   "weightKg": "8-9 Kg (Avg 8.5 Kg)",
   "length": "66.5-74 cm",
   "vitals": {
    "heartRate": "120",
    "respirations": "24-32",
    "bpSystolic": "92 (+/-25)"
   },
   "drugs": [
    {
     "drug": "Albuterol",
     "dose": "2.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Albuterol 2.5 mg"
    },
    {
     "drug": "Amiodarone",
     "dose": "42.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Amiodarone 42.5 mg"
    },
    {
     "drug": "Atropine- Bradycardia",
     "dose": "0.17 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine- Bradycardia 0.17 mg"
    },
    {
     "drug": "Atropine - Organophosphate Poison",
     "dose": "0.43 – 0.85 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine - Organophosphate Poison 0.43 – 0.85 mg"
    },
    {
     "drug": "Calcium Chloride",
     "dose": "170 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Chloride 170 mg"
    },
    {
     "drug": "Calcium Gluconate",
     "dose": "850 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Gluconate 850 mg"
    },
    {
     "drug": "Dexamethasone",
     "dose": "5.1 mg",
     "mL": null,
     "route": null,
     "verbatim": "Dexamethasone 5.1 mg"
    },
    {
     "drug": "Dextrose 10%",
     "dose": "42.5 mL",
     "mL": "42.5 mL",
     "route": null,
     "verbatim": "Dextrose 10% 42.5 mL"
    },
    {
     "drug": "Diazepam (0.1 mg/kg)",
     "dose": "0.85 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.1 mg/kg) 0.85 mg"
    },
    {
     "drug": "Diazepam (0.2 mg/kg)",
     "dose": "1.7 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.2 mg/kg) 1.7 mg"
    },
    {
     "drug": "Diphenhydramine (1 mg/kg)",
     "dose": "8.5 kg",
     "mL": null,
     "route": null,
     "verbatim": "Diphenhydramine (1 mg/kg) 8.5 kg",
     "note": "Printed unit is 'kg' (likely typo for mg). Transcribed as printed; verify."
    },
    {
     "drug": "Epinephrine 1:10,000",
     "dose": "0.09 mg",
     "mL": null,
     "route": null,
     "verbatim": "Epinephrine 1:10,000 0.09 mg"
    },
    {
     "drug": "Epinephrine 1:1000 Nebulized",
     "dose": "3 mg",
     "mL": null,
     "route": "Nebulized",
     "verbatim": "Epinephrine 1:1000 Nebulized 3 mg"
    },
    {
     "drug": "Epinephrine 1:1000 IM",
     "dose": "0.15 mg",
     "mL": null,
     "route": "IM",
     "verbatim": "Epinephrine 1:1000 IM 0.15 mg"
    },
    {
     "drug": "Epinephrine Racemic 2.25%",
     "dose": "0.5 mL",
     "mL": "0.5 mL",
     "route": null,
     "verbatim": "Epinephrine Racemic 2.25% 0.5 mL"
    },
    {
     "drug": "Fentanyl",
     "dose": "6.5 - 13 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Fentanyl 6.5 - 13 mcg"
    },
    {
     "drug": "Glucagon",
     "dose": "0.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Glucagon 0.5 mg"
    },
    {
     "drug": "Glucose Oral",
     "dose": "1 tube",
     "mL": null,
     "route": "Oral",
     "verbatim": "Glucose Oral 1 tube"
    },
    {
     "drug": "Hydrocortisone",
     "dose": "17 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydrocortisone 17 mg"
    },
    {
     "drug": "Hydromorphone",
     "dose": "0.09 – 0.17 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydromorphone 0.09 – 0.17 mg"
    },
    {
     "drug": "Hydroxocobalamin",
     "dose": "595 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydroxocobalamin 595 mg"
    },
    {
     "drug": "Ibuprofen",
     "dose": "HOLD",
     "mL": null,
     "route": null,
     "verbatim": "Ibuprofen HOLD"
    },
    {
     "drug": "Ipratropium w/ albuterol",
     "dose": "500 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Ipratropium w/ albuterol 500 mcg"
    },
    {
     "drug": "Ketamine 0.1 – 0.25 mg/kg IV",
     "dose": "0.85 – 2.13 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ketamine 0.1 – 0.25 mg/kg IV 0.85 – 2.13 mg"
    },
    {
     "drug": "Ketamine 0.5 – 1.0 mg/kg IN",
     "dose": "4.25 – 8.5 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Ketamine 0.5 – 1.0 mg/kg IN 4.25 – 8.5 mg"
    },
    {
     "drug": "Lidocaine - Cardiac Arrest",
     "dose": "8.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lidocaine - Cardiac Arrest 8.5 mg"
    },
    {
     "drug": "Lidocaine - Intraosseous",
     "dose": "4.25 mg",
     "mL": null,
     "route": "IO",
     "verbatim": "Lidocaine - Intraosseous 4.25 mg"
    },
    {
     "drug": "Lorazepam (0.05 mg/kg)",
     "dose": "0.43 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.05 mg/kg) 0.43 mg"
    },
    {
     "drug": "Lorazepam (0.1 mg/kg)",
     "dose": "0.85 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.1 mg/kg) 0.85 mg"
    },
    {
     "drug": "Magnesium Sulfate - Asthma (40 mg/kg)",
     "dose": "340 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Asthma (40 mg/kg) 340 mg"
    },
    {
     "drug": "Magnesium Sulfate - Torsades (25 – 50 mg/kg)",
     "dose": "212.5 - 425 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Torsades (25 – 50 mg/kg) 212.5 - 425 mg"
    },
    {
     "drug": "Methylprednisolone (1 mg/kg)",
     "dose": "8.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (1 mg/kg) 8.5 mg"
    },
    {
     "drug": "Methylprednisolone (2 mg/kg)",
     "dose": "17 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (2 mg/kg) 17 mg"
    },
    {
     "drug": "Midazolam (0.05 mg/kg)",
     "dose": "0.43 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.05 mg/kg) 0.43 mg"
    },
    {
     "drug": "Midazolam (0.1 mg/kg)",
     "dose": "0.85 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.1 mg/kg) 0.85 mg"
    },
    {
     "drug": "Midazolam (0.2 mg/kg)",
     "dose": "1.7 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.2 mg/kg) 1.7 mg"
    },
    {
     "drug": "Morphine Sulfate",
     "dose": "0.85 mg",
     "mL": null,
     "route": null,
     "verbatim": "Morphine Sulfate 0.85 mg"
    },
    {
     "drug": "Naloxone – IN",
     "dose": "1 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Naloxone – IN 1 mg"
    },
    {
     "drug": "Ondansetron – IV",
     "dose": "0.85 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ondansetron – IV 0.85 mg"
    },
    {
     "drug": "Ondansetron - ODT",
     "dose": "2 mg",
     "mL": null,
     "route": "ODT",
     "verbatim": "Ondansetron - ODT 2 mg"
    },
    {
     "drug": "Pralidoxime IV",
     "dose": "170 - 425 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Pralidoxime IV 170 - 425 mg"
    },
    {
     "drug": "Proparacaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Proparacaine 2 drops"
    },
    {
     "drug": "Sodium Bicarbonate",
     "dose": "8.5 mEq",
     "mL": null,
     "route": null,
     "verbatim": "Sodium Bicarbonate 8.5 mEq"
    },
    {
     "drug": "Tretracaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Tretracaine 2 drops"
    },
    {
     "drug": "Acetaminophen",
     "dose": "127.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Acetaminophen 127.5 mg"
    },
    {
     "drug": "Adenosine: 1st Dose",
     "dose": "0.85 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: 1st Dose- 0.85 mg"
    },
    {
     "drug": "Adenosine: Repeat Dose",
     "dose": "1.7 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: Repeat Dose- 1.7 mg"
    }
   ],
   "fluids": {
    "normalSaline": "85-170 ml"
   },
   "equipment": {
    "etTube": "3.5 -4.0",
    "bladeSize": "1",
    "notPrinted": [
     "SGA/i-gel",
     "OPA",
     "NPA",
     "BVM",
     "suction catheter",
     "IV/IO",
     "NG/OG"
    ]
   },
   "energies": {
    "defibrillation": "20 J, 40 J",
    "cardioversion": "5 J, 9 J"
   },
   "source": {
    "document": "NH Patient Care Protocols v9.3 (effective 2025-11-07)",
    "section": "Appendix A3 – Pediatric Color Coded Appendix",
    "printedPageLabel": "Appendix 3 (Page 1 of 3)",
    "pdfPageIndex": 253,
    "driveImage": "NH Patient Care Protocols v9.3 (effective 2025-11-07)_Page_253.jpg",
    "footerYear": "2024"
   }
  },
  {
   "color": "Purple",
   "ageLabel": "11-18 Months",
   "weightKg": "10-11 Kg (Avg 10.5 Kg)",
   "length": "74-84.5 cm",
   "vitals": {
    "heartRate": "115-120",
    "respirations": "22-30",
    "bpSystolic": "96 (+/-30)"
   },
   "drugs": [
    {
     "drug": "Albuterol",
     "dose": "2.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Albuterol 2.5 mg"
    },
    {
     "drug": "Amiodarone",
     "dose": "52.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Amiodarone 52.5 mg"
    },
    {
     "drug": "Atropine- Bradycardia",
     "dose": "0.21 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine- Bradycardia 0.21 mg"
    },
    {
     "drug": "Atropine - Organophosphate Poison",
     "dose": "0.53 – 1.05 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine - Organophosphate Poison 0.53 – 1.05 mg"
    },
    {
     "drug": "Calcium Chloride",
     "dose": "210 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Chloride 210 mg"
    },
    {
     "drug": "Calcium Gluconate",
     "dose": "1050 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Gluconate 1050 mg"
    },
    {
     "drug": "Dexamethasone",
     "dose": "6.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Dexamethasone 6.3 mg"
    },
    {
     "drug": "Dextrose 10%",
     "dose": "52.5 mL",
     "mL": "52.5 mL",
     "route": null,
     "verbatim": "Dextrose 10% 52.5 mL"
    },
    {
     "drug": "Diazepam (0.1 mg/kg)",
     "dose": "1.05 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.1 mg/kg) 1.05 mg"
    },
    {
     "drug": "Diazepam (0.2 mg/kg)",
     "dose": "2.1 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.2 mg/kg) 2.1 mg"
    },
    {
     "drug": "Diphenhydramine (1 mg/kg)",
     "dose": "10.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diphenhydramine (1 mg/kg) 10.5 mg"
    },
    {
     "drug": "Epinephrine 1:10,000",
     "dose": "0.11 mg",
     "mL": null,
     "route": null,
     "verbatim": "Epinephrine 1:10,000 0.11 mg"
    },
    {
     "drug": "Epinephrine 1:1000 Nebulized",
     "dose": "3 mg",
     "mL": null,
     "route": "Nebulized",
     "verbatim": "Epinephrine 1:1000 Nebulized 3 mg"
    },
    {
     "drug": "Epinephrine 1:1000 IM",
     "dose": "0.15 mg",
     "mL": null,
     "route": "IM",
     "verbatim": "Epinephrine 1:1000 IM 0.15 mg"
    },
    {
     "drug": "Epinephrine Racemic 2.25%",
     "dose": "0.5 mL",
     "mL": "0.5 mL",
     "route": null,
     "verbatim": "Epinephrine Racemic 2.25% 0.5 mL"
    },
    {
     "drug": "Fentanyl",
     "dose": "5.25 – 10.5 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Fentanyl 5.25 – 10.5 mcg"
    },
    {
     "drug": "Glucagon",
     "dose": "0.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Glucagon 0.5 mg"
    },
    {
     "drug": "Glucose Oral",
     "dose": "1 tube",
     "mL": null,
     "route": "Oral",
     "verbatim": "Glucose Oral 1 tube"
    },
    {
     "drug": "Hydrocortisone",
     "dose": "21 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydrocortisone 21 mg"
    },
    {
     "drug": "Hydromorphone",
     "dose": "0.11 – 0.21 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydromorphone 0.11 – 0.21 mg"
    },
    {
     "drug": "Hydroxocobalamin",
     "dose": "735 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydroxocobalamin 735 mg"
    },
    {
     "drug": "Ibuprofen",
     "dose": "105 mg",
     "mL": null,
     "route": null,
     "verbatim": "Ibuprofen 105 mg"
    },
    {
     "drug": "Ipratropium w/ albuterol",
     "dose": "500 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Ipratropium w/ albuterol 500 mcg"
    },
    {
     "drug": "Ketamine 0.1 – 0.25 mg/kg IV",
     "dose": "1.05 – 2.63 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ketamine 0.1 – 0.25 mg/kg IV 1.05 – 2.63 mg"
    },
    {
     "drug": "Ketamine 0.5 – 1.0 mg/kg IN",
     "dose": "5.25 – 10.5 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Ketamine 0.5 – 1.0 mg/kg IN 5.25 – 10.5 mg"
    },
    {
     "drug": "Lidocaine - Cardiac Arrest",
     "dose": "10.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lidocaine - Cardiac Arrest 10.5 mg"
    },
    {
     "drug": "Lidocaine - Intraosseous",
     "dose": "5.25 mg",
     "mL": null,
     "route": "IO",
     "verbatim": "Lidocaine - Intraosseous 5.25 mg"
    },
    {
     "drug": "Lorazepam (0.05 mg/kg)",
     "dose": "0.53 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.05 mg/kg) 0.53 mg"
    },
    {
     "drug": "Lorazepam (0.1 mg/kg)",
     "dose": "1.05 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.1 mg/kg) 1.05 mg"
    },
    {
     "drug": "Magnesium Sulfate - Asthma (40 mg/kg)",
     "dose": "420 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Asthma (40 mg/kg) 420 mg"
    },
    {
     "drug": "Magnesium Sulfate - Torsades (25 – 50 mg/kg)",
     "dose": "262.5 - 525 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Torsades (25 – 50 mg/kg) 262.5 - 525 mg"
    },
    {
     "drug": "Methylprednisolone (1 mg/kg)",
     "dose": "10.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (1 mg/kg) 10.5 mg"
    },
    {
     "drug": "Methylprednisolone (2 mg/kg)",
     "dose": "21 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (2 mg/kg) 21 mg"
    },
    {
     "drug": "Midazolam (0.05 mg/kg)",
     "dose": "0.53",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.05 mg/kg) 0.53",
     "note": "No unit printed."
    },
    {
     "drug": "Midazolam (0.1 mg/kg)",
     "dose": "1.05 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.1 mg/kg) 1.05 mg"
    },
    {
     "drug": "Midazolam (0.2 mg/kg)",
     "dose": "2.10 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.2 mg/kg) 2.10 mg"
    },
    {
     "drug": "Morphine Sulfate",
     "dose": "1.05 mg",
     "mL": null,
     "route": null,
     "verbatim": "Morphine Sulfate 1.05 mg"
    },
    {
     "drug": "Naloxone – IN",
     "dose": "1 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Naloxone – IN 1 mg"
    },
    {
     "drug": "Ondansetron – IV",
     "dose": "1 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ondansetron – IV 1 mg"
    },
    {
     "drug": "Ondansetron - ODT",
     "dose": "2 mg",
     "mL": null,
     "route": "ODT",
     "verbatim": "Ondansetron - ODT 2 mg"
    },
    {
     "drug": "Pralidoxime IV",
     "dose": "210 – 525 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Pralidoxime IV 210 – 525 mg"
    },
    {
     "drug": "Proparacaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Proparacaine 2 drops"
    },
    {
     "drug": "Sodium Bicarbonate",
     "dose": "10.5 mEq",
     "mL": null,
     "route": null,
     "verbatim": "Sodium Bicarbonate 10.5 mEq"
    },
    {
     "drug": "Tretracaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Tretracaine 2 drops"
    },
    {
     "drug": "Acetaminophen",
     "dose": "160 mg",
     "mL": null,
     "route": null,
     "verbatim": "Acetaminophen 160 mg"
    },
    {
     "drug": "Adenosine: 1st Dose",
     "dose": "1.05 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: 1st Dose- 1.05 mg"
    },
    {
     "drug": "Adenosine: Repeat Dose",
     "dose": "2.1 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: Repeat Dose- 2.1 mg"
    }
   ],
   "fluids": {
    "normalSaline": "105-210 ml"
   },
   "equipment": {
    "etTube": "4.0",
    "bladeSize": "1",
    "notPrinted": [
     "SGA/i-gel",
     "OPA",
     "NPA",
     "BVM",
     "suction catheter",
     "IV/IO",
     "NG/OG"
    ]
   },
   "energies": {
    "defibrillation": "20 J, 40 J",
    "cardioversion": "5 J, 10 J"
   },
   "source": {
    "document": "NH Patient Care Protocols v9.3 (effective 2025-11-07)",
    "section": "Appendix A3 – Pediatric Color Coded Appendix",
    "printedPageLabel": "Appendix 3 (Page 2 of 3)",
    "pdfPageIndex": 254,
    "driveImage": "NH Patient Care Protocols v9.3 (effective 2025-11-07)_Page_254.jpg",
    "footerYear": "2024"
   }
  },
  {
   "color": "Yellow",
   "ageLabel": "19-35 Months",
   "weightKg": "12-14 Kg (Avg 13 Kg)",
   "length": "84.5-97.5 cm",
   "vitals": {
    "heartRate": "110-115",
    "respirations": "20-28",
    "bpSystolic": "100 (+/-30)"
   },
   "drugs": [
    {
     "drug": "Albuterol",
     "dose": "2.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Albuterol 2.5 mg"
    },
    {
     "drug": "Amiodarone",
     "dose": "65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Amiodarone 65 mg"
    },
    {
     "drug": "Atropine- Bradycardia",
     "dose": "0.26 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine- Bradycardia 0.26 mg"
    },
    {
     "drug": "Atropine - Organophosphate Poison",
     "dose": "0.65 – 1.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine - Organophosphate Poison 0.65 – 1.3 mg"
    },
    {
     "drug": "Calcium Chloride",
     "dose": "260 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Chloride 260 mg"
    },
    {
     "drug": "Calcium Gluconate",
     "dose": "1300 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Gluconate 1300 mg"
    },
    {
     "drug": "Dexamethasone",
     "dose": "7.8 mg",
     "mL": null,
     "route": null,
     "verbatim": "Dexamethasone 7.8 mg"
    },
    {
     "drug": "Dextrose 10%",
     "dose": "65 mL",
     "mL": "65 mL",
     "route": null,
     "verbatim": "Dextrose 10% 65 mL"
    },
    {
     "drug": "Diazepam (0.1 mg/kg)",
     "dose": "1.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.1 mg/kg) 1.3 mg"
    },
    {
     "drug": "Diazepam (0.2 mg/kg)",
     "dose": "2.6 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.2 mg/kg) 2.6 mg"
    },
    {
     "drug": "Diphenhydramine (1 mg/kg)",
     "dose": "13 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diphenhydramine (1 mg/kg) 13 mg"
    },
    {
     "drug": "Epinephrine 1:10,000",
     "dose": "0.13 mg",
     "mL": null,
     "route": null,
     "verbatim": "Epinephrine 1:10,000 0.13 mg"
    },
    {
     "drug": "Epinephrine 1:1000 Nebulized",
     "dose": "3 mg",
     "mL": null,
     "route": "Nebulized",
     "verbatim": "Epinephrine 1:1000 Nebulized 3 mg"
    },
    {
     "drug": "Epinephrine 1:1000 IM",
     "dose": "0.15 mg",
     "mL": null,
     "route": "IM",
     "verbatim": "Epinephrine 1:1000 IM 0.15 mg"
    },
    {
     "drug": "Epinephrine Racemic 2.25%",
     "dose": "0.5 mL",
     "mL": "0.5 mL",
     "route": null,
     "verbatim": "Epinephrine Racemic 2.25% 0.5 mL"
    },
    {
     "drug": "Fentanyl",
     "dose": "6.5 – 13 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Fentanyl 6.5 – 13 mcg"
    },
    {
     "drug": "Glucagon",
     "dose": "0.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Glucagon 0.5 mg"
    },
    {
     "drug": "Glucose Oral",
     "dose": "1 tube",
     "mL": null,
     "route": "Oral",
     "verbatim": "Glucose Oral 1 tube"
    },
    {
     "drug": "Hydrocortisone",
     "dose": "26 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydrocortisone 26 mg"
    },
    {
     "drug": "Hydromorphone",
     "dose": "0.13 - 26 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydromorphone 0.13 - 26 mg",
     "note": "Printed '0.13 - 26 mg'; other bands follow 0.01-0.02 mg/kg pattern (would be 0.13 - 0.26). Likely typo in source; do NOT correct without user verification."
    },
    {
     "drug": "Hydroxocobalamin",
     "dose": "910 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydroxocobalamin 910 mg"
    },
    {
     "drug": "Ibuprofen",
     "dose": "130 mg",
     "mL": null,
     "route": null,
     "verbatim": "Ibuprofen 130 mg"
    },
    {
     "drug": "Ipratropium w/ albuterol",
     "dose": "500 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Ipratropium w/ albuterol 500 mcg"
    },
    {
     "drug": "Ketamine 0.1 – 0.25 mg/kg IV",
     "dose": "1.3 – 3.25 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ketamine 0.1 – 0.25 mg/kg IV 1.3 – 3.25 mg"
    },
    {
     "drug": "Ketamine 0.5 – 1.0 mg/kg IN",
     "dose": "6.5 - 13 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Ketamine 0.5 – 1.0 mg/kg IN 6.5 - 13 mg"
    },
    {
     "drug": "Lidocaine - Cardiac Arrest",
     "dose": "13 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lidocaine - Cardiac Arrest 13 mg"
    },
    {
     "drug": "Lidocaine - Intraosseous",
     "dose": "6.5 mg",
     "mL": null,
     "route": "IO",
     "verbatim": "Lidocaine - Intraosseous 6.5 mg"
    },
    {
     "drug": "Lorazepam (0.05 mg/kg)",
     "dose": "0.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.05 mg/kg) 0.65 mg"
    },
    {
     "drug": "Lorazepam (0.1 mg/kg)",
     "dose": "1.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.1 mg/kg) 1.3 mg"
    },
    {
     "drug": "Magnesium Sulfate - Asthma (40 mg/kg)",
     "dose": "520 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Asthma (40 mg/kg) 520 mg"
    },
    {
     "drug": "Magnesium Sulfate - Torsades (25 – 50 mg/kg)",
     "dose": "325 - 650 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Torsades (25 – 50 mg/kg) 325 - 650 mg"
    },
    {
     "drug": "Methylprednisolone (1 mg/kg)",
     "dose": "13 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (1 mg/kg) 13 mg"
    },
    {
     "drug": "Methylprednisolone (2 mg/kg)",
     "dose": "26 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (2 mg/kg) 26 mg"
    },
    {
     "drug": "Midazolam (0.05 mg/kg)",
     "dose": "0.65",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.05 mg/kg) 0.65",
     "note": "No unit printed."
    },
    {
     "drug": "Midazolam (0.1 mg/kg)",
     "dose": "1.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.1 mg/kg) 1.3 mg"
    },
    {
     "drug": "Midazolam (0.2 mg/kg)",
     "dose": "2.6 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.2 mg/kg) 2.6 mg"
    },
    {
     "drug": "Morphine Sulfate",
     "dose": "1.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Morphine Sulfate 1.3 mg"
    },
    {
     "drug": "Naloxone – IN",
     "dose": "1 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Naloxone – IN 1 mg"
    },
    {
     "drug": "Ondansetron – IV",
     "dose": "1.3 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ondansetron – IV 1.3 mg"
    },
    {
     "drug": "Ondansetron - ODT",
     "dose": "2 mg",
     "mL": null,
     "route": "ODT",
     "verbatim": "Ondansetron - ODT 2 mg"
    },
    {
     "drug": "Pralidoxime IV",
     "dose": "260 - 650 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Pralidoxime IV 260 - 650 mg"
    },
    {
     "drug": "Proparacaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Proparacaine 2 drops"
    },
    {
     "drug": "Sodium Bicarbonate",
     "dose": "13 mEq",
     "mL": null,
     "route": null,
     "verbatim": "Sodium Bicarbonate 13 mEq"
    },
    {
     "drug": "Tretracaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Tretracaine 2 drops"
    },
    {
     "drug": "Acetaminophen",
     "dose": "195 mg",
     "mL": null,
     "route": null,
     "verbatim": "Acetaminophen 195 mg"
    },
    {
     "drug": "Adenosine: 1st Dose",
     "dose": "1.3mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: 1st Dose- 1.3mg"
    },
    {
     "drug": "Adenosine: Repeat Dose",
     "dose": "2.6 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: Repeat Dose- 2.6 mg"
    }
   ],
   "fluids": {
    "normalSaline": "130-260 ml"
   },
   "equipment": {
    "etTube": "4.5",
    "bladeSize": "2",
    "notPrinted": [
     "SGA/i-gel",
     "OPA",
     "NPA",
     "BVM",
     "suction catheter",
     "IV/IO",
     "NG/OG"
    ]
   },
   "energies": {
    "defibrillation": "30 J, 50 J",
    "cardioversion": "6 J, 15 J"
   },
   "source": {
    "document": "NH Patient Care Protocols v9.3 (effective 2025-11-07)",
    "section": "Appendix A3 – Pediatric Color Coded Appendix",
    "printedPageLabel": "Appendix 3 (Page 2 of 3)",
    "pdfPageIndex": 254,
    "driveImage": "NH Patient Care Protocols v9.3 (effective 2025-11-07)_Page_254.jpg",
    "footerYear": "2024"
   }
  },
  {
   "color": "White",
   "ageLabel": "3-4 yrs",
   "weightKg": "15-18 Kg (Avg 16.5 Kg)",
   "length": "97.5-110 cm",
   "vitals": {
    "heartRate": "100 - 115",
    "respirations": "20-26",
    "bpSystolic": "100 (+/-20)"
   },
   "drugs": [
    {
     "drug": "Albuterol",
     "dose": "2.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Albuterol 2.5 mg"
    },
    {
     "drug": "Amiodarone",
     "dose": "82.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Amiodarone 82.5 mg"
    },
    {
     "drug": "Atropine- Bradycardia",
     "dose": "0.33 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine- Bradycardia 0.33 mg"
    },
    {
     "drug": "Atropine - Organophosphate Poison",
     "dose": "0.83 – 1.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine - Organophosphate Poison 0.83 – 1.65 mg"
    },
    {
     "drug": "Calcium Chloride",
     "dose": "330 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Chloride 330 mg"
    },
    {
     "drug": "Calcium Gluconate",
     "dose": "1650 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Gluconate 1650 mg"
    },
    {
     "drug": "Dexamethasone",
     "dose": "10 mg",
     "mL": null,
     "route": null,
     "verbatim": "Dexamethasone 10 mg"
    },
    {
     "drug": "Dextrose 10%",
     "dose": "82.5 mL",
     "mL": "82.5 mL",
     "route": null,
     "verbatim": "Dextrose 10% 82.5 mL"
    },
    {
     "drug": "Diazepam (0.1 mg/kg)",
     "dose": "1.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.1 mg/kg) 1.65 mg"
    },
    {
     "drug": "Diazepam (0.2 mg/kg)",
     "dose": "3.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.2 mg/kg) 3.3 mg"
    },
    {
     "drug": "Diphenhydramine (1 mg/kg)",
     "dose": "16.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diphenhydramine (1 mg/kg) 16.5 mg"
    },
    {
     "drug": "Epinephrine 1:10,000",
     "dose": "0.17 mg",
     "mL": null,
     "route": null,
     "verbatim": "Epinephrine 1:10,000 0.17 mg"
    },
    {
     "drug": "Epinephrine 1:1000 Nebulized",
     "dose": "3 mg",
     "mL": null,
     "route": "Nebulized",
     "verbatim": "Epinephrine 1:1000 Nebulized 3 mg"
    },
    {
     "drug": "Epinephrine 1:1000 IM",
     "dose": "0.15 mg",
     "mL": null,
     "route": "IM",
     "verbatim": "Epinephrine 1:1000 IM 0.15 mg"
    },
    {
     "drug": "Epinephrine Racemic 2.25%",
     "dose": "0.5 mL",
     "mL": "0.5 mL",
     "route": null,
     "verbatim": "Epinephrine Racemic 2.25% 0.5 mL"
    },
    {
     "drug": "Fentanyl",
     "dose": "8.25 – 16.5 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Fentanyl 8.25 – 16.5 mcg"
    },
    {
     "drug": "Glucagon",
     "dose": "0.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Glucagon 0.5 mg"
    },
    {
     "drug": "Glucose Oral",
     "dose": "1 tube",
     "mL": null,
     "route": "Oral",
     "verbatim": "Glucose Oral 1 tube"
    },
    {
     "drug": "Hydrocortisone",
     "dose": "33 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydrocortisone 33 mg"
    },
    {
     "drug": "Hydromorphone",
     "dose": "0.17 – 0.33",
     "mL": null,
     "route": null,
     "verbatim": "Hydromorphone 0.17 – 0.33",
     "note": "No unit printed."
    },
    {
     "drug": "Hydroxocobalamin",
     "dose": "1155 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydroxocobalamin 1155 mg"
    },
    {
     "drug": "Ibuprofen",
     "dose": "165 mg",
     "mL": null,
     "route": null,
     "verbatim": "Ibuprofen 165 mg"
    },
    {
     "drug": "Ipratropium w/ albuterol",
     "dose": "500 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Ipratropium w/ albuterol 500 mcg"
    },
    {
     "drug": "Ketamine 0.1 – 0.25 mg/kg IV",
     "dose": "1.65 – 4.13 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ketamine 0.1 – 0.25 mg/kg IV 1.65 – 4.13 mg"
    },
    {
     "drug": "Ketamine 0.5 – 1.0 mg/kg IN",
     "dose": "8.25 – 16.5 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Ketamine 0.5 – 1.0 mg/kg IN 8.25 – 16.5 mg"
    },
    {
     "drug": "Lidocaine - Cardiac Arrest",
     "dose": "16.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lidocaine - Cardiac Arrest 16.5 mg"
    },
    {
     "drug": "Lidocaine - Intraosseous",
     "dose": "8.25 mg",
     "mL": null,
     "route": "IO",
     "verbatim": "Lidocaine - Intraosseous 8.25 mg"
    },
    {
     "drug": "Lorazepam (0.05 mg/kg)",
     "dose": "0.83 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.05 mg/kg) 0.83 mg"
    },
    {
     "drug": "Lorazepam (0.1 mg/kg)",
     "dose": "1.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.1 mg/kg) 1.65 mg"
    },
    {
     "drug": "Magnesium Sulfate - Asthma (40 mg/kg)",
     "dose": "660 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Asthma (40 mg/kg) 660 mg"
    },
    {
     "drug": "Magnesium Sulfate - Torsades (25 – 50 mg/kg)",
     "dose": "412.5 - 825 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Torsades (25 – 50 mg/kg) 412.5 - 825 mg"
    },
    {
     "drug": "Methylprednisolone (1 mg/kg)",
     "dose": "16.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (1 mg/kg) 16.5 mg"
    },
    {
     "drug": "Methylprednisolone (2 mg/kg)",
     "dose": "32 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (2 mg/kg) 32 mg",
     "note": "Printed '32 mg'; 2 x 16.5 would be 33. Transcribed as printed; verify."
    },
    {
     "drug": "Midazolam (0.05 mg/kg)",
     "dose": "0.83 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.05 mg/kg) 0.83 mg"
    },
    {
     "drug": "Midazolam (0.1 mg/kg)",
     "dose": "1.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.1 mg/kg) 1.65 mg"
    },
    {
     "drug": "Midazolam (0.2 mg/kg)",
     "dose": "3.3 mg mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.2 mg/kg) 3.3 mg mg",
     "note": "Printed '3.3 mg mg' (duplicated unit)."
    },
    {
     "drug": "Morphine Sulfate",
     "dose": "1.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Morphine Sulfate 1.65 mg"
    },
    {
     "drug": "Naloxone – IN",
     "dose": "1 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Naloxone – IN 1 mg"
    },
    {
     "drug": "Ondansetron – IV",
     "dose": "1.65 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ondansetron – IV 1.65 mg"
    },
    {
     "drug": "Ondansetron - ODT",
     "dose": "2 mg",
     "mL": null,
     "route": "ODT",
     "verbatim": "Ondansetron - ODT 2 mg"
    },
    {
     "drug": "Pralidoxime IV",
     "dose": "330 - 825 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Pralidoxime IV 330 - 825 mg"
    },
    {
     "drug": "Proparacaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Proparacaine 2 drops"
    },
    {
     "drug": "Sodium Bicarbonate",
     "dose": "16.5 mEq",
     "mL": null,
     "route": null,
     "verbatim": "Sodium Bicarbonate 16.5 mEq"
    },
    {
     "drug": "Tretracaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Tretracaine 2 drops"
    },
    {
     "drug": "Acetaminophen",
     "dose": "247.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Acetaminophen 247.5 mg"
    },
    {
     "drug": "Adenosine: 1st Dose",
     "dose": "1.65 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: 1st Dose- 1.65 mg"
    },
    {
     "drug": "Adenosine: Repeat Dose",
     "dose": "3.3 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: Repeat Dose- 3.3 mg"
    }
   ],
   "fluids": {
    "normalSaline": "165-330 ml"
   },
   "equipment": {
    "etTube": "5.0",
    "bladeSize": "2",
    "notPrinted": [
     "SGA/i-gel",
     "OPA",
     "NPA",
     "BVM",
     "suction catheter",
     "IV/IO",
     "NG/OG"
    ]
   },
   "energies": {
    "defibrillation": "30 J, 70 J",
    "cardioversion": "8 J, 15 J"
   },
   "source": {
    "document": "NH Patient Care Protocols v9.3 (effective 2025-11-07)",
    "section": "Appendix A3 – Pediatric Color Coded Appendix",
    "printedPageLabel": "Appendix 3 (Page 2 of 3)",
    "pdfPageIndex": 254,
    "driveImage": "NH Patient Care Protocols v9.3 (effective 2025-11-07)_Page_254.jpg",
    "footerYear": "2024"
   }
  },
  {
   "color": "Blue",
   "ageLabel": "5-6 yrs",
   "weightKg": "19-22 Kg (Avg 20.75 Kg)",
   "length": "110-122 cm",
   "vitals": {
    "heartRate": "100",
    "respirations": "20-24",
    "bpSystolic": "100 (+/-15)"
   },
   "drugs": [
    {
     "drug": "Albuterol",
     "dose": "2.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Albuterol 2.5 mg"
    },
    {
     "drug": "Amiodarone",
     "dose": "103.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Amiodarone 103.5 mg",
     "note": "Printed '103.5 mg'; 5 x 20.75 would be 103.75. Transcribed as printed; verify."
    },
    {
     "drug": "Atropine- Bradycardia",
     "dose": "0.42 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine- Bradycardia 0.42 mg"
    },
    {
     "drug": "Atropine - Organophosphate Poison",
     "dose": "1.04 – 2.08 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine - Organophosphate Poison 1.04 – 2.08 mg"
    },
    {
     "drug": "Calcium Chloride",
     "dose": "415 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Chloride 415 mg"
    },
    {
     "drug": "Calcium Gluconate",
     "dose": "2075 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Gluconate 2075 mg"
    },
    {
     "drug": "Dexamethasone",
     "dose": "10 mg",
     "mL": null,
     "route": null,
     "verbatim": "Dexamethasone 10 mg"
    },
    {
     "drug": "Dextrose 10%",
     "dose": "103.75 mL",
     "mL": "103.75 mL",
     "route": null,
     "verbatim": "Dextrose 10% 103.75 mL"
    },
    {
     "drug": "Diazepam (0.1 mg/kg)",
     "dose": "2.08 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.1 mg/kg) 2.08 mg"
    },
    {
     "drug": "Diazepam (0.2 mg/kg)",
     "dose": "4.15 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.2 mg/kg) 4.15 mg"
    },
    {
     "drug": "Diphenhydramine (1 mg/kg)",
     "dose": "20.75 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diphenhydramine (1 mg/kg) 20.75 mg"
    },
    {
     "drug": "Epinephrine 1:10,000",
     "dose": "0.21 mg",
     "mL": null,
     "route": null,
     "verbatim": "Epinephrine 1:10,000 0.21 mg"
    },
    {
     "drug": "Epinephrine 1:1000 Nebulized",
     "dose": "3 mg",
     "mL": null,
     "route": "Nebulized",
     "verbatim": "Epinephrine 1:1000 Nebulized 3 mg"
    },
    {
     "drug": "Epinephrine 1:1000 IM",
     "dose": "0.15 mg",
     "mL": null,
     "route": "IM",
     "verbatim": "Epinephrine 1:1000 IM 0.15 mg"
    },
    {
     "drug": "Epinephrine Racemic 2.25%",
     "dose": "0.5 mL",
     "mL": "0.5 mL",
     "route": null,
     "verbatim": "Epinephrine Racemic 2.25% 0.5 mL"
    },
    {
     "drug": "Fentanyl",
     "dose": "10.38 – 20.75 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Fentanyl 10.38 – 20.75 mcg"
    },
    {
     "drug": "Glucagon",
     "dose": "1 mg",
     "mL": null,
     "route": null,
     "verbatim": "Glucagon 1 mg"
    },
    {
     "drug": "Glucose Oral",
     "dose": "1 tube",
     "mL": null,
     "route": "Oral",
     "verbatim": "Glucose Oral 1 tube"
    },
    {
     "drug": "Hydrocortisone",
     "dose": "41.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydrocortisone 41.5 mg"
    },
    {
     "drug": "Hydromorphone",
     "dose": "0.21 – 0.42",
     "mL": null,
     "route": null,
     "verbatim": "Hydromorphone 0.21 – 0.42",
     "note": "No unit printed."
    },
    {
     "drug": "Hydroxocobalamin",
     "dose": "1452.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydroxocobalamin 1452.5 mg"
    },
    {
     "drug": "Ibuprofen",
     "dose": "208 mg",
     "mL": null,
     "route": null,
     "verbatim": "Ibuprofen 208 mg"
    },
    {
     "drug": "Ipratropium w/ albuterol",
     "dose": "500 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Ipratropium w/ albuterol 500 mcg"
    },
    {
     "drug": "Ketamine 0.1 – 0.25 mg/kg IV",
     "dose": "2.08 – 5.19 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ketamine 0.1 – 0.25 mg/kg IV 2.08 – 5.19 mg"
    },
    {
     "drug": "Ketamine 0.5 – 1.0 mg/kg IN",
     "dose": "10.38 – 20.75 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Ketamine 0.5 – 1.0 mg/kg IN 10.38 – 20.75 mg"
    },
    {
     "drug": "Lidocaine - Cardiac Arrest",
     "dose": "20.75 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lidocaine - Cardiac Arrest 20.75 mg"
    },
    {
     "drug": "Lidocaine - Intraosseous",
     "dose": "10.38 mg",
     "mL": null,
     "route": "IO",
     "verbatim": "Lidocaine - Intraosseous 10.38 mg"
    },
    {
     "drug": "Lorazepam (0.05 mg/kg)",
     "dose": "1.04 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.05 mg/kg) 1.04 mg"
    },
    {
     "drug": "Lorazepam (0.1 mg/kg)",
     "dose": "2.08 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.1 mg/kg) 2.08 mg"
    },
    {
     "drug": "Magnesium Sulfate - Asthma (40 mg/kg)",
     "dose": "830 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Asthma (40 mg/kg) 830 mg"
    },
    {
     "drug": "Magnesium Sulfate - Torsades (25 – 50 mg/kg)",
     "dose": "518.75 – 1037.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Torsades (25 – 50 mg/kg) 518.75 – 1037.5 mg"
    },
    {
     "drug": "Methylprednisolone (1 mg/kg)",
     "dose": "20.75 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (1 mg/kg) 20.75 mg"
    },
    {
     "drug": "Methylprednisolone (2 mg/kg)",
     "dose": "41.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (2 mg/kg) 41.5 mg"
    },
    {
     "drug": "Midazolam (0.05 mg/kg)",
     "dose": "1.04 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.05 mg/kg) 1.04 mg"
    },
    {
     "drug": "Midazolam (0.1 mg/kg)",
     "dose": "2.08 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.1 mg/kg) 2.08 mg"
    },
    {
     "drug": "Midazolam (0.2 mg/kg)",
     "dose": "4.15 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.2 mg/kg) 4.15 mg"
    },
    {
     "drug": "Morphine Sulfate",
     "dose": "2.08 mg",
     "mL": null,
     "route": null,
     "verbatim": "Morphine Sulfate 2.08 mg"
    },
    {
     "drug": "Naloxone – IN",
     "dose": "2 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Naloxone – IN 2 mg"
    },
    {
     "drug": "Ondansetron – IV",
     "dose": "2.08 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ondansetron – IV 2.08 mg"
    },
    {
     "drug": "Ondansetron - ODT",
     "dose": "2 mg",
     "mL": null,
     "route": "ODT",
     "verbatim": "Ondansetron - ODT 2 mg"
    },
    {
     "drug": "Pralidoxime IV",
     "dose": "415 – 1037.5 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Pralidoxime IV 415 – 1037.5 mg"
    },
    {
     "drug": "Proparacaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Proparacaine 2 drops"
    },
    {
     "drug": "Sodium Bicarbonate",
     "dose": "20.8 mEq",
     "mL": null,
     "route": null,
     "verbatim": "Sodium Bicarbonate 20.8 mEq"
    },
    {
     "drug": "Tretracaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Tretracaine 2 drops"
    },
    {
     "drug": "Acetaminophen",
     "dose": "311.25 mg",
     "mL": null,
     "route": null,
     "verbatim": "Acetaminophen 311.25 mg"
    },
    {
     "drug": "Adenosine: 1st Dose",
     "dose": "2.08 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: 1st Dose- 2.08 mg"
    },
    {
     "drug": "Adenosine: Repeat Dose",
     "dose": "4.15 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: Repeat Dose- 4.15 mg"
    }
   ],
   "fluids": {
    "normalSaline": "205-410 ml"
   },
   "equipment": {
    "etTube": "5.5",
    "bladeSize": "2",
    "notPrinted": [
     "SGA/i-gel",
     "OPA",
     "NPA",
     "BVM",
     "suction catheter",
     "IV/IO",
     "NG/OG"
    ]
   },
   "energies": {
    "defibrillation": "40 J, 85 J",
    "cardioversion": "10 J, 20 J"
   },
   "source": {
    "document": "NH Patient Care Protocols v9.3 (effective 2025-11-07)",
    "section": "Appendix A3 – Pediatric Color Coded Appendix",
    "printedPageLabel": "Appendix 3 (Page 3 of 3)",
    "pdfPageIndex": 255,
    "driveImage": "NH Patient Care Protocols v9.3 (effective 2025-11-07)_Page_255.jpg",
    "footerYear": "2024"
   }
  },
  {
   "color": "Orange",
   "ageLabel": "7-9 yrs",
   "weightKg": "24-30 Kg (Avg 27 Kg)",
   "length": "122-137 cm",
   "vitals": {
    "heartRate": "90",
    "respirations": "18-22",
    "bpSystolic": "105 (+/-15)"
   },
   "drugs": [
    {
     "drug": "Albuterol",
     "dose": "2.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Albuterol 2.5 mg"
    },
    {
     "drug": "Amiodarone",
     "dose": "135 mg",
     "mL": null,
     "route": null,
     "verbatim": "Amiodarone 135 mg"
    },
    {
     "drug": "Atropine- Bradycardia",
     "dose": "0.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine- Bradycardia 0.5 mg"
    },
    {
     "drug": "Atropine - Organophosphate Poison",
     "dose": "1.35 – 2.7 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine - Organophosphate Poison 1.35 – 2.7 mg"
    },
    {
     "drug": "Calcium Chloride",
     "dose": "540 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Chloride 540 mg"
    },
    {
     "drug": "Calcium Gluconate",
     "dose": "2700 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Gluconate 2700 mg"
    },
    {
     "drug": "Dexamethasone",
     "dose": "10 mg",
     "mL": null,
     "route": null,
     "verbatim": "Dexamethasone 10 mg"
    },
    {
     "drug": "Dextrose 10%",
     "dose": "135 mL",
     "mL": "135 mL",
     "route": null,
     "verbatim": "Dextrose 10% 135 mL"
    },
    {
     "drug": "Diazepam (0.1 mg/kg)",
     "dose": "2.7 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.1 mg/kg) 2.7 mg"
    },
    {
     "drug": "Diazepam (0.2 mg/kg)",
     "dose": "5.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.2 mg/kg) 5.4 mg"
    },
    {
     "drug": "Diphenhydramine (1 mg/kg)",
     "dose": "27 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diphenhydramine (1 mg/kg) 27 mg"
    },
    {
     "drug": "Epinephrine 1:10,000",
     "dose": "0.27 mg",
     "mL": null,
     "route": null,
     "verbatim": "Epinephrine 1:10,000 0.27 mg"
    },
    {
     "drug": "Epinephrine 1:1000 Nebulized",
     "dose": "3 mg",
     "mL": null,
     "route": "Nebulized",
     "verbatim": "Epinephrine 1:1000 Nebulized 3 mg"
    },
    {
     "drug": "Epinephrine 1:1000 IM",
     "dose": "0.3 mg",
     "mL": null,
     "route": "IM",
     "verbatim": "Epinephrine 1:1000 IM 0.3 mg"
    },
    {
     "drug": "Epinephrine Racemic 2.25%",
     "dose": "0.5 mL",
     "mL": "0.5 mL",
     "route": null,
     "verbatim": "Epinephrine Racemic 2.25% 0.5 mL"
    },
    {
     "drug": "Fentanyl",
     "dose": "13.5 - 27 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Fentanyl 13.5 - 27 mcg"
    },
    {
     "drug": "Glucagon",
     "dose": "1 mg",
     "mL": null,
     "route": null,
     "verbatim": "Glucagon 1 mg"
    },
    {
     "drug": "Glucose Oral",
     "dose": "1 tube",
     "mL": null,
     "route": "Oral",
     "verbatim": "Glucose Oral 1 tube"
    },
    {
     "drug": "Hydrocortisone",
     "dose": "50 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydrocortisone 50 mg"
    },
    {
     "drug": "Hydromorphone",
     "dose": "0.27 – 0.54",
     "mL": null,
     "route": null,
     "verbatim": "Hydromorphone 0.27 – 0.54",
     "note": "No unit printed."
    },
    {
     "drug": "Hydroxocobalamin",
     "dose": "1890 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydroxocobalamin 1890 mg"
    },
    {
     "drug": "Ibuprofen",
     "dose": "270 mg",
     "mL": null,
     "route": null,
     "verbatim": "Ibuprofen 270 mg"
    },
    {
     "drug": "Ipratropium w/ albuterol",
     "dose": "500 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Ipratropium w/ albuterol 500 mcg"
    },
    {
     "drug": "Ketamine 0.1 – 0.25 mg/kg IV",
     "dose": "2.7 – 6.75 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ketamine 0.1 – 0.25 mg/kg IV 2.7 – 6.75 mg"
    },
    {
     "drug": "Ketamine 0.5 – 1.0 mg/kg IN",
     "dose": "13.5 - 27 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Ketamine 0.5 – 1.0 mg/kg IN 13.5 - 27 mg"
    },
    {
     "drug": "Lidocaine - Cardiac Arrest",
     "dose": "27 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lidocaine - Cardiac Arrest 27 mg"
    },
    {
     "drug": "Lidocaine - Intraosseous",
     "dose": "13.5 mg",
     "mL": null,
     "route": "IO",
     "verbatim": "Lidocaine - Intraosseous 13.5 mg"
    },
    {
     "drug": "Lorazepam (0.05 mg/kg)",
     "dose": "1.35 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.05 mg/kg) 1.35 mg"
    },
    {
     "drug": "Lorazepam (0.1 mg/kg)",
     "dose": "2.7 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.1 mg/kg) 2.7 mg"
    },
    {
     "drug": "Magnesium Sulfate - Asthma (40 mg/kg)",
     "dose": "1080 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Asthma (40 mg/kg) 1080 mg"
    },
    {
     "drug": "Magnesium Sulfate - Torsades (25 – 50 mg/kg)",
     "dose": "675 - 1350 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Torsades (25 – 50 mg/kg) 675 - 1350 mg"
    },
    {
     "drug": "Methylprednisolone (1 mg/kg)",
     "dose": "27 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (1 mg/kg) 27 mg"
    },
    {
     "drug": "Methylprednisolone (2 mg/kg)",
     "dose": "54 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (2 mg/kg) 54 mg"
    },
    {
     "drug": "Midazolam (0.05 mg/kg)",
     "dose": "1.35 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.05 mg/kg) 1.35 mg"
    },
    {
     "drug": "Midazolam (0.1 mg/kg)",
     "dose": "2.7 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.1 mg/kg) 2.7 mg"
    },
    {
     "drug": "Midazolam (0.2 mg/kg)",
     "dose": "5.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.2 mg/kg) 5.4 mg"
    },
    {
     "drug": "Morphine Sulfate",
     "dose": "2.7 mg",
     "mL": null,
     "route": null,
     "verbatim": "Morphine Sulfate 2.7 mg"
    },
    {
     "drug": "Naloxone – IN",
     "dose": "2 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Naloxone – IN 2 mg"
    },
    {
     "drug": "Ondansetron – IV",
     "dose": "2.7 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ondansetron – IV 2.7 mg"
    },
    {
     "drug": "Ondansetron - ODT",
     "dose": "2 mg",
     "mL": null,
     "route": "ODT",
     "verbatim": "Ondansetron - ODT 2 mg"
    },
    {
     "drug": "Pralidoxime IV",
     "dose": "540 - 1350 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Pralidoxime IV 540 - 1350 mg"
    },
    {
     "drug": "Proparacaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Proparacaine 2 drops"
    },
    {
     "drug": "Sodium Bicarbonate",
     "dose": "27 mEq",
     "mL": null,
     "route": null,
     "verbatim": "Sodium Bicarbonate 27 mEq"
    },
    {
     "drug": "Tretracaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Tretracaine 2 drops"
    },
    {
     "drug": "Acetaminophen",
     "dose": "405 mg",
     "mL": null,
     "route": null,
     "verbatim": "Acetaminophen 405 mg"
    },
    {
     "drug": "Adenosine: 1st Dose",
     "dose": "2.7 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: 1st Dose- 2.7 mg"
    },
    {
     "drug": "Adenosine: Repeat Dose",
     "dose": "5.4 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: Repeat Dose- 5.4 mg"
    }
   ],
   "fluids": {
    "normalSaline": "250-500 ml"
   },
   "equipment": {
    "etTube": "6.0",
    "bladeSize": "2-3",
    "notPrinted": [
     "SGA/i-gel",
     "OPA",
     "NPA",
     "BVM",
     "suction catheter",
     "IV/IO",
     "NG/OG"
    ]
   },
   "energies": {
    "defibrillation": "50 J, 100 J",
    "cardioversion": "15 J, 30 J"
   },
   "source": {
    "document": "NH Patient Care Protocols v9.3 (effective 2025-11-07)",
    "section": "Appendix A3 – Pediatric Color Coded Appendix",
    "printedPageLabel": "Appendix 3 (Page 3 of 3)",
    "pdfPageIndex": 255,
    "driveImage": "NH Patient Care Protocols v9.3 (effective 2025-11-07)_Page_255.jpg",
    "footerYear": "2024"
   }
  },
  {
   "color": "Green",
   "ageLabel": "10-12 yrs",
   "weightKg": "32-40 Kg (Avg 36 Kg)",
   "length": "137-150 cm",
   "vitals": {
    "heartRate": "85-90",
    "respirations": "16-22",
    "bpSystolic": "115 (+/-20)"
   },
   "drugs": [
    {
     "drug": "Albuterol",
     "dose": "2.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Albuterol 2.5 mg"
    },
    {
     "drug": "Amiodarone",
     "dose": "180 mg",
     "mL": null,
     "route": null,
     "verbatim": "Amiodarone 180 mg"
    },
    {
     "drug": "Atropine- Bradycardia",
     "dose": "0.5 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine- Bradycardia 0.5 mg"
    },
    {
     "drug": "Atropine - Organophosphate Poison",
     "dose": "1.8 – 3.6 mg",
     "mL": null,
     "route": null,
     "verbatim": "Atropine - Organophosphate Poison 1.8 – 3.6 mg"
    },
    {
     "drug": "Calcium Chloride",
     "dose": "720 mg",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Chloride 720 mg"
    },
    {
     "drug": "Calcium Gluconate",
     "dose": "3 grams",
     "mL": null,
     "route": null,
     "verbatim": "Calcium Gluconate 3 grams"
    },
    {
     "drug": "Dexamethasone",
     "dose": "10 mg",
     "mL": null,
     "route": null,
     "verbatim": "Dexamethasone 10 mg"
    },
    {
     "drug": "Dextrose 10%",
     "dose": "180 mL",
     "mL": "180 mL",
     "route": null,
     "verbatim": "Dextrose 10% 180 mL"
    },
    {
     "drug": "Diazepam (0.1 mg/kg)",
     "dose": "3.6 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.1 mg/kg) 3.6 mg"
    },
    {
     "drug": "Diazepam (0.2 mg/kg)",
     "dose": "7.2 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diazepam (0.2 mg/kg) 7.2 mg"
    },
    {
     "drug": "Diphenhydramine (1 mg/kg)",
     "dose": "36 mg",
     "mL": null,
     "route": null,
     "verbatim": "Diphenhydramine (1 mg/kg) 36 mg"
    },
    {
     "drug": "Epinephrine 1:10,000",
     "dose": "0.36 mg",
     "mL": null,
     "route": null,
     "verbatim": "Epinephrine 1:10,000 0.36 mg"
    },
    {
     "drug": "Epinephrine 1:1000 Nebulized",
     "dose": "3 mg",
     "mL": null,
     "route": "Nebulized",
     "verbatim": "Epinephrine 1:1000 Nebulized 3 mg"
    },
    {
     "drug": "Epinephrine 1:1000 IM",
     "dose": "0.3 mg",
     "mL": null,
     "route": "IM",
     "verbatim": "Epinephrine 1:1000 IM 0.3 mg"
    },
    {
     "drug": "Epinephrine Racemic 2.25%",
     "dose": "0.5 mL",
     "mL": "0.5 mL",
     "route": null,
     "verbatim": "Epinephrine Racemic 2.25% 0.5 mL"
    },
    {
     "drug": "Fentanyl",
     "dose": "18 - 36 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Fentanyl 18 - 36 mcg"
    },
    {
     "drug": "Glucagon",
     "dose": "1 mg",
     "mL": null,
     "route": null,
     "verbatim": "Glucagon 1 mg"
    },
    {
     "drug": "Glucose Oral",
     "dose": "1 tube",
     "mL": null,
     "route": "Oral",
     "verbatim": "Glucose Oral 1 tube"
    },
    {
     "drug": "Hydrocortisone",
     "dose": "50 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydrocortisone 50 mg"
    },
    {
     "drug": "Hydromorphone",
     "dose": "0.36 – 0.72",
     "mL": null,
     "route": null,
     "verbatim": "Hydromorphone 0.36 – 0.72",
     "note": "No unit printed."
    },
    {
     "drug": "Hydroxocobalamin",
     "dose": "2520 mg",
     "mL": null,
     "route": null,
     "verbatim": "Hydroxocobalamin 2520 mg"
    },
    {
     "drug": "Ibuprofen",
     "dose": "360 mg",
     "mL": null,
     "route": null,
     "verbatim": "Ibuprofen 360 mg"
    },
    {
     "drug": "Ipratropium w/ albuterol",
     "dose": "500 mcg",
     "mL": null,
     "route": null,
     "verbatim": "Ipratropium w/ albuterol 500 mcg"
    },
    {
     "drug": "Ketamine 0.1 – 0.25 mg/kg IV",
     "dose": "3.6 - 9 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ketamine 0.1 – 0.25 mg/kg IV 3.6 - 9 mg"
    },
    {
     "drug": "Ketamine 0.5 – 1.0 mg/kg IN",
     "dose": "18 - 36 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Ketamine 0.5 – 1.0 mg/kg IN 18 - 36 mg"
    },
    {
     "drug": "Lidocaine - Cardiac Arrest",
     "dose": "36 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lidocaine - Cardiac Arrest 36 mg"
    },
    {
     "drug": "Lidocaine - Intraosseous",
     "dose": "18 mg",
     "mL": null,
     "route": "IO",
     "verbatim": "Lidocaine - Intraosseous 18 mg"
    },
    {
     "drug": "Lorazepam (0.05 mg/kg)",
     "dose": "1.8 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.05 mg/kg) 1.8 mg"
    },
    {
     "drug": "Lorazepam (0.1 mg/kg)",
     "dose": "3.6 mg",
     "mL": null,
     "route": null,
     "verbatim": "Lorazepam (0.1 mg/kg) 3.6 mg"
    },
    {
     "drug": "Magnesium Sulfate - Asthma (40 mg/kg)",
     "dose": "1440 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Asthma (40 mg/kg) 1440 mg"
    },
    {
     "drug": "Magnesium Sulfate - Torsades (25 – 50 mg/kg)",
     "dose": "900 - 1800 mg",
     "mL": null,
     "route": null,
     "verbatim": "Magnesium Sulfate - Torsades (25 – 50 mg/kg) 900 - 1800 mg"
    },
    {
     "drug": "Methylprednisolone (1 mg/kg)",
     "dose": "36 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (1 mg/kg) 36 mg"
    },
    {
     "drug": "Methylprednisolone (2 mg/kg)",
     "dose": "72 mg",
     "mL": null,
     "route": null,
     "verbatim": "Methylprednisolone (2 mg/kg) 72 mg"
    },
    {
     "drug": "Midazolam (0.05 mg/kg)",
     "dose": "1.8 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.05 mg/kg) 1.8 mg"
    },
    {
     "drug": "Midazolam (0.1 mg/kg)",
     "dose": "3.6 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.1 mg/kg) 3.6 mg"
    },
    {
     "drug": "Midazolam (0.2 mg/kg)",
     "dose": "7.2 mg",
     "mL": null,
     "route": null,
     "verbatim": "Midazolam (0.2 mg/kg) 7.2 mg"
    },
    {
     "drug": "Morphine Sulfate",
     "dose": "3.6 mg",
     "mL": null,
     "route": null,
     "verbatim": "Morphine Sulfate 3.6 mg"
    },
    {
     "drug": "Naloxone – IN",
     "dose": "2 mg",
     "mL": null,
     "route": "IN",
     "verbatim": "Naloxone – IN 2 mg"
    },
    {
     "drug": "Ondansetron – IV",
     "dose": "3.6 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Ondansetron – IV 3.6 mg"
    },
    {
     "drug": "Ondansetron - ODT",
     "dose": "2 mg",
     "mL": null,
     "route": "ODT",
     "verbatim": "Ondansetron - ODT 2 mg"
    },
    {
     "drug": "Pralidoxime IV",
     "dose": "720 - 1800 mg",
     "mL": null,
     "route": "IV",
     "verbatim": "Pralidoxime IV 720 - 1800 mg"
    },
    {
     "drug": "Proparacaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Proparacaine 2 drops"
    },
    {
     "drug": "Sodium Bicarbonate",
     "dose": "36 mEq",
     "mL": null,
     "route": null,
     "verbatim": "Sodium Bicarbonate 36 mEq"
    },
    {
     "drug": "Tretracaine",
     "dose": "2 drops",
     "mL": null,
     "route": null,
     "verbatim": "Tretracaine 2 drops"
    },
    {
     "drug": "Acetaminophen",
     "dose": "540 mg",
     "mL": null,
     "route": null,
     "verbatim": "Acetaminophen 540 mg"
    },
    {
     "drug": "Adenosine: 1st Dose",
     "dose": "3.6 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: 1st Dose- 3.6 mg"
    },
    {
     "drug": "Adenosine: Repeat Dose",
     "dose": "7.2 mg",
     "mL": null,
     "route": null,
     "verbatim": "Adenosine: Repeat Dose- 7.2 mg"
    }
   ],
   "fluids": {
    "normalSaline": "250-500 ml"
   },
   "equipment": {
    "etTube": "6.5",
    "bladeSize": "3",
    "notPrinted": [
     "SGA/i-gel",
     "OPA",
     "NPA",
     "BVM",
     "suction catheter",
     "IV/IO",
     "NG/OG"
    ]
   },
   "energies": {
    "defibrillation": "60 J, 150 J",
    "cardioversion": "15 J, 30 J"
   },
   "source": {
    "document": "NH Patient Care Protocols v9.3 (effective 2025-11-07)",
    "section": "Appendix A3 – Pediatric Color Coded Appendix",
    "printedPageLabel": "Appendix 3 (Page 3 of 3)",
    "pdfPageIndex": 255,
    "driveImage": "NH Patient Care Protocols v9.3 (effective 2025-11-07)_Page_255.jpg",
    "footerYear": "2024"
   }
  }
 ],
 "other": [
  {
   "item": "Pediatric post-resuscitation hypotension target",
   "verbatim": "Pediatric: 1 -10 years of age: Maintain systolic blood pressure 70 mmHg + (2 x age)",
   "context": "ADVANCED EMT STANDING ORDERS -ADULT & PEDIATRIC, For post resuscitation hypotension; followed by 'Administer fluid bolus of 10 - 20 ml/kg by syringe push method (may repeat to a maximum 60 ml/kg)'",
   "source": {
    "protocol": "Post Resuscitative Care – Adult & Pediatric 3.4",
    "pdfPageIndex": 90
   },
   "note": "Only age-based SBP formula found in the text-extractable pages (1-133). It is scoped to post-ROSC care, not a general hypotension definition."
  },
  {
   "item": "Tachypnea in children",
   "verbatim": "Tachypnea in children is defined as: < 2 months: 60 bpm; 2-12 months: 50 bpm; 1-5 years: 40 bpm; >5 years: 20 bpm",
   "source": {
    "protocol": "Pediatric Respiratory Distress – Asthma, Bronchiolitis, Croup 2.3P (PEARLS)",
    "pdfPageIndex": 30
   },
   "note": "Confirmed in both PDF text and page-030 image OCR."
  },
  {
   "item": "Infant/neonate bradycardia CPR threshold",
   "verbatim": "In infants and neonates only: begin/continue CPR if heart rate is <60 bpm with hypoperfusion despite adequate ventilation and oxygenation",
   "source": {
    "protocol": "Bradycardia – Pediatric 3.1P",
    "pdfPageIndex": 83
   }
  },
  {
   "item": "Pediatric defibrillation (weight-based)",
   "verbatim": "Defibrillate at 2 J/kg; perform CPR for 2 minutes and recheck rhythm. Second defibrillation at 4 J/kg; perform CPR for 2 minutes and recheck rhythm. Subsequent defibrillations at 2: 4 J/Kg, maximum 10 J/Kg or adult dose",
   "source": {
    "protocol": "Cardiac Arrest – Pediatric 3.2P (Paramedic standing orders)",
    "pdfPageIndex": 87
   },
   "note": "'at 2: 4 J/Kg' is as extracted (likely '≥ 4 J/kg' with a mis-OCR'd symbol); verify against page image."
  },
  {
   "item": "Pediatric synchronized cardioversion",
   "verbatim": "Synchronized cardioversion: 0.5 - 1 J/kg, if unsuccessful, increase to 2 J/kg",
   "source": {
    "protocol": "Tachycardia – Pediatric 3.5P (Paramedic standing orders)",
    "pdfPageIndex": 93
   }
  },
  {
   "item": "Pediatric post-ROSC ventilation rate",
   "verbatim": "Initial ventilation rate of 10 - 12 BPM for adults and 20 bpm for pediatric, then titrate to capnography of 35 to 40 mm Hg, if available.",
   "source": {
    "protocol": "Post Resuscitative Care 3.4 (EMT/Advanced EMT standing orders)",
    "pdfPageIndex": 90
   }
  },
  {
   "item": "HFNC weight-based flow rate table",
   "rows": [
    {
     "weight": "Up to 12 kg",
     "flowRate": "2 L/kg/min"
    },
    {
     "weight": "13-15 kg",
     "flowRate": "30 L/min"
    },
    {
     "weight": "16-30 kg",
     "flowRate": "35 L/min (text extraction reads '35 Umln')"
    },
    {
     "weight": "31-50 kg",
     "flowRate": "40 L/min"
    },
    {
     "weight": ">50 kg",
     "flowRate": "50 L/min"
    }
   ],
   "verbatim": "Start HFNC at 2 L/kg/min for infants up to 12 kg. Start flow rates for those over 12 kg using weight-based flow rates as per table below.",
   "source": {
    "protocol": "High Flow Nasal Cannula 5.8 (Paramedic)",
    "pdfPageIndex": 125
   },
   "note": "ALS-only."
  },
  {
   "item": "Pediatric needle decompression catheter",
   "verbatim": "perform needle decompression using 14-16 gauge 1.50 - 2.00 inch angiocath or any other commercially available device intended for pediatric needle ...",
   "source": {
    "protocol": "Thoracic Injuries – Adult & Pediatric 4.8 (Paramedic standing orders - Pediatric)",
    "pdfPageIndex": 109
   },
   "note": "ALS-only."
  }
 ]
};
