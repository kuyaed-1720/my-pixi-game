export class InputManager {
    private keys: Record<string, boolean> = {};

    constructor() {
        window.addEventListener("keydown", (e) => this.keys[e.code] = true);
        window.addEventListener("keyup", (e) => this.keys[e.code] = false);
    }

    public get direction() {
        const x = Number(this.keys['ArrowRight'] || this.keys['KeyD'] || 0) - Number(this.keys['ArrowLeft'] || this.keys['KeyA'] || 0);
        const y = Number(this.keys['ArrowDown'] || this.keys['KeyS'] || 0) - Number(this.keys['ArrowUp'] || this.keys['KeyW'] || 0);
        return { x, y };
    }

    public get isSprinting(): boolean {
        return !!(this.keys['Shiftleft'] || this.keys['ShiftRight']);
    }

    public get isAttacking(): boolean {
        return !!(this.keys['Space'] || this.keys['KeyK'] || this.keys['KeyJ']);
    }
}