"use client";

import { IconShieldCheck } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Step } from "@/types";
import { LanguageToggle } from "../language-toggle";
import { OfflineBanner } from "../offline-banner";
import { StepIndicator } from "../step-indicator";
import { ThemeToggle } from "../theme-toggle";

/**
 * Mobile top bar (visible only on mobile).
 * Minimal - logo, step indicator on form flow, and action controls.
 */
export function MobileTopBar({
    isFormFlow,
    currentStep,
    appTitle,
}: {
    isFormFlow: boolean;
    currentStep: Step;
    appTitle: string;
}) {
    return (
        <header
            className={cn(
                "sticky top-0 z-40 md:hidden",
                "flex flex-col",
                "border-border/50 border-b bg-background/85 backdrop-blur-xl backdrop-saturate-150",
            )}
        >
            <OfflineBanner />
            <div className="flex h-13 w-full items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-emerald-600/30 shadow-sm">
                        <IconShieldCheck size="0.9rem" strokeWidth={2} />
                    </div>
                    <h1 className="font-semibold text-foreground text-sm tracking-tight">
                        {appTitle}
                    </h1>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5">
                    <ThemeToggle />
                    <LanguageToggle />
                </div>
            </div>

            {/* Mobile step indicator - form flow only */}
            <AnimatePresence initial={false}>
                {isFormFlow && (
                    <motion.div
                        key="mobile-step"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                            duration: 0.22,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        className="overflow-hidden border-border/40 border-t"
                    >
                        <div className="flex items-center justify-center py-2.5">
                            <StepIndicator currentStep={currentStep} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
