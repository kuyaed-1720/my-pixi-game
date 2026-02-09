import * as PIXI from 'pixi.js';

export class Entity {
    public sprite: PIXI.AnimatedSprite;
    public health: number = 100;
    public id: string;
    public isDestroyed: boolean = false;

    constructor(texture: PIXI.AnimatedSprite, health: number, id: string) {
        this.sprite = texture;
        this.health = health;
        this.id = id;
    }

    public takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) this.onDeath();
    }

    public onDeath() {
        this.isDestroyed = true;
        this.sprite.destroy();
    }
}