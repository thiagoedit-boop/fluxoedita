// FluxoEDITÁ: guarda o app no aparelho pra abrir sem internet.
const VERSAO = "fluxoedita-v3";
const ARQUIVOS = ["./", "./index.html", "./manifest.webmanifest", "./icones/icone-180.png", "./icones/icone-192.png", "./icones/icone-512.png", "./fonts/Unbounded-Bold.ttf", "./fonts/Unbounded-ExtraBold.ttf"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== self.location.origin) return; // a sincronização com o GitHub passa direto
  e.respondWith(caches.open(VERSAO).then(async cache => {
    const salvo = await cache.match(e.request, { ignoreSearch: true });
    const daRede = fetch(e.request).then(r => { if (r && r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => salvo);
    return salvo || daRede;
  }));
});
