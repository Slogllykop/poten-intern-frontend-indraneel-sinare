import { ImageResponse } from "next/og";

export function generateImageMetadata() {
    return [
        {
            id: "192",
            size: { width: 192, height: 192 },
            contentType: "image/png",
        },
        {
            id: "512",
            size: { width: 512, height: 512 },
            contentType: "image/png",
        },
    ];
}

export default async function Icon({ id }: { id: Promise<string> }) {
    const iconId = await id;
    const size = iconId === "192" ? 192 : 512;
    const iconSize = Math.floor(size * 0.55);

    return new ImageResponse(
        <div
            style={{
                fontSize: iconSize,
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                borderRadius: "22%",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
            }}
        >
            <svg
                role="img"
                aria-label="Novus Icon"
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 3a12 12 0 0 0 8.5 3A12 12 0 0 1 12 21 12 12 0 0 1 3.5 6 12 12 0 0 0 12 3" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        </div>,
        {
            width: size,
            height: size,
        },
    );
}
