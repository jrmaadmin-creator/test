// Clinical content kept apart from the rhythm generators: 12-lead findings and
// treatment. Treatment follows the AHA adult ACLS algorithms taught in paramedic
// courses (AHA / NREMT). NH Patient Care Protocols v9.3 have NOT been checked
// against this text yet: see NH_STATUS. No step here overrides local protocol.

export const NH_STATUS = {
  version: 'NH Patient Care Protocols v9.3 (Nov 2025)',
  verified: false,
  note: 'Not yet checked against the NH protocol text. Your NH protocol book and medical control govern treatment.',
};

export const SOURCES = {
  aha: 'AHA Adult ACLS algorithms (2020 guidelines; 2025 update, Circulation 2025;152 suppl 2)',
  scope: 'BLS = EMR/EMT level; ALS = paramedic level (National EMS Scope of Practice Model; NH Appendix 4 may differ)',
};

const UNSTABLE =
  'Unstable means the rhythm is causing hypotension, acutely altered mental status, signs of shock, ischemic chest discomfort or acute heart failure.';

// Each step: [level, text]. Levels: 'BLS' or 'ALS'.
export const TREATMENT = {
  none: {
    title: 'No rhythm-specific treatment',
    steps: [
      ['BLS', 'Assess the patient: airway, breathing, circulation, mental status, skin signs.'],
      ['BLS', 'Treat the chief complaint. Reassess and watch for rhythm changes.'],
    ],
  },
  sinusTach: {
    title: 'Treat the cause, not the rate',
    steps: [
      ['BLS', 'Look for the reason: pain, fever, hypovolemia or bleeding, hypoxia, anxiety, sepsis, toxins, PE.'],
      ['BLS', 'Oxygen if hypoxemic. Control bleeding. Position for perfusion.'],
      ['ALS', 'IV access; fluids if hypovolemic. Treat pain and fever per protocol.'],
      ['ALS', 'Do not cardiovert or give rate-slowing drugs for sinus tachycardia: the body needs the rate.'],
    ],
  },
  ectopy: {
    title: 'Usually observation',
    steps: [
      ['BLS', 'Assess for chest pain, shortness of breath and hypoxia. Oxygen if hypoxemic.'],
      ['ALS', 'Monitor and obtain a 12-lead if symptomatic. Look for runs, couplets or R-on-T.'],
      ['ALS', 'Treat causes (hypoxia, ischemia, electrolyte problems, stimulants). Antiarrhythmics are not routine for isolated ectopy.'],
    ],
  },
  brady: {
    title: 'AHA adult bradycardia algorithm',
    steps: [
      ['BLS', 'Is the rate slow for this patient (usually under 50/min in a bradyarrhythmia)? Support airway and breathing; oxygen if hypoxemic.'],
      ['ALS', 'Cardiac monitor, blood pressure, SpO2, IV access, 12-lead ECG. Look for causes (inferior MI, drugs, hyperkalemia, hypoxia).'],
      ['ALS', `${UNSTABLE} If none of these: monitor and observe.`],
      ['ALS', 'If unstable: atropine 1 mg IV bolus, repeat every 3–5 min, maximum 3 mg.'],
      ['ALS', 'If atropine does not work: transcutaneous pacing, or a dopamine infusion (5–20 mcg/kg/min) or epinephrine infusion (2–10 mcg/min).'],
      ['ALS', 'Consider expert consultation and transvenous pacing.'],
    ],
    note: 'Atropine works on the SA and AV nodes. It is often ineffective when the block is below the AV node (Mobitz II, third-degree with a wide escape): move to pacing early.',
  },
  ivr: {
    title: 'Support the escape rhythm',
    steps: [
      ['BLS', 'Check for a pulse. No pulse: this is PEA; start CPR (cardiac arrest).'],
      ['ALS', 'With a pulse and poor perfusion: follow the bradycardia algorithm; transcutaneous pacing is often needed.'],
      ['ALS', 'Do not give amiodarone or lidocaine: suppressing the only pacemaker left can cause asystole.'],
      ['ALS', 'Look for causes: hypoxia, hyperkalemia, acidosis, overdose, MI. After reperfusion, accelerated idioventricular rhythm is usually self-limited.'],
    ],
  },
  svt: {
    title: 'AHA adult tachycardia algorithm: narrow, regular',
    steps: [
      ['ALS', `Monitor, 12-lead, IV access. ${UNSTABLE}`],
      ['ALS', 'Unstable: synchronized cardioversion (sedate if possible); energy per your monitor and protocol.'],
      ['BLS', 'Stable: vagal maneuvers (modified Valsalva: strain, then lie flat with legs raised).'],
      ['ALS', 'Adenosine 6 mg rapid IV push followed by a saline flush; if needed, 12 mg.'],
      ['ALS', 'If still not converted: beta-blocker or calcium channel blocker per protocol, or expert consultation.'],
    ],
    note: 'Record a strip while giving adenosine. A brief pause that reveals flutter waves means the rhythm was atrial flutter, not AVNRT.',
  },
  afib: {
    title: 'A-fib / flutter with rapid ventricular response',
    steps: [
      ['ALS', `Monitor, 12-lead, IV access. A controlled rate with good perfusion: monitor and transport. ${UNSTABLE}`],
      ['ALS', 'Unstable from the rate: synchronized cardioversion. AHA 2025 favors a higher first shock for A-fib (200 J or more biphasic); follow your monitor and protocol.'],
      ['ALS', 'Stable RVR: rate control with a calcium channel blocker (diltiazem) or beta-blocker per protocol.'],
      ['ALS', 'Ask about onset (over 48 hours raises clot risk with conversion) and blood thinners (bleeding risk in trauma).'],
    ],
    note: 'If the complexes are wide, bizarre and very fast, think pre-excited A-fib (WPW): avoid AV-node blockers.',
  },
  wideTach: {
    title: 'AHA adult tachycardia algorithm: wide complex',
    steps: [
      ['BLS', 'Check for a pulse. No pulse: pulseless VT is cardiac arrest; defibrillate (shockable algorithm).'],
      ['ALS', `Monitor, 12-lead if stable, IV access. ${UNSTABLE}`],
      ['ALS', 'Unstable with a pulse: synchronized cardioversion (sedate if possible). If it will not synchronize, defibrillate.'],
      ['ALS', 'Stable, regular and monomorphic: consider adenosine only if the rhythm is regular and monomorphic.'],
      ['ALS', 'Antiarrhythmic: amiodarone 150 mg IV over 10 min, repeat if VT recurs; other agents per protocol and expert consultation.'],
    ],
    note: 'Treat any wide-complex tachycardia as VT until proven otherwise.',
  },
  torsades: {
    title: 'Polymorphic VT / torsades de pointes',
    steps: [
      ['BLS', 'Check for a pulse. No pulse: cardiac arrest, defibrillate.'],
      ['ALS', 'Unstable with a pulse: unsynchronized shock (defibrillation energy). Polymorphic complexes cannot be reliably synchronized.'],
      ['ALS', 'Magnesium sulfate 1–2 g IV (given faster in arrest, slower when a pulse is present).'],
      ['ALS', 'Correct low potassium and magnesium; stop QT-prolonging drugs; expert consultation.'],
    ],
  },
  shockable: {
    title: 'AHA adult cardiac arrest: VF / pulseless VT',
    steps: [
      ['BLS', 'Start high-quality CPR: 100–120/min, at least 2 in deep, full recoil, minimal pauses, 30:2 without an advanced airway. Attach the AED/defibrillator.'],
      ['BLS', 'Shock as soon as the rhythm is shockable (AED at BLS level).'],
      ['ALS', 'Manual defibrillation: biphasic at the manufacturer’s dose (commonly 120–200 J; if unknown, use the maximum); monophasic 360 J. Resume CPR immediately for 2 minutes.'],
      ['ALS', 'Vascular access: IV first, IO if IV fails (AHA 2025).'],
      ['ALS', 'Epinephrine 1 mg IV/IO every 3–5 min, after initial shocks have failed.'],
      ['ALS', 'Refractory VF/pVT: amiodarone 300 mg, then 150 mg; or lidocaine 1–1.5 mg/kg, then 0.5–0.75 mg/kg.'],
      ['ALS', 'Advanced airway and waveform capnography; after an advanced airway, 1 breath every 6 s with continuous compressions. ETCO2 under 10 mmHg: improve CPR.'],
      ['ALS', 'Treat reversible causes (H’s and T’s).'],
    ],
  },
  nonShockable: {
    title: 'AHA adult cardiac arrest: asystole / PEA',
    steps: [
      ['BLS', 'High-quality CPR. Attach the AED/monitor; do not shock asystole or PEA.'],
      ['ALS', 'Vascular access (IV first, IO if IV fails). Epinephrine 1 mg IV/IO as soon as possible, then every 3–5 min.'],
      ['ALS', 'Advanced airway and waveform capnography.'],
      ['ALS', 'Search for and treat reversible causes: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/hyperkalemia, Hypothermia; Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary), Thrombosis (coronary).'],
      ['ALS', 'Check the rhythm every 2 minutes. If it becomes VF/pVT, switch to the shockable pathway.'],
    ],
    note: 'Asystole: confirm in a second lead, check connections and gain before treating it as asystole.',
  },
  bbb: {
    title: 'Look for the cause',
    steps: [
      ['ALS', 'No treatment for the block itself. Obtain a 12-lead and compare with an old ECG if available.'],
      ['ALS', 'New block with chest pain or shortness of breath: treat as possible ACS (or PE for RBBB) per protocol and notify the receiving hospital.'],
    ],
  },
  wpw: {
    title: 'Pre-excitation',
    steps: [
      ['ALS', 'In sinus rhythm: no field treatment. Document the delta wave and transport for evaluation if symptomatic.'],
      ['ALS', 'Regular tachycardia with a narrow QRS (orthodromic AVRT): treat like SVT.'],
      ['ALS', 'Irregular, wide, very fast (pre-excited A-fib): do not give adenosine, calcium channel blockers, beta-blockers or digoxin. Unstable: synchronized cardioversion. Stable: expert consultation.'],
    ],
  },
  paced: {
    title: 'Check the pacemaker',
    steps: [
      ['BLS', 'Ask about the device and look for the card. Assess perfusion.'],
      ['ALS', 'Check for failure to capture, failure to sense, and failure to pace.'],
      ['ALS', 'Pacemaker failure with symptomatic bradycardia: follow the bradycardia algorithm, including transcutaneous pacing. Keep pads away from the device.'],
    ],
  },
  artifact: {
    title: 'Fix the signal, check the patient',
    steps: [
      ['BLS', 'Look at the patient and check a pulse before acting on the monitor.'],
      ['BLS', 'Check electrodes (skin prep, fresh pads, dry skin), cables and connections.'],
      ['ALS', 'Change to another lead and increase gain as needed. Never defibrillate based on the monitor alone.'],
    ],
  },
};

export const TREATMENT_FOR = {
  nsr: 'none',
  'sinus-brady': 'brady',
  'sinus-tach': 'sinusTach',
  'sinus-arrhythmia': 'none',
  pac: 'ectopy',
  aflutter: 'afib',
  afib: 'afib',
  svt: 'svt',
  junctional: 'brady',
  avb1: 'brady',
  'avb2-1': 'brady',
  'avb2-2': 'brady',
  avb3: 'brady',
  pvc: 'ectopy',
  ivr: 'ivr',
  vt: 'wideTach',
  torsades: 'torsades',
  vf: 'shockable',
  asystole: 'nonShockable',
  pea: 'nonShockable',
  rbbb: 'bbb',
  lbbb: 'bbb',
  wpw: 'wpw',
  paced: 'paced',
  'art-movement': 'artifact',
  'art-tremor': 'artifact',
  'art-60': 'artifact',
  'art-loose': 'artifact',
};

// What the 12-lead adds for each rhythm, and which leads show it best.
export const TWELVE = {
  nsr: 'Lead II is the standard monitoring lead because it points the same way the normal impulse travels (about +60°), so P waves and QRS complexes are tall and upright. On the 12-lead: upright P in I, II and aVF; everything negative in aVR; R waves grow from V1 (small r, deep S) to V6 (tall R). Normal axis is −30° to +90°.',
  'sinus-brady': 'Every lead looks like normal sinus rhythm; only the spacing changes. Get a 12-lead anyway: an inferior MI (ST elevation in II, III, aVF) is a common cause of bradycardia.',
  'sinus-tach': 'Use all 12 leads to hunt for the cause: ST changes from ischemia, or right heart strain from a PE. At fast rates the P wave can sit on the previous T wave; II and V1 show it best.',
  'sinus-arrhythmia': 'Identical P waves in every lead confirm one pacemaker (the SA node). If the P shape changes from beat to beat, think wandering atrial pacemaker or multifocal atrial tachycardia instead.',
  pac: 'The early P wave has a different shape and axis because it starts somewhere else. Compare it with the sinus P in II and V1, and check the T wave before the early beat for a hidden P.',
  aflutter: 'Sawtooth flutter waves are clearest in II, III and aVF, where they point down, and they often look like upright P waves in V1. Switch to these leads whenever a regular narrow rhythm sits near 150.',
  afib: 'V1 usually shows the fibrillatory waves best. The 12-lead separates A-fib from multifocal atrial tachycardia (distinct P waves of 3 or more shapes) and screens for ischemia and pre-excitation.',
  svt: 'Look just after the QRS: a small negative "pseudo-S" in II, III and aVF and a small "pseudo-r′" in V1 are the buried retrograde P wave. A 12-lead during and after the episode helps the cardiologist look for WPW.',
  junctional: 'The retrograde P is inverted in II, III and aVF and upright in aVR. The atria depolarize from the bottom up, so the P vector points up and right, away from the inferior leads.',
  avb1: 'The PR interval is the same in every lead; measure it where the start of the P wave is clearest, often II. Check for an inferior MI as the cause.',
  'avb2-1': 'A long lead II strip shows the grouping best. Inferior ST elevation (II, III, aVF) points to an AV-nodal cause from right coronary artery ischemia.',
  'avb2-2': 'Often paired with a bundle branch block on the 12-lead, which confirms disease below the AV node. An anterior MI (V1–V4) is a classic cause.',
  avb3: 'Map the P waves across a long lead II strip. A wide escape with anterior MI changes means a low (infranodal) block; a narrow escape with inferior changes suggests an AV-nodal block.',
  pvc: 'The PVC’s shape shows where it started. This one comes from the right ventricle outflow tract: LBBB-like (negative in V1) with an inferior axis (tall in II, III, aVF). Left ventricle PVCs look RBBB-like (positive in V1).',
  ivr: 'Wide in every lead. The wavefront spreads away from the focus: this apical focus points the vector up and right, so II is negative and aVR is positive.',
  vt: '12-lead clues for VT: QRS over 0.14 s, northwest axis (negative in I and aVF, positive in aVR), P waves marching through independently, fusion or capture beats, and complexes pointing the same way across all chest leads (concordance). This circuit shows the northwest axis.',
  torsades: 'A 12-lead before or after an episode shows the long QT (a corrected QT over about 0.50 s is high risk). The complexes twist at different moments in different leads because the vector rotates.',
  vf: 'No lead shows organized complexes. Never delay defibrillation for a 12-lead.',
  asystole: 'Confirm a flat line in at least two leads. A small wavefront running perpendicular to one lead can look flat in that lead only.',
  pea: 'The 12-lead is not part of arrest care. After return of pulses it looks for STEMI, hyperkalemia (peaked T waves, wide QRS) or right heart strain (PE).',
  rbbb: 'V1–V2: rsR′. I, aVL, V5–V6: wide, slurred S wave. QRS 0.12 s or more. The late right ventricle vector points right and forward: toward V1, away from V6.',
  lbbb: 'V1: deep, broad QS or rS. I, aVL, V5–V6: broad, notched R with no Q wave. ST segments and T waves point opposite the QRS. LBBB hides MI patterns; physicians use the Sgarbossa criteria.',
  wpw: 'Short PR and delta wave in most leads. A left lateral pathway gives negative delta waves in I and aVL (these can mimic a lateral MI) and a tall R in V1. The delta wave’s direction in each lead helps locate the pathway.',
  paced: 'A pacer spike before every QRS. Right ventricle apex pacing looks like LBBB (negative in V1) with a left, superior axis (negative in II, III, aVF).',
  'art-movement': 'Motion shows most in the leads whose electrodes move. Another lead often shows normal complexes continuing through the burst.',
  'art-tremor': 'Tremor is worst in the limb leads. Moving limb electrodes onto the torso (shoulders and lower abdomen) reduces it.',
  'art-60': 'Electrical interference usually affects all leads evenly: a sign it is not coming from the heart.',
  'art-loose': 'Lead I uses only the two arm electrodes, so it keeps showing the rhythm when the left-leg electrode is loose. II, III and aVF drop out.',
};

// How a 12-lead works, for the 12-lead panel.
export const TWELVE_BASICS = [
  ['One heart, twelve viewpoints', '10 electrodes (4 limbs, 6 chest) produce 12 leads. Each lead looks at the same electrical activity from a different angle, like 12 cameras around one event.'],
  ['The one rule', 'Electricity moving toward a lead’s positive electrode draws an upward wave. Moving away draws a downward wave. Moving across it draws a small or two-part (biphasic) wave.'],
  ['Limb leads: the frontal plane', 'I (0°), II (+60°), III (+120°), aVR (−150°), aVL (−30°), aVF (+90°) look at the heart from the front, like a clock face. II = I + III (Einthoven’s law).'],
  ['Chest leads: the horizontal plane', 'V1 and V2 look from the right front, V3 and V4 from the front, V5 and V6 from the left side. R waves normally grow from V1 to V6.'],
  ['Views of the heart', 'Inferior: II, III, aVF (usually right coronary artery). Lateral: I, aVL, V5, V6 (circumflex). Septal: V1, V2. Anterior: V3, V4 (LAD).'],
  ['Why lead II for monitoring', 'Its axis (+60°) is almost parallel to the normal impulse path from the SA node toward the apex, so P waves and QRS complexes are tallest and easiest to read.'],
  ['Why V1 for wide complexes', 'V1 sits over the right ventricle. Bundle branch blocks, PVC origin and P waves in flutter or AV dissociation stand out there.'],
  ['Axis in two leads', 'QRS up in I and up in aVF: normal. Up in I, down in aVF: left axis. Down in I, up in aVF: right axis. Down in both: northwest (extreme) axis, think VT.'],
  ['Chest electrode placement', 'V1: 4th intercostal space, right of the sternum. V2: 4th space, left of the sternum. V4: 5th space, midclavicular line. V3: halfway between V2 and V4. V5: level with V4, anterior axillary line. V6: level with V4, midaxillary line.'],
];
