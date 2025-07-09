// i will remove consoles in the end, 


const STATIC_CACHE = "campus-compass-static-v1";
const API_CACHE = "campus-compass-api-v1";

const MAPTILER_STYLE_URL =
  "https://api.maptiler.com/maps/streets-v2/style.json?key=LlBgIboBwPwSOXm52XBf";
////scrt link
const staticAssets = [
  "/",
  "/favicon.ico",
  "/manifest.json",
  "/offline.html",
  // "/globals.css",
  "/components/ServiceWorkerRegister.js",
  MAPTILER_STYLE_URL,
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
    for (const asset of staticAssets) {
        try {
          await cache.add(asset);
          console.log(" Cached:", asset);
        } catch (err) {
          console.error(" Failed to cache:", asset, err);
        }
      }
      console.log("Static assets cached");
     let allLocations = [];
      try {
        console.log("dd")
        const res = await fetch(`http://localhost:8081/api/maps/cachelocations?start=1&end=20`);
        if (res.ok) {
          const first20 = await res.json();
          allLocations.push(...first20);
          console.log("Fetched first 20 locations:", first20.length);
          const firstResponse = new Response(JSON.stringify(allLocations), {
            headers: { "Content-Type": "application/json" },
          });
          await cache.put("/locations.json", firstResponse);
          console.log("Cached first 20 locations");
        }
      } catch (err) {
        console.warn("Failed to fetch first 20:", err);
      }

      // Step 2: Start background fetch of next batches
  for (let start = 21; start <= 500; start += 20) {
  const end = start + 19;
  try {
    const res = await fetch(`http://localhost:8081/api/maps/cachelocations?start=${start}&end=${end}`);
    if (res.ok) {
      const chunk = await res.json();

      if (!chunk || chunk.length === 0) {
        console.log(`No more data from backend at ${start}-${end}, stopping.`);
        break; 
      }

      allLocations.push(...chunk);

      const updatedResponse = new Response(JSON.stringify(allLocations), {
        headers: { "Content-Type": "application/json" },
      });
      await cache.put("/locations.json", updatedResponse);
      console.log(`Added ${start}-${end} to cache`);
    }
  } catch (err) {
    console.warn(`Failed to fetch ${start}-${end}:`, err);
  }
}




    })()
  );
});








self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  if (
    request.url.includes("api.maptiler.com") ||
    request.url.includes("tile.openstreetmap.org")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((networkResponse) => {
            return caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      })
    );
    return;
  }

  if (url.pathname.startsWith("/api/auth")) {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) =>
          caches.open(API_CACHE).then((cache) => {
            cache.put(request, response.clone());
            return response;
          })
        )
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        if (
          request.url.startsWith(self.location.origin) &&
          (request.url.endsWith(".js") ||
            request.url.endsWith(".css") ||
            request.url.endsWith(".png"))
        ) {
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      });
    })
  );
});

