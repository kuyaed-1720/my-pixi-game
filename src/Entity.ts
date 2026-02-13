import { AnimatedSprite, Container, Graphics, Texture } from "pixi.js";
import type { IEntityStats } from "./types/entityStats";
import type { IRectangle } from "./Collision";

export type AnimationMap = { [key: string]: Texture[] };

export class Entity extends Container {
    public damageCooldown: number = 0;
    private readonly IFRAME_DURATION: number = 60;
    protected debugGraphic: Graphics;
    protected animations: AnimationMap;
    public sprite: AnimatedSprite;
    public stats: IEntityStats;
    public state: string = 'idle';

    public isAttacking: boolean = false;
    public isDestroyed: boolean = false;

    constructor(animations: AnimationMap, stats: IEntityStats) {
        super();
        this.debugGraphic = new Graphics();
        this.animations = animations;
        this.stats = stats;
        this.sprite = new AnimatedSprite(this.animations['idle']);
        this.sprite.scale.set(4);
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;
        this.addChild(this.sprite);
        this.addChild(this.debugGraphic);
        this.sprite.play();
    }

    public drawHitbox(color: number = 0xff0000, size: number) {
        this.debugGraphic.clear();
        const scale = 4;

        const localWidth = size * scale / 2;
        const localHeight = size * scale / 2;

        this.debugGraphic.rect(-localWidth / 2, -localHeight / 2, localWidth, localHeight)
            .fill({ color: color, alpha: 0.5 });
    }

    /**
     * Get the dimensions of the hitbox
     * @param sprite 
     * @returns Rectangle
     */
    public getHitbox(width: number = 16, height: number = 16): IRectangle {
        return {
            x: this.x - width / 2,
            y: this.y - height / 2,
            width: width,
            height: height
        };
    }

    public playAnimation(name: string, loop: boolean = true) {
        if (this.state === name) return;

        const newTextures = this.animations[name];
        if (newTextures) {
            this.sprite.textures = newTextures;
            this.sprite.loop = loop;
            this.sprite.gotoAndPlay(0);
            this.state = name;
        }
    }

    public takeDamage(amount: number) {
        if (this.damageCooldown > 0) return;

        this.stats['hp'] -= amount;
        this.damageCooldown = this.IFRAME_DURATION;
        this.sprite.tint = 0xff0000;

        if (this.stats['hp'] <= 0) this.onDeath();
    }

    public onDeath() {
        this.isDestroyed = true;
        setTimeout(() => {
            this.sprite.destroy();
        }, 100);
    }
}