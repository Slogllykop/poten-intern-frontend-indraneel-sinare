"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import type {
    CategoryId,
    Direction,
    Step,
    Submission,
    SubmissionDraft,
} from "@/types";

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
    /** Most recently completed submission for displaying on confirmation screen */
    lastSubmission: Submission | null;

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
    setLastSubmission: (submission: Submission | null) => void;
}

const StepContext = createContext<StepContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function StepProvider({ children }: { children: React.ReactNode }) {
    const [currentStep, setCurrentStep] = useState<Step>("category");
    const [direction, setDirection] = useState<Direction>("forward");
    const [draft, setDraft] = useState<SubmissionDraft>(INITIAL_DRAFT);
    const [lastSubmission, setLastSubmission] = useState<Submission | null>(
        null,
    );

    const stepIndex = STEPS.indexOf(currentStep);

    const goNext = useCallback(() => {
        const idx = STEPS.indexOf(currentStep);
        if (idx === -1 || idx >= STEPS.length - 1) return;
        setDirection("forward");
        setCurrentStep(STEPS[idx + 1]);
    }, [currentStep]);

    const goBack = useCallback(() => {
        if (currentStep === "tracker") {
            setDirection("backward");
            setCurrentStep("category");
            return;
        }
        const idx = STEPS.indexOf(currentStep);
        if (idx <= 0) return;
        setDirection("backward");
        setCurrentStep(STEPS[idx - 1]);
    }, [currentStep]);

    const goToStep = useCallback(
        (step: Step) => {
            if (step === currentStep) return;
            if (step === "tracker") {
                setDirection("forward");
                setCurrentStep("tracker");
                return;
            }
            const target = STEPS.indexOf(step);
            const current = STEPS.indexOf(currentStep);
            setDirection(target >= current ? "forward" : "backward");
            setCurrentStep(step);
        },
        [currentStep],
    );

    const reset = useCallback(() => {
        setDirection("forward");
        setCurrentStep("category");
        setDraft(INITIAL_DRAFT);
        setLastSubmission(null);
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
            lastSubmission,
            goNext,
            goBack,
            reset,
            goToStep,
            setCategory,
            setDescription,
            setPhoto,
            clearDraft,
            setLastSubmission,
        }),
        [
            currentStep,
            stepIndex,
            direction,
            draft,
            lastSubmission,
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
