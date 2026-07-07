"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Idle bar heights for the 5-bar waveform */
const IDLE_HEIGHTS = ["0.35rem", "0.5rem", "0.75rem", "0.5rem", "0.35rem"];

/** Sensitivity multipliers: middle bar is highly sensitive, outer bars are capped */
const MULTIPLIERS = [0.2, 0.65, 1.25, 0.65, 0.2];

/** Dynamic range caps per bar position */
const CAPS = [0.15, 0.5, 1.25, 0.5, 0.15];

/**
 * Mini 5-bar reactive audio waveform.
 * Renders an animated equalizer driven by a Web Audio AnalyserNode.
 * Falls back to idle heights when inactive.
 */
export function MiniWaveform({
    analyserNode,
    isActive,
}: {
    analyserNode: AnalyserNode | null;
    isActive: boolean;
}) {
    const barRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!analyserNode || !isActive) {
            for (let i = 0; i < 5; i++) {
                const bar = barRefs.current[i];
                if (bar) bar.style.height = IDLE_HEIGHTS[i];
            }
            return;
        }

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let animationFrameId: number;

        const updateBars = () => {
            analyserNode.getByteFrequencyData(dataArray);

            for (let i = 0; i < 5; i++) {
                const bar = barRefs.current[i];
                if (bar) {
                    // Read the lowest 5 frequency bins directly (main voice spectrum)
                    const rawValue = dataArray[i] / 255;
                    const scaledValue = rawValue * MULTIPLIERS[i];

                    // Set height in rem: min 0.25rem.
                    const height = 0.25 + Math.min(scaledValue, 1.0) * CAPS[i];
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
                    style={{ height: IDLE_HEIGHTS[i] }}
                />
            ))}
        </div>
    );
}
