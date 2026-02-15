import { AnimatedSprite, Container, Graphics, Texture } from "pixi.js";
import type { ICircle, IEntityStats, IRectangle, IVector2D } from "./types";

export type AnimationMap = { [key: string]: Texture[] };

/**
 * Base class for all game objects with physics and animations.
 * Handles hitboxes, health, and damage cooldowns.
 */
export class Entity extends Container {
    public isAttacking: boolean = false;
    public isDestroyed: boolean = false;
    public damageCooldown: number = 0;
    public state: string = 'idle';

    public sprite: AnimatedSprite;
    public stats: IEntityStats;

    private readonly IFRAME_DURATION: number = 60;
    private readonly SPRITE_SCALE: number = 4;

    protected debugGraphic: Graphics;
    protected animations: AnimationMap;
    protected hitBox: { width: number, height: number } = { width: 0, height: 0 };
    protected externalForce: IVector2D = { x: 0, y: 0 };
    protected friction: number = 1.5

    constructor(animations: AnimationMap, stats: IEntityStats) {
        super();
        this.animations = animations;
        this.stats = stats;

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
        if (this.damageCooldown > 0) {
            this.damageCooldown -= dt;

            if (this.damageCooldown <= 0) {
                this.sprite.tint = 0xffffff;
                this.damageCooldown = 0;
            }
        }

        if (this.debugGraphic.visible) {
            this.drawHitbox();
        }
    }

    /**
     * Draws hitbox of entity base on the size and scale of sprite.
     * @param color - The hex color used to fill the debug rectangle.
     */
    public drawHitbox(color: number = 0xff0000): void {
        this.debugGraphic.clear();

        const width = this.hitBox.width;
        const height = this.hitBox.height;
        const cornerRadius = Math.min(width, height) / 2;

        this.debugGraphic
            .roundRect(-width / 2, -height / 2, width, height, cornerRadius)
            .fill({ color, alpha: 0.5 });
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
     * @param sourcePos - The position of the attacker to calculate push direction.
     * @param power - How far the entity is thrown back.
     */
    public takeDamage(amount: number, sourcePos?: IVector2D, power: number = 300): void {
        if (this.damageCooldown > 0 || this.isDestroyed) return;

        this.stats['hp'] -= amount;
        this.damageCooldown = this.IFRAME_DURATION;
        this.sprite.tint = 0xff0000;

        if (sourcePos) {
            const dx = this.x - sourcePos.x;
            const dy = this.y - sourcePos.y;
            const dist = Math.sqrt(dx ** 2 + dy ** 2) || 1;

            this.externalForce.x = (dx / dist) * power;
            this.externalForce.y = (dy / dist) * power;
        }

        if (this.stats['hp'] <= 0) this.onDeath();
    }

    /**
     * Triggers the death sequence of the entity.
     * Sets the destruction flag and cleans up visual assets after a short delay.
     */
    public onDeath(): void {
        this.isDestroyed = true;
        setTimeout(() => {
            this.sprite.destroy();
        }, 100);
    }
}