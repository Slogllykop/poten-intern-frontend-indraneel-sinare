import { ImageResponse } from "next/og";

const ICON_SIZES = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

export function generateImageMetadata() {
    return ICON_SIZES.map((size) => ({
        id: String(size),
        size: { width: size, height: size },
        contentType: "image/png",
    }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
    const iconId = await id;
    const size = parseInt(iconId, 10) || 192;
    const iconSize = Math.floor(size * 0.55);
    const strokeWidth = size <= 32 ? "2.75" : "2.25";

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
                boxShadow:
                    size > 64
                        ? "0 4px 20px rgba(16, 185, 129, 0.4)"
                        : undefined,
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
                strokeWidth={strokeWidth}
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
