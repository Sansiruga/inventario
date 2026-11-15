const C="invrep-v4",XL="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
const FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{
  const c=await caches.open(C);await Promise.all(FILES.map(async f=>c.put(f,await fetch(f,{cache:"reload"}))));
  try{await c.put(XL,await fetch(XL,{mode:"no-cors"}))}catch(x){}
  self.skipWaiting()})())});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==C)await caches.delete(k);
  await self.clients.claim()})())});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith((async()=>{
    const m=await caches.match(e.request,{ignoreSearch:true});
    if(m)return m;
    try{const r=await fetch(e.request);
      if(r&&(r.ok||r.type==="opaque")){const c=await caches.open(C);c.put(e.request,r.clone())}
      return r}
    catch(x){if(e.request.mode==="navigate")return caches.match("index.html");throw x}
  })())});
