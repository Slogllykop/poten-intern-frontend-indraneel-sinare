import { ImageResponse } from "next/og";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";
export const alt = "Novus - Multilingual Civic Issue Reporting PWA";

export default function TwitterImage() {
    return new ImageResponse(
        <div
            style={{
                background:
                    "linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #064e3b 100%)",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "72px 80px",
                fontFamily: "sans-serif",
                color: "white",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background glowing orb */}
            <div
                style={{
                    position: "absolute",
                    bottom: -100,
                    left: -100,
                    width: 500,
                    height: 500,
                    background:
                        "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0,0,0,0) 70%)",
                    borderRadius: "50%",
                }}
            />

            {/* Top Bar: Brand Logo & Title */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        background:
                            "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 30px rgba(16, 185, 129, 0.4)",
                    }}
                >
                    <svg
                        width={36}
                        height={36}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <title>title</title>
                        <path d="M12 3a12 12 0 0 0 8.5 3A12 12 0 0 1 12 21 12 12 0 0 1 3.5 6 12 12 0 0 0 12 3" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                        style={{
                            fontSize: 28,
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            color: "#f4f4f5",
                        }}
                    >
                        NOVUS CIVIC
                    </span>
                    <span
                        style={{
                            fontSize: 18,
                            fontWeight: 500,
                            color: "#34d399",
                            letterSpacing: "0.05em",
                        }}
                    >
                        TWITTER CARD PREVIEW
                    </span>
                </div>
            </div>

            {/* Middle: Hero Typography */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    maxWidth: 900,
                }}
            >
                <div
                    style={{
                        fontSize: 60,
                        fontWeight: 900,
                        lineHeight: 1.1,
                        letterSpacing: "-0.04em",
                        color: "#ffffff",
                    }}
                >
                    Empowering Communities Through Instant Issue Reporting.
                </div>
                <div
                    style={{
                        fontSize: 26,
                        color: "#a1a1aa",
                        fontWeight: 400,
                        lineHeight: 1.4,
                    }}
                >
                    Report potholes, streetlights, sanitation, & water leaks.
                    100% Bilingual (EN/HI) & Offline-First PWA.
                </div>
            </div>

            {/* Bottom Feature Badges */}
            <div style={{ display: "flex", gap: 16 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 24px",
                        borderRadius: 999,
                        background: "rgba(16, 185, 129, 0.15)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        color: "#34d399",
                        fontSize: 20,
                        fontWeight: 600,
                    }}
                >
                    🛡️ Civic Shield
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 24px",
                        borderRadius: 999,
                        background: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        color: "#e4e4e7",
                        fontSize: 20,
                        fontWeight: 500,
                    }}
                >
                    ⚡ Instant Ref ID
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 24px",
                        borderRadius: 999,
                        background: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        color: "#e4e4e7",
                        fontSize: 20,
                        fontWeight: 500,
                    }}
                >
                    🌐 Slow 3G Ready
                </div>
            </div>
        </div>,
        {
            ...size,
        },
    );
}
