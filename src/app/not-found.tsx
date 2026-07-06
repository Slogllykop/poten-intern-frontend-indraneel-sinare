"use client";

import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shared/app-shell";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";

export default function NotFound() {
    const { t } = useLanguage();
    const router = useRouter();

    return (
        <AppShell>
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                {/* Visual Icon with subtle glow */}
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-2xs dark:bg-amber-500/20 dark:text-amber-400">
                    <IconAlertTriangle size="2.25rem" strokeWidth={1.75} />
                </div>

                {/* Typography */}
                <h2 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
                    {t("notFound.title")}
                </h2>
                <p className="mt-2 max-w-sm text-muted-foreground text-sm leading-relaxed sm:text-base">
                    {t("notFound.description")}
                </p>

                {/* Action CTA */}
                <div className="mt-8 w-full sm:w-auto">
                    <Button
                        type="button"
                        onClick={() => router.push("/")}
                        size="lg"
                        className="pointer-hover:hover:-translate-y-0.5 w-full touch-manipulation gap-2 rounded-xl font-semibold shadow-sm transition-all hover:shadow-md active:scale-95 sm:w-auto"
                    >
                        <IconArrowLeft size="1.125rem" strokeWidth={2} />
                        {t("notFound.backHome")}
                    </Button>
                </div>
            </div>
        </AppShell>
    );
}
