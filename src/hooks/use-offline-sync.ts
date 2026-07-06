"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    isOnline as getIsOnline,
    offStatusChange,
    onStatusChange,
} from "@/layers/network";
import {
    getPendingSubmissions,
    updateSubmissionStatus,
} from "@/layers/storage";

export interface UseOfflineSyncReturn {
    isOnline: boolean;
    pendingCount: number;
    isSyncing: boolean;
    lastSyncedCount: number;
    syncPending: () => Promise<number>;
    refreshPending: () => Promise<void>;
}

function subscribe(callback: () => void) {
    onStatusChange(callback);
    return () => offStatusChange(callback);
}

/**
 * Hook to monitor offline status, track pending sync queue, and automatically
 * sync stored offline submissions when connectivity is restored.
 */
export function useOfflineSync(): UseOfflineSyncReturn {
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [lastSyncedCount, setLastSyncedCount] = useState<number>(0);

    useEffect(() => {
        setIsOnline(getIsOnline());
        const unsubscribe = subscribe(() => {
            setIsOnline(getIsOnline());
        });
        return unsubscribe;
    }, []);

    const checkPending = useCallback(async () => {
        try {
            const pending = await getPendingSubmissions();
            setPendingCount(pending.length);
        } catch {
            // silent fail
        }
    }, []);

    const syncPending = useCallback(async (): Promise<number> => {
        if (!getIsOnline() || isSyncing) return 0;
        try {
            setIsSyncing(true);
            const pending = await getPendingSubmissions();
            if (pending.length === 0) {
                setIsSyncing(false);
                return 0;
            }

            for (const sub of pending) {
                await updateSubmissionStatus(sub.id, "submitted");
            }

            setLastSyncedCount(pending.length);
            await checkPending();
            setIsSyncing(false);
            return pending.length;
        } catch (error) {
            console.error("Failed to sync pending submissions:", error);
            setIsSyncing(false);
            return 0;
        }
    }, [isSyncing, checkPending]);

    const syncPendingRef = useRef(syncPending);
    useEffect(() => {
        syncPendingRef.current = syncPending;
    }, [syncPending]);

    useEffect(() => {
        checkPending();
    }, [checkPending]);

    useEffect(() => {
        if (isOnline) {
            syncPendingRef.current();
        }
    }, [isOnline]);

    return {
        isOnline,
        pendingCount,
        isSyncing,
        lastSyncedCount,
        syncPending,
        refreshPending: checkPending,
    };
}
