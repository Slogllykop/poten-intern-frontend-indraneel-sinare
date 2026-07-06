import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Novus",
        short_name: "Novus",
        description:
            "Report civic issues like potholes, water leaks, and electricity hazards. Available in English and Hindi.",
        start_url: "/",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#10b981",
        orientation: "portrait",
        scope: "/",
        categories: ["utilities", "government"],
        icons: [
            {
                src: "/icon/192",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon/512",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon/192",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon/512",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
