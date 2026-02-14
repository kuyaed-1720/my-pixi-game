import { Entity, type AnimationMap } from "./Entity";
import { InputManager } from "./InputManager";
import type { IEntityStats } from "./types";

export class Player extends Entity {
    private input: InputManager;
    private velocity = { x: 0, y: 0 };

    constructor(animations: AnimationMap, stats: IEntityStats) {
        super(animations, stats);
        this.input = new InputManager();
    }

    public update(deltaTime: number) {
        // For debug
        this.drawHitbox(0x00ff00);
        const dt = Math.min(deltaTime, 0.1);
        if (this.damageCooldown > 0) {
            this.damageCooldown -= dt;

            if (this.damageCooldown <= 0) {
                this.sprite.tint = 0xffffff;
            }
        }

        // Check for attack input
        if (this.input.isAttacking && !this.isAttacking) {
            this.isAttacking = true;
            this.attack();
        }

        // Calculate current max speed base on current sprinting state
        const dir = this.input.direction;
        const sprintMultiplier = this.input.isSprinting && !this.input.isAttacking ? 1.5 : 1.0;
        const slowMultiplier = this.input.isAttacking && !this.input.isSprinting ? 0.5 : 1.0;
        const currentMaxSpeed = this.stats['speed'] * sprintMultiplier * slowMultiplier;

        // Calculate target velocity based on input
        let target = { x: 0, y: 0 };
        const length = Math.sqrt(dir.x ** 2 + dir.y ** 2);
        if (length > 0) {
            target = {
                x: (dir.x / length) * currentMaxSpeed,
                y: (dir.y / length) * currentMaxSpeed
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
        const speedLimit = this.stats['speed'] * 2;
        this.velocity.x = Math.max(-speedLimit, Math.min(speedLimit, this.velocity.x));
        this.velocity.y = Math.max(-speedLimit, Math.min(speedLimit, this.velocity.y));

        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;

        this.handleAnimations(dir);
    }

    private handleAnimations(dir: { x: number, y: number }) {
        if (this.isAttacking) return;

        if (dir.x !== 0 || dir.y !== 0) {
            this.playAnimation('walk');
            this.sprite.scale.x = dir.x > 0 ? 4 : -4;
        } else {
            this.playAnimation('idle');
        }
    }

    public getPlayerSummary() {
        return `
            (location) x: ${this.x.toFixed(2)} | y: ${this.y.toFixed(2)}<br>
            (velocity) x: ${this.velocity.x.toFixed(2)} | y: ${this.velocity.y.toFixed(2)}<br>
            (dimensions) w: ${this.width} | h: ${this.height}<br>
            state: ${this.state}<br>
            isAttacking: ${this.isAttacking}<br>
            health: ${this.stats['hp']}<br>
        `;
    }

    private attack() {
        this.playAnimation('hit', false);

        this.sprite.onComplete = () => {
            this.isAttacking = false;
            this.playAnimation('idle');
        };
    }
}
