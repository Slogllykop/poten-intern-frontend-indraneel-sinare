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
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 font-medium text-primary text-xs shadow-2xs">
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
    const idleHeights = ["0.35rem", "0.5rem", "0.75rem", "0.5rem", "0.35rem"];

    useEffect(() => {
        if (!analyserNode || !isActive) {
            for (let i = 0; i < 5; i++) {
                const bar = barRefs.current[i];
                if (bar) bar.style.height = idleHeights[i];
            }
            return;
        }

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
        <div
            className={cn(
                "flex h-6 items-center gap-1 rounded-md border px-1.5 py-1 transition-all duration-200",
                isActive
                    ? "border-rose-500/30 bg-rose-500/10"
                    : "border-border/40 bg-muted/30 opacity-75",
            )}
        >
            {[...Array(5)].map((_, i) => (
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: children dont change
                    key={i}
                    ref={(el) => {
                        barRefs.current[i] = el;
                    }}
                    className={cn(
                        "w-0.5 rounded-full transition-all duration-75",
                        isActive ? "bg-rose-500" : "bg-primary/70",
                    )}
                    style={{ height: idleHeights[i] }}
                />
            ))}
        </div>
    );
}

/** Photo capture area with thumbnail preview or massive dropper card */
function PhotoCapture() {
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
        <div className="flex flex-1 flex-col gap-6">
            {/* Unified header block with category badge, title, and subtitle */}
            <div className="flex flex-col gap-2.5 border-border/40 border-b pb-5">
                <div>
                    <SelectedCategoryBadge />
                </div>
                <div className="space-y-1">
                    <h2 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
                        {t("details.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {t("details.subtitle")}
                    </p>
                </div>
            </div>

            {/* Description textarea with integrated voice trigger and waveform */}
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                        htmlFor="issue-description"
                        className="block font-semibold text-foreground text-sm"
                    >
                        {t("details.descriptionLabel")}
                    </label>

                    {/* Mic button + waveform visible whenever needed */}
                    {VOICE_CONFIG.ENABLE_VOICE_RECOGNITION && (
                        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 p-1 pl-2 shadow-2xs">
                            <MiniWaveform
                                analyserNode={analyserNode}
                                isActive={isListening}
                            />
                            <button
                                type="button"
                                onClick={toggleListening}
                                disabled={isMicDisabled}
                                className={cn(
                                    "flex cursor-pointer touch-manipulation items-center gap-1.5 rounded-full px-3 py-1 font-medium text-xs transition-all duration-200",
                                    isMicDisabled
                                        ? "cursor-not-allowed bg-muted/50 text-muted-foreground/30"
                                        : isListening
                                          ? "animate-pulse bg-rose-500 text-white shadow-rose-500/25 shadow-xs"
                                          : "bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90",
                                )}
                                aria-label={t("details.voiceLabel")}
                            >
                                {isListening ? (
                                    <>
                                        <IconMicrophoneOff
                                            size="0.875rem"
                                            strokeWidth={2}
                                        />
                                        <span>{t("details.voiceStop")}</span>
                                    </>
                                ) : (
                                    <>
                                        <IconMicrophone
                                            size="0.875rem"
                                            strokeWidth={2}
                                        />
                                        <span>{t("details.voiceLabel")}</span>
                                    </>
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
                    rows={5}
                    maxLength={2000}
                    className={cn(
                        "max-h-100 min-h-36 w-full resize-y rounded-xl border bg-card px-3.5 py-3",
                        "text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/60",
                        "shadow-2xs transition-all duration-200",
                        "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        !isValid && charCount > 0
                            ? "border-destructive/50 focus-visible:border-destructive"
                            : "border-border/80 hover:border-border",
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
                            "ml-auto font-medium text-xs tabular-nums",
                            isValid
                                ? "text-muted-foreground"
                                : "text-destructive",
                        )}
                    >
                        {charCount} / 2000
                    </p>
                </div>
            </div>

            {/* Photo capture dropper */}
            <PhotoCapture />

            {submitError && (
                <p className="text-destructive text-xs">{submitError}</p>
            )}

            {/* Purposeful Navigation Dock */}
            <div className="mt-8 border-border/40 border-t pt-4">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-muted/20 p-3.5 shadow-xs sm:px-5 sm:py-4">
                    <Button
                        type="button"
                        onClick={goBack}
                        variant="outline"
                        size="lg"
                        className="flex-1 cursor-pointer touch-manipulation rounded-xl font-medium shadow-2xs transition-all duration-200 hover:bg-background hover:text-foreground sm:w-36 sm:flex-none"
                        disabled={isSubmitting}
                    >
                        {t("nav.back")}
                    </Button>
                    <Button
                        type="button"
                        onClick={submit}
                        size="lg"
                        className="pointer-hover:hover:-translate-y-0.5 flex-[1.5] cursor-pointer touch-manipulation gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow sm:w-48 sm:flex-none"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting && (
                            <IconLoader2
                                size="1.125rem"
                                strokeWidth={1.75}
                                className="animate-spin"
                            />
                        )}
                        {t("nav.next")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
