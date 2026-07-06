"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { UI_CONSTANTS } from "@/lib/constants";
import type { Direction, Step } from "@/types";

/**
 * Direction-aware screen transition wrapper.
 *
 * This is the ONE thoughtful micro-interaction: screens slide left when
 * navigating forward, right when going back. Creates spatial consistency
 * so the user always knows "where" they are in the flow.
 *
 * Respects prefers-reduced-motion: degrades to a simple fade.
 *
 * Focus management: after the enter animation completes, focus is moved
 * to the new screen's heading (h2) so screen readers announce the change.
 */

interface ScreenTransitionProps {
    /** Current step key for AnimatePresence */
    stepKey: Step;
    /** Navigation direction */
    direction: Direction;
    children: React.ReactNode;
}

export function ScreenTransition({
    stepKey,
    direction,
    children,
}: ScreenTransitionProps) {
    const prefersReducedMotion = useReducedMotion();
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const shouldReduce = isMounted ? prefersReducedMotion : false;

    const xOffset =
        direction === "forward"
            ? UI_CONSTANTS.SLIDE_DISTANCE
            : -UI_CONSTANTS.SLIDE_DISTANCE;

    /** Move focus to the new screen's heading after enter animation */
    const handleAnimationComplete = useCallback(() => {
        if (!containerRef.current) return;
        const heading = containerRef.current.querySelector("h2");
        if (heading) {
            // Make heading focusable without adding it to tab order
            if (!heading.hasAttribute("tabindex")) {
                heading.setAttribute("tabindex", "-1");
            }
            heading.focus({ preventScroll: true });
        }
    }, []);

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={stepKey}
                ref={containerRef}
                initial={
                    shouldReduce ? { opacity: 0 } : { opacity: 0, x: xOffset }
                }
                animate={shouldReduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={
                    shouldReduce ? { opacity: 0 } : { opacity: 0, x: -xOffset }
                }
                transition={{
                    duration: 0.25,
                    ease: [0.23, 1, 0.32, 1], // strong ease-out
                }}
                onAnimationComplete={handleAnimationComplete}
                className="flex flex-1 flex-col"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
