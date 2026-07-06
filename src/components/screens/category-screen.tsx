"use client";

import { motion, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

// Animation variants for staggering children
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 400, damping: 30 },
    },
};

/**
 * Per-category color map for selected state backgrounds and icon containers.
 * Kept as a lookup to stay Tailwind-safe (no dynamic class construction).
 */
const COLOR_MAP: Record<
    string,
    { bg: string; text: string; border: string; iconBg: string }
> = {
    amber: {
        bg: "bg-amber-500/10",
        text: "text-amber-600",
        border: "border-amber-500/50",
        iconBg: "bg-amber-500",
    },
    sky: {
        bg: "bg-sky-500/10",
        text: "text-sky-600",
        border: "border-sky-500/50",
        iconBg: "bg-sky-500",
    },
    yellow: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-600",
        border: "border-yellow-500/50",
        iconBg: "bg-yellow-500",
    },
    lime: {
        bg: "bg-lime-500/10",
        text: "text-lime-600",
        border: "border-lime-500/50",
        iconBg: "bg-lime-500",
    },
    rose: {
        bg: "bg-rose-500/10",
        text: "text-rose-600",
        border: "border-rose-500/50",
        iconBg: "bg-rose-500",
    },
    violet: {
        bg: "bg-violet-500/10",
        text: "text-violet-600",
        border: "border-violet-500/50",
        iconBg: "bg-violet-500",
    },
};

export function CategoryScreen() {
    const { t } = useLanguage();
    const { categories, selectedCategory, selectCategory, goNext } =
        useCategories();

    return (
        <div className="flex flex-1 flex-col gap-6">
            <div>
                <h2 className="font-semibold text-xl tracking-tight">
                    {t("category.title")}
                </h2>
                <p className="mt-1 text-muted-foreground text-sm">
                    {t("category.subtitle")}
                </p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const Icon = cat.icon;
                    const colors = COLOR_MAP[cat.color];

                    return (
                        <motion.button
                            key={cat.id}
                            variants={itemVariants}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => selectCategory(cat.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-3 p-4",
                                "rounded-xl border transition-all duration-200",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                // Hover lift only for pointer devices (not touch)
                                "pointer-hover:hover:-translate-y-0.5 pointer-hover:hover:shadow-md",
                                isSelected
                                    ? [colors?.border, colors?.bg, colors?.text]
                                    : "border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-accent/5",
                            )}
                            aria-pressed={isSelected}
                            aria-label={t(cat.labelKey)}
                        >
                            <div
                                className={cn(
                                    "flex size-10 items-center justify-center rounded-lg transition-colors duration-200",
                                    isSelected
                                        ? [colors?.iconBg, "text-white"]
                                        : "bg-muted text-muted-foreground",
                                )}
                            >
                                <Icon size="1.25rem" strokeWidth={1.75} />
                            </div>
                            <span className="text-center font-medium text-sm leading-tight">
                                {t(cat.labelKey)}
                            </span>
                        </motion.button>
                    );
                })}
            </motion.div>

            <div className="mt-auto pt-4">
                <Button
                    onClick={goNext}
                    size="lg"
                    className="w-full text-base shadow-sm"
                    disabled={!selectedCategory}
                >
                    {t("nav.next")}
                </Button>
            </div>
        </div>
    );
}
