# ADR 0004: Host on Netlify, install to the Home Screen

- Status: Accepted
- Date: 2026-10-08

## Context

Browsers give GPS only to pages served over https; a file opened from the phone's Files app does not qualify. Safari can clear a website's stored data after 7 days without use unless the site is added to the Home Screen.

## Decision

Build a small static site (`dist/`: one HTML page with inline JS and CSS, a web app manifest, a service worker for offline use, an icon). Host it on Netlify. Install it on the phone with Share > Add to Home Screen. Deploy only after the owner approves each publish.

## Consequences

- Free, https, works offline after the first load.
- The URL is public, but the page holds no data. Trip data lives only on the phone.
- Uses the owner's connected Netlify account.
- The app requests persistent storage and reminds the user to export weekly.
