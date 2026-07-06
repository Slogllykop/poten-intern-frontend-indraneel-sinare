"use client";

import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { TranslationKeys, Translations } from "./translations/en";
import en from "./translations/en";
import hi from "./translations/hi";

export type Locale = "en" | "hi";

const STORAGE_KEY = "civic-reporter-locale";

const translationMap: Record<Locale, Translations> = { en, hi };

export interface LanguageContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    /**
     * Look up a translation key, optionally interpolating {placeholders}.
     * Falls back to English if the key is missing in the active locale.
     */
    t: (key: TranslationKeys, params?: Record<string, string>) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLocale(): Locale {
    if (typeof window === "undefined") return "en";
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "en" || stored === "hi") return stored;
    } catch {
        // localStorage unavailable (private browsing, etc.)
    }
    return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // silent fail
        }
    }, []);

    // Sync the html lang attribute when locale changes
    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const t = useCallback(
        (key: TranslationKeys, params?: Record<string, string>): string => {
            let result: string =
                translationMap[locale]?.[key] ?? translationMap.en[key] ?? key;
            if (params) {
                for (const [placeholder, replacement] of Object.entries(
                    params,
                )) {
                    result = result.replace(`{${placeholder}}`, replacement);
                }
            }
            return result;
        },
        [locale],
    );

    const value = useMemo(
        () => ({ locale, setLocale, t }),
        [locale, setLocale, t],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
