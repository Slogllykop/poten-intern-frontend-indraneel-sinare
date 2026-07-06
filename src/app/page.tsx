"use client";

import { CategoryScreen } from "@/components/screens/category-screen";
import { ConfirmationScreen } from "@/components/screens/confirmation-screen";
import { DetailsScreen } from "@/components/screens/details-screen";
import { TrackerScreen } from "@/components/screens/tracker-screen";
import { AppShell } from "@/components/shared/app-shell";
import { ScreenTransition } from "@/components/shared/screen-transition";
import { useStepNavigation } from "@/hooks/step-context";

/**
 * Main page: renders the 3-screen flow and status tracker inside the app shell.
 */
export default function Home() {
    const { currentStep, direction } = useStepNavigation();

    const SCREENS: Record<string, React.ReactNode> = {
        category: <CategoryScreen />,
        details: <DetailsScreen />,
        confirmation: <ConfirmationScreen />,
        tracker: <TrackerScreen />,
    };

    return (
        <AppShell>
            <ScreenTransition stepKey={currentStep} direction={direction}>
                {SCREENS[currentStep]}
            </ScreenTransition>
        </AppShell>
    );
}
