"use client";

import { useEffect } from "react";
import { StepProvider } from "@/hooks/step-context";
import { LanguageProvider } from "@/i18n";
import { registerSW } from "@/layers/service-worker";

/**
 * Wraps all client-side context providers.
 * Order matters: outer providers are available to inner ones.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        registerSW();
    }, []);

    return (
        <LanguageProvider>
            <StepProvider>{children}</StepProvider>
        </LanguageProvider>
    );
}
