import type { Application } from "pixi.js";
import { TouchControls } from "./TouchControls";
import type { IVector2D } from "./types";

/**
 * Listens for hardware keyboard events and translates them into game actions.
 */
export class InputManager {
    private keys: Record<string, boolean> = {};
    private touch: TouchControls;

    constructor(app: Application) {
        window.addEventListener("keydown", (e) => this.keys[e.code] = true);
        window.addEventListener("keyup", (e) => this.keys[e.code] = false);

        this.touch = new TouchControls(app);
    }

    /**
     * Calculates the normalized movement direction based on WASD/Arrow keys.
     * @returns {IVector2D} A vector where values range from -1 to 1.
     */
    public get direction(): IVector2D {
        const kx = Number(this.keys['ArrowRight'] || this.keys['KeyD'] || 0)
            - Number(this.keys['ArrowLeft'] || this.keys['KeyA'] || 0);
        const ky = Number(this.keys['ArrowDown'] || this.keys['KeyS'] || 0)
            - Number(this.keys['ArrowUp'] || this.keys['KeyW'] || 0);

        const tx = this.touch.direction.x;
        const ty = this.touch.direction.y;

        const fx = Math.max(-1, Math.min(1, kx + tx));
        const fy = Math.max(-1, Math.min(1, ky + ty));

        return { x: fx, y: fy };
    }

    public resizeTouchControls(width: number, height: number) {
        this.touch.onResize(width, height);
    }

    /** Returns true if either Shift key is currently pressed. */
    public get isSprinting(): boolean {
        return !!(this.keys['Shiftleft'] || this.keys['ShiftRight']);
    }

    /** Retruns true if Space or the 'K/J' keys are pressed for attacking. */
    public get isAttacking(): boolean {
        return !!(this.keys['Space'] || this.keys['KeyK'] || this.keys['KeyJ'] || this.touch.isAttacking);
    }
}