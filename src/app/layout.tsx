import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
    title: "Civic Reporter",
    description:
        "Report civic issues in your neighbourhood. Multilingual, offline-capable, and installable.",
    applicationName: "Civic Reporter",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Civic Reporter",
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
            className={cn(geistSans.variable, geistMono.variable)}
            suppressHydrationWarning
        >
            <body className="flex min-h-dvh flex-col antialiased">
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
