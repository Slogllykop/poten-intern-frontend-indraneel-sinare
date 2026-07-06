/**
 * Web Speech API abstraction layer.
 *
 * Key details:
 * - Chrome sends audio to Google servers for processing (requires internet)
 * - Uses continuous mode + interim results for live transcription
 * - Handles webkit prefix for older browsers
 * - Maps locales to BCP 47 tags (en-IN, hi-IN)
 */

export interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

export interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult:
        | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
        | null;
    onerror:
        | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
        | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
    new (): SpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }
}

/** Map raw error codes to user-friendly translation keys. */
export function getErrorTranslationKey(error: string): string {
    switch (error) {
        case "not-allowed":
            return "details.voiceErrorPermission";
        case "network":
            return "details.voiceErrorNetwork";
        case "audio-capture":
            return "details.voiceErrorNoMic";
        case "service-not-available":
            return "details.voiceErrorService";
        default:
            return "details.voiceError";
    }
}

/** Check if the browser supports the Web Speech API. */
export function isSpeechSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export interface SpeechCallbacks {
    onFinalResult: (transcript: string) => void;
    onInterimResult: (transcript: string) => void;
    onError: (errorCode: string) => void;
    onEnd: () => void;
}

/**
 * Creates a SpeechRecognition instance configured for continuous,
 * live transcription with interim results.
 */
export function createRecognition(
    locale: "en" | "hi",
    callbacks: SpeechCallbacks,
): SpeechRecognition | null {
    if (!isSpeechSupported()) return null;

    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return null;

    const recognition = new Ctor();

    recognition.lang = locale === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        console.log("Recognition result");
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
                finalTranscript += result[0].transcript;
            } else {
                interimTranscript += result[0].transcript;
            }
        }

        if (finalTranscript) {
            callbacks.onFinalResult(finalTranscript);
        }
        if (interimTranscript) {
            callbacks.onInterimResult(interimTranscript);
        }
    };

    recognition.onerror = (event) => {
        if (event.error === "no-speech") return;
        callbacks.onError(event.error);
        console.log("Recognition error");
    };

    recognition.onend = () => {
        console.log("Recognition ended");
        callbacks.onEnd();
    };

    return recognition;
}

/** Start listening. Swallows "already started" errors. */
export function startListening(recognition: SpeechRecognition): void {
    try {
        recognition.start();
    } catch {
        // Ignore "already started"
    }
}

/** Stop listening immediately. */
export function stopListening(recognition: SpeechRecognition): void {
    try {
        recognition.stop();
    } catch {
        // Ignore
    }
}
