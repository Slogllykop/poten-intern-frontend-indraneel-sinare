"use client";

import { IconLanguage } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Language toggle button switching between English and Hindi.
 * Shows the target locale label (what it will switch TO).
 * Uses a crossfade on the label for polish.
 */
export function LanguageToggle({ className }: { className?: string }) {
    const { locale, toggleLocale, t } = useLanguage();

    return (
        <button
            type="button"
            onClick={toggleLocale}
            aria-label={t("a11y.languageToggle")}
            className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5",
                "font-medium text-foreground text-sm transition-colors duration-200",
                "hover:bg-secondary active:scale-[0.97]",
                "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                className,
            )}
        >
            <IconLanguage size="1.125rem" strokeWidth={1.75} aria-hidden />
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={locale}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                    className="min-w-7 text-center"
                >
                    {locale === "en" ? "HI" : "EN"}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
