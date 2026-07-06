import {
    IconBolt,
    IconDots,
    IconDroplet,
    IconRoad,
    IconShield,
    IconTrash,
} from "@tabler/icons-react";
import { useMemo } from "react";
import type { TranslationKeys } from "@/i18n/translations/en";
import type { CategoryId } from "@/types";
import { useStepNavigation } from "./step-context";

export interface Category {
    id: CategoryId;
    /** Translation key for the category label */
    labelKey: TranslationKeys;
    icon: React.ElementType;
    /** Tailwind color class for subtle per-category accent */
    color: string;
}

export const CATEGORIES: Category[] = [
    {
        id: "roads",
        labelKey: "category.roads",
        icon: IconRoad,
        color: "amber",
    },
    {
        id: "water",
        labelKey: "category.water",
        icon: IconDroplet,
        color: "sky",
    },
    {
        id: "electricity",
        labelKey: "category.electricity",
        icon: IconBolt,
        color: "yellow",
    },
    {
        id: "sanitation",
        labelKey: "category.sanitation",
        icon: IconTrash,
        color: "lime",
    },
    {
        id: "safety",
        labelKey: "category.safety",
        icon: IconShield,
        color: "rose",
    },
    {
        id: "other",
        labelKey: "category.other",
        icon: IconDots,
        color: "violet",
    },
];

/**
 * Provides static category data and connects to the StepContext
 * to read/write the selected category for the submission draft.
 */
export function useCategories() {
    const { draft, setCategory, goNext } = useStepNavigation();

    return useMemo(
        () => ({
            categories: CATEGORIES,
            selectedCategory: draft.category,
            selectCategory: setCategory,
            goNext,
        }),
        [draft.category, setCategory, goNext],
    );
}
