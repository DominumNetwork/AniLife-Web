// Minimal app-shell cache so the UI loads offline; API/image requests always go to the network.
const C = 'anilili-shell-v1';
const SHELL = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/api.js', 'js/store.js', 'js/ui.js', 'js/sources.js', 'js/config.js',
  'js/views/home.js', 'js/views/search.js', 'js/views/schedule.js', 'js/views/library.js', 'js/views/settings.js', 'js/views/detail.js', 'js/views/watch.js', 'js/views/notifications.js', 'assets/logo.png'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(C).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
});
