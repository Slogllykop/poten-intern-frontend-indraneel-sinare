"use client";

import { CategoryScreen } from "@/components/screens/category-screen";
import { DetailsScreen } from "@/components/screens/details-screen";
import { AppShell } from "@/components/shared/app-shell";
import { ScreenTransition } from "@/components/shared/screen-transition";
import { Button } from "@/components/ui/button";
import { useStepNavigation } from "@/hooks/step-context";
import { useLanguage } from "@/i18n";

/**
 * Main page: renders the 3-screen flow inside the app shell.
 * Screen 3 (confirmation) still uses a placeholder until Milestone 5.
 */
export default function Home() {
    const { t } = useLanguage();
    const { currentStep, direction, goBack } = useStepNavigation();

    return (
        <AppShell>
            <ScreenTransition stepKey={currentStep} direction={direction}>
                {currentStep === "category" && <CategoryScreen />}

                {currentStep === "details" && <DetailsScreen />}

                {currentStep === "confirmation" && (
                    <div className="flex flex-1 flex-col items-center gap-6 text-center">
                        <div>
                            <h2 className="font-semibold text-xl tracking-tight">
                                {t("confirmation.title")}
                            </h2>
                            <p className="mt-1 text-muted-foreground text-sm">
                                {t("confirmation.subtitle")}
                            </p>
                        </div>

                        {/* Placeholder ref ID - replaced in Milestone 5 */}
                        <div className="rounded-xl border border-border bg-card px-6 py-4">
                            <p className="text-muted-foreground text-xs">
                                {t("confirmation.referenceId")}
                            </p>
                            <p className="mt-1 font-mono font-semibold text-lg tracking-wider">
                                CIV-XXXXXX
                            </p>
                        </div>

                        <div className="mt-auto w-full pt-4">
                            <Button
                                onClick={goBack}
                                variant="outline"
                                size="lg"
                                className="w-full"
                            >
                                {t("nav.back")}
                            </Button>
                        </div>
                    </div>
                )}
            </ScreenTransition>
        </AppShell>
    );
}
