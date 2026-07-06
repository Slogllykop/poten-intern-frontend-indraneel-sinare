"use client";

import {
    createContext,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import { I18N_STORAGE_KEY } from "@/lib/constants";
import type { TranslationKeys, Translations } from "./translations/en";
import en from "./translations/en";
import hi from "./translations/hi";

export type Locale = "en" | "hi";

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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");

    // Load stored locale after initial hydration to prevent SSR mismatch
    useLayoutEffect(() => {
        try {
            const stored = localStorage.getItem(I18N_STORAGE_KEY) as Locale;
            if (stored === "en" || stored === "hi") {
                setLocaleState(stored);
            }
        } catch {
            // localStorage unavailable
        }
    }, []);

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        try {
            localStorage.setItem(I18N_STORAGE_KEY, next);
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
