"use client";

import { IconWifiOff } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n";

/**
 * Sliding banner that appears at the top of the app when offline.
 * Slides down smoothly, pushing application content down, and auto-hides when online.
 */
export function OfflineBanner() {
    const { t } = useLanguage();
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Initial state check
        setIsOffline(!navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <AnimatePresence initial={false}>
            {isOffline && (
                <motion.div
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
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
