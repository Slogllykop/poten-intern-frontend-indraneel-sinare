"use client";

import { LanguageProvider } from "@/i18n";

/**
 * Wraps all client-side context providers.
 * New providers (StepContext, etc.) will be composed here.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
    return <LanguageProvider>{children}</LanguageProvider>;
}
