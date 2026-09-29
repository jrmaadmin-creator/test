# How to put JRMA officers in the game

Three roles are played by officers. Each one is a single entry in `content/crew.js`.

| Role key | What they do in the game | Where you see them |
|---|---|---|
| `chief` | Hands out your gloves on day one, gives station advice | Outside the station |
| `partner` | Rides on every call; the "Ask ..." hint button uses their name | Next to the rig; in every call |
| `trainer` | Runs the Protocol Trial that ends each level | Outside the station |

1. **Ask first.** Only add officers who said yes. The game is playful, and the partner role appears in a few jokes (iced coffee, granola bars, meatballs).
2. **Edit `content/crew.js`.** For each role:
   - Set `name` as it should appear in dialog, for example `'Capt. Smith'`.
   - Set `role`, for example `'Captain'`.
   - Delete the `placeholder: true` line.
   - Adjust `look` to match the officer: skin, hair, shirt colors, `beard`, `glasses`, `hat`.
3. **Run `npm test`.** It checks that every role has a name and look, and that no `{partner}`-style token shows up unreplaced.
4. **Run `npm run bundle`** and republish the link.

Game text never hard-codes an officer's name. It uses `{chief}`, `{partner}`, and `{trainer}`, so changing a name in `crew.js` changes it everywhere.
