"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useStepNavigation } from "@/hooks/step-context";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";
import { DesktopNavbar } from "./app-shell/desktop-navbar";
import { MobileBottomNav } from "./app-shell/mobile-bottom-nav";
import { MobileTopBar } from "./app-shell/mobile-top-bar";
import { StepIndicator } from "./step-indicator";

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
            {/* Desktop Navbar */}
            <DesktopNavbar
                isFormFlow={isFormFlow}
                isTrackerRoute={isTrackerRoute}
                currentStep={currentStep}
                onReport={handleGoToReport}
                onTracker={handleGoToTracker}
                reportLabel={t("nav.reportAnother")}
                trackerLabel={t("tracker.title")}
                appTitle={t("app.title")}
            />

            {/* Mobile Top Bar */}
            <MobileTopBar
                isFormFlow={isFormFlow}
                currentStep={currentStep}
                appTitle={t("app.title")}
            />

            {/* Screen reader live region */}
            <div
                ref={liveRef}
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            />

            {/* Main Content */}
            <main className="flex flex-1 flex-col">
                <div
                    className={cn(
                        "mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 sm:px-6 md:max-w-3xl md:py-8 lg:max-w-4xl",
                        "pb-28 md:pb-8", // reserve space for mobile bottom nav
                    )}
                >
                    {/* Desktop Step Indicator */}
                    {isFormFlow && (
                        <div className="mb-6 hidden items-center justify-center border-border/40 border-b pb-8 md:flex">
                            <StepIndicator currentStep={currentStep} />
                        </div>
                    )}
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Tab Bar */}
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
