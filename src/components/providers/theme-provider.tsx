"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Wraps the app with next-themes for system/dark/light support. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
        >
            {children}
        </NextThemesProvider>
    );
}
