/**
 * Submission types for the Civic Reporter app.
 * Used across storage layer, hooks, and components.
 */

export type CategoryId =
    | "roads"
    | "water"
    | "electricity"
    | "sanitation"
    | "safety"
    | "other";

export type SubmissionStatus =
    | "pending"
    | "submitted"
    | "under-review"
    | "in-progress"
    | "resolved";

/** Raw form data before persistence */
export interface SubmissionDraft {
    category: CategoryId | null;
    description: string;
    photo: string | null; // base64 data URL
}

/** Persisted submission in IndexedDB */
export interface Submission {
    id: number;
    referenceId: string;
    category: CategoryId;
    description: string;
    photo: string | null;
    locale: "en" | "hi";
    status: SubmissionStatus;
    createdAt: number; // Date.now() timestamp
}

/** Step identifiers for the 3-screen flow */
export type Step = "category" | "details" | "confirmation";

/** Direction of navigation for transition animation */
export type Direction = "forward" | "backward";
