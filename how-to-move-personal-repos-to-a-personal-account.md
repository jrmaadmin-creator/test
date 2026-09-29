# How to move your personal repos to a personal account

Type: how-to. Status: v0.1, 2026-09-29; for later (`adr-002-one-github-account-for-now.md`). Owner: you. Time: about 15 minutes. Cost: $0.

1. **Create the account.** In a private browser window, go to github.com/signup and use your personal email, not a JRMA address. Use your name as the username. Turn on two-factor authentication (Settings > Password and authentication) and save the recovery codes in your password manager.
2. **Transfer each personal repo.** Signed in as `jrmaadmin-creator`, open the repo, then Settings > General > Danger Zone > Transfer ownership, and type your new username. Accept the transfer from the personal account. Private repos stay private, and GitHub redirects the old address.
3. **Keep one login for Claude.** On `jrma-ops`, go to Settings > Collaborators and add your personal account. Then connect your personal account at claude.ai/connect-github and install the Claude GitHub App on your personal repos. One login now reaches both spaces.
4. **Update local copies, if you have any.** Run `git remote set-url origin https://github.com/<new-username>/<repo>`. The redirect covers you until you do.
5. **Record it.** Add a row to `ARD.md` here, and tell the JRMA Hub chat that the personal repos have left `jrmaadmin-creator`.

## Check

- [ ] `jrmaadmin-creator` holds only JRMA repos.
- [ ] Your personal account holds only personal repos.
- [ ] A Claude Code session can reach both.

Moving the JRMA account into an organization is a separate hub question. `how-to-split-work-and-personal-github.md` has those steps.
