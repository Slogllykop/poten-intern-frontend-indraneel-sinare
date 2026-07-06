/**
 * Service Worker layer for registering SW and detecting updates.
 */

export function registerSW(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        return Promise.resolve(null);
    }

    return navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
            console.log(
                "Service Worker registered with scope:",
                registration.scope,
            );
            return registration;
        })
        .catch((error) => {
            console.error("Service Worker registration failed:", error);
            return null;
        });
}

export function onUpdateAvailable(callback: () => void): void {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        return;
    }

    navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                    if (
                        newWorker.state === "installed" &&
                        navigator.serviceWorker.controller
                    ) {
                        callback();
                    }
                });
            }
        });
    });
}
