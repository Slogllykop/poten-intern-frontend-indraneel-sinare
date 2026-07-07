"use client";

import {
    IconCheck,
    IconCircleCheck,
    IconClipboardList,
    IconCopy,
    IconPlus,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSubmission } from "@/hooks/use-submission";
import { useLanguage } from "@/i18n";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { CATEGORIES } from "@/lib/constants";
import { formatSubmissionTimestamp } from "@/lib/format-timestamp";
import { cn } from "@/lib/utils";

/**
 * Screen 3: Confirmation
 * Displays reference ID with copy button, summary card, and options to view tracker or report another.
 */
export function ConfirmationScreen() {
    const { t } = useLanguage();
    const { lastSubmission, resetFlow } = useSubmission();
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (!lastSubmission) return;
        try {
            await navigator.clipboard.writeText(lastSubmission.referenceId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback if clipboard API not permitted
        }
    }, [lastSubmission]);

    if (!lastSubmission) {
        return null;
    }

    const categoryObj = CATEGORIES.find(
        (c) => c.id === lastSubmission.category,
    );
    const CategoryIcon = categoryObj?.icon;
    const formattedDate = formatSubmissionTimestamp(
        lastSubmission.createdAt,
        lastSubmission.locale,
    );

    return (
        <motion.div
            key="step-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-1 flex-col space-y-6"
        >
            {/* Header / Success Banner */}
            <motion.div variants={itemVariants} className="text-center">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <IconCircleCheck size="2rem" strokeWidth={2} />
                </div>
                <h2 className="font-bold text-2xl text-foreground tracking-tight">
                    {t("confirmation.title")}
                </h2>
                <p className="mt-1 text-muted-foreground text-sm">
                    {t("confirmation.subtitle")}
                </p>
            </motion.div>

            {/* Reference ID Card */}
            <motion.div
                variants={itemVariants}
                className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-4 shadow-sm"
            >
                <div className="space-y-0.5">
                    <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                        {t("confirmation.referenceId")}
                    </span>
                    <div className="font-bold font-mono text-foreground text-lg tracking-wide">
                        {lastSubmission.referenceId}
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="touch-manipulation gap-1.5 font-medium text-xs shadow-none active:scale-95"
                >
                    {copied ? (
                        <>
                            <IconCheck
                                size="1rem"
                                className="text-emerald-600 dark:text-emerald-400"
                                strokeWidth={2.5}
                            />
                            <span className="text-emerald-600 dark:text-emerald-400">
                                {t("confirmation.copied")}
                            </span>
                        </>
                    ) : (
                        <>
                            <IconCopy size="1rem" strokeWidth={2} />
                            <span>{t("confirmation.copy")}</span>
                        </>
                    )}
                </Button>
            </motion.div>

            {/* Summary Section */}
            <motion.div
                variants={itemVariants}
                className="space-y-3 rounded-xl border border-border/80 bg-muted/30 p-4 text-sm"
            >
                <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                    {t("confirmation.summary")}
                </h3>

                <div className="grid grid-cols-3 gap-2 py-1 text-xs">
                    <span className="text-muted-foreground">
                        {t("confirmation.category")}
                    </span>
                    <div className="col-span-2 flex items-center gap-1.5 font-medium text-foreground">
                        {CategoryIcon && (
                            <CategoryIcon size="1rem" strokeWidth={1.75} />
                        )}
                        <span>
                            {categoryObj
                                ? t(categoryObj.labelKey)
                                : lastSubmission.category}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-border/40 border-t py-2 text-xs">
                    <span className="text-muted-foreground">
                        {t("confirmation.description")}
                    </span>
                    <p className="col-span-2 line-clamp-3 font-medium text-foreground">
                        {lastSubmission.description}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-border/40 border-t py-2 text-xs">
                    <span className="text-muted-foreground">
                        {t("confirmation.submittedAt")}
                    </span>
                    <span className="col-span-2 font-medium text-foreground">
                        {formattedDate}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-border/40 border-t py-2 text-xs">
                    <span className="text-muted-foreground">
                        {t("confirmation.status")}
                    </span>
                    <span
                        className={cn(
                            "col-span-2 inline-flex w-fit items-center rounded-full px-2 py-0.5 font-medium text-[0.6875rem]",
                            lastSubmission.status === "pending"
                                ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                                : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
                        )}
                    >
                        {lastSubmission.status === "pending"
                            ? t("confirmation.statusOffline")
                            : t("confirmation.statusSubmitted")}
                    </span>
                </div>

                {lastSubmission.photo && (
                    <div className="border-border/40 border-t pt-2">
                        <span className="mb-1.5 block text-muted-foreground text-xs">
                            {t("confirmation.photo")}
                        </span>
                        {/* biome-ignore lint/performance/noImgElement: base64 data URL preview */}
                        <img
                            src={lastSubmission.photo}
                            alt={t("a11y.photoPreview")}
                            className="h-24 w-auto rounded-lg border border-border object-cover"
                        />
                    </div>
                )}
            </motion.div>

            {/* Reset / Tracker action buttons - hidden on mobile since mobile bottom nav handles this */}
            <motion.div
                variants={itemVariants}
                className="mt-auto hidden md:flex md:justify-center md:gap-4 md:pt-8"
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/issues")}
                    size="lg"
                    className="pointer-hover:hover:-translate-y-0.5 flex-1 touch-manipulation gap-2 text-sm shadow-sm transition-all duration-200 md:h-12 md:w-56 md:flex-none md:rounded-xl md:text-base"
                >
                    <IconClipboardList size="1.25rem" strokeWidth={2} />
                    {t("tracker.title")}
                </Button>
                <Button
                    type="button"
                    onClick={resetFlow}
                    size="lg"
                    className="pointer-hover:hover:-translate-y-0.5 flex-1 touch-manipulation gap-2 text-sm shadow-sm transition-all duration-200 pointer-hover:hover:shadow-lg md:h-12 md:w-64 md:flex-none md:rounded-xl md:font-semibold md:text-base md:shadow-md"
                >
                    <IconPlus size="1.25rem" strokeWidth={2} />
                    {t("confirmation.reportAnother")}
                </Button>
            </motion.div>
        </motion.div>
    );
}
