"use client";

import { useStepNavigation } from "@/hooks/step-context";
import { useLanguage } from "@/i18n";
import type { TranslationKeys } from "@/i18n/translations/en";

/**
 * Pill badge showing the category selected on Screen 1.
 * Rendered at the top of the Details screen header.
 */
export function SelectedCategoryBadge() {
    const { t } = useLanguage();
    const { draft } = useStepNavigation();

    if (!draft.category) return null;

    const labelKey = `category.${draft.category}` as TranslationKeys;

    return (
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 font-medium text-primary text-xs shadow-2xs">
            <span className="text-muted-foreground">
                {t("details.selectedCategory")}:
            </span>
            <span>{t(labelKey)}</span>
        </div>
    );
}
