"use client";

import {
    IconClipboardList,
    IconPlus,
    IconShieldCheck,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useStepNavigation } from "@/hooks/step-context";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./language-toggle";
import { OfflineBanner } from "./offline-banner";
import { StepIndicator } from "./step-indicator";
import { ThemeToggle } from "./theme-toggle";

/**
 * App shell with two distinct navbars:
 *
 * - Desktop (md+): sticky top bar - logo left, step indicator center, actions right.
 * - Mobile (<md): minimal sticky top bar + fixed bottom tab bar with Report / My Reports.
 *
 * Dark mode is toggled via ThemeToggle (next-themes).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage();
    const { currentStep, reset, goToStep } = useStepNavigation();
    const pathname = usePathname();
    const router = useRouter();

    const isTrackerRoute = pathname === "/issues" || currentStep === "tracker";
    const isFormFlow = !isTrackerRoute;

    // ARIA live region: announce current step to screen readers
    const stepLabel = useMemo(() => {
        if (isTrackerRoute) return t("tracker.title");
        const stepNames: Record<string, string> = {
            category: t("step.category"),
            details: t("step.details"),
            confirmation: t("step.confirmation"),
        };
        return stepNames[currentStep] || "";
    }, [currentStep, isTrackerRoute, t]);

    const liveRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (liveRef.current) {
                liveRef.current.textContent = stepLabel;
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [stepLabel]);

    const handleGoToTracker = () => {
        router.push("/issues");
    };

    const handleGoToReport = () => {
        reset();
        if (pathname === "/issues") {
            router.push("/");
        } else {
            goToStep("category");
        }
    };

    return (
        <div className="flex min-h-dvh flex-col bg-background">
            {/* ─────────────────────────────────────────
                DESKTOP NAVBAR (hidden on mobile)
                Full pill-style top nav like the reference image.
            ───────────────────────────────────────── */}
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
                            {t("app.title")}
                        </h1>
                    </div>

                    {/* Center: Nav pills (Report | My Reports) */}
                    <nav
                        aria-label="Main navigation"
                        className="flex items-center gap-1 rounded-xl border border-border/60 bg-secondary/30 p-1"
                    >
                        <NavPill
                            active={isFormFlow}
                            icon={
                                <IconPlus size="0.8125rem" strokeWidth={2.25} />
                            }
                            label={t("nav.reportAnother")}
                            onClick={handleGoToReport}
                        />
                        <NavPill
                            active={isTrackerRoute}
                            icon={
                                <IconClipboardList
                                    size="0.8125rem"
                                    strokeWidth={2.25}
                                />
                            }
                            label={t("tracker.title")}
                            onClick={handleGoToTracker}
                        />
                    </nav>

                    {/* Right: Theme toggle + Language toggle */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>
                </div>
            </header>

            {/* ─────────────────────────────────────────
                MOBILE TOP BAR (visible only on mobile)
                Minimal - just logo, step indicator on form flow,
                and action controls on the right.
            ───────────────────────────────────────── */}
            <header
                className={cn(
                    "sticky top-0 z-40 md:hidden",
                    "flex flex-col",
                    "border-border/50 border-b bg-background/85 backdrop-blur-xl backdrop-saturate-150",
                )}
            >
                <OfflineBanner />
                <div className="flex h-13 w-full items-center justify-between px-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-emerald-600/30 shadow-sm">
                            <IconShieldCheck size="0.9rem" strokeWidth={2} />
                        </div>
                        <h1 className="font-semibold text-foreground text-sm tracking-tight">
                            {t("app.title")}
                        </h1>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5">
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>
                </div>

                {/* Mobile step indicator - form flow only */}
                <AnimatePresence initial={false}>
                    {isFormFlow && (
                        <motion.div
                            key="mobile-step"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                                duration: 0.22,
                                ease: [0.23, 1, 0.32, 1],
                            }}
                            className="overflow-hidden border-border/40 border-t"
                        >
                            <div className="flex items-center justify-center py-2.5">
                                <StepIndicator currentStep={currentStep} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Screen reader live region */}
            <div
                ref={liveRef}
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            />

            {/* ─────────────────────────────────────────
                MAIN CONTENT
                Extra bottom padding on mobile to clear the bottom tab bar.
            ───────────────────────────────────────── */}
            <main className="flex flex-1 flex-col">
                <div
                    className={cn(
                        "mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 sm:px-6 md:max-w-3xl md:py-8 lg:max-w-4xl",
                        "pb-28 md:pb-8", // reserve space for mobile bottom nav
                    )}
                >
                    {/* Desktop Step Indicator - heroic editorial placement above the form */}
                    {isFormFlow && (
                        <div className="mb-6 hidden items-center justify-center border-border/40 border-b pb-8 md:flex">
                            <StepIndicator currentStep={currentStep} />
                        </div>
                    )}
                    {children}
                </div>
            </main>

            {/* ─────────────────────────────────────────
                MOBILE BOTTOM TAB BAR (hidden on desktop)
                Floating pill above safe-area with two tabs.
            ───────────────────────────────────────── */}
            <MobileBottomNav
                isTrackerRoute={isTrackerRoute}
                onReport={handleGoToReport}
                onTracker={handleGoToTracker}
                reportLabel={t("nav.reportAnother")}
                trackerLabel={t("tracker.title")}
            />
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────────── */

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
            {/* Sliding active background - shared layoutId slides between pills */}
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

function MobileBottomNav({
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
                    activeId="mobile-tab-report"
                />
                <MobileTab
                    active={isTrackerRoute}
                    icon={
                        <IconClipboardList size="1.125rem" strokeWidth={2.25} />
                    }
                    label={trackerLabel}
                    onClick={onTracker}
                    activeId="mobile-tab-tracker"
                />
            </nav>
        </div>
    );
}

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
    activeId: string;
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
