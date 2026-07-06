const CACHE_NAME = "civic-reporter-v1";
const STATIC_ASSETS = ["/", "/manifest.webmanifest", "/favicon.ico"];

// Install event: precache app shell
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }),
    );
    self.skipWaiting();
});

// Activate event: clean old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name)),
            );
        }),
    );
    self.clients.claim();
});

// Fetch event with tailored caching strategies
self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== "GET") {
        return;
    }

    // Skip chrome-extension and non-http/https schemes
    if (!request.url.startsWith("http")) {
        return;
    }

    // Network-only for API calls or server actions
    if (request.url.includes("/api/") || request.headers.has("Next-Action")) {
        return;
    }

    // Cache-first for static assets (images, fonts, stylesheets, scripts)
    if (
        request.destination === "image" ||
        request.destination === "font" ||
        request.destination === "style" ||
        request.destination === "script" ||
        request.url.includes("/_next/static/") ||
        request.url.includes("/icon/") ||
        request.url.includes("/apple-icon")
    ) {
        event.respondWith(
            caches
                .match(request)
                .then((response) => {
                    return (
                        response ||
                        fetch(request).then((res) => {
                            if (res.ok) {
                                const clone = res.clone();
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(request, clone);
                                });
                            }
                            return res;
                        })
                    );
                })
                .catch(() => {
                    return caches.match("/");
                }),
        );
        return;
    }

    // Network-first with cache fallback for HTML documents / navigation
    if (request.destination === "document" || request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, clone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match("/").then((cached) => {
                        return (
                            cached ||
                            new Response("Offline", {
                                status: 503,
                                statusText: "Offline",
                            })
                        );
                    });
                }),
        );
        return;
    }

    // Default: stale-while-revalidate
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, clone);
                        });
                    }
                    return response;
                })
                .catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        }),
    );
});
