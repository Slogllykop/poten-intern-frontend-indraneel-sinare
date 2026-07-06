/**
 * Network detection layer for monitoring browser connectivity.
 * Pure TypeScript module without React dependencies.
 */

type StatusCallback = (online: boolean) => void;

const listeners = new Set<StatusCallback>();
let isInitialized = false;

function handleOnline() {
    for (const cb of listeners) {
        try {
            cb(true);
        } catch (err) {
            console.error("Error in network online callback:", err);
        }
    }
}

function handleOffline() {
    for (const cb of listeners) {
        try {
            cb(false);
        } catch (err) {
            console.error("Error in network offline callback:", err);
        }
    }
}

function initListeners() {
    if (isInitialized || typeof window === "undefined") return;
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    isInitialized = true;
}

export function isOnline(): boolean {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
}

export function onStatusChange(callback: StatusCallback): void {
    if (typeof window === "undefined") return;
    initListeners();
    listeners.add(callback);
}

export function offStatusChange(callback: StatusCallback): void {
    listeners.delete(callback);
}
