import type { MetadataRoute } from "next";

const ICON_SIZES = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

export default function manifest(): MetadataRoute.Manifest {
    const anyIcons = ICON_SIZES.map((size) => ({
        src: `/icon/${size}`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "any" as const,
    }));

    const maskableIcons = [192, 384, 512].map((size) => ({
        src: `/icon/${size}`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "maskable" as const,
    }));

    return {
        name: "Novus Civic Platform",
        short_name: "Novus",
        description:
            "Report civic issues like potholes, water leaks, and electricity hazards. Available in English and Hindi. Offline-ready PWA with instant reference ID tracking.",
        start_url: "/",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#10b981",
        orientation: "portrait",
        scope: "/",
        categories: ["utilities", "government", "social", "lifestyle"],
        icons: [...anyIcons, ...maskableIcons],
    };
}
