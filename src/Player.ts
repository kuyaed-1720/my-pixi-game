import * as PIXI from 'pixi.js';

export class Player {
    public sprite: PIXI.Sprite;
    private speed: number = 5;
    private keys: Record<string, boolean> ={};

    constructor(texture: PIXI.Texture, startX: number, startY: number) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(4);
        this.sprite.anchor.set(0.5);
        this.sprite.x = startX;
        this.sprite.y = startY;

        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    public update(deltaTime: number) {
        this.sprite.x = Math.round(this.sprite.x);
        this.sprite.y = Math.round(this.sprite.y);
        const moveAmount = this.speed * deltaTime;

        if (this.keys['KeyW']) this.sprite.y -= moveAmount;
        if (this.keys['KeyS']) this.sprite.y += moveAmount;
        if (this.keys['KeyA']) {
            this.sprite.x -= moveAmount;
            this.sprite.scale.x = -4;
        }
        if (this.keys['KeyD']) {
            this.sprite.x += moveAmount;
            this.sprite.scale.x = 4;
        }
    }
}