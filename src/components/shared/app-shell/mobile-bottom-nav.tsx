"use client";

import { IconClipboardList, IconPlus } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Single tab button for the mobile bottom navigation bar.
 */
function MobileTab({
    active,
    icon,
    label,
    onClick,
}: {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-4",
                "font-medium text-[0.6875rem] transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                "active:scale-[0.96]",
                active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70",
            )}
        >
            {/* Sliding active background */}
            {active && (
                <motion.span
                    layoutId="mobile-tab-active"
                    className="absolute inset-0 rounded-xl bg-secondary dark:bg-secondary/60"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
            )}
            <span className="relative z-10 flex flex-col items-center gap-1">
                <span
                    className={cn(
                        "transition-transform duration-200",
                        active && "scale-110",
                    )}
                >
                    {icon}
                </span>
                <span className="tracking-tight">{label}</span>
            </span>
            {/* Active dot indicator */}
            {active && (
                <motion.span
                    layoutId="mobile-tab-dot"
                    className="absolute bottom-1.5 size-1 rounded-full bg-emerald-500"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
            )}
        </button>
    );
}

/**
 * Mobile bottom tab bar (hidden on desktop).
 * Floating pill with two tabs: Report and My Reports.
 */
export function MobileBottomNav({
    isTrackerRoute,
    onReport,
    onTracker,
    reportLabel,
    trackerLabel,
}: {
    isTrackerRoute: boolean;
    onReport: () => void;
    onTracker: () => void;
    reportLabel: string;
    trackerLabel: string;
}) {
    return (
        <div
            className={cn(
                "fixed right-0 bottom-0 left-0 z-50 md:hidden",
                "px-4 pt-2 pb-5",
            )}
            style={{
                paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
            }}
        >
            <nav
                aria-label="Bottom navigation"
                className={cn(
                    "flex items-center gap-1 rounded-2xl",
                    "border border-border/70 bg-background/90 backdrop-blur-xl",
                    "p-1.5 shadow-black/10 shadow-xl dark:shadow-black/40",
                )}
            >
                <MobileTab
                    active={!isTrackerRoute}
                    icon={<IconPlus size="1.125rem" strokeWidth={2.25} />}
                    label={reportLabel}
                    onClick={onReport}
                />
                <MobileTab
                    active={isTrackerRoute}
                    icon={
                        <IconClipboardList size="1.125rem" strokeWidth={2.25} />
                    }
                    label={trackerLabel}
                    onClick={onTracker}
                />
            </nav>
        </div>
    );
}
