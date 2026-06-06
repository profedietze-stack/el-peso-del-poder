const CACHE = 'sdr-v19';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return fetch(self.registration.scope).then(r => {
        if (r.ok) cache.put(self.registration.scope, r);
      }).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.startsWith('chrome-extension') || url.startsWith('blob:') ||
      url.startsWith('data:') || url.includes('fonts.googleapis')) return;

  e.respondWith(
    fetch(e.request).then(response => {
      if (response && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => {
      return caches.match(e.request).then(cached => {
        if (cached) return cached;
        return caches.match(self.registration.scope);
      });
    })
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'CACHE_PAGE') {
    caches.open(CACHE).then(cache => {
      fetch(e.data.url).then(r => { if (r.ok) cache.put(e.data.url, r); }).catch(() => {});
    });
  }
});
