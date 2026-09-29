// Checks every protocol file for broken links, unreachable nodes, and missing source citations.
// Run: npm run validate
import { PROTOCOLS } from '../app/js/protocols/index.js';
import { validateProtocol } from '../app/js/engine.js';

let bad = 0;
for (const p of PROTOCOLS) {
  const errs = validateProtocol(p);
  const tag = p.verified ? 'VERIFIED  ' : 'UNVERIFIED';
  console.log(`${errs.length ? 'FAIL' : 'ok  '} ${tag} ${p.id} (${Object.keys(p.nodes).length} nodes)`);
  for (const e of errs) console.log('   - ' + e);
  bad += errs.length;
}
const unverified = PROTOCOLS.filter(p => !p.verified).length;
console.log(`\n${PROTOCOLS.length} protocols, ${unverified} unverified, ${bad} errors`);
process.exit(bad ? 1 : 0);
