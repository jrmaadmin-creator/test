# How to install on your phone

A PWA must be served over HTTPS to install and work offline.

| Option | Cost | Note |
|---|---|---|
| GitHub Pages | Free for public repos; private repos need a paid plan | Needs a Pages Actions workflow that publishes the `app/` folder. The code holds no patient data. |
| Netlify / Cloudflare Pages | Free tier | Drag-and-drop the `app/` folder. |

Then on iPhone: open the URL in Safari → Share → *Add to Home Screen*. On Android: Chrome menu → *Install app*. Open it once with signal; after that it works with none.

After an update: open the app with signal, close it fully, reopen.
