"use client";

import { AppShell } from "@/components/shared/app-shell";
import { useLanguage } from "@/i18n";

export default function Home() {
    const { t } = useLanguage();

    return (
        <AppShell>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {t("app.description")}
                </p>
                <p className="text-muted-foreground/60 text-sm">
                    {t("step.category")} &rarr; {t("step.details")} &rarr;{" "}
                    {t("step.confirmation")}
                </p>
            </div>
        </AppShell>
    );
}
