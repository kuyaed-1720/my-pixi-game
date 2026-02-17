import { Entity, type AnimationMap } from "./Entity";
import { Collision } from "./Collision";
import { InputManager } from "./InputManager";
import { snapToZero } from "./math";
import type { IEntityStats, IVector2D } from "./types";

/**
 * The main player-controlled character.
 * Handles input processing,p physics interpolation, and state-based animations.
 */
export class Player extends Entity {
    private input: InputManager;
    private velocity: IVector2D = { x: 0, y: 0 };

    private readonly ATTACK_SLOW_MULTIPLIER: number = 0.5;
    private readonly ATK_RADIUS: number = 48;
    private readonly ATK_OFFSET: number = 80;
    private readonly VELOCITY_THRESHOLD: number = 0.1;
    private hitEnemies: Set<Entity> = new Set();

    constructor(animations: AnimationMap, stats: Partial<IEntityStats>) {
        super('player', animations, stats);
        this.input = new InputManager();
    }

    /**
     * Updates player physics and animations every frame.
     * @param deltaTime - Time elapsed since last frame.
     */
    public update(deltaTime: number): void {
        super.update(deltaTime);
        const dt = Math.min(deltaTime, 0.1);

        this.applyMovementPhysics(dt);
    }

    public handleAttack(enemies: Entity[]) {
        if (this.input.isAttacking && !this.isAttacking) {
            this.performAttack(enemies);
        }
    }

    /**
     * Calculates velocity using interpolation for smooth acceleration and friction.
     */
    private applyMovementPhysics(dt: number): void {
        const dir = this.input.direction;

        const canSprint = this.input.isSprinting && !this.isAttacking;
        const sprintMultiplier = canSprint ? 1.5 : 1.0;

        const slowMultiplier = this.isAttacking ? this.ATTACK_SLOW_MULTIPLIER : 1.0;
        const currentMaxSpeed = this.stats['speed'] * sprintMultiplier * slowMultiplier;

        // Calculate target velocity
        const target = { x: 0, y: 0 };
        const length = Math.sqrt(dir.x ** 2 + dir.y ** 2);
        if (length > 0) {
            target.x = (dir.x / length) * currentMaxSpeed;
            target.y = (dir.y / length) * currentMaxSpeed;
        }

        // Apply acceleration or deceleration
        const weight = length > 0 ? this.stats['acceleration'] : this.stats['deceleration'];

        // Velocity Interpolation
        this.velocity.x += (target.x - this.velocity.x) * weight * dt;
        this.velocity.y += (target.y - this.velocity.y) * weight * dt;

        // Snap to zero: Prevents infinite micro-movements
        snapToZero(this.velocity, this.VELOCITY_THRESHOLD);

        // Knockback decay
        if (Math.abs(this.externalForce.x) > 0 || Math.abs(this.externalForce.y) > 0) {
            this.externalForce.x *= 1 - (this.friction * dt);
            this.externalForce.y *= 1 - (this.friction * dt);

            snapToZero(this.externalForce, 0.2);
        }

        // Final position update
        this.x += (this.velocity.x + this.externalForce.x) * dt;
        this.y += (this.velocity.y + this.externalForce.y) * dt;

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

    public performAttack(enemies: Entity[]): void {
        if (!this.isAttacking) this.hitEnemies.clear();
        if (!this.input.isAttacking || this.isAttacking) return;

        this.isAttacking = true;
        this.playAnimation('hit', false);

        const mag = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2) || 1;
        const dirX = this.velocity.x / mag;
        const dirY = this.velocity.y / mag;

        const attackX = this.x + (dirX * this.ATK_OFFSET);
        const attackY = this.y + (dirY * this.ATK_OFFSET);

        const attackCircle = {
            x: attackX,
            y: attackY,
            radius: this.ATK_RADIUS
        };

        enemies.forEach(enemy => {
            if (!this.hitEnemies.has(enemy) && Collision.checkCircle(attackCircle, enemy.getCollisionCircle())) {
                enemy.takeDamage(this.stats['atk'], this);
                this.hitEnemies.add(enemy);
            }
        });

        // this.debugGraphic.clear();
        // this.debugGraphic.setStrokeStyle({ width: 2, color: 0x00ff00 })
        //     .circle(dirX * this.ATK_OFFSET, dirY * this.ATK_OFFSET, this.ATK_RADIUS).stroke();

        this.sprite.onComplete = () => {
            this.isAttacking = false;
            this.playAnimation('idle');
        };
    }

    public getPlayerSummary() {
        return `
            (location) x: ${this.x.toFixed(2)} | y: ${this.y.toFixed(2)}<br>
            (velocity) x: ${this.velocity.x.toFixed(2)} | y: ${this.velocity.y.toFixed(2)}<br>
            (dimensions) w: ${this.width} | h: ${this.height}<br>
            state: ${this.state}<br>
            isAttacking: ${this.isAttacking}<br>
            health: ${this.stats['hp']}<br>
            friction: ${this.friction}<br>
            (force) x: ${this.externalForce.x.toFixed(2)} | y: ${this.externalForce.y.toFixed(2)}<br>
        `;
    }
}
