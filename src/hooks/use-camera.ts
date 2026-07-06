import { useCallback, useState } from "react";
import { compressImage, triggerCameraCapture } from "@/layers/camera";
import { useStepNavigation } from "./step-context";

/**
 * Hook wrapping the Camera layer.
 * Triggers native camera capture, compresses via Sharp (or canvas fallback),
 * and updates the draft photo.
 */
export function useCamera() {
    const { draft, setPhoto } = useStepNavigation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCapture = useCallback(async () => {
        try {
            setError(null);

            const file = await triggerCameraCapture();
            if (!file) return; // User cancelled

            setIsProcessing(true);

            // Compress with Sharp server action, canvas fallback
            const dataUrl = await compressImage(file, 800, 0.7);
            setPhoto(dataUrl);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to process photo",
            );
        } finally {
            setIsProcessing(false);
        }
    }, [setPhoto]);

    const handleRemove = useCallback(() => {
        setPhoto(null);
        setError(null);
    }, [setPhoto]);

    return {
        photo: draft.photo,
        isProcessing,
        error,
        handleCapture,
        handleRemove,
    };
}
