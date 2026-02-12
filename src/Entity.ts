import { AnimatedSprite, Container, Graphics, Texture } from "pixi.js";
import type { IEntityStats } from "./types/entityStats";

export type AnimationMap = { [key: string]: Texture[] };

export class Entity extends Container {
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
        this.sprite.addChild(this.debugGraphic);
        this.addChild(this.sprite);
        this.sprite.play();
    }

    public drawHitbox(color: number = 0xff0000) {
        this.debugGraphic.clear();
        this.debugGraphic.fill(color, 0.5);
        const w = this.sprite.width * 0.4;
        const h = this.sprite.height * 0.6;

        this.debugGraphic.rect(-1 / 2, -h / 2, w, h);
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

    public getBounds() {
        return this.sprite.getBounds();
    }

    public takeDamage(amount: number) {
        this.stats['hp'] -= amount;
        if (this.stats['hp'] <= 0) this.onDeath();
    }

    public onDeath() {
        this.isDestroyed = true;
        setTimeout(() => {
            this.sprite.destroy();
        }, 100);
    }
}