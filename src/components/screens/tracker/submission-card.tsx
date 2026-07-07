"use client";

import {
    IconArrowRight,
    IconChevronDown,
    IconChevronUp,
} from "@tabler/icons-react";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { TimelineStep } from "@/hooks/use-tracker";
import { useLanguage } from "@/i18n";
import { CATEGORIES, COLOR_MAP } from "@/lib/constants";
import { formatTimestamp } from "@/lib/format-timestamp";
import { cn } from "@/lib/utils";
import type { Submission } from "@/types";
import { TimelineView } from "./timeline-view";

/**
 * Single submission accordion card for the tracker screen.
 * Shows a collapsed summary and expands to reveal the full timeline.
 */
export function SubmissionCard({
    sub,
    isExpanded,
    timelineSteps,
    onAdvance,
}: {
    sub: Submission;
    isExpanded: boolean;
    timelineSteps: TimelineStep[];
    onAdvance: () => void;
}) {
    const { t, locale } = useLanguage();

    const catObj = CATEGORIES.find((c) => c.id === sub.category);
    const CatIcon = catObj?.icon;
    const catColors = catObj ? COLOR_MAP[catObj.color] : null;
    const currentStepObj =
        timelineSteps.find((s) => s.statusState === "current") ||
        timelineSteps[0];

    return (
        <AccordionItem
            value={sub.id.toString()}
            className={cn(
                "overflow-hidden rounded-2xl border bg-card transition-all duration-200",
                isExpanded
                    ? "border-primary/40 shadow-md ring-1 ring-primary/10"
                    : "border-border/80 shadow-sm hover:border-border hover:shadow",
            )}
        >
            {/* Card Header / Toggle */}
            <AccordionTrigger
                showChevron={false}
                className="flex w-full cursor-pointer touch-manipulation select-none flex-col p-5 text-left transition-colors hover:no-underline sm:p-6"
            >
                {/* Top Row: Ref ID + Category Pill + Chevron */}
                <div className="flex w-full items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                        {/* Reference ID */}
                        <span className="rounded-lg border border-border/60 bg-secondary px-2.5 py-1 font-bold font-mono text-foreground text-xs tracking-wider shadow-2xs">
                            {sub.referenceId}
                        </span>

                        {/* Category Pill */}
                        {CatIcon && (
                            <div
                                className={cn(
                                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-semibold text-xs shadow-2xs",
                                    catColors
                                        ? [
                                              catColors.bg,
                                              catColors.text,
                                              catColors.border,
                                          ]
                                        : "border-border/50 bg-muted text-muted-foreground",
                                )}
                            >
                                <CatIcon size="0.875rem" strokeWidth={2.25} />
                                <span>
                                    {catObj ? t(catObj.labelKey) : sub.category}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Chevron */}
                    <div className="ml-2 flex size-7 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground transition-colors group-hover:bg-muted">
                        {isExpanded ? (
                            <IconChevronUp size="1.125rem" strokeWidth={2} />
                        ) : (
                            <IconChevronDown size="1.125rem" strokeWidth={2} />
                        )}
                    </div>
                </div>

                {/* Middle Row: Description */}
                <div className="mt-3.5 mb-2 flex w-full justify-start text-left">
                    <p className="line-clamp-2 w-full text-left font-normal text-foreground/90 text-xs leading-relaxed sm:text-sm">
                        {sub.description || t("tracker.noDescription")}
                    </p>
                </div>

                {/* Bottom Row: Quick Status Preview when collapsed */}
                {!isExpanded && (
                    <div className="flex w-full items-center justify-between border-border/60 border-t pt-4 text-muted-foreground text-xs">
                        <div className="flex items-center gap-2">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                            </span>
                            <span className="font-semibold text-foreground/90">
                                {t("tracker.statusLabel")}{" "}
                                {t(currentStepObj.labelKey)}
                            </span>
                        </div>
                        <span className="font-mono text-[0.6875rem]">
                            {formatTimestamp(sub.createdAt, locale)}
                        </span>
                    </div>
                )}
            </AccordionTrigger>

            {/* Expanded Timeline View */}
            <AccordionContent className="border-border/60 border-t bg-muted/15 px-3 pt-3 pb-2 sm:px-5 sm:pt-4">
                <TimelineView steps={timelineSteps} />

                {/* Simulate Progress action footer */}
                <div className="mt-1 flex items-center justify-end border-border/40 border-t px-1 py-2.5">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdvance();
                        }}
                        className="h-7 touch-manipulation gap-1.5 rounded-xl px-3 font-semibold text-[0.6875rem] shadow-none transition-all hover:bg-secondary/80 active:scale-95"
                    >
                        <span>{t("tracker.advanceStage")}</span>
                        <IconArrowRight size="0.875rem" strokeWidth={2} />
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
