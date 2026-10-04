// Cache-first app shell so the app works with no cell signal.
// Bump VERSION whenever any file below changes, or phones keep the old copy.
const VERSION = 'v7';
const FILES = [
  './',
  'index.html',
  'css/app.css',
  'manifest.webmanifest',
  'icons/icon.svg',
  'js/app.js',
  'js/engine.js',
  'js/prearrival.js',
  'js/pdf.js',
  'js/peds.js',
  'js/doses.js',
  'js/cpr.js',
  'js/data/nh-arrest.js',
  'js/data/nh-doses.js',
  'js/data/nh-a3.js',
  'js/protocols/index.js',
  'js/protocols/assessment.js',
  'js/protocols/chest-pain.js',
  'js/protocols/respiratory.js',
  'js/protocols/stroke.js',
  'js/protocols/diabetic.js',
  'js/protocols/allergic.js',
  'js/protocols/opioid.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
