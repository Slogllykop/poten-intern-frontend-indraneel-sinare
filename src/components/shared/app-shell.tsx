"use client";

import {
    IconClipboardList,
    IconPlus,
    IconShieldCheck,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useStepNavigation } from "@/hooks/step-context";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./language-toggle";
import { OfflineBanner } from "./offline-banner";
import { StepIndicator } from "./step-indicator";

/**
 * Mobile-first app shell with sticky header and scrollable content.
 * Header: app logo/title + tracker toggle + language toggle.
 * Content: centered, max-width constrained, with safe-area padding.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage();
    const { currentStep, reset, goToStep } = useStepNavigation();
    const pathname = usePathname();
    const router = useRouter();

    const isTrackerRoute = pathname === "/issues" || currentStep === "tracker";

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
        // Delay announcement slightly so it fires after DOM settles
        const timer = setTimeout(() => {
            if (liveRef.current) {
                liveRef.current.textContent = stepLabel;
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [stepLabel]);

    const handleToggle = () => {
        if (isTrackerRoute) {
            reset();
            if (pathname === "/issues") {
                router.push("/");
            } else {
                goToStep("category");
            }
        } else {
            router.push("/issues");
        }
    };

    return (
        <div className="flex min-h-dvh flex-col bg-background">
            {/* Sticky header */}
            <header
                className={cn(
                    "sticky top-0 z-40",
                    "flex flex-col",
                    "border-border/60 border-b bg-background/80 backdrop-blur-md",
                )}
            >
                <OfflineBanner />
                <div className="flex w-full flex-col px-4 py-3 sm:px-6">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                                <IconShieldCheck
                                    size="1.125rem"
                                    strokeWidth={2}
                                />
                            </div>
                            <h1 className="font-semibold text-base text-foreground tracking-tight">
                                {t("app.title")}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant={isTrackerRoute ? "default" : "outline"}
                                size="sm"
                                onClick={handleToggle}
                                className="min-h-11 gap-1 rounded-lg px-2.5 font-medium text-xs shadow-none active:scale-95"
                            >
                                {isTrackerRoute ? (
                                    <>
                                        <IconPlus
                                            size="0.875rem"
                                            strokeWidth={2.25}
                                        />
                                        <span className="hidden sm:inline">
                                            {t("confirmation.reportAnother")}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <IconClipboardList
                                            size="0.875rem"
                                            strokeWidth={2.25}
                                        />
                                        <span>{t("tracker.title")}</span>
                                    </>
                                )}
                            </Button>
                            <LanguageToggle />
                        </div>
                    </div>
                    {!isTrackerRoute && (
                        <div className="mt-3 flex w-full justify-center">
                            <StepIndicator currentStep={currentStep} />
                        </div>
                    )}
                </div>
            </header>

            {/* Visually-hidden live region for screen reader step announcements */}
            <div
                ref={liveRef}
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            />

            {/* Scrollable content area */}
            <main className="flex flex-1 flex-col">
                <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 sm:px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
