# How to install on your phone

Live site: **https://jrma-field-guide.netlify.app** (Netlify project `jrma-field-guide`).

## Access
Public link (owner's choice, 2026-10-04). The app stores no patient data and every screen shows its UNVERIFIED status.

## Install
- **iPhone:** open the site in Safari → Share → *Add to Home Screen*.
- **Android:** Chrome menu → *Install app*.

Open it once with signal. After that it works with none.

## Updating the live site
From `jrma-field-guide/`, deploy through the Netlify connector (Claude: "deploy jrma-field-guide to Netlify"). `netlify.toml` publishes the `app/` folder with no build step. Bump `VERSION` in `app/sw.js` on every content change, then on the phone: open the app with signal, close it fully, reopen.
