"use client";

import { AppShell } from "@/components/shared/app-shell";
import { ScreenTransition } from "@/components/shared/screen-transition";

import { Button } from "@/components/ui/button";
import { useStepNavigation } from "@/hooks/step-context";
import { useLanguage } from "@/i18n";

/**
 * Main page: renders the 3-screen flow inside the app shell.
 * Each screen is a placeholder until Milestones 3-5 build them out.
 */
export default function Home() {
    const { t } = useLanguage();
    const { currentStep, direction, goNext, goBack } = useStepNavigation();

    return (
        <AppShell>
            <ScreenTransition stepKey={currentStep} direction={direction}>
                {currentStep === "category" && (
                    <div className="flex flex-1 flex-col gap-6">
                        <div>
                            <h2 className="font-semibold text-xl tracking-tight">
                                {t("category.title")}
                            </h2>
                            <p className="mt-1 text-muted-foreground text-sm">
                                {t("category.subtitle")}
                            </p>
                        </div>

                        {/* Placeholder grid - replaced in Milestone 3 */}
                        <div className="grid grid-cols-2 gap-3">
                            {(
                                [
                                    "category.roads",
                                    "category.water",
                                    "category.electricity",
                                    "category.sanitation",
                                    "category.safety",
                                    "category.other",
                                ] as const
                            ).map((key) => (
                                <div
                                    key={key}
                                    className="rounded-xl border border-border bg-card p-4 text-center font-medium text-card-foreground text-sm"
                                >
                                    {t(key)}
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-4">
                            <Button
                                onClick={goNext}
                                size="lg"
                                className="w-full"
                            >
                                {t("nav.next")}
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === "details" && (
                    <div className="flex flex-1 flex-col gap-6">
                        <div>
                            <h2 className="font-semibold text-xl tracking-tight">
                                {t("details.title")}
                            </h2>
                            <p className="mt-1 text-muted-foreground text-sm">
                                {t("details.subtitle")}
                            </p>
                        </div>

                        {/* Placeholder - replaced in Milestone 4 */}
                        <div className="flex-1 rounded-xl border border-border border-dashed p-6 text-center text-muted-foreground text-sm">
                            {t("details.descriptionPlaceholder")}
                        </div>

                        <div className="mt-auto flex gap-3 pt-4">
                            <Button
                                onClick={goBack}
                                variant="outline"
                                size="lg"
                                className="flex-1"
                            >
                                {t("nav.back")}
                            </Button>
                            <Button
                                onClick={goNext}
                                size="lg"
                                className="flex-1"
                            >
                                {t("nav.next")}
                            </Button>
                        </div>
                    </div>
                )}

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
