"use client";

import { standardSchemaResolver as zodResolver } from "@hookform/resolvers/standard-schema";
import { IconLoader2 } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useStepNavigation } from "@/hooks/step-context";
import { useOfflineSync } from "@/hooks/use-offline-sync";
import { useSubmission } from "@/hooks/use-submission";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useLanguage } from "@/i18n";
import type { TranslationKeys } from "@/i18n/translations/en";
import { VOICE_CONFIG } from "@/lib/constants";
import {
    type DetailsFormValues,
    detailsFormSchema,
} from "@/lib/submission-schema";
import { cn } from "@/lib/utils";
import { PhotoCapture } from "./details/photo-capture";
import { SelectedCategoryBadge } from "./details/selected-category-badge";
import { VoiceControlPod } from "./details/voice-control-pod";

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

    // react-hook-form with Zod validation
    const {
        register,
        formState: { isValid, errors },
        watch,
        setValue,
    } = useForm<DetailsFormValues>({
        resolver: zodResolver(detailsFormSchema),
        defaultValues: {
            description: draft.description,
            photo: draft.photo,
        },
        mode: "onChange",
    });

    const description = watch("description");
    const charCount = description.length;
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Sync RHF value back to step context on every keystroke
    useEffect(() => {
        setDescription(description);
    }, [description, setDescription]);

    // When voice input appends text, sync it into RHF
    useEffect(() => {
        if (draft.description !== description) {
            setValue("description", draft.description, {
                shouldValidate: true,
            });
        }
    }, [draft.description, description, setValue]);

    // Register the textarea with RHF and merge the ref
    const { ref: rhfRef, ...registerRest } = register("description");

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
                        <VoiceControlPod
                            analyserNode={analyserNode}
                            isListening={isListening}
                            isMicDisabled={isMicDisabled}
                            toggleListening={toggleListening}
                        />
                    )}
                </div>

                <textarea
                    {...registerRest}
                    ref={(el) => {
                        rhfRef(el);
                        textareaRef.current = el;
                    }}
                    id="issue-description"
                    placeholder={t("details.descriptionPlaceholder")}
                    rows={5}
                    maxLength={2000}
                    className={cn(
                        "max-h-100 min-h-36 w-full resize-y rounded-xl border bg-card px-3.5 py-3",
                        "text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/60",
                        "shadow-2xs transition-all duration-200",
                        "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        errors.description
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
                    ) : errors.description && charCount > 0 ? (
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
