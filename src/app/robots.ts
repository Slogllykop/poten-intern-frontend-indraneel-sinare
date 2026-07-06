import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://novus.isdevs.cv";

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/issues"],
                disallow: ["/api/", "/_next/"],
            },
            // Specific friendly crawling rules for AI search engines (LLMO/GEO)
            {
                userAgent: [
                    "GPTBot",
                    "Google-Extended",
                    "ClaudeBot",
                    "PerplexityBot",
                ],
                allow: ["/", "/issues"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
