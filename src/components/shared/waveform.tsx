"use client";

import { useEffect, useRef } from "react";
import { VOICE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WaveformProps {
    /** The AnalyserNode from the audio layer. null when not recording. */
    analyserNode: AnalyserNode | null;
    /** Whether the waveform is actively recording. */
    isActive: boolean;
    className?: string;
}

/**
 * Real-time audio waveform visualization using canvas.
 *
 * Reads frequency data from an AnalyserNode in a requestAnimationFrame
 * loop and draws centered vertical bars. Bars grow from the center
 * for a professional recorder aesthetic.
 */
export function Waveform({ analyserNode, isActive, className }: WaveformProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserNode || !isActive) {
            // Clear the canvas when not active
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const step = Math.floor(bufferLength / VOICE_CONFIG.BAR_COUNT);

        // Set canvas resolution to match display size
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const drawWidth = rect.width;
        const drawHeight = rect.height;
        const barWidth =
            (drawWidth - VOICE_CONFIG.BAR_GAP * (VOICE_CONFIG.BAR_COUNT - 1)) /
            VOICE_CONFIG.BAR_COUNT;
        const centerY = drawHeight / 2;

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyserNode.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, drawWidth, drawHeight);

            for (let i = 0; i < VOICE_CONFIG.BAR_COUNT; i++) {
                const value = dataArray[i * step] / 255;
                const barHeight = Math.max(
                    VOICE_CONFIG.MIN_BAR_HEIGHT,
                    value * (drawHeight * 0.8),
                );
                const x = i * (barWidth + VOICE_CONFIG.BAR_GAP);
                const y = centerY - barHeight / 2;

                // Gradient from rose-400 to rose-500
                const opacity = 0.5 + value * 0.5;
                ctx.fillStyle = `rgba(244, 63, 94, ${opacity})`;
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
                ctx.fill();
            }
        };

        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [analyserNode, isActive]);

    return <canvas ref={canvasRef} className={cn("h-16 w-full", className)} />;
}
