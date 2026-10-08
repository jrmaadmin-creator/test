# ADR 0008: Direct fax from the app through a Netlify Function and the SRFax API

Status: Accepted · 2026-10-05 (supersedes the "C1 only" decision in ADR 0005 for sending)

**Context.** The owner wants one tap to fax, with no mail app. Email-to-fax depended on the phone's mail setup and on SRFax's authorized-sender list. SRFax's HTTPS API (`Queue_Fax`, `Get_FaxStatus`) needs the account number and password, which cannot live in a public web app.

**Decision.**
- `netlify/functions/fax.mts` at `/api/fax`: POST queues the fax (PDF built on the phone, no cover page); GET returns delivery status. Logic in `netlify/lib/srfax.mjs`, unit tested.
- Secrets and policy live in Netlify environment variables: `SRFAX_ACCESS_ID`, `SRFAX_ACCESS_PWD`, `SRFAX_CALLER_ID`, `SRFAX_SENDER_EMAIL`, `FAX_PIN`, `FAX_ALLOWED_NUMBERS`, optional `FAX_REQUIRE_TEST`.
- Abuse limits: crew PIN, and the server faxes only to numbers on `FAX_ALLOWED_NUMBERS`. A leaked PIN cannot fax anywhere else.
- **Test-only gate:** the server refuses any report whose subject does not start with `TEST` until `FAX_REQUIRE_TEST=false`. Report content passes through Netlify; Netlify signs a HIPAA BAA only on specific enterprise arrangements (verify with Netlify). Real patient reports wait for a covered host or a BAA.
- The app polls status every 10 s for up to 5 minutes and shows Delivered / Failed with SRFax's reason. Gmail and Mail-app sending stay as backups.
- The function logs only the SRFax status word, never report content.

**Consequences.**
- + One tap, delivery confirmation inside the app.
- − JRMA now runs a server: credentials to rotate, a PIN to manage, a hosting BAA to obtain before live use.
