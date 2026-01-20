const CACHE_NAME = 'lawyer-pwa-v2';

const PRECACHE_URLS = [
  './',
  './index.html',
  './new.html',
  './search.html',
  './sessions.html',
  './session-edit.html',
  './accounts.html',
  './administrative.html',
  './clerk-papers.html',
  './expert-sessions.html',
  './archive.html',
  './legal-library.html',
  './reports.html',
  './settings.html',
  './setup.html',
  './case-info.html',

  './manifest.json',
  './icons/icon-mobile.png',
  './icons/icon.ico',

  './css/tailwind.min.css',
  './css/remixicon.css',
  './css/remixicon.woff2',
  './css/local-fonts.css',
  './css/style.css',
  './css/search-responsive.css',
  './css/search-responsive.css?v=3',

  './css/fonts/cairo-bold.woff2',
  './css/fonts/cairo-regular.woff2',
  './css/fonts/material-symbols.woff2',
  './css/fonts/roboto-bold.woff2',
  './css/fonts/roboto-light.woff2',
  './css/fonts/roboto-medium.woff2',
  './css/fonts/roboto-regular.woff2',

  './audio/all.mp3',
  './audio/manger.mp3',
  './audio/session1.mp3',
  './audio/session2.mp3',
  './audio/sessionsmix.mp3',

  './js/accounts.js',
  './js/administrative.js',
  './js/archive.js',
  './js/autocomplete.js',
  './js/case_opponent_view.js',
  './js/clerk_papers.js',
  './js/clerk_papers_form.js',
  './js/client_view.js',
  './js/db.js',
  './js/edit_forms.js',
  './js/expert_sessions.js',
  './js/expert_sessions_form.js',
  './js/header.js',
  './js/inline_edit.js',
  './js/legal_library.js',
  './js/main.js',
  './js/modal.js',
  './js/new-page.js',
  './js/notifications-portal.js',
  './js/opponent_navigation.js',
  './js/quick-sync.js',
  './js/reports-accounts.js',
  './js/reports-administrative.js',
  './js/reports-archive.js',
  './js/reports-cases.js',
  './js/reports-clerk-papers.js',
  './js/reports-client-comprehensive.js',
  './js/reports-expert-sessions.js',
  './js/reports-main.js',
  './js/reports-poa.js',
  './js/safe-confirm.js',
  './js/search-page.js',
  './js/sessions.js',
  './js/sessions_calendar.js',
  './js/settings-users.js',
  './js/settings.js',
  './js/setup.js',
  './js/state.js',
  './js/test-data.js',
  './js/toast.js',
  './js/trial.js',
  './js/updater.js',

  './pwa-register.js',
  './js/html2pdf.bundle.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // IMPORTANT: cache.addAll() fails the whole install if any single URL fails.
      // We cache best-effort to ensure SW still installs and app remains usable offline.
      await Promise.allSettled(
        PRECACHE_URLS.map((url) => cache.add(url).catch(() => null))
      );

      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  try {
    const data = event.data || {};
    if (data.type !== 'PRECACHE_ALL' && data.type !== 'PRECACHE_URLS') return;

    const sourceId = (event.source && event.source.id) ? event.source.id : null;

    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const urls = (data.type === 'PRECACHE_URLS' && Array.isArray(data.urls)) ? data.urls : PRECACHE_URLS;
        const total = urls.length;
        let done = 0;
        const failed = [];

        for (const url of urls) {
          try {
            await cache.add(url);
          } catch (_) {
            try { failed.push(url); } catch (_) {}
          } finally {
            done += 1;
            try {
              if (sourceId) {
                const client = await clients.get(sourceId);
                if (client) client.postMessage({ type: 'PRECACHE_PROGRESS', done, total });
              } else {
                const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
                allClients.forEach((c) => c.postMessage({ type: 'PRECACHE_PROGRESS', done, total }));
              }
            } catch (_) {}
          }
        }

        try {
          if (sourceId) {
            const client = await clients.get(sourceId);
            if (client) client.postMessage({ type: 'PRECACHE_COMPLETE', done, total, failed });
          } else {
            const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
            allClients.forEach((c) => c.postMessage({ type: 'PRECACHE_COMPLETE', done, total, failed }));
          }
        } catch (_) {}
      })()
    );
  } catch (_) {}
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let isSameOrigin = false;
  try {
    const u = new URL(req.url);
    isSameOrigin = (u.origin === self.location.origin);
  } catch (_) {}

  event.respondWith(
    caches.match(req, isSameOrigin ? { ignoreSearch: true } : undefined).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') {
            return caches.match(req, isSameOrigin ? { ignoreSearch: true } : undefined)
              .then((navCached) => navCached || caches.match('./index.html'));
          }
          return cached;
        });
    })
  );
});
