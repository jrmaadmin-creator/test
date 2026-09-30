# How to update the game when NH releases new protocols

NH revises the Patient Care Protocols about every two years, with mid-cycle updates in between (v9.3 is the current one, effective 2025-11-07).

1. **Get the new document** from the Bureau of EMS: https://www.fstems.dos.nh.gov/ems-systems/patient-care-protocols
2. **Read the "Updates and Corrections" pages** at the front. They list every changed section.
3. **Search the game content for each changed section.** Every call has an `nh` list and every trial question has an `nh` field with section numbers:
   ```
   grep -n "4.9\|6.5" content/*.js
   ```
4. **Fix the affected text** in `content/calls.js` and `content/exams.js`. Keep doses with units and routes.
5. **Set `verified: false`** on any trial question you changed until someone rechecks it line by line.
6. **Update the version** everywhere it appears: `grep -rn "v9.3" .`
7. **Update `docs/reference/call-content.md`**, run `npm test`, then `npm run bundle` to rebuild the shareable file.
