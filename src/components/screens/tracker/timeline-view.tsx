"use client";

import { IconCheck } from "@tabler/icons-react";
import type { TimelineStep } from "@/hooks/use-tracker";
import { useLanguage } from "@/i18n";
import { formatTimestamp } from "@/lib/format-timestamp";
import { cn } from "@/lib/utils";

/**
 * Vertical timeline view showing the 4 status stages for a submission.
 * Each step has a left icon column with connecting lines
 * and a right content column with timestamp, label, and current-stage indicator.
 */
export function TimelineView({ steps }: { steps: TimelineStep[] }) {
    const { t, locale } = useLanguage();

    return (
        <div className="py-3 pl-2 sm:px-4">
            <div className="flex flex-col">
                {steps.map((step, idx) => {
                    const isCompleted = step.statusState === "completed";
                    const isCurrent = step.statusState === "current";
                    const isUpcoming = step.statusState === "upcoming";
                    const Icon = isCompleted ? IconCheck : step.icon;

                    return (
                        <div key={step.id} className="relative flex gap-3.5">
                            {/* Left column: Icon container + vertical connector */}
                            <div className="flex w-7 shrink-0 flex-col items-center">
                                <div
                                    className={cn(
                                        "z-10 flex size-7 shrink-0 items-center justify-center transition-all duration-300",
                                        isCompleted &&
                                            "rounded-full bg-emerald-600 text-white shadow-sm dark:bg-emerald-500",
                                        isCurrent &&
                                            "rounded-full bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/20",
                                        isUpcoming &&
                                            "rounded-xl bg-muted text-muted-foreground/60",
                                    )}
                                >
                                    <Icon
                                        size="1rem"
                                        strokeWidth={isCompleted ? 3 : 2}
                                    />
                                </div>
                                {/* Connecting line to next step */}
                                {idx < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            "my-1.5 h-9 w-0.5 flex-1 transition-colors duration-300",
                                            isCompleted
                                                ? "bg-emerald-600/60 dark:bg-emerald-500/60"
                                                : "bg-border/60",
                                        )}
                                    />
                                )}
                            </div>

                            {/* Right column: timestamp, label, current badge */}
                            <div className="flex flex-1 flex-col pt-0.5 pb-7 text-left">
                                {step.timestamp ? (
                                    <span className="mb-0.5 block font-normal text-[0.6875rem] text-muted-foreground">
                                        {formatTimestamp(
                                            step.timestamp,
                                            locale,
                                        )}
                                    </span>
                                ) : (
                                    <span className="mb-0.5 block font-normal text-[0.6875rem] text-muted-foreground/50">
                                        {t("tracker.pending")}
                                    </span>
                                )}

                                <h4
                                    className={cn(
                                        "font-bold text-xs leading-snug tracking-tight sm:text-sm",
                                        isCompleted && "text-foreground",
                                        isCurrent &&
                                            "font-extrabold text-foreground",
                                        isUpcoming &&
                                            "font-semibold text-muted-foreground/80",
                                    )}
                                >
                                    {t(step.labelKey)}
                                </h4>

                                {isCurrent && (
                                    <div className="mt-1 flex items-center gap-1.5">
                                        <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                                        <span className="font-medium text-[0.6875rem] text-primary sm:text-xs">
                                            {t("tracker.currentStage")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
