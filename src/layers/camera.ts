/**
 * Camera and file-input abstraction layer.
 *
 * Uses Sharp (server action) for image compression when online,
 * falls back to canvas compression when offline or if the server action fails.
 * Always forces camera capture on mobile (no gallery picker).
 */

import { compressImageAction } from "@/app/actions/compress-image";

/**
 * Triggers the native camera capture dialog.
 * Uses capture="environment" to open the rear camera directly on mobile.
 * On desktop, this falls back to a standard file dialog.
 */
export function triggerCameraCapture(): Promise<File | null> {
    return new Promise((resolve) => {
        if (typeof window === "undefined") {
            resolve(null);
            return;
        }

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.capture = "environment";
        input.setAttribute("capture", "environment");

        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            resolve(file || null);
        };

        input.oncancel = () => {
            resolve(null);
        };

        input.click();
    });
}

/** Read a file as a base64 data URL. */
function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) resolve(result);
            else reject(new Error("Failed to read file"));
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

/**
 * Canvas-based fallback compression for offline use.
 * Used when the Sharp server action is unreachable.
 */
function compressWithCanvas(
    dataUrl: string,
    maxWidth: number,
    quality: number,
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Canvas context unavailable"));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = dataUrl;
    });
}

/**
 * Compresses an image file.
 * Tries Sharp server action first (better quality), falls back to canvas.
 */
export async function compressImage(
    file: File,
    maxWidth = 800,
    quality = 0.7,
): Promise<string> {
    const dataUrl = await readAsDataUrl(file);

    // Try Sharp server action first (better quality via mozjpeg)
    try {
        const compressed = await compressImageAction(dataUrl);
        return compressed;
    } catch {
        // Offline or server error: fall back to canvas
        return compressWithCanvas(dataUrl, maxWidth, quality);
    }
}
