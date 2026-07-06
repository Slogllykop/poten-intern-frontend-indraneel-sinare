"use client";

import { useCallback, useState } from "react";
import { useLanguage } from "@/i18n";
import { saveSubmission } from "@/layers/storage";
import type { Submission } from "@/types";
import { useStepNavigation } from "./step-context";

/**
 * Generates a unique 6-character alphanumeric reference ID prefixed with CIV-.
 * Example: CIV-A3K9X2
 */
function generateReferenceId(): string {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const array = new Uint8Array(6);

    if (
        typeof window !== "undefined" &&
        window.crypto &&
        window.crypto.getRandomValues
    ) {
        window.crypto.getRandomValues(array);
    } else {
        for (let i = 0; i < 6; i++) {
            array[i] = Math.floor(Math.random() * chars.length);
        }
    }

    let id = "CIV-";
    for (let i = 0; i < 6; i++) {
        id += chars[array[i] % chars.length];
    }
    return id;
}

/**
 * Hook to manage civic issue submission and persistence.
 * Consumes storage layer and step navigation context.
 */
export function useSubmission() {
    const { locale, t } = useLanguage();
    const {
        draft,
        goNext,
        clearDraft,
        reset: resetStepContext,
        lastSubmission,
        setLastSubmission,
    } = useStepNavigation();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(async () => {
        if (!draft.category || !draft.description.trim()) {
            setError(t("error.submissionFailed"));
            return null;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const referenceId = generateReferenceId();
            const submissionData: Omit<Submission, "id"> = {
                referenceId,
                category: draft.category,
                description: draft.description.trim(),
                photo: draft.photo,
                locale,
                status: "submitted",
                createdAt: Date.now(),
            };

            const id = await saveSubmission(submissionData);
            const savedSubmission: Submission = {
                ...submissionData,
                id,
            };

            setLastSubmission(savedSubmission);
            clearDraft();
            goNext();
            return savedSubmission;
        } catch (err) {
            console.error("Failed to save submission:", err);
            setError(t("error.submissionFailed"));
            return null;
        } finally {
            setIsSubmitting(false);
        }
    }, [draft, locale, t, setLastSubmission, clearDraft, goNext]);

    const resetFlow = useCallback(() => {
        setError(null);
        resetStepContext();
    }, [resetStepContext]);

    return {
        submit,
        isSubmitting,
        error,
        referenceId: lastSubmission?.referenceId ?? null,
        lastSubmission,
        resetFlow,
    };
}
