# ADR 0001: Ship as one offline HTML file

- Status: Accepted
- Date: 2026-09-29

## Context

The audience is EMS students and providers. They study on phones, school laptops and station computers, often with poor or no internet, and are not developers. The app needs three.js (WebGL) for the 3D view.

## Decision

Bundle everything (three.js, app code, CSS) with esbuild into `dist/heart-conduction-lab.html` and commit that file. No CDN loads at runtime. Google Fonts is the only external request and has system-font fallbacks.

## Consequences

- Opens by double-click, works offline, can be emailed or put on a USB drive.
- About 600 KB, most of it three.js.
- `dist/` must be rebuilt and committed with every source change (`npm run build`).
- No framework: vanilla JS modules keep the build to one esbuild call.
