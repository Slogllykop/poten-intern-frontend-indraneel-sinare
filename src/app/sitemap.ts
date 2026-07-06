import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://novus.isdevs.cv";
    const lastModified = new Date();

    return [
        {
            url: `${baseUrl}`,
            lastModified,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/issues`,
            lastModified,
            changeFrequency: "hourly",
            priority: 0.9,
        },
    ];
}
