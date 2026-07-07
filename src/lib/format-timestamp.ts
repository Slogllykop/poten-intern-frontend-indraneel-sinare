import {
    MONTH_NAMES_EN,
    MONTH_NAMES_HI,
    MONTH_NAMES_SHORT_EN,
} from "@/lib/constants";

/**
 * Returns ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Formats a timestamp for the tracker screen.
 * Uses full month names and ordinal day suffixes in English,
 * Hindi month names with AM/PM in Devanagari.
 */
export function formatTimestamp(
    timestamp: number,
    locale: "en" | "hi",
): string {
    const d = new Date(timestamp);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = d.getDate();
    const year = d.getFullYear();
    let hours = d.getHours();
    const mins = pad(d.getMinutes());
    const isPm = hours >= 12;
    hours = hours % 12 || 12;

    if (locale === "hi") {
        const month = MONTH_NAMES_HI[d.getMonth()];
        const amPm = isPm ? "दोपहर/शाम" : "सुबह";
        return `${day} ${month} ${year}, ${amPm} ${hours}:${mins} बजे`;
    }

    const month = MONTH_NAMES_EN[d.getMonth()];
    const amPm = isPm ? "pm" : "am";
    return `${getOrdinal(day)} ${month} ${year}, ${hours}:${mins} ${amPm}`;
}

/**
 * Formats a timestamp for the confirmation screen.
 * Uses short month names and zero-padded days in English,
 * Hindi month names with AM/PM in Devanagari.
 */
export function formatSubmissionTimestamp(
    timestamp: number,
    locale: "en" | "hi",
): string {
    const d = new Date(timestamp);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = pad(d.getDate());
    const year = d.getFullYear();
    let hours = d.getHours();
    const mins = pad(d.getMinutes());
    const isPm = hours >= 12;
    hours = hours % 12 || 12;

    if (locale === "hi") {
        const month = MONTH_NAMES_HI[d.getMonth()];
        const amPm = isPm ? "दोपहर" : "सुबह";
        return `${day} ${month} ${year}, ${amPm} ${hours}:${mins}`;
    }

    const month = MONTH_NAMES_SHORT_EN[d.getMonth()];
    const amPm = isPm ? "PM" : "AM";
    return `${day} ${month} ${year}, ${hours}:${mins} ${amPm}`;
}
