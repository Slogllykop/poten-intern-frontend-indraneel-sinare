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
        <div className="flex flex-1 flex-col gap-6 md:gap-8">
            <div className="md:mb-2 md:text-center">
                <h2 className="font-semibold text-xl tracking-tight md:text-3xl">
                    {t("category.title")}
                </h2>
                <p className="mt-1 text-muted-foreground text-sm md:text-base">
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
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5"
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
                                "flex touch-manipulation flex-col items-center justify-center gap-3 p-4 md:min-h-[150px] md:gap-4 md:p-7",
                                "rounded-xl border transition-all duration-200 md:rounded-2xl",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                // Hover lift only for pointer devices (not touch)
                                "pointer-hover:hover:-translate-y-1 pointer-hover:hover:shadow-lg",
                                isSelected
                                    ? [
                                          colors?.border,
                                          colors?.bg,
                                          colors?.text,
                                          "shadow-md",
                                      ]
                                    : "border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-accent/5",
                            )}
                            aria-pressed={isSelected}
                            aria-label={t(cat.labelKey)}
                        >
                            <div
                                className={cn(
                                    "flex size-10 items-center justify-center rounded-lg transition-colors duration-200 md:size-14 md:rounded-2xl",
                                    isSelected
                                        ? [
                                              colors?.iconBg,
                                              "text-white shadow-sm",
                                          ]
                                        : "bg-muted text-muted-foreground",
                                )}
                            >
                                <Icon
                                    size="1.25rem"
                                    strokeWidth={1.75}
                                    className="md:size-7"
                                />
                            </div>
                            <span className="text-center font-medium text-sm leading-tight md:text-base">
                                {t(cat.labelKey)}
                            </span>
                        </motion.button>
                    );
                })}
            </motion.div>

            <div className="mt-auto pt-4 md:flex md:justify-center md:pt-8">
                <Button
                    type="button"
                    onClick={goNext}
                    size="lg"
                    className="pointer-hover:hover:-translate-y-0.5 w-full touch-manipulation text-base shadow-sm transition-all duration-200 pointer-hover:hover:shadow-lg md:h-12 md:w-72 md:rounded-xl md:font-semibold md:shadow-md"
                    disabled={!selectedCategory}
                >
                    {t("nav.next")}
                </Button>
            </div>
        </div>
    );
}
