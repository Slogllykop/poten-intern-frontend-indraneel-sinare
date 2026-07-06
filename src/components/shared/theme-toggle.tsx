"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
    className?: string;
    /** "icon" for icon-only, "full" for icon + label */
    variant?: "icon" | "full";
}

/**
 * Dark / light mode toggle using next-themes.
 * Crossfades between sun and moon icons with a smooth spring.
 */
export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch — only render after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = resolvedTheme === "dark";

    const toggle = () => {
        setTheme(isDark ? "light" : "dark");
    };

    if (!mounted) {
        // Placeholder with same dimensions so layout doesn't shift
        return (
            <div
                className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    className,
                )}
                aria-hidden
            />
        );
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={cn(
                "relative inline-flex items-center justify-center gap-2 rounded-xl",
                "border border-border/70 bg-secondary/40 text-foreground",
                "transition-colors duration-200 hover:border-border hover:bg-secondary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                "active:scale-[0.95]",
                variant === "icon" ? "size-9" : "h-9 px-3",
                className,
            )}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.span
                        key="moon"
                        initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                        transition={{
                            duration: 0.18,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        className="flex items-center justify-center"
                    >
                        <IconMoon size="1rem" strokeWidth={1.75} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="sun"
                        initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
                        transition={{
                            duration: 0.18,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        className="flex items-center justify-center"
                    >
                        <IconSun size="1rem" strokeWidth={1.75} />
                    </motion.span>
                )}
            </AnimatePresence>
            {variant === "full" && (
                <span className="font-medium text-xs">
                    {isDark ? "Dark" : "Light"}
                </span>
            )}
        </button>
    );
}
