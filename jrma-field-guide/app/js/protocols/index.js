import assessment from './assessment.js';
import chestPain from './chest-pain.js';
import respiratory from './respiratory.js';
import stroke from './stroke.js';
import diabetic from './diabetic.js';
import allergic from './allergic.js';
import opioid from './opioid.js';

export const PROTOCOLS = [assessment, chestPain, respiratory, stroke, diabetic, allergic, opioid];
export const BY_ID = Object.fromEntries(PROTOCOLS.map(p => [p.id, p]));

// Common history questions shown on the History tab for every call.
export const OPQRST = [
  ['O', 'Onset', 'When did it start? What were you doing?'],
  ['P', 'Provocation / palliation', 'What makes it better or worse?'],
  ['Q', 'Quality', 'Describe it: sharp, dull, pressure, burning, tearing?'],
  ['R', 'Region / radiation', 'Point to it. Does it go anywhere else?'],
  ['S', 'Severity', 'Zero to ten, ten the worst you can imagine?'],
  ['T', 'Time', 'Constant or comes and goes? Had this before?'],
];

export const SAMPLE = [
  ['S', 'Signs / symptoms', 'What else are you feeling?'],
  ['A', 'Allergies', 'Any allergies to medications, foods, latex?'],
  ['M', 'Medications', 'What medications do you take? Any blood thinners? Anything new?'],
  ['P', 'Pertinent history', 'Any medical problems? Surgeries? Seen a doctor recently?'],
  ['L', 'Last oral intake', 'When did you last eat or drink? (Also: last menstrual period if relevant)'],
  ['E', 'Events leading up', 'What happened right before this started?'],
];
