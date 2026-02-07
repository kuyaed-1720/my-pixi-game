import * as PIXI from 'pixi.js';

export class Collectible {
    public sprite: PIXI.AnimatedSprite;
    private animations: { idle: PIXI.Texture[]; };
    public id: string;
    public isCollected: boolean = false;

    constructor(idleFrames: PIXI.Texture[], x: number, y: number, id: string) {
        this.animations = { idle: idleFrames };
        this.sprite = new PIXI.AnimatedSprite(this.animations.idle);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.set(4);
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
        this.id = id;
    }

    public collect() {
        this.isCollected = true;
        this.sprite.visible = false;
        console.log(`${this.id} was picked up!`);
    }
}