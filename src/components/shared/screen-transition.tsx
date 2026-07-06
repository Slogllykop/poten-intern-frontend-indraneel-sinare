"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { Direction, Step } from "@/types";

/**
 * Direction-aware screen transition wrapper.
 *
 * This is the ONE thoughtful micro-interaction: screens slide left when
 * navigating forward, right when going back. Creates spatial consistency
 * so the user always knows "where" they are in the flow.
 *
 * Respects prefers-reduced-motion: degrades to a simple fade.
 */

const SLIDE_DISTANCE = 40; // in logical pixels (rem-equivalent via transform)

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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const shouldReduce = isMounted ? prefersReducedMotion : false;

    const xOffset = direction === "forward" ? SLIDE_DISTANCE : -SLIDE_DISTANCE;

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={stepKey}
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
                className="flex flex-1 flex-col"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
