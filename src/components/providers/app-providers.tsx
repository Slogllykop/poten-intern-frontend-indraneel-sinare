"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StepProvider } from "@/hooks/step-context";
import { LanguageProvider } from "@/i18n";
import { registerSW } from "@/layers/service-worker";

/**
 * Wraps all client-side context providers.
 * Order matters: ThemeProvider must be outermost so CSS class is set before hydration.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        registerSW();
    }, []);

    return (
        <ThemeProvider>
            <LanguageProvider>
                <StepProvider>{children}</StepProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
