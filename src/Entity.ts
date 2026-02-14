import { AnimatedSprite, Container, Graphics, Texture } from "pixi.js";
import type { IEntityStats, IRectangle } from "./types";

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

    private readonly IFRAME_DURATION: number = 10;
    private readonly SPRITE_SCALE: number = 4;

    protected debugGraphic: Graphics;
    protected animations: AnimationMap;
    protected hitBox: { width: number, height: number } = { width: 0, height: 0 };

    constructor(animations: AnimationMap, stats: IEntityStats) {
        super();
        this.animations = animations;
        this.stats = stats;

        this.debugGraphic = new Graphics();
        this.sprite = new AnimatedSprite(this.animations['idle']);

        this.sprite.scale.set(this.SPRITE_SCALE);
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;

        this.hitBox = { width: this.sprite.width, height: this.sprite.height };

        this.addChild(this.sprite);
        this.addChild(this.debugGraphic);
        this.sprite.play();
    }

    /**
     * Draws hitbox of entity base on the size and scale of sprite.
     * @param color - The hex color used to fill the debug rectangle.
     */
    public drawHitbox(color: number = 0xff0000) {
        this.debugGraphic.clear();

        const width = this.sprite.width * this.SPRITE_SCALE / 2;
        const height = this.sprite.height * this.SPRITE_SCALE / 2;

        this.debugGraphic.rect(-width / 2, -height / 2, width, height)
            .fill({ color: color, alpha: 0.5 });
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
     * Applies damage and triggers invulnerability frames.
     * @param amount - The amount of HP to deduct.
     */
    public takeDamage(amount: number): void {
        if (this.damageCooldown > 0) return;

        this.stats['hp'] -= amount;
        this.damageCooldown = this.IFRAME_DURATION;
        this.sprite.tint = 0xff0000;

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