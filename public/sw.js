const CACHE_NAME = "novus-v2";
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

// Activate event: clean old caches immediately and take control
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

    // Network-only for API calls, server actions, or Next.js dev websocket/hot-reload
    if (
        request.url.includes("/api/") ||
        request.headers.has("Next-Action") ||
        request.url.includes("/_next/webpack-hmr") ||
        request.url.includes("/__nextjs")
    ) {
        return;
    }

    // Cache-first for immutable Next.js static assets, scripts, styles, fonts, and icons
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
                .match(request, { ignoreSearch: true })
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(request).then((networkResponse) => {
                        if (networkResponse?.ok) {
                            const clone = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, clone);
                            });
                        }
                        return networkResponse;
                    });
                })
                .catch(() => {
                    // NEVER return HTML fallback for script/style/image requests as it breaks React Hydration!
                    return new Response("Asset Unavailable Offline", {
                        status: 408,
                        statusText: "Offline Asset Missing",
                    });
                }),
        );
        return;
    }

    // Network-first with cache fallback for HTML documents / navigation
    if (request.destination === "document" || request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse?.ok) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, clone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return caches
                        .match(request, { ignoreSearch: true })
                        .then((cachedResponse) => {
                            return (
                                cachedResponse ||
                                caches
                                    .match("/", { ignoreSearch: true })
                                    .then((fallback) => {
                                        return (
                                            fallback ||
                                            new Response(
                                                "<!DOCTYPE html><html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>",
                                                {
                                                    status: 503,
                                                    headers: {
                                                        "Content-Type":
                                                            "text/html",
                                                    },
                                                },
                                            )
                                        );
                                    })
                            );
                        });
                }),
        );
        return;
    }

    // Default: Stale-while-revalidate for all other standard GET requests (including RSC payloads)
    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse?.ok) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, clone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return (
                        cachedResponse ||
                        new Response(
                            JSON.stringify({
                                error: "Offline - Resource Unavailable",
                            }),
                            {
                                status: 503,
                                statusText: "Service Unavailable",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            },
                        )
                    );
                });

            return cachedResponse || fetchPromise;
        }),
    );
});
