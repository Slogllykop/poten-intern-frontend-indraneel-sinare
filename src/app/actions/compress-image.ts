"use server";

import sharp from "sharp";

/**
 * Server action: compresses an image using Sharp.
 *
 * Accepts a base64 data URL, resizes to max 800px wide,
 * compresses to JPEG quality 70, and returns a new data URL.
 *
 * Used when the client has network connectivity.
 * The client falls back to canvas compression when offline.
 */
export async function compressImageAction(
    base64DataUrl: string,
): Promise<string> {
    try {
        // Strip the data URL prefix to get raw base64
        const base64 = base64DataUrl.replace(/^data:image\/\w+;base64,/, "");
        const inputBuffer = Buffer.from(base64, "base64");

        const outputBuffer = await sharp(inputBuffer)
            .resize(800, undefined, { withoutEnlargement: true })
            .jpeg({ quality: 70, mozjpeg: true })
            .toBuffer();

        return `data:image/jpeg;base64,${outputBuffer.toString("base64")}`;
    } catch {
        // If Sharp fails for any reason, rethrow so client can fall back to canvas
        throw new Error("Server-side compression failed");
    }
}
