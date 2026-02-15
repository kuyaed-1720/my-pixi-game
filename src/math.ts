/**
 * Clean, reusable math utilities for game physics.
 */

import type { IVector2D } from "./types";

/**
 * Snaps vector components to zero if they fall below a certain threshold.
 * This prevents micro-movements and saves CPU styles.
 * @param vector - The vector component to match.
 * @param threshold - A number to compare to the vector. 
 */
export const snapToZero = (vector: IVector2D, threshold: number): void => {
    if (Math.abs(vector.x) < threshold) vector.x = 0;
    if (Math.abs(vector.y) < threshold) vector.y = 0;
}

/**
 * Clamp numbers to a certain limit.
 */
export const clamp = (val: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, val));
}