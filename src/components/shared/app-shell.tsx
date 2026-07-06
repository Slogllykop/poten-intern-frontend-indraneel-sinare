"use client";

import { IconShieldCheck } from "@tabler/icons-react";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./language-toggle";

/**
 * Mobile-first app shell with sticky header and scrollable content.
 * Header: app logo/title + language toggle.
 * Content: centered, max-width constrained, with safe-area padding.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage();

    return (
        <div className="flex min-h-dvh flex-col bg-background">
            {/* Sticky header */}
            <header
                className={cn(
                    "sticky top-0 z-40",
                    "flex items-center justify-between",
                    "border-border/60 border-b bg-background/80 backdrop-blur-md",
                    "px-4 py-3",
                    "sm:px-6",
                )}
            >
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                        <IconShieldCheck size="1.125rem" strokeWidth={2} />
                    </div>
                    <h1 className="font-semibold text-base text-foreground tracking-tight">
                        {t("app.title")}
                    </h1>
                </div>
                <LanguageToggle />
            </header>

            {/* Scrollable content area */}
            <main className="flex flex-1 flex-col">
                <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 sm:px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
