/**
 * Web Audio API layer for live microphone waveform analysis.
 *
 * Captures the microphone stream via getUserMedia and connects it
 * to an AnalyserNode for real-time frequency/time-domain data.
 * This runs in parallel with SpeechRecognition (they use separate streams).
 */

export interface AudioAnalysis {
    analyser: AnalyserNode;
    stream: MediaStream;
    cleanup: () => void;
}

/**
 * Starts audio capture and analysis for waveform visualization.
 * The returned AnalyserNode can be read with getByteFrequencyData()
 * inside a requestAnimationFrame loop.
 */
export async function startAudioAnalysis(): Promise<AudioAnalysis> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);

    const cleanup = () => {
        try {
            source.disconnect();
            audioContext.close();
        } catch {
            // Ignore cleanup errors
        }
        for (const track of stream.getTracks()) {
            track.stop();
        }
    };

    return { analyser, stream, cleanup };
}
