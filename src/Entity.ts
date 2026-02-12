import { AnimatedSprite, Container, Texture } from "pixi.js";
import type { IEntityStats } from "./types/entityStats";

export type AnimationMap = { [key: string]: Texture[] };

export class Entity extends Container {
    protected animations: AnimationMap;
    public sprite: AnimatedSprite;
    public stats: IEntityStats;
    public state: string = 'idle';

    public isAttacking: boolean = false;
    public isDestroyed: boolean = false;

    constructor(animations: AnimationMap, stats: IEntityStats) {
        super();
        this.animations = animations;
        this.stats = stats;
        this.sprite = new AnimatedSprite(this.animations['idle']);
        this.sprite.scale.set(4);
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
        this.addChild(this.sprite);
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