"use client";

import {
    IconClipboardList,
    IconPlus,
    IconShieldCheck,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "../language-toggle";
import { OfflineBanner } from "../offline-banner";
import { ThemeToggle } from "../theme-toggle";

/**
 * Desktop pill-style navigation pill button.
 * Uses a shared layoutId for the sliding active background.
 */
function NavPill({
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
                "relative z-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                "font-medium text-xs transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                "active:scale-[0.96]",
                active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
            )}
        >
            {/* Sliding active background */}
            {active && (
                <motion.span
                    layoutId="nav-pill-active"
                    className="-z-10 absolute inset-0 rounded-lg bg-background shadow-black/10 shadow-xs dark:shadow-black/30"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
                {icon}
                {label}
            </span>
        </button>
    );
}

/**
 * Desktop top navigation bar (hidden on mobile).
 * Logo left, nav pills center, theme/language toggles right.
 */
export function DesktopNavbar({
    isFormFlow,
    isTrackerRoute,
    onReport,
    onTracker,
    reportLabel,
    trackerLabel,
    appTitle,
}: {
    isFormFlow: boolean;
    isTrackerRoute: boolean;
    currentStep: string;
    onReport: () => void;
    onTracker: () => void;
    reportLabel: string;
    trackerLabel: string;
    appTitle: string;
}) {
    return (
        <header
            className={cn(
                "sticky top-0 z-40 hidden md:flex md:flex-col",
                "border-border/50 border-b",
                "bg-background/85 backdrop-blur-xl backdrop-saturate-150",
            )}
        >
            <OfflineBanner />
            <div className="flex h-16 w-full items-center justify-between px-6">
                {/* Left: Logo + App name */}
                <div className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-emerald-600/30 shadow-sm">
                        <IconShieldCheck size="0.9rem" strokeWidth={2} />
                    </div>
                    <h1 className="font-semibold text-foreground text-sm tracking-tight">
                        {appTitle}
                    </h1>
                </div>

                {/* Center: Nav pills */}
                <nav
                    aria-label="Main navigation"
                    className="flex items-center gap-1 rounded-xl border border-border/60 bg-secondary/30 p-1"
                >
                    <NavPill
                        active={isFormFlow}
                        icon={<IconPlus size="0.8125rem" strokeWidth={2.25} />}
                        label={reportLabel}
                        onClick={onReport}
                    />
                    <NavPill
                        active={isTrackerRoute}
                        icon={
                            <IconClipboardList
                                size="0.8125rem"
                                strokeWidth={2.25}
                            />
                        }
                        label={trackerLabel}
                        onClick={onTracker}
                    />
                </nav>

                {/* Right: Theme toggle + Language toggle */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <LanguageToggle />
                </div>
            </div>
        </header>
    );
}
