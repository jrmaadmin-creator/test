# How to split GitHub into a JRMA organization and a personal account

Type: how-to. Status: v0.1, 2026-09-29, not run; superseded by `adr-002-one-github-account-for-now.md`. Kept for later. Owner: you. Why: `adr-001-github-organization-for-jrma.md`.

## Result when done

| Space | Owners | Holds | Who signs in |
|---|---|---|---|
| `jrmaadmin-creator`, converted into an organization | You and the Chief | `jrma-ops`, `test`, the future Bay Board page repo | Nobody signs in as the organization; you and the Chief use your own accounts |
| Your new personal account | You | Personal projects only | You |

Time: about 30 minutes, on a computer browser. Cost: $0 (GitHub Free for organizations).

Undo: none. Converting an account into an organization is permanent. Steps 1 to 3 change nothing, and you can stop after any of them.

## Before you start

- [ ] Sign in as `jrmaadmin-creator` and open Settings > Emails. An email address can belong to only one GitHub account. If your personal email is listed, add a JRMA address, make it primary, and remove the personal one; step 1 needs the personal address.
- [ ] Settings > Organizations on `jrmaadmin-creator` lists no organizations. An account that belongs to an organization cannot be converted. (The GitHub API showed no teams on 2026-09-29; confirm on the page.)
- [ ] Your password manager is open.

## Step 1. Create your personal account

1. Open a private browser window so you stay signed out of `jrmaadmin-creator`.
2. Go to github.com/signup and use your personal email.
3. Pick a username you would keep for life: your name, not your job or agency.
4. Turn on two-factor authentication: Settings > Password and authentication. Use an authenticator app. Save the recovery codes in your password manager.

## Step 2. Ask the Chief to create an account

Send this: "Please create a free account at github.com/signup with your JRMA email, turn on two-factor authentication, and send me the username. You would use it only to recover JRMA's GitHub organization or the `jrma-ops` backup if I am unavailable."

The organization works with one owner until the Chief's account exists, so step 4 does not wait on this.

## Step 3. Read what conversion does

- `jrmaadmin-creator` becomes an organization. Nobody can sign in to it again.
- Repositories keep the same addresses. Git remotes, issues, and history keep working.
- Commits made as `jrmaadmin-creator` stay in history but no longer link to an account.
- SSH keys, OAuth tokens (the Claude connection included), and profile details are not carried over.
- It cannot be converted back to a personal account.

## Step 4. Convert

1. Sign in as `jrmaadmin-creator` in a normal window.
2. Settings > Organizations. Under "Transform account", click "Turn jrmaadmin-creator into an organization". GitHub renames menus from time to time, so the labels may differ slightly.
3. Read and confirm the warnings.
4. At "Choose an organization owner", type your new personal username.
5. Choose the Free plan and finish.

## Step 5. Set up the organization

Sign in with your personal account. Go to github.com/jrmaadmin-creator, then Settings.

| Setting | Where | Set to | Why |
|---|---|---|---|
| Two-factor authentication | Authentication security | Required | Hub rule: two-factor on every account |
| Base permissions | Member privileges | No permission | Future members see only the repos they are given |
| Repository creation | Member privileges | Owners only | Keeps the organization tidy |
| Billing and contact email | General | A JRMA address | Hub rule: no personal email on service accounts |
| Second owner | People > Invite member | The Chief's username, role Owner | Continuity (G-07, HUB-L02) |

## Step 6. Reconnect Claude

1. Go to claude.ai/connect-github and connect your personal GitHub account.
2. Install the Claude GitHub App on the `jrmaadmin-creator` organization and select `jrma-ops` (and `test` while you keep it).
3. Start new Claude Code sessions with the repos selected. The JRMA Hub chat opener names `jrmaadmin-creator/jrma-ops`; that address does not change.

## Step 7. Tell the hub

Paste the "For the hub" section of `README.md` into the JRMA Hub chat. It records the decision and lists the hub docs that still say "no separate org".

## Check

- [ ] Signed in as your personal account, you see `jrma-ops` in the organization.
- [ ] The organization's People page shows two owners (after the Chief accepts).
- [ ] A Claude Code session can read and push to `jrma-ops`.
- [ ] Nothing JRMA lives on your personal account, and nothing personal lives in the organization.

## Later

- Organization name: keep `jrmaadmin-creator` until the Rename workstream picks the 2027 name. Renaming the organization changes the Bay Board's GitHub Pages address, so do it the same day as the Yodeck URL change (Bay Board ADR-001 already notes this).
- Personal space: what goes there gets decided after we talk through your personal projects.
