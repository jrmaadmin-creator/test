# ADR 0005: Pre-arrival report sent by email-to-fax, no server

Status: Accepted · 2026-10-04

**Context.** MCH sees our NHESR reports, but they can arrive up to 24 hours later. The ED wants a written summary 5-10 minutes before arrival. Options considered:

| Option | One tap? | Server? | Delivery receipt | Setup |
|---|---|---|---|---|
| C1. Phone mail app → fax vendor's email-to-fax address | 2 taps | No | Emailed to sender | Fax vendor with BAA; JRMA Google Workspace BAA |
| C2. App sends via Gmail API after JRMA Google sign-in | 1 tap | No | Emailed to sender | C1 plus an internal OAuth client in JRMA's Google Cloud project |
| C3. App → JRMA server → fax vendor API | 1 tap | Yes | In app | Hosting with BAA, auth, audit log, ongoing upkeep |
| Commercial pre-arrival platforms (e.g. Pulsara) | 1 tap | Vendor's | In app | Hospital and agency contracts |

**Decision.** Build C1 now. The app builds the report; "Email to fax" opens the phone's mail app addressed to the ED's email-to-fax address with the report as the body. "Share PDF" sends the same report as a fax-ready PDF (Courier, US Letter) through any app. C2 is the next step if C1 is used. C3 only if delivery status inside the app becomes necessary.

**Privacy.** The report carries age (90+ for 90 and over), sex, chief complaint, MOI/NOI, findings, vitals, treatments, alerts, ETA, unit, and callback. It never carries Notes or History free text, names, DOB, or addresses. It is still health information about an identifiable encounter, so the channel must be covered: the fax vendor and the sending mail system both need a BAA with JRMA. HIPAA permits the disclosure itself (treatment).

**Consequences.**
- + No server, no stored keys, no new attack surface.
- + Works the moment JRMA has a BAA-covered fax service.
- − Crew must tap Send in the mail app.
- − Crews must keep street names out of MOI/NOI (geographic detail is an identifier). The field label says so.
