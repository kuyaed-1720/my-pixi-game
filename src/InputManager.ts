import type { IVector2D } from "./types";

/**
 * Listens for hardware keyboard events and translates them into game actions.
 */
export class InputManager {
    private keys: Record<string, boolean> = {};

    constructor() {
        window.addEventListener("keydown", (e) => this.keys[e.code] = true);
        window.addEventListener("keyup", (e) => this.keys[e.code] = false);
    }

    /**
     * Calculates the normalized movement direction based on WASD/Arrow keys.
     * @returns {IVector2D} A vector where values range from -1 to 1.
     */
    public get direction(): IVector2D {
        const x = Number(this.keys['ArrowRight'] || this.keys['KeyD'] || 0)
            - Number(this.keys['ArrowLeft'] || this.keys['KeyA'] || 0);
        const y = Number(this.keys['ArrowDown'] || this.keys['KeyS'] || 0)
            - Number(this.keys['ArrowUp'] || this.keys['KeyW'] || 0);
        return { x, y };
    }

    /** Returns true if either Shift key is currently pressed. */
    public get isSprinting(): boolean {
        return !!(this.keys['Shiftleft'] || this.keys['ShiftRight']);
    }

    /** Retruns true if Space or the 'K/J' keys are pressed for attacking. */
    public get isAttacking(): boolean {
        return !!(this.keys['Space'] || this.keys['KeyK'] || this.keys['KeyJ']);
    }
}