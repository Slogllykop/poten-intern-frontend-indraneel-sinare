"use client";

import {
    IconCamera,
    IconLoader2,
    IconMicrophone,
    IconMicrophoneOff,
    IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useStepNavigation } from "@/hooks/step-context";
import { useCamera } from "@/hooks/use-camera";
import { useOfflineSync } from "@/hooks/use-offline-sync";
import { useSubmission } from "@/hooks/use-submission";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useLanguage } from "@/i18n";
import type { TranslationKeys } from "@/i18n/translations/en";
import { VOICE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Category badge at the top showing what was selected in Screen 1 */
function SelectedCategoryBadge() {
    const { t } = useLanguage();
    const { draft } = useStepNavigation();

    if (!draft.category) return null;

    const labelKey = `category.${draft.category}` as TranslationKeys;

    return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs">
            <span className="text-muted-foreground">
                {t("details.selectedCategory")}:
            </span>
            <span>{t(labelKey)}</span>
        </div>
    );
}

/** Mini 5-bar reactive audio waveform */
function MiniWaveform({
    analyserNode,
    isActive,
}: {
    analyserNode: AnalyserNode | null;
    isActive: boolean;
}) {
    const barRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!analyserNode || !isActive) return;

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Sensitivity multipliers: middle bar is highly sensitive, outer bars are capped
        const multipliers = [0.2, 0.65, 1.25, 0.65, 0.2];

        let animationFrameId: number;

        const updateBars = () => {
            analyserNode.getByteFrequencyData(dataArray);

            for (let i = 0; i < 5; i++) {
                const bar = barRefs.current[i];
                if (bar) {
                    // Read the lowest 5 frequency bins directly (main voice spectrum)
                    const rawValue = dataArray[i] / 255;
                    const scaledValue = rawValue * multipliers[i];

                    // Set height in rem: min 0.25rem (4px).
                    // Dynamic range caps: middle bar can reach 1.5rem (24px), outer ones are restricted to 0.75rem and 0.4rem.
                    const cap =
                        i === 2 ? 1.25 : i === 1 || i === 3 ? 0.5 : 0.15;
                    const height = 0.25 + Math.min(scaledValue, 1.0) * cap;

                    bar.style.height = `${height}rem`;
                }
            }

            animationFrameId = requestAnimationFrame(updateBars);
        };

        updateBars();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [analyserNode, isActive]);

    return (
        <div className="flex h-6 items-center gap-1.5 rounded-lg border border-border/20 bg-muted/40 px-1.5 py-1">
            {[...Array(5)].map((_, i) => (
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: children dont change
                    key={i}
                    ref={(el) => {
                        barRefs.current[i] = el;
                    }}
                    className="w-0.5 rounded-full bg-primary transition-all duration-75"
                    style={{ height: "0.25rem" }}
                />
            ))}
        </div>
    );
}

/** Photo capture area with thumbnail preview */
function PhotoCapture() {
    const { t } = useLanguage();
    const { photo, isProcessing, error, handleCapture, handleRemove } =
        useCamera();

    return (
        <div className="space-y-2">
            <p className="font-medium text-sm">{t("details.photoLabel")}</p>
            <p className="text-muted-foreground text-xs">
                {t("details.photoHint")}
            </p>

            {photo ? (
                <div className="relative w-fit">
                    {/* biome-ignore lint/performance/noImgElement: base64 data URL preview, next/image is not suitable */}
                    <img
                        src={photo}
                        alt={t("a11y.photoPreview")}
                        className="h-32 w-auto rounded-lg border border-border object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="-right-2 -top-2 before:-inset-3 absolute flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-transform before:absolute before:content-[''] hover:scale-110"
                        aria-label={t("details.removePhoto")}
                    >
                        <IconX size="0.875rem" strokeWidth={2} />
                    </button>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCapture}
                    disabled={isProcessing}
                    className="touch-manipulation gap-2"
                >
                    {isProcessing ? (
                        <IconLoader2
                            size="1rem"
                            strokeWidth={1.75}
                            className="animate-spin"
                        />
                    ) : (
                        <IconCamera size="1rem" strokeWidth={1.75} />
                    )}
                    {t("details.photoLabel")}
                </Button>
            )}

            {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
    );
}

/** Main details screen: description + voice + photo + navigation */
export function DetailsScreen() {
    const { t } = useLanguage();
    const { draft, setDescription, goBack } = useStepNavigation();
    const { submit, isSubmitting, error: submitError } = useSubmission();
    const { isOnline } = useOfflineSync();
    const {
        voiceState,
        voiceErrorKey,
        interimText,
        analyserNode,
        toggleListening,
        isSupported,
        isListening,
    } = useVoiceInput();

    const isMicDisabled = !isSupported || !isOnline;

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const charCount = draft.description.length;
    const isValid = charCount >= VOICE_CONFIG.MIN_DESCRIPTION_LENGTH;

    const handleTextChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setDescription(e.target.value);
        },
        [setDescription],
    );

    return (
        <div className="flex flex-1 flex-col gap-5">
            <div>
                <h2 className="font-semibold text-xl tracking-tight">
                    {t("details.title")}
                </h2>
                <p className="mt-1 text-muted-foreground text-sm">
                    {t("details.subtitle")}
                </p>
            </div>

            <SelectedCategoryBadge />

            {/* Description textarea */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="issue-description"
                        className="block font-medium text-foreground/90 text-sm"
                    >
                        {t("details.descriptionLabel")}
                    </label>

                    {/* Mic button + mini responsive waveform next to description label */}
                    {VOICE_CONFIG.ENABLE_VOICE_RECOGNITION && (
                        <div className="flex items-center gap-2">
                            {isListening && (
                                <MiniWaveform
                                    analyserNode={analyserNode}
                                    isActive={isListening}
                                />
                            )}
                            <button
                                type="button"
                                onClick={toggleListening}
                                disabled={isMicDisabled}
                                className={cn(
                                    "flex size-7 items-center justify-center rounded-full transition-all duration-200",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    "cursor-pointer touch-manipulation",
                                    isMicDisabled
                                        ? "cursor-not-allowed border border-border/10 bg-muted/50 text-muted-foreground/30"
                                        : isListening
                                          ? "animate-pulse bg-rose-500 text-white shadow-rose-500/25 shadow-sm"
                                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
                                )}
                                aria-label={t("details.voiceLabel")}
                            >
                                {isListening ? (
                                    <IconMicrophoneOff
                                        size="0.875rem"
                                        strokeWidth={2}
                                    />
                                ) : (
                                    <IconMicrophone
                                        size="0.875rem"
                                        strokeWidth={2}
                                    />
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <textarea
                    ref={textareaRef}
                    id="issue-description"
                    value={draft.description}
                    onChange={handleTextChange}
                    placeholder={t("details.descriptionPlaceholder")}
                    rows={4}
                    maxLength={2000}
                    className={cn(
                        "w-full resize-none rounded-lg border bg-card px-3 py-2.5",
                        "text-foreground text-sm placeholder:text-muted-foreground/60",
                        "transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        !isValid && charCount > 0
                            ? "border-destructive/50"
                            : "border-border",
                    )}
                />

                <div className="flex min-h-5 items-center justify-between">
                    {!isOnline ? (
                        <p className="text-destructive text-xs">
                            {t("details.voiceErrorNetwork")}
                        </p>
                    ) : voiceState === "error" && voiceErrorKey ? (
                        <p className="text-destructive text-xs">
                            {t(voiceErrorKey as TranslationKeys)}
                        </p>
                    ) : isListening && interimText ? (
                        <p className="text-muted-foreground text-xs italic">
                            {interimText}...
                        </p>
                    ) : !isValid && charCount > 0 ? (
                        <p className="text-destructive text-xs">
                            {t("details.minChars")}
                        </p>
                    ) : (
                        <div />
                    )}
                    <p
                        className={cn(
                            "ml-auto text-xs tabular-nums",
                            isValid
                                ? "text-muted-foreground"
                                : "text-destructive",
                        )}
                    >
                        {charCount}
                    </p>
                </div>
            </div>

            {/* Photo capture */}
            <PhotoCapture />

            {submitError && (
                <p className="text-destructive text-xs">{submitError}</p>
            )}

            {/* Navigation */}
            <div className="mt-auto flex gap-3 pt-4 md:justify-end md:gap-4 md:pt-8">
                <Button
                    type="button"
                    onClick={goBack}
                    variant="outline"
                    size="lg"
                    className="pointer-hover:hover:-translate-y-0.5 flex-1 touch-manipulation transition-all duration-200 md:h-12 md:w-36 md:flex-none md:rounded-xl"
                    disabled={isSubmitting}
                >
                    {t("nav.back")}
                </Button>
                <Button
                    type="button"
                    onClick={submit}
                    size="lg"
                    className="pointer-hover:hover:-translate-y-0.5 flex-1 touch-manipulation gap-2 transition-all duration-200 pointer-hover:hover:shadow-lg md:h-12 md:w-48 md:flex-none md:rounded-xl md:font-semibold md:shadow-md"
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting && (
                        <IconLoader2
                            size="1rem"
                            strokeWidth={1.75}
                            className="animate-spin"
                        />
                    )}
                    {t("nav.next")}
                </Button>
            </div>
        </div>
    );
}
