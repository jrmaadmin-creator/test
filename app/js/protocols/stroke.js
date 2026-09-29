export default {
  id: 'stroke',
  title: 'Stroke / TIA',
  category: 'Medical',
  verified: false,
  source: { doc: 'DRAFT from general EMT-B practice; NH v9.2 text not loaded', section: null, page: null },
  keywords: ['stroke', 'cva', 'tia', 'weakness', 'facial droop', 'slurred speech', 'befast'],
  start: 'lkw',
  nodes: {
    lkw: {
      type: 'question',
      text: 'Last known well',
      ask: 'When was the last time they were completely normal? (Ask family/bystanders. Record the exact clock time in Notes.)',
      help: 'Waking up with symptoms = last known well is when they went to bed.',
      answers: [
        { label: '< 4.5 hours', finding: 'Last known well < 4.5 h', redFlag: 'Stroke within thrombolytic window', next: 'balance' },
        { label: '4.5 - 24 hours', finding: 'Last known well 4.5-24 h', redFlag: 'Stroke within thrombectomy window', next: 'balance' },
        { label: '> 24 hours / unknown', finding: 'Last known well > 24 h or unknown', next: 'balance' },
      ],
    },
    balance: {
      type: 'question',
      text: 'B - Balance: sudden loss of balance or coordination?',
      answers: [
        { label: 'Yes', finding: 'Balance/coordination deficit', suggest: ['Stroke'], next: 'eyes' },
        { label: 'No', next: 'eyes' },
      ],
    },
    eyes: {
      type: 'question',
      text: 'E - Eyes: sudden vision loss or double vision?',
      answers: [
        { label: 'Yes', finding: 'Visual deficit', suggest: ['Stroke'], next: 'face' },
        { label: 'No', next: 'face' },
      ],
    },
    face: {
      type: 'question',
      text: 'F - Face: "Smile for me." One side droops?',
      answers: [
        { label: 'Yes', finding: 'Facial droop', suggest: ['Stroke'], next: 'arm' },
        { label: 'No', next: 'arm' },
      ],
    },
    arm: {
      type: 'question',
      text: 'A - Arms: "Close your eyes, hold arms out 10 seconds." One drifts?',
      answers: [
        { label: 'Yes', finding: 'Arm drift', suggest: ['Stroke'], next: 'speech' },
        { label: 'No', next: 'speech' },
      ],
    },
    speech: {
      type: 'question',
      text: 'S - Speech: "You can\'t teach an old dog new tricks." Slurred or wrong words?',
      answers: [
        { label: 'Yes', finding: 'Speech abnormal', suggest: ['Stroke'], next: 'bgl' },
        { label: 'No', next: 'bgl' },
      ],
    },
    bgl: {
      type: 'action',
      text: 'Check blood glucose',
      detail: 'Hypoglycemia mimics stroke. Enter the value in Vitals.',
      report: 'BGL checked',
      critical: true,
      next: 'bglResult',
    },
    bglResult: {
      type: 'question',
      text: 'Glucose result',
      answers: [
        { label: 'Low', finding: 'Hypoglycemic', suggest: ['Hypoglycemia'], redFlag: 'Low BGL: treat per Diabetic protocol, then re-check stroke scale', next: 'lvo' },
        { label: 'Normal / high', next: 'lvo' },
      ],
    },
    lvo: {
      type: 'info',
      text: 'Large vessel occlusion screen',
      items: ['Use the LVO / severity scale named in NH v9.2', 'Result drives destination (comprehensive vs primary stroke center)'],
      verify: 'Which LVO scale NH v9.2 uses and its destination cutoffs',
      next: 'alert',
    },
    alert: {
      type: 'action',
      text: 'Stroke alert: early hospital notification, rapid transport',
      detail: 'Minimize scene time. Bring a witness or get a callback number for last-known-well. Nothing by mouth.',
      verify: 'NH stroke destination guidance',
      report: 'Stroke alert / prenotification',
      critical: true,
      next: 'END',
    },
  },
};
