"use client";

import { IconInbox, IconPlus, IconRefresh } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useStepNavigation } from "@/hooks/step-context";
import { useTracker } from "@/hooks/use-tracker";
import { useLanguage } from "@/i18n";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { SubmissionCard } from "./tracker/submission-card";

export function TrackerScreen() {
    const { t } = useLanguage();
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
            {/* Screen Header */}
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
                    {submissions.map((sub) => (
                        <SubmissionCard
                            key={sub.id}
                            sub={sub}
                            isExpanded={expandedId === sub.id}
                            timelineSteps={getTimelineForSubmission(sub)}
                            onAdvance={() => advanceStatus(sub.id)}
                        />
                    ))}
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
