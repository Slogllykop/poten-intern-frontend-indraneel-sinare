import { useMemo } from "react";
import { CATEGORIES } from "@/lib/constants";
import { useStepNavigation } from "./step-context";

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
