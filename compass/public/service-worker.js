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
  "/globals.css",
  "/components/ServiceWorkerRegister.js",
  MAPTILER_STYLE_URL,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      console.log(" Caching static assets and locations...");
      await cache.addAll(staticAssets);

      try {
        const res = await fetch("/api/locations");
        cache.put("/locations.json", res.clone());
      } catch (err) {
        console.warn(" Failed to fetch locations:", err);
      }
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log(" Service Worker activated");
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
