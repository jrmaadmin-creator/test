// NH Patient Care Protocols v9.3 cardiac arrest timing (3.2A, 3.2P, 3.6, 6.1, 8.15), extracted 2026-10-04. NOT YET VERIFIED.
// Each block keeps the NH verbatim text and cite. Numbers used by the timer:
//   cycleSeconds 120      = "2 min cycles" (3.2A/3.2P)
//   epi intervalSeconds 240 = "every other cycle" of 2-min cycles; adult first dose after the first cycle (3.2A p.85)
//   metronome bpm 110     = inside the NH range 100-120 (3.6 p.94; "at least 100 and less than 120", p.95)
//   torMinimumSeconds 1200 = "minimum 20 min" of resuscitation after arrival (8.15 p.216)
export default {
 "version": "NH PCP v9.3",
 "verified": false,
 "cycleSeconds": 120,
 "cycleCite": {
  "value": "2 min cycles",
  "verbatim": "Perform 2 minute cycles of uninterrupted chest compressions.",
  "cite": "3.2A, PDF p. 84",
  "level": "Top box (all levels, no level heading)"
 },
 "metronome": {
  "bpm": 110,
  "range": {
   "value": "100-120 bpm",
   "verbatim": "Monitor CPR quality and use of metronome at 100 - 120 bpm",
   "cite": "3.6, PDF p. 94",
   "level": "Policy (no level heading)"
  },
  "rate": {
   "value": "At least 100 and less than 120/min",
   "verbatim": "A rate of at least 100 and less than 120 compressions/minute - Use of metronome or CPR feedback device is essential. (e.g., built into monitor or smart phone app)",
   "cite": "3.6, PDF p. 95",
   "level": "Policy Continued (no level heading)"
  }
 },
 "rotation": [
  {
   "value": "At least every 2 min",
   "verbatim": "Switch compressors at least every two minutes to minimize fatigue.",
   "cite": "3.2A, PDF p. 85",
   "level": "PEARLS"
  },
  {
   "value": "Compressors alternate every 1 minute (P1/P2); coordinator calls change every one minute",
   "verbatim": "Initiates 1 minute of chest compressions at rate of 100 - 120 / min ... Alternates 1 minute of chest compressions with Position 1 ... Calls for compressor change every one minute",
   "cite": "3.6, PDF p. 94",
   "level": "Policy (no level heading)"
  }
 ],
 "adult": {
  "ventilation": {
   "value": "NRB passive O2 or BVM 1 breath per 10 compressions, no pause",
   "verbatim": "Apply high flow oxygen via non-rebreather mask (NRB) for passive ventilation OR / BVM ventilation 1 breath every 10 chest compressions without interrupting compressions. / For arrests of non-cardiac etiology, including respiratory and trauma, use BVM ventilation.",
   "cite": "3.2A, PDF p. 84",
   "level": "Top box (all levels, no level heading)"
  },
  "aed": {
   "value": "AED analysis/shock after each 2-min cycle for 4 cycles (8 min)",
   "verbatim": "Continue 2 minute cycles of uninterrupted chest compressions followed by AED analysis and shock for 4 cycles (8 minutes).",
   "cite": "3.2A, PDF p. 84",
   "level": "EMR/EMT STANDING ORDERS - ADULT"
  },
  "airwayAfter": {
   "value": "At 8 min: switch passive to BVM; consider SGA",
   "verbatim": "After 4 cycles (8 minutes): Continue 2 minute cycles of uninterrupted chest compressions. If passive insufflation was used, switch to BVM ventilation. Consider placement of a supraglottic airway without interrupting chest compressions (EMT only).",
   "cite": "3.2A, PDF p. 84",
   "level": "EMR/EMT STANDING ORDERS - ADULT"
  },
  "epi": {
   "firstAfterCycle": 1,
   "intervalSeconds": 240,
   "dose": "1 mg IV (0.1 mg/mL)",
   "level": "AEMT",
   "src": {
    "value": "1 mg IV of 0.1 mg/mL after first 2-min cycle, then every other cycle",
    "verbatim": "After the first 2 minute cycle, consider epinephrine (0.1 mg/mL concentration) 1 mg IV; repeat every other cycle.",
    "cite": "3.2A, PDF p. 85",
    "level": "ADVANCED EMT STANDING ORDERS - ADULT"
   }
  },
  "defib": {
   "value": "Device maximum energy",
   "verbatim": "Defibrillate as indicated at the device’s maximum energy.",
   "cite": "3.2A, PDF p. 85",
   "level": "PARAMEDIC STANDING ORDERS - ADULT"
  },
  "antidysrhythmic": {
   "value": "Per ACLS algorithms (no NH timing/dose in 3.2A)",
   "verbatim": "Administer anti-dysrhythmic, per ACLS algorithms.",
   "cite": "3.2A, PDF p. 85",
   "level": "PARAMEDIC STANDING ORDERS - ADULT"
  },
  "refractoryVf": {
   "value": "DSD (6.2) or change pads to anterior-posterior",
   "verbatim": "If second manual defibrillator is available consider Double Sequential Defibrillation Procedure 6.2. If a second manual defibrillator is not available change pad placement / vector from anterior-apex to anterior-posterior.",
   "cite": "3.2A, PDF p. 85",
   "level": "PARAMEDIC STANDING ORDERS - ADULT"
  },
  "causes": [
   {
    "value": "hypoxia, overdose/poisoning, hypothermia, hypoglycemia, hypovolemia",
    "verbatim": "Consider treatable causes: hypoxia, overdose/poisoning, hypothermia, hypoglycemia, and hypovolemia—treat as per specific protocol.",
    "cite": "3.2A, PDF p. 84",
    "level": "EMR/EMT STANDING ORDERS - ADULT"
   },
   {
    "value": "hemorrhage/hypovolemia, tension pneumothorax, massive MI, PE",
    "verbatim": "Narrow complex PEA is often due to a mechanical cause including hemorrhage / hypovolemia, tension pneumothorax, massive MI and pulmonary embolism.",
    "cite": "3.2A, PDF p. 85",
    "level": "PARAMEDIC STANDING ORDERS - ADULT"
   },
   {
    "value": "hyperkalemia, sodium-channel blocker toxicity",
    "verbatim": "Wide complex PEA is often due to a metabolic cause including hyperkalemia and sodium-channel blocker toxicity. For wide complex PEA consider: Calcium gluconate 3 grams IV, OR calcium chloride (10%) 1 gram IV AND Sodium bicarbonate 1 - 2 mEq/kg IV.",
    "cite": "3.2A, PDF p. 85",
    "level": "PARAMEDIC STANDING ORDERS - ADULT"
   }
  ],
  "mechanical": {
   "value": "Consider delaying until after first 4 cycles (8 min)",
   "verbatim": "Recognizing the goal of immediate uninterrupted chest compressions, consider delaying application of mechanical CPR devices until after the first four cycles (8 minutes). If applied during the first 4 cycles, the goal is to limit interruptions. Mechanical devices should only be used by services that are practiced and skilled at their application.",
   "cite": "3.2A, PDF p. 85",
   "level": "PEARLS"
  }
 },
 "pediatric": {
  "ventilation": {
   "value": "1 provider 30:2; 2 providers 15:2",
   "verbatim": "Ventilation / Oxygenation options: One provider: 30:2 Two providers: 15:2",
   "cite": "3.2P, PDF p. 86",
   "level": "Top box (all levels, no level heading)"
  },
  "advancedAirway": {
   "value": "Continuous compressions, 1 breath every 2-3 s (20-30/min) asynchronous",
   "verbatim": "Advanced airway in place: Continuous chest compressions with one ventilation every 2 – 3 seconds (20 – 30 ventilations per minute) during chest recoil interposed asynchronously.",
   "cite": "3.2P, PDF p. 86",
   "level": "Top box (all levels, no level heading)"
  },
  "pads": {
   "value": "Pediatric pads birth-8 y; adult pads if not overlapping",
   "verbatim": "Apply AED and use as soon as possible. From birth to age 8 years, use pediatric AED pads. If pediatric AED pads are unavailable, providers may use adult AED pads provided the pads do not overlap.",
   "cite": "3.2P, PDF p. 86",
   "level": "EMR/EMT STANDING ORDERS"
  },
  "epi": {
   "firstAfterCycle": null,
   "intervalSeconds": 240,
   "dose": "0.01 mg/kg (0.1 mL/kg of 0.1 mg/mL)",
   "level": "Paramedic",
   "src": {
    "value": "0.01 mg/kg (0.1 mL/kg) of 0.1 mg/mL after second shock, every other cycle",
    "verbatim": "If no response after second defibrillation, administer: Epinephrine* 0.01 mg/kg (0.1 mL/kg) IV/IO repeat every other cycle. *Epinephrine 0.1 mg/mL concentration",
    "cite": "3.2P, PDF p. 87",
    "level": "PARAMEDIC STANDING ORDERS"
   },
   "src2": {
    "value": "0.01 mg/kg every other cycle; first-dose timing not stated",
    "verbatim": "Epinephrine* 0.01 mg/kg (0.1 mL/kg) IV/IO, may repeat every other cycle. Perform CPR for 2 minutes, then check rhythm: If asystole or PEA, continue epinephrine and 2 minutes of CPR until: Pulse obtained OR Shockable rhythm obtained OR Decision made to discontinue further efforts. Contact Medical Direction for guidance.",
    "cite": "3.2P, PDF p. 87",
    "level": "PARAMEDIC STANDING ORDERS"
   }
  },
  "defib": {
   "value": "2 J/kg, then 4 J/kg, then >=4 J/kg (max 10 J/kg or adult dose)",
   "verbatim": "Defibrillate at 2 J/kg; perform CPR for 2 minutes and recheck rhythm. Second defibrillation at 4 J/kg; perform CPR for 2 minutes and recheck rhythm Subsequent defibrillations at ≥ 4 J/Kg, maximum 10 J/Kg or adult dose",
   "cite": "3.2P, PDF p. 87",
   "level": "PARAMEDIC STANDING ORDERS"
  },
  "antidysrhythmic": {
   "value": "After second shock: amiodarone 5 mg/kg (max 300 mg, may repeat up to 2 times) or lidocaine 1 mg/kg (max 100 mg)",
   "verbatim": "If no response after second defibrillation, consider: Amiodarone 5mg/kg (maximum 300 mg) IV/IO; may repeat up to 2 times for refractory VF/VT; OR Lidocaine 1 mg/kg IV/IO (maximum dose 100 mg). For Torsades de Pointes: magnesium sulfate 25 – 50 mg/kg (maximum 2 grams) IV/IO over 1 – 2 minutes.",
   "cite": "3.2P, PDF p. 87",
   "level": "PARAMEDIC STANDING ORDERS"
  },
  "causes": [
   {
    "value": "hypoxia, overdose/poisoning, hypothermia, hypoglycemia, hypovolemia",
    "verbatim": "Consider and correct treatable causes: hypoxia, overdose/poisoning, hypothermia, hypoglycemia and hypovolemia, see specific protocols",
    "cite": "3.2P, PDF p. 86",
    "level": "EMR/EMT STANDING ORDERS"
   },
   {
    "value": "tension pneumothorax, hyperkalemia, CCB/BB OD, TCA OD",
    "verbatim": "Consider tension pneumothorax and treat with needle decompression if indicated. For suspected hyperkalemia or symptomatic calcium channel blocker/beta blocker overdose consider: ... For suspected hyperkalemia or known tricyclic antidepressant overdose consider: ...",
    "cite": "3.2P, PDF p. 87",
    "level": "PARAMEDIC STANDING ORDERS"
   }
  ],
  "mechanical": {
   "value": "Not on children",
   "verbatim": "Do not use mechanical CPR devices on children.",
   "cite": "3.2P, PDF p. 88",
   "level": "PEARLS"
  }
 },
 "etco2": {
  "value": "CPR quality >=20; abrupt rise = ROSC; <20 despite adjustment supports TOR; low after 20 min predicts mortality",
  "verbatim": "High quality chest compressions are achieved when the ETCO2 is at least 20 mmHg. If ETCO2 abruptly increases it is reasonable to consider that this as an indicator of ROSC. To assist with termination of resuscitation efforts when ETCO2 is <20 mmHg despite adjusting the quality of chest compressions. Low ETCO2 production after 20 minutes of effective CPR is a predictor of mortality. See Resuscitation Initiation & Termination Policy 8.15.",
  "cite": "6.1, PDF p. 137",
  "level": "EMT/ADVANCED EMT/PARAMEDIC STANDING ORDERS"
 },
 "torMinimum": {
  "value": "Minimum 20 min of HP resuscitation after arrival on scene",
  "verbatim": "Resuscitation should be terminated when further resuscitation is futile, based on all of the relevant factors. Time should not be used as the deciding factor. At a minimum good quality high performance resuscitation should be conducted for at least 20 minutes after arrival onscene.",
  "cite": "8.15, PDF p. 216",
  "level": "EMT/ADVANCED EMT STANDING ORDERS – ADULT & PEDIATRIC"
 },
 "torMinimumSeconds": 1200,
 "torExtended": {
  "value": "Rhythm factors; narrow PEA >40 or refractory VF/VT: extended resuscitation up to 60 min from dispatch, consider transport; POCUS",
  "verbatim": "Cardiac rhythm: Asystole or slow wide complex PEA at initiation of resuscitation have a very poor prognosis, even with optimal resuscitation. Patients with profound shock may lack a palpable pulse. Narrow complex PEA with a rate above 40 or sustained refractory and recurrent ventricular fibrillation / ventricular tachycardia: Consider early expert consultation with Medical Control. Consider extended resuscitation (i.e., up to 60 minutes from the time of dispatch). Consider transport if reversible causes suspected. Note that residual cardiac activity may occur even in the presence of irreversible cardiac arrest. Cardiac activity on POCUS see POCUS Protocol 7.7, if available, may help guide termination decisions.",
  "cite": "8.15, PDF p. 217",
  "level": "PARAMEDIC STANDING ORDER – ADULT & PEDIATRIC"
 },
 "hypothermia": {
  "value": "No TOR until core >32 C; shocks once per cycle up to 3",
  "verbatim": "AED/defibrillate, if indicated, once per cycle of CPR up to three times. Consider limiting further defibrillation attempts until core temperature known to be > 30°C (86°F). Hypothermic patients without contraindications to CPR should have continuous CPR and should not be considered for Termination of Resuscitation until the core temperature is above 32°C (90°F) without ROSC.",
  "cite": "2.12, PDF p. 47",
  "level": "EMT STANDING ORDERS - ADULT & PEDIATRIC"
 }
};
