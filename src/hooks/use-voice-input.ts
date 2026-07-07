import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n";
import { type AudioAnalysis, startAudioAnalysis } from "@/layers/audio";
import {
    createRecognition,
    getErrorTranslationKey,
    isSpeechSupported,
    type SpeechRecognition,
    startListening,
    stopListening,
} from "@/layers/speech";
import { useStepNavigation } from "./step-context";

export type VoiceState = "idle" | "listening" | "error" | "unsupported";

/**
 * Combined voice input hook.
 *
 * Manages:
 * 1. SpeechRecognition (continuous mode with interim results)
 * 2. AudioContext + AnalyserNode (for live waveform visualization)
 *
 * Both start and stop together. The AnalyserNode is exposed so the
 * Waveform component can read frequency data in a rAF loop.
 */
export function useVoiceInput(onTranscript?: (text: string) => void) {
    const { locale } = useLanguage();
    const { draft, setDescription } = useStepNavigation();

    const [state, setState] = useState<VoiceState>(() =>
        typeof window !== "undefined" && isSpeechSupported()
            ? "idle"
            : "unsupported",
    );
    const [errorKey, setErrorKey] = useState<string | null>(null);
    const [interimText, setInterimText] = useState("");
    const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioRef = useRef<AudioAnalysis | null>(null);
    // Ref to track draft.description without stale closures
    const descriptionRef = useRef(draft.description);
    descriptionRef.current = draft.description;

    const cleanup = useCallback(() => {
        if (recognitionRef.current) {
            stopListening(recognitionRef.current);
            recognitionRef.current = null;
        }
        if (audioRef.current) {
            audioRef.current.cleanup();
            audioRef.current = null;
        }
        setAnalyserNode(null);
        setInterimText("");
    }, []);

    const stopRecording = useCallback(() => {
        setState("idle");
        cleanup();
    }, [cleanup]);

    const startRecording = useCallback(async () => {
        setErrorKey(null);
        setState("listening");

        // 1. Start audio analysis for waveform
        try {
            const audio = await startAudioAnalysis();
            audioRef.current = audio;
            setAnalyserNode(audio.analyser);
        } catch {
            // getUserMedia failed (permission denied or no mic)
            setState("error");
            setErrorKey("details.voiceErrorPermission");
            return;
        }

        // 2. Start speech recognition
        const recognition = createRecognition(locale, {
            onFinalResult: (transcript) => {
                // Append finalized text to the description
                const current = descriptionRef.current;
                const separator = current && !current.endsWith(" ") ? " " : "";
                const newText = current + separator + transcript;
                setDescription(newText);
                if (onTranscript) {
                    onTranscript(newText);
                }
                setInterimText("");
            },
            onInterimResult: (transcript) => {
                setInterimText(transcript);
            },
            onError: (errorCode) => {
                setState("error");
                setErrorKey(getErrorTranslationKey(errorCode));
                cleanup();
            },
            onEnd: () => {
                // Continuous mode: recognition may end unexpectedly.
                // If we're still in "listening" state, restart it.
                if (recognitionRef.current) {
                    try {
                        recognitionRef.current.start();
                    } catch {
                        setState("idle");
                        cleanup();
                    }
                }
            },
        });

        if (!recognition) {
            setState("unsupported");
            cleanup();
            return;
        }

        recognitionRef.current = recognition;
        startListening(recognition);
    }, [locale, setDescription, cleanup, onTranscript]);

    const toggleListening = useCallback(() => {
        if (state === "unsupported") return;
        if (state === "listening") {
            stopRecording();
        } else {
            startRecording();
        }
    }, [state, startRecording, stopRecording]);

    // Cleanup on unmount
    useEffect(() => cleanup, [cleanup]);

    return {
        voiceState: state,
        voiceErrorKey: errorKey,
        interimText,
        analyserNode,
        toggleListening,
        isSupported: state !== "unsupported",
        isListening: state === "listening",
    };
}
