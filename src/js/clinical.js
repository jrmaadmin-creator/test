// Clinical content kept apart from the rhythm generators: 12-lead findings,
// treatment and treatment quiz questions.
//
// Treatment follows the State of New Hampshire Patient Care Protocols v9.3
// (NH Division of Fire Standards and Training & EMS; approved by the NH EMS
// Medical Control Board). Each step cites its protocol number. Where NH says
// "follow applicable AHA ACLS guidelines" and gives no detail, the AHA step is
// tagged AHA. Doses are copied from the protocol text; do not edit them from
// memory (ADR 0004).

export const NH_STATUS = {
  version: 'NH Patient Care Protocols v9.3',
  verified: true,
  note: 'Adult steps from protocols 3.1A, 3.2A, 3.4, 3.5A and 3.6; pediatric from 3.1P, 3.2P and 3.5P. Sedation options, pediatric doses and full pearls are in the protocol book. Medical control and your protocol book govern care.',
};

export const SOURCES = {
  nh: 'State of New Hampshire Patient Care Protocols, Version 9.3 (Nov 2025)',
  levels: 'Levels follow the NH standing-order headings: EMR/EMT, AEMT, Paramedic. "All" = Routine Patient Care. "AHA" = AHA ACLS step used where the NH protocol defers to ACLS.',
};

export const INSTABILITY =
  'Hemodynamically unstable (NH 3.5A pearls): hypotension, acutely altered mental status, signs of shock, signs of acute heart failure, or ischemic chest pain.';

const CPR = ['EMR/EMT', 'Perform 2-minute cycles of uninterrupted chest compressions (100–120/min, metronome if possible). Interrupt compressions only for rhythm/pulse check and defibrillation.', '3.2A, 3.6'];
const VENT = ['EMR/EMT', 'Ventilation: high-flow oxygen by non-rebreather for passive ventilation, OR BVM 1 breath every 10 compressions without interrupting compressions. Use BVM for non-cardiac causes (respiratory, trauma).', '3.2A'];
const EPI = ['AEMT', 'Place IV/IO without interrupting compressions. After the first 2-minute cycle, consider epinephrine 1 mg IV (0.1 mg/mL); repeat every other cycle.', '3.2A'];
const ROSC = ['Paramedic', 'If ROSC: Post Resuscitative Care. Maintain systolic BP over 90 mmHg or MAP 65 mmHg or higher; IV fluid in 250 mL boluses, not to exceed 2000 mL; consider vasopressors (push-dose epinephrine 10–20 mcg every 2 min, norepinephrine 1–80 mcg/min, or epinephrine 2–10 mcg/min). STEMI criteria: transport per STEMI agreement and call a STEMI Alert.', '3.4'];
const DURATION = ['Paramedic', 'Consider resuscitation for up to 60 minutes from dispatch, including transport for potential reversible causes. Termination: Resuscitation Initiation & Termination 8.15.', '3.2A'];

// Each step: [level, text, NH protocol number or 'AHA'].
export const TREATMENT = {
  none: {
    title: 'No rhythm-specific protocol',
    steps: [
      ['All', 'Routine Patient Care. Treat the chief complaint and reassess.', '1.0'],
      ['All', 'Watch for rhythm changes; obtain a 12-lead if the patient has cardiac symptoms.', 'AHA'],
    ],
  },
  sinusTach: {
    title: 'Treat the cause, not the rate',
    steps: [
      ['All', 'Routine Patient Care. Look for the reason: pain, fever, hypovolemia or bleeding, hypoxia, anxiety, sepsis, toxins.', '3.5A'],
      ['Paramedic', 'The tachycardia protocol’s electrical and drug treatment is for tachyarrhythmias other than sinus tachycardia. Treat underlying causes such as hypoxemia, dehydration and fever.', '3.5A'],
    ],
  },
  ectopy: {
    title: 'Usually observation',
    steps: [
      ['All', 'Routine Patient Care. Assess for chest pain, shortness of breath and hypoxia.', '1.0'],
      ['Paramedic', 'Obtain a 12-lead if symptomatic. Look for runs, couplets or R-on-T. Treat causes; antiarrhythmics are not routine for isolated ectopy.', 'AHA'],
    ],
  },
  brady: {
    title: 'Bradycardia – Adult (3.1A)',
    steps: [
      ['All', 'Routine Patient Care. Consider underlying causes (acute coronary syndrome, hyperkalemia, hypoxia, hypothermia). 12-lead ECG if available.', '3.1A'],
      ['Paramedic', 'Symptomatic and hemodynamically unstable: consider atropine 1 mg IV every 3–5 minutes to a maximum of 3 mg.', '3.1A'],
      ['Paramedic', 'Consider transcutaneous pacing, with procedural sedation before or during pacing if feasible (for example midazolam 2.5 mg IV, may repeat once in 5 minutes; other options in 3.1A).', '3.1A'],
      ['Paramedic', 'Consider vasopressor: epinephrine 2–10 mcg/min via pump, OR norepinephrine 1–80 mcg/min via pump (start 1–15 mcg/min, titrate 2–5 mcg/min every 5 min). If an infusion is not immediately available: push-dose epinephrine 10–20 mcg (1–2 mL of 10 mcg/mL) every 2 minutes.', '3.1A'],
      ['Paramedic', 'Contact Medical Control for expert consultation.', '3.1A'],
      ['Paramedic', 'Other causes: hyperkalemia with ECG changes, see Hyperkalemia 2.9. Beta blocker overdose: glucagon up to 5 mg IV over 3–5 min. Calcium channel or beta blocker overdose: calcium gluconate 3 g IV/IO (preferred with a pulse) or calcium chloride 1 g IV/IO, each in 50–100 mL 0.9% NaCl over 5–10 min.', '3.1A'],
    ],
    note: 'Atropine acts on the SA and AV nodes, so it often fails when the block is below the AV node (Mobitz II, third-degree with a wide escape). NH 3.1A lists pacing and vasopressors alongside atropine; do not delay them. Note that NH lists norepinephrine and epinephrine, not dopamine.',
  },
  ivr: {
    title: 'Support the escape rhythm (3.1A)',
    steps: [
      ['EMR/EMT', 'Check for a pulse. No pulse: this is PEA; start CPR (Cardiac Arrest 3.2A).', '3.2A'],
      ['Paramedic', 'With a pulse and poor perfusion: follow Bradycardia 3.1A (atropine, transcutaneous pacing, vasopressors).', '3.1A'],
      ['AHA', 'Do not give amiodarone or lidocaine: suppressing the only pacemaker left can cause asystole.', 'AHA'],
    ],
  },
  svt: {
    title: 'Tachycardia – Adult (3.5A): narrow, regular',
    steps: [
      ['All', 'Routine Patient Care. 12-lead ECG if available.', '3.5A'],
      ['Paramedic', 'Unstable: synchronized cardioversion, narrow regular rhythm 50–100 J biphasic or 200 J monophasic; escalate if no conversion (biphasic: follow manufacturer). Sedate before or during if feasible.', '3.5A'],
      ['Paramedic', 'Stable, regular, over 150 bpm: vagal maneuvers.', '3.5A'],
      ['Paramedic', 'Adenosine 6 mg rapid IVP; may repeat at 12 mg in 1–2 minutes if no conversion. May repeat the successful dose if the rhythm recurs. Give through a proximal (antecubital) vein with a rapid saline flush.', '3.5A'],
      ['Paramedic', 'Or rate control: diltiazem 0.25 mg/kg IV (max 20 mg) over 2 min, may repeat in 15 min at 0.35 mg/kg (max 20 mg); OR metoprolol 5 mg IV over 2–5 min, repeat every 5 min to a max of 15 mg.', '3.5A'],
    ],
    note: 'Record a strip while giving adenosine. A pause that reveals flutter waves means the rhythm was flutter, not SVT.',
  },
  afib: {
    title: 'Tachycardia – Adult (3.5A): narrow, irregular',
    steps: [
      ['All', 'Routine Patient Care. 12-lead ECG if available.', '3.5A'],
      ['Paramedic', 'Unstable: synchronized cardioversion, narrow irregular rhythm 120–200 J biphasic or 200 J monophasic; escalate if no conversion. Sedate if feasible.', '3.5A'],
      ['Paramedic', 'Stable rate control: diltiazem 0.25 mg/kg IV (max 20 mg) over 2 min, may repeat in 15 min at 0.35 mg/kg (max 20 mg); consider infusion 5–15 mg/hour. OR metoprolol 5 mg IV over 2–5 min, repeat every 5 min to max 15 mg, aiming for a ventricular rate of 90–100.', '3.5A'],
      ['Paramedic', 'Diltiazem, metoprolol, amiodarone and adenosine are contraindicated in A-fib with a history of, or suspected, WPW. Use lower doses in frail or debilitated patients.', '3.5A'],
    ],
    note: 'Ask about onset and blood thinners; both matter for the receiving hospital and for trauma.',
  },
  wideTach: {
    title: 'Tachycardia – Adult (3.5A): wide complex',
    steps: [
      ['EMR/EMT', 'Check for a pulse. No pulse: pulseless VT is cardiac arrest (3.2A).', '3.2A'],
      ['Paramedic', 'Unstable: synchronized cardioversion, wide regular rhythm 100 J biphasic or monophasic. Sedate if feasible.', '3.5A'],
      ['Paramedic', 'Stable, regular and monomorphic only: consider adenosine 6 mg rapid IV, may repeat at 12 mg after 1–2 minutes.', '3.5A'],
      ['Paramedic', 'Amiodarone 150 mg IV in 50–100 mL 0.9% NaCl or D5W over 10 minutes; may repeat once in 10 minutes; if successful consider 1 mg/min infusion.', '3.5A'],
      ['Paramedic', 'Lidocaine (second line) 1–1.5 mg/kg IV; may repeat once in 5 min to a max of 3 mg/kg; if successful consider 1–4 mg/min infusion.', '3.5A'],
    ],
    note: 'Wide complex tachycardia should be considered VT until proven otherwise (NH 3.5A pearl).',
  },
  torsades: {
    title: 'Polymorphic VT / torsades (3.5A, 3.2A)',
    steps: [
      ['EMR/EMT', 'Check for a pulse. No pulse: cardiac arrest (3.2A), defibrillate.', '3.2A'],
      ['Paramedic', 'Unstable with a pulse: 120–200 J biphasic or 360 J monophasic, using unsynchronized defibrillation doses if unable to sync.', '3.5A'],
      ['Paramedic', 'Consider magnesium sulfate 1–2 g IV over 5 minutes.', '3.5A'],
      ['AHA', 'Correct low potassium and magnesium; stop QT-prolonging drugs.', 'AHA'],
    ],
  },
  shockable: {
    title: 'Cardiac Arrest – Adult (3.2A): VF / pulseless VT',
    steps: [
      CPR,
      VENT,
      EPI,
      ['Paramedic', 'Defibrillate as indicated at the device’s maximum energy. Compress while charging; resume compressions immediately after the shock.', '3.2A'],
      ['Paramedic', 'Administer an anti-dysrhythmic per ACLS: amiodarone 300 mg IV/IO, then 150 mg; or lidocaine 1–1.5 mg/kg, then 0.5–0.75 mg/kg.', '3.2A · AHA'],
      ['Paramedic', 'After 4 cycles (8 minutes): consider endotracheal intubation without interrupting compressions.', '3.2A'],
      ['Paramedic', 'Refractory VF: Double Sequential Defibrillation (Procedure 6.2) if a second manual defibrillator is available; otherwise change pads from anterior-apex to anterior-posterior.', '3.2A'],
      DURATION,
      ROSC,
    ],
  },
  nonShockable: {
    title: 'Cardiac Arrest – Adult (3.2A): asystole / PEA',
    steps: [
      CPR,
      VENT,
      EPI,
      ['Paramedic', 'Narrow complex PEA is often mechanical (hemorrhage/hypovolemia, tension pneumothorax, massive MI, PE): IV fluid boluses for hypovolemia; needle decompression for tension pneumothorax.', '3.2A'],
      ['Paramedic', 'Wide complex PEA is often metabolic (hyperkalemia, sodium-channel blocker toxicity): calcium gluconate 3 g IV OR calcium chloride (10%) 1 g IV, AND sodium bicarbonate 1–2 mEq/kg IV.', '3.2A'],
      ['Paramedic', 'Suspected pre-existing metabolic acidosis: consider sodium bicarbonate 1–2 mEq/kg IV.', '3.2A'],
      DURATION,
      ROSC,
    ],
    note: 'Asystole: confirm in a second lead and check connections and gain before treating it as asystole (AHA).',
  },
  bbb: {
    title: 'Look for the cause',
    steps: [
      ['All', 'Routine Patient Care. 12-lead ECG; compare with an old ECG if available.', '1.0'],
      ['Paramedic', 'New block with chest pain or shortness of breath: treat as possible ACS (Acute Coronary Syndrome 3.0) and notify the receiving hospital.', '3.0'],
    ],
  },
  wpw: {
    title: 'Pre-excitation (3.5A)',
    steps: [
      ['All', 'In sinus rhythm: no field treatment. Document the delta wave.', 'AHA'],
      ['Paramedic', 'Regular narrow tachycardia: treat per 3.5A narrow regular.', '3.5A'],
      ['Paramedic', 'Diltiazem, metoprolol, amiodarone and adenosine are contraindicated in A-fib with a history of or suspected WPW. Unstable: synchronized cardioversion (narrow irregular 120–200 J biphasic). Stable: contact Medical Control.', '3.5A'],
    ],
  },
  paced: {
    title: 'Check the pacemaker',
    steps: [
      ['All', 'Ask about the device and look for the card. Assess perfusion.', '1.0'],
      ['Paramedic', 'Look for failure to capture, failure to sense and failure to pace.', 'AHA'],
      ['Paramedic', 'Pacemaker failure with unstable bradycardia: Bradycardia 3.1A, including transcutaneous pacing. Keep pads away from the device.', '3.1A'],
    ],
  },
  artifact: {
    title: 'Fix the signal, check the patient',
    steps: [
      ['EMR/EMT', 'Look at the patient and check a pulse before acting on the monitor.', 'AHA'],
      ['EMR/EMT', 'Check electrodes (skin prep, fresh pads, dry skin), cables and connections.', 'AHA'],
      ['Paramedic', 'Change leads and adjust gain. Never defibrillate based on the monitor alone.', 'AHA'],
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
  'pea-wide': 'nonShockable',
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
  'pea-wide': 'Wide, slow complexes with no pulse. After ROSC, a 12-lead looking for hyperkalemia (peaked T waves, wide QRS, flattened P waves) supports calcium and bicarbonate.',
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

// Treatment questions asked after the rhythm in Quiz mode. `a` is the correct
// answer; `x` are distractors. `cite` names the NH protocol.
export const TREAT_Q = {
  brady: [
    { q: 'Symptomatic bradycardia with hypotension and confusion. First medication in NH 3.1A?', a: 'Atropine 1 mg IV every 3–5 min, max 3 mg', x: ['Adenosine 6 mg rapid IV push', 'Amiodarone 150 mg IV over 10 min', 'Epinephrine 1 mg IV every other cycle'], cite: '3.1A' },
    { q: 'Atropine failed and pacing is not yet working. Which vasopressor does NH 3.1A list?', a: 'Norepinephrine 1–80 mcg/min or epinephrine 2–10 mcg/min (push-dose epi 10–20 mcg if no pump)', x: ['Dopamine 5–20 mcg/kg/min', 'Diltiazem 0.25 mg/kg IV', 'Adenosine 12 mg rapid IV push'], cite: '3.1A' },
  ],
  ivr: [{ q: 'Idioventricular rhythm at 35 with a weak pulse and hypotension. What should you avoid?', a: 'Amiodarone or lidocaine (they can abolish the only pacemaker)', x: ['Transcutaneous pacing', 'Atropine per 3.1A', 'A 12-lead ECG'], cite: '3.1A / AHA' }],
  svt: [
    { q: 'Stable, regular narrow tachycardia at 180. Vagal maneuvers failed. Next step in NH 3.5A?', a: 'Adenosine 6 mg rapid IVP, then 12 mg in 1–2 min if needed', x: ['Synchronized cardioversion at 360 J', 'Atropine 1 mg IV', 'Amiodarone 300 mg IV push'], cite: '3.5A' },
    { q: 'Unstable narrow regular tachycardia. Starting synchronized energy in NH 3.5A?', a: '50–100 J biphasic (200 J monophasic)', x: ['Device maximum, unsynchronized', '120–200 J biphasic', '2 J/kg'], cite: '3.5A' },
  ],
  afib: [
    { q: 'Stable A-fib with RVR, no WPW history. A rate-control option in NH 3.5A?', a: 'Diltiazem 0.25 mg/kg IV over 2 min (max 20 mg)', x: ['Adenosine 12 mg rapid IV push', 'Defibrillate at maximum energy', 'Magnesium sulfate 2 g IV'], cite: '3.5A' },
    { q: 'Unstable A-fib with RVR. Starting synchronized energy in NH 3.5A?', a: '120–200 J biphasic (200 J monophasic)', x: ['50–100 J biphasic', '100 J biphasic or monophasic', 'Device maximum, unsynchronized'], cite: '3.5A' },
  ],
  wideTach: [
    { q: 'Stable monomorphic VT with a pulse. First-line antiarrhythmic in NH 3.5A?', a: 'Amiodarone 150 mg IV over 10 min, may repeat once', x: ['Amiodarone 300 mg rapid IV push', 'Diltiazem 0.25 mg/kg IV', 'Atropine 1 mg IV'], cite: '3.5A' },
    { q: 'Monomorphic VT becomes unstable but keeps a pulse. NH 3.5A energy?', a: 'Synchronized 100 J (wide regular)', x: ['50 J synchronized', 'No shock; give adenosine', 'Device maximum, unsynchronized'], cite: '3.5A' },
  ],
  torsades: [{ q: 'Torsades de pointes with a pulse. Medication in NH 3.5A?', a: 'Magnesium sulfate 1–2 g IV over 5 min', x: ['Adenosine 6 mg rapid IV push', 'Metoprolol 5 mg IV', 'Diltiazem 0.25 mg/kg IV'], cite: '3.5A' }],
  shockable: [
    { q: 'VF on the monitor, adult. At what energy does NH 3.2A say to defibrillate?', a: 'The device’s maximum energy', x: ['50 J, then escalate', '2 J/kg', 'Synchronized 100 J'], cite: '3.2A' },
    { q: 'VF persists after several shocks and a second manual defibrillator is on scene. NH 3.2A option?', a: 'Double Sequential Defibrillation (Procedure 6.2)', x: ['Stop CPR and transport', 'Synchronized cardioversion', 'Atropine 1 mg IV'], cite: '3.2A' },
  ],
  nonShockable: [
    { q: 'When does NH 3.2A have the AEMT first consider epinephrine in adult arrest?', a: 'After the first 2-minute cycle, then every other cycle', x: ['Before starting CPR', 'Only after 3 shocks', 'Every cycle (every 2 minutes)'], cite: '3.2A' },
    { q: 'Wide complex PEA in a dialysis patient. What does NH 3.2A suggest?', a: 'Calcium (gluconate 3 g or chloride 1 g) and sodium bicarbonate 1–2 mEq/kg', x: ['Defibrillate at maximum energy', 'Atropine 1 mg IV', 'Adenosine 6 mg rapid IV push'], cite: '3.2A' },
    { q: 'Narrow complex PEA after a large GI bleed. Most likely cause group in NH 3.2A?', a: 'Mechanical: hypovolemia, so give IV fluid boluses', x: ['Metabolic: give calcium and bicarbonate', 'Electrical: defibrillate', 'Vagal: give atropine'], cite: '3.2A' },
  ],
  sinusTach: [{ q: 'Sinus tachycardia at 125 from a GI bleed. Best treatment?', a: 'Treat the cause (bleeding control, fluids)', x: ['Adenosine 6 mg rapid IV push', 'Synchronized cardioversion', 'Diltiazem 0.25 mg/kg IV'], cite: '3.5A' }],
  ectopy: [{ q: 'Occasional premature beats (PACs or unifocal PVCs), patient comfortable and well perfused. Treatment?', a: 'Assess and treat causes; no antiarrhythmic', x: ['Amiodarone 150 mg IV', 'Lidocaine 1.5 mg/kg IV', 'Synchronized cardioversion'], cite: 'AHA' }],
  wpw: [{ q: 'Irregular, wide, very fast rhythm in a patient with known WPW. Which drugs does NH 3.5A call contraindicated?', a: 'Diltiazem, metoprolol, amiodarone and adenosine', x: ['None of them', 'Only lidocaine', 'Only magnesium'], cite: '3.5A' }],
  paced: [{ q: 'Pacer spikes with no QRS after them, pulse 30, BP 70/40. NH-supported treatment?', a: 'Transcutaneous pacing (Bradycardia 3.1A), sedation if feasible', x: ['Adenosine 6 mg rapid IV push', 'Diltiazem 0.25 mg/kg IV', 'Defibrillate at maximum energy'], cite: '3.1A' }],
  artifact: [{ q: 'The monitor shows VF but the patient is talking to you. First action?', a: 'Check the patient and the leads before treating the monitor', x: ['Defibrillate at maximum energy', 'Start CPR', 'Give amiodarone 300 mg'], cite: 'AHA' }],
  bbb: [{ q: 'New LBBB in a patient with crushing chest pain. What does the field plan focus on?', a: 'Treat as possible ACS (3.0), 12-lead, notify the hospital', x: ['Transcutaneous pacing', 'Adenosine 6 mg rapid IV push', 'Synchronized cardioversion'], cite: '3.0' }],
};

export function treatQuestionFor(rhythmId) {
  const list = TREAT_Q[TREATMENT_FOR[rhythmId]];
  if (!list) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// Pediatric steps: NH v9.3 3.1P, 3.2P, 3.5P. NH defines a pediatric patient as
// a child who fits on a length-based resuscitation tape up to 36 kg or 145 cm.
export const PEDS_NOTE = 'Pediatric = fits a length-based resuscitation tape up to 36 kg (79 lb) or 145 cm (57 in). Doses are weight-based; use the tape.';

const P_CPR = ['EMR/EMT', 'Immediate high-performance CPR with minimal interruptions (metronome if possible); 100% oxygen by BVM. One provider 30:2, two providers 15:2. Apply the AED as soon as possible; pediatric pads from birth to age 8 (adult pads if they do not overlap).', '3.2P'];
const P_AIR = ['EMR/EMT', 'BVM is preferred. If unsuccessful, supraglottic airway without interrupting compressions (EMT). With an advanced airway: continuous compressions, 1 breath every 2–3 seconds.', '3.2P'];
const P_IV = ['AEMT', 'IV/IO without interrupting compressions; 10–20 mL/kg fluid bolus. Correct treatable causes: hypoxia, overdose/poisoning, hypothermia, hypoglycemia, hypovolemia.', '3.2P'];
const P_CAUSES = ['Paramedic', 'Suspected hyperkalemia or calcium channel/beta blocker overdose: calcium gluconate 100 mg/kg IV/IO (max 3 g) or calcium chloride 20 mg/kg (max 1 g). Hyperkalemia or tricyclic overdose: sodium bicarbonate 1 mEq/kg (max 50 mEq). Not routine in arrest. Consider tension pneumothorax.', '3.2P'];

export const TREATMENT_PEDS = {
  brady: {
    title: 'Bradycardia – Pediatric (3.1P)',
    steps: [
      ['All', 'Routine Patient Care. Consider underlying causes: hypoxia, hypoglycemia, hypovolemia, hypothermia. 12-lead ECG if available.', '3.1P'],
      ['All', 'Infants and neonates: begin or continue CPR if the heart rate is under 60 with hypoperfusion despite adequate ventilation and oxygenation.', '3.1P'],
      ['Paramedic', 'Symptomatic and unstable: epinephrine 0.01 mg/kg IV (0.1 mL/kg of 0.1 mg/mL) every 3–5 min, max single dose 1 mg.', '3.1P'],
      ['Paramedic', 'Atropine 0.02 mg/kg IV for increased vagal tone or AV block; may repeat once (min single dose 0.1 mg, max 0.5 mg).', '3.1P'],
      ['Paramedic', 'Transcutaneous pacing, with procedural sedation if feasible (e.g., midazolam 0.05 mg/kg IV, max 2.5 mg).', '3.1P'],
    ],
    note: 'In children, bradycardia is usually from hypoxia: oxygenation and ventilation come first.',
  },
  svt: {
    title: 'Tachycardia – Pediatric (3.5P): narrow / probable SVT',
    steps: [
      ['All', 'Routine Patient Care. 12-lead ECG if available. Probable SVT: infants usually over 220/min, children over 180/min, no variability, P waves absent or abnormal.', '3.5P'],
      ['Paramedic', 'Stable: consider vagal maneuvers. Adenosine 0.1 mg/kg IV (max 6 mg); may repeat once at 0.2 mg/kg (max 12 mg).', '3.5P'],
      ['Paramedic', 'Unstable: synchronized cardioversion 0.5–1 J/kg; if unsuccessful increase to 2 J/kg. Sedate if feasible. Adenosine may be given if IV access is ready.', '3.5P'],
    ],
  },
  wideTach: {
    title: 'Tachycardia – Pediatric (3.5P): wide complex',
    steps: [
      ['EMR/EMT', 'Check for a pulse. No pulse: Cardiac Arrest – Pediatric 3.2P.', '3.2P'],
      ['Paramedic', 'Stable, regular, monomorphic QRS only: consider vagal maneuvers and adenosine 0.1 mg/kg (max 6 mg), repeat once at 0.2 mg/kg (max 12 mg).', '3.5P'],
      ['Paramedic', 'Stable wide complex: contact online Medical Control to consider amiodarone 5 mg/kg IV (max 300 mg) over 20–60 minutes.', '3.5P'],
      ['Paramedic', 'Unstable: synchronized cardioversion 0.5–1 J/kg, increase to 2 J/kg if unsuccessful.', '3.5P'],
    ],
  },
  shockable: {
    title: 'Cardiac Arrest – Pediatric (3.2P): VF / pulseless VT',
    steps: [
      P_CPR,
      P_AIR,
      P_IV,
      ['Paramedic', 'Defibrillate at 2 J/kg; CPR 2 minutes. Second shock 4 J/kg. Subsequent shocks 4 J/kg or more, max 10 J/kg or the adult dose.', '3.2P'],
      ['Paramedic', 'After the second defibrillation: epinephrine 0.01 mg/kg (0.1 mL/kg of 0.1 mg/mL) IV/IO, repeat every other cycle.', '3.2P'],
      ['Paramedic', 'After the second defibrillation, consider amiodarone 5 mg/kg IV/IO (max 300 mg), may repeat up to 2 times; OR lidocaine 1 mg/kg (max 100 mg).', '3.2P'],
      ['Paramedic', 'Torsades: magnesium sulfate 25–50 mg/kg (max 2 g) IV/IO over 1–2 minutes.', '3.2P'],
      P_CAUSES,
    ],
    note: 'Do not use mechanical CPR devices on children (3.2P pearl).',
  },
  nonShockable: {
    title: 'Cardiac Arrest – Pediatric (3.2P): asystole / PEA',
    steps: [
      P_CPR,
      P_AIR,
      P_IV,
      ['Paramedic', 'Epinephrine 0.01 mg/kg (0.1 mL/kg of 0.1 mg/mL) IV/IO, repeat every other cycle. CPR 2 minutes, then check rhythm; continue until a pulse, a shockable rhythm, or a decision to stop with Medical Direction.', '3.2P'],
      P_CAUSES,
    ],
    note: 'Cardiac arrest in children usually follows respiratory failure: optimize oxygenation and ventilation (3.2P pearl).',
  },
};
TREATMENT_PEDS.ivr = TREATMENT_PEDS.brady;
TREATMENT_PEDS.torsades = {
  title: 'Torsades – Pediatric (3.2P, 3.5P)',
  steps: [
    ['EMR/EMT', 'Check for a pulse. No pulse: Cardiac Arrest – Pediatric 3.2P.', '3.2P'],
    ['Paramedic', 'Pulseless torsades: magnesium sulfate 25–50 mg/kg (max 2 g) IV/IO over 1–2 minutes, with defibrillation per 3.2P.', '3.2P'],
    ['Paramedic', 'With a pulse: wide complex, contact online Medical Control (3.5P).', '3.5P'],
  ],
};
