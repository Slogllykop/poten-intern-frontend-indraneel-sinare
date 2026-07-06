"use client";

import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";
import type { Step } from "@/types";

const STEPS: { key: Step; labelKey: string }[] = [
    { key: "category", labelKey: "step.category" },
    { key: "details", labelKey: "step.details" },
    { key: "confirmation", labelKey: "step.confirmation" },
];

interface StepIndicatorProps {
    currentStep: Step;
    className?: string;
}

/**
 * 3-dot step indicator with labels.
 * Active dot uses the accent color with a subtle ring.
 * Completed dots are filled, upcoming are outlined.
 */
export function StepIndicator({ currentStep, className }: StepIndicatorProps) {
    const { t } = useLanguage();
    const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

    if (currentIndex === -1) {
        return null;
    }

    return (
        <nav
            aria-label={t("a11y.stepProgress", {
                current: String(currentIndex + 1),
                total: String(STEPS.length),
            })}
            className={cn("flex items-center justify-center gap-3", className)}
        >
            {STEPS.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;

                return (
                    <div
                        key={step.key}
                        className="flex flex-col items-center gap-1.5"
                    >
                        {/* Dot */}
                        <div className="flex items-center gap-2">
                            <div
                                aria-current={isActive ? "step" : undefined}
                                className={cn(
                                    "size-2.5 rounded-full transition-all duration-300",
                                    isCompleted && "bg-primary",
                                    isActive &&
                                        "scale-125 bg-primary ring-4 ring-primary/20",
                                    !isCompleted && !isActive && "bg-border",
                                )}
                            />
                            {/* Connector line (not after the last dot) */}
                            {index < STEPS.length - 1 && (
                                <div
                                    className={cn(
                                        "h-0.25 w-8 transition-colors duration-300",
                                        index < currentIndex
                                            ? "bg-primary"
                                            : "bg-border",
                                    )}
                                />
                            )}
                        </div>
                        {/* Label */}
                        <span
                            className={cn(
                                "text-xs transition-colors duration-300",
                                isActive
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground",
                            )}
                        >
                            {t(step.labelKey as Parameters<typeof t>[0])}
                        </span>
                    </div>
                );
            })}
        </nav>
    );
}
