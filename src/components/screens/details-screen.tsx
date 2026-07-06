"use client";

import {
    IconCamera,
    IconLoader2,
    IconMicrophone,
    IconMicrophoneOff,
    IconX,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Waveform } from "@/components/shared/waveform";
import { Button } from "@/components/ui/button";
import { useStepNavigation } from "@/hooks/step-context";
import { useCamera } from "@/hooks/use-camera";
import { useSubmission } from "@/hooks/use-submission";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useLanguage } from "@/i18n";
import type { TranslationKeys } from "@/i18n/translations/en";
import { cn } from "@/lib/utils";

const MIN_DESCRIPTION_LENGTH = 10;

/** Feature flag: set to false while voice recognition is being debugged/tested */
const ENABLE_VOICE_RECOGNITION = false;

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

/** Pulsing microphone button with listening state and live waveform */
function VoiceInputButton() {
    const { t } = useLanguage();
    const {
        voiceState,
        voiceErrorKey,
        interimText,
        analyserNode,
        toggleListening,
        isSupported,
        isListening,
    } = useVoiceInput();

    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mql.matches);
        const handler = (e: MediaQueryListEvent) =>
            setPrefersReducedMotion(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    const label = useMemo(() => {
        if (!isSupported) return t("details.voiceUnsupported");
        if (isListening) return t("details.voiceListening");
        if (voiceState === "error") {
            return t(
                (voiceErrorKey as TranslationKeys) || "details.voiceError",
            );
        }
        return t("details.voiceStart");
    }, [isSupported, isListening, voiceState, voiceErrorKey, t]);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-4">
            <div className="flex items-center gap-3">
                <motion.button
                    type="button"
                    onClick={toggleListening}
                    disabled={!isSupported}
                    animate={
                        isListening && !prefersReducedMotion
                            ? { scale: [1, 1.15, 1] }
                            : { scale: 1 }
                    }
                    transition={
                        isListening
                            ? {
                                  duration: 1.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut",
                              }
                            : undefined
                    }
                    className={cn(
                        "flex size-12 items-center justify-center rounded-full transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isListening
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                            : isSupported
                              ? "bg-muted text-muted-foreground hover:bg-accent"
                              : "cursor-not-allowed bg-muted/50 text-muted-foreground/50",
                    )}
                    aria-label={
                        isListening
                            ? t("a11y.voiceInputActive")
                            : t("details.voiceLabel")
                    }
                >
                    {isListening ? (
                        <IconMicrophoneOff size="1.25rem" strokeWidth={1.75} />
                    ) : (
                        <IconMicrophone size="1.25rem" strokeWidth={1.75} />
                    )}
                </motion.button>
                <div className="flex flex-1 flex-col">
                    <span
                        className={cn(
                            "font-medium text-sm",
                            isListening
                                ? "text-rose-500"
                                : voiceState === "error"
                                  ? "text-destructive"
                                  : "text-foreground",
                        )}
                    >
                        {label}
                    </span>
                    {interimText && isListening && (
                        <span className="line-clamp-1 text-muted-foreground text-xs italic">
                            {interimText}...
                        </span>
                    )}
                </div>
                {/* Static recording dot for reduced-motion users */}
                {isListening && prefersReducedMotion && (
                    <span className="inline-block size-2 animate-pulse rounded-full bg-rose-500" />
                )}
            </div>

            {/* Live waveform visualization when actively recording */}
            {isListening && (
                <div className="mt-1 border-border/40 border-t pt-2">
                    <Waveform
                        analyserNode={analyserNode}
                        isActive={isListening}
                        className="h-12"
                    />
                </div>
            )}
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
                        className="-right-2 -top-2 absolute flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-transform hover:scale-110"
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

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const charCount = draft.description.length;
    const isValid = charCount >= MIN_DESCRIPTION_LENGTH;

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
                <label
                    htmlFor="issue-description"
                    className="block font-medium text-sm"
                >
                    {t("details.descriptionLabel")}
                </label>
                <textarea
                    ref={textareaRef}
                    id="issue-description"
                    value={draft.description}
                    onChange={handleTextChange}
                    placeholder={t("details.descriptionPlaceholder")}
                    rows={4}
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
                <div className="flex items-center justify-between">
                    {!isValid && charCount > 0 && (
                        <p className="text-destructive text-xs">
                            {t("details.minChars")}
                        </p>
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

            {/* Voice input - controlled via feature flag */}
            {ENABLE_VOICE_RECOGNITION && <VoiceInputButton />}

            {/* Photo capture */}
            <PhotoCapture />

            {submitError && (
                <p className="text-destructive text-xs">{submitError}</p>
            )}

            {/* Navigation */}
            <div className="mt-auto flex gap-3 pt-4">
                <Button
                    type="button"
                    onClick={goBack}
                    variant="outline"
                    size="lg"
                    className="flex-1 touch-manipulation"
                    disabled={isSubmitting}
                >
                    {t("nav.back")}
                </Button>
                <Button
                    type="button"
                    onClick={submit}
                    size="lg"
                    className="flex-1 touch-manipulation gap-2"
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
