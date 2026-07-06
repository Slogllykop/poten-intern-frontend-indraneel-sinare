"use client";

import {
    IconArrowRight,
    IconCheck,
    IconChevronDown,
    IconChevronUp,
    IconInbox,
    IconPlus,
    IconRefresh,
} from "@tabler/icons-react";
import { motion, type Variants } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useStepNavigation } from "@/hooks/step-context";
import { type TimelineStep, useTracker } from "@/hooks/use-tracker";
import { useLanguage } from "@/i18n";
import {
    CATEGORIES,
    COLOR_MAP,
    MONTH_NAMES_EN,
    MONTH_NAMES_HI,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatTimestamp(timestamp: number, locale: "en" | "hi"): string {
    const d = new Date(timestamp);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = d.getDate();
    const year = d.getFullYear();
    let hours = d.getHours();
    const mins = pad(d.getMinutes());
    const isPm = hours >= 12;
    hours = hours % 12 || 12;

    if (locale === "hi") {
        const month = MONTH_NAMES_HI[d.getMonth()];
        const amPm = isPm ? "दोपहर/शाम" : "सुबह";
        return `${day} ${month} ${year}, ${amPm} ${hours}:${mins} बजे`;
    }

    const month = MONTH_NAMES_EN[d.getMonth()];
    const amPm = isPm ? "pm" : "am";
    return `${getOrdinal(day)} ${month} ${year}, ${hours}:${mins} ${amPm}`;
}

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: [0.23, 1, 0.32, 1],
            staggerChildren: 0.08,
        },
    },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function TimelineView({ steps }: { steps: TimelineStep[] }) {
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
                            {/* Left column: Icon container + vertical connector - slightly smaller */}
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

                            {/* Right column: Screenshot style - smaller font sizes */}
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

export function TrackerScreen() {
    const { t, locale } = useLanguage();
    const { goToStep, reset } = useStepNavigation();
    const router = useRouter();
    const {
        submissions,
        isLoading,
        refresh,
        getTimelineForSubmission,
        advanceStatus,
    } = useTracker();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleNewReport = () => {
        reset();
        if (
            typeof window !== "undefined" &&
            window.location.pathname === "/issues"
        ) {
            router.push("/");
        } else {
            goToStep("category");
        }
    };

    return (
        <motion.div
            key="tracker-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-1 flex-col"
        >
            {/* Screen Header with explicit spacing below track and manage text */}
            <motion.div
                variants={itemVariants}
                className="mb-6! flex items-center justify-between sm:mb-6!"
            >
                <div>
                    <h2 className="font-bold text-2xl text-foreground tracking-tight">
                        {t("tracker.title")}
                    </h2>
                    <p className="text-muted-foreground text-xs">
                        {t("tracker.subtitle")}
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => refresh()}
                    aria-label="Refresh"
                    className="size-9 rounded-xl active:scale-95"
                >
                    <IconRefresh size="1.125rem" strokeWidth={2} />
                </Button>
            </motion.div>

            {/* List or Empty State */}
            {isLoading && submissions.length === 0 ? (
                <div className="mt-6 flex flex-1 items-center justify-center py-12 text-muted-foreground text-sm">
                    {t("tracker.loading")}
                </div>
            ) : submissions.length === 0 ? (
                <motion.div
                    variants={itemVariants}
                    className="mt-2 flex flex-1 flex-col items-center justify-center rounded-2xl border border-border/80 border-dashed bg-card/50 p-8 text-center"
                >
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <IconInbox size="2rem" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-semibold text-base text-foreground">
                        {t("tracker.empty")}
                    </h3>
                    <p className="mt-1 max-w-xs text-muted-foreground text-xs">
                        {t("tracker.emptySubtitle")}
                    </p>
                    <Button
                        type="button"
                        onClick={handleNewReport}
                        size="sm"
                        className="mt-5 gap-1.5 rounded-xl font-medium text-xs"
                    >
                        <IconPlus size="1rem" strokeWidth={2} />
                        {t("confirmation.reportAnother")}
                    </Button>
                </motion.div>
            ) : (
                <Accordion
                    multiple={false}
                    value={expandedId ? [expandedId.toString()] : []}
                    onValueChange={(val: string | string[] | null) => {
                        const item = Array.isArray(val) ? val[0] : val;
                        setExpandedId(item ? Number(item) : null);
                    }}
                    className="space-y-4 overflow-visible rounded-none border-none bg-transparent sm:space-y-5"
                >
                    {submissions.map((sub) => {
                        const isExpanded = expandedId === sub.id;
                        const catObj = CATEGORIES.find(
                            (c) => c.id === sub.category,
                        );
                        const CatIcon = catObj?.icon;
                        const catColors = catObj
                            ? COLOR_MAP[catObj.color]
                            : null;
                        const timelineSteps = getTimelineForSubmission(sub);
                        const currentStepObj =
                            timelineSteps.find(
                                (s) => s.statusState === "current",
                            ) || timelineSteps[0];

                        return (
                            <AccordionItem
                                key={sub.id}
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
                                    {/* Top Row: Left-Aligned Ref ID + Color-Coded Category Pill, Chevron on Right */}
                                    <div className="flex w-full items-start justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                                            {/* Reference ID - Left Aligned */}
                                            <span className="rounded-lg border border-border/60 bg-secondary px-2.5 py-1 font-bold font-mono text-foreground text-xs tracking-wider shadow-2xs">
                                                {sub.referenceId}
                                            </span>

                                            {/* Category Pill - Left Aligned & Color Coded */}
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
                                                    <CatIcon
                                                        size="0.875rem"
                                                        strokeWidth={2.25}
                                                    />
                                                    <span>
                                                        {catObj
                                                            ? t(catObj.labelKey)
                                                            : sub.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Chevron button on far right */}
                                        <div className="ml-2 flex size-7 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground transition-colors group-hover:bg-muted">
                                            {isExpanded ? (
                                                <IconChevronUp
                                                    size="1.125rem"
                                                    strokeWidth={2}
                                                />
                                            ) : (
                                                <IconChevronDown
                                                    size="1.125rem"
                                                    strokeWidth={2}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Middle Row: Description - Strictly Left Aligned with spacing before divider */}
                                    <div className="mt-3.5 mb-2 flex w-full justify-start text-left">
                                        <p className="line-clamp-2 w-full text-left font-normal text-foreground/90 text-xs leading-relaxed sm:text-sm">
                                            {sub.description ||
                                                t("tracker.noDescription")}
                                        </p>
                                    </div>

                                    {/* Bottom Row: Quick Status Preview when collapsed with generous spacing around divider line */}
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
                                                {formatTimestamp(
                                                    sub.createdAt,
                                                    locale,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </AccordionTrigger>

                                {/* Expanded Timeline View */}
                                <AccordionContent className="border-border/60 border-t bg-muted/15 px-3 pt-3 pb-2 sm:px-5 sm:pt-4">
                                    <TimelineView steps={timelineSteps} />

                                    {/* Simulate Progress action footer - only keep Advance button right-aligned */}
                                    <div className="mt-1 flex items-center justify-end border-border/40 border-t px-1 py-2.5">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                advanceStatus(sub.id);
                                            }}
                                            className="h-7 touch-manipulation gap-1.5 rounded-xl px-3 font-semibold text-[0.6875rem] shadow-none transition-all hover:bg-secondary/80 active:scale-95"
                                        >
                                            <span>
                                                {t("tracker.advanceStage")}
                                            </span>
                                            <IconArrowRight
                                                size="0.875rem"
                                                strokeWidth={2}
                                            />
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}

            {/* Bottom New Report Action */}
            {submissions.length > 0 && (
                <motion.div variants={itemVariants} className="pt-4">
                    <Button
                        type="button"
                        onClick={handleNewReport}
                        size="lg"
                        className="w-full touch-manipulation gap-2 text-sm shadow-sm"
                    >
                        <IconPlus size="1.125rem" strokeWidth={2} />
                        {t("confirmation.reportAnother")}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}
