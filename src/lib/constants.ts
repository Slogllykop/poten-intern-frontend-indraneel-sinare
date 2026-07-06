import {
    IconBolt,
    IconDots,
    IconDroplet,
    IconRoad,
    IconShield,
    IconTrash,
} from "@tabler/icons-react";
import type { TranslationKeys } from "@/i18n/translations/en";
import type { CategoryId, Step, SubmissionDraft } from "@/types";

// ============================================================================
// Categories
// ============================================================================

export interface Category {
    id: CategoryId;
    /** Translation key for the category label */
    labelKey: TranslationKeys;
    icon: React.ElementType;
    /** Tailwind color class for subtle per-category accent */
    color: string;
}

export const CATEGORIES: Category[] = [
    {
        id: "roads",
        labelKey: "category.roads",
        icon: IconRoad,
        color: "amber",
    },
    {
        id: "water",
        labelKey: "category.water",
        icon: IconDroplet,
        color: "sky",
    },
    {
        id: "electricity",
        labelKey: "category.electricity",
        icon: IconBolt,
        color: "yellow",
    },
    {
        id: "sanitation",
        labelKey: "category.sanitation",
        icon: IconTrash,
        color: "lime",
    },
    {
        id: "safety",
        labelKey: "category.safety",
        icon: IconShield,
        color: "rose",
    },
    {
        id: "other",
        labelKey: "category.other",
        icon: IconDots,
        color: "violet",
    },
];

export const COLOR_MAP: Record<
    string,
    { bg: string; text: string; border: string; iconBg?: string }
> = {
    amber: {
        bg: "bg-amber-500/10",
        text: "text-amber-600",
        border: "border-amber-500/50",
        iconBg: "bg-amber-500",
    },
    sky: {
        bg: "bg-sky-500/10",
        text: "text-sky-600",
        border: "border-sky-500/50",
        iconBg: "bg-sky-500",
    },
    yellow: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-600",
        border: "border-yellow-500/50",
        iconBg: "bg-yellow-500",
    },
    lime: {
        bg: "bg-lime-500/10",
        text: "text-lime-600",
        border: "border-lime-500/50",
        iconBg: "bg-lime-500",
    },
    rose: {
        bg: "bg-rose-500/10",
        text: "text-rose-600",
        border: "border-rose-500/50",
        iconBg: "bg-rose-500",
    },
    violet: {
        bg: "bg-violet-500/10",
        text: "text-violet-600",
        border: "border-violet-500/50",
        iconBg: "bg-violet-500",
    },
};

// ============================================================================
// Storage & I18N
// ============================================================================

export const STORAGE_CONSTANTS = {
    DB_NAME: "novus-db",
    DB_VERSION: 1,
    STORE_NAME: "submissions",
    LS_KEY: "novus-submissions",
};

export const I18N_STORAGE_KEY = "novus-locale";

// ============================================================================
// Flow Steps
// ============================================================================

export const FLOW_STEPS: Step[] = ["category", "details", "confirmation"];

export const INITIAL_DRAFT: SubmissionDraft = {
    category: null,
    description: "",
    photo: null,
};

// ============================================================================
// Configuration
// ============================================================================

export const VOICE_CONFIG = {
    MIN_DESCRIPTION_LENGTH: 10,
    ENABLE_VOICE_RECOGNITION: true,
    BAR_COUNT: 32,
    BAR_GAP: 2,
    MIN_BAR_HEIGHT: 2,
};

export const UI_CONSTANTS = {
    SLIDE_DISTANCE: 40, // in logical pixels (rem-equivalent via transform)
};

export const MONTH_NAMES_HI = [
    "जनवरी",
    "फरवरी",
    "मार्च",
    "अप्रैल",
    "मई",
    "जून",
    "जुलाई",
    "अगस्त",
    "सितंबर",
    "अक्टूबर",
    "नवंबर",
    "दिसंबर",
];

export const MONTH_NAMES_EN = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const MONTH_NAMES_SHORT_EN = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
