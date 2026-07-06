"use client";

import { IconCheck, IconWifiOff } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useOfflineSync } from "@/hooks/use-offline-sync";
import { useLanguage } from "@/i18n";

/**
 * Sliding banner that appears at the top of the app when offline or when syncing offline queue.
 * Slides down smoothly, pushing application content down, and auto-hides when online.
 */
export function OfflineBanner() {
    const { t } = useLanguage();
    const { isOnline, pendingCount, lastSyncedCount } = useOfflineSync();
    const [showSyncedToast, setShowSyncedToast] = useState(false);

    useEffect(() => {
        if (isOnline && lastSyncedCount > 0) {
            setShowSyncedToast(true);
            const timer = setTimeout(() => setShowSyncedToast(false), 3500);
            return () => clearTimeout(timer);
        }
    }, [isOnline, lastSyncedCount]);

    const isOffline = !isOnline;

    return (
        <AnimatePresence initial={false}>
            {isOffline && (
                <motion.div
                    key="offline"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                        duration: 0.35,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="w-full overflow-hidden bg-amber-500 text-zinc-950 shadow-sm dark:bg-amber-500"
                >
                    <div className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 px-4 py-2 text-center font-medium text-xs sm:text-sm">
                        <IconWifiOff
                            size="1rem"
                            className="shrink-0"
                            strokeWidth={2.25}
                        />
                        <span>{t("offline.banner")}</span>
                        {pendingCount > 0 && (
                            <span className="ml-1 rounded-full bg-zinc-950/20 px-2 py-0.5 font-bold text-[0.7rem]">
                                {pendingCount}
                            </span>
                        )}
                    </div>
                </motion.div>
            )}
            {showSyncedToast && !isOffline && (
                <motion.div
                    key="synced"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                        duration: 0.35,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="w-full overflow-hidden bg-emerald-600 text-white shadow-sm"
                >
                    <div className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 px-4 py-2 text-center font-medium text-xs sm:text-sm">
                        <IconCheck
                            size="1rem"
                            className="shrink-0"
                            strokeWidth={2.5}
                        />
                        <span>{t("offline.synced")}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
