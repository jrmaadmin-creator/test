// Standard EMT-B patient assessment sequence (scene size-up + primary survey).
// Not NH-specific text. Compare against NH v9.2 "Universal Patient Care" before setting verified: true.
export default {
  id: 'assessment',
  title: 'Scene Size-Up + Primary Survey',
  category: 'Assessment',
  verified: false,
  source: { doc: 'Standard EMT-B assessment (NREMT sequence); NH v9.2 Universal Patient Care not yet loaded', section: null, page: null },
  keywords: ['primary', 'scene', 'abc', 'start'],
  start: 'scene',
  nodes: {
    scene: {
      type: 'info',
      text: 'Scene size-up',
      items: ['PPE / BSI', 'Scene safe?', 'Mechanism of injury or nature of illness', 'Number of patients', 'Additional resources (ALS, fire, PD, lift assist)', 'Consider spinal motion restriction'],
      next: 'general',
    },
    general: {
      type: 'question',
      text: 'General impression (from the doorway)',
      answers: [
        { label: 'Looks sick / critical', finding: 'Critical general impression', redFlag: 'Critical general impression', next: 'avpu' },
        { label: 'Stable-appearing', finding: 'Stable general impression', next: 'avpu' },
      ],
    },
    avpu: {
      type: 'question',
      text: 'Level of responsiveness (AVPU)',
      answers: [
        { label: 'Alert', finding: 'Alert', next: 'airway' },
        { label: 'Verbal', finding: 'Responds to verbal only', suggest: ['Altered mental status'], next: 'airway' },
        { label: 'Pain', finding: 'Responds to pain only', suggest: ['Altered mental status'], redFlag: 'Responds to pain only', next: 'airway' },
        { label: 'Unresponsive', finding: 'Unresponsive', suggest: ['Altered mental status'], redFlag: 'Unresponsive', next: 'pulse' },
      ],
    },
    pulse: {
      type: 'question',
      text: 'Unresponsive: breathing normally and pulse present? (check 10 sec max)',
      answers: [
        { label: 'Pulse present', next: 'airway' },
        { label: 'No pulse / agonal only', finding: 'Pulseless', redFlag: 'CARDIAC ARREST', suggest: ['Cardiac arrest'], next: 'arrest' },
      ],
    },
    arrest: {
      type: 'info',
      text: 'CARDIAC ARREST: put the phone down.',
      items: ['Start compressions now', 'AED on as soon as available', 'Request ALS', 'Follow the NH cardiac arrest protocol (not built into this app)'],
      next: 'END',
    },
    airway: {
      type: 'question',
      text: 'Airway open and clear?',
      answers: [
        { label: 'Yes, patent', next: 'breathing' },
        { label: 'No / compromised', finding: 'Airway compromised', redFlag: 'Airway compromise', next: 'airwayFix' },
      ],
    },
    airwayFix: {
      type: 'action',
      text: 'Open and maintain airway',
      detail: 'Head-tilt/chin-lift, or jaw thrust if trauma suspected. Suction as needed. OPA/NPA if indicated.',
      report: 'Airway opened/maintained',
      critical: true,
      next: 'breathing',
    },
    breathing: {
      type: 'question',
      text: 'Breathing adequate? (rate, depth, effort)',
      answers: [
        { label: 'Adequate', next: 'bleeding' },
        { label: 'Inadequate', finding: 'Inadequate breathing', redFlag: 'Inadequate breathing', next: 'bvm' },
      ],
    },
    bvm: {
      type: 'action',
      text: 'Assist ventilations with BVM + oxygen',
      detail: 'Ventilate at the NH protocol rate. Confirm chest rise.',
      verify: 'Ventilation rate per NH v9.2',
      report: 'BVM ventilation with O2',
      critical: true,
      next: 'bleeding',
    },
    bleeding: {
      type: 'question',
      text: 'Life-threatening bleeding?',
      answers: [
        { label: 'No', next: 'perfusion' },
        { label: 'Yes', finding: 'Life-threatening hemorrhage', redFlag: 'Major hemorrhage', suggest: ['Hemorrhagic shock'], next: 'bleedControl' },
      ],
    },
    bleedControl: {
      type: 'action',
      text: 'Control bleeding',
      detail: 'Direct pressure, then tourniquet for extremity bleeding not controlled by pressure. Note tourniquet time.',
      report: 'Hemorrhage control',
      critical: true,
      next: 'perfusion',
    },
    perfusion: {
      type: 'question',
      text: 'Skin and pulse quality',
      answers: [
        { label: 'Warm, dry, pink; pulse strong', finding: 'Skin warm/dry/pink', next: 'priority' },
        { label: 'Pale, cool, clammy; pulse weak/rapid', finding: 'Pale, cool, diaphoretic skin; weak rapid pulse', suggest: ['Shock / hypoperfusion'], redFlag: 'Signs of shock', next: 'priority' },
        { label: 'Hot, flushed', finding: 'Skin hot/flushed', suggest: ['Infection / sepsis', 'Heat emergency'], next: 'priority' },
      ],
    },
    priority: {
      type: 'question',
      text: 'Transport priority',
      answers: [
        { label: 'High priority: load and go', finding: 'High transport priority', next: 'handoff' },
        { label: 'Stable: continue assessment on scene', next: 'handoff' },
      ],
    },
    handoff: {
      type: 'info',
      text: 'Primary survey complete',
      items: ['Get a full set of vitals (Vitals tab)', 'Set chief complaint and open its protocol', 'OPQRST + SAMPLE history', 'Request ALS if needed'],
      next: 'END',
    },
  },
};
