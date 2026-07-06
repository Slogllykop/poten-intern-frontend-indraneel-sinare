"use client";

import { CategoryScreen } from "@/components/screens/category-screen";
import { ConfirmationScreen } from "@/components/screens/confirmation-screen";
import { DetailsScreen } from "@/components/screens/details-screen";
import { AppShell } from "@/components/shared/app-shell";
import { ScreenTransition } from "@/components/shared/screen-transition";
import { useStepNavigation } from "@/hooks/step-context";

/**
 * Main page: renders the 3-screen flow inside the app shell.
 */
export default function Home() {
    const { currentStep, direction } = useStepNavigation();

    return (
        <AppShell>
            <ScreenTransition stepKey={currentStep} direction={direction}>
                {currentStep === "category" && <CategoryScreen />}

                {currentStep === "details" && <DetailsScreen />}

                {currentStep === "confirmation" && <ConfirmationScreen />}
            </ScreenTransition>
        </AppShell>
    );
}
