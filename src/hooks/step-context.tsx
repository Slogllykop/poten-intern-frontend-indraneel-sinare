"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import type { CategoryId, Direction, Step, SubmissionDraft } from "@/types";

// ---------------------------------------------------------------------------
// Step flow constants
// ---------------------------------------------------------------------------

const STEPS: Step[] = ["category", "details", "confirmation"];

const INITIAL_DRAFT: SubmissionDraft = {
    category: null,
    description: "",
    photo: null,
};

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

export interface StepContextValue {
    /** Current active step */
    currentStep: Step;
    /** Index of the current step (0-2) */
    stepIndex: number;
    /** Direction of the last navigation for transition animation */
    direction: Direction;
    /** The in-progress submission data */
    draft: SubmissionDraft;

    // Navigation
    goNext: () => void;
    goBack: () => void;
    reset: () => void;
    goToStep: (step: Step) => void;

    // Draft mutations
    setCategory: (category: CategoryId) => void;
    setDescription: (description: string) => void;
    setPhoto: (photo: string | null) => void;
    clearDraft: () => void;
}

const StepContext = createContext<StepContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function StepProvider({ children }: { children: React.ReactNode }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [direction, setDirection] = useState<Direction>("forward");
    const [draft, setDraft] = useState<SubmissionDraft>(INITIAL_DRAFT);

    const currentStep = STEPS[stepIndex];

    const goNext = useCallback(() => {
        setStepIndex((prev) => {
            if (prev >= STEPS.length - 1) return prev;
            setDirection("forward");
            return prev + 1;
        });
    }, []);

    const goBack = useCallback(() => {
        setStepIndex((prev) => {
            if (prev <= 0) return prev;
            setDirection("backward");
            return prev - 1;
        });
    }, []);

    const goToStep = useCallback((step: Step) => {
        const target = STEPS.indexOf(step);
        if (target === -1) return;
        setStepIndex((prev) => {
            setDirection(target > prev ? "forward" : "backward");
            return target;
        });
    }, []);

    const reset = useCallback(() => {
        setDirection("forward");
        setStepIndex(0);
        setDraft(INITIAL_DRAFT);
    }, []);

    const setCategory = useCallback((category: CategoryId) => {
        setDraft((prev) => ({ ...prev, category }));
    }, []);

    const setDescription = useCallback((description: string) => {
        setDraft((prev) => ({ ...prev, description }));
    }, []);

    const setPhoto = useCallback((photo: string | null) => {
        setDraft((prev) => ({ ...prev, photo }));
    }, []);

    const clearDraft = useCallback(() => {
        setDraft(INITIAL_DRAFT);
    }, []);

    const value = useMemo<StepContextValue>(
        () => ({
            currentStep,
            stepIndex,
            direction,
            draft,
            goNext,
            goBack,
            reset,
            goToStep,
            setCategory,
            setDescription,
            setPhoto,
            clearDraft,
        }),
        [
            currentStep,
            stepIndex,
            direction,
            draft,
            goNext,
            goBack,
            reset,
            goToStep,
            setCategory,
            setDescription,
            setPhoto,
            clearDraft,
        ],
    );

    return (
        <StepContext.Provider value={value}>{children}</StepContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/** Access step navigation and draft state. Must be used within StepProvider. */
export function useStepNavigation() {
    const ctx = useContext(StepContext);
    if (!ctx) {
        throw new Error("useStepNavigation must be used within a StepProvider");
    }
    return ctx;
}
