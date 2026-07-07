import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
    variable: "--font-devanagari",
    subsets: ["devanagari"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Novus Civic Platform",
    alternateName: "Novus",
    description:
        "Multilingual civic issue reporting progressive web application for reporting local infrastructure and community issues like potholes, water leaks, and electricity hazards.",
    url: "https://novus.isdevs.cv",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    inLanguage: ["en-US", "hi-IN"],
    featureList: [
        "Offline-first reporting with IndexedDB storage",
        "Voice input recognition via Web Speech API",
        "Bilingual English and Hindi interface with instant toggle",
        "Instant reference ID generation and status tracking",
        "Installable Progressive Web App (PWA) with Service Worker",
    ],
    creator: {
        "@type": "Organization",
        name: "Novus Platform",
        url: "https://novus.isdevs.cv",
    },
};

export const metadata: Metadata = {
    metadataBase: new URL("https://novus.isdevs.cv"),
    title: {
        default: "Novus | Multilingual Civic Issue Reporting PWA",
        template: "%s | Novus Civic Platform",
    },
    description:
        "Report civic issues in your neighbourhood like potholes, water leaks, electricity hazards, and sanitation. 100% offline-capable, bilingual in English and Hindi, and installable PWA with instant reference tracking.",
    keywords: [
        "civic reporting",
        "pothole report",
        "neighborhood watch",
        "PWA",
        "bilingual civic app",
        "India civic reporting",
        "municipal issue tracker",
        "offline civic form",
        "Novus",
    ],
    authors: [{ name: "Novus Platform Team" }],
    creator: "Novus Platform",
    publisher: "Novus Platform",
    applicationName: "Novus",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Novus",
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        alternateLocale: ["hi_IN"],
        url: "/",
        title: "Novus | Multilingual Civic Issue Reporting PWA",
        description:
            "Report civic issues in your neighbourhood like potholes, water leaks, electricity hazards, and sanitation. 100% offline-capable, bilingual in English and Hindi, and installable PWA.",
        siteName: "Novus Civic Platform",
    },
    twitter: {
        card: "summary_large_image",
        title: "Novus | Multilingual Civic Issue Reporting PWA",
        description:
            "Report civic issues in your neighbourhood like potholes, water leaks, electricity hazards, and sanitation. 100% offline-capable, bilingual in English and Hindi, and installable PWA.",
        creator: "@NovusCivic",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#059669" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(
                geistSans.variable,
                geistMono.variable,
                notoDevanagari.variable,
            )}
            suppressHydrationWarning
        >
            <head>
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD SEO schema injection
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="flex min-h-dvh flex-col antialiased">
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
