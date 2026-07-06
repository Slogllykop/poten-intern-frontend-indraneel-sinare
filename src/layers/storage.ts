/**
 * IndexedDB storage layer for civic issue submissions.
 *
 * Pure TypeScript module with zero React dependencies.
 * Wraps the raw IndexedDB API to keep the bundle small (no idb library).
 * Falls back to localStorage if IndexedDB is unavailable.
 *
 * Why raw IndexedDB: the idb wrapper adds ~3KB gzipped. For a Slow-3G-tolerant
 * PWA storing simple JSON documents, the native API is sufficient and keeps
 * the critical path lighter.
 */

import { STORAGE_CONSTANTS } from "@/lib/constants";
import type { Submission, SubmissionStatus } from "@/types";

// ---------------------------------------------------------------------------
// IndexedDB helpers
// ---------------------------------------------------------------------------

let dbPromise: Promise<IDBDatabase> | null = null;

function isIndexedDBAvailable(): boolean {
    try {
        return typeof indexedDB !== "undefined" && indexedDB !== null;
    } catch {
        return false;
    }
}

/**
 * Open (or create) the database. Reuses a single promise so we only
 * open the connection once per session.
 */
function openDB(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(
            STORAGE_CONSTANTS.DB_NAME,
            STORAGE_CONSTANTS.DB_VERSION,
        );

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORAGE_CONSTANTS.STORE_NAME)) {
                const store = db.createObjectStore(
                    STORAGE_CONSTANTS.STORE_NAME,
                    {
                        keyPath: "id",
                        autoIncrement: true,
                    },
                );
                store.createIndex("status", "status", { unique: false });
                store.createIndex("createdAt", "createdAt", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            dbPromise = null;
            reject(request.error);
        };
    });

    return dbPromise;
}

/**
 * Generic helper: run a transaction against the submissions store.
 */
async function withStore<T>(
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
    const db = await openDB();
    return new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORAGE_CONSTANTS.STORE_NAME, mode);
        const store = tx.objectStore(STORAGE_CONSTANTS.STORE_NAME);
        const request = fn(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// ---------------------------------------------------------------------------
// localStorage fallback (same interface, JSON-serialised array)
// ---------------------------------------------------------------------------

function lsRead(): Submission[] {
    try {
        const raw = localStorage.getItem(STORAGE_CONSTANTS.LS_KEY);
        return raw ? (JSON.parse(raw) as Submission[]) : [];
    } catch {
        return [];
    }
}

function lsWrite(submissions: Submission[]): void {
    try {
        localStorage.setItem(
            STORAGE_CONSTANTS.LS_KEY,
            JSON.stringify(submissions),
        );
    } catch {
        // storage full or private browsing - silent fail
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Persist a new submission. Returns the auto-generated numeric id. */
export async function saveSubmission(
    data: Omit<Submission, "id">,
): Promise<number> {
    if (isIndexedDBAvailable()) {
        const id = await withStore<IDBValidKey>("readwrite", (store) =>
            store.add(data),
        );
        return id as number;
    }

    // localStorage fallback: simulate auto-increment
    const all = lsRead();
    const nextId = all.length > 0 ? Math.max(...all.map((s) => s.id)) + 1 : 1;
    const entry: Submission = { ...data, id: nextId };
    lsWrite([...all, entry]);
    return nextId;
}

/** Retrieve all submissions, newest first. */
export async function getSubmissions(): Promise<Submission[]> {
    if (isIndexedDBAvailable()) {
        const all = await withStore<Submission[]>(
            "readonly",
            (store) => store.getAll() as IDBRequest<Submission[]>,
        );
        return all.sort((a, b) => b.createdAt - a.createdAt);
    }
    return lsRead().sort((a, b) => b.createdAt - a.createdAt);
}

/** Get a single submission by its numeric id. */
export async function getSubmissionById(
    id: number,
): Promise<Submission | null> {
    if (isIndexedDBAvailable()) {
        const result = await withStore<Submission | undefined>(
            "readonly",
            (store) => store.get(id) as IDBRequest<Submission | undefined>,
        );
        return result ?? null;
    }
    return lsRead().find((s) => s.id === id) ?? null;
}

/** Get submissions that have not yet been synced. */
export async function getPendingSubmissions(): Promise<Submission[]> {
    if (isIndexedDBAvailable()) {
        const db = await openDB();
        return new Promise<Submission[]>((resolve, reject) => {
            const tx = db.transaction(STORAGE_CONSTANTS.STORE_NAME, "readonly");
            const store = tx.objectStore(STORAGE_CONSTANTS.STORE_NAME);
            const index = store.index("status");
            const request = index.getAll("pending");

            request.onsuccess = () => resolve(request.result as Submission[]);
            request.onerror = () => reject(request.error);
        });
    }
    return lsRead().filter((s) => s.status === "pending");
}

/** Update the status of a submission. */
export async function updateSubmissionStatus(
    id: number,
    status: SubmissionStatus,
): Promise<void> {
    if (isIndexedDBAvailable()) {
        const db = await openDB();
        return new Promise<void>((resolve, reject) => {
            const tx = db.transaction(
                STORAGE_CONSTANTS.STORE_NAME,
                "readwrite",
            );
            const store = tx.objectStore(STORAGE_CONSTANTS.STORE_NAME);
            const getReq = store.get(id);

            getReq.onsuccess = () => {
                const existing = getReq.result as Submission | undefined;
                if (!existing) {
                    reject(new Error(`Submission ${id} not found`));
                    return;
                }
                const putReq = store.put({ ...existing, status });
                putReq.onsuccess = () => resolve();
                putReq.onerror = () => reject(putReq.error);
            };
            getReq.onerror = () => reject(getReq.error);
        });
    }

    // localStorage fallback
    const all = lsRead();
    const idx = all.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Submission ${id} not found`);
    all[idx] = { ...all[idx], status };
    lsWrite(all);
}
