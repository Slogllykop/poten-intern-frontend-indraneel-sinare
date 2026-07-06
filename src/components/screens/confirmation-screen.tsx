"use client";

import {
    IconCheck,
    IconCircleCheck,
    IconCopy,
    IconPlus,
} from "@tabler/icons-react";
import { motion, type Variants } from "motion/react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/hooks/use-categories";
import { useSubmission } from "@/hooks/use-submission";
import { useLanguage } from "@/i18n";

/**
 * Formats timestamps cleanly for bilingual support.
 * Avoids browser quirks where Intl.DateTimeFormat in hi-IN outputs English "pm" or abbreviated months.
 */
function formatSubmissionTimestamp(
    timestamp: number,
    locale: "en" | "hi",
): string {
    const date = new Date(timestamp);

    if (locale === "hi") {
        const monthsHi = [
            "जनवरी",
            "फ़रवरी",
            "मार्च",
            "अप्रैल",
            "मई",
            "जून",
            "जुलाई",
            "अगस्त",
            "सितंबर",
            "अक्तूबर",
            "नवंबर",
            "दिसंबर",
        ];
        const day = date.getDate();
        const month = monthsHi[date.getMonth()];
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const period = hours >= 12 ? "अपराह्न" : "पूर्वाह्न";
        hours = hours % 12 || 12;

        return `${day} ${month} ${year}, ${hours}:${minutes} ${period}`;
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
}

// Staggered container animation
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 400, damping: 30 },
    },
};

const iconVariants: Variants = {
    hidden: { scale: 0.5, opacity: 0 },
    show: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 350,
            damping: 20,
            delay: 0.1,
        },
    },
};

export function ConfirmationScreen() {
    const { t, locale } = useLanguage();
    const { lastSubmission, resetFlow } = useSubmission();
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        if (!lastSubmission?.referenceId) return;
        navigator.clipboard.writeText(lastSubmission.referenceId).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [lastSubmission?.referenceId]);

    if (!lastSubmission) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <p className="text-muted-foreground text-sm">
                    {t("tracker.empty")}
                </p>
                <Button
                    type="button"
                    onClick={resetFlow}
                    className="touch-manipulation"
                >
                    {t("confirmation.reportAnother")}
                </Button>
            </div>
        );
    }

    const categoryObj = CATEGORIES.find(
        (c) => c.id === lastSubmission.category,
    );
    const CategoryIcon = categoryObj?.icon;
    const formattedDate = formatSubmissionTimestamp(
        lastSubmission.createdAt,
        locale,
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-1 flex-col gap-6"
        >
            {/* Success Icon & Header */}
            <div className="flex flex-col items-center text-center">
                <motion.div
                    variants={iconVariants}
                    className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-400"
                >
                    <IconCircleCheck size="2.5rem" strokeWidth={1.75} />
                </motion.div>
                <motion.h2
                    variants={itemVariants}
                    className="mt-4 font-bold text-2xl tracking-tight"
                >
                    {t("confirmation.title")}
                </motion.h2>
                <motion.p
                    variants={itemVariants}
                    className="mt-1 text-muted-foreground text-sm"
                >
                    {t("confirmation.subtitle")}
                </motion.p>
            </div>

            {/* Reference ID Card */}
            <motion.div
                variants={itemVariants}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm"
            >
                <div>
                    <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                        {t("confirmation.referenceId")}
                    </span>
                    <p className="mt-0.5 font-mono font-semibold text-primary text-xl tracking-wide">
                        {lastSubmission.referenceId}
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="touch-manipulation gap-1.5"
                >
                    {copied ? (
                        <>
                            <IconCheck
                                size="1rem"
                                className="text-emerald-600"
                            />
                            <span className="font-medium text-emerald-600">
                                {t("confirmation.copied")}
                            </span>
                        </>
                    ) : (
                        <>
                            <IconCopy size="1rem" />
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
                    <span className="col-span-2 inline-flex w-fit items-center rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-[11px] text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        {t("confirmation.statusSubmitted")}
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

            {/* Reset / Report Another button */}
            <motion.div variants={itemVariants} className="mt-auto pt-4">
                <Button
                    type="button"
                    onClick={resetFlow}
                    size="lg"
                    className="w-full touch-manipulation gap-2 text-base shadow-sm"
                >
                    <IconPlus size="1.25rem" strokeWidth={2} />
                    {t("confirmation.reportAnother")}
                </Button>
            </motion.div>
        </motion.div>
    );
}
