import { Entity, type AnimationMap } from "./Entity";
import { InputManager } from "./InputManager";
import type { IEntityStats } from "./types/entityStats";

export class Player extends Entity {
    private input: InputManager;
    private velocity = { x: 0, y: 0 };

    constructor(animations: AnimationMap, stats: IEntityStats) {
        super(animations, stats);
        this.input = new InputManager();
    }

    public update(deltaTime: number) {
        const dt = Math.min(deltaTime, 0.1);
        const dir = this.input.direction;

        // Calculate target velocity based on input
        let target = { x: 0, y: 0 };
        const length = Math.sqrt(dir.x ** 2 + dir.y ** 2);
        if (length > 0) {
            target = {
                x: (dir.x / length) * this.stats['speed'],
                y: (dir.y / length) * this.stats['speed']
            };
        }

        // Add acceleration or deceleration
        const weight = length > 0 ? this.stats['acceleration'] : this.stats['deceleration'];

        // Velocity Interpolation
        this.velocity.x += (target.x - this.velocity.x) * weight * dt;
        this.velocity.y += (target.y - this.velocity.y) * weight * dt;

        // Snap to zero
        if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
        if (Math.abs(this.velocity.y) < 0.01) this.velocity.y = 0;

        // Clamp the velocity to avoid exceeding from max speed
        const max = this.stats['speed'] * 2;
        this.velocity.x = Math.max(-max, Math.min(max, this.velocity.x));
        this.velocity.y = Math.max(-max, Math.min(max, this.velocity.y));

        this.sprite.x += this.velocity.x * dt;
        this.sprite.y += this.velocity.y * dt;

        // Handle sprite flipping
        if (dir.x !== 0) this.sprite.scale.x = dir.x > 0 ? 4 : -4;

        // Play animation
        if (this.isAttacking) {
            this.attack();
        } else if (dir.x !== 0 || dir.y !== 0) {
            this.playAnimation('walk');
        } else {
            this.playAnimation('idle');
        }
    }

    public getPlayerSummary() {
        return `
            (location) x: ${this.sprite.x.toFixed(2)} | y: ${this.sprite.y.toFixed(2)}<br>
            (velocity) x: ${this.velocity.x.toFixed(2)} | y: ${this.velocity.y.toFixed(2)}<br>
            state: ${this.state}<br>
            isAttacking: ${this.isAttacking}<br>
        `;
    }

    private attack() {
        // if (this.isAttacking) return;

        // this.isAttacking = true;
        this.playAnimation('hit', false);

        this.sprite.onComplete = () => {
            this.isAttacking = false;
            this.playAnimation('idle');
        };
    }
}
