"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { FLOW_STEPS, INITIAL_DRAFT } from "@/lib/constants";
import type {
    CategoryId,
    Direction,
    Step,
    Submission,
    SubmissionDraft,
} from "@/types";

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

    const stepIndex = FLOW_STEPS.indexOf(currentStep);

    const goNext = useCallback(() => {
        const idx = FLOW_STEPS.indexOf(currentStep);
        // Guard: Prevent navigation beyond the predefined step sequence
        if (idx === -1 || idx >= FLOW_STEPS.length - 1) return;
        setDirection("forward");
        setCurrentStep(FLOW_STEPS[idx + 1]);
    }, [currentStep]);

    const goBack = useCallback(() => {
        // Guard: If currently on the tracker, navigating back returns strictly to the category step
        if (currentStep === "tracker") {
            setDirection("backward");
            setCurrentStep("category");
            return;
        }
        const idx = FLOW_STEPS.indexOf(currentStep);
        // Guard: Prevent backwards navigation if already on the first step
        if (idx <= 0) return;
        setDirection("backward");
        setCurrentStep(FLOW_STEPS[idx - 1]);
    }, [currentStep]);

    const goToStep = useCallback(
        (step: Step) => {
            // Guard: Ignore redundant navigation
            if (step === currentStep) return;
            // The tracker is not in the linear FLOW_STEPS array, so it is always considered a 'forward' transition
            if (step === "tracker") {
                setDirection("forward");
                setCurrentStep("tracker");
                return;
            }
            // Determine transition direction dynamically based on the target index relative to the current index
            const target = FLOW_STEPS.indexOf(step);
            const current = FLOW_STEPS.indexOf(currentStep);
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
