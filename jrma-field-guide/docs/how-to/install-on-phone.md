# How to install on your phone

Live site: **https://jrma-field-guide.netlify.app** (Netlify project `jrma-field-guide`).

## Access
The site currently requires a Netlify team login (the team's default visitor protection). Log in to Netlify in the phone's browser first, then open the site.

## Install
- **iPhone:** open the site in Safari → Share → *Add to Home Screen*.
- **Android:** Chrome menu → *Install app*.

Open it once with signal. After that it works with none.

## Updating the live site
From `jrma-field-guide/`, deploy through the Netlify connector (Claude: "deploy jrma-field-guide to Netlify"). `netlify.toml` publishes the `app/` folder with no build step. Bump `VERSION` in `app/sw.js` on every content change, then on the phone: open the app with signal, close it fully, reopen.
