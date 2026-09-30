/* Service Worker der Zauber-Detektei: macht das Spiel offline spielbar.
   - Beim Installieren werden alle Dateien gespeichert (Version 7f7191624b).
   - Seitenaufruf: erst im Netz nach einer neuen Version schauen, sonst die gespeicherte nehmen.
   - Bilder und Symbole: direkt aus dem Speicher.
   Es werden keine Daten verschickt. */
const CACHE = 'zauberdetektei-7f7191624b';
const FILES = ["./", "index.html", "manifest.webmanifest", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "partner_lumi_freudig.webp", "partner_lumi_nachdenklich.webp", "partner_lumi_normal.webp", "partner_lumi_ueberrascht.webp", "partner_nova_freudig.webp", "partner_nova_nachdenklich.webp", "partner_nova_normal.webp", "partner_nova_ueberrascht.webp"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('zauberdetektei-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate'){
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; }).catch(() => caches.match('index.html', { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
