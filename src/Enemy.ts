import { Entity } from "./Entity";
import type { Player } from "./Player";
import { snapToZero } from "./math";
import type { IEntityStats } from "./types";

export class Enemy extends Entity {
    private target: Player | null = null;
    private chaseRange: number = 300;
    private velocity = { x: 0, y: 0 };

    constructor(animations: any, stats: Partial<IEntityStats>, target: Player) {
        super('enemy', animations, stats);
        this.target = target;
    }

    public update(dt: number) {
        if (!this.target || this.target.isDestroyed || this.isDestroyed) return;
        super.update(dt)

        // Calculate distance to player
        const distanceX = this.target.x - this.x;
        const distanceY = this.target.y - this.y;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        let target = { x: 0, y: 0 };

        // Only chase player if inside range
        if (distance < this.chaseRange && distance > 32) {
            target.x = (distanceX / distance) * this.stats.speed;
            target.y = (distanceY / distance) * this.stats.speed;
            this.playAnimation('walk');
            this.sprite.scale.x = distanceX > 0 ? 4 : -4;
        } else {
            this.playAnimation('idle');
        }

        // Velocity Interpolation
        this.velocity.x += (target.x - this.velocity.x) * this.stats.weight * dt;
        this.velocity.y += (target.y - this.velocity.y) * this.stats.weight * dt;

        // Snap to zero
        if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
        if (Math.abs(this.velocity.y) < 0.01) this.velocity.y = 0;

        // Knockback decay
        if (Math.abs(this.externalForce.x) > 0 || Math.abs(this.externalForce.y) > 0) {
            this.externalForce.x *= 1 - (this.friction * dt);
            this.externalForce.y *= 1 - (this.friction * dt);

            snapToZero(this.externalForce, 0.2);
        }

        // Final position update
        this.x += (this.velocity.x + this.externalForce.x) * dt;
        this.y += (this.velocity.y + this.externalForce.y) * dt;
    }

    public getStats() {
        return this.chaseRange;
    }

    public getEnemySummary() {
        return `
            target: ${this.target}<br>
            chase-range: ${this.chaseRange}<br>
            velocity: (${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)})<br>
            location: (${this.x.toFixed(2)}, ${this.y.toFixed(2)})<br>
            weight: ${this.stats.weight}<br>
            hp: ${this.stats.hp} / ${this.stats.maxHp}<br>
            atk: ${this.stats.atk}<br>
            speed: ${this.stats.speed} (a: ${this.stats.acceleration} | d: ${this.stats.deceleration})<br>
            damage-cd: ${this.getCooldown().toFixed(2)} / ${this.stats.damageCooldown}
        `;
    }
}