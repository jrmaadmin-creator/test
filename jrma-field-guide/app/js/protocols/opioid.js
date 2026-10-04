export default {
  id: 'opioid',
  title: 'Suspected Opioid Overdose',
  category: 'Medical',
  verified: false,
  source: { doc: 'DRAFT from general EMT-B practice; NH v9.2 text not loaded', section: null, page: null },
  keywords: ['overdose', 'od', 'opioid', 'heroin', 'fentanyl', 'narcan', 'naloxone', 'unresponsive'],
  start: 'pulse',
  nodes: {
    pulse: {
      type: 'question',
      text: 'Pulse present?',
      answers: [
        { label: 'Yes', next: 'signs' },
        { label: 'No', finding: 'Pulseless', redFlag: 'CARDIAC ARREST: CPR/AED first; naloxone is secondary', suggest: ['Cardiac arrest'], next: 'arrest' },
      ],
    },
    arrest: {
      type: 'info',
      text: 'Cardiac arrest: compressions and AED first.',
      items: ['Follow the NH cardiac arrest protocol', 'Ventilation matters more than naloxone in arrest'],
      next: 'END',
    },
    signs: {
      type: 'question',
      text: 'Opioid toxidrome signs',
      help: 'Decreased responsiveness + slow/shallow breathing + pinpoint pupils. Pupils can be normal with mixed ingestions.',
      answers: [
        { label: 'RR slow/shallow + pinpoint pupils', finding: 'Respiratory depression with miosis', suggest: ['Opioid overdose'], redFlag: 'Respiratory depression', next: 'ventilate' },
        { label: 'RR slow, pupils normal/large', finding: 'Respiratory depression without miosis', suggest: ['Opioid overdose', 'Mixed ingestion', 'Head injury', 'Hypoglycemia'], redFlag: 'Respiratory depression', next: 'ventilate' },
        { label: 'Breathing adequately', finding: 'Adequate respirations', next: 'bgl' },
      ],
    },
    ventilate: {
      type: 'action',
      text: 'Ventilate with BVM + O2 before naloxone',
      detail: 'Oxygenate first. Airway adjunct as tolerated.',
      report: 'BVM ventilation with O2',
      critical: true,
      next: 'naloxone',
    },
    naloxone: {
      type: 'action',
      text: 'Naloxone intranasal',
      dose: 'Goal: restore breathing, not full wakefulness',
      verify: 'NH v9.2 EMT naloxone route, dose, and repeat interval',
      report: 'Naloxone IN',
      critical: true,
      next: 'response',
    },
    response: {
      type: 'question',
      text: 'Response to naloxone',
      answers: [
        { label: 'Breathing improved', finding: 'Improved respirations after naloxone', suggest: ['Opioid overdose'], next: 'bgl' },
        { label: 'No change', finding: 'No response to naloxone', suggest: ['Mixed ingestion', 'Hypoglycemia', 'Head injury'], redFlag: 'No response to naloxone', next: 'bgl' },
      ],
    },
    bgl: {
      type: 'action',
      text: 'Check blood glucose',
      report: 'BGL checked',
      critical: true,
      next: 'safety',
    },
    safety: {
      type: 'info',
      text: 'After reversal',
      items: ['Expect withdrawal / agitation / vomiting: keep suction ready', 'Naloxone can wear off before the opioid does: transport and reassess', 'Scene safety: needles, fentanyl exposure', 'Look for pill bottles / paraphernalia for the RN'],
      next: 'END',
    },
  },
};
