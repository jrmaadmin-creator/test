# How to set up "Fax now" (direct fax)

The app sends through JRMA's Netlify site (`/api/fax`), which calls the SRFax API.

## Netlify environment variables
Netlify → project **jrma-field-guide** → Project configuration → Environment variables.

| Key | Value | Set by |
|---|---|---|
| `SRFAX_ACCESS_ID` | SRFax account number (Account Summary page) | Owner |
| `SRFAX_ACCESS_PWD` | SRFax login password | Owner |
| `SRFAX_CALLER_ID` | 6033866611 | Done |
| `SRFAX_SENDER_EMAIL` | cgill@jaffreyrindgeambulance.com (receives SRFax confirmations) | Done |
| `FAX_ALLOWED_NUMBERS` | 6035322405 (comma-separate more, e.g. the MCH ED fax) | Done |
| `FAX_PIN` | 6-digit crew PIN | Done |
| `FAX_REQUIRE_TEST` | leave unset (test-only) until a HIPAA-covered host is in place | — |

After changing any variable, redeploy the site (environment changes apply on the next deploy).

## On the phone
To ED → Settings → **Fax PIN**. Keep **Test mode** on. Tap **Fax now**; the status box shows Queued → Delivered or Failed with the reason.

## Adding the MCH ED fax later
Add its 10-digit number to `FAX_ALLOWED_NUMBERS`, redeploy, and change the fax number in the app's Settings.
