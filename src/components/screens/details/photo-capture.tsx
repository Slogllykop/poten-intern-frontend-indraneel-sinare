"use client";

import { IconCamera, IconLoader2, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/use-camera";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Photo capture area with two visual states:
 * - Empty: large dashed dropper card inviting the user to add a photo
 * - Filled: card with thumbnail preview, reupload, and remove actions
 */
export function PhotoCapture() {
    const { t } = useLanguage();
    const { photo, isProcessing, error, handleCapture, handleRemove } =
        useCamera();

    return (
        <div className="space-y-2.5">
            {photo ? (
                <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-3 shadow-xs transition-all">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        {/* biome-ignore lint/performance/noImgElement: base64 data URL preview, next/image is not suitable */}
                        <img
                            src={photo}
                            alt={t("a11y.photoPreview")}
                            className="h-44 w-full rounded-xl border border-border/40 object-cover shadow-2xs sm:w-64"
                        />
                        <div className="flex flex-1 flex-col justify-between gap-3 self-stretch py-1">
                            <div>
                                <p className="font-semibold text-foreground text-sm">
                                    {t("confirmation.photo")}
                                </p>
                                <p className="mt-0.5 text-muted-foreground text-xs">
                                    {t("details.photoHint")}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCapture}
                                    disabled={isProcessing}
                                    className="cursor-pointer touch-manipulation gap-1.5 rounded-xl font-medium text-xs"
                                >
                                    <IconCamera
                                        size="0.875rem"
                                        strokeWidth={1.75}
                                    />
                                    {t("details.reuploadPhoto")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleRemove}
                                    className="cursor-pointer touch-manipulation gap-1.5 rounded-xl font-medium text-xs"
                                >
                                    <IconX size="0.875rem" strokeWidth={1.75} />
                                    {t("details.removePhoto")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleCapture}
                    disabled={isProcessing}
                    className={cn(
                        "group relative flex w-full cursor-pointer touch-manipulation flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isProcessing
                            ? "cursor-wait border-primary/40 bg-primary/5"
                            : "border-border/60 bg-muted/20 hover:border-primary/60 hover:bg-muted/40 hover:shadow-2xs",
                    )}
                >
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary shadow-2xs transition-transform duration-200 group-hover:scale-110 group-hover:bg-primary/15">
                        {isProcessing ? (
                            <IconLoader2
                                size="1.75rem"
                                strokeWidth={1.75}
                                className="animate-spin"
                            />
                        ) : (
                            <IconCamera size="1.75rem" strokeWidth={1.75} />
                        )}
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold text-base text-foreground transition-colors group-hover:text-primary">
                            {t("details.photoLabel")}
                        </p>
                        <p className="mx-auto max-w-xs text-muted-foreground text-xs">
                            {t("details.photoHint")}
                        </p>
                    </div>
                </button>
            )}

            {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
    );
}
