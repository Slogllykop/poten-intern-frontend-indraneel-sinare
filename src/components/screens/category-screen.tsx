"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useLanguage } from "@/i18n";
import { COLOR_MAP } from "@/lib/constants";
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

export function CategoryScreen() {
    const { t } = useLanguage();
    const { categories, selectedCategory, selectCategory, goNext } =
        useCategories();
    const prefersReducedMotion = useReducedMotion();

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
                transition={
                    prefersReducedMotion ? { staggerChildren: 0 } : undefined
                }
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const Icon = cat.icon;
                    const colors = COLOR_MAP[cat.color];

                    return (
                        <motion.button
                            key={cat.id}
                            type="button"
                            variants={itemVariants}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => selectCategory(cat.id)}
                            className={cn(
                                "flex touch-manipulation flex-col items-center justify-center gap-3 p-4",
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
                    type="button"
                    onClick={goNext}
                    size="lg"
                    className="w-full touch-manipulation text-base shadow-sm"
                    disabled={!selectedCategory}
                >
                    {t("nav.next")}
                </Button>
            </div>
        </div>
    );
}
