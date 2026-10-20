// Search over NH v9.3 dosing statements. Pure functions, no DOM.
import DOSES from './data/nh-doses.js';

export { DOSES };

// Level strings are free text as stated in NH ("Paramedic (per A1)", "EMT/AEMT", ...).
// The filter matches the level word anywhere in that text; "EMT" does not match "AEMT".
const LEVEL_RE = { EMT: /(^|[^A])EMT/, AEMT: /AEMT/, Paramedic: /Paramedic/ };

export function searchDoses(q, { level = 'All', group = 'All' } = {}) {
  const terms = String(q).toLowerCase().split(/\s+/).filter(Boolean);
  return DOSES.filter(d => {
    if (level !== 'All' && !LEVEL_RE[level].test(d.level || '')) return false;
    if (group === 'Adult' && !/adult/i.test(d.group)) return false;
    if (group === 'Pediatric' && !/pediatric/i.test(d.group)) return false;
    const hay = `${d.drug} ${d.indication} ${d.protocol} ${d.protocolTitle}`.toLowerCase();
    return terms.every(t => hay.includes(t));
  });
}

export function doseSummary(d) {
  return [d.fixedDose, d.perKg && `${d.perKg}${/kg/.test(d.perKg) ? '' : ' /kg'}`].filter(Boolean).join(' · ') || 'see text';
}
