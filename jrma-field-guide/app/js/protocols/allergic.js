export default {
  id: 'allergic',
  title: 'Allergic Reaction / Anaphylaxis',
  category: 'Medical',
  verified: false,
  source: { doc: 'DRAFT from general EMT-B practice; NH v9.2 text not loaded', section: null, page: null },
  keywords: ['allergy', 'allergic', 'anaphylaxis', 'hives', 'bee sting', 'epipen', 'swelling'],
  start: 'exposure',
  nodes: {
    exposure: {
      type: 'question',
      text: 'Exposure',
      ask: 'What were you exposed to, and when?',
      answers: [
        { label: 'Food', finding: 'Food exposure', suggest: ['Allergic reaction'], next: 'skin' },
        { label: 'Sting / bite', finding: 'Sting/bite exposure', suggest: ['Allergic reaction'], next: 'skin' },
        { label: 'Medication', finding: 'Medication exposure', suggest: ['Allergic reaction'], next: 'skin' },
        { label: 'Unknown', finding: 'Unknown exposure', next: 'skin' },
      ],
    },
    skin: {
      type: 'question',
      text: 'Skin / mucosa',
      answers: [
        { label: 'Hives, flushing, or lip/tongue swelling', finding: 'Urticaria/angioedema', suggest: ['Allergic reaction', 'Anaphylaxis'], next: 'resp' },
        { label: 'None', next: 'resp' },
      ],
    },
    resp: {
      type: 'question',
      text: 'Airway / breathing involvement?',
      ask: 'Is your throat tight? Voice changed? Trouble breathing?',
      answers: [
        { label: 'Stridor, hoarseness, throat tightness', finding: 'Upper airway involvement', suggest: ['Anaphylaxis'], redFlag: 'Airway involvement', next: 'circ' },
        { label: 'Wheezing / SOB', finding: 'Bronchospasm', suggest: ['Anaphylaxis'], next: 'circ' },
        { label: 'None', next: 'circ' },
      ],
    },
    circ: {
      type: 'question',
      text: 'Circulation / GI',
      answers: [
        { label: 'Hypotension, syncope, or signs of shock', finding: 'Hypotension/shock', suggest: ['Anaphylaxis'], redFlag: 'Anaphylactic shock', next: 'decide' },
        { label: 'Vomiting / cramping', finding: 'GI symptoms', suggest: ['Anaphylaxis'], next: 'decide' },
        { label: 'None', next: 'decide' },
      ],
    },
    decide: {
      type: 'question',
      text: 'Meets anaphylaxis criteria? (typically 2+ body systems, or any airway/breathing/BP compromise)',
      help: 'Review the findings above. When in doubt with airway or BP involvement, treat.',
      verify: 'NH v9.2 anaphylaxis definition',
      answers: [
        { label: 'Yes: anaphylaxis', finding: 'Meets anaphylaxis criteria', suggest: ['Anaphylaxis'], next: 'epi' },
        { label: 'No: localized / mild reaction', next: 'mild' },
      ],
    },
    epi: {
      type: 'action',
      text: 'Epinephrine IM, anterolateral thigh',
      dose: 'Auto-injector 0.3 mg adult / 0.15 mg pediatric is the common national dosing',
      verify: 'NH v9.2 EMT epinephrine form (auto-injector vs draw-up), weight cutoffs, and repeat interval',
      report: 'Epinephrine IM',
      critical: true,
      next: 'support',
    },
    support: {
      type: 'action',
      text: 'Oxygen, request ALS, position (supine if hypotensive, upright if breathing difficulty)',
      report: 'O2, ALS requested, positioned',
      critical: true,
      next: 'reassess',
    },
    reassess: {
      type: 'info',
      text: 'Reassess every few minutes',
      items: ['Repeat vitals', 'Prepare for second epi dose if no improvement', 'Biphasic reactions can recur hours later: transport even if improved'],
      verify: 'NH v9.2 repeat epi timing',
      next: 'END',
    },
    mild: {
      type: 'info',
      text: 'Mild / localized reaction',
      items: ['Remove stinger by scraping, remove the trigger', 'Monitor closely for progression', 'Transport'],
      next: 'END',
    },
  },
};
