"use client";

import { useContext } from "react";
import { LanguageContext, type Locale } from "./context";

/**
 * Convenience hook for consuming LanguageContext.
 * Returns { t, locale, toggleLocale, isHindi }.
 */
export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }

    const toggleLocale = () => {
        ctx.setLocale(ctx.locale === "en" ? "hi" : "en");
    };

    return {
        t: ctx.t,
        locale: ctx.locale as Locale,
        setLocale: ctx.setLocale,
        toggleLocale,
        isHindi: ctx.locale === "hi",
    };
}
