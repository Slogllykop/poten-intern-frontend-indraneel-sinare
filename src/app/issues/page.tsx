"use client";

import { TrackerScreen } from "@/components/screens/tracker-screen";
import { AppShell } from "@/components/shared/app-shell";

/**
 * Dedicated page for tracking reported civic issues on /issues route.
 */
export default function IssuesPage() {
    return (
        <AppShell>
            <TrackerScreen />
        </AppShell>
    );
}
