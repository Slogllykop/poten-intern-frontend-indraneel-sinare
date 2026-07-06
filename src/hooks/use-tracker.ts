"use client";

import {
    IconCircleCheck,
    IconClipboardCheck,
    IconFileCheck,
    IconTools,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import type { TranslationKeys } from "@/i18n/translations/en";
import { getSubmissions, updateSubmissionStatus } from "@/layers/storage";
import type { Submission, SubmissionStatus } from "@/types";

export interface TimelineStep {
    id: "submitted" | "under-review" | "in-progress" | "resolved";
    labelKey: TranslationKeys;
    icon: React.ElementType;
    color: string;
    statusState: "completed" | "current" | "upcoming";
    timestamp: number | null;
}

export interface UseTrackerReturn {
    submissions: Submission[];
    isLoading: boolean;
    refresh: () => Promise<void>;
    getTimelineForSubmission: (submission: Submission) => TimelineStep[];
    advanceStatus: (id: number) => Promise<void>;
}

const STATUS_ORDER: (
    | "submitted"
    | "under-review"
    | "in-progress"
    | "resolved"
)[] = ["submitted", "under-review", "in-progress", "resolved"];

export function useTracker(): UseTrackerReturn {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refresh = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getSubmissions();
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions for tracker:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const getTimelineForSubmission = useCallback(
        (submission: Submission): TimelineStep[] => {
            const currentStatus =
                submission.status === "pending"
                    ? "submitted"
                    : (submission.status as
                          | "submitted"
                          | "under-review"
                          | "in-progress"
                          | "resolved");

            const currentIndex = STATUS_ORDER.indexOf(currentStatus);

            // Simulate realistic step timestamps based on creation time
            const t0 = submission.createdAt;
            const t1 = t0 + 1000 * 60 * 60 * 3; // +3 hours
            const t2 = t1 + 1000 * 60 * 60 * 24; // +1 day
            const t3 = t2 + 1000 * 60 * 60 * 48; // +2 days
            const timestamps = [t0, t1, t2, t3];

            return [
                {
                    id: "submitted",
                    labelKey: "tracker.statusSubmitted",
                    icon: IconFileCheck,
                    color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
                    statusState:
                        currentIndex > 0
                            ? "completed"
                            : currentIndex === 0
                              ? "current"
                              : "upcoming",
                    timestamp: timestamps[0],
                },
                {
                    id: "under-review",
                    labelKey: "tracker.statusUnderReview",
                    icon: IconClipboardCheck,
                    color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
                    statusState:
                        currentIndex > 1
                            ? "completed"
                            : currentIndex === 1
                              ? "current"
                              : "upcoming",
                    timestamp: currentIndex >= 1 ? timestamps[1] : null,
                },
                {
                    id: "in-progress",
                    labelKey: "tracker.statusInProgress",
                    icon: IconTools,
                    color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
                    statusState:
                        currentIndex > 2
                            ? "completed"
                            : currentIndex === 2
                              ? "current"
                              : "upcoming",
                    timestamp: currentIndex >= 2 ? timestamps[2] : null,
                },
                {
                    id: "resolved",
                    labelKey: "tracker.statusResolved",
                    icon: IconCircleCheck,
                    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
                    statusState:
                        currentIndex > 3
                            ? "completed"
                            : currentIndex === 3
                              ? "current"
                              : "upcoming",
                    timestamp: currentIndex >= 3 ? timestamps[3] : null,
                },
            ];
        },
        [],
    );

    const advanceStatus = useCallback(
        async (id: number) => {
            const sub = submissions.find((s) => s.id === id);
            if (!sub) return;

            const current =
                sub.status === "pending"
                    ? "submitted"
                    : (sub.status as
                          | "submitted"
                          | "under-review"
                          | "in-progress"
                          | "resolved");
            const idx = STATUS_ORDER.indexOf(current);
            const nextStatus: SubmissionStatus =
                STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];

            await updateSubmissionStatus(id, nextStatus);
            await refresh();
        },
        [submissions, refresh],
    );

    return {
        submissions,
        isLoading,
        refresh,
        getTimelineForSubmission,
        advanceStatus,
    };
}
