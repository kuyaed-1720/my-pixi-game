import * as PIXI from 'pixi.js';

export class Collectible {
    public sprite: PIXI.Sprite;
    public id: string;
    public isCollected: boolean = false;

    constructor(texture: PIXI.Texture, x: number, y: number, id: string) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(4);
        this.id = id;
    }

    public collect() {
        this.isCollected = true;
        this.sprite.visible = false;
        console.log(`${this.id} was picked up!`);
    }
}