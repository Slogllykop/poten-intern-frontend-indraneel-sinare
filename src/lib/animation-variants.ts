import type { Variants } from "motion/react";

/**
 * Shared Framer Motion animation variants used across multiple screens.
 * Emil Kowalski ease-out curve: [0.23, 1, 0.32, 1]
 */

/** Container that staggers its children on entry */
export const containerVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: [0.23, 1, 0.32, 1],
            staggerChildren: 0.08,
        },
    },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

/** Individual item that fades + slides up */
export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
