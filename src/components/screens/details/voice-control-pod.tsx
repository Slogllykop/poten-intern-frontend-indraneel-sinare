"use client";

import { IconMicrophone, IconMicrophoneOff } from "@tabler/icons-react";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";
import { MiniWaveform } from "./mini-waveform";

/**
 * Voice control pod: waveform + mic toggle button.
 * Displayed next to the description label in the Details screen.
 */
export function VoiceControlPod({
    analyserNode,
    isListening,
    isMicDisabled,
    toggleListening,
}: {
    analyserNode: AnalyserNode | null;
    isListening: boolean;
    isMicDisabled: boolean;
    toggleListening: () => void;
}) {
    const { t } = useLanguage();

    return (
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 p-1 pl-2 shadow-2xs">
            <MiniWaveform analyserNode={analyserNode} isActive={isListening} />
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
                        <IconMicrophoneOff size="0.875rem" strokeWidth={2} />
                        <span>{t("details.voiceStop")}</span>
                    </>
                ) : (
                    <>
                        <IconMicrophone size="0.875rem" strokeWidth={2} />
                        <span>{t("details.voiceLabel")}</span>
                    </>
                )}
            </button>
        </div>
    );
}
