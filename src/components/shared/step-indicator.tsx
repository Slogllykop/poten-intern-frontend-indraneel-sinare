"use client";

import { useLanguage } from "@/i18n";
import { FLOW_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Step } from "@/types";

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
    const currentIndex = FLOW_STEPS.indexOf(currentStep);

    if (currentIndex === -1) {
        return null;
    }

    return (
        <nav
            aria-label={t("a11y.stepProgress", {
                current: String(currentIndex + 1),
                total: String(FLOW_STEPS.length),
            })}
            className={cn("flex items-start justify-center", className)}
        >
            {FLOW_STEPS.map((stepKey, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;

                return (
                    <div key={stepKey} className="flex items-start">
                        {/* Dot and Label Column — isolated so label is centered mathematically under the dot */}
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="flex h-4 items-center justify-center">
                                <div
                                    aria-current={isActive ? "step" : undefined}
                                    className={cn(
                                        "size-2.5 rounded-full transition-all duration-300 md:size-3",
                                        isCompleted && "bg-primary",
                                        isActive &&
                                            "scale-125 bg-primary ring-4 ring-primary/20",
                                        !isCompleted &&
                                            !isActive &&
                                            "bg-border",
                                    )}
                                />
                            </div>
                            <span
                                className={cn(
                                    "text-xs transition-colors duration-300 md:text-sm",
                                    isActive
                                        ? "font-medium text-foreground"
                                        : "text-muted-foreground",
                                )}
                            >
                                {t(
                                    `step.${stepKey}` as Parameters<
                                        typeof t
                                    >[0],
                                )}
                            </span>
                        </div>

                        {/* Connector line (between steps) */}
                        {index < FLOW_STEPS.length - 1 && (
                            <div className="flex h-4 items-center px-2 md:px-3">
                                <div
                                    className={cn(
                                        "h-0.25 w-8 transition-colors duration-300 md:h-0.5 md:w-20",
                                        index < currentIndex
                                            ? "bg-primary"
                                            : "bg-border",
                                    )}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
