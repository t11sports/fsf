
const VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${VERSION}`;
const PAGE_CACHE = `pages-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const OFFLINE_URL = '/offline';

const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/favicon.png',
  '/manifest.json',
  '/brand/logo.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_ASSETS.filter(Boolean));
    self.skipWaiting();
  })());
});


// --- IndexedDB helpers ----
// ---- Enhanced retry/backoff + logs ----
const LOG_STORE = 'logs';
const MAX_RETRY = 8; // ~ up to ~ 30s * 2^8 ~ 2 hours max
const BASE_DELAY_MS = 30000;

function upgradeDB(e) {
  const db = e.target.result;
  if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
  if (!db.objectStoreNames.contains(LOG_STORE)) db.createObjectStore(LOG_STORE, { keyPath: 'id', autoIncrement: true });
}

function idbV2() {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, 2);
    open.onupgradeneeded = upgradeDB;
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
}

async function putLog(entry){
  try{
    const db = await idbV2();
    const tx = db.transaction(LOG_STORE, 'readwrite');
    tx.objectStore(LOG_STORE).add({ ts: Date.now(), ...entry });
  }catch{}
}

async function getQueueSnapshot(){
  const db = await idbV2();
  const tx1 = db.transaction(STORE, 'readonly');
  const req1 = tx1.objectStore(STORE).getAll();
  const rows = await new Promise((res, rej)=>{ req1.onsuccess = ()=>res(req1.result||[]); req1.onerror = ()=>rej(req1.error); });
  return rows;
}

async function clearAllQueue(){
  const db = await idbV2();
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).clear();
}

async function putRequestV2(rec){
  if (rec.retryCount == null) rec.retryCount = 0;
  if (rec.nextAttempt == null) rec.nextAttempt = Date.now();
  const db = await idbV2();
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).add(rec);
  await new Promise((res, rej)=>{ tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); });
}

// Override helpers to use V2 DB
idb = idbV2;
putRequest = putRequestV2;

async function notifySnapshot(){
  const items = await getQueueSnapshot();
  const clientsArr = await self.clients.matchAll({ type: 'window' });
  for (const c of clientsArr) c.postMessage({ type: 'QUEUE_SNAPSHOT', items });
}

async function backoff(item, reason){
  const retry = (item.retryCount||0)+1;
  const delay = Math.min(BASE_DELAY_MS * Math.pow(2, retry-1), 30*60*1000);
  item.retryCount = retry;
  item.nextAttempt = Date.now() + delay;
  await putLog({ type:'retry', url:item.url, method:item.method, retry, reason });
  // Reinsert as new record (remove old if exists)
  if (item.id) await clearRequest(item.id);
  await putRequestV2(item);
}

async function flushQueue(){
  const items = await getQueueSnapshot();
  for (const item of items) {
    if ((item.nextAttempt||0) > Date.now()) continue;
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: item.headers || {},
        body: item.body ? (item.bodyType==='json' ? JSON.stringify(item.body) : item.body) : undefined,
      });
      if (res && res.ok) {
        await clearRequest(item.id);
        await putLog({ type:'success', url:item.url, method:item.method, status: res.status });
      } else {
        await backoff(item, 'http_'+(res && res.status));
      }
    } catch (e) {
      await backoff(item, e && e.message || 'network_error');
    }
  }
  await notifyClientsCount(); await notifySnapshot(); await postQueuedEvent(`Queued: ${req.method} ${new URL(req.url).pathname}`);
  await notifySnapshot();
}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'FLUSH_QUEUE') {
    event.waitUntil(flushQueue());
  }
  if (event.data?.type === 'QUEUE_COUNT_REQUEST') {
    event.waitUntil(notifyClientsCount());
  }
  if (event.data?.type === 'QUEUE_SNAPSHOT_REQUEST') {
    event.waitUntil(notifySnapshot());
  }
});

const DB_NAME = 'mnf-queue-db';
const STORE = 'requests';
function idb() {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
}
async function putRequest(rec) {
  const db = await idb(); const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).add(rec);
  return new Promise((res, rej)=>{ tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); });
}
async function getAllRequests() {
  const db = await idb(); const tx = db.transaction(STORE, 'readonly'); const req = tx.objectStore(STORE).getAll();
  return new Promise((res, rej)=>{ req.onsuccess = () => res(req.result || []); req.onerror = () => rej(req.error); });
}
async function clearRequest(id) {
  const db = await idb(); const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).delete(id);
  return new Promise((res, rej)=>{ tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); });
}
async function queuedCount(){
  const all = await getAllRequests(); return all.length || 0;
}
async function notifyClientsCount(){
  const count = await queuedCount();
  const clientsArr = await self.clients.matchAll({ type: 'window' });
  for (const c of clientsArr) c.postMessage({ type: 'QUEUE_COUNT', count });
}

// --- Background flush ----
async function flushQueue(){
  const items = await getAllRequests();
  for (const item of items) {
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: item.headers || {},
        body: item.body ? (item.bodyType==='json' ? JSON.stringify(item.body) : item.body) : undefined,
      });
      if (res && res.ok) {
        await clearRequest(item.id);
      }
    } catch (e) {
      // keep it for the next round
    }
  }
  await notifyClientsCount(); await notifySnapshot(); await postQueuedEvent(`Queued: ${req.method} ${new URL(req.url).pathname}`);
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queued') {
    event.waitUntil(flushQueue());
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'FLUSH_QUEUE') {
    event.waitUntil(flushQueue());
  }
  if (event.data?.type === 'QUEUE_COUNT_REQUEST') {
    event.waitUntil(notifyClientsCount());
  }
});


async function postQueuedEvent(msg){
  try{
    const clientsArr = await self.clients.matchAll({ type: 'window' });
    for (const c of clientsArr) c.postMessage({ type: 'QUEUED_EVENT', message: msg });
  }catch{}
}
async function queueIfOffline(req, cloneJson) {

  try {
    const res = await fetch(req.clone());
    return res;
  } catch (e) {
    const headers = {}; req.headers.forEach((v,k)=>headers[k]=v);
    const rec = { url: req.url, method: req.method, headers, body: cloneJson, bodyType: 'json', createdAt: Date.now() };
    await putRequest(rec);
    await notifyClientsCount(); await notifySnapshot(); await postQueuedEvent(`Queued: ${req.method} ${new URL(req.url).pathname}`);
    if ('sync' in self.registration) {
      try { await self.registration.sync.register('sync-queued'); } catch {}
    }
    return new Response(JSON.stringify({ queued: true, offline: true }), { status: 202, headers: { 'Content-Type': 'application/json' } });
  }
}

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => ![STATIC_CACHE, PAGE_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

function isHTML(request) {
  return request.destination === 'document' || (request.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);


  // Background-queue POSTs when offline (winners & sales)
  if (req.method === 'POST') {
    const urlPath = new URL(req.url).pathname;
    const shouldQueue = urlPath.startsWith('/api/winners') || urlPath.startsWith('/api/sales') || urlPath.startsWith('/api/buyers') || urlPath.startsWith('/api/players');
    if (shouldQueue) {
      event.respondWith((async () => {
        let cloneJson = null;
        try {
          const cloned = req.clone();
          const text = await cloned.text();
          // try JSON decode; fall back to raw text
          try { cloneJson = JSON.parse(text); } catch { cloneJson = text; }
        } catch {}
        return queueIfOffline(req, cloneJson);
      })());
      return;
    }
  }

  // Only handle same-origin
  if (url.origin !== location.origin) return;

  // Avoid caching Next.js build artifacts and dev HMR
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/checkout')) return;

  if (isHTML(req)) {
    // Network-first for pages with offline fallback
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(PAGE_CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cache = await caches.open(PAGE_CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;
        return caches.match(OFFLINE_URL) || new Response('offline', { status: 503 });
      }
    })());
    return;
  }

  // Images & icons: cache-first
  if (req.destination === 'image' || url.pathname.startsWith('/icons/')) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
      } catch {
        return new Response('', { status: 404 });
      }
    })());
    return;
  }

  // Other GET: stale-while-revalidate
  if (req.method === 'GET') {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(req);
      const networkFetch = fetch(req).then(res => { cache.put(req, res.clone()); return res; }).catch(() => null);
      return cached || networkFetch || new Response('', { status: 502 });
    })());
  }
});
