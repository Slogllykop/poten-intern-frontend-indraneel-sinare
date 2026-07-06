"use client";

import { StepProvider } from "@/hooks/step-context";
import { LanguageProvider } from "@/i18n";

/**
 * Wraps all client-side context providers.
 * Order matters: outer providers are available to inner ones.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <StepProvider>{children}</StepProvider>
        </LanguageProvider>
    );
}
