"use client";

import {
    IconCheck,
    IconCircleCheck,
    IconClipboardList,
    IconCopy,
    IconPlus,
} from "@tabler/icons-react";
import { motion, type Variants } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/hooks/use-categories";
import { useSubmission } from "@/hooks/use-submission";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Formats timestamps cleanly for bilingual support.
 * Avoids browser quirks where Intl.DateTimeFormat in hi-IN outputs English "pm" or abbreviated months.
 */
function formatSubmissionTimestamp(
    timestamp: number,
    locale: "en" | "hi",
): string {
    const d = new Date(timestamp);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = pad(d.getDate());
    const year = d.getFullYear();
    let hours = d.getHours();
    const mins = pad(d.getMinutes());
    const isPm = hours >= 12;
    hours = hours % 12 || 12;

    if (locale === "hi") {
        const hindiMonths = [
            "जनवरी",
            "फरवरी",
            "मार्च",
            "अप्रैल",
            "मई",
            "जून",
            "जुलाई",
            "अगस्त",
            "सितंबर",
            "अक्टूबर",
            "नवंबर",
            "दिसंबर",
        ];
        const month = hindiMonths[d.getMonth()];
        const amPm = isPm ? "दोपहर/शाम" : "सुबह";
        return `${day} ${month} ${year}, ${amPm} ${hours}:${mins} बजे`;
    }

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const month = monthNames[d.getMonth()];
    const amPm = isPm ? "pm" : "am";
    return `${day} ${month} ${year}, ${hours}:${mins} ${amPm}`;
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
                            "col-span-2 inline-flex w-fit items-center rounded-full px-2 py-0.5 font-medium text-[11px]",
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

            {/* Reset / Tracker action buttons */}
            <motion.div
                variants={itemVariants}
                className="mt-auto flex flex-col gap-2.5 pt-4 sm:flex-row"
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/issues")}
                    size="lg"
                    className="flex-1 touch-manipulation gap-2 text-sm shadow-sm"
                >
                    <IconClipboardList size="1.25rem" strokeWidth={2} />
                    {t("tracker.title")}
                </Button>
                <Button
                    type="button"
                    onClick={resetFlow}
                    size="lg"
                    className="flex-1 touch-manipulation gap-2 text-sm shadow-sm"
                >
                    <IconPlus size="1.25rem" strokeWidth={2} />
                    {t("confirmation.reportAnother")}
                </Button>
            </motion.div>
        </motion.div>
    );
}
