import { AnimatedSprite, Container, Graphics, Texture } from "pixi.js";
import type { ICircle, IEntityStats, IRectangle, IVector2D, EntityType } from "./types";

export type AnimationMap = { [key: string]: Texture[] };

/**
 * Base class for all game objects with physics and animations.
 * Handles hitboxes, health, and damage cooldowns.
 */
export class Entity extends Container {
    public static deadQueue: Entity[] = [];
    public entityType: EntityType;
    public isAttacking: boolean = false;
    public isDestroyed: boolean = false;
    private damageCooldown: number = 0;
    public state: string = 'idle';

    public sprite: AnimatedSprite;
    public stats: IEntityStats;

    // private readonly IFRAME_DURATION: number = 60;
    private readonly SPRITE_SCALE: number = 4;

    protected debugGraphic: Graphics;
    protected animations: AnimationMap;
    protected hitBox: { width: number, height: number } = { width: 0, height: 0 };
    protected externalForce: IVector2D = { x: 0, y: 0 };
    protected friction: number = 1.5

    constructor(type: EntityType, animations: AnimationMap, stats: Partial<IEntityStats>) {
        super();
        this.entityType = type;
        this.animations = animations;
        const defaultStats = {
            hp: 100,
            maxHp: 100,
            atk: 10,
            speed: 10,
            acceleration: 0,
            deceleration: 0,
            weight: 0.2,
            damageCooldown: 0.2
        };

        this.stats = { ...defaultStats, ...stats };

        this.debugGraphic = new Graphics();
        this.sprite = new AnimatedSprite(this.animations['idle']);

        this.sprite.scale.set(this.SPRITE_SCALE);
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;

        this.hitBox = { width: this.sprite.width * 0.5, height: this.sprite.height * 0.6 };

        this.addChild(this.sprite);
        this.addChild(this.debugGraphic);
        this.sprite.play();
    }

    /**
     * Process the entity's logic for a single frame.
     * Includes damage cooldown management and visual updates.
     * @param dt - The delta time from the game ticker.
     */
    public update(dt: number): void {
        if (this.isDestroyed) return;
        this.zIndex = this.y;
        if (this.damageCooldown > 0) {
            this.damageCooldown -= dt;

            if (this.damageCooldown <= 0) {
                this.sprite.tint = 0xffffff;
                this.damageCooldown = 0;
            }
        }

        // if (this.debugGraphic.visible && !this.isDestroyed) {
        //     this.drawCollisionCircle();
        // }
    }

    /**
     * Returns the global collision rectangle for this entity.
     * Uses centered-pivot logic to calculate bounds.
     */
    public getHitbox(): IRectangle {
        return {
            x: this.x - this.hitBox.width / 2,
            y: this.y - this.hitBox.height / 2,
            width: this.hitBox.width,
            height: this.hitBox.height
        };
    }

    /**
     * Draw collision circle of entity
     * @param color - The hex color used to fill the debug circle.
     */
    public drawCollisionCircle(color: number = 0x00ff00): void {
        const cx = this.sprite.x;
        const cy = this.sprite.y;
        const rad = this.getCollisionCircle().radius;
        this.debugGraphic.setStrokeStyle({ width: 2, color: color })
            .circle(cx, cy, rad).stroke();
    }

    /**
     * Returns a circular representation of the entity.
     */
    public getCollisionCircle(): ICircle {
        return {
            x: this.x,
            y: this.y,
            radius: (this.hitBox.width / 2)
        };
    }

    /**
     * Plays a specific animation and updates the entity's state.
     * @param name - The key of the animation to play.
     * @param loop - Wether the animation should repeat. Set on true by default.
     */
    public playAnimation(name: string, loop: boolean = true): void {
        if (this.state === name) return;

        const newTextures = this.animations[name];
        if (newTextures) {
            this.sprite.textures = newTextures;
            this.sprite.loop = loop;
            this.sprite.gotoAndPlay(0);
            this.state = name;
        }
    }

    /**
     * Applies damage, a physical shove to entity, and triggers invulnerability frames.
     * @param amount - The amount of HP to deduct.
     * @param source - The entity attacking
     */
    public takeDamage(amount: number, source?: Entity): void {
        if (this.damageCooldown > 0 || this.isDestroyed) return;

        this.stats['hp'] -= amount;
        this.damageCooldown = this.stats.damageCooldown;
        this.sprite.tint = 0xff0000;

        if (source) {
            const dx = this.x - source.x;
            const dy = this.y - source.y;
            const dist = Math.sqrt(dx ** 2 + dy ** 2) || 1;

            // Scale knockback power base on attack
            const powerScaling = (source.stats['atk'] * 10);

            this.externalForce.x = (dx / dist) * powerScaling;
            this.externalForce.y = (dy / dist) * powerScaling;
        }

        if (this.stats.hp <= 0) this.onDeath();
    }

    /**
     * Triggers the death sequence of the entity.
     * Sets the destruction flag and cleans up visual assets after a short delay.
     */
    public onDeath(): void {
        this.isDestroyed = true;
        if (this.entityType === 'enemy') {
            Entity.deadQueue.push(this);
        }
        this.destroy({ children: true, texture: false });
    }
}